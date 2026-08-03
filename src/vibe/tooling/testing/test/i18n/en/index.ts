export const translations = {
  title: "Run Tests",
  titleShort: "Run Tests",
  description: "Execute test suite with optional configurations",
  category: "Testing",
  tag: "Test",

  container: {
    title: "Test Configuration",
    description: "Configure test execution parameters",
  },

  fields: {
    path: {
      label: "Test Path",
      description: "Path to test files or directory",
      placeholder: "src/",
    },
    verbose: {
      label: "Verbose Output",
      description: "Enable detailed test output",
    },
    watch: {
      label: "Watch Mode",
      description: "Run tests in watch mode for file changes",
    },
    coverage: {
      label: "Coverage Report",
      description: "Generate test coverage report",
    },
  },

  response: {
    success: "Test execution status",
    output: "Test output and results",
    duration: "Test execution duration (ms)",
  },

  errors: {
    validation: {
      title: "Validation Error",
      description: "Invalid test configuration parameters",
    },
    internal: {
      title: "Internal Error",
      description: "Test execution failed due to internal error",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "Permission denied for test execution",
    },
    forbidden: {
      title: "Forbidden",
      description: "Test execution is forbidden",
    },
    notFound: {
      title: "Not Found",
      description: "Test files or directory not found",
    },
    server: {
      title: "Server Error",
      description: "Server error during test execution",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unexpected error occurred",
    },
    unsaved: {
      title: "Unsaved Changes",
      description: "There are unsaved changes that may affect tests",
    },
    conflict: {
      title: "Conflict",
      description: "Test execution conflict detected",
    },
    executionFailed:
      "Test execution failed after {{duration}}ms: {{detail}}\n{{output}}",
    // The EN wording of `streamingUnsupported` is load-bearing: test-endpoint.ts
    // probes response messages for "Streaming responses are not supported" to tell
    // test-infrastructure failures from real endpoint errors. Keep that substring.
    streamingUnsupported: "Streaming responses are not supported in tests",
    responseSchemaFailed:
      "Response schema validation failed for {{path}}: {{issues}}",
    requestFailed: "Test request failed: {{detail}}",
    browser: {
      serverNotRunning:
        "Atlas dev server is not running - start it with vibe dev",
      openFailed: "Could not open the browser page: {{detail}}",
      fillFailed: "Could not fill the form fields: {{detail}}",
      submitFailed: "Could not click the submit button: {{detail}}",
      evaluateFailed: "Script evaluation on the page failed: {{detail}}",
      resultTimeout: "No mutation result arrived within {{timeoutMs}}ms",
      parseFailed: "Could not parse the cached response as JSON: {{raw}}",
      cacheEmpty: "Mutation cache is empty - the response never loaded",
      requestFailed: "Browser test failed: {{detail}}",
    },
  },

  success: {
    title: "Tests Completed",
    description: "Test execution completed successfully",
  },
};
