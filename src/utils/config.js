/**
 * Judge Dredd Agent - Configuration
 */

const path = require('path');

const config = {
  // File watching patterns
  watchPatterns: [
    '**/*.js',
    '**/*.yml',
    '**/*.yaml',
    '**/*.json',
    '**/*.md',
    '**/*.sh',
    'Dockerfile',
    '.github/workflows/**'
  ],

  // Ignore patterns
  ignorePatterns: [
    '**/node_modules/**',
    '**/.git/**',
    '**/dist/**',
    '**/build/**',
    '**/.next/**',
    '**/coverage/**',
    '**/.dredd/**',
    '**/test/**',
    '**/*.test.js',
    '**/*.spec.js'
  ],

  // Debounce milliseconds
  debounceMs: 500,

  // Git settings
  git: {
    defaultCommitCount: 10
  },

  // Paths
  paths: {
    root: path.resolve(__dirname, '../..'),
    incidents: path.resolve(__dirname, '../../compliance/learning/incidents'),
    evidence: path.resolve(__dirname, '../../compliance/evidence'),
    agentState: path.resolve(__dirname, '../../compliance/agent-state')
  },

  // Severity levels
  severity: {
    CRITICAL: {
      color: 'red',
      icon: '🚨',
      blocking: true
    },
    HIGH: {
      color: 'yellow',
      icon: '⚠️',
      blocking: false
    },
    MEDIUM: {
      color: 'blue',
      icon: 'ℹ️',
      blocking: false
    },
    INFO: {
      color: 'green',
      icon: '✅',
      blocking: false
    }
  }
};

module.exports = config;
