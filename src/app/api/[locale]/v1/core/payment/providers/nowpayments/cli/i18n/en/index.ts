export const translations = {
  post: {
    title: "NOWPayments CLI",
    description: "Manage NOWPayments webhook tunneling with ngrok",
    category: "Payment",
    tags: {
      nowpayments: "NOWPayments",
      cli: "CLI",
      webhook: "Webhook",
    },
    operations: {
      check: "Check",
      install: "Install",
      tunnel: "Tunnel",
      status: "Status",
    },
    form: {
      title: "NOWPayments CLI Operations",
      description: "Configure and manage ngrok tunnel for NOWPayments webhooks",
      fields: {
        operation: {
          label: "Operation",
          description: "Select the operation to perform",
          placeholder: "Choose an operation",
        },
        port: {
          label: "Port",
          description: "Local port to tunnel (default: 3000)",
          placeholder: "3000",
        },
      },
    },
    errors: {
      validationFailed: {
        title: "Validation Error",
        description: "Invalid operation or parameters",
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
        description: "Failed to execute operation",
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
    response: {
      title: "Response",
      description: "Operation result",
      fields: {
        success: "Success",
        installed: "Installed",
        version: "Version",
        status: "Status",
        output: "Output",
        instructions: "Instructions",
        tunnelUrl: "Tunnel URL",
        webhookUrl: "Webhook URL",
      },
    },
    success: {
      title: "Success",
      description: "Operation completed successfully",
    },
  },
};
