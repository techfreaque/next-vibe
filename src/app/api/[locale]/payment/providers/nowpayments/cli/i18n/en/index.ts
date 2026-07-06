export const translations = {
  post: {
    title: "NOWPayments CLI",
    titleShort: "NOWPayments",
    description: "Start ngrok tunnel for NOWPayments webhook forwarding",
    category: "Payment",
    tags: {
      nowpayments: "NOWPayments",
      cli: "CLI",
      webhook: "Webhook",
    },
    form: {
      title: "NOWPayments Tunnel",
      description:
        "Start an ngrok tunnel to receive NOWPayments webhooks locally",
      fields: {
        port: {
          label: "Port",
          description: "Local port to tunnel (default: 3000)",
          placeholder: "3000",
        },
      },
    },
    errors: {
      notInstalled: {
        title: "ngrok not installed",
        description:
          "ngrok is required to start the tunnel. Install it and try again.",
      },
      validationFailed: {
        title: "Validation Error",
        description: "Invalid parameters",
      },
      networkError: {
        title: "Network Error",
        description: "Network connection failed",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access denied",
      },
      notFound: {
        title: "Not Found",
        description: "Resource not found",
      },
      serverError: {
        title: "Server Error",
        description: "Failed to start tunnel",
      },
      unknownError: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "Resource conflict",
      },
    },
    success: {
      title: "Tunnel Started",
      description: "ngrok tunnel is running",
    },
  },
};
