export const translations = {
  category: "Server Management",
  enum: {
    framework: {
      next: "Next.js",
      tanstack: "TanStack/Vite",
    },
  },
  tags: {
    build: "Build",
  },
  post: {
    title: "Build Application",
    titleShort: "Build App",
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
        description: "Specify the build target (e.g., 'production', 'staging')",
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
      vibeMode: {
        title: "Instance Mode",
        description:
          "Bakes the instance mode into the Next.js bundle. 'agent' = personal local instance. 'cloud' = SaaS deployment. 'dev' = coding instance (default). Overrides NEXT_PUBLIC_VIBE_MODE in .env.",
        options: {
          agent: "Agent (personal local instance)",
          cloud: "Cloud (SaaS deployment)",
          dev: "Dev (coding instance, default)",
        },
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
        packageBuildFailed: "Package build failed: {{error}}",
        buildPrerequisites: "Running build prerequisites...",
        skipGeneration: "Skipping API endpoint generation (--skip-generation)",
        generatingEndpoints: "Generating API endpoints...",
        generationSuccess: "✅ Code generation completed successfully",
        generationFailed: "Code generation failed",
        generationFailedDetail: "Code generation failed: {{error}}",
        tanstackBuildStart: "Building TanStack Start (SSR)...",
        tanstackBuildSuccess:
          "✅ TanStack Start (SSR) build completed successfully",
        tanstackBuildFailed: "TanStack Start build failed",
        tanstackBuildFailedDetail: "TanStack Start build failed: {{error}}",
        skipNextBuild:
          "Skipping Next.js build (will be handled by package.json)",
        buildingNextjs: "Building Next.js application...",
        nextjsBuildSuccess: "✅ Next.js build completed successfully",
        nextjsBuildFailed: "Next.js build failed: {{error}}",
        nextjsBuildOom:
          "Next.js build killed by the OS (likely out of memory) - signal: {{signal}}",
        nextjsBuildExitCode: "Next.js build exited with code {{code}}",
        skipProdDb:
          "Skipping production database operations (--run-prod-database=false)",
        buildFailed: "❌ Build failed: {{error}}",
        unknownError: "unknown error",
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
        prodDbFailed:
          "❌ Production build failed during database operations: {{error}}. Try running 'docker compose -f docker-compose-dev.yml up -d' to start the database.",
        prodDbConnectionFailed:
          "❌ Production build failed during database operations: the database is unreachable ({{error}}). Make sure it is running, then try 'docker compose -f docker-compose-dev.yml up -d' to start it.",
        prodDbNotReady: "💡 This build is NOT ready for production deployment",
        deploymentReady:
          "🚀 Your application is ready for production deployment!",
        nextBuildHandled:
          "✅ Next.js build will be handled by yarn build command",
        failedProdMigrations: "Failed to run production migrations",
      },
    },
  },
};
