# fivedsecurity Handoff Documentation

**Date**: 2025-10-29
**Repository**: https://github.com/pduggusa/fivedsecurity
**Status**: Initial extraction complete, ready for Phase 1

---

## What is fivedsecurity?

Judge Dredd 5D is an **autonomous code governance agent** that verifies truth across 5 dimensions with **95% epistemic humility**. Extracted from security-dugganusa.com for standalone SaaS product at fivedsecurity.com.

### Core Innovation: LIVE DATA from Central Brain

Unlike traditional static pattern files, Judge Dredd fetches incident patterns **live from analytics.dugganusa.com** via OAuth. This follows the **LIVE DATA LAW** - no hardcoded versions, metrics, or patterns.

---

## Repository Structure

```
fivedsecurity/
├── src/                  # Core verification engine (~2,570 LOC)
│   ├── verifier/         # FiveDVerifier.js (925 LOC) - 5D correlation
│   ├── patterns/         # PatternDetector.js (668 LOC) - Pattern matching
│   ├── git/              # GitAnalyzer.js (156 LOC) - Git operations
│   ├── analytics/        # CentralBrainClient.js (187 LOC) - OAuth + API
│   └── utils/            # config.js (76 LOC)
├── cli/                  # index.js (446 LOC) - dredd command
├── api/                  # server.js - Express server with health endpoints
├── web/                  # index.html - Live 5D dashboard
├── incidents/            # Local pattern cache (FALLBACK ONLY)
├── corpus/               # Training data (to be populated)
├── evidence/             # Evidence storage (VirusTotal, Cloudflare, etc.)
├── docs/                 # Documentation
├── Dockerfile            # Production deployment (Debian-based, NEVER Alpine)
├── package.json          # Dependencies and CLI configuration
└── README.md             # Complete setup guide
```

---

## 5D Verification System

### The 5 Dimensions

1. **Commit Compliance** (Dimension 1) - Git history analysis
2. **Corpus Alignment** (Dimension 2) - Training data validation (currently 44%, target 95%)
3. **Production Evidence** (Dimension 3) - Live API verification (currently 30%, target 95%)
4. **Temporal Decay** (Dimension 4) - Entropy tracking (95%)
5. **Financial Efficiency** (Dimension 5) - ROI measurement (95%)

### 95% Epistemic Humility Law

**Rule**: No dimension can exceed 95% confidence. 5% bullshit is guaranteed.

