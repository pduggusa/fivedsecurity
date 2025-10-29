/**
 * Judge Dredd Agent - Git Analyzer
 * Analyzes git repository state and changes
 */

const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class GitAnalyzer {
  /**
   * Get uncommitted changes (both staged and unstaged)
   */
  async getUncommittedChanges() {
    try {
      // Get unstaged changes
      const { stdout: unstaged } = await execAsync('git diff');

      // Get staged changes
      const { stdout: staged } = await execAsync('git diff --cached');

      return {
        unstaged,
        staged,
        combined: unstaged + '\n' + staged,
        hasChanges: !!(unstaged.trim() || staged.trim())
      };
    } catch (error) {
      console.error('❌ Failed to get uncommitted changes:', error.message);
      return { unstaged: '', staged: '', combined: '', hasChanges: false };
    }
  }

  /**
   * Get list of modified files
   */
  async getModifiedFiles() {
    try {
      const { stdout } = await execAsync('git status --porcelain');

      return stdout.split('\n')
        .filter(Boolean)
        .map(line => {
          const status = line.substring(0, 2).trim();
          const file = line.substring(3);
          return { status, file };
        });
    } catch (error) {
      console.error('❌ Failed to get modified files:', error.message);
      return [];
    }
  }

  /**
   * Get current branch name
   */
  async getCurrentBranch() {
    try {
      const { stdout } = await execAsync('git rev-parse --abbrev-ref HEAD');
      return stdout.trim();
    } catch (error) {
      return 'unknown';
    }
  }

  /**
   * Get recent commits
   */
  async getRecentCommits(count = 10) {
    try {
      const { stdout } = await execAsync(
        `git log -${count} --pretty=format:'%H|%s|%b'`
      );

      return stdout.split('\n').filter(Boolean).map(line => {
        const [hash, subject, body] = line.split('|');
        return { hash, subject, body: body || '' };
      });
    } catch (error) {
      return [];
    }
  }

  /**
   * Get diff for specific commit
   */
  async getCommitDiff(commitHash) {
    try {
      const { stdout } = await execAsync(`git show ${commitHash}`);
      return stdout;
    } catch (error) {
      return '';
    }
  }

  /**
   * Check if changes involve security controls
   * (Issue #43 pattern detection)
   */
  async hasSecurityControlChanges() {
    try {
      const modifiedFiles = await this.getModifiedFiles();

      // Security-sensitive files
      const securityFiles = [
        'scripts/judge-dredd.js',
        '.github/workflows/deploy.yml',
        '.github/workflows/sbom-security-pipeline.yml',
        '.github/workflows/azure-governance-check.yml',
        'CLAUDE.md'
      ];

      const securityChanges = modifiedFiles.filter(({ file }) =>
        securityFiles.some(secFile => file.includes(secFile))
      );

      if (securityChanges.length > 0) {
        // Get diff to check for removals
        const { combined } = await this.getUncommittedChanges();

        // Check for security control removal patterns
        const removalPatterns = [
          /^-.*judge-dredd/im,
          /^-.*security.*pipeline/im,
          /^-.*sbom/im,
          /^-.*kev/im,
          /^-.*haveibeenpwned/im
        ];

        const hasRemoval = removalPatterns.some(pattern => pattern.test(combined));

        return {
          detected: true,
          files: securityChanges,
          hasRemoval
        };
      }

      return { detected: false, files: [], hasRemoval: false };
    } catch (error) {
      return { detected: false, files: [], hasRemoval: false };
    }
  }

  /**
   * Check if diff contains specific pattern
   */
  async containsPattern(pattern) {
    const { combined } = await this.getUncommittedChanges();
    return pattern.test(combined);
  }
}

module.exports = GitAnalyzer;
