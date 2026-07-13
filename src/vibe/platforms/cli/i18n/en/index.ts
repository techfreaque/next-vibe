export const translations = {
  setup: {
    install: {
      post: {
        title: "Install",
        description: "Install endpoint",
        form: {
          title: "Install Configuration",
          description: "Configure install parameters",
        },
        response: {
          title: "Response",
          description: "Install response data",
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
        },
        success: {
          title: "Success",
          description: "Operation completed successfully",
        },
      },
    },
    status: {
      post: {
        title: "CLI Installation Status",
        description: "Check the current installation status of the Vibe CLI",
        form: {
          title: "Status Configuration",
          description: "Configure status parameters",
        },
        response: {
          title: "Installation Status",
          description: "Current CLI installation details",
          fields: {
            success: "Operation Status",
            installed: "Installed",
            version: "CLI Version",
            path: "Installation Path",
            message: "Status Message",
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
        },
        success: {
          title: "Success",
          description: "Operation completed successfully",
        },
      },
    },
    uninstall: {
      post: {
        title: "Uninstall",
        description: "Uninstall endpoint",
        form: {
          title: "Uninstall Configuration",
          description: "Configure uninstall parameters",
        },
        response: {
          title: "Response",
          description: "Uninstall response data",
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
        },
        success: {
          title: "Success",
          description: "Operation completed successfully",
        },
      },
    },
    update: {
      post: {
        title: "Update",
        description: "Update endpoint",
        form: {
          title: "Update Configuration",
          description: "Configure update parameters",
        },
        response: {
          title: "Response",
          description: "Update response data",
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
        },
        success: {
          title: "Success",
          description: "Operation completed successfully",
        },
      },
    },
  },
  request: "Request",
  response: {
    success: "Response",
    error: "Error",
  },
  auth: {
    errors: {
      userNotFound:
        "CLI user with email {{email}} not found in database. Please run 'vibe seed' first.",
      databaseError: "Database error while fetching CLI user: {{error}}",
      authNotAvailable: "Authentication is not available",
    },
  },
  vibe: {
    noFields: "No fields to display",
    startingUp: "Starting up Vibe CLI...",
    executeCommand: "Executing command",
    executing: "Executing",
    listCommands: "List all available commands",
    output: "Output format",
    utils: {
      debug: {
        executionSummary:
          "Execution: {{executionSeconds}}s | Overhead: {{overheadSeconds}}s | Total: {{totalSeconds}}s",
      },
    },
    help: {
      title: "Vibe CLI Help",
      description: "Vibe CLI - Next-generation API execution tool",
      usage: "Usage: vibe <command> [options]",
      commands: "Available commands",
      options: "Options",
      examples: "Examples",
      locale: "Specify locale (en-GLOBAL, de-DE, pl-PL)",
      verbose: "Enable verbose output",
      dryRun: "Perform a dry run without executing",
      target:
        "Execution target: dev (default), local (preview DB), or remote (HTTP via NEXT_PUBLIC_PROJECT_URL)",
      interactive: "Enter interactive mode",
    },
    errors: {
      routeNotFound: "Tool not found: {{toolName}}",
      executionFailed: "Execution failed",
      unknownError: "Unknown error occurred",
      publicPayloadNotSupported: "Public payload not supported",
      invalidTokenPayload: "Invalid token payload",
      invalidToken: "Invalid token",
      signingFailed: "Token signing failed",
      userNotFound: "User not found",
      authenticationFailed: "Authentication failed",
      invalidFormat: "Invalid session format",
      sessionExpired: "Session expired",
      notFound: "Session not found",
      readFailed: "Failed to read session",
      invalidData: "Invalid session data",
      writeFailed: "Failed to write session",
      deleteFailed: "Failed to delete session",
      storeFailed: "Failed to store session",
      clearFailed: "Failed to clear session",
      setLeadIdCookieFailed: "Failed to set lead ID cookie",
      remoteNoToken: "Remote session has no active token",
      remoteExpired: "Remote session expired",
      remoteNotFound:
        "No remote session found. Run: vibe login --target remote",
      remoteReadFailed: "Failed to read remote session",
      remoteWriteFailed: "Failed to write remote session",
      remoteClearFailed: "Failed to clear remote session",
      remoteNotLoggedIn:
        "Not logged in to remote host. Run: vibe login --target remote",
      remoteNoLeadId: "Could not obtain identity from remote host",
      remoteServerError: "Remote server error",
    },
    endpoints: {
      endpointHandler: {
        error: {
          form_validation_failed: "Form validation failed",
          unauthorized: "Unauthorized access",
          errors: {
            unknown_validation_error: "Unknown validation error",
            invalid_request_data: "Invalid request data",
            invalid_url_parameters: "Invalid URL parameters",
          },
          general: {
            internal_server_error: "Internal server error",
          },
        },
      },
      renderers: {
        cliUi: {
          helpHandler: {
            noDescription: "No description available",
            flagDataDesc: "Provide request data as JSON",
            flagUserTypeDesc: "Specify user type (admin, customer, public)",
            flagLocaleDesc: "Specify locale (en-GLOBAL, de-DE, pl-PL)",
            flagOutputDesc: "Output format (pretty, json)",
            flagVerboseDesc: "Enable verbose output",
            flagDryRunDesc: "Perform a dry run without executing",
            usageLabel: "Usage",
            availableCommandsLabel: "Available Commands",
            globalOptionsLabel: "Global Options",
            examplesLabel: "Examples",
          },
          noEndpoint:
            "This feature is not available yet. Please try again later",
          widgets: {
            common: {
              noDataAvailable: "No data available",
              noIssuesFound: "No issues found",
              invalidDataFormat: "Invalid data format",
              invalidFormType:
                "Form context is not an Ink form state. Cannot render interactive input.",
              info: "Info",
              items: "items",
              andMoreItems: "and {{count}} more items",
              affectedFiles: "Affected Files",
              summary: "Summary",
              files: "Files",
              issues: "Issues",
              other: "Other",
              error: "Error",
              errors: "Errors",
              warning: "Warning",
              warnings: "Warnings",
              hints: {
                spaceToToggle: "(space to toggle)",
                arrowsToChange: "(←/→ to change)",
                dollarPrompt: "$ ",
                executing: "Executing...",
                tabNextField: "tab: next field | enter: submit | q/esc: exit",
                ctrlCExitHint: "Press Ctrl+C again to exit",
              },
            },
            pagination: {
              notImplemented:
                "Pagination not implemented for CLI. Use filters to narrow results.",
            },
          },
        },
      },
    },
    interactive: {
      welcome: "Welcome to Vibe Interactive Mode",
      goodbye: "Goodbye!",
      help: {
        selectCategory: "Select a category to browse tools",
        selectTool: "Select a tool to view details",
        category: "Category  ",
        method: "Method  ",
        credits: "Credits  ",
        callAs: "Call as   ",
        fields: "Fields",
        hintsNavSelect: "arrows: navigate | enter: select | q: quit",
        hintsNavSelectBack:
          "arrows: navigate | enter: select | esc: back | q: quit",
        hintsExecuteBack: "enter: execute | esc: back | q: quit",
        hintsBack: "enter/esc: back | q: quit",
        success: "Success",
        error: "Error",
        result: "Result",
      },
      navigation: {
        rootName: "Root",
        directoryIcon: "📁",
        upIcon: "⬆️",
        goUp: "Go Up",
        routeIcon: "🔗",
        routes: "Routes",
        settingsIcon: "⚙️",
        settings: "Settings",
        exitIcon: "🚪",
        exit: "Exit",
        navigate: "Navigate",
        route: "Route",
        method: "Method",
        description: "Description",
        noDefinition: "No definition found",
        executionFailed: "Execution failed",
        executeAnother: "Execute another",
        selectLocale: "Select locale",
        englishGlobal: "English (Global)",
        requestData: "Request Data",
        urlParameters: "URL Parameters",
        preview: "Preview",
        executeWithParams: "Execute with parameters",
        navigationError: "Navigation error",
        chooseSettingToModify: "Choose setting to modify",
        outputFormatCurrent: "Output Format (current",
        verboseModeCurrent: "Verbose Mode (current",
        localeCurrent: "Locale (current",
        backToMainMenu: "Back to Main Menu",
        chooseOutputFormat: "Choose output format",
        prettyFormatted: "Pretty Formatted",
        jsonRaw: "JSON (Raw)",
        enableVerboseOutput: "Enable verbose output",
        chooseLocale: "Choose locale",
        german: "German",
        polish: "Polish",
        settingUpdated: "Setting updated successfully",
        viewAllRoutes: "View All Routes",
        selectRoute: "Select a route to execute",
        backToNavigation: "Back to Navigation",
      },
    },
  },
};
