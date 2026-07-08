export const translations = {
  category: "Server Management",
  enum: {
    processStatus: {
      running: "Running",
      stopped: "Stopped",
      error: "Error",
    },
    environment: {
      development: "Development",
      production: "Production",
      testing: "Testing",
      staging: "Staging",
    },
    mode: {
      development: "Development",
      production: "Production",
    },
    framework: {
      next: "Next.js",
      tanstack: "TanStack/Vite",
    },
  },
  build: {
    category: "Server Management",
    tags: {
      build: "Build",
    },
    post: {
      title: "Build Application",
      description: "Build the application for production deployment",
      form: {
        title: "Build Configuration",
        description: "Configure build options and settings",
      },
      fields: {
        package: {
          title: "Build Package",
          description: "Build the package before building the application",
        },
        skipNextCommand: {
          title: "Skip Next.js Command",
          description: "Skip running Next.js build command",
        },
        target: {
          title: "Build Target",
          description:
            "Specify the build target (e.g., 'production', 'staging')",
        },
        skipGeneration: {
          title: "Skip Code Generation",
          description: "Skip API endpoint generation during build",
        },
        generate: {
          title: "Generate Code",
          description: "Run code generation during build",
        },
        generateEndpoints: {
          title: "Generate Endpoints",
          description: "Generate API endpoint files during build",
        },
        generateSeeds: {
          title: "Generate Seeds",
          description: "Generate seed files during build",
        },
        nextBuild: {
          title: "Next.js Build",
          description: "Run Next.js build process",
        },
        migrate: {
          title: "Run Migrations",
          description: "Run database migrations during build",
        },
        seed: {
          title: "Run Seeding",
          description: "Run database seeding during build",
        },
        force: {
          title: "Force Build",
          description: "Continue build even if errors occur",
        },
        framework: {
          title: "Framework",
          description: "Frontend framework/bundler to build",
        },
        webpack: {
          title: "Use Webpack",
          description:
            "Use webpack instead of Turbopack. Lower memory usage (~7.5 GB vs ~12 GB). Enabled by default in production Docker builds.",
        },
        skipEndpoints: {
          title: "Skip Endpoints Generation",
          description: "Skip generating endpoint files",
        },
        skipSeeds: {
          title: "Skip Seeds Generation",
          description: "Skip generating seed files",
        },
        skipProdMigrations: {
          title: "Skip Production Migrations",
          description: "Skip running database migrations for production",
        },
        skipProdSeeding: {
          title: "Skip Production Seeding",
          description: "Skip database seeding for production",
        },
        runProdDatabase: {
          title: "Run Production Database Operations",
          description: "Run production database operations after build",
        },
        success: {
          title: "Build Success",
        },
        output: {
          title: "Build Output",
        },
        duration: {
          title: "Build Duration (ms)",
        },
        errors: {
          title: "Build Errors",
        },
        steps: {
          title: "Build Steps",
        },
        label: {
          title: "Step",
        },
        ok: {
          title: "Success",
        },
        skipped: {
          title: "Skipped",
        },
      },
      errors: {
        validation: {
          title: "Validation Failed",
          description: "Invalid build parameters provided",
        },
        network: {
          title: "Network Error",
          description: "Network connection failed during build",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "You must be logged in to build the application",
        },
        forbidden: {
          title: "Forbidden",
          description: "You don't have permission to build the application",
        },
        notFound: {
          title: "Not Found",
          description: "Build resources not found",
        },
        server: {
          title: "Server Error",
          description: "An internal server error occurred during build",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unknown error occurred during build",
        },
        conflict: {
          title: "Conflict",
          description: "Build conflict detected",
        },
        nextjs_build_failed: {
          title: "Next.js Build Failed",
          description: "The Next.js build process failed: {{error}}",
        },
      },
      success: {
        title: "Build Completed",
        description: "Application build completed successfully",
      },
      repository: {
        messages: {
          buildStart: "🚀 Starting application build...",
          packageBuildStart: "Building package...",
          packageBuildSuccess: "✅ Package build completed successfully",
          packageBuildFailed: "Package build failed",
          buildPrerequisites: "Running build prerequisites...",
          skipGeneration:
            "Skipping API endpoint generation (--skip-generation)",
          generatingEndpoints: "Generating API endpoints...",
          generationSuccess: "✅ Code generation completed successfully",
          generationFailed: "Code generation failed",
          skipNextBuild:
            "Skipping Next.js build (will be handled by package.json)",
          buildingNextjs: "Building Next.js application...",
          nextjsBuildSuccess: "✅ Next.js build completed successfully",
          nextjsBuildFailed: "Next.js build failed",
          skipProdDb:
            "Skipping production database operations (--run-prod-database=false)",
          buildFailed: "❌ Build failed",
          schemaGenerationStart: "Generating database schema...",
          schemaGenerationSuccess: "✅ Database schema generation completed",
          schemaGenerationFailed: "Database schema generation failed",
          skipSchemaGeneration:
            "Skipping database schema generation (--run-prod-database=false)",
          reportsGenerationStart: "Generating all reports...",
          reportsGenerationSuccess: "✅ All reports generated successfully",
          reportsGenerationFailed: "Report generation failed",
          prodDbStart: "🚀 Running production database operations...",
          prodDbSuccess:
            "🎉 Production database operations completed successfully",
          prodDbFailed: "❌ Production build failed during database operations",
          prodDbNotReady:
            "💡 This build is NOT ready for production deployment",
          deploymentReady:
            "🚀 Your application is ready for production deployment!",
          dbConnectionError:
            "Database connection failed. Please ensure the database is running and accessible.",
          dbStartSuggestion:
            "Try running 'docker compose -f docker-compose-dev.yml up -d' to start the database",
          nextBuildHandled:
            "✅ Next.js build will be handled by yarn build command",
          failedProdMigrations: "Failed to run production migrations",
        },
      },
    },
  },
  dev: {
    category: "Server Management",

    post: {
      title: "Dev",
      description: "Dev endpoint",
      form: {
        title: "Dev Configuration",
        description: "Configure dev parameters",
      },
      response: {
        title: "Response",
        description: "Dev response data",
      },
      fields: {
        debug: {
          title: "Debug Mode",
          description: "Enable debug mode for verbose output",
        },
        skipDbSetup: {
          title: "Skip DB Setup",
          description: "Skip database setup steps",
        },
        skipNextCommand: {
          title: "Skip Next Command",
          description: "Skip running Next.js development server",
        },
        skipDbReset: {
          title: "Skip DB Reset",
          description: "Skip database reset operation",
        },

        port: {
          title: "Port",
          description: "Port number for the development server",
        },
        skipGeneratorWatcher: {
          title: "Skip Generator Watcher",
          description: "Skip automatic code generation watcher",
        },
        generatorWatcherInterval: {
          title: "Generator Interval",
          description: "Interval for generator watcher in milliseconds",
        },
        skipTaskRunner: {
          title: "Skip Task Runner",
          description: "Skip starting the task runner system",
        },
        skipMigrations: {
          title: "Skip Migrations",
          description: "Skip database migrations",
        },
        skipMigrationGeneration: {
          title: "Skip Migration Generation",
          description: "Skip automatic migration generation",
        },
        skipSeeding: {
          title: "Skip Seeding",
          description: "Skip database seeding with initial data",
        },
        framework: {
          title: "Framework",
          description: "Frontend framework/bundler to use",
        },
        profile: {
          title: "Profile",
          description:
            "Enable profiling: sets NEXT_TURBOPACK_TRACING=1 (trace file at .next/dev/trace-turbopack) and NEXT_CPU_PROF=1 (writes .cpuprofile on exit)",
        },
        success: {
          title: "Success",
        },
        output: {
          title: "Output",
        },
        duration: {
          title: "Duration",
        },
        serverUrl: {
          title: "Server URL",
        },
        databaseStatus: {
          title: "Database Status",
        },
        processes: {
          title: "Processes",
        },
        errors: {
          title: "Errors",
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
  health: {
    category: "Server Management",

    tag: "Health",
    get: {
      title: "Health Check",
      description: "Get server health status and diagnostics",
      form: {
        title: "Health Check Options",
        description: "Configure health check parameters",
      },
      fields: {
        detailed: {
          title: "Detailed Report",
          description: "Include detailed system information",
        },
        includeDatabase: {
          title: "Include Database",
          description: "Include database health checks",
        },
        includeTasks: {
          title: "Include Tasks",
          description: "Include task runner health checks",
        },
        includeSystem: {
          title: "Include System",
          description: "Include system resource information",
        },
      },
      response: {
        status: {
          title: "Status",
          description: "Overall health status",
        },
        timestamp: {
          title: "Timestamp",
          description: "Time of health check",
        },
        uptime: {
          title: "Uptime",
          description: "Server uptime in seconds",
        },
        environment: {
          title: "Environment",
          description: "Server environment information",
          name: {
            title: "Environment Name",
          },
          nodeEnv: {
            title: "Node Environment",
          },
          platform: {
            title: "Platform",
          },
          supportsTaskRunners: {
            title: "Supports Task Runners",
          },
        },
        database: {
          title: "Database Status",
          description: "Database connection status",
          status: {
            title: "Connection Status",
          },
          responseTime: {
            title: "Response Time (ms)",
          },
          error: {
            title: "Error Message",
          },
        },
        tasks: {
          title: "Task Status",
          description: "Task runner status",
          runnerStatus: {
            title: "Runner Status",
          },
          activeTasks: {
            title: "Active Tasks",
          },
          totalTasks: {
            title: "Total Tasks",
          },
          errors: {
            title: "Error Count",
          },
          lastError: {
            title: "Last Error",
          },
        },
        system: {
          title: "System Info",
          description: "System resource information",
          memory: {
            title: "Memory Usage",
            description: "System memory information",
            used: {
              title: "Used Memory",
            },
            total: {
              title: "Total Memory",
            },
            percentage: {
              title: "Memory Usage %",
            },
          },
          cpu: {
            title: "CPU Usage",
            description: "System CPU information",
            usage: {
              title: "CPU Usage %",
            },
            loadAverage: {
              title: "Load Average",
            },
          },
          disk: {
            title: "Disk Usage",
            description: "System disk information",
            available: {
              title: "Available Space",
            },
            total: {
              title: "Total Space",
            },
            percentage: {
              title: "Disk Usage %",
            },
          },
        },
        checks: {
          title: "Health Checks",
          description: "Individual component health checks",
          item: {
            title: "Health Check",
            description: "Individual health check result",
            name: {
              title: "Check Name",
            },
            status: {
              title: "Check Status",
            },
            message: {
              title: "Check Message",
            },
            duration: {
              title: "Duration (ms)",
            },
          },
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
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "There are unsaved changes",
        },
      },
      success: {
        title: "Success",
        description: "Health check completed successfully",
      },
    },
  },
  start: {
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
  },
};
