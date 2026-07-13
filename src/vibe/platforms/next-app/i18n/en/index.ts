export const translations = {
  generate: {
    post: {
      title: "Generate Next App",
      titleShort: "Gen Next",
      description:
        "Generate Next.js app-structure re-export shells (page.tsx / route.ts) into src/generated/app from the authoritative source. Honors 'use custom'.",
      tag: "generate",
      response: {
        success: "Generation succeeded",
        fields: {
          success: "Success",
          created: "Created",
          skipped: "Skipped",
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
          description: "An error occurred while generating shells",
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
        unsaved: {
          title: "Unsaved Changes",
          description: "There are unsaved changes",
        },
      },
      success: {
        title: "Success",
        description: "Next app shells generated successfully",
      },
    },
  },
};
