export const translations = {
  category: "Server Management",
  tags: {
    start: "Start",
  },
  post: {
    title: "Start Production Server",
    description: "Start the production server with pre-tasks and Next.js",
    form: {
      title: "Start Configuration",
      description: "Configure server start parameters",
    },
    response: {
      title: "Response",
      description: "Start response data",
    },
    fields: {
      skipPre: {
        title: "Skip Pre-tasks",
        description: "Skip running pre-tasks before starting the server",
      },
      skipNextCommand: {
        title: "Skip Next.js Command",
        description: "Skip running Next.js start command",
      },
      mode: {
        title: "Server Mode",
        description:
          "Which subsystems to run: all (default), web (Next.js + WS only), tasks (task runner only)",
        options: {
          all: "All (default)",
          web: "Web only (Next.js + WebSocket)",
          tasks: "Tasks only (cron runner)",
        },
      },
      seed: {
        title: "Run Seeding",
        description: "Run database seeding on startup",
      },
      dbSetup: {
        title: "Database Setup",
        description: "Run database setup and migrations on startup",
      },
      taskRunner: {
        title: "Task Runner",
        description: "Start the task runner system",
      },
      nextServer: {
        title: "Next.js Server",
        description: "Start the Next.js server",
      },
      port: {
        title: "Port",
        description: "Port number for the server",
      },
      profile: {
        title: "Profile",
        description:
          "Enable profiling: sets NEXT_CPU_PROF=1 (writes .cpuprofile on exit) for the production Next.js server",
      },
      framework: {
        title: "Framework",
        description: "Frontend framework/bundler to start",
      },
      skipTaskRunner: {
        title: "Skip Task Runner",
        description: "Skip starting the task runner",
      },
      success: {
        title: "Success",
      },
      serverStarted: {
        title: "Server Started",
      },
      output: {
        title: "Output",
      },
      serverInfo: {
        title: "Server Information",
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
      tanstackBuildNotFound:
        "No TanStack Start build found - did 'vibe build --tanstack' run?",
      tanstackServerExited: "TanStack Start server exited immediately",
      nextBuildNotFound: "No .next-prod build found - did 'vibe build' run?",
      startFailed: "Failed to start server",
    },
    success: {
      title: "Success",
      description: "Operation completed successfully",
    },
    repository: {
      messages: {
        startingServer: "🚀 Starting production server...",
        environment: "✅ Environment: ",
        runningPreTasks: "Running pre-start tasks...",
        runningMigrations: "Running database migrations...",
        migrationsCompleted: "✅ Database migrations completed",
        failedMigrations: "Failed to run migrations",
        seedingDatabase: "Seeding database...",
        seedingCompleted: "✅ Database seeding completed",
        failedSeeding: "Failed to seed database",
        startingTaskRunner: "Starting production task runner system...",
        failedTaskRunner: "Failed to start production task runner",
        taskRunnerStarted: "✅ Production task runner started with ",
        taskRunnerStartedSuffix: " tasks",
        taskRunnerSkipped:
          "Production task runner skipped (--skip-task-runner flag used)",
        skipNextStart:
          "Skipping Next.js start (will be handled by package.json)",
        serverWillStart: "Production server will be started by package.json",
        serverAvailable: "Server will be available at http://localhost:",
        startupPrepared: "✅ Production server startup prepared successfully",
        failedStart: "❌ Failed to start production server: ",
        gracefulShutdown:
          "Graceful shutdown requested for production task runner",
      },
    },
  },
};