**Rationale**:
- Philosophically grounded (Gödel's Incompleteness Theorem)
- Commercially defensible (no "100% uptime" lies)
- Empirically honest (measurement error exists)

### Gödel Compliance

All 5 dimensions must agree within **10 points**. If max drift > 10, one dimension is lying.

**Example**:
```
Dimension 1: 95% ✓
Dimension 2: 89% ⚠️
Dimension 3: 90% ✓
Dimension 4: 95% ✓
Dimension 5: 95% ✓

Max drift: 6 points (95% - 89%)
Status: ✅ Gödel-compliant
```

---

## Central Brain Integration (LIVE DATA)

### Architecture

```
┌─────────────────────┐
│ dredd review        │ (CLI command)
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────────────┐
│ CentralBrainClient.fetchPatterns()  │
│ GET /api/patterns/incidents          │
│ Authorization: Bearer <oauth-token>  │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│ analytics.dugganusa.com              │
│ (Central Brain)                      │
│ - OAuth provider                     │
│ - Pattern storage (Azure Tables)    │
│ - Event ingestion                    │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│ PatternDetector.loadPatterns()       │
│ - Uses LIVE patterns from API        │
│ - Falls back to local JSON if offline│
└─────────────────────────────────────┘
```

### Why LIVE DATA?

**Violates LIVE DATA LAW** (hardcoded):
```javascript
// ❌ BAD: Hardcoded patterns
const patterns = {
  "issue-43": { ... },
  "issue-32": { ... }
};
```

**Follows LIVE DATA LAW** (dynamic):
```javascript
// ✅ GOOD: Fetch from Central Brain
const patterns = await centralBrain.fetchIncidentPatterns();
```

**Benefits**:
- Latest patterns from production incidents
- No manual JSON maintenance
- Automatic updates across all installations
- Centralized learning

---

## GitHub Issues Created

### Phase 1: Central Brain API Endpoint (CRITICAL)
**Issue**: https://github.com/pduggusa/fivedsecurity/issues/1
**Priority**: CRITICAL (blocks all installations)
**Time**: 4-6 hours

**Tasks**:
1. Build `/api/patterns/incidents` endpoint in analytics.dugganusa.com
2. Azure Table Storage schema (`IncidentPatterns` table)
3. Seed 4 core patterns (issue-43, issue-32, alpine, docker-amd64)
4. OAuth authentication required
5. Response format: `{ patterns: { "issue-43": {...}, ... } }`

**Blocker**: Judge Dredd CLI cannot fetch patterns until this exists.

---

### Phase 2: OAuth Provider Implementation
**Issue**: https://github.com/pduggusa/fivedsecurity/issues/2
**Priority**: HIGH
**Time**: 6-8 hours

**Tasks**:
1. OAuth 2.0 authorization flow
2. `/oauth/authorize` - User authorizes app
3. `/oauth/token` - Exchange code for token
4. CLI authentication: `dredd auth login`
5. Token storage: `~/.dredd/credentials.json`

**Dependencies**: Phase 1 (can use API keys as temporary workaround)

---

### Phase 3: Azure Container App Deployment
**Issue**: https://github.com/pduggusa/fivedsecurity/issues/3
**Priority**: MEDIUM
**Time**: 3-4 hours

**Tasks**:
1. Build Docker image (DOCKER AMD64 LAW - always --platform linux/amd64)
2. Deploy to Azure Container Apps
3. Configure secrets in Key Vault (CENTRAL_BRAIN_OAUTH_TOKEN)
4. GitHub Actions workflow (`.github/workflows/deploy-fivedsecurity.yml`)
5. Health endpoint verification

**Cost**: ~$12-20/month (0.5 CPU, 1GB RAM)

---

### Phase 4: Cloudflare DNS Configuration
**Issue**: https://github.com/pduggusa/fivedsecurity/issues/4
**Priority**: MEDIUM
**Time**: 1-2 hours

**Tasks**:
1. Add CNAME records (fivedsecurity.com → Azure Container App)
2. Custom domain in Azure Container App
3. SSL/TLS: Full (strict)
4. Page rules (API bypass cache, assets cache 7 days)

**Prerequisites**: Domain purchased ✅ (fivedsecurity.com)

---

### Phase 5: Marketing Landing Page
**Issue**: https://github.com/pduggusa/fivedsecurity/issues/5
**Priority**: LOW
**Time**: 4-6 hours

**Tasks**:
1. Hero section with CTA
2. Live 5D dashboard (auto-refresh every 60s)
3. Value proposition (95% Law, Strange Loop, $2.5M-$6M prevented)
4. How It Works (5 steps)
5. Pricing (FREE + Enterprise)
6. Incident patterns showcase

**Current**: Basic dashboard exists in `web/index.html`

---

### Phase 6: Documentation Portal
**Issue**: https://github.com/pduggusa/fivedsecurity/issues/6
**Priority**: LOW
**Time**: 6-8 hours

**Tasks**:
1. Choose framework (Docusaurus recommended)
2. Getting Started guide
3. CLI reference (dredd review, dredd 4d, etc.)
4. API reference (GET /health, POST /webhook/github)
5. Concepts (95% Law, 5D, Gödel Compliance)
6. Incident patterns documentation
7. Deploy to docs.fivedsecurity.com

---

## Environment Variables

### Required for Production

```bash
# Central Brain connection
CENTRAL_BRAIN_ENDPOINT=https://analytics.dugganusa.com
CENTRAL_BRAIN_OAUTH_TOKEN=<from-oauth-flow>

# Or use API key (temporary)
CENTRAL_BRAIN_API_KEY=<api-key>

# Server
PORT=3000
NODE_ENV=production
```

### GitHub Secrets (for CI/CD)

```yaml
AZURE_CREDENTIALS: <service-principal-json>
CENTRAL_BRAIN_ENDPOINT: https://analytics.dugganusa.com
CENTRAL_BRAIN_OAUTH_TOKEN: <oauth-token>
```

**IMPORTANT**: Never store tokens in GitHub Secrets directly. Reference Azure Key Vault instead.

---

## Key Architectural Decisions

### 1. LIVE DATA from Central Brain (Not Static Files)

**Problem**: Hardcoded incident patterns in JSON files violate LIVE DATA LAW.

**Solution**: Fetch patterns from analytics.dugganusa.com API via OAuth.

**Implementation**: `src/patterns/PatternDetector.js:21-59`

```javascript
// Try Central Brain first (LIVE DATA LAW)
const centralBrain = require('../analytics/CentralBrainClient');
if (centralBrain.enabled) {
  const livePatterns = await centralBrain.fetchIncidentPatterns();
  if (Object.keys(livePatterns).length > 0) {
    this.incidents = livePatterns;
    console.log(`🧠 Loaded ${Object.keys(this.incidents).length} incident patterns from Central Brain (LIVE)`);
    return true;
  }
}

// Fallback: Load from local incidents/ directory
```

### 2. OAuth Authentication (Not API Keys)

**Why**: Users will authenticate directly with analytics.dugganusa.com using OAuth flow (more secure than API keys).

**Flow**:
1. `dredd auth login` opens browser
2. User authorizes app
3. CLI receives OAuth token
4. Token stored in `~/.dredd/credentials.json`
5. All API requests use `Authorization: Bearer <token>`

### 3. Debian-Based Docker Images (NEVER Alpine)

**Law**: BASE IMAGE LAW - DEBIAN ONLY, NEVER ALPINE

**File**: `Dockerfile:2`

```dockerfile
FROM node:20-slim  # ✅ Debian-based
# FROM node:20-alpine  # ❌ VIOLATES LAW
```

**Reason**: Alpine's musl libc breaks native modules (Playwright, sharp, puppeteer). The "50MB savings" is a lie when you add build dependencies.

### 4. Always AMD64 for Docker Builds

**Law**: DOCKER BUILD LAW - ALWAYS --platform linux/amd64

**Why**: Mac Docker defaults to ARM64, but Azure Container Apps require AMD64. Images build successfully but fail to start in Azure.

**Solution**: Always use:
```bash
docker buildx build --platform linux/amd64 ...
```

---

## Incident Patterns

These will be fetched from Central Brain, but for reference:

### issue-43: Security Control Removal (CRITICAL)
- **Financial Risk**: $2.5M-$6M (P.F. Chang's breach)
- **Pattern**: `remove.*judge.*dredd`, `disable.*security.*check`
- **Law**: Security controls exist because of previous failures. DO NOT REMOVE.

### issue-32: NO NGINX Law (HIGH)
- **Financial Risk**: $5K-$15K/year (maintenance cost)
- **Pattern**: `FROM nginx`, `apt-get.*nginx`
- **Law**: NO NGINX - Use express.static() for static files

### alpine-base-image: DEBIAN ONLY Law (HIGH)
- **Financial Risk**: $2K-$8K (debugging time)
- **Pattern**: `FROM.*alpine`, `apk add`
- **Law**: BASE IMAGE LAW - DEBIAN ONLY, NEVER ALPINE

### docker-amd64-platform: ALWAYS AMD64 Law (HIGH)
- **Financial Risk**: $1.5K-$5K (debugging time)
- **Pattern**: `docker build(?!.*--platform)`
- **Law**: DOCKER BUILD LAW - ALWAYS --platform linux/amd64

---

## Next Steps (Priority Order)

### Immediate (CRITICAL)

1. **Phase 1**: Build Central Brain API endpoint
   - File: `analytics.dugganusa.com/api/routes/patterns.js`
   - Create Azure Table Storage: `IncidentPatterns`
   - Seed 4 core patterns
   - Test: `curl https://analytics.dugganusa.com/api/patterns/incidents`

2. **Test fivedsecurity CLI**:
   ```bash
   cd /Users/patrickduggan/claude/fivedsecurity
   npm install
   npm link  # Install CLI globally

   # Set temporary API key (until OAuth ready)
   export CENTRAL_BRAIN_ENDPOINT=https://analytics.dugganusa.com
   export CENTRAL_BRAIN_API_KEY=<temp-key>

   # Test
   dredd status
   ```

### Short-Term (HIGH)

3. **Phase 2**: OAuth Provider
   - Build authorization flow
   - CLI authentication: `dredd auth login`

4. **Phase 3**: Azure Deployment
   - Deploy fivedsecurity API to Azure Container Apps
   - Configure GitHub Actions
   - Verify health endpoint

### Medium-Term (MEDIUM)

5. **Phase 4**: DNS Configuration
   - Cloudflare CNAME: fivedsecurity.com → Azure
   - Custom domain in Azure
   - SSL/TLS setup

### Nice-to-Have (LOW)

6. **Phase 5**: Marketing Landing Page
7. **Phase 6**: Documentation Portal

---

## Testing Checklist

### Local Development

```bash
# Install dependencies
cd /Users/patrickduggan/claude/fivedsecurity
npm install

# Start API server
npm start

# Test health endpoint
curl http://localhost:3000/health

# Install CLI globally
npm link

# Test CLI commands
dredd --version
dredd status
```

### Central Brain Integration

```bash
# Set credentials
export CENTRAL_BRAIN_ENDPOINT=https://analytics.dugganusa.com
export CENTRAL_BRAIN_API_KEY=<temp-key>

# Test pattern fetch
dredd status
# Should show: "🧠 Loaded X incident patterns from Central Brain (LIVE)"

# Test review
cd /Users/patrickduggan/claude/security-dugganusa
dredd review
```

---

## Important Files Reference

### Core Files

- `src/verifier/FiveDVerifier.js` - 5D correlation engine
- `src/patterns/PatternDetector.js` - Pattern detection with Central Brain integration
- `src/analytics/CentralBrainClient.js` - OAuth + API client
- `cli/index.js` - CLI commands
- `api/server.js` - Express server with health endpoints
- `README.md` - Complete documentation
- `Dockerfile` - Production deployment

### Configuration

- `package.json` - Dependencies, scripts, CLI configuration
- `src/utils/config.js` - Paths and configuration
- `.gitignore` - Excludes node_modules, credentials, local cache

---

## Commit History

### Initial Commit (a93b75a)

**Files**: 12 files, 3,403 insertions
**Highlights**:
- Extracted ~2,570 LOC core agent
- LIVE DATA architecture (Central Brain integration)
- API server with health endpoints
- Marketing landing page with auto-refresh
- Dockerfile (Debian-based, NEVER Alpine)
- Complete README with OAuth setup

**Commit Message**: "🚀 Initial commit: Judge Dredd 5D - Truth Verification System"

---

## Contact & Links

- **Repository**: https://github.com/pduggusa/fivedsecurity
- **Founder**: Patrick Duggan (patrick@dugganusa.com)
- **Central Brain**: https://analytics.dugganusa.com
- **Parent Project**: https://security.dugganusa.com

---

## Philosophy

**"I AM THE LAW"** - Judge Dredd

Judge Dredd enforces THE LAW with 95% epistemic humility. No lies about 100% uptime. No hardcoded data. No Alpine images. No nginx. Always AMD64. Always live data from Central Brain.

5% bullshit is guaranteed - embrace the truth.

---

**End of Handoff**
