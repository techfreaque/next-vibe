export const translations = {
  title: "Vibe Check",
  description:
    "Run comprehensive code quality checks including linting, type checking, and route validation",
  category: "Development Tools",
  tag: "quality",

  container: {
    title: "Vibe Check Configuration",
    description: "Configure parameters for comprehensive code quality checking",
  },

  fields: {
    fix: {
      label: "Auto Fix Issues",
      description: "Automatically fix issues that can be resolved",
    },
    skipLint: {
      label: "Skip Linting",
      description: "Skip ESLint checks during vibe check",
    },
    skipTypecheck: {
      label: "Skip Type Check",
      description: "Skip TypeScript type checking",
    },
    timeoutSeconds: {
      label: "Timeout (seconds)",
      description: "Maximum execution time",
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
      description: "Specific paths to check (leave empty for all)",
      placeholder: "Select paths to check or leave empty for all",
      options: {
        src: "Source Directory (src/)",
        components: "Components (src/components)",
        utils: "Utilities (src/utils)",
        pages: "Pages (src/pages)",
        app: "App Directory (src/app)",
      },
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
