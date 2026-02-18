export const translations = {
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
    description: "Configure parameters for comprehensive code quality checking",
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
        "File paths or directories to check (string or array). RECOMMENDED: Specify paths for the area you're working on (fast, focused). Leave empty to check ALL files (slow, use only for comprehensive audits). Examples: 'src/app/feature' or ['src/feature/file.tsx', 'src/feature/other.tsx']. Note: Glob patterns (e.g., '**/*.test.ts') are not supported yet.",
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
