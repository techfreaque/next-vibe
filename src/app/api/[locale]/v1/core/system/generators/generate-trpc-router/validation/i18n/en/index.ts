export const translations = {
  title: "Validate tRPC Integration",
  description: "Validate tRPC router integration with API endpoints",
  category: "API Endpoint",
  tags: {
    trpc: "tRPC",
    validation: "Validation",
  },
  operations: {
    validateIntegration: "Validate Integration",
    validateRouteFile: "Validate Route File",
    generateReport: "Generate Report",
    fixRoutes: "Fix Routes",
    checkRouterExists: "Check Router Exists",
  },
  severity: {
    error: "Error",
    warning: "Warning",
    info: "Info",
  },
  fields: {
    operation: {
      label: "Operation",
      description: "Validation operation to perform",
      placeholder: "Select validation operation",
    },
    filePath: {
      label: "File Path",
      description: "Optional specific file path to validate",
      placeholder: "Enter file path",
    },
    options: {
      label: "Options",
      description: "Validation options",
      placeholder: "Enter options",
    },
  },
  response: {
    success: {
      label: "Success",
    },
    operation: {
      label: "Operation",
    },
    result: {
      label: "Result",
    },
  },
  errors: {
    executionFailed: {
      title: "TRPC Validation Execution Failed",
    },
  },
};
