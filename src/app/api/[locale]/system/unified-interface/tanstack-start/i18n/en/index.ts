export const translations = {
  generate: {
    post: {
      title: "Generate TanStack Routes",
      description:
        "Generate TanStack Router compatibility wrappers for Next.js pages",
      response: {
        fields: {
          success: "Success",
          created: "Created Files",
          skipped: "Skipped Files",
          errors: "Errors",
          message: "Message",
        },
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Invalid request parameters",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "You are not authorized to perform this action",
        },
        server: {
          title: "Server Error",
          description: "An error occurred while generating routes",
        },
        network: {
          title: "Network Error",
          description: "A network error occurred",
        },
        forbidden: {
          title: "Forbidden",
          description: "You do not have permission to perform this action",
        },
        notFound: {
          title: "Not Found",
          description: "Source directory not found",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unknown error occurred",
        },
        conflict: {
          title: "Conflict",
          description: "A conflict occurred",
        },
      },
      success: {
        title: "Success",
        description:
          "Generated {{created}} files, skipped {{skipped}} files, {{errors}} errors",
      },
    },
  },
};
