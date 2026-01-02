export const translations = {
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
        description: "Specify the build target (e.g., 'production', 'staging')",
      },
      skipGeneration: {
        title: "Skip Code Generation",
        description: "Skip API endpoint generation during build",
      },
      force: {
        title: "Force Build",
        description: "Continue build even if errors occur",
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
        skipGeneration: "Skipping API endpoint generation (--skip-generation)",
        generatingEndpoints: "Generating API endpoints...",
        generationSuccess: "✅ Code generation completed successfully",
        generationFailed: "Code generation failed",
        skipNextBuild: "Skipping Next.js build (will be handled by package.json)",
        buildingNextjs: "Building Next.js application...",
        nextjsBuildSuccess: "✅ Next.js build completed successfully",
        nextjsBuildFailed: "Next.js build failed",
        skipProdDb: "Skipping production database operations (--run-prod-database=false)",
        buildFailed: "❌ Build failed",
        schemaGenerationStart: "Generating database schema...",
        schemaGenerationSuccess: "✅ Database schema generation completed",
        schemaGenerationFailed: "Database schema generation failed",
        skipSchemaGeneration: "Skipping database schema generation (--run-prod-database=false)",
        reportsGenerationStart: "Generating all reports...",
        reportsGenerationSuccess: "✅ All reports generated successfully",
        reportsGenerationFailed: "Report generation failed",
        prodDbStart: "🚀 Running production database operations...",
        prodDbSuccess: "🎉 Production database operations completed successfully",
        prodDbFailed: "❌ Production build failed during database operations",
        prodDbNotReady: "💡 This build is NOT ready for production deployment",
        deploymentReady: "🚀 Your application is ready for production deployment!",
        dbConnectionError:
          "Database connection failed. Please ensure the database is running and accessible.",
        dbStartSuggestion:
          "Try running 'docker compose -f docker-compose-dev.yml up -d' to start the database",
        nextBuildHandled: "✅ Next.js build will be handled by yarn build command",
        failedProdMigrations: "Failed to run production migrations",
      },
    },
  },
};
