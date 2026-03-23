export const translations = {
  category: "Server Management",
  tags: {
    rebuild: "Rebuild",
  },
  post: {
    title: "Rebuild & Restart",
    description:
      "Rebuild the application and hot-restart the running Next.js server. Runs 6 steps in sequence: 1) code generation, 2) vibe check (code quality gate), 3) Next.js production build, 4) database migrations, 5) database seeding, 6) hot-restart via SIGUSR1. The vibe check blocks the build if there are any errors - use 'vibe check' or the MCP check tool to see details. WARNING: The HTTP response may be cut short because the server restarts before the response completes.",
    form: {
      title: "Rebuild & Restart",
      description: "Rebuild the application and restart the server",
    },
    fields: {
      success: {
        title: "Result",
      },
      errors: {
        title: "Errors",
      },
      duration: {
        title: "Duration",
      },
      steps: {
        title: "Steps",
      },
    },
    steps: {
      codegen: "Code generation",
      vibeCheck: "Vibe check",
      nextBuild: "Next.js build",
      migrate: "Migrations",
      seed: "Seeding",
      restart: "Restart",
      codegenFailed: "Code generation failed: {{error}}",
      vibeCheckFailed:
        "Vibe check: {{errors}} errors, {{warnings}} warnings. Use 'vibe check' or the MCP check tool to see details.",
      vibeCheckError: "Vibe check failed: {{error}}",
      buildFailed: "Next.js build failed: {{error}}",
      migrationFailed: "Migration failed: {{error}}",
      seedingFailed: "Seeding failed: {{error}}",
      restartFailed: "Server restart failed: {{error}}",
      noPidFile: "No .vibe-pid file found - is vibe start running?",
      invalidPid: "Invalid PID in .vibe-pid: {{pid}}",
      processNotRunning: "Process {{pid}} is not running",
      signalFailed: "Failed to send SIGUSR1: {{error}}",
    },
    errors: {
      validation: {
        title: "Validation Failed",
        description: "Invalid rebuild parameters provided",
      },
      network: {
        title: "Network Error",
        description: "Network connection failed during rebuild",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to rebuild the application",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to rebuild the application",
      },
      notFound: {
        title: "Not Found",
        description: "Rebuild resources not found",
      },
      server: {
        title: "Server Error",
        description: "An internal server error occurred during rebuild",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred during rebuild",
      },
      conflict: {
        title: "Conflict",
        description: "A rebuild is already in progress",
      },
    },
    success: {
      title: "Rebuild Complete",
      description: "Application rebuilt and server restarted successfully",
    },
    widget: {
      rebuildComplete: "Rebuild complete",
      rebuildFailed: "Rebuild failed",
      errors: "Errors:",
      runRebuild: "Run Rebuild",
      runAgain: "Run again",
      skipped: "skipped",
    },
  },
};
