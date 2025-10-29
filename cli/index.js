#!/usr/bin/env node

/**
 * Judge Dredd Agent - CLI Interface
 * "I AM THE LAW - Now in real-time."
 */

const { program } = require('commander');
const chalk = require('chalk');
const GitAnalyzer = require('./git-analyzer');
const PatternDetector = require('./pattern-detector');
const FourDimensionalVerifier = require('./4d-verifier');
const centralBrainSender = require('./central-brain-sender');

program
  .name('dredd')
  .description('Judge Dredd Autonomous Agent - Real-time code governance')
  .version('1.0.0');

/**
 * dredd review - Review uncommitted changes
 */
program
  .command('review [files...]')
  .description('Review uncommitted changes for violations')
  .option('--analytics-endpoint <url>', 'Central Brain analytics endpoint')
  .option('--analytics-api-key <key>', 'Central Brain API key')
  .action(async (files, options) => {
    console.log(chalk.bold.blue('\n👨‍⚖️ Judge Dredd: Reviewing changes...\n'));

    // Configure Central Brain analytics if provided
    if (options.analyticsEndpoint && options.analyticsApiKey) {
      centralBrainSender.configure({
        endpoint: options.analyticsEndpoint,
        apiKey: options.analyticsApiKey
      });
    }

    const git = new GitAnalyzer();
    const detector = new PatternDetector();

    try {
      // Load incident patterns
      await detector.loadIncidentPatterns();

      // Get uncommitted changes
      const changes = await git.getUncommittedChanges();

      if (!changes.hasChanges) {
        console.log(chalk.green('✅ No uncommitted changes to review\n'));
        process.exit(0);
      }

      // Get modified files for context
      const modifiedFiles = await git.getModifiedFiles();
      console.log(chalk.cyan(`Analyzing ${modifiedFiles.length} modified file(s)...\n`));

      // Analyze changes
      const results = await detector.analyze(changes.combined, {
        source: 'cli-review',
        timestamp: new Date().toISOString(),
        files: modifiedFiles.map(f => f.file)
      });

      // Send to Central Brain (async - don't wait)
      const context = {
        source: 'cli-review',
        timestamp: new Date().toISOString(),
        files: modifiedFiles.map(f => f.file)
      };
      centralBrainSender.sendViolations(results.violations, context).catch(err => {
        // Fail silently - don't break CLI
      });
      centralBrainSender.sendCommendations(results.commendations, context).catch(err => {
        // Fail silently - don't break CLI
      });

      // Display results
      displayResults(results);

      // Exit code
      process.exit(results.hasCritical ? 1 : 0);

    } catch (error) {
      console.error(chalk.red(`❌ Review failed: ${error.message}`));
      process.exit(1);
    }
  });

/**
 * dredd ask - Ask Judge Dredd a question
 */
