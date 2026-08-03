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
        instructions:
          "To install ngrok:\n\n1. Visit https://ngrok.com/download\n2. Download ngrok for your platform\n3. Extract it and move it into your PATH\n4. Run: ngrok authtoken YOUR_AUTH_TOKEN (get your token at https://dashboard.ngrok.com/get-started/your-authtoken)\n\nOr install it with a package manager:\n- macOS: brew install ngrok/ngrok/ngrok\n- Linux: snap install ngrok\n- Windows: choco install ngrok",
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
        noTunnelUrl: "Could not read the ngrok tunnel URL",
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
