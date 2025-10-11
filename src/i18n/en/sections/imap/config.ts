export const configTranslations = {
  resetConfirm:
    "Are you sure you want to reset all configuration to defaults? This action cannot be undone.",
  server: {
    enabled: "Server Enabled",
    maxConnections: "Max Connections",
    connectionTimeout: "Connection Timeout (ms)",
    poolIdleTimeout: "Pool Idle Timeout (ms)",
    keepAlive: "Keep Alive",
  },
  sync: {
    enabled: "Sync Enabled",
    interval: "Sync Interval (seconds)",
    batchSize: "Batch Size",
    maxMessages: "Max Messages",
    concurrentAccounts: "Concurrent Accounts",
  },
  performance: {
    cacheEnabled: "Cache Enabled",
    cacheTtl: "Cache TTL (ms)",
    cacheMaxSize: "Cache Max Size",
    memoryThreshold: "Memory Threshold (%)",
  },
  resilience: {
    maxRetries: "Max Retries",
    retryDelay: "Retry Delay (ms)",
    circuitBreakerThreshold: "Circuit Breaker Threshold",
    circuitBreakerTimeout: "Circuit Breaker Timeout (ms)",
  },
  monitoring: {
    healthCheckInterval: "Health Check Interval (ms)",
    metricsEnabled: "Metrics Enabled",
    loggingLevel: "Logging Level",
  },
  development: {
    debugMode: "Debug Mode",
    testMode: "Test Mode",
  },
  messages: {
    validation: {
      failed: "Configuration validation failed",
    },
    update: {
      success: "Configuration updated successfully",
      failed: "Failed to update configuration",
    },
    reset: {
      success: "Configuration reset to defaults successfully",
      failed: "Failed to reset configuration",
    },
    export: {
      success: "Configuration exported successfully",
      failed: "Failed to export configuration",
    },
    import: {
      invalid: "Imported configuration is invalid",
      failed: "Failed to import configuration",
    },
    errors: {
      unknown_key: "Unknown configuration key",
      invalid_boolean: "must be a boolean",
      invalid_number: "must be a number",
      invalid_string: "must be a string",
      min_value: "must be at least",
      max_value: "must be at most",
      invalid_enum: "must be one of",
      unknown_error: "Unknown error",
    },
  },
};
