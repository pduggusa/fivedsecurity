/**
 * Judge Dredd Agent - Pattern Detector
 * Detects violations of THE LAW with incident-based learning
 */

const fs = require('fs').promises;
const path = require('path');
const config = require('./config');

class PatternDetector {
  constructor() {
    this.violations = [];
    this.warnings = [];
    this.commendations = [];
    this.incidents = null;
  }

  /**
   * Load incident patterns - LIVE DATA from Central Brain first, then local fallback
   */
  async loadIncidentPatterns() {
    // Try Central Brain first (LIVE DATA LAW)
    const centralBrain = require('../analytics/CentralBrainClient');
    if (centralBrain.enabled) {
      try {
        const livePatterns = await centralBrain.fetchIncidentPatterns();
        if (Object.keys(livePatterns).length > 0) {
          this.incidents = livePatterns;
          console.log(`🧠 Loaded ${Object.keys(this.incidents).length} incident patterns from Central Brain (LIVE)`);
          return true;
        }
      } catch (error) {
        console.warn('⚠️  Central Brain fetch failed, falling back to local patterns');
      }
    }

    // Fallback: Load from local incidents/ directory
    try {
      const incidentsDir = config.paths.incidents;
      const files = await fs.readdir(incidentsDir);

      this.incidents = {};

      for (const file of files) {
        if (file.endsWith('.json')) {
          const content = await fs.readFile(path.join(incidentsDir, file), 'utf8');
          const incident = JSON.parse(content);
          this.incidents[incident.id] = incident;
        }
      }

      console.log(`🧠 Loaded ${Object.keys(this.incidents).length} incident patterns (local fallback)`);
      return true;
    } catch (error) {
      console.error('⚠️  Failed to load incident patterns:', error.message);
      this.incidents = {};
      return false;
    }
  }

  /**
   * Analyze text/diff for violations
   */
  async analyze(text, context = {}) {
    this.violations = [];
    this.warnings = [];
    this.commendations = [];

    // Ensure incidents are loaded
    if (!this.incidents) {
      await this.loadIncidentPatterns();
    }

    // Exception: Documentation about violations is allowed
    const isDocumentation = this.isDocumentation(text);
    if (isDocumentation) {
      this.commendations.push({
        type: 'DOCUMENTATION',
        message: 'Documenting THE LAW - teaching what to avoid'
      });
      return this.getResults();
    }

    // Exception: Investor materials describing costs
    const isInvestorMaterials = this.isInvestorMaterials(text);
    if (isInvestorMaterials) {
      this.commendations.push({
        type: 'INVESTOR_MATERIALS',
        message: 'Investor materials - describing market opportunity'
      });
    }

    // Check for incident patterns
    await this.checkIssue43Pattern(text, context);
    await this.checkIssue32Pattern(text, context);
    await this.checkIssue41Pattern(text, context);
    await this.checkDaymanNightmanTheme(text, context);
    await this.checkAlpineBaseImagePattern(text, context);
    await this.checkDockerAmd64PlatformPattern(text, context);
    await this.checkLiveDataLawPattern(text, context);
    await this.checkGitDirectoryBreakout(text, context);

    // Check other violations
    await this.checkEnterpriseSprawl(text, context, isInvestorMaterials);
    await this.checkHardcodedData(text, context);
    await this.checkCostEfficiency(text, context, isInvestorMaterials);

    // Check for commendations
    await this.checkCommendations(text);

    return this.getResults();
  }

  /**
   * Issue #43: Security Control Removal (CRITICAL)
   */
  async checkIssue43Pattern(text, context) {
    const incident = this.incidents['issue-43'];
    if (!incident) return;

    const patterns = incident.pattern.detection.textPatterns.map(p => new RegExp(p, 'i'));

    for (const pattern of patterns) {
      if (pattern.test(text)) {
        this.violations.push({
          type: 'SECURITY_CONTROL_REMOVAL',
          severity: 'CRITICAL',
          incident: 'Issue #43',
          message: '🚨 SECURITY CONTROL REMOVAL DETECTED',
          details: `You are attempting to remove or modify security controls.
This is the EXACT pattern that caused Issue #43.`,
          financialRisk: {
            min: incident.financialImpact.min,
            max: incident.financialImpact.max,
            proven: incident.financialImpact.proven
          },
          law: 'Security controls exist because of previous failures. DO NOT REMOVE.',
          suggestedFix: `1. STOP immediately
2. Ask Patrick why this security control exists
3. Create a GitHub issue documenting your reason
4. Get explicit approval before proceeding
5. NEVER remove security controls for "simplicity"`,
          context
        });
        break;
      }
    }
  }