program
  .command('ask <question>')
  .description('Ask Judge Dredd about THE LAW')
  .action(async (question) => {
    console.log(chalk.bold.blue(`\n👨‍⚖️ Judge Dredd: "${question}"\n`));

    const q = question.toLowerCase();

    if (q.includes('nginx')) {
      console.log(chalk.yellow('📜 THE LAW: NO NGINX\n'));
      console.log('Background (Issue #32):');
      console.log('  Developer attempted to add nginx for static file serving.');
      console.log('  Result: Violated "Born Without Sin" principle.\n');
      console.log(chalk.green('✅ CORRECT APPROACH:'));
      console.log('  app.use(express.static(\'public\'));\n');
      console.log('Related laws:');
      console.log('  - DEBIAN ONLY (never Alpine)');
      console.log('  - AMD64 PLATFORM (never ARM64)');
      console.log('  - SIMPLE ARCHITECTURE (no enterprise sprawl)\n');
    } else if (q.includes('security') || q.includes('remove')) {
      console.log(chalk.red('🚨 CRITICAL: DO NOT REMOVE SECURITY CONTROLS\n'));
      console.log('Background (Issue #43):');
      console.log('  Claude Sonnet 4.5 disabled security controls for "entropy elimination".');
      console.log('  Result: Patent #10 exposed for 1h47m.');
      console.log(chalk.red('  Financial damage: $2.5M-$6M\n'));
      console.log(chalk.yellow('📜 THE LAW:'));
      console.log('  Security controls exist because of previous failures.');
      console.log('  Removing them for "simplicity" invites catastrophe.\n');
      console.log(chalk.green('✅ ALWAYS:'));
      console.log('  1. Ask Patrick why security exists before modifying');
      console.log('  2. Create GitHub issue documenting reason for change');
      console.log('  3. Get explicit approval\n');
    } else if (q.includes('alpine')) {
      console.log(chalk.yellow('📜 THE LAW: DEBIAN ONLY, NEVER ALPINE\n'));
      console.log('Why Debian:');
      console.log('  - Glibc compatibility (Alpine uses musl, breaks native modules)');
      console.log('  - Battle-tested in production');
      console.log('  - Works with all npm packages\n');
      console.log('Why NOT Alpine:');
      console.log('  - "Smaller images" is a lie when you add build dependencies');
      console.log('  - Breaks native Node modules (sharp, puppeteer, etc.)');
      console.log('  - Not worth the 50MB savings\n');
      console.log(chalk.green('✅ USE: node:20-slim (Debian-based)\n'));
    } else if (q.includes('test') || q.includes('local')) {
      console.log(chalk.yellow('📜 THE LAW: ALWAYS TEST LOCALLY\n'));
      console.log('Background (Issue #41):');
      console.log('  Deployed without local testing, broke production for 3 hours.\n');
      console.log(chalk.green('✅ ALWAYS:'));
      console.log('  1. Test locally before committing');
      console.log('  2. Document test results in commit message');
      console.log('  3. Show curl output or screenshots');
      console.log('  4. Verify production after deploy\n');
      console.log('Example commit:');
      console.log(chalk.cyan('  "Fix: Updated feature'));
      console.log(chalk.cyan('  '));
      console.log(chalk.cyan('  Local test:'));
      console.log(chalk.cyan('  $ npm start'));
      console.log(chalk.cyan('  ✅ Server started'));
      console.log(chalk.cyan('  $ curl http://localhost:3000/health'));
      console.log(chalk.cyan('  {\\"status\\":\\"healthy\\"}"'));
      console.log();
    } else if (q.includes('workflow') || q.includes('logs') || q.includes('github actions')) {
      console.log(chalk.red('🚨 THE LAW: CHECK LOGS FIRST, NOT THEORY\n'));
      console.log('Background (Issue #44):');
      console.log('  Workflow failed 5 days, wasted 30min theorizing about RBAC.');
      console.log('  User corrected: "workflow runs have great data on failures"');
      console.log(chalk.red('  Time wasted: 30min theory vs 10min checking logs\n'));
      console.log(chalk.yellow('📜 THE LAW:'));
      console.log('  BEFORE suggesting fixes, ALWAYS check actual logs first.\n');
      console.log(chalk.green('✅ ALWAYS:'));
      console.log('  1. gh run list --workflow <name>.yml --status failure');
      console.log('  2. gh run view <run-id> --log-failed');
      console.log('  3. grep -i "error\\|fail" for actual errors');
      console.log('  4. Fix based on REAL errors, not theories\n');
      console.log('What went WRONG:');
      console.log(chalk.red('  - Theorized about service principal RBAC (no evidence)'));
      console.log(chalk.red('  - Proposed complex OAuth solutions (not needed)'));
      console.log(chalk.red('  - Made assumptions about auth methods\n'));
      console.log('What went RIGHT:');
      console.log(chalk.green('  - Checked logs (after user correction)'));
      console.log(chalk.green('  - Found 6 real errors in 10 minutes'));
      console.log(chalk.green('  - Fixed incrementally with evidence'));
      console.log(chalk.green('  - Simple solution (storage keys) worked\n'));
    } else if (q.includes('kev') || q.includes('exploit') || q.includes('vulnerability')) {
      console.log(chalk.red('🚨 THE LAW: KEV_ZERO_TOLERANCE\n'));
      console.log('Background (Issue #72):');
      console.log('  CISA KEV catalog lists vulnerabilities actively exploited in the wild.');
      console.log('  These are not theoretical - they are being weaponized RIGHT NOW.\n');
      console.log(chalk.yellow('📜 THE LAW:'));
      console.log('  Zero dependencies on CISA KEV catalog.');
      console.log('  Actively exploited vulnerabilities must be patched within 24 hours.\n');
      console.log(chalk.green('✅ ALWAYS:'));
      console.log('  1. Run: npm run security:kev-check');
      console.log('  2. If KEV match found, update dependency immediately');
      console.log('  3. If no update available, find alternative package');
      console.log('  4. Verify fix with npm run security:kev-check');
      console.log('  5. Document remediation in commit message\n');
      console.log('Financial Risk:');
      console.log(chalk.red('  - Data breach: $4.45M average (IBM 2023)'));
      console.log(chalk.red('  - Ransomware: $1.85M+ average (Sophos 2023)'));
      console.log(chalk.red('  - Total risk: $5M-$20M\n'));
      console.log('Daily KEV Scan:');
      console.log('  KEV catalog is updated daily by CISA.');
      console.log('  Run npm run security:kev-check daily or automate with cron.\n');
    } else if (q.includes('you awake') || q.includes('awake')) {
      console.log(chalk.green('👨‍⚖️ I AM THE LAW, and I am always awake.\n'));
      console.log('Judge Dredd Agent v1.1.0 - Operational');
      console.log(`Incidents loaded: 10 (KEV, Issue #44, #43, #41, #32, etc.)`);
      console.log('Enforcement mode: ACTIVE\n');
      console.log('Try:');
      console.log('  dredd review       - Review uncommitted changes');
      console.log('  dredd status       - Check compliance status');
      console.log('  dredd session-start - Pre-development check');
      console.log('  dredd ask <question> - Ask about THE LAW\n');
    } else {
      console.log('I can answer questions about:');
      console.log('  - "Why no nginx?"');
      console.log('  - "Can I remove security controls?"');
      console.log('  - "Why not Alpine?"');
      console.log('  - "Why test locally?"');
      console.log('  - "How to debug workflows?"');
      console.log('  - "What about KEV vulnerabilities?"');
      console.log('  - "you awake?" (status check)');
      console.log('\nFor other questions, consult CLAUDE.md or ask Patrick.\n');
    }
  });

