export const translations = {
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
        "File paths or directories to check (string or array). RECOMMENDED: Specify paths for the area you're working on (fast, focused). Leave empty to check ALL files (slow, use only for comprehensive audits). Examples: 'src/app/feature' or ['src/feature/file.tsx', 'src/feature/other.tsx']",
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
  },

  // Success messages
  success: {
    title: "Type Check Complete",
    description: "TypeScript type checking completed successfully",
  },
};
