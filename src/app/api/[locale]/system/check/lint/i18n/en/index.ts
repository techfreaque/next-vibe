export const translations = {
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
        "File paths or directories to check (string or array). RECOMMENDED: Specify paths for the area you're working on (fast, focused). Leave empty to check ALL files (slow, use only for comprehensive audits). Examples: 'src/app/feature' or ['src/feature/file.tsx', 'src/feature/other.tsx']",
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
};