/**
 * dredd status - Show current compliance status
 */
program
  .command('status')
  .description('Show current compliance status and trends')
  .action(async () => {
    console.log(chalk.bold.blue('\n👨‍⚖️ Judge Dredd: Compliance Status\n'));

    const git = new GitAnalyzer();

    try {
      const branch = await git.getCurrentBranch();
      const modifiedFiles = await git.getModifiedFiles();
      const securityCheck = await git.hasSecurityControlChanges();

      console.log(`Branch: ${chalk.cyan(branch)}`);
      console.log(`Modified files: ${chalk.yellow(modifiedFiles.length)}\n`);

      if (securityCheck.detected) {
        console.log(chalk.red('⚠️  WARNING: Security control changes detected'));
        console.log(chalk.red(`   Files: ${securityCheck.files.map(f => f.file).join(', ')}`));
        if (securityCheck.hasRemoval) {
          console.log(chalk.red('   🚨 CRITICAL: Security controls being removed\n'));
        } else {
          console.log();
        }
      } else {
        console.log(chalk.green('✅ No security control changes\n'));
      }

      if (modifiedFiles.length > 0) {
        console.log('Modified files:');
        modifiedFiles.forEach(({ status, file }) => {
          console.log(`  ${status} ${file}`);
        });
        console.log();
        console.log('Run ' + chalk.cyan('dredd review') + ' to check for violations.\n');
      } else {
        console.log(chalk.green('✅ Working tree clean\n'));
      }

    } catch (error) {
      console.error(chalk.red(`❌ Status check failed: ${error.message}`));
      process.exit(1);
    }
  });

/**
 * dredd session-start - Pre-development compliance check
 */
program
  .command('session-start')
  .description('Run compliance check before starting development')
  .option('--analytics-endpoint <url>', 'Central Brain analytics endpoint')
  .option('--analytics-api-key <key>', 'Central Brain API key')
  .action(async (options) => {
    console.log(chalk.bold.blue('\n👨‍⚖️ Judge Dredd: Session Start Check\n'));

    // Configure Central Brain analytics if provided
    if (options.analyticsEndpoint && options.analyticsApiKey) {
      centralBrainSender.configure({
        endpoint: options.analyticsEndpoint,
        apiKey: options.analyticsApiKey
      });
    }

    const git = new GitAnalyzer();
    const detector = new PatternDetector();

    try {
      // Load incident patterns
      await detector.loadIncidentPatterns();

      // Check recent commits
      console.log('Analyzing recent commits...');
      const commits = await git.getRecentCommits(5);

      let totalViolations = 0;

      for (const commit of commits) {
        const diff = await git.getCommitDiff(commit.hash);
        const results = await detector.analyze(diff, {
          commit: commit.hash.substring(0, 7),
          subject: commit.subject
        });

        totalViolations += results.violations.length;
      }

      // Check uncommitted changes
      const changes = await git.getUncommittedChanges();
      if (changes.hasChanges) {
        console.log('\nAnalyzing uncommitted changes...');
        const results = await detector.analyze(changes.combined);
        totalViolations += results.violations.length;

        // Send to Central Brain (async - don't wait)
        const context = {
          source: 'session-start',
          timestamp: new Date().toISOString()
        };
        centralBrainSender.sendViolations(results.violations, context).catch(err => {
          // Fail silently - don't break CLI
        });
        centralBrainSender.sendCommendations(results.commendations, context).catch(err => {
          // Fail silently - don't break CLI
        });

        displayResults(results);
      }

      if (totalViolations === 0) {
        console.log(chalk.green('\n✅ Session ready - No violations detected'));
        console.log(chalk.blue('👨‍⚖️ "THE LAW is upheld. Begin development."\n'));
      } else {
        console.log(chalk.red(`\n⚠️  ${totalViolations} violation(s) found`));
        console.log(chalk.yellow('Address these before continuing development.\n'));
      }

    } catch (error) {
      console.error(chalk.red(`❌ Session start check failed: ${error.message}`));
      process.exit(1);
    }
  });

