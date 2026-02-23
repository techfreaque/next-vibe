import { translations as validationTranslations } from "../../validation/i18n/en";

export const translations = {
  category: "Generators",

  title: "Generate tRPC Router",
  description: "Generate tRPC router from API endpoints",
  tag: "tRPC",
  container: {
    title: "tRPC Router Generation",
    description: "Generate tRPC router configuration",
  },
  fields: {
    apiDir: {
      title: "API Directory",
      description: "Directory containing API route files",
    },
    outputFile: {
      title: "Output File",
      description: "Path to the generated tRPC router file",
    },
    includeWarnings: {
      title: "Include Warnings",
      description: "Include warning messages in the output",
    },
    excludePatterns: {
      title: "Exclude Patterns",
      description: "Patterns to exclude from tRPC router generation",
    },
    success: {
      title: "Success",
    },
    generationCompleted: {
      title: "Generation Completed",
    },
    output: {
      title: "Output",
    },
    generationStats: {
      title: "Generation Stats",
    },
  },
  errors: {
    validation: {
      title: "Validation Error",
      description: "Invalid tRPC router generation parameters",
    },
    internal: {
      title: "Internal Error",
      description: "An error occurred during tRPC router generation",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You don't have permission to generate tRPC router",
    },
  },
  success: {
    title: "tRPC Router Generated",
    description: "tRPC router has been generated successfully",
  },
  validation: validationTranslations,
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