  /**
   * Issue #32: NO NGINX Law (HIGH)
   */
  async checkIssue32Pattern(text, context) {
    const incident = this.incidents['issue-32'];
    if (!incident) return;

    const patterns = incident.pattern.detection.textPatterns.map(p => new RegExp(p, 'i'));

    for (const pattern of patterns) {
      if (pattern.test(text)) {
        this.violations.push({
          type: 'NO_NGINX_LAW',
          severity: 'HIGH',
          incident: 'Issue #32',
          message: '⚠️  NO NGINX LAW VIOLATED',
          details: 'You are attempting to add nginx. We use Node.js + Express for everything.',
          law: 'NO NGINX - Use express.static() for static files',
          suggestedFix: `Replace nginx with Express:

// Static file serving
app.use(express.static('public'));

// With caching headers
app.use(express.static('public', {
  maxAge: '7d',
  etag: true
}));

// Reverse proxy not needed - Azure Container Apps provides ingress`,
          context
        });
        break;
      }
    }
  }

  /**
   * Issue #41: Untested Deploy (HIGH)
   */
  async checkIssue41Pattern(text, context) {
    // Check if workflow file is modified without evidence of local testing
    const isWorkflowChange = context.file &&
                             (context.file.includes('.github/workflows') ||
                              context.file.includes('deploy'));

    if (isWorkflowChange) {
      // Look for test evidence
      const hasTestEvidence = /test.*local/i.test(text) ||
                              /local.*test/i.test(text) ||
                              /verified.*local/i.test(text) ||
                              /curl.*localhost/i.test(text);

      if (!hasTestEvidence) {
        this.warnings.push({
          type: 'UNTESTED_DEPLOY',
          severity: 'HIGH',
          incident: 'Issue #41',
          message: '⚠️  UNTESTED DEPLOYMENT PATTERN DETECTED',
          details: 'You modified CI/CD workflows without evidence of local testing.',
          law: 'ALWAYS test locally before production (no exceptions)',
          suggestedFix: `1. Test changes locally first
2. Document test results in commit message
3. Show curl output or screenshot

Example commit message:
"Fix: Updated deploy workflow

Local test:
$ npm start
✅ Server started on port 3000

$ curl http://localhost:3000/health
{\\\"status\\\":\\\"healthy\\\"}

Production verification:
$ curl https://2x4.dugganusa.com/health
{\\\"status\\\":\\\"healthy\\\"}"`,
          context
        });
      }
    }
  }

