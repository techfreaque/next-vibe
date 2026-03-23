export const translations = {
  category: "Database Operations",
  tag: "migration",
  post: {
    title: "Generate Migrations",
    description: "Generate Drizzle migration files from schema changes",
    form: {
      title: "Generate Configuration",
      description: "Configure migration generation options",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid parameters",
      },
      network: {
        title: "Generation Failed",
        description: "drizzle-kit generate failed",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: {
        title: "Forbidden",
        description: "Insufficient permissions",
      },
      notFound: { title: "Not Found", description: "Resources not found" },
      server: { title: "Server Error", description: "Internal server error" },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      conflict: { title: "Conflict", description: "Conflict detected" },
    },
    success: {
      title: "Generation Successful",
      description: "Migration files generated successfully",
    },
  },
  fields: {
    success: { title: "Success Status" },
    output: { title: "Output" },
    duration: { title: "Duration (ms)" },
  },
};
