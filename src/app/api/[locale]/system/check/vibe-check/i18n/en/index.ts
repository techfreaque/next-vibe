export const translations = {
  title: "Vibe Check",
  description:
    "Run comprehensive code quality checks including linting and type checking",
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
    description: "Configure parameters for comprehensive code quality checking",
  },

  fields: {
    fix: {
      label: "Auto Fix Issues",
      description: "Automatically fix linting issues that can be auto-fixed",
    },
    skipLint: {
      label: "Skip All Linting",
      description: "Skip both ESLint and Oxlint checks",
    },
    skipEslint: {
      label: "Skip ESLint",
      description: "Skip ESLint checks (Oxlint will still run)",
    },
    skipOxlint: {
      label: "Skip Oxlint",
      description: "Skip Oxlint checks (ESLint will still run)",
    },
    skipTypecheck: {
      label: "Skip Type Check",
      description: "Skip TypeScript type checking",
    },
    createConfig: {
      label: "Create Config",
      description:
        "Create default check.config.ts configuration file if missing",
    },
    timeoutSeconds: {
      label: "Timeout (seconds)",
      description: "Maximum execution time in seconds (1-3600)",
    },
    skipTrpcCheck: {
      label: "Skip tRPC Check",
      description: "Skip tRPC route validation",
    },
    quiet: {
      label: "Quiet Mode",
      description: "Reduce output verbosity",
    },
    paths: {
      label: "Target Paths",
      description:
        'Specific file paths or directories to check (string or array of strings, leave empty to check all files). Examples: "src/app" or ["src/components", "src/utils"]',
      placeholder: "e.g., src/app or src/components/Button.tsx",
      options: {
        src: "Source Directory (src/)",
        components: "Components (src/components)",
        utils: "Utilities (src/utils)",
        pages: "Pages (src/pages)",
        app: "App Directory (src/app)",
      },
    },
    maxIssues: {
      label: "Max Issues",
      description:
        "Maximum number of issues to display in the output (1-10000)",
    },
    maxFiles: {
      label: "Max Files",
      description: "Maximum number of files to show in summary (1-1000)",
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
    },
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
};