  /**
   * DAYMAN/NIGHTMAN Theme System Required
   */
  async checkDaymanNightmanTheme(text, context) {
    const incident = this.incidents['dayman-nightman-theme'];
    if (!incident) return;

    // Only check customer-facing HTML files
    const isCustomerFacingHTML = context.file && (
      context.file.includes('/public/') && context.file.endsWith('.html') ||
      context.file.includes('/services/') && context.file.endsWith('.html') ||
      context.file.includes('status-page') && context.file.endsWith('.html')
    );

    if (!isCustomerFacingHTML) return;

    // Check if file has theme system
    const hasThemeVars = /:root\s*{[\s\S]*?--/.test(text);
    const hasLightTheme = /\[data-theme=['"]light['"]\]/.test(text);
    const hasToggleFunction = /function toggleTheme\(\)/.test(text);
    const hasDaymanReference = /DAYMAN/.test(text);
    const hasNightmanReference = /NIGHTMAN/.test(text);

    const missingElements = [];
    if (!hasThemeVars) missingElements.push(':root CSS variables');
    if (!hasLightTheme) missingElements.push('[data-theme="light"] styles');
    if (!hasToggleFunction) missingElements.push('toggleTheme() function');
    if (!hasDaymanReference) missingElements.push('DAYMAN reference');
    if (!hasNightmanReference) missingElements.push('NIGHTMAN reference');

    if (missingElements.length > 0) {
      this.warnings.push({
        type: 'MISSING_THEME_SYSTEM',
        severity: 'MEDIUM',
        incident: 'DAYMAN/NIGHTMAN Theme',
        message: '⚠️  DAYMAN/NIGHTMAN THEME SYSTEM MISSING',
        details: `Customer-facing page is missing theme system elements: ${missingElements.join(', ')}`,
        law: 'DAYMAN/NIGHTMAN THEME REQUIRED - All customer-facing pages must support theme toggle',
        suggestedFix: `Add DAYMAN/NIGHTMAN theme system:

1. Add CSS variables:
:root {
  /* NIGHTMAN (Dark) - Default */
  --bg-primary: #0a0e27;
  --bg-secondary: #141b2d;
  --text-primary: #e2e8f0;
  --accent-primary: #3b82f6;
}

[data-theme='light'] {
  /* DAYMAN (Light) */
  --bg-primary: #f8fafc;
  --bg-secondary: #f1f5f9;
  --text-primary: #0f172a;
  --accent-primary: #3b82f6;
}

2. Add toggle button:
<button class="theme-toggle" onclick="toggleTheme()">
  <span id="themeName">NIGHTMAN</span>
  <span id="themeSubtitle">Fighter of the DAYMAN</span>
</button>

3. Add JavaScript:
function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? null : 'light';
  if (newTheme === 'light') {
    html.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  } else {
    html.removeAttribute('data-theme');
    localStorage.setItem('theme', 'dark');
  }
}

Reference: microservices/router/public/index.html`,
        context
      });
    }
  }

  /**
   * Alpine Base Image Law (HIGH)
   */
  async checkAlpineBaseImagePattern(text, context) {
    const incident = this.incidents['alpine-base-image'];
    if (!incident) return;

    const patterns = incident.pattern.detection.textPatterns.map(p => new RegExp(p, 'i'));

    for (const pattern of patterns) {
      if (pattern.test(text)) {
        this.violations.push({
          type: 'ALPINE_BASE_IMAGE',
          severity: 'HIGH',
          incident: 'Alpine Base Image',
          message: '🚨 BASE IMAGE LAW VIOLATED',
          details: 'You are attempting to use Alpine Linux. We use Debian-based images ONLY (node:20-slim).',
          financialRisk: {
            min: incident.financialImpact.min,
            max: incident.financialImpact.max,
            proven: incident.financialImpact.proven
          },
          law: 'BASE IMAGE LAW: DEBIAN ONLY, NEVER ALPINE',
          suggestedFix: `Replace Alpine with Debian:

# Good: Debian-based (glibc)
FROM node:20-slim

# Bad: Alpine (musl libc)
# FROM node:20-alpine

Why Debian:
- Standard glibc that all npm packages expect
- Native modules work without recompilation
- No mysterious segfaults in production
- Battle-tested across millions of deployments
- Azure Container Apps optimized for Debian

Alpine's musl libc breaks Playwright, sharp, puppeteer, and other native modules.
The 50MB "savings" is a lie when you add build dependencies.`,
          context
        });
        break;
      }
    }
  }

  /**
   * Docker AMD64 Platform Law (HIGH)
   */
  async checkDockerAmd64PlatformPattern(text, context) {
    const incident = this.incidents['docker-amd64-platform'];
    if (!incident) return;

    // Exception: References to the correct approach
    if (text.includes('./build-and-push.sh') ||
        text.includes('--platform linux/amd64')) {
      return;
    }

    const patterns = incident.pattern.detection.textPatterns.map(p => new RegExp(p, 'i'));

    for (const pattern of patterns) {
      if (pattern.test(text)) {
        this.violations.push({
          type: 'DOCKER_AMD64_PLATFORM',
          severity: 'HIGH',
          incident: 'Docker AMD64 Platform',
          message: '🚨 DOCKER BUILD LAW VIOLATED',
          details: 'You are using docker build without --platform linux/amd64. Mac builds default to ARM64, breaking Azure Container Apps.',
          financialRisk: {
            min: incident.financialImpact.min,
            max: incident.financialImpact.max,
            proven: incident.financialImpact.proven
          },
          law: 'DOCKER BUILD LAW: ALWAYS AMD64 - Use ./build-and-push.sh',
          suggestedFix: `NEVER use raw docker build. ALWAYS use the script:

# Good: Using the build script
./build-and-push.sh towelie 6.11.0

# Also acceptable: Manual with correct platform
docker buildx build --platform linux/amd64 \\
  -t cleansheet2x4.azurecr.io/towelie:6.11.0 \\
  --push .

# Bad: Raw docker build (defaults to ARM64 on Mac)
# docker build -t towelie:6.11.0 .

Why this matters:
- Azure Container Apps require linux/amd64
- Mac Docker defaults to linux/arm64
- Images build successfully but fail to start in Azure
- Silent failures with cryptic error messages
- Use the script to enforce correct platform`,
          context
        });
        break;
      }
    }
  }

  /**
   * Check for enterprise sprawl
   */
  async checkEnterpriseSprawl(text, context, skipCostChecks = false) {
    const patterns = {
      'DDoS Protection': /ddos.*protection.*standard/i,
      'Private Link': /private.*link/i,
      'Enterprise Key Management': /enterprise.*key.*management/i,
      'Application Gateway': /application.*gateway/i,
      'Azure Firewall': /azure.*firewall/i
    };

    for (const [name, pattern] of Object.entries(patterns)) {
      if (pattern.test(text)) {
        this.violations.push({
          type: 'ENTERPRISE_SPRAWL',
          severity: 'CRITICAL',
          message: `🚨 ENTERPRISE SPRAWL: ${name} detected`,
          details: 'DugganUSA LLC has no legacy infrastructure to protect.',
          law: 'Born Without Sin - Do not preemptively acquire enterprise debt',
          suggestedFix: 'Remove this. We do not need enterprise sprawl pre-revenue.',
          context
        });
      }
    }
  }

  /**
   * Live Data Law - Enhanced with incident-based learning (HIGH)
   */
  async checkLiveDataLawPattern(text, context) {
    const incident = this.incidents['live-data-law'];
    if (!incident) return;

    // Only check HTML files and public JS files
    const isRelevantFile = context.file && (
      context.file.endsWith('.html') ||
      context.file.includes('/public/') && context.file.endsWith('.js') ||
      context.file.includes('/views/') && context.file.endsWith('.ejs')
    );

    if (!isRelevantFile) return;

    // Check for exclusions (correct patterns)
    const correctPatterns = [
      /fetch\(.*['"]\/(health|api\/version)/i,
      /getElementById\(.*version/i,
      /updateSprintStats/i,
      /textContent.*=.*data\./i,
      /\/\/ Version from .*API/i
    ];

    for (const correct of correctPatterns) {
      if (correct.test(text)) {
        // This is the CORRECT approach - don't flag it
        return;
      }
    }

    // Now check for violations
    const patterns = incident.pattern.detection.textPatterns.map(p => new RegExp(p, 'i'));

    for (const pattern of patterns) {
      if (pattern.test(text)) {
        this.violations.push({
          type: 'HARDCODED_LIVE_DATA',
          severity: 'HIGH',
          incident: 'Live Data Law',
          message: '⚠️  LIVE DATA LAW VIOLATED',
          details: 'You are hardcoding version numbers, metrics, or status data that should be fetched from APIs.',
          financialRisk: {
            min: incident.financialImpact.min,
            max: incident.financialImpact.max,
            proven: incident.financialImpact.proven
          },
          law: 'LIVE DATA LAW: NO HARDCODED VERSIONS/STATUS EVER',
          suggestedFix: `Fetch from API instead:

// Good: Fetch live data
fetch('/health').then(r => r.json()).then(data => {
  document.getElementById('version').textContent = data.version;
  document.getElementById('corpus').textContent =
    \`Corpus: \${data.ragConfig.corpusSize} docs validated ✓\`;
  document.getElementById('uptime').textContent = data.uptime;
});

// Good: Auto-refresh every 60 seconds
setInterval(() => {
  fetch('/health').then(r => r.json()).then(updateUI);
}, 60000);

// Bad: Hardcoded (what you're doing now)
<title>Platform v5.2.21</title>
<footer>Corpus: 1,234 documents validated ✓</footer>

Why this matters:
- Hardcoded data requires manual updates on every release
- Stale data misleads stakeholders
- Zero entropy requires dynamic data fetching
- Google Analytics pattern: fetch from APIs, not hardcode`,
          context
        });
        break;
      }
    }
  }

  /**
   * Git Directory Breakout Prevention (MEDIUM)
   * Issue #95 - Directory discipline for git operations
   */
  async checkGitDirectoryBreakout(text, context) {
    const incident = this.incidents['git-directory-breakout'];
    if (!incident) return;

    // Check for directory breakout patterns
    // Match: cd ../.. && git, cd ../../ && git, cd .. && cd .. && git
    if (text.match(/cd\s+(\.\.\/\.\.|\.\.\\\.\.|\.\.\/\.\.\/)\s+&&.*git/i) ||
        text.match(/cd\s+\.\.\s+&&\s+cd\s+\.\.\s+&&.*git/i)) {
      this.violations.push({
        type: 'GIT_DIRECTORY_BREAKOUT',
        severity: 'MEDIUM',
        incident: 'Issue #95',
        message: '⚠️  DIRECTORY BREAKOUT DETECTED',
        details: 'You are using cd ../.. before git commands. This breaks out of current context and violates directory discipline.',
        law: 'DIRECTORY DISCIPLINE LAW: Execute git from current directory (consistent with docker-wrong-directory)',
        suggestedFix: `Execute git commands from current directory:

❌ Bad (what you're doing):
cd ../.. && git add -A && git commit

✅ Good:
git add -A
git commit -m 'message'
git push origin main

✅ Also OK (relative paths):
git add ../../some-file.md

Why this matters:
- Context integrity: Breaking out risks operating on wrong files
- Consistency: We enforce directory discipline for Docker builds
- User trust: Directory breakout is "sloppy" behavior
- Related: docker-wrong-directory.json incident pattern`,
        context
      });
    }
  }

  /**
   * @deprecated - Use checkLiveDataLawPattern instead (incident-based)
   * Kept for backward compatibility
   */
  async checkHardcodedData(text, context) {
    // Delegate to new incident-based pattern
    return this.checkLiveDataLawPattern(text, context);
  }

  /**
   * Check for cost inefficiency
   */
  async checkCostEfficiency(text, context, skipCostChecks = false) {
    if (skipCostChecks) return;

    const expensivePatterns = [
      /\$[5-9]\d{2,}.*month/i,  // $500+/month
      /\$\d{4,}.*month/i         // $1000+/month
    ];

    for (const pattern of expensivePatterns) {
      if (pattern.test(text)) {
        this.warnings.push({
          type: 'COST_INEFFICIENCY',
          severity: 'HIGH',
          message: '💰 HIGH COST DETECTED',
          details: 'DugganUSA LLC maintains lean infrastructure costs per business model.',
          law: 'Maintain extreme cost efficiency - it is our competitive moat',
          suggestedFix: 'Is there a cheaper alternative? We maintain cost efficiency religiously.',
          context
        });
        break;
      }
    }
  }

  /**
   * Check for commendations
   */
  async checkCommendations(text) {
    const lowerText = text.toLowerCase();

    if (lowerText.includes('cost') && (lowerText.includes('reduction') || lowerText.includes('efficiency'))) {
      this.commendations.push({
        type: 'COST_EFFICIENCY',
        message: 'Maintaining extreme cost efficiency - The Law is upheld'
      });
    }

    if (lowerText.includes('soc1') || lowerText.includes('compliance')) {
      this.commendations.push({
        type: 'SOC1_FOCUS',
        message: 'Focusing on application compliance - The Law is upheld'
      });
    }

    if (lowerText.includes('cisa') || lowerText.includes('zero-day') || lowerText.includes('kev')) {
      this.commendations.push({
        type: 'ZERO_DAY_PROTECTION',
        message: 'Free, effective threat protection - The Law is upheld'
      });
    }

    if (lowerText.includes('born without sin') || lowerText.includes('no legacy')) {
      this.commendations.push({
        type: 'PHILOSOPHICAL_ALIGNMENT',
        message: 'Understanding the competitive advantage - The Law is upheld'
      });
    }
  }

  /**
   * Check if text is documentation
   */
  isDocumentation(text) {
    return (
      text.includes('SECURITY-PHILOSOPHY') ||
      text.includes('THE LAW') ||
      text.includes('Born Without Sin') ||
      text.includes('what NOT to do') ||
      text.includes('What Legacy Enterprises') ||
      text.includes("Why They Need It | Why You Don't") ||
      text.includes('IMPLEMENTATION-PLAN') ||
      text.includes('JUDGE-DREDD-AGENT-GUIDE')
    );
  }

  /**
   * Check if text is investor materials
   */
  isInvestorMaterials(text) {
    return (
      text.includes('ARR') ||
      text.includes('portfolio value') ||
      text.includes('Patent #') ||
      text.includes('**Problem:**') ||
      text.includes('competitors') ||
      text.includes('TAM:')
    );
  }

  /**
   * Get analysis results
   */
  getResults() {
    return {
      violations: this.violations,
      warnings: this.warnings,
      commendations: this.commendations,
      hasViolations: this.violations.length > 0,
      hasCritical: this.violations.some(v => v.severity === 'CRITICAL')
    };
  }
}

module.exports = PatternDetector;
