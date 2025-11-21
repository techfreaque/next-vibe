export default {
  post: {
    summary: "Start Interactive Mode",
    description: "Launch interactive command-line interface for exploring available commands",
    response: {
      success: {
        title: "Interactive Mode Started",
        description: "Interactive mode is now active",
      },
    },
    errors: {
      unauthorized: {
        title: "Authentication Required",
        description: "You must be authenticated to use interactive mode",
      },
      server_error: {
        title: "Failed to Start",
        description: "Could not start interactive mode",
      },
    },
  },
};
