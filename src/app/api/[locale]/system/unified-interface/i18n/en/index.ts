export const translations = {
  ai: {
    executeTool: {
      post: {
        title: "Execute Tool",
        dynamicTitle: "Execute: {{toolName}}",
        description:
          "Execute any registered endpoint by name. Pass the tool's name and its input parameters. The target route enforces its own authentication - this endpoint is a universal dispatcher for MCP, AI agents, and automation.",
        container: {
          title: "Tool Execution",
          description: "Route name and input parameters",
        },
        fields: {
          toolName: {
            label: "Tool Name",
            description:
              "The registered tool name or alias to execute (e.g. 'agent_chat_characters_GET'). Use tool-help to discover available tools.",
            placeholder: "agent_chat_characters_GET",
          },
          input: {
            label: "Input",
            description:
              "Input parameters for the tool as a JSON object. URL path params (e.g. id) are automatically extracted from this object.",
          },
          instanceId: {
            label: "Instance ID",
            description:
              'Optional remote instance ID. When set, creates an async task on the remote instance instead of executing locally. Result will be {taskId, status:"pending"}.',
          },
          callbackMode: {
            label: "Callback Mode",
            description:
              '"wait": execute synchronously, return result inline (default). "detach": fire-and-forget, returns {taskId} immediately - use await-task later if needed. "wakeUp": fire-and-forget, result is automatically injected into the thread when ready - do NOT call await-task. "endLoop": execute normally and return the result, but stop the tool loop after this batch - no further tool calls this turn (parallel sibling calls in the same batch still run). "approve": require user confirmation before executing.',
          },
        },
        response: {
          result:
            "The result data returned by the target route. On failure this field is absent - the response itself will be an error.",
          resultLabel: "Result",
        },
        errors: {
          validation: {
            title: "Validation Error",
            description: "toolName or input parameters are invalid",
          },
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required to call this endpoint",
          },
          forbidden: {
            title: "Forbidden",
            description: "Access denied",
          },
          notFound: {
            title: "Tool Not Found",
            description: "No registered tool matches the given toolName",
          },
          server: {
            title: "Execution Error",
            description: "The target route encountered a server error",
          },
          network: {
            title: "Network Error",
            description: "Network error during tool execution",
          },
          unknown: {
            title: "Unknown Error",
            description: "An unexpected error occurred during execution",
          },
        },
        success: {
          title: "Tool Executed",
          description: "The tool was executed successfully",
        },
        widget: {
          enterToolName: "Enter a tool name to load its form.",
          resolving: "Resolving endpoint…",
          unknownTool: "Unknown tool: {{toolName}}",
        },
        actions: {
          confirm: "Confirm",
          cancel: "Cancel",
        },
      },
    },
    tools: {
      // Translations moved to system/help/get - see system/help/i18n/en/index.ts
      get: {
        title: "Tool Help - Discover Available Tools",
        description:
          "Search and discover all AI tools available to you. Use query to search by name, description, or alias. Use category to filter by tool category. Returns tool names, descriptions, aliases, and metadata.",
        category: "AI Tools",
        tags: {
          tools: "tools",
        },
      },
    },
    executor: {
      errors: {
        toolNotFound: "Tool not found: {{toolName}}",
        parameterValidationFailed: "Parameter validation failed: {{errors}}",
        executionFailed: "Tool execution failed",
      },
    },
    factory: {
      errors: {
        executionFailed: "Tool execution failed",
      },
      descriptions: {
        noParametersRequired: "No parameters required for this endpoint",
      },
    },
    converter: {
      constants: {
        examplePrefix: "\n\nExample: ",
        underscore: "_",
        dollarOne: "$1",
        dollarTwo: "$2",
        space: " ",
        endpointForPrefix: "Endpoint for ",
        hiddenPlaceholder: "[hidden]",
      },
    },
    discovery: {
      constants: {
        underscore: "_",
        dollarOne: "$1",
        dollarTwo: "$2",
      },
    },
    registry: {
      errors: {
        initializationFailed: "Tool registry initialization failed",
      },
    },
  },
  cli: {
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
  },
  mcp: {
    tools: {
      category: "MCP Tools",
      tags: {
        mcp: "MCP",
      },
      get: {
        title: "List MCP Tools",
        description: "Get all available MCP tools for current user",
        fields: {
          name: "Tool Name",
          description: "Description",
          inputSchema: "Input Schema",
        },
        response: {
          title: "MCP Tools List",
          description: "List of available MCP tools",
        },
        errors: {
          validation: {
            title: "Validation Failed",
            description: "Invalid request parameters",
          },
          network: {
            title: "Network Error",
            description: "Failed to connect to server",
          },
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required",
          },
          forbidden: {
            title: "Forbidden",
            description: "You don't have permission to access this resource",
          },
          notFound: {
            title: "Not Found",
            description: "Resource not found",
          },
          server: {
            title: "Server Error",
            description: "Internal server error occurred",
          },
          unknown: {
            title: "Unknown Error",
            description: "An unexpected error occurred",
          },
          unsavedChanges: {
            title: "Unsaved Changes",
            description: "You have unsaved changes",
          },
          conflict: {
            title: "Conflict",
            description: "Resource conflict detected",
          },
        },
        success: {
          title: "Success",
          description: "Tools retrieved successfully",
        },
      },
    },
    execute: {
      category: "MCP Execute",
      tags: {
        mcp: "MCP",
      },
      post: {
        title: "Execute MCP Tool",
        description: "Execute an MCP tool by name with arguments",
        fields: {
          title: "Tool Execution Parameters",
          description: "Parameters for tool execution",
          name: {
            title: "Tool Name",
            description:
              "Name of the tool to execute (e.g., core:system:db:ping)",
            placeholder: "core:system:db:ping",
          },
          arguments: {
            title: "Arguments",
            description: "Tool arguments as key-value pairs",
            placeholder: "{}",
          },
        },
        response: {
          title: "Tool Execution Result",
          description: "Result of tool execution",
          result: {
            content: {
              type: "Content Type",
              text: "Content",
            },
            isError: "Is Error",
          },
        },
        errors: {
          validation: {
            title: "Validation Failed",
            description: "Invalid tool name or arguments",
          },
          network: {
            title: "Network Error",
            description: "Failed to connect to server",
          },
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required",
          },
          forbidden: {
            title: "Forbidden",
            description: "You don't have permission to execute this tool",
          },
          notFound: {
            title: "Tool Not Found",
            description: "The specified tool does not exist",
          },
          server: {
            title: "Server Error",
            description: "Tool execution failed",
          },
          unknown: {
            title: "Unknown Error",
            description: "An unexpected error occurred",
          },
          unsavedChanges: {
            title: "Unsaved Changes",
            description: "You have unsaved changes",
          },
          conflict: {
            title: "Conflict",
            description: "Resource conflict detected",
          },
        },
        success: {
          title: "Success",
          description: "Tool executed successfully",
        },
      },
    },
    serve: {
      category: "MCP Server",
      tags: {
        mcp: "MCP",
      },
      post: {
        title: "Start MCP Server",
        description: "Start the Model Context Protocol server",
        response: {
          title: "MCP Server Status",
          description: "Status of the MCP server",
        },
        errors: {
          validation: {
            title: "Validation Failed",
            description: "Invalid request parameters",
          },
          server: {
            title: "Server Error",
            description: "Failed to start MCP server",
          },
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required",
          },
        },
        success: {
          title: "Success",
          description: "MCP server started successfully",
        },
      },
    },
    registry: {
      toolNotFound: "Tool not found",
      endpointNotFound: "Endpoint not found",
      permissionDenied: "Permission denied",
      toolExecutionFailed: "Tool execution failed",
    },
  },
  react: {
    hooks: {
      localstorage: {
        noCallback: "No callback provided for localStorage operation",
      },
      apiUtils: {
        errors: {
          http_error: "HTTP Error",
          validation_error: "Validation Error",
          internal_error: "Internal Error",
          auth_required: "Authentication Required",
        },
      },
      mutationForm: {
        post: {
          errors: {
            mutation_failed: {
              title: "Mutation Failed",
            },
            validation_error: {
              title: "Validation Error",
            },
          },
        },
      },
      queryForm: {
        errors: {
          network_failure: "Network failure",
          validation_failed: "Validation failed",
        },
      },
      store: {
        errors: {
          validation_failed: "Validation failed",
          request_failed: "Request failed",
          mutation_failed: "Mutation failed",
          unexpected_failure: "Unexpected failure",
          refetch_failed: "Refetch failed",
        },
        status: {
          loading_data: "Loading data...",
          cached_data: "Using cached data",
          success: "Success",
          mutation_pending: "Mutation pending...",
          mutation_success: "Mutation successful",
        },
      },
    },
    widgets: {
      endpointRenderer: {
        submit: "Submit",
        submitting: "Submitting...",
        cancel: "Cancel",
      },
      container: {
        noContent: "No content",
      },
      dataTable: {
        showingResults: "Showing {{count}} of {{total}} results",
        noData: "No data available",
      },
      dataList: {
        noData: "No data available",
        showMore: "Show {{count}} more",
        showLess: "Show less",
        viewList: "List View",
        viewGrid: "Grid View",
      },
      groupedList: {
        showMore: "Show {{count}} more",
      },
      linkList: {
        noResults: "No results found",
      },
      link: {
        invalidData: "Invalid link data",
      },
      markdown: {
        noContent: "No content",
      },
      errorBoundary: {
        title: "Widget Error",
        errorDetails: "Error Details",
        defaultMessage: "An error occurred while rendering this widget",
      },
      formField: {
        requiresContext:
          "Form field requires form context and field configuration",
      },
      rangeSlider: {
        min: "Min",
        max: "Max",
      },
      error: {
        title: "Error",
      },
      filterPills: {
        requiresContext:
          "Filter pills widget requires form context and field name",
      },
      toolCall: {
        status: {
          error: "Error",
          executing: "Executing...",
          complete: "Complete",
          waitingForTask: "Waiting for task...",
          completeWaitForTask: "Complete (waited)",
          sentToBackground: "Sent to background",
          wakeUpBackground: "Background task - AI will wake up with result",
          waitingForRemote: "Waiting for remote...",
          deferred: "Async result",
          confirmed: "Confirmed by you",
          confirmedWakeUp: "Confirmed - running in background",
          waitingForConfirmation: "Waiting for confirmation",
          waitingForConfirmationWakeUp: "Confirm to run in background",
          pendingConfirmation: "Pending Confirmation",
          pendingCancellation: "Pending Cancellation",
          denied: "Denied",
          deniedWakeUp: "Denied - won't run in background",
          notRun: "Not run",
        },
        sections: {
          request: "Request",
          response: "Response",
        },
        messages: {
          executingTool: "Executing tool...",
          deferredResult:
            "This result arrived asynchronously after the original stream ended.",
          taskId: "Task ID:",
          errorLabel: "Error:",
          noArguments: "No arguments",
          noResult: "No result",
          metadataNotAvailable:
            "Widget metadata not available. Showing raw result.",
          confirmationRequired:
            "Review and edit parameters, then confirm to execute.",
          confirmationRequiredWakeUp:
            "Review and edit parameters, then confirm to run in background - result will wake up AI.",
        },
        actions: {
          confirm: "Confirm",
          cancel: "Cancel",
          deny: "Deny",
        },
        creditsUsed_one: "{{cost}} credit",
        creditsUsed_other: "{{cost}} credits",
      },
      codeQualityList: {
        noData: "No code quality issues found",
        rule: "Rule: {{rule}}",
      },
      section: {
        noData: "No section data available",
      },
      title: {
        noData: "No title data available",
      },
      chart: {
        noDataAvailable: "No data available",
        noDataToDisplay: "No data to display",
        total: "Total",
      },
      creditTransactionList: {
        invalidConfig: "Invalid credit transaction list configuration",
        noTransactions: "No transactions found",
      },
      pagination: {
        showing: "Showing {{start}}-{{end}} of {{total}} items",
        itemsPerPage: "Items per page",
        page: "Page {{current}} of {{total}}",
      },
    },
  },
  reactNative: {
    errors: {
      missingUrlParam: "Missing URL parameter",
      urlConstructionFailed: "URL construction failed",
      validationFailed: "Validation failed",
      htmlResponseReceived: "HTML response received instead of JSON",
      networkError: "Network error occurred",
      failedToLoadPage: "Failed to load page",
    },
    generate: {
      post: {
        title: "Generate Expo Indexes",
        description:
          "Generate Expo Router compatibility wrappers for Next.js pages",
        response: {
          fields: {
            success: "Success",
            created: "Created Files",
            skipped: "Skipped Files",
            errors: "Errors",
            message: "Message",
          },
        },
        errors: {
          validation: {
            title: "Validation Error",
            description: "Invalid request parameters",
          },
          unauthorized: {
            title: "Unauthorized",
            description: "You are not authorized to perform this action",
          },
          server: {
            title: "Server Error",
            description: "An error occurred while generating indexes",
          },
          network: {
            title: "Network Error",
            description: "A network error occurred",
          },
          forbidden: {
            title: "Forbidden",
            description: "You do not have permission to perform this action",
          },
          notFound: {
            title: "Not Found",
            description: "Source directory not found",
          },
          unknown: {
            title: "Unknown Error",
            description: "An unknown error occurred",
          },
          conflict: {
            title: "Conflict",
            description: "A conflict occurred",
          },
        },
        success: {
          title: "Success",
          description:
            "Generated {{created}} files, skipped {{skipped}} files, {{errors}} errors",
        },
      },
    },
  },
  tasks: {
    category: "Task Management",
    tags: {
      tasks: "Tasks",
    },
    type: {
      cron: "Cron Task",
      side: "Side Task",
      task_runner: "Task Runner",
    },
    priority: {
      critical: "Critical",
      high: "High",
      medium: "Medium",
      low: "Low",
      background: "Background",
      filter: {
        all: "All Priorities",
        highAndAbove: "High and Above",
        mediumAndAbove: "Medium and Above",
      },
    },
    status: {
      pending: "Pending",
      running: "Running",
      completed: "Completed",
      failed: "Failed",
      timeout: "Timeout",
      cancelled: "Cancelled",
      skipped: "Skipped",
      blocked: "Blocked",
      scheduled: "Scheduled",
      stopped: "Stopped",
      error: "Error",
      filter: {
        all: "All Statuses",
        active: "Active",
        error: "Error States",
      },
    },
    taskCategory: {
      development: "Development",
      build: "Build",
      watch: "Watch",
      generator: "Generator",
      test: "Test",
      maintenance: "Maintenance",
      database: "Database",
      system: "System",
      monitoring: "Monitoring",
      leadManagement: "Lead Management",
    },
    enabledFilter: {
      all: "All",
      enabled: "Enabled",
      disabled: "Disabled",
    },
    hiddenFilter: {
      visible: "Visible",
      hidden: "Hidden",
      all: "All",
    },
    sort: {
      asc: "Ascending",
      desc: "Descending",
    },
    pulse: {
      health: {
        healthy: "Healthy",
        warning: "Warning",
        critical: "Critical",
        unknown: "Unknown",
      },
      execution: {
        success: "Success",
        failure: "Failure",
        timeout: "Timeout",
        cancelled: "Cancelled",
        pending: "Pending",
      },
    },
    cron: {
      frequency: {
        everyMinute: "every minute",
        everyMinutes: "every {{interval}} minutes",
        everyHour: "every hour",
        everyDays: "every day",
        hourly: "hourly",
      },
      days: {
        sunday: "Sunday",
        monday: "Monday",
        tuesday: "Tuesday",
        wednesday: "Wednesday",
        thursday: "Thursday",
        friday: "Friday",
        saturday: "Saturday",
      },
      common: {
        dailyAtMidnight: "daily at midnight",
        dailyAtNoon: "daily at noon",
        weeklyOnSunday: "weekly on Sunday",
        monthlyOnFirst: "monthly on the 1st",
        everyFiveMinutes: "every 5 minutes",
        everyThreeMinutes: "every 3 minutes",
        everyOneMinutes: "every minute",
        everyTenMinutes: "every 10 minutes",
        everyFifteenMinutes: "every 15 minutes",
        everyThirtyMinutes: "every 30 minutes",
      },
      patterns: {
        everyIntervalMinutes: "every {{interval}} minutes",
        everyIntervalMinutesStarting:
          "every {{interval}} minutes starting at minute {{start}}",
        atMinutes: "at minutes {{minutes}}",
        fromMinuteToMinute: "from minute {{from}} to {{to}}",
        atMinute: "at minute {{minute}}",
        everyIntervalHours: "every {{interval}} hours",
        everyIntervalHoursStarting:
          "every {{interval}} hours starting at hour {{start}}",
        atHours: "at hours {{hours}}",
        fromHourToHour: "from hour {{from}} to {{to}}",
        atHour: "at hour {{hour}}",
      },
      calendar: {
        onDays: "on days {{days}}",
        onDay: "on day {{day}}",
        inMonths: "in {{months}}",
        inMonth: "in {{month}}",
        onWeekdays: "on {{days}}",
        fromWeekdayToWeekday: "from {{start}} to {{end}}",
        onWeekday: "on {{day}}",
      },
      timezone: "in {{timezone}}",
      time: {
        midnight: "midnight",
        noon: "noon",
        hourAm: "{{hour}} AM",
        hourPm: "{{hour}} PM",
        hourMinuteAm: "{{hour}}:{{minute}} AM",
        hourMinutePm: "{{hour}}:{{minute}} PM",
      },
      weekdays: {
        sunday: "Sunday",
        monday: "Monday",
        tuesday: "Tuesday",
        wednesday: "Wednesday",
        thursday: "Thursday",
        friday: "Friday",
        saturday: "Saturday",
      },
      months: {
        january: "January",
        february: "February",
        march: "March",
        april: "April",
        may: "May",
        june: "June",
        july: "July",
        august: "August",
        september: "September",
        october: "October",
        november: "November",
        december: "December",
      },
    },
    errors: {
      // Cron Tasks errors
      fetchCronTasks: "Failed to fetch cron tasks",
      createCronTask: "Failed to create cron task",
      updateCronTask: "Failed to update cron task",
      deleteCronTask: "Failed to delete cron task",
      fetchCronTaskHistory: "Failed to fetch cron task history",
      fetchCronTaskStats: "Failed to fetch cron task statistics",
      fetchCronStatus: "Failed to fetch cron system status",
      cronTaskNotFound: "Cron task not found",

      // Unified Runner errors
      startTaskRunner: "Failed to start task runner",
      stopTaskRunner: "Failed to stop task runner",
      getTaskRunnerStatus: "Failed to get task runner status",
      executeCronTask: "Failed to execute cron task",

      // Pulse errors
      executePulse: "Failed to execute pulse",
      fetchPulseStatus: "Failed to fetch pulse status",
      pulseExecutionFailed: "Pulse execution failed",
      pulseInternalError: "Internal error in pulse system",

      // Validation errors
      invalidTaskInput:
        "Task input does not match the endpoint's request schema",
      endpointNotFound: "Endpoint not found for the given route ID",

      // Repository errors
      repositoryNotFound: "Resource not found",
      repositoryInternalError: "An internal error occurred",
      repositoryGetTaskForbidden:
        "You do not have permission to view this task",
      repositoryUpdateTaskForbidden:
        "You do not have permission to update this task",
      repositoryDeleteTaskForbidden:
        "You do not have permission to delete this task",

      // Task sync errors
      taskSyncListFailed: "Failed to list tasks for sync",
      taskSyncSyncFailed: "Failed to sync tasks from remote",
    },
    common: {
      cronRepositoryTaskUpdateFailed: "Failed to update cron task",
      cronRepositoryTaskDeleteFailed: "Failed to delete cron task",
      cronRepositoryExecutionCreateFailed:
        "Failed to create cron task execution",
      cronRepositoryExecutionUpdateFailed:
        "Failed to update cron task execution",
      cronRepositoryExecutionsFetchFailed:
        "Failed to fetch cron task executions",
      cronRepositoryRecentExecutionsFetchFailed:
        "Failed to fetch recent cron task executions",
      cronRepositorySchedulesFetchFailed: "Failed to fetch cron task schedules",
      cronRepositoryScheduleUpdateFailed: "Failed to update cron task schedule",
      cronRepositoryStatisticsFetchFailed:
        "Failed to fetch cron task statistics",
    },
    outputMode: {
      storeOnly: "Store Only",
      notifyOnFailure: "Notify on Failure",
      notifyAlways: "Notify Always",
    },
    dbHealthCheck: {
      name: "db-health-check",
      description: "Verifies database connection health every minute",
    },
    pulseRunner: {
      name: "pulse-runner",
      description:
        "Calls the pulse repository once per minute to trigger scheduled tasks",
    },
    devWatcher: {
      name: "dev-file-watcher",
      description:
        "Watches for file changes and triggers generators in development mode",
    },
    dbHealth: {
      tag: "Database",
      post: {
        title: "System Health Check",
        description: "Check database, memory, and disk health",
        container: {
          title: "System Health",
          description: "DB connectivity, memory usage, and disk usage",
        },
        response: {
          healthy: "Healthy",
          status: "Status",
          dbResponseMs: "DB Response (ms)",
          memoryUsedPct: "Memory Used (%)",
          heapUsedMb: "Heap Used (MB)",
          rssMb: "RSS (MB)",
          diskUsedPct: "Disk Used (%)",
          uptimeHours: "Uptime (hours)",
          warnings: "Warnings",
        },
        errors: {
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required",
          },
          forbidden: {
            title: "Forbidden",
            description: "Access denied",
          },
          server: {
            title: "Server Error",
            description: "Database health check failed",
          },
          unknown: {
            title: "Unknown Error",
            description: "An unexpected error occurred",
          },
          validation: {
            title: "Validation Error",
            description: "Invalid request parameters",
          },
          systemAlert: "System {{status}}: {{warnings}}",
        },
        success: {
          title: "DB Healthy",
          description: "Database connection is healthy",
        },
      },
    },
    taskSync: {
      name: "task-sync",
      description: "Periodically pulls new tasks from remote Thea instance",
      post: {
        title: "Sync Tasks",
        description: "Sync tasks from remote Thea instance",
        errors: {
          validation: {
            title: "Validation Error",
            description: "Invalid request parameters",
          },
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required",
          },
          internal: {
            title: "Internal Error",
            description: "Task sync failed",
          },
          forbidden: {
            title: "Forbidden",
            description: "Access denied",
          },
          notFound: {
            title: "Not Found",
            description: "Resource not found",
          },
          network: {
            title: "Network Error",
            description: "Network error occurred",
          },
          unknown: {
            title: "Unknown Error",
            description: "An unexpected error occurred",
          },
          unsaved: {
            title: "Unsaved Changes",
            description: "Unsaved changes detected",
          },
          conflict: {
            title: "Conflict",
            description: "A conflict occurred",
          },
        },
        success: {
          title: "Tasks Synced",
          description: "Tasks synced successfully",
        },
      },
      pull: {
        post: {
          title: "Pull Tasks",
          description: "Pull tasks from remote Thea instance",
          errors: {
            validation: {
              title: "Validation Error",
              description: "Invalid request parameters",
            },
            unauthorized: {
              title: "Unauthorized",
              description: "Authentication required",
            },
            internal: {
              title: "Internal Error",
              description: "Task pull failed",
            },
            forbidden: {
              title: "Forbidden",
              description: "Access denied",
            },
            notFound: {
              title: "Not Found",
              description: "Resource not found",
            },
            network: {
              title: "Network Error",
              description: "Network error occurred",
            },
            unknown: {
              title: "Unknown Error",
              description: "An unexpected error occurred",
            },
            unsaved: {
              title: "Unsaved Changes",
              description: "Unsaved changes detected",
            },
            conflict: {
              title: "Conflict",
              description: "A conflict occurred",
            },
          },
          success: {
            title: "Tasks Pulled",
            description: "Tasks pulled successfully",
          },
        },
      },
    },
    completeTask: {
      post: {
        title: "Complete Task",
        description:
          "Mark a cron task as completed or failed and push the result to the originating remote instance. Dev-only MCP tool designed for interactive Claude Code sessions. When Thea creates a task for Hermes, Claude Code calls this tool after the user confirms the work is done.",
        fields: {
          taskId: {
            title: "Task ID",
            description: "The cron task database ID to mark as complete.",
          },
          status: {
            title: "Status",
            description:
              "Final status: 'completed' for success, 'failed' for failure, 'cancelled' to cancel.",
          },
          summary: {
            title: "Summary",
            description:
              "Brief description of what was accomplished or why it failed.",
          },
          output: {
            title: "Output Payload",
            description:
              "Optional structured data payload (key-value pairs) to attach to the execution result.",
          },
          completed: {
            title: "Completed",
            description: "Whether the task was successfully marked as done.",
          },
          pushedToRemote: {
            title: "Pushed to Remote",
            description:
              "Whether the completion was successfully reported to the originating instance.",
          },
          updatedAt: {
            title: "Updated At",
            description: "Timestamp when the task status was updated.",
          },
        },
        errors: {
          validation: {
            title: "Validation Error",
            description: "Invalid task ID or status value",
          },
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required",
          },
          internal: {
            title: "Completion Failed",
            description: "Failed to mark task as complete",
          },
          forbidden: {
            title: "Forbidden",
            description: "Access denied",
          },
          notFound: {
            title: "Task Not Found",
            description: "No task found with the given ID",
          },
          network: {
            title: "Network Error",
            description: "Failed to push completion to remote instance",
          },
          unknown: {
            title: "Unknown Error",
            description: "An unexpected error occurred",
          },
          unsaved: {
            title: "Unsaved Changes",
            description: "Unsaved changes detected",
          },
          conflict: {
            title: "Conflict",
            description: "Task is not in a completable state",
          },
        },
        success: {
          title: "Task Completed",
          description:
            "Task marked as done and result pushed to originating instance",
        },
      },
    },
    taskReport: {
      post: {
        title: "Report Task Result",
        description:
          "Accept execution results from a remote instance. Called by dev instances to report task completion back to the originating prod instance.",
        fields: {
          apiKey: {
            title: "API Key",
            description: "Shared secret for instance authentication.",
          },
          taskId: {
            title: "Task ID",
            description: "The unique id of the completed task.",
          },
          executionId: {
            title: "Execution ID",
            description: "Unique execution identifier for deduplication.",
          },
          status: {
            title: "Status",
            description: "Final execution status.",
          },
          durationMs: {
            title: "Duration (ms)",
            description: "Total execution time in milliseconds.",
          },
          summary: {
            title: "Summary",
            description: "Human-readable summary of the execution result.",
          },
          error: {
            title: "Error",
            description: "Error message if the task failed.",
          },
          serverTimezone: {
            title: "Server Timezone",
            description:
              "IANA timezone of the executing server (e.g. Europe/Vienna).",
          },
          executedByInstance: {
            title: "Executed By",
            description: "Instance ID that ran the task (e.g. hermes).",
          },
          output: {
            title: "Output",
            description: "Structured execution output payload.",
          },
          startedAt: {
            title: "Started At",
            description: "ISO timestamp when execution started.",
          },
          processed: {
            title: "Processed",
            description: "Whether the report was accepted and applied.",
          },
        },
        errors: {
          validation: {
            title: "Validation Error",
            description: "Invalid report payload",
          },
          unauthorized: {
            title: "Unauthorized",
            description: "Invalid API key",
          },
          internal: {
            title: "Internal Error",
            description: "Failed to process the report",
          },
          forbidden: {
            title: "Forbidden",
            description: "Access denied",
          },
          notFound: {
            title: "Not Found",
            description: "Task not found on this instance",
          },
          network: {
            title: "Network Error",
            description: "Network error occurred",
          },
          unknown: {
            title: "Unknown Error",
            description: "An unexpected error occurred",
          },
          unsaved: {
            title: "Unsaved Changes",
            description: "Unsaved changes detected",
          },
          conflict: {
            title: "Conflict",
            description: "A conflict occurred",
          },
        },
        success: {
          title: "Report Accepted",
          description: "Execution result applied to the task record",
        },
      },
    },
    waitForTask: {
      post: {
        title: "Wait for Task",
        description:
          "Wait on a pending background task. Returns the result immediately if already completed, or pauses the AI stream until the task finishes (wakeUp mechanism).",
        fields: {
          taskId: {
            title: "Task ID",
            description: "The ID of the task to wait on.",
          },
          status: {
            title: "Status",
            description: "Current task status.",
          },
          result: {
            title: "Result",
            description: "Task result payload (present when completed).",
          },
          waiting: {
            title: "Waiting",
            description:
              "True when the stream is paused waiting for the task to complete.",
          },
          originalToolName: {
            title: "Tool",
            description: "The original tool that was executed.",
          },
          originalArgs: {
            title: "Arguments",
            description: "The original tool's input arguments.",
          },
        },
        widget: {
          noToolName: "No tool name available.",
          resolving: "Resolving tool...",
          unknownTool: "Unknown tool: {{toolName}}",
        },
        errors: {
          validation: {
            title: "Validation Error",
            description: "Invalid taskId",
          },
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required",
          },
          internal: {
            title: "Internal Error",
            description: "Failed to register waiter on the task",
          },
          forbidden: {
            title: "Forbidden",
            description: "Access denied",
          },
          notFound: {
            title: "Task Not Found",
            description: "No task found with that ID",
          },
          network: {
            title: "Network Error",
            description: "Network error occurred",
          },
          unknown: {
            title: "Unknown Error",
            description: "An unexpected error occurred",
          },
          unsaved: {
            title: "Unsaved Changes",
            description: "Unsaved changes detected",
          },
          conflict: {
            title: "Conflict",
            description: "A conflict occurred",
          },
        },
        success: {
          title: "Task Result Ready",
          description: "Task completed or waiter registered",
        },
        status: {
          waiting: "Waiting for task...",
          complete: "Task complete",
        },
      },
    },
    errorMonitor: {
      name: "error-monitor",
      description: "Scans chat threads for error patterns every 3 hours",
      tag: "Monitoring",
      post: {
        title: "Error Monitor",
        description:
          "Privacy-first error monitoring - scans messages for error patterns without reading content",
        container: {
          title: "Error Scan Results",
          description: "Aggregated error patterns from chat messages",
        },
        response: {
          errorsFound: "Errors Found",
          threadsScanned: "Threads Scanned",
          scanWindowFrom: "Scan Window Start",
          scanWindowTo: "Scan Window End",
          patternType: "Error Type",
          patternCount: "Count",
          patternThreadIds: "Thread IDs",
          patternModel: "Model",
          patternTool: "Tool",
          patternFirstSeen: "First Seen",
          patternLastSeen: "Last Seen",
        },
        errors: {
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required",
          },
          forbidden: {
            title: "Forbidden",
            description: "Access denied",
          },
          server: {
            title: "Server Error",
            description: "Error scan failed",
          },
          unknown: {
            title: "Unknown Error",
            description: "An unexpected error occurred",
          },
          validation: {
            title: "Validation Error",
            description: "Invalid request parameters",
          },
        },
        success: {
          title: "Scan Complete",
          description: "Error scan completed successfully",
        },
      },
      cleanup: {
        name: "error-logs-cleanup",
        description:
          "Prunes error logs older than 6 months and caps total rows at 100K",
        post: {
          title: "Error Logs Cleanup",
          description:
            "Delete old error log entries (time-based + count-based) to keep the database lean",
          container: {
            title: "Cleanup Results",
            description: "Number of error logs deleted",
          },
          response: {
            deletedCount: "Deleted Count",
            deletedByTime: "Deleted by Time",
            deletedByCount: "Deleted by Count Cap",
            retentionDays: "Retention Days",
            maxRows: "Max Rows",
          },
          success: {
            title: "Cleanup Complete",
            description: "Old error logs pruned successfully",
          },
        },
      },
    },
    csvProcessor: {
      description: "Processes CSV import jobs in chunks",
    },
    imapSync: {
      description:
        "Synchronizes IMAP accounts, folders, and messages automatically",
    },
    newsletterUnsubscribeSync: {
      description: "Synchronizes lead statuses for newsletter unsubscribes",
    },
    cronSystem: {
      history: {
        category: "Task Management",

        errors: {
          cronTaskNotFound: "Cron task not found",
          repositoryInternalError: "An internal error occurred",
          fetchCronTaskHistory: "Failed to fetch cron task history",
        },

        get: {
          tags: {
            tasks: "Tasks",
            monitoring: "Monitoring",
          },
          title: "Task Execution History",
          description: "View historical execution records for cron tasks",
          fields: {
            taskId: {
              label: "Task ID",
              description: "Filter by specific task ID",
              placeholder: "Enter task ID",
            },
            taskName: {
              label: "Task Name",
              description: "Filter by task name (partial match)",
              placeholder: "Enter task name",
            },
            status: {
              label: "Execution Status",
              description: "Filter by execution status",
              placeholder: "Select statuses",
              options: {
                PENDING: "Pending",
                SCHEDULED: "Scheduled",
                RUNNING: "Running",
                COMPLETED: "Completed",
                FAILED: "Failed",
                ERROR: "Error",
                TIMEOUT: "Timeout",
                SKIPPED: "Skipped",
                CANCELLED: "Cancelled",
                STOPPED: "Stopped",
                BLOCKED: "Blocked",
              },
            },
            priority: {
              label: "Task Priority",
              description: "Filter by task priority level",
              placeholder: "Select priorities",
              options: {
                LOW: "Low",
                MEDIUM: "Medium",
                HIGH: "High",
                CRITICAL: "Critical",
              },
            },
            startDate: {
              label: "Start Date",
              description: "Filter executions after this date",
            },
            endDate: {
              label: "End Date",
              description: "Filter executions before this date",
            },
            limit: {
              label: "Results Limit",
              description: "Maximum number of results to return",
              placeholder: "50",
            },
            offset: {
              label: "Results Offset",
              description: "Number of results to skip for pagination",
              placeholder: "0",
            },
          },
          response: {
            title: "Task History Response",
            description: "Historical execution data for cron tasks",
            executions: {
              title: "Execution Records",
            },
            totalCount: {
              title: "Total Count",
            },
            hasMore: {
              title: "Has More Results",
            },
            statusCounts: {
              title: "Status Counts",
            },
            summary: {
              title: "Execution Summary",
            },
          },
          errors: {
            validation: {
              title: "Validation Error",
              description: "Invalid request parameters provided",
            },
            internal: {
              title: "Internal Server Error",
              description: "Failed to retrieve task history",
            },
            unauthorized: {
              title: "Unauthorized",
              description: "You do not have permission to view task history",
            },
            notFound: {
              title: "Not Found",
              description: "Task or execution record not found",
            },
            network: {
              title: "Network Error",
              description: "Network error occurred while fetching task history",
            },
            forbidden: {
              title: "Forbidden",
              description: "Access to task history is forbidden",
            },
            server: {
              title: "Server Error",
              description: "Internal server error occurred",
            },
            unknown: {
              title: "Unknown Error",
              description: "An unknown error occurred",
            },
            unsavedChanges: {
              titleChanges: "Unsaved Changes",
              title: "Unsaved Changes",
              description: "You have unsaved changes",
            },
            conflict: {
              title: "Conflict",
              description: "Data conflict occurred",
            },
          },
          success: {
            title: "History Retrieved",
            description: "Task execution history retrieved successfully",
          },
          log: {
            fetchSuccess: "Successfully fetched {{count}} execution records",
            fetchError: "Failed to fetch task execution history",
          },
          request: {
            title: "Request Parameters",
            description: "Filter task execution history",
          },
          unknownTask: "Unknown Task",
        },
        widget: {
          title: "Task Execution History",
          loading: "Loading history...",
          header: {
            tasks: "Tasks",
            stats: "Stats",
            pulse: "Pulse",
            refresh: "Refresh",
          },
          summary: {
            total: "Total",
            successful: "Successful",
            failed: "Failed",
            successRate: "Success Rate",
            avgDuration: "Avg Duration",
          },
          search: {
            placeholder: "Search tasks...",
          },
          filter: {
            all: "All",
            running: "Running",
            completed: "Completed",
            failed: "Failed",
            timeout: "Timeout",
            cancelled: "Cancelled",
          },
          col: {
            taskName: "Task Name",
            status: "Status",
            duration: "Duration",
            started: "Started",
            completed: "Completed",
            environment: "Environment",
            error: "Error",
          },
          empty: "No execution history found",
          result: "Result",
          error: {
            collapse: "Collapse error",
            label: "Error",
          },
          pagination: {
            info: "Page {{page}} of {{totalPages}} ({{total}} total)",
            prev: "Previous",
            next: "Next",
          },
        },
      },
      stats: {
        category: "Task Management",

        errors: {
          fetchCronTaskStats: "Failed to fetch cron task statistics",
        },

        get: {
          title: "Get Cron Task Statistics",
          description:
            "Retrieve comprehensive statistics and metrics for cron tasks",
          tag: "Cron Statistics",
          form: {
            title: "Cron Statistics Request",
            description:
              "Configure parameters for retrieving cron task statistics",
          },
          fields: {
            period: {
              title: "Time Period",
              description: "Time period for statistics aggregation",
            },
            type: {
              title: "Statistics Type",
              description: "Type of statistics to retrieve",
            },
            taskId: {
              title: "Task ID",
              description: "Optional specific task ID to filter statistics",
            },
            limit: {
              title: "Result Limit",
              description: "Maximum number of results to return",
            },
            timePeriod: {
              title: "Time Period",
            },
            dateRangePreset: {
              title: "Date Range Preset",
            },
            taskName: {
              title: "Task Name",
            },
            taskStatus: {
              title: "Task Status",
            },
            taskPriority: {
              title: "Task Priority",
            },
            healthStatus: {
              title: "Health Status",
            },
            minDuration: {
              title: "Minimum Duration",
            },
            maxDuration: {
              title: "Maximum Duration",
            },
            includeDisabled: {
              title: "Include Disabled",
            },
            includeSystemTasks: {
              title: "Include System Tasks",
            },
            hasRecentFailures: {
              title: "Has Recent Failures",
            },
            hasTimeout: {
              title: "Has Timeout",
            },
            search: {
              title: "Search",
            },
          },
          period: {
            hour: "Hourly",
            day: "Daily",
            week: "Weekly",
            month: "Monthly",
          },
          type: {
            overview: "Overview",
            performance: "Performance",
            errors: "Error Analysis",
            trends: "Trend Analysis",
          },
          response: {
            totalTasks: { title: "Total Tasks" },
            executedTasks: { title: "Executed Tasks" },
            successfulTasks: { title: "Successful Tasks" },
            failedTasks: { title: "Failed Tasks" },
            averageExecutionTime: { title: "Avg Execution Time (ms)" },
            totalExecutions: { title: "Total Executions" },
            executionsLast24h: { title: "Executions Last 24h" },
            successRate: { title: "Success Rate (%)" },
            successfulExecutions: { title: "Successful Executions" },
            failedExecutions: { title: "Failed Executions" },
            failureRate: { title: "Failure Rate (%)" },
            avgExecutionTime: { title: "Avg Execution Time (ms)" },
            minExecutionTime: { title: "Min Execution Time (ms)" },
            maxExecutionTime: { title: "Max Execution Time (ms)" },
            medianExecutionTime: { title: "Median Execution Time (ms)" },
            pendingExecutions: { title: "Pending Executions" },
            runningExecutions: { title: "Running Executions" },
            activeTasks: { title: "Active Tasks" },
            systemStatus: { title: "System Status" },
            uptime: { title: "Uptime" },
            healthyTasks: { title: "Healthy Tasks" },
            degradedTasks: { title: "Degraded Tasks" },
            systemLoad: { title: "System Load (%)" },
            queueSize: { title: "Queue Size" },
          },
          errors: {
            server: {
              title: "Server Error",
              description:
                "An internal server error occurred while retrieving statistics",
            },
            validation: {
              title: "Validation Error",
              description: "The provided parameters are invalid",
            },
            unauthorized: {
              title: "Unauthorized",
              description: "Authentication required to access statistics",
            },
            forbidden: {
              title: "Forbidden",
              description: "Insufficient permissions to access statistics",
            },
            notFound: {
              title: "Not Found",
              description: "The requested statistics could not be found",
            },
            conflict: {
              title: "Conflict",
              description: "A conflict occurred while processing the request",
            },
            network: {
              title: "Network Error",
              description:
                "A network error occurred while retrieving statistics",
            },
            unknown: {
              title: "Unknown Error",
              description: "An unknown error occurred",
            },
            unsavedChanges: {
              title: "Unsaved Changes",
              description:
                "There are unsaved changes that need to be addressed",
            },
          },
          success: {
            title: "Statistics Retrieved",
            description: "Cron task statistics retrieved successfully",
          },
        },
        priority: {
          critical: "Critical",
          high: "High",
          medium: "Medium",
          low: "Low",
          background: "Background",
        },
        widget: {
          title: "Cron Statistics",
          loading: "Loading statistics...",
          viewTasks: "Tasks",
          viewHistory: "History",
          viewPulse: "Pulse",
          refresh: "Refresh",
          totalTasks: "Total Tasks",
          executedTasks: "Executed Tasks",
          successfulTasks: "Successful",
          failedTasks: "Failed",
          successRate: "Success Rate",
          avgDuration: "Avg Duration",
          overallSuccessRate: "Overall Success Rate",
          activeTasks: "Active Tasks",
          runningExecutions: "Running",
          pendingExecutions: "Pending",
          healthyTasks: "Healthy Tasks",
          degradedTasks: "Degraded Tasks",
          systemLoad: "System Load",
          queueSize: "Queue Size",
          executionsLast24h: "Last 24h",
          tasksByStatus: "Tasks by Status",
          tasksByPriority: "Tasks by Priority",
          topPerforming: "Top Performing Tasks",
          problemTasks: "Problem Tasks",
          recentActivity: "Recent Activity",
          dailyStats: "Daily Statistics",
          systemStatus: {
            healthy: "Healthy",
            warning: "Warning",
            critical: "Critical",
            unknown: "Unknown",
          },
          uptime: "Uptime",
          col: {
            rank: "#",
            taskName: "Task Name",
            executions: "Executions",
            avgDuration: "Avg Duration",
            failures: "Failures",
            failureRate: "Failure Rate",
            date: "Date",
            successes: "Successes",
            uniqueTasks: "Unique Tasks",
          },
        },
      },
      task: {
        category: "System",
        tags: {
          cron: "Cron",
          scheduling: "Scheduling",
        },
        get: {
          title: "Get Cron Task",
          description: "Retrieve a single cron task by ID",
          container: {
            title: "Cron Task Details",
            description: "View details of a specific cron task",
          },
          fields: {
            id: {
              label: "Task ID",
              description: "Unique identifier of the task",
            },
          },
          response: {
            task: {
              title: "Task",
            },
          },
          errors: {
            validation: {
              title: "Validation Error",
              description: "The provided task ID is invalid",
            },
            unauthorized: {
              title: "Unauthorized",
              description: "You are not authorized to view this task",
            },
            notFound: {
              title: "Task Not Found",
              description: "The requested task could not be found",
            },
            internal: {
              title: "Internal Server Error",
              description: "An error occurred while retrieving the task",
            },
            forbidden: {
              title: "Forbidden",
              description: "You do not have permission to access this task",
            },
            network: {
              title: "Network Error",
              description: "A network error occurred",
            },
            unknown: {
              title: "Unknown Error",
              description: "An unknown error occurred",
            },
            unsaved: {
              title: "Unsaved Changes",
              description: "You have unsaved changes",
            },
            conflict: {
              title: "Conflict",
              description: "A conflict occurred",
            },
          },
          success: {
            retrieved: {
              title: "Task Retrieved",
              description: "Task retrieved successfully",
            },
          },
        },
        put: {
          title: "Update Cron Task",
          description: "Update an existing cron task",
          container: {
            title: "Update Cron Task",
            description: "Modify task settings",
          },
          fields: {
            id: {
              label: "Task ID",
              description: "Unique identifier of the task",
            },
            displayName: {
              label: "Display Name",
              description: "Human-readable label for this task",
              placeholder: "Enter display name",
            },
            outputMode: {
              label: "Output Mode",
              description: "When to send notifications after execution",
              placeholder: "Select output mode",
            },
            description: {
              label: "Description",
              description: "Task description",
              placeholder: "Enter task description",
            },
            schedule: {
              label: "Schedule",
              description: "Cron schedule expression",
              placeholder: "*/5 * * * *",
            },
            enabled: {
              label: "Enabled",
              description: "Whether the task is enabled",
            },
            priority: {
              label: "Priority",
              description: "Task priority level",
              placeholder: "Select priority",
            },
            category: {
              label: "Category",
              description: "Task category",
              placeholder: "Select category",
            },
            timeout: {
              label: "Timeout (ms)",
              description:
                "Maximum execution time in milliseconds (e.g. 300000 = 5 minutes)",
              placeholder: "300000",
            },
            retries: {
              label: "Retries",
              description: "Number of retry attempts on failure",
              placeholder: "3",
            },
            retryAttempts: {
              label: "Retry Attempts",
              description: "Number of retry attempts on failure",
            },
            retryDelay: {
              label: "Retry Delay (ms)",
              description:
                "Delay between retries in milliseconds (e.g. 5000 = 5 seconds)",
              placeholder: "5000",
            },
            taskInput: {
              label: "Task Input",
              description: "JSON input data for the task",
            },
            hidden: {
              label: "Hidden",
              description:
                "Hide this task from AI system prompts and default task listings",
            },
            runOnce: {
              label: "Run Once",
              description: "Run this task only once and then disable it",
            },
            targetInstance: {
              label: "Target Instance",
              description:
                "Instance ID this task should run on. Leave empty to run only on the host instance.",
              placeholder: "e.g. hermes, thea-prod",
            },
            lastExecutionStatus: {
              label: "Execution Status",
              description:
                "Override the last execution status. Use to reset a stuck 'running' task.",
              placeholder: "Select status",
            },
          },
          response: {
            task: {
              title: "Updated Task",
            },
            success: {
              title: "Success",
            },
          },
          errors: {
            validation: {
              title: "Validation Error",
              description: "The provided data is invalid",
            },
            unauthorized: {
              title: "Unauthorized",
              description: "You are not authorized to update this task",
            },
            notFound: {
              title: "Task Not Found",
              description: "The task to update could not be found",
            },
            internal: {
              title: "Internal Server Error",
              description: "An error occurred while updating the task",
            },
            forbidden: {
              title: "Forbidden",
              description: "You do not have permission to update this task",
            },
            network: {
              title: "Network Error",
              description: "A network error occurred",
            },
            unknown: {
              title: "Unknown Error",
              description: "An unknown error occurred",
            },
            unsaved: {
              title: "Unsaved Changes",
              description: "You have unsaved changes",
            },
            conflict: {
              title: "Conflict",
              description: "A conflict occurred while updating the task",
            },
          },
          submitButton: {
            label: "Save Task",
            loadingText: "Saving...",
          },
          success: {
            updated: {
              title: "Task Updated",
              description: "Task updated successfully",
            },
          },
        },
        delete: {
          title: "Delete Cron Task",
          description: "Delete a cron task",
          container: {
            title: "Delete Cron Task",
            description: "Remove a task from the system",
          },
          fields: {
            id: {
              label: "Task ID",
              description: "Unique identifier of the task to delete",
            },
          },
          response: {
            success: {
              title: "Success",
            },
            message: {
              title: "Message",
            },
          },
          errors: {
            validation: {
              title: "Validation Error",
              description: "The provided task ID is invalid",
            },
            unauthorized: {
              title: "Unauthorized",
              description: "You are not authorized to delete this task",
            },
            notFound: {
              title: "Task Not Found",
              description: "The task to delete could not be found",
            },
            internal: {
              title: "Internal Server Error",
              description: "An error occurred while deleting the task",
            },
            forbidden: {
              title: "Forbidden",
              description: "You do not have permission to delete this task",
            },
            network: {
              title: "Network Error",
              description: "A network error occurred",
            },
            unknown: {
              title: "Unknown Error",
              description: "An unknown error occurred",
            },
            unsaved: {
              title: "Unsaved Changes",
              description: "You have unsaved changes",
            },
            conflict: {
              title: "Conflict",
              description: "Cannot delete task due to a conflict",
            },
          },
          success: {
            deleted: {
              title: "Task Deleted",
              description: "Task deleted successfully",
            },
          },
        },
        priority: {
          critical: "Critical",
          high: "High",
          medium: "Medium",
          low: "Low",
          background: "Cron",
        },
        status: {
          pending: "Pending",
          running: "Running",
          completed: "Completed",
          failed: "Failed",
          timeout: "Timeout",
          cancelled: "Cancelled",
          skipped: "Skipped",
          blocked: "Blocked",
          scheduled: "Scheduled",
          stopped: "Stopped",
          error: "Error",
        },
        taskCategory: {
          development: "Development",
          build: "Build",
          watch: "Watch",
          generator: "Generator",
          test: "Test",
          maintenance: "Maintenance",
          database: "Database",
          system: "System",
          monitoring: "Monitoring",
        },
        outputMode: {
          storeOnly: "Store Only",
          notifyOnFailure: "Notify on Failure",
          notifyAlways: "Notify Always",
        },
        widget: {
          notFound: "Task not found",
          never: "Never",
          history: "History",
          edit: "Edit",
          delete: "Delete",
          enabled: "Enabled",
          disabled: "Disabled",
          identity: "Identity",
          id: "Task ID",
          routeId: "Route ID",
          displayName: "Display Name",
          version: "Version",
          category: "Category",
          priority: "Priority",
          schedule: "Schedule",
          timezone: "Timezone",
          createdAt: "Created",
          updatedAt: "Updated",
          owner: "Owner",
          ownerSystem: "System",
          ownerUser: "User",
          outputMode: "Output Mode",
          outputModes: {
            storeOnly: "Store Only",
            notifyOnFailure: "Notify on Failure",
            notifyAlways: "Notify Always",
          },
          stats: {
            totalExecutions: "Total Executions",
            successful: "Successful",
            errors: "Errors",
            successRate: "Success Rate",
          },
          timingSection: "Timing",
          timing: {
            avgDuration: "Avg Duration",
            lastDuration: "Last Duration",
            lastRun: "Last Run",
            nextRun: "Next Run",
            timeout: "Timeout",
            retries: "Retries",
            retryDelay: "Retry Delay",
          },
          lastExecutionError: "Last Error",
          run: "Run Now",
          runSuccess: "Task executed successfully",
          running: "Running...",
          refresh: "Refresh",
          taskInput: {
            title: "Task Input",
            loading: "Loading endpoint definition...",
            notFound: "Endpoint definition not found for this task",
            empty: "No input parameters configured",
            editTitle: "Task Input Parameters",
            editDescription:
              "Configure the input parameters for this task endpoint",
          },
          scheduleAutocomplete: {
            customBadge: "Custom",
            noSchedulesFound: "No schedules found",
            useCustomSchedule: "Use custom schedule",
            commonSchedules: "Common Schedules",
          },
          schedulePicker: {
            selectPlaceholder: "Select schedule...",
            customOption: "Custom...",
            presets: {
              title: "Quick Presets",
              everyMinute: "Every minute",
              every5m: "Every 5 minutes",
              every15m: "Every 15 minutes",
              every30m: "Every 30 minutes",
              everyHour: "Every hour",
              every2h: "Every 2 hours",
              every4h: "Every 4 hours",
              every6h: "Every 6 hours",
              every12h: "Every 12 hours",
              dailyMidnight: "Daily at midnight",
              daily6am: "Daily at 6 AM",
              dailyNoon: "Daily at noon",
              daily6pm: "Daily at 6 PM",
              weeklyMon: "Weekly on Monday",
              weeklySun: "Weekly on Sunday",
              monthlyFirst: "1st of every month",
            },
            custom: {
              title: "Custom Schedule",
              repeatEvery: "Run every",
              at: "At",
              onDays: "On",
              preview: "→ {{description}}",
              nextRun: "Next: {{time}}",
              nextRunMultiple: "Next: {{first}}, then {{second}}",
              unit: {
                minutes: "minutes",
                hours: "hours",
                days: "days",
                weeks: "weeks",
                months: "months",
              },
              days: {
                mon: "Mon",
                tue: "Tue",
                wed: "Wed",
                thu: "Thu",
                fri: "Fri",
                sat: "Sat",
                sun: "Sun",
              },
              advanced: "Advanced expression",
              advancedPlaceholder: "e.g. 0 9 * * 1-5",
              advancedInvalid: "Invalid cron expression",
            },
          },
        },
      },
      tasks: {
        category: "API Endpoint",
        tags: {
          tasks: "Tasks",
          cron: "Cron",
          scheduling: "Scheduling",
        },
        errors: {
          fetchCronTasks: "Failed to fetch cron tasks",
          createCronTask: "Failed to create cron task",
          invalidTaskInput:
            "Task input does not match the endpoint's request schema",
          endpointNotFound: "Endpoint not found for the given route ID",
          targetInstanceForbidden:
            "Only administrators can set the target instance for tasks",
        },
        list: {
          columns: {
            createdAt: "Created At",
            updatedAt: "Updated At",
          },
        },
        get: {
          title: "List Cron Tasks",
          description: "Retrieve a list of cron tasks with optional filtering",
          container: {
            title: "Cron Tasks List",
            description: "Filter and view cron tasks",
          },
          fields: {
            status: {
              label: "Status",
              description: "Filter by task status",
              placeholder: "Select status...",
            },
            priority: {
              label: "Priority",
              description: "Filter by task priority",
              placeholder: "Select priority...",
            },
            category: {
              label: "Category",
              description: "Filter by task category",
              placeholder: "Select category...",
            },
            enabled: {
              label: "Status",
              description: "Filter by enabled status",
              placeholder: "All tasks",
            },
            hidden: {
              label: "Visibility",
              description: "Filter by hidden status (default: visible only)",
              placeholder: "Visible tasks",
            },
            search: {
              label: "Search",
              description:
                "Filter tasks by name, route, description, or category",
              placeholder: "Search tasks...",
            },
            sort: {
              label: "Sort",
              description: "Sort order for the task list",
            },
            limit: {
              label: "Limit",
              description: "Maximum number of tasks to return",
            },
            offset: {
              label: "Offset",
              description: "Number of tasks to skip",
            },
          },
          response: {
            tasks: {
              title: "Tasks",
            },
            task: {
              title: "Task",
              description: "Individual task information",
              id: "Task ID",
              name: "Task Name",
              taskDescription: "Description",
              schedule: "Schedule",
              enabled: "Enabled",
              hidden: "Hidden",
              priority: "Priority",
              status: "Status",
              category: "Category",
              lastRun: "Last Run",
              nextRun: "Next Run",
              version: "Version",
              timezone: "Timezone",
              timeout: "Timeout (ms)",
              retries: "Retries",
              retryDelay: "Retry Delay (ms)",
              lastExecutedAt: "Last Executed At",
              lastExecutionStatus: "Last Execution Status",
              lastExecutionError: "Last Execution Error",
              lastExecutionDuration: "Last Execution Duration (ms)",
              nextExecutionAt: "Next Execution At",
              executionCount: "Execution Count",
              successCount: "Success Count",
              errorCount: "Error Count",
              averageExecutionTime: "Average Execution Time (ms)",
              createdAt: "Created At",
              updatedAt: "Updated At",
            },
            totalTasks: "Total Tasks",
          },
          errors: {
            internal: {
              title: "Internal server error occurred while retrieving tasks",
              description:
                "An unexpected error occurred while fetching the task list",
            },
            unauthorized: {
              title: "Unauthorized access to task list",
              description: "You do not have permission to view the task list",
            },
            validation: {
              title: "Invalid request parameters",
              description: "The provided request parameters are invalid",
            },
            forbidden: {
              title: "Access forbidden",
              description: "Access to this resource is forbidden",
            },
            notFound: {
              title: "Tasks not found",
              description: "No tasks were found matching the criteria",
            },
            network: {
              title: "Network error",
              description: "A network error occurred while retrieving tasks",
            },
            unknown: {
              title: "Unknown error",
              description: "An unknown error occurred",
            },
            unsaved: {
              title: "Unsaved changes",
              description:
                "There are unsaved changes that need to be addressed",
            },
            conflict: {
              title: "Conflict error",
              description: "A conflict occurred while processing the request",
            },
          },
          success: {
            retrieved: {
              title: "Tasks retrieved successfully",
              description: "The task list has been retrieved successfully",
            },
          },
        },
        post: {
          title: "Create Cron Task",
          description: "Create a new cron task",
          container: {
            title: "Create Task",
            description: "Configure a new cron task",
          },
          fields: {
            id: {
              label: "Task ID",
              description:
                "Unique, stable identifier for this task (e.g. 'db-health')",
              placeholder: "Enter task ID...",
            },
            routeId: {
              label: "Route ID",
              description:
                "Handler identifier: task name, endpoint alias, or 'cron-steps'",
              placeholder: "Enter route ID...",
            },
            displayName: {
              label: "Display Name",
              description: "Human-readable label for this task",
              placeholder: "Enter display name...",
            },
            outputMode: {
              label: "Output Mode",
              description: "When to send notifications after execution",
              placeholder: "Select output mode...",
            },
            description: {
              label: "Description",
              description: "Task description",
              placeholder: "Enter description...",
            },
            schedule: {
              label: "Schedule",
              description: "Cron schedule expression",
              placeholder: "*/5 * * * *",
            },
            priority: {
              label: "Priority",
              description: "Task priority level",
            },
            category: {
              label: "Category",
              description: "Task category",
            },
            enabled: {
              label: "Enabled",
              description: "Enable or disable the task",
            },
            hidden: {
              label: "Hidden",
              description:
                "Hide this task from AI system prompts and default task listings",
            },
            timeout: {
              label: "Timeout (ms)",
              description: "Maximum execution time in milliseconds",
            },
            retries: {
              label: "Retries",
              description: "Number of retry attempts",
            },
            retryDelay: {
              label: "Retry Delay (ms)",
              description: "Delay between retries in milliseconds",
            },
            taskInput: {
              label: "Task Input",
              description: "JSON input data for the task",
            },
            runOnce: {
              label: "Run Once",
              description: "Run this task only once and then disable it",
            },
            targetInstance: {
              label: "Target Instance",
              description:
                "Instance ID this task should run on (e.g. 'hermes', 'thea-prod'). Leave empty to run only on the host instance.",
              placeholder: "Leave empty for host only",
            },
          },
          response: {
            task: {
              title: "Created Task",
            },
          },
          errors: {
            validation: {
              title: "Validation failed",
              description: "The provided task data is invalid",
            },
            unauthorized: {
              title: "Unauthorized",
              description: "You do not have permission to create tasks",
            },
            internal: {
              title: "Internal error",
              description: "An error occurred while creating the task",
            },
            forbidden: {
              title: "Forbidden",
              description: "Access to this resource is forbidden",
            },
            conflict: {
              title: "Conflict",
              description: "A task with this name already exists",
            },
            network: {
              title: "Network error",
              description: "A network error occurred",
            },
            unknown: {
              title: "Unknown error",
              description: "An unknown error occurred",
            },
            notFound: {
              title: "Not found",
              description: "The requested resource was not found",
            },
            unsaved: {
              title: "Unsaved changes",
              description: "There are unsaved changes",
            },
          },
          success: {
            created: {
              title: "Task created",
              description: "The task has been created successfully",
            },
          },
        },
        widget: {
          title: "Cron Tasks",
          loading: "Loading tasks...",
          header: {
            stats: "Stats",
            graphs: "Graphs",
            history: "History",
            queue: "Queue",
            refresh: "Refresh",
            create: "New Task",
          },
          filter: {
            all: "All",
            running: "Running",
            completed: "Completed",
            failed: "Failed",
            pending: "Pending",
            disabled: "Disabled",
            allPriorities: "All Priorities",
            allCategories: "All Categories",
            visible: "Visible",
            hiddenOnly: "Hidden",
            allTasks: "All Tasks",
          },
          search: {
            placeholder: "Search tasks...",
          },
          sort: {
            nameAsc: "Name A-Z",
            nameDesc: "Name Z-A",
            schedule: "Schedule",
            lastRunNewest: "Last Run (newest)",
            executionsMost: "Most Executions",
          },
          task: {
            executions: "Executions:",
            lastRun: "Last run:",
            never: "Never",
            nextRun: "Next run:",
            notScheduled: "Not scheduled",
            routeId: "Route ID",
            hiddenBadge: "Hidden",
            owner: {
              system: "System",
              user: "User",
            },
            outputMode: {
              storeOnly: "Store Only",
              notifyOnFailure: "Notify on Failure",
              notifyAlways: "Notify Always",
            },
          },
          action: {
            view: "View details",
            history: "View history",
            edit: "Edit task",
            delete: "Delete task",
            runNow: "Run Now",
          },
          bulk: {
            selected: "{count} selected",
            selectAll: "Select all",
            clearSelection: "Clear selection",
            enable: "Enable",
            disable: "Disable",
            runNow: "Run now",
            delete: "Delete",
            confirmDeleteTitle: "Delete tasks?",
            confirmDelete: "Delete {count} task(s)? This cannot be undone.",
            cancel: "Cancel",
            success: "{succeeded} succeeded, {failed} failed",
          },
          empty: {
            noTasks: "No cron tasks",
            noTasksDesc: "Create your first cron task to get started",
            noMatches: "No tasks match your filters",
            noMatchesDesc: "Try adjusting your search or filter criteria",
            clearFilters: "Clear Filters",
          },
        },
      },
      errors: {
        fetch_all_failed: "Failed to fetch cron tasks",
        fetch_by_id_failed: "Failed to fetch cron task by ID",
        fetch_by_name_failed: "Failed to fetch cron task by name",
        create_failed: "Failed to create cron task",
        update_failed: "Failed to update cron task",
        delete_failed: "Failed to delete cron task",
        not_found: "Cron task not found",
        execution_create_failed: "Failed to create cron task execution",
        execution_update_failed: "Failed to update cron task execution",
        execution_not_found: "Cron task execution not found",
        executions_fetch_failed: "Failed to fetch cron task executions",
        recent_executions_fetch_failed:
          "Failed to fetch recent cron executions",
        schedules_fetch_failed: "Failed to fetch cron task schedules",
        schedule_update_failed: "Failed to update cron task schedule",
        schedule_not_found: "Cron task schedule not found",
        statistics_fetch_failed: "Failed to fetch cron task statistics",
      },
    },
    pulseSystem: {
      execute: {
        category: "Pulse Execution",
        tags: {
          execute: "Execute",
        },
        post: {
          title: "Execute Pulse",
          description: "Execute pulse health monitoring and task execution",
          container: {
            title: "Pulse Execution",
            description: "Execute pulse monitoring and run scheduled tasks",
          },
          fields: {
            dryRun: {
              label: "Dry Run",
              description: "Perform a dry run without making actual changes",
            },
            taskNames: {
              label: "Task Names",
              description: "Specific task names to execute (optional)",
            },
            force: {
              label: "Force Execution",
              description: "Force execution even if tasks are not due",
            },
            success: {
              title: "Success",
            },
            message: {
              title: "Message",
            },
          },
          response: {
            pulseId: "Pulse ID",
            executedAt: "Executed At",
            totalTasksDiscovered: "Total Tasks Discovered",
            tasksDue: "Tasks Due",
            tasksExecuted: "Tasks Executed",
            tasksSucceeded: "Tasks Succeeded",
            tasksFailed: "Tasks Failed",
            tasksSkipped: "Tasks Skipped",
            totalExecutionTimeMs: "Total Execution Time (ms)",
            errors: "Errors",
            summary: "Execution Summary",
            results: "Results",
            resultsDescription: "Task execution results",
            taskName: "Task Name",
            success: "Success",
            duration: "Duration",
            message: "Message",
            executionFailed: "Execution failed",
            dryRunSuccess: "Dry run completed successfully",
            executionSuccess: "Execution completed successfully",
          },
          examples: {
            basic: {
              title: "Basic Pulse Execution",
            },
            dryRun: {
              title: "Dry Run Execution",
            },
            success: {
              title: "Successful Execution",
            },
          },
          errors: {
            unauthorized: {
              title: "Unauthorized",
              description: "Authentication required",
            },
            internal: {
              title: "Internal Error",
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
            unsaved: {
              title: "Unsaved Changes",
              description: "There are unsaved changes",
            },
            validation: {
              title: "Validation Error",
              description: "Invalid request parameters",
            },
          },
          success: {
            title: "Success",
            description: "Operation completed successfully",
          },
        },
      },
      status: {
        category: "Pulse Status",
        tags: {
          status: "Status",
        },
        get: {
          title: "Pulse Status",
          description: "Get pulse health monitoring status",
          container: {
            title: "Pulse Health Status",
            description: "Monitor pulse execution health and statistics",
          },
          fields: {
            status: {
              title: "Status",
              label: "Pulse Status",
              description: "Current pulse health status",
            },
            lastPulseAt: {
              title: "Last Pulse At",
              label: "Last Pulse",
              description: "Timestamp of last pulse execution",
            },
            successRate: {
              title: "Success Rate",
              label: "Success Rate",
              description: "Percentage of successful pulse executions",
            },
            totalExecutions: {
              title: "Total Executions",
              label: "Total Executions",
              description: "Total number of pulse executions",
            },
          },
          examples: {
            basic: {
              title: "Basic Status Request",
            },
            success: {
              title: "Successful Status Response",
            },
          },
          errors: {
            unauthorized: {
              title: "Unauthorized",
              description: "Authentication required",
            },
            internal: {
              title: "Internal Error",
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
            unsaved: {
              title: "Unsaved Changes",
              description: "There are unsaved changes",
            },
            validation: {
              title: "Validation Error",
              description: "Invalid request parameters",
            },
          },
          success: {
            title: "Success",
            description: "Operation completed successfully",
          },
        },
      },
      history: {
        category: "Task Management",

        tags: {
          pulse: "Pulse",
          monitoring: "Monitoring",
        },

        errors: {
          fetchCronTaskHistory: "Failed to fetch pulse execution history",
        },

        get: {
          title: "Pulse Execution History",
          description: "View historical pulse execution cycles",
          fields: {
            startDate: {
              label: "Start Date",
              description: "Filter pulse cycles after this date",
            },
            endDate: {
              label: "End Date",
              description: "Filter pulse cycles before this date",
            },
            status: {
              label: "Status",
              description: "Filter by execution status",
              placeholder: "All statuses",
            },
            limit: {
              label: "Results Limit",
              description: "Maximum number of results to return",
              placeholder: "50",
            },
            offset: {
              label: "Results Offset",
              description: "Number of results to skip for pagination",
              placeholder: "0",
            },
          },
          response: {
            executions: { title: "Pulse Executions" },
            totalCount: { title: "Total Count" },
            hasMore: { title: "Has More Results" },
            summary: { title: "Execution Summary" },
          },
          errors: {
            validation: {
              title: "Validation Error",
              description: "Invalid request parameters provided",
            },
            network: {
              title: "Network Error",
              description:
                "Network error occurred while fetching pulse history",
            },
            unauthorized: {
              title: "Unauthorized",
              description: "You do not have permission to view pulse history",
            },
            forbidden: {
              title: "Forbidden",
              description: "Access to pulse history is forbidden",
            },
            notFound: {
              title: "Not Found",
              description: "Pulse execution record not found",
            },
            server: {
              title: "Server Error",
              description: "Internal server error occurred",
            },
            unknown: {
              title: "Unknown Error",
              description: "An unknown error occurred",
            },
            unsavedChanges: {
              title: "Unsaved Changes",
            },
            conflict: {
              title: "Conflict",
              description: "Data conflict occurred",
            },
          },
          success: {
            title: "History Retrieved",
            description: "Pulse execution history retrieved successfully",
          },
        },
        pulse: {
          execution: {
            success: "Success",
            failure: "Failure",
            timeout: "Timeout",
            cancelled: "Cancelled",
            pending: "Pending",
          },
        },
        widget: {
          title: "Pulse History",
          empty: "No pulse executions found",
          details: "Details",
          discovered: "{{count}} discovered",
          due: "{{count}} due",
          succeeded: "{{count}} ok",
          failed: "{{count}} failed",
          tasksExecuted: "Executed",
          tasksSucceeded: "Succeeded",
          tasksFailed: "Failed",
          tasksSkipped: "Skipped",
          header: {
            cronHistory: "Cron History",
            stats: "Stats",
            refresh: "Refresh",
          },
          summary: {
            total: "Total",
            successful: "Successful",
            failed: "Failed",
            successRate: "Success Rate",
            avgDuration: "Avg Duration",
          },
          filter: {
            all: "All",
            success: "Success",
            failure: "Failed",
            timeout: "Timeout",
          },
          pagination: {
            info: "Page {{page}} of {{totalPages}} ({{total}} total)",
            prev: "Previous",
            next: "Next",
          },
        },
      },
      success: {
        title: "Success",
        description: "Pulse executed successfully",
        content: "Success",
      },
      container: {
        title: "Pulse Container",
        description: "Pulse container description",
      },
    },
    unifiedRunner: {
      category: "Task Management",

      description: "Executes background tasks and manages side tasks",
      common: {
        taskName: "Task Name",
        taskNamesDescription: "Names of tasks to filter",
        detailed: "Detailed",
        detailedDescription: "Include detailed information",
        active: "Active",
        total: "Total",
        uptime: "Uptime",
        id: "ID",
        status: "Status",
        lastRun: "Last Run",
        nextRun: "Next Run",
        schedule: "Schedule",
      },
      post: {
        title: "Unified Task Runner",
        description:
          "Manage unified task runner for background tasks and side tasks",
        container: {
          title: "Unified Task Runner Management",
          description:
            "Control the unified task runner that manages both background tasks and side tasks",
        },
        fields: {
          action: {
            label: "Action",
            description: "Action to perform on the task runner",
            options: {
              start: "Start Runner",
              stop: "Stop Runner",
              status: "Get Status",
              restart: "Restart Runner",
            },
          },
          taskFilter: {
            label: "Task Filter",
            description: "Filter tasks by type",
            options: {
              all: "All Tasks",
              cron: "Cron Tasks Only",
              side: "Side Tasks Only",
            },
          },
          dryRun: {
            label: "Dry Run",
            description: "Perform a dry run without making actual changes",
          },
        },
        response: {
          success: "Operation Success",
          actionResult: "Action Result",
          message: "Response Message",
          timestamp: "Timestamp",
        },
        reasons: {
          previousInstanceRunning: "Previous instance is still running",
        },
        messages: {
          taskSkipped: "Task was skipped",
          taskCompleted: "Task completed successfully",
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
          internal: {
            title: "Internal Error",
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
          unsaved: {
            title: "Unsaved Changes",
            description: "There are unsaved changes",
          },
          execution: {
            title: "Task Execution Error",
            description: "Failed to execute task",
          },
          taskAlreadyRunning: {
            title: "Task Already Running",
            description: "The specified task is already running",
          },
          sideTaskExecution: {
            title: "Side Task Execution Error",
            description: "Failed to execute side task",
          },
        },
        success: {
          title: "Success",
          description: "Operation completed successfully",
        },
      },
    },
  },
  endpointCategories: {
    ai: "AI",
    analytics: "Analytics",
    analyticsDataSources: "Analytics: Data Sources",
    analyticsEvaluators: "Analytics: Evaluators",
    analyticsIndicators: "Analytics: Indicators",
    analyticsTransformers: "Analytics: Transformers",
    browser: "Browser",
    browserDevTools: "Browser: DevTools",
    chatSkills: "Chat: Skills",
    chatFavorites: "Chat: Favorites",
    chatMemories: "Chat: Memories",
    chatMessages: "Chat: Messages",
    chatSettings: "Chat: Settings",
    chatThreads: "Chat: Threads",
    credits: "Credits",
    leads: "Leads",
    leadsCampaigns: "Leads: Campaigns",
    leadsImport: "Leads: Import",
    messenger: "Messenger",
    payments: "Payments",
    referral: "Referral",
    pos: "Point of Sale",
    posOrders: "POS: Orders",
    posSessions: "POS: Sessions",
    posTerminals: "POS: Terminals",
    inventory: "Inventory",
    inventoryWarehouses: "Inventory: Warehouses",
    inventoryStock: "Inventory: Stock",
    inventoryTransfers: "Inventory: Transfers",
    purchasing: "Purchasing",
    purchasingVendors: "Purchasing: Vendors",
    purchasingOrders: "Purchasing: Orders",
    estimates: "Estimates",
    ssh: "SSH",
    system: "System",
    systemDatabase: "System: Database",
    systemDevTools: "System: Dev Tools",
    systemTasks: "System: Tasks",
    userAuth: "User Authentication",
    userManagement: "User Management",
    support: "Support",
  },
  shared: {
    permissions: {
      publicUsersCannotAccess:
        "Public users cannot access this authenticated endpoint",
      insufficientPermissions:
        "Insufficient permissions to access this endpoint",
      errors: {
        platformAccessDenied:
          "Access denied for {{platform}} platform: {{reason}}",
        insufficientRoles:
          "Insufficient roles. User has: {{userRoles}}. Required: {{requiredRoles}}",
        definitionError: "Endpoint definition error: {{error}}",
      },
    },
    endpoints: {
      definition: {
        loader: {
          errors: {
            endpointNotFound: "Endpoint '{{identifier}}' not found",
            loadFailed: "Failed to load endpoint '{{identifier}}': {{error}}",
            batchLoadFailed:
              "Batch load failed: {{failedCount}} of {{totalCount}} endpoints failed",
          },
        },
      },
    },
  },
  widgets: {
    chart: {
      noDataAvailable: "No data available",
      noDataToDisplay: "No data to display",
      total: "Total",
    },
    codeQualityList: {
      noIssues: "No issues found",
    },
    codeQualitySummary: {
      summary: "Summary",
      files: "Files",
      issues: "Issues",
      errors: "Errors",
      of: "of",
    },
    codeQualityFiles: {
      affectedFiles: "Affected Files",
    },
    formFields: {
      common: {
        required: "Required",
        enterPhoneNumber: "Enter phone number",
        selectDate: "Select date",
        unknownFieldType: "Unknown field type",
      },
      entityPicker: {
        select: "Select",
        change: "Change",
        required: "required.",
        useToFind: "Use `{{alias}}` to find one.",
        loading: "Loading...",
        noItems: "No items found.",
      },
      markdownTextarea: {
        edit: "Edit",
        preview: "Preview",
        toolbar: {
          bold: "Bold",
          italic: "Italic",
          strike: "Strikethrough",
          link: "Link",
          linkPrompt: "Enter URL:",
          heading1: "Heading 1",
          heading2: "Heading 2",
          heading3: "Heading 3",
          bulletList: "Bullet list",
          orderedList: "Numbered list",
          blockquote: "Quote",
          code: "Inline code",
          horizontalRule: "Divider",
        },
      },
    },
    rangeSlider: {
      min: "Min",
      max: "Max",
    },
  },
};
