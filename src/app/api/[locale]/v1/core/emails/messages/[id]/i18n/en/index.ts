export const translations = {
  title: "Get Email by ID",
  description: "Retrieve a single email by its unique identifier",
  container: {
    title: "Email Details",
    description: "View detailed information about a specific email",
  },
  fields: {
    id: {
      label: "Email ID",
      description: "Unique identifier of the email to retrieve",
    },
  },
  response: {
    email: {
      title: "Email Details",
      description: "Complete information about the requested email",
      id: "Email ID",
      subject: "Subject",
      recipientEmail: "Recipient Email",
      recipientName: "Recipient Name",
      senderEmail: "Sender Email",
      senderName: "Sender Name",
      type: "Email Type",
      status: "Status",
      templateName: "Template Name",
      emailProvider: "Email Provider",
      externalId: "External ID",
      sentAt: "Sent At",
      deliveredAt: "Delivered At",
      openedAt: "Opened At",
      clickedAt: "Clicked At",
      retryCount: "Retry Count",
      error: "Error Message",
      userId: "User ID",
      leadId: "Lead ID",
      createdAt: "Created At",
      updatedAt: "Updated At",
    },
  },
  get: {
    errors: {
      validation: {
        title: "Validation Error",
        description: "The provided email ID is invalid",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be authenticated to access email details",
      },
      not_found: {
        title: "Email Not Found",
        description: "No email found with the specified ID",
      },
      forbidden: {
        title: "Forbidden",
        description: "You do not have permission to view this email",
      },
      server: {
        title: "Server Error",
        description:
          "An internal server error occurred while retrieving the email",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
    },
  },
  errors: {
    validation: {
      title: "Validation Error",
      description: "The provided email ID is invalid",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You must be authenticated to access email details",
    },
    notFound: {
      title: "Email Not Found",
      description: "No email found with the specified ID",
    },
    forbidden: {
      title: "Forbidden",
      description: "You do not have permission to view this email",
    },
    server: {
      title: "Server Error",
      description:
        "An internal server error occurred while retrieving the email",
    },
    conflict: {
      title: "Conflict Error",
      description: "A conflict occurred while processing the email request",
    },
    network: {
      title: "Network Error",
      description: "A network error occurred while retrieving the email",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "There are unsaved changes",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unexpected error occurred",
    },
  },
  success: {
    title: "Email Retrieved",
    description: "Email details retrieved successfully",
  },
};
