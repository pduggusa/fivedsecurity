# Judge Dredd 5D - Truth Verification System

**Autonomous code governance with 95% epistemic humility.**

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Node.js: 18+](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)

## What is Judge Dredd 5D?

Judge Dredd is an autonomous code governance agent that verifies truth across 5 dimensions:

1. **Commit Compliance** (Dimension 1) - Git analysis
2. **Corpus Alignment** (Dimension 2) - Training data validation
3. **Production Evidence** (Dimension 3) - Live API verification
4. **Temporal Decay** (Dimension 4) - Entropy tracking
5. **Financial Efficiency** (Dimension 5) - ROI measurement

### The 95% Epistemic Humility Law

Judge Dredd enforces a **95% confidence cap** on all claims. No dimension can exceed 95% - 5% bullshit is guaranteed. This is:
- **Philosophically grounded** (Gödel's Incompleteness Theorem)
- **Commercially defensible** (no "100% uptime" lies)
- **Empirically honest** (measurement error exists)

**Gödel Compliance**: All 5 dimensions must agree within 10 points. Max drift > 10 = Strange Loop correlation failure.

---

## Quick Start

### Installation

```bash
# Clone repository
git clone https://github.com/pduggusa/fivedsecurity.git
cd fivedsecurity

# Install dependencies
npm install

# Install CLI globally
npm link
```

### Basic Usage

```bash
# Review uncommitted changes
dredd review

# Run 5D verification
dredd 4d

# Check compliance status
dredd status

# Ask Judge Dredd questions
dredd ask "Why no nginx?"
```

---

## Central Brain Integration (LIVE DATA)

**IMPORTANT**: Judge Dredd fetches incident patterns from **analytics.dugganusa.com** (Central Brain) as the primary source of truth. This follows the **LIVE DATA LAW** - no hardcoded patterns.

### OAuth Setup

#### 1. Register Your Application

Visit **https://analytics.dugganusa.com/oauth/register** and create a new OAuth app:

- **App Name**: Your project name (e.g., "Acme Corp - Judge Dredd")
- **Redirect URI**: `http://localhost:8080/oauth/callback` (for CLI)
- **Scopes**: `patterns:read`, `incidents:write`, `evidence:read`

You'll receive:
- **Client ID**: `your-client-id`
- **Client Secret**: `your-client-secret`

#### 2. Authenticate CLI

```bash
# Start OAuth flow
dredd auth login

# This will:
# 1. Open browser to analytics.dugganusa.com
# 2. Prompt you to authorize the app
# 3. Redirect to localhost with OAuth token
# 4. Store token in ~/.dredd/credentials.json
```

#### 3. Verify Connection

```bash
# Check Central Brain status
dredd status

# Output:
# ✅ Central Brain: Connected to analytics.dugganusa.com
# 🧠 Loaded 47 incident patterns from Central Brain (LIVE)
# 📊 Last sync: 2 minutes ago
```

### Environment Variables

Alternatively, use environment variables (for CI/CD):

```bash
export CENTRAL_BRAIN_ENDPOINT="https://analytics.dugganusa.com"
export CENTRAL_BRAIN_API_KEY="your-api-key"

# Or OAuth token
export CENTRAL_BRAIN_OAUTH_TOKEN="your-oauth-token"
```

### GitHub Secrets (CI/CD)

For GitHub Actions integration:

```yaml
# .github/workflows/judge-dredd.yml
- name: Run Judge Dredd
  env:
    CENTRAL_BRAIN_ENDPOINT: ${{ secrets.CENTRAL_BRAIN_ENDPOINT }}
    CENTRAL_BRAIN_OAUTH_TOKEN: ${{ secrets.CENTRAL_BRAIN_OAUTH_TOKEN }}
  run: |
    npm install -g @fivedsecurity/cli
    dredd review
```

**Required GitHub Secrets**:
- `CENTRAL_BRAIN_ENDPOINT` - Usually `https://analytics.dugganusa.com`
- `CENTRAL_BRAIN_OAUTH_TOKEN` - OAuth token from authentication flow

---

## Architecture

### Core Components

```
fivedsecurity/
├── src/
│   ├── verifier/         # 5D verification engine (925 LOC)
│   ├── patterns/         # Pattern detection (668 LOC)
│   ├── git/              # Git analysis (156 LOC)
│   ├── analytics/        # Central Brain client (OAuth + API)
│   └── utils/            # Configuration
├── cli/                  # CLI commands (dredd command)
├── api/                  # HTTP API server (for webhooks)
├── web/                  # Marketing landing page
├── incidents/            # Local pattern cache (fallback only)
├── corpus/               # Training data
├── evidence/             # Evidence storage (VirusTotal, etc.)
└── docs/                 # Documentation
```

### How It Works

1. **Pre-Commit Hook**: Judge Dredd runs before every git commit
2. **Pattern Detection**: Fetches latest patterns from Central Brain
3. **5D Verification**: Analyzes changes across 5 dimensions
4. **Violation Detection**: Blocks commit if CRITICAL violations found
5. **Evidence Logging**: Sends events to Central Brain for learning

### Pattern Flow (LIVE DATA)

```
┌─────────────────────┐
│ Developer commits   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Judge Dredd CLI     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────────────┐
│ Fetch patterns from Central Brain   │
│ (analytics.dugganusa.com)            │
│ - OAuth authenticated                │
│ - Latest incident patterns (LIVE)    │
│ - No hardcoded patterns              │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────┐
│ Analyze changes     │
│ - Pattern matching  │
│ - Git diff analysis │
│ - 5D correlation    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Violations found?   │
└──────────┬──────────┘
           │
     ┌─────┴─────┐
     │           │
   YES          NO
     │           │
     ▼           ▼
┌─────────┐  ┌─────────┐
│ BLOCK   │  │ ALLOW   │
│ commit  │  │ commit  │
└─────────┘  └─────────┘
     │           │
     └─────┬─────┘
           │
           ▼
┌─────────────────────┐
│ Send events to      │
│ Central Brain       │
│ (learning data)     │
└─────────────────────┘
```

---

## Incident Patterns

Incident patterns are **fetched live from Central Brain**, not stored locally. This ensures:
- ✅ Latest patterns from production incidents
- ✅ No manual JSON maintenance
- ✅ Automatic updates across all installations
- ✅ Centralized learning (all incidents benefit everyone)

### Example Patterns (From Central Brain)

- **Issue #43**: Security Control Removal ($2.5M-$6M risk)
- **Issue #32**: NO NGINX Law (unnecessary complexity)
- **Alpine Base Image**: DEBIAN ONLY (musl libc breaks native modules)
- **Docker AMD64**: ALWAYS --platform linux/amd64 (Azure Container Apps)
- **Live Data Law**: NO HARDCODED VERSIONS (fetch from APIs)
- **DAYMAN/NIGHTMAN**: Theme system required (customer-facing pages)

Local `incidents/*.json` files are **fallback only** when Central Brain is unreachable.

---

## Commands

### `dredd review`

Review uncommitted changes for violations:

```bash
$ dredd review

🔍 Judge Dredd - Code Review
━━━━━━━━━━━━━━━━━━━━━━━━━━━

🧠 Loaded 47 incident patterns from Central Brain (LIVE)

Modified files:
  M  src/server.js
  M  Dockerfile

Analyzing changes...

✅ No violations detected
📊 5D Correlation: 92% (Gödel-compliant)

Dimensions:
  Commit Compliance:    95% ✓
  Corpus Alignment:     89% ⚠️ (expand training data)
  Production Evidence:  90% ✓
  Temporal Decay:       95% ✓
  Financial Efficiency: 95% ✓
```

### `dredd 4d`

Run full 5D verification:

```bash
$ dredd 4d

⚖️  Judge Dredd - 5D Verification
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dimension 1: Commit Compliance    95% ✓
Dimension 2: Corpus Alignment     89% ⚠️
Dimension 3: Production Evidence  90% ✓
Dimension 4: Temporal Decay       95% ✓
Dimension 5: Financial Efficiency 95% ✓

Strange Loop Correlation: 92%
Max Drift: 6 points (95%-89% = Gödel-compliant ✓)

⚠️  Recommendations:
  - Expand corpus from 23 to 50+ examples (boost Dim2 → 95%)
  - Add 3 more production API verifications (boost Dim3 → 95%)
```

### `dredd status`

Check system status and Central Brain connection:

```bash
$ dredd status

✅ Judge Dredd v1.0.0
✅ Central Brain: Connected to analytics.dugganusa.com
✅ OAuth: Authenticated as patrick@dugganusa.com
🧠 Patterns: 47 loaded (last sync: 2 minutes ago)
📊 Corpus: 23 documents (target: 50 for 95%)
🔒 Evidence APIs: 7/10 healthy
```

### `dredd ask <question>`

Query Judge Dredd's built-in knowledge:

```bash
$ dredd ask "Why no nginx?"

⚖️  THE LAW: NO NGINX

Issue #32 - NO NGINX Law

We use Express for everything:
- Static files: app.use(express.static('public'))
- Caching headers: maxAge, etag
- Azure Container Apps provides ingress (no reverse proxy needed)

Adding nginx adds:
- $5K-$15K/year maintenance cost
- 2-3 hours deployment complexity
- Another failure point

Express is sufficient for our needs.
```

---

## Contributing

This project is currently **private** and maintained by DugganUSA LLC. For issues or feature requests, contact:

- **Patrick Duggan**: patrick@dugganusa.com
- **GitHub Issues**: https://github.com/pduggusa/fivedsecurity/issues

---

## License

MIT License - see LICENSE file for details.

---

## Links

- **Website**: https://fivedsecurity.com
- **Central Brain**: https://analytics.dugganusa.com
- **DugganUSA Security**: https://security.dugganusa.com
- **GitHub**: https://github.com/pduggusa/fivedsecurity

---

**⚖️ "I AM THE LAW" - Judge Dredd**
