export const translations = {
  tag: "Messages List",
  get: {
    title: "List IMAP Messages",
    description:
      "Retrieve a paginated list of IMAP messages with filtering and sorting",
    container: {
      title: "Messages Query",
      description: "Configure message listing parameters",
    },
    page: {
      label: "Page",
      description: "Page number for pagination",
    },
    limit: {
      label: "Limit",
      description: "Number of messages per page",
    },
    accountId: {
      label: "Account ID",
      description: "IMAP account identifier",
      placeholder: "Select an IMAP account",
    },
    folderId: {
      label: "Folder ID",
      description: "IMAP folder identifier (optional)",
      placeholder: "Select a folder",
    },
    search: {
      label: "Search",
      description: "Search messages by subject, sender, or content",
      placeholder: "Enter search terms...",
    },
    status: {
      label: "Status",
      description: "Filter messages by status",
    },
    sortBy: {
      label: "Sort By",
      description: "Field to sort messages by",
    },
    sortOrder: {
      label: "Sort Order",
      description: "Sort direction (ascending or descending)",
    },
    dateFrom: {
      label: "Date From",
      description: "Filter messages from this date",
    },
    dateTo: {
      label: "Date To",
      description: "Filter messages until this date",
    },
    response: {
      message: {
        title: "Message",
        description: "IMAP message details",
        id: "Message ID",
        subject: "Subject",
        senderEmail: "Sender Email",
        senderName: "Sender Name",
        isRead: "Read Status",
        isFlagged: "Flagged Status",
        hasAttachments: "Has Attachments",
        sentAt: "Sent At",
        headers: "Email Headers",
      },
      total: "Total Messages",
      page: "Current Page",
      limit: "Page Limit",
      totalPages: "Total Pages",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid message list parameters",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required to list messages",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access to messages is forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "Messages or account not found",
      },
      conflict: {
        title: "Conflict",
        description: "Message list request conflicts with existing data",
      },
      server: {
        title: "Server Error",
        description: "Internal server error occurred while listing messages",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred while listing messages",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes in the message list",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred while listing messages",
      },
    },
    success: {
      title: "Messages Listed Successfully",
      description: "Messages have been retrieved successfully",
    },
  },
  post: {
    title: "List",
    description: "List endpoint",
    form: {
      title: "List Configuration",
      description: "Configure list parameters",
    },
    response: {
      title: "Response",
      description: "List response data",
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
      description: "Operation completed successfully",
    },
  },
};
