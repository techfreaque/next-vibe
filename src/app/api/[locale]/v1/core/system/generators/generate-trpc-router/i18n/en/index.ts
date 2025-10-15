export const translations = {
  trpcValidator: {
    apiDirectoryNotFound: "API directory not found: {{resolvedApiDir}}",
    foundRouteFiles: "Found {{count}} route files to validate",
    validationComplete: "Validation complete: {{status}}",
    passed: "PASSED",
    failed: "FAILED",
    errorsSummary: "Errors: {{errorCount}}, Warnings: {{warningCount}}",
    validationFailed: "Validation failed: {{message}}",
    definitionImportFrom: "./definition",
    definitionImportFromTs: "./definition.ts",
    enhancedApiHandlerCall: "enhancedApiHandler(",
    exportConstTrpc: "export const trpc",
    routerNotFound:
      "tRPC router file not found. Run 'vibe generate-trpc' to create it.",
    routeHasDefinitionNoHandler:
      "Route has definition but not using enhancedApiHandler",
    routeHasHandlerNoTrpc:
      "Route uses enhancedApiHandler but missing tRPC export",
    routeMissingNextExports:
      "Route missing Next.js exports (needed for React Native support)",
    apiHandlerOld: "apiHandler(",
    routeUsesOldHandler:
      "Route still uses old apiHandler, should migrate to enhancedApiHandler",
    autoFixNotImplemented:
      "Auto-fix not implemented yet. Run migration script manually.",
    failedToReadRoute: "Failed to read route file: {{message}}",
    reportTitle: "# tRPC Integration Validation Report",
    reportStatus: "**Status:** {{status}}",
    reportStatusPassed: "✅ PASSED",
    reportStatusFailed: "❌ FAILED",
    reportRouteFiles: "**Route Files:** {{count}}",
    reportErrors: "**Errors:** {{count}}",
    reportWarnings: "**Warnings:** {{count}}",
    errorsSection: "## Errors",
    warningsSection: "## Warnings",
    routeFileDetails: "## Route File Details",
    definitionField: "- Definition: {{status}}",
    enhancedHandlerField: "- Enhanced Handler: {{status}}",
    trpcExportField: "- tRPC Export: {{status}}",
    nextExportField: "- Next.js Export: {{status}}",
    errorsList: "**Errors:**",
    warningsList: "**Warnings:**",
    checkmark: "✅",
    crossmark: "❌",
    warningIcon: "⚠️",
    directoriesSkip: {
      trpc: "trpc",
      generated: "generated",
      nodeModules: "node_modules",
    },
    routeFileName: "route.ts",
  },
};
