export const translations = {
  category: "Generators",
  clientRoutesIndex: {
    category: "Generators",

    post: {
      title: "Generate Client Routes Index",
      description: "Automatically generate the client routes index file",
      container: {
        title: "Client Routes Index Generator",
      },
      fields: {
        outputFile: {
          label: "Output File",
          description: "Path to the output file",
        },
        dryRun: {
          label: "Dry Run",
          description: "Preview changes without writing to file",
        },
        success: {
          title: "Success",
        },
        message: {
          title: "Message",
        },
        routesFound: {
          title: "Routes Found",
        },
        duration: {
          title: "Duration (ms)",
        },
      },
      errors: {
        validation: {
          title: "Invalid Input",
          description: "Please check your configuration and try again",
        },
        network: {
          title: "Connection Error",
          description: "Unable to generate the index. Please try again",
        },
        unauthorized: {
          title: "Sign In Required",
          description: "Please sign in to use this generator",
        },
        forbidden: {
          title: "Access Denied",
          description: "You don't have permission to use this generator",
        },
        notFound: {
          title: "Routes Not Found",
          description: "Unable to find the routes to generate",
        },
        server: {
          title: "Generation Failed",
          description: "We couldn't generate the index. Please try again",
        },
        unknown: {
          title: "Unexpected Error",
          description: "Something unexpected happened. Please try again",
        },
        conflict: {
          title: "File Conflict",
          description:
            "The index file has conflicts. Please resolve them first",
        },
      },
      success: {
        title: "Index Generated",
        description: "Client routes index has been generated successfully",
      },
    },
  },
  emailTemplates: {
    category: "Generators",

    post: {
      title: "Generate Email Templates",
      description: "Generate email template registry with lazy loading",
      container: {
        title: "Email Template Generator Configuration",
      },
      success: {
        title: "Generation Complete",
        description: "Email templates generated successfully",
      },
      fields: {
        outputFile: {
          label: "Output File",
          description: "Path to generated registry file",
        },
        dryRun: {
          label: "Dry Run",
          description: "Preview changes without writing files",
        },
        success: {
          title: "Success",
        },
        message: {
          title: "Result Message",
        },
        templatesFound: {
          title: "Templates Found",
        },
        duration: {
          title: "Generation Duration (ms)",
        },
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Invalid email template generator parameters",
        },
        network: {
          title: "Network Error",
          description: "Network error during template generation",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "You are not authorized to generate templates",
        },
        forbidden: {
          title: "Forbidden",
          description: "Template generation is forbidden",
        },
        notFound: {
          title: "Not Found",
          description: "Template directory not found",
        },
        server: {
          title: "Server Error",
          description: "Failed to generate email templates",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unknown error occurred",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
        conflict: {
          title: "Conflict",
          description: "A conflict occurred during generation",
        },
      },
    },
    success: {
      generated: "Email template registry generated successfully",
    },
  },
  endpoint: {
    category: "Generators",

    post: {
      title: "Endpoint Generator",
      description: "Generate endpoint.ts with dynamic imports",
      container: {
        title: "Endpoint Generator Configuration",
      },
      fields: {
        outputFile: {
          label: "Output File",
          description: "Path to the output endpoint.ts file",
          title: "Output File",
        },
        dryRun: {
          label: "Dry Run",
          description: "Preview changes without writing files",
          title: "Dry Run",
        },
        success: {
          title: "Success",
        },
        message: {
          title: "Message",
        },
        endpointsFound: {
          title: "Endpoints Found",
        },
        duration: {
          title: "Duration (ms)",
        },
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Invalid request parameters",
        },
        server: {
          title: "Server Error",
          description: "Internal server error occurred",
        },
      },
      success: {
        title: "Success",
        description: "Endpoint generator completed successfully",
        generated: "Endpoint file generated successfully",
      },
    },
  },
  env: {
    category: "Generators",

    post: {
      title: "Environment Generator",
      description: "Generate consolidated environment configuration files",
      form: {
        title: "Environment Configuration",
        description: "Configure environment generation parameters",
      },
      fields: {
        outputDir: {
          label: "Output Directory",
          description: "Directory to write generated files",
        },
        verbose: {
          label: "Verbose",
          description: "Show detailed output",
        },
        dryRun: {
          label: "Dry Run",
          description: "Preview without writing files",
        },
        success: {
          label: "Success",
        },
        message: {
          label: "Message",
        },
        serverEnvFiles: {
          label: "Server Env Files",
        },
        clientEnvFiles: {
          label: "Client Env Files",
        },
        duration: {
          label: "Duration",
        },
        outputPaths: {
          label: "Output Paths",
        },
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        validation: {
          title: "Validation Error",
          description: "Invalid env file exports detected",
        },
        server: {
          title: "Server Error",
          description: "Internal server error occurred",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unknown error occurred",
        },
        network: {
          title: "Network Error",
          description: "Network error occurred",
        },
        forbidden: {
          title: "Forbidden",
          description: "Access forbidden",
        },
        notFound: {
          title: "Not Found",
          description: "Resource not found",
        },
        conflict: {
          title: "Conflict",
          description: "Data conflict occurred",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "There are unsaved changes",
        },
      },
      success: {
        title: "Success",
        description: "Environment files generated successfully",
      },
    },
    tags: {
      env: "environment",
    },
    error: {
      validation_failed: "Env file validation failed",
      generation_failed: "Env generation failed",
      noValidFiles: "No valid environment files found",
    },
    success: {
      generated: "Environment files generated successfully",
    },
  },
  generateAll: {
    category: "Generators",

    post: {
      title: "Generate All",
      description: "Run all code generators",
      container: {
        title: "Generate All Configuration",
        description: "Configure generation parameters",
      },
      fields: {
        rootDir: {
          label: "Root Directory",
          description: "Root directory for generation",
        },
        outputDir: {
          label: "Output Directory",
          description: "Output directory for generated files",
        },
        verbose: {
          label: "Verbose Output",
          description: "Enable verbose logging",
        },
        skipEndpoints: {
          label: "Skip Endpoints",
          description: "Skip endpoint generation",
        },
        skipSeeds: {
          label: "Skip Seeds",
          description: "Skip seed generation",
        },
        skipTaskIndex: {
          label: "Skip Task Index",
          description: "Skip task index generation",
        },
        enableTrpc: {
          label: "Enable tRPC",
          description: "Generate the tRPC router (opt-in)",
        },
        skipTanstack: {
          label: "Skip TanStack",
          description: "Skip TanStack route generation",
        },
        force: {
          label: "Force",
          description: "Ignore cached hashes and run all generators",
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
          title: "Generation Statistics",
        },
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        validation: {
          title: "Validation Error",
          description: "Invalid request parameters",
        },
        server: {
          title: "Server Error",
          description: "Internal server error occurred",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unknown error occurred",
        },
        network: {
          title: "Network Error",
          description: "Network error occurred",
        },
        forbidden: {
          title: "Forbidden",
          description: "Access forbidden",
        },
        notFound: {
          title: "Not Found",
          description: "Resource not found",
        },
        conflict: {
          title: "Conflict",
          description: "Data conflict occurred",
        },
        internal: {
          title: "Internal Error",
          description: "Internal server error occurred",
        },
      },
      success: {
        title: "Success",
        description: "Operation completed successfully",
      },
    },
  },
  generateTrpcRouter: {
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
    validation: {
      title: "TRPC Validation",
      description: "Validate TRPC integration across route files",
      category: "Generators",
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
          description: "Select validation operation to perform",
          placeholder: "Choose operation",
        },
        filePath: {
          label: "File Path",
          description: "Specific route file path to validate",
          placeholder: "Enter file path",
        },
        options: {
          label: "Options",
          description: "Validation options",
          placeholder: "Enter options",
        },
      },
      response: {
        operation: {
          label: "Operation",
        },
        success: {
          label: "Success",
        },
        result: {
          label: "Result",
        },
      },
      success: {
        title: "TRPC Validation Successful",
        description: "TRPC validation completed successfully",
      },
      errors: {
        validation: {
          title: "Validation Failed",
          description: "TRPC validation failed",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "You are not authorized to perform this action",
        },
        forbidden: {
          title: "Forbidden",
          description: "You do not have permission to perform this action",
        },
        notFound: {
          title: "Not Found",
          description: "The requested resource was not found",
        },
        server: {
          title: "Server Error",
          description: "An internal server error occurred",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unknown error occurred",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "There are unsaved changes",
        },
        conflict: {
          title: "Conflict",
          description: "A conflict occurred",
        },
        network: {
          title: "Network Error",
          description: "A network error occurred",
        },
        executionFailed: {
          title: "Execution Failed",
          description: "TRPC validation operation execution failed",
        },
      },
    },
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
  },
  routeHandlers: {
    category: "Generators",

    post: {
      title: "Route Handlers Generator",
      description: "Generate route-handlers.ts with dynamic imports",
      container: {
        title: "Route Handlers Generator Configuration",
      },
      fields: {
        outputFile: {
          label: "Output File",
          description: "Path to the output route-handlers.ts file",
          title: "Output File",
        },
        dryRun: {
          label: "Dry Run",
          description: "Preview changes without writing files",
          title: "Dry Run",
        },
        success: {
          title: "Success",
        },
        message: {
          title: "Message",
        },
        routesFound: {
          title: "Routes Found",
        },
        duration: {
          title: "Duration (ms)",
        },
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Invalid request parameters",
        },
        server: {
          title: "Server Error",
          description: "Internal server error occurred",
        },
      },
      success: {
        title: "Success",
        description: "Route handlers generator completed successfully",
        generated: "Route handlers file generated successfully",
      },
    },
  },
  seeds: {
    category: "Generators",

    post: {
      title: "Seeds",
      description: "Seeds endpoint",
      form: {
        title: "Seeds Configuration",
        description: "Configure seeds parameters",
      },
      response: {
        title: "Response",
        description: "Seeds response data",
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        validation: {
          title: "Validation Error",
          description: "Invalid request parameters",
        },
        server: {
          title: "Server Error",
          description: "Internal server error occurred",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unknown error occurred",
        },
        network: {
          title: "Network Error",
          description: "Network error occurred",
        },
        forbidden: {
          title: "Forbidden",
          description: "Access forbidden",
        },
        notFound: {
          title: "Not Found",
          description: "Resource not found",
        },
        conflict: {
          title: "Conflict",
          description: "Data conflict occurred",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "There are unsaved changes",
        },
      },
      success: {
        title: "Success",
        description: "Operation completed successfully",
        generated: "Seeds generated successfully",
      },
    },
    error: {
      generation_failed: "Seeds generation failed",
    },
    success: {
      generated: "Seeds generated successfully",
    },
  },
  taskIndex: {
    category: "Generators",

    post: {
      title: "Generate Task Index",
      description: "Generate task index files",
      container: {
        title: "Task Index Generation",
        description: "Configure task index generation parameters",
      },
      fields: {
        outputDir: {
          label: "Output Directory",
          description: "Directory for generated task index files",
        },
        verbose: {
          label: "Verbose Output",
          description: "Enable verbose logging",
        },
        duration: {
          title: "Duration",
        },
        success: {
          title: "Success",
        },
        message: {
          title: "Message",
        },
        tasksFound: {
          title: "Tasks Found",
        },
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        validation: {
          title: "Validation Error",
          description: "Invalid request parameters",
        },
        server: {
          title: "Server Error",
          description: "Internal server error occurred",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unknown error occurred",
        },
        network: {
          title: "Network Error",
          description: "Network error occurred",
        },
        forbidden: {
          title: "Forbidden",
          description: "Access forbidden",
        },
        notFound: {
          title: "Not Found",
          description: "Resource not found",
        },
        conflict: {
          title: "Conflict",
          description: "Data conflict occurred",
        },
        internal: {
          title: "Internal Error",
          description: "Internal server error occurred",
        },
        unsaved: {
          title: "Unsaved Changes",
          description: "There are unsaved changes",
        },
      },
      success: {
        title: "Success",
        description: "Operation completed successfully",
      },
    },
  },
};
