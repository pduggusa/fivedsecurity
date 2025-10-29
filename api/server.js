/**
 * Judge Dredd 5D API Server
 * Provides health endpoints and webhook integration
 */

const express = require('express');
const path = require('path');
const FiveDVerifier = require('../src/verifier/FiveDVerifier');
const CentralBrainClient = require('../src/analytics/CentralBrainClient');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../web')));

// Configure Central Brain
CentralBrainClient.configure({
  endpoint: process.env.CENTRAL_BRAIN_ENDPOINT,
  apiKey: process.env.CENTRAL_BRAIN_API_KEY,
  oauthToken: process.env.CENTRAL_BRAIN_OAUTH_TOKEN
});

// Health endpoint with 5D metrics
app.get('/health', async (req, res) => {
  try {
    const verifier = new FiveDVerifier();
    const verification = await verifier.verify();

    res.json({
      status: 'healthy',
      version: require('../package.json').version,
      timestamp: new Date().toISOString(),
      centralBrain: CentralBrainClient.getStatus(),
      fiveD: {
        dimension1: {
          name: 'Commit Compliance',
          score: verification.dimensions?.dimension1?.score || 0,
          status: verification.dimensions?.dimension1?.status || 'unknown'
        },
        dimension2: {
          name: 'Corpus Alignment',
          score: verification.dimensions?.dimension2?.score || 0,
          status: verification.dimensions?.dimension2?.status || 'unknown'
        },
        dimension3: {
          name: 'Production Evidence',
          score: verification.dimensions?.dimension3?.score || 0,
          status: verification.dimensions?.dimension3?.status || 'unknown'
        },
        dimension4: {
          name: 'Temporal Decay',
          score: verification.dimensions?.dimension4?.score || 0,
          status: verification.dimensions?.dimension4?.status || 'unknown'
        },
        dimension5: {
          name: 'Financial Efficiency',
          score: verification.dimensions?.dimension5?.score || 0,
          status: verification.dimensions?.dimension5?.status || 'unknown'
        },
        correlation: verification.correlation || 0,
        goedelCompliant: verification.goedelCompliant || false,
        maxDrift: verification.maxDrift || 0
      },
      epistemicHumility: {
        cap: 95,
        buffer: 5,
        law: 'No claim shall exceed 95% confidence - 5% bullshit is guaranteed'
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Version endpoint
app.get('/api/version', (req, res) => {
  res.json({
    version: require('../package.json').version,
    name: 'Judge Dredd 5D',
    epistemicHumilityCap: 95
  });
});

// GitHub webhook endpoint
app.post('/webhook/github', async (req, res) => {
  try {
    const event = req.headers['x-github-event'];
    const payload = req.body;

    console.log(`📥 GitHub webhook: ${event}`);

    // Handle push events
    if (event === 'push') {
      const { commits, repository } = payload;

      console.log(`🔄 Push to ${repository.full_name}: ${commits.length} commits`);

      // Run 5D verification on commits
      const verifier = new FiveDVerifier();
      const results = await verifier.verify();

      // Send to Central Brain
      if (CentralBrainClient.enabled) {
        await CentralBrainClient.sendEvents([{
          eventType: 'github_push',
          repository: repository.full_name,
          commits: commits.length,
          correlation: results.correlation,
          timestamp: new Date().toISOString()
        }]);
      }

      res.json({
        status: 'processed',
        commits: commits.length,
        correlation: results.correlation,
        goedelCompliant: results.goedelCompliant
      });
    } else {
      res.json({ status: 'ignored', event });
    }
  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).json({
      status: 'error',
      error: error.message
    });
  }
});

// Status endpoint (detailed)
app.get('/api/status', async (req, res) => {
  try {
    const verifier = new FiveDVerifier();
    const verification = await verifier.verify();

    res.json({
      judge: {
        version: require('../package.json').version,
        uptime: process.uptime(),
        memory: process.memoryUsage()
      },
      centralBrain: CentralBrainClient.getStatus(),
      verification,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`⚖️  Judge Dredd 5D API Server`);
  console.log(`🚀 Listening on port ${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/health`);
  console.log(`📡 Central Brain: ${CentralBrainClient.getStatus().enabled ? '✅ Connected' : '⚠️  Disabled'}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
});

module.exports = app;