/**
 * Helper: Display analysis results
 */
function displayResults(results) {
  if (!results.hasViolations && results.warnings.length === 0) {
    if (results.commendations.length > 0) {
      console.log(chalk.green('✅ COMMENDATIONS:\n'));
      results.commendations.forEach(c => {
        console.log(chalk.green(`   ✅ ${c.type}: ${c.message}`));
      });
      console.log();
    }
    console.log(chalk.green('✅ No violations detected - THE LAW is upheld\n'));
    return;
  }

  // Display violations
  if (results.violations.length > 0) {
    console.log(chalk.red.bold('🚨 VIOLATIONS DETECTED\n'));

    results.violations.forEach((v, i) => {
      console.log(chalk.red(`${i + 1}. [${v.severity}] ${v.message}`));
      if (v.incident) {
        console.log(chalk.yellow(`   Incident: ${v.incident}`));
      }
      console.log(`   ${v.details}`);
      if (v.financialRisk) {
        const risk = `$${(v.financialRisk.min / 1000000).toFixed(1)}M-$${(v.financialRisk.max / 1000000).toFixed(1)}M`;
        console.log(chalk.red.bold(`   💰 Financial Risk: ${risk} ${v.financialRisk.proven ? '(proven)' : '(estimated)'}`));
      }
      console.log(chalk.blue(`   📜 The Law: ${v.law}`));
      if (v.suggestedFix) {
        console.log(chalk.green(`\n   🛠️  Suggested Fix:\n   ${v.suggestedFix.split('\n').join('\n   ')}`));
      }
      console.log();
    });
  }

  // Display warnings
  if (results.warnings.length > 0) {
    console.log(chalk.yellow.bold('⚠️  WARNINGS\n'));

    results.warnings.forEach((w, i) => {
      console.log(chalk.yellow(`${i + 1}. [${w.severity}] ${w.message}`));
      console.log(`   ${w.details}`);
      if (w.incident) {
        console.log(chalk.yellow(`   Incident: ${w.incident}`));
      }
      if (w.suggestedFix) {
        console.log(chalk.green(`   🛠️  Suggested Fix:\n   ${w.suggestedFix.split('\n').join('\n   ')}`));
      }
      console.log();
    });
  }

  // Display commendations if any
  if (results.commendations.length > 0) {
    console.log(chalk.green('✅ COMMENDATIONS:\n'));
    results.commendations.forEach(c => {
      console.log(chalk.green(`   ✅ ${c.type}: ${c.message}`));
    });
    console.log();
  }
}

/**
 * dredd 4d - Run 4D truth verification
 */
program
  .command('4d')
  .description('Run 4D truth verification (commits + corpus + evidence + time)')
  .option('-v, --verbose', 'Verbose output')
  .action(async (options) => {
    console.log(chalk.bold.blue('\n👨‍⚖️ Judge Dredd: 4D Mode Activated\n'));

    const verifier = new FourDimensionalVerifier({
      verbose: options.verbose || false
    });

    try {
      const result = await verifier.verify();

      // Exit with appropriate code
      if (result.status === 'GODEL_COMPLIANT') {
        console.log(chalk.green.bold('✅ 4D VERIFICATION COMPLETE - SYSTEM CONSISTENT\n'));
        process.exit(0);
      } else if (result.status === 'DRIFT_DETECTED') {
        console.log(chalk.yellow.bold('⚠️  4D DRIFT DETECTED - INVESTIGATE\n'));
        process.exit(1);
      } else {
        console.log(chalk.red.bold('❌ 4D VERIFICATION FAILED - INCONSISTENT\n'));
        process.exit(2);
      }
    } catch (error) {
      console.error(chalk.red(`\n❌ 4D verification error: ${error.message}\n`));
      process.exit(3);
    }
  });

program.parse();
