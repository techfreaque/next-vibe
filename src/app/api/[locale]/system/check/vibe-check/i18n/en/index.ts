export const translations = {
  title: "Vibe Check",
  description:
    "Run comprehensive code quality checks (Oxlint + ESLint + TypeScript). IMPORTANT: Use this instead of running 'eslint', 'tsc', or 'oxlint' directly - vibe-check runs all checks in parallel and is significantly faster. The goal is to fix ALL issues, not just some.",
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
      description:
        "Automatically fix linting issues that can be auto-fixed. Use this when you want to fix issues automatically.",
    },
    createConfig: {
      label: "Create Config",
      description:
        "Create default check.config.ts configuration file if missing. Use check.config.ts to configure skip options (skipEslint, skipOxlint, skipTypecheck).",
    },
    timeoutSeconds: {
      label: "Timeout (seconds)",
      description: "Maximum execution time in seconds (1-3600)",
    },
    paths: {
      label: "Target Paths",
      description:
        'Specific file paths or directories to check (string or array of strings). Leave empty to check ALL files in the project (recommended for comprehensive quality checks). Examples: "src/app" or ["src/components", "src/utils"]. Only specify paths if you need to focus on a subset of files.',
      placeholder: "e.g., src/app or src/components/Button.tsx",
      options: {
        src: "Source Directory (src/)",
        components: "Components (src/components)",
        utils: "Utilities (src/utils)",
        pages: "Pages (src/pages)",
        app: "App Directory (src/app)",
      },
    },
    limit: {
      label: "Limit",
      description:
        "Number of issues to display per page (1-10000, default: 100). IMPORTANT: This only controls display, not detection. Use high values (1000+) or pagination to see ALL issues - the goal is to fix everything, not just the first page.",
    },
    page: {
      label: "Page",
      description: "Page number for paginated results (starts at 1)",
    },
    maxFilesInSummary: {
      label: "Max Files in Summary",
      description: "Maximum number of files to show in the affected files list (1-1000)",
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
};
