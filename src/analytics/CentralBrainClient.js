/**
 * Central Brain Event Sender - Judge Dredd Integration
 *
 * Sends violations and commendations to Central Brain analytics platform
 * for Butterbot training data collection.
 *
 * Usage:
 *   const sender = require('./central-brain-sender');
 *   sender.configure({ endpoint, apiKey });
 *   await sender.sendViolations(violations, context);
 *   await sender.sendCommendations(commendations, context);
 */

class CentralBrainSender {
  constructor() {
    this.endpoint = null;
    this.apiKey = null;
    this.enabled = false;
    this.retryAttempts = 3;
    this.retryDelay = 1000; // ms (exponential backoff base)
  }

  /**
   * Configure Central Brain connection
   * @param {object} config - Configuration
   * @param {string} config.endpoint - Central Brain endpoint URL
   * @param {string} config.apiKey - API key for authentication (or OAuth token)
   * @param {string} config.oauthToken - OAuth token (alternative to apiKey)
   */
  configure(config) {
    if (!config || !config.endpoint) {
      console.log('⚠️  Central Brain not configured (skipping analytics)');
      this.enabled = false;
      return;
    }

    // Support both API key and OAuth token
    if (!config.apiKey && !config.oauthToken) {
      console.log('⚠️  Central Brain: No authentication provided (skipping analytics)');
      this.enabled = false;
      return;
    }

    this.endpoint = config.endpoint;
    this.apiKey = config.apiKey || config.oauthToken;
    this.enabled = true;
    console.log(`✅ Central Brain analytics enabled: ${this.endpoint}`);
  }

  /**
   * Send violations to Central Brain
   * @param {array} violations - Array of violation objects
   * @param {object} context - Additional context (files, timestamp, etc.)
   */
  async sendViolations(violations, context = {}) {
    if (!this.enabled || violations.length === 0) {
      return;
    }

    const events = violations.map(v => this.mapViolationToEvent(v, context));
    await this.sendEvents(events);
  }

  /**
   * Send commendations to Central Brain
   * @param {array} commendations - Array of commendation objects
   * @param {object} context - Additional context
   */
  async sendCommendations(commendations, context = {}) {
    if (!this.enabled || commendations.length === 0) {
      return;
    }

    const events = commendations.map(c => this.mapCommendationToEvent(c, context));
    await this.sendEvents(events);
  }

  /**
   * Map violation to Central Brain event format
   * @param {object} violation - Violation object
   * @param {object} context - Context
   */
  mapViolationToEvent(violation, context) {
    return {
      eventType: 'judge_dredd_violation',
      patternId: violation.incident || 'unknown',
      patternName: violation.message,
      severity: violation.severity || 'MEDIUM',
      lawViolated: violation.law || 'Unknown Law',
      costOfViolation: this.extractCost(violation.financialRisk),
      scenario: violation.details || '',
      outcome: `SEV${violation.severity === 'CRITICAL' ? '1' : violation.severity === 'HIGH' ? '2' : '3'} incident`,
      roiMeasured: -this.extractCost(violation.financialRisk), // Negative ROI (cost incurred)
      validationSource: violation.incident ? `github-issue-${violation.incident.replace('Issue #', '')}` : 'pattern-detection',
      suggestedFix: violation.suggestedFix || '',
      files: context.files || [],
      timestamp: context.timestamp || new Date().toISOString()
    };
  }

  /**
   * Map commendation to Central Brain event format
   * @param {object} commendation - Commendation object
   * @param {object} context - Context
   */
  mapCommendationToEvent(commendation, context) {
    return {
      eventType: 'judge_dredd_commendation',
      patternId: commendation.type || 'unknown',
      patternName: commendation.message,
      severity: 'NONE',
      lawViolated: 'NONE',
      costOfViolation: 0,
      scenario: commendation.message || '',
      outcome: 'Positive behavior - encouraged',
      roiMeasured: 0, // Commendations don't have ROI (yet)
      validationSource: 'pattern-detection',
      files: context.files || [],
      timestamp: context.timestamp || new Date().toISOString()
    };
  }

  /**
   * Extract financial cost from financialRisk object
   * @param {object} financialRisk - {min, max, proven}
   */
  extractCost(financialRisk) {
    if (!financialRisk) return 0;

    // Use midpoint of range
    return Math.round((financialRisk.min + financialRisk.max) / 2);
  }

  /**
   * Send events to Central Brain with retry logic
   * @param {array} events - Array of events
   * @param {number} attempt - Current attempt number
   */
  async sendEvents(events, attempt = 1) {
    if (!this.enabled || events.length === 0) {
      return;
    }

    try {
      const startTime = Date.now();

      const response = await fetch(`${this.endpoint}/api/ingest/judge-dredd`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({ events }),
        signal: AbortSignal.timeout(5000) // 5s timeout
      });

      const latency = Date.now() - startTime;

      if (!response.ok) {
        throw new Error(`Central Brain API error: ${response.status} ${response.statusText}`);
      }

      console.log(`✅ Central Brain: ${events.length} Judge Dredd events sent (${latency}ms)`);
    } catch (error) {
      // Retry logic
      if (attempt < this.retryAttempts) {
        const delay = this.retryDelay * Math.pow(2, attempt - 1); // Exponential backoff
        console.warn(`⚠️  Central Brain send failed (attempt ${attempt}/${this.retryAttempts}), retrying in ${delay}ms...`);

        await new Promise(resolve => setTimeout(resolve, delay));
        return this.sendEvents(events, attempt + 1);
      } else {
        // Final failure - log and continue (fail silently)
        console.error(`❌ Central Brain send failed after ${this.retryAttempts} attempts:`, error.message);
        console.error(`   Dropped ${events.length} Judge Dredd events`);
      }
    }
  }

  /**
   * Fetch incident patterns from Central Brain tables
   * @returns {object} Dictionary of incident patterns keyed by ID
   */
  async fetchIncidentPatterns() {
    if (!this.enabled) {
      console.warn('⚠️  Central Brain not configured - cannot fetch patterns');
      return {};
    }

    try {
      const startTime = Date.now();

      const response = await fetch(`${this.endpoint}/api/patterns/incidents`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(10000) // 10s timeout
      });

      const latency = Date.now() - startTime;

      if (!response.ok) {
        throw new Error(`Central Brain API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ Central Brain: Fetched ${Object.keys(data.patterns || {}).length} incident patterns (${latency}ms)`);

      return data.patterns || {};
    } catch (error) {
      console.error(`❌ Central Brain: Failed to fetch incident patterns:`, error.message);
      console.warn(`⚠️  Falling back to local patterns (if available)`);
      return {};
    }
  }

  /**
   * Get status for health checks
   */
  getStatus() {
    return {
      enabled: this.enabled,
      endpoint: this.endpoint ? this.endpoint.replace(/\/api.*$/, '') : null
    };
  }
}

// Singleton instance
const centralBrainSender = new CentralBrainSender();

module.exports = centralBrainSender;
