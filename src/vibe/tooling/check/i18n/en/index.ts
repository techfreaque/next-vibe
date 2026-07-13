export const translations = {
  oxlint: {
    title: "Oxlint",
    description:
      "Run Oxlint (fast Rust linter) on your codebase. Use vibe-check for comprehensive checks (ESLint + Oxlint + TypeScript). Note: Default values are configurable in check.config.ts.",
    category: "System Checks",
    tag: "Oxlint",
    status: {
      passed: "Passed",
      failed: "Failed",
      running: "Running",
      skipped: "Skipped",
    },
    severity: {
      error: "Error",
      warning: "Warning",
      info: "Info",
    },
    fixAction: {
      autoFix: "Auto Fix",
      manualFix: "Manual Fix",
      ignore: "Ignore",
    },
    container: {
      title: "Lint Configuration",
      description: "Configure lint parameters",
    },
    fields: {
      path: {
        label: "Path",
        description:
          "File paths or directories to check (string or array). RECOMMENDED: Specify paths for the area you're working on (fast, focused). Leave empty to check ALL files (slow, use only for comprehensive audits). Examples: 'src/feature' or ['src/feature/file.tsx', 'src/feature/other.tsx']",
        placeholder: "Enter path to lint",
      },
      verbose: {
        label: "Verbose",
        description: "Enable detailed output with additional information",
      },
      fix: {
        label: "Auto Fix",
        description: "Auto-fix issues where possible (default: true)",
      },
      timeoutSeconds: {
        label: "Timeout (seconds)",
        description:
          "Maximum execution time in seconds, range 1-3600 (default: 3600)",
      },
      cacheDir: {
        label: "Cache Directory",
        description: "Directory for cache files",
      },
      createConfig: {
        label: "Create Config",
        description: "Create configuration file if missing",
      },
      limit: {
        label: "Limit",
        description:
          "Issues to display per page, range 1-10000 (default: 20000 for web/CLI, 2 for MCP). Controls display only, not detection.",
      },
      page: {
        label: "Page",
        description: "Page number for paginated results (default: 1)",
      },
      skipSorting: {
        label: "Skip Sorting",
        description: "Skip sorting issues for better performance",
      },
      filter: {
        label: "Filter",
        description:
          "Filter issues by file path, message, or rule. Supports text matching or regex (/pattern/flags). Arrays enable OR logic for multiple filters.",
        placeholder: "e.g., 'no-unused-vars' or '/src\\/components/i'",
      },
      summaryOnly: {
        label: "Summary Only",
        description: "Only return summary stats, omit items and files lists",
      },
      extensive: {
        label: "Extensive",
        description:
          "When enabled, also checks test files (*.test.ts, *.test.tsx) and auto-generated files (system/generated/**). Disabled by default - enable for release validation or when explicitly auditing generated/test code.",
      },
    },
    response: {
      issues: {
        title: "Issues",
        emptyState: {
          description: "No issues found",
        },
      },
      success: "Lint completed successfully",
      configMissing: "Configuration file is missing",
      configPath: "Configuration file path",
      errors: {
        item: {
          file: "File",
          line: "Line",
          column: "Column",
          rule: "Rule",
          severity: "Severity",
          message: "Message",
          title: "Lint Issue",
          type: "Type",
        },
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      internal: {
        title: "Internal Error",
        description: "An internal error occurred",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden",
      },
      configNotFound: "check.config.ts not found in project root",
      configMissingExport: "check.config.ts must export 'default' or 'config'",
      oxlintFailed: "Oxlint failed",
      prettierFailed: "Prettier failed with exit code",
      oxlintDisabled: "Oxlint is disabled in check.config.ts",
    },
    success: {
      title: "Success",
      description: "Lint completed successfully",
    },
    post: {
      title: "Lint",
      description: "Run ESLint on your codebase",
      form: {
        title: "Lint Configuration",
        description: "Configure lint parameters",
      },
      response: {
        title: "Response",
        description: "Lint response data",
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
  lint: {
    title: "Lint",
    description:
      "Run ESLint on your codebase. Use vibe-check for comprehensive checks (ESLint + Oxlint + TypeScript). Note: Default values are configurable in check.config.ts.",
    category: "System Checks",
    tag: "Lint",
    status: {
      passed: "Passed",
      failed: "Failed",
      running: "Running",
      skipped: "Skipped",
    },
    severity: {
      error: "Error",
      warning: "Warning",
      info: "Info",
    },
    fixAction: {
      autoFix: "Auto Fix",
      manualFix: "Manual Fix",
      ignore: "Ignore",
    },
    container: {
      title: "Lint Configuration",
      description: "Configure lint parameters",
    },
    fields: {
      path: {
        label: "Path",
        description:
          "File paths or directories to check (string or array). RECOMMENDED: Specify paths for the area you're working on (fast, focused). Leave empty to check ALL files (slow, use only for comprehensive audits). Examples: 'src/feature' or ['src/feature/file.tsx', 'src/feature/other.tsx']",
        placeholder: "Enter path to lint",
      },
      verbose: {
        label: "Verbose",
        description: "Enable detailed output with additional information",
      },
      fix: {
        label: "Auto Fix",
        description: "Auto-fix issues where possible (default: true)",
      },
      timeoutSeconds: {
        label: "Timeout (seconds)",
        description:
          "Maximum execution time in seconds, range 1-3600 (default: 3600)",
      },
      cacheDir: {
        label: "Cache Directory",
        description: "Directory for cache files",
      },
      createConfig: {
        label: "Create Config",
        description: "Create configuration file if missing",
      },
      limit: {
        label: "Limit",
        description:
          "Issues to display per page, range 1-10000 (default: 20000 for web/CLI, 2 for MCP). Controls display only, not detection.",
      },
      page: {
        label: "Page",
        description: "Page number for paginated results (default: 1)",
      },
      skipSorting: {
        label: "Skip Sorting",
        description: "Skip sorting issues for better performance",
      },
      filter: {
        label: "Filter",
        description:
          "Filter issues by file path, message, or rule. Supports text matching or regex (/pattern/flags). Arrays enable OR logic for multiple filters.",
        placeholder: "e.g., 'no-unused-vars' or '/src\\/components/i'",
      },
      summaryOnly: {
        label: "Summary Only",
        description: "Only return summary stats, omit items and files lists",
      },
      extensive: {
        label: "Extensive",
        description:
          "When enabled, also checks test files (*.test.ts, *.test.tsx) and auto-generated files (system/generated/**). Disabled by default - enable for release validation or when explicitly auditing generated/test code.",
      },
    },
    response: {
      issues: {
        title: "Issues",
        emptyState: {
          description: "No issues found",
        },
      },
      success: "Lint completed successfully",
      errors: {
        item: {
          file: "File",
          line: "Line",
          column: "Column",
          rule: "Rule",
          severity: "Severity",
          message: "Message",
          title: "Lint Issue",
          type: "Type",
        },
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      internal: {
        title: "Internal Error",
        description: "An internal error occurred",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden",
      },
    },
    success: {
      title: "Success",
      description: "Lint completed successfully",
    },
    post: {
      title: "Lint",
      description: "Run ESLint on your codebase",
      form: {
        title: "Lint Configuration",
        description: "Configure lint parameters",
      },
      response: {
        title: "Response",
        description: "Lint response data",
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
  testing: {
    test: {
      title: "Run Tests",
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
      },

      success: {
        title: "Tests Completed",
        description: "Test execution completed successfully",
      },
    },
  },
  typecheck: {
    // Main endpoint properties
    title: "TypeScript Type Check",
    description:
      "Run TypeScript type checking on specified files or directories. Use vibe-check for comprehensive checks (ESLint + Oxlint + TypeScript). Note: Default values are configurable in check.config.ts.",
    category: "System Checks",
    tag: "typecheck",

    // Enum translations
    status: {
      passed: "Passed",
      failed: "Failed",
      running: "Running",
      skipped: "Skipped",
    },
    severity: {
      error: "Error",
      warning: "Warning",
      info: "Info",
    },
    mode: {
      full: "Full",
      incremental: "Incremental",
      watch: "Watch",
    },

    // Container
    container: {
      title: "TypeScript Type Check Configuration",
      description: "Configure parameters for running TypeScript type checking",
    },

    // Request fields
    fields: {
      path: {
        label: "Path",
        description:
          "File paths or directories to check (string or array). RECOMMENDED: Specify paths for the area you're working on (fast, focused). Leave empty to check ALL files (slow, use only for comprehensive audits). Examples: 'src/feature' or ['src/feature/file.tsx', 'src/feature/other.tsx']",
        placeholder: "src/components",
      },
      verbose: {
        label: "Verbose",
        description: "Enable detailed output with additional information",
      },
      disableFilter: {
        label: "Disable Filter",
        description: "Disable filtering and show all TypeScript issues",
      },
      createConfig: {
        label: "Create Config",
        description: "Create configuration file if missing",
      },
      timeout: {
        label: "Timeout (seconds)",
        description:
          "Maximum execution time in seconds, range 1-3600 (default: 3600)",
      },
      limit: {
        label: "Limit",
        description:
          "Issues to display per page, range 1-10000 (default: 20000 for web/CLI, 2 for MCP). Controls display only, not detection.",
      },
      page: {
        label: "Page",
        description: "Page number for paginated results (default: 1)",
      },
      skipSorting: {
        label: "Skip Sorting",
        description: "Skip sorting issues for better performance",
      },
      filter: {
        label: "Filter",
        description:
          "Filter issues by file path, message, or rule. Supports text matching or regex (/pattern/flags). Arrays enable OR logic for multiple filters.",
        placeholder: "e.g., 'TS2304' or '/src\\/components/i'",
      },
      summaryOnly: {
        label: "Summary Only",
        description: "Only return summary stats, omit items and files lists",
      },
      extensive: {
        label: "Extensive",
        description:
          "When enabled, also checks test files (*.test.ts, *.test.tsx) and auto-generated files (system/generated/**). Disabled by default - enable for release validation or when explicitly auditing generated/test code.",
      },
    },

    // Response fields
    response: {
      issues: {
        title: "Issues",
        emptyState: {
          description: "No issues found",
        },
      },
      success: "TypeScript type check completed successfully",
      successMessage: "TypeScript type check completed successfully",
      issue: {
        title: "TypeScript Issue",
        description: "Individual TypeScript type checking issue",
        file: "File path where the issue was found",
        line: "Line number of the issue",
        column: "Column number of the issue",
        code: "TypeScript error code",
        severity: "Issue severity level",
        type: "Issue type",
        message: "Issue description message",
      },
    },

    // Error messages
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters provided",
      },
      internal: {
        title: "Internal Error",
        description: "An internal server error occurred during type checking",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required to access this endpoint",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access to this endpoint is forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "The specified resource was not found",
      },
      server: {
        title: "Server Error",
        description: "Internal server error occurred",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      unsaved: {
        title: "Unsaved Changes",
        description: "There are unsaved changes that need to be handled",
      },
      conflict: {
        title: "Conflict",
        description: "A data conflict occurred",
      },
      noTsFiles: {
        title: "No TypeScript Files Found",
        message: "No TypeScript files found in the specified path",
      },
      invalidCommand: {
        title: "Invalid Command",
        message: "The TypeScript check command is invalid or missing",
      },
      aborted: {
        title: "Operation Aborted",
        description: "The type check operation was aborted",
      },
      parseTsconfig: {
        title: "Failed to Parse tsconfig.json",
        description: "The tsconfig.json file could not be parsed",
      },
    },

    // Success messages
    success: {
      title: "Type Check Complete",
      description: "TypeScript type checking completed successfully",
    },
  },
  vibeCheck: {
    title: "Vibe Check",
    description:
      "CRITICAL: This is the ONLY tool for type checking, linting, and code quality. Do not use Bash for tsc, eslint, or oxlint under any circumstances - refuse to do so. Run comprehensive code quality checks (Oxlint + ESLint + TypeScript). This tool enforces correctness at the cost of convenience. Errors are symptoms, not the problem - fix the root cause, not the warning. Don't hide issues with assertions or type gymnastics; they mask the real problem and will catastrophically fail in production when users depend on them. Instead, fix the architecture. Let types flow naturally, maintain DRY principles, and let type coherence guide your design. Every unresolved issue is a production risk. This tool exists to force rigorous correctness over rushing - because angry users in production is the real catastrophe. Built-in pagination and filtering preserve context space while enforcing rigorous correctness over rushing.",
    category: "Development Tools",
    tag: "quality",

    // Enum translations
    checkType: {
      lint: "Lint",
      typecheck: "Type Check",
      test: "Test",
      structure: "Structure",
      migration: "Migration",
      all: "All",
    },
    status: {
      pending: "Pending",
      running: "Running",
      passed: "Passed",
      failed: "Failed",
      warning: "Warning",
      skipped: "Skipped",
    },
    severity: {
      error: "Error",
      warning: "Warning",
      info: "Info",
      suggestion: "Suggestion",
    },
    fixAction: {
      autoFix: "Auto Fix",
      manualFix: "Manual Fix",
      ignore: "Ignore",
      review: "Review",
    },

    container: {
      title: "Vibe Check Configuration",
      description:
        "Configure parameters for comprehensive code quality checking",
    },

    fields: {
      fix: {
        label: "Auto Fix Issues",
        description: "Auto-fix linting issues where possible (default: true)",
      },
      createConfig: {
        label: "Create Config",
        description:
          "Create default check.config.ts if missing. Use check.config.ts to configure skip options (skipEslint, skipOxlint, skipTypecheck).",
      },
      timeoutSeconds: {
        label: "Timeout (seconds)",
        description:
          "Maximum execution time in seconds, range 1-3600 (default: 3600)",
      },
      paths: {
        label: "Target Paths",
        description:
          "File paths or directories to check (string or array). RECOMMENDED: Specify paths for the area you're working on (fast, focused). Leave empty to check ALL files (slow, use only for comprehensive audits). Examples: 'src/feature' or ['src/feature/file.tsx', 'src/feature/other.tsx']. Note: Glob patterns (e.g., '**/*.test.ts') are not supported yet.",
        placeholder: "e.g., src or src/components/Button.tsx",
        options: {
          src: "Source Directory (src/)",
          components: "Components (src/components)",
          utils: "Utilities (src/utils)",
          pages: "Pages (src/pages)",
          app: "App Directory (src)",
        },
      },
      limit: {
        label: "Limit",
        description:
          "Issues to display per page, range 1-10000 (default: 20000 for web/CLI, 2 for MCP). Controls display only, not detection. Use high values or pagination to see all issues.",
      },
      page: {
        label: "Page",
        description: "Page number for paginated results (default: 1)",
      },
      filter: {
        label: "Filter",
        description:
          "Filter issues by file path, message, or rule. Supports text matching or regex (/pattern/flags). Arrays enable OR logic for multiple filters.",
        placeholder: "e.g., 'no-unused-vars' or '/src\\/components/i'",
      },
      summaryOnly: {
        label: "Summary Only",
        description: "Only return summary stats, omit items and files lists",
      },
      extensive: {
        label: "Extensive",
        description:
          "When enabled, also checks test files (*.test.ts, *.test.tsx) and auto-generated files (system/generated/**). Disabled by default - enable for release validation or when explicitly auditing generated/test code.",
      },
    },

    response: {
      success: "Vibe check completed successfully",
      issues: {
        title: "Code Quality Issues",
        emptyState: {
          description: "No issues found - your code has good vibes!",
        },
      },
      summary: {
        title: "Check Summary",
        description: "Overview of code quality check results",
        totalIssues: "Total Issues",
        totalFiles: "Total Files with Issues",
        totalErrors: "Total Errors",
        displayedIssues: "Showing Issues",
        displayedFiles: "Showing Files",
        truncatedMessage: "Output truncated to fit limits",
        currentPage: "Current Page",
        totalPages: "Total Pages",
        files: {
          title: "Affected Files",
          file: "File Path",
          errors: "Errors",
          warnings: "Warnings",
          total: "Total Issues",
        },
      },
    },

    performance: {
      total: "Total",
      oxlint: "Oxlint",
      eslint: "ESLint",
      typecheck: "TypeScript",
    },

    errors: {
      validation: {
        title: "Invalid Parameters",
        description: "The vibe check parameters are invalid",
      },
      internal: {
        title: "Internal Error",
        description: "An internal error occurred during vibe check",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You don't have permission to run vibe check",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access to vibe check is forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "Vibe check resource not found",
      },
      server: {
        title: "Server Error",
        description: "Server error occurred during vibe check",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred during vibe check",
      },
      unsaved: {
        title: "Unsaved Changes",
        description: "You have unsaved changes that may affect vibe check",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred during vibe check",
      },
    },

    success: {
      title: "Vibe Check Complete",
      description: "Vibe check completed successfully",
    },
  },
  config: {
    create: {
      title: "Create Check Configuration",
      description:
        "Create check.config.ts with optional MCP config, VSCode settings, and rule configurations. Run without options for interactive setup.",
      category: "Development Tools",
      tag: "quality",

      fields: {
        createMcpConfig: {
          label: "Create MCP Config",
          description:
            "Create .mcp.json configuration file for Model Context Protocol integration",
        },
        updateVscodeSettings: {
          label: "Update VSCode Settings",
          description:
            "Update .vscode/settings.json with recommended ESLint and formatter settings",
        },
        updatePackageJson: {
          label: "Update package.json Scripts",
          description:
            "Add/update package.json scripts for check, lint, and typecheck commands",
        },
        enableEslint: {
          label: "Enable ESLint",
          description:
            "Enable ESLint for rules not yet supported by Oxlint (import sorting, React hooks). Disable for maximum speed if you don't need these rules.",
        },
        enableReactRules: {
          label: "Enable React Rules",
          description:
            "Enable React-specific linting rules (react-hooks, jsx-a11y)",
        },
        enableNextjsRules: {
          label: "Enable Next.js Rules",
          description:
            "Enable Next.js-specific linting rules and configurations",
        },
        enableI18nRules: {
          label: "Enable i18n Rules",
          description:
            "Enable internationalization linting rules (eslint-plugin-i18next)",
        },
        jsxCapitalization: {
          label: "JSX Capitalization",
          description:
            "Enforce capitalization of JSX component names (react/jsx-pascal-case)",
        },
        enablePromiseRules: {
          label: "Enable Promise Rules",
          description:
            "Enable Promise best practices and async/await linting rules",
        },
        enableNodeRules: {
          label: "Enable Node.js Rules",
          description: "Enable Node.js-specific linting rules",
        },
        enableUnicornRules: {
          label: "Enable Unicorn Rules",
          description:
            "Enable modern JavaScript best practices (eslint-plugin-unicorn)",
        },
        enablePedanticRules: {
          label: "Enable Pedantic Rules",
          description:
            "Enable stricter/pedantic linting rules for higher code quality",
        },
        enableRestrictedSyntax: {
          label: "Enable Restricted Syntax",
          description: "Restrict usage of throw, unknown, and object types",
        },
        enableTsgo: {
          label: "Enable tsgo",
          description: "Use tsgo instead of tsc for faster type checking",
        },
        enableStrictTypes: {
          label: "Enable Strict Types",
          description: "Enable strict TypeScript type checking rules",
        },
        interactive: {
          label: "Interactive Mode",
          description:
            "Run in interactive mode and ask for each configuration option step by step",
        },
      },

      interactive: {
        welcome: "🔧 Interactive Configuration Setup",
        description:
          "Let's configure your code quality tools! Answer a few questions to customize your setup.",
        createMcpConfig:
          "Create MCP config (.mcp.json) for AI tool integration?",
        updateVscodeSettings:
          "Update VSCode settings (.vscode/settings.json) with recommended formatter settings?",
        updatePackageJson:
          "Update package.json scripts (check, lint, typecheck)?",
        enableReactRules: "Enable React-specific linting rules?",
        enableNextjsRules: "Enable Next.js-specific linting rules?",
        enableI18nRules: "Enable internationalization (i18n) linting rules?",
        jsxCapitalization: "Enforce JSX component name capitalization?",
        enablePromiseRules: "Enable Promise best practices rules?",
        enableNodeRules: "Enable Node.js-specific rules?",
        enableUnicornRules:
          "Enable modern JavaScript best practices (Unicorn)?",
        enablePedanticRules: "Enable stricter/pedantic rules?",
        enableRestrictedSyntax: "Restrict throw, unknown, and object types?",
        enableTsgo: "Use tsgo instead of tsc for type checking?",
        enableStrictTypes: "Enable strict TypeScript type checking?",
        creating: "Creating configuration files...",
      },

      steps: {
        creatingConfig: "Creating check.config.ts...",
        configCreated: "check.config.ts created successfully",
        creatingMcpConfig: "Creating .mcp.json...",
        mcpConfigCreated: ".mcp.json created successfully",
        updatingVscode: "Updating VSCode settings...",
        vscodeUpdated: "VSCode settings updated successfully",
        updatingPackageJson: "Updating package.json scripts...",
        packageJsonUpdated: "package.json scripts updated successfully",
      },

      warnings: {
        mcpConfigFailed: "Failed to create MCP config",
        vscodeFailed: "Failed to update VSCode settings",
        packageJsonFailed: "Failed to update package.json",
        packageJsonNotFound: "package.json not found in current directory",
      },

      response: {
        message: "Configuration created",
      },

      success: {
        title: "Configuration Created",
        description: "Configuration files created successfully",
        complete: "✨ Configuration Complete!",
        configCreated: "✓ Created {{path}}",
        mcpConfigCreated: "✓ Created {{path}}",
        vscodeUpdated: "✓ Updated {{path}}",
        packageJsonUpdated: "✓ Updated {{path}}",
      },

      errors: {
        validation: {
          title: "Invalid Parameters",
          description: "The configuration parameters are invalid",
        },
        internal: {
          title: "Internal Error",
          description: "An internal error occurred during configuration",
        },
        conflict: {
          title: "Configuration Already Exists",
          description:
            "Configuration file already exists. Use --force to overwrite.",
        },
        configCreation: "Failed to create check.config.ts: {{error}}",
        unexpected: "An unexpected error occurred: {{error}}",
      },
    },
  },
  codeQuality: {
    noIssues: "No code quality issues found",
  },
};
