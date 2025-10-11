export const confirmationTranslations = {
  error: {
    unauthorized: {
      title: "Unauthorized",
      description:
        "You are not authorized to respond to confirmation requests.",
    },
    validation: {
      title: "Validation error",
      description: "Invalid confirmation response data provided.",
    },
    not_found: {
      title: "Confirmation not found",
      description: "The confirmation request could not be found.",
    },
    conflict: {
      title: "Confirmation already processed",
      description: "This confirmation request has already been processed.",
    },
    expired: {
      title: "Confirmation expired",
      description:
        "This confirmation request has expired and cannot be processed.",
    },
    server: {
      title: "Server error",
      description:
        "An error occurred while processing the confirmation response.",
    },
    unknown: {
      title: "Unknown error",
      description: "An unknown error occurred during confirmation processing.",
    },
  },
  success: {
    approved: "Action approved and executed successfully",
    rejected: "Action rejected successfully",
  },
};
