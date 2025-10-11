export const translations = {
  tags: {
    confirmation: "Confirmation",
    automation: "Automation",
  },
  post: {
    title: "Human Confirmation Response",
    description: "Respond to a human confirmation request (approve/reject)",
    form: {
      title: "Confirmation Response",
      description: "Provide your confirmation response",
    },
    id: {
      label: "Confirmation ID",
      description: "The ID of the confirmation request",
    },
    confirmationId: {
      label: "Confirmation ID",
      description: "The ID of the confirmation request to respond to",
    },
    action: {
      label: "Action",
      description: "Approve or reject the confirmation request",
    },
    reason: {
      label: "Reason",
      description: "Optional reason for your decision",
      placeholder: "Enter reason for approval/rejection...",
    },
    metadata: {
      label: "Metadata",
      description: "Additional metadata for the response",
      placeholder: "Enter JSON metadata...",
    },
    response: {
      title: "Response Result",
      description: "Confirmation response result",
      success: "Response successful",
      message: "Confirmation response processed successfully",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required to respond to confirmations",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid confirmation response data provided",
      },
      server: {
        title: "Server Error",
        description: "Internal server error occurred during confirmation",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred during confirmation",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred while processing confirmation",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access to confirmation response is forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "Confirmation request not found",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes that need to be saved first",
      },
      conflict: {
        title: "Confirmation Conflict",
        description: "Confirmation has already been responded to or expired",
      },
    },
    success: {
      title: "Confirmation Submitted",
      description: "Your confirmation response has been submitted successfully",
    },
  },
  enums: {
    action: {
      approve: "Approve",
      reject: "Reject",
    },
  },
  imapErrors: {
    agent: {
      confirmation: {
        error: {
          not_found: {
            description: "Confirmation request not found",
          },
          conflict: {
            description: "Confirmation has already been responded to",
          },
          expired: {
            description: "Confirmation request has expired",
          },
          server: {
            description: "Failed to process confirmation response",
          },
        },
        success: {
          approved: "Confirmation approved successfully",
          rejected: "Confirmation rejected successfully",
        },
      },
    },
  },
};
