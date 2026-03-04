export const translations = {
  category: "Electron",
  tags: {
    electronBuild: "Electron Build",
  },
  post: {
    title: "Build Electron App",
    description:
      "Compile main/preload with bun, run vibe build, then package with electron-builder",
    form: {
      title: "Electron Build Configuration",
      description: "Configure the Electron build parameters",
    },
    response: {
      title: "Response",
      description: "Build response data",
    },
    fields: {
      viBuild: {
        title: "Run vibe build",
        description: "Run vibe build (Next.js + migrations) before packaging",
      },
      generate: {
        title: "Generate endpoints",
        description: "Regenerate endpoint index before building",
      },
      platform: {
        title: "Target platform",
        description: "Which platform to package for",
        options: {
          current: "Current OS",
          linux: "Linux",
          mac: "macOS",
          win: "Windows",
          all: "All platforms",
        },
      },
      success: {
        title: "Success",
      },
      output: {
        title: "Output",
      },
      duration: {
        title: "Duration (ms)",
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
      description: "Electron app built successfully",
    },
  },
};
