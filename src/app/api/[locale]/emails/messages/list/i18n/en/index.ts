export const translations = {
  title: "List Emails",
  description:
    "Retrieve a paginated list of emails with filtering and pagination",
  container: {
    title: "Email List",
    description: "Configure email list parameters and view results",
  },
  filters: {
    title: "Filters",
    description: "Filter and search emails",
  },
  displayOptions: {
    title: "Display Options",
  },
  fields: {
    dateRange: {
      title: "Date Range",
    },
    page: {
      label: "Page",
      description: "Page number for pagination",
      placeholder: "Enter page number",
    },
    limit: {
      label: "Limit",
      description: "Number of items per page",
      placeholder: "Enter limit",
    },
    search: {
      label: "Search",
      description: "Search emails by subject, recipient, or sender",
      placeholder: "Search emails...",
    },
    status: {
      label: "Status",
      description: "Filter by email status",
      placeholder: "Select status",
    },
    type: {
      label: "Type",
      description: "Filter by email type",
      placeholder: "Select type",
    },
    sortBy: {
      label: "Sort By",
      description: "Field to sort by",
      placeholder: "Select sort field",
    },
    sortOrder: {
      label: "Sort Order",
      description: "Sort order direction",
      placeholder: "Select sort order",
    },
    dateFrom: {
      label: "Date From",
      description: "Filter emails from this date",
      placeholder: "Select start date",
    },
    dateTo: {
      label: "Date To",
      description: "Filter emails until this date",
      placeholder: "Select end date",
    },
  },
  response: {
    emails: {
      title: "Emails",
      emptyState: {
        title: "No emails found",
        description: "No emails match your current filters",
      },
      item: {
        title: "Email",
        description: "Email details",
        id: "ID",
        subject: "Subject",
        recipientEmail: "Recipient Email",
        recipientName: "Recipient Name",
        senderEmail: "Sender Email",
        senderName: "Sender Name",
        type: "Type",
        status: "Status",
        templateName: "Template Name",
        emailProvider: "Email Provider",
        externalId: "External ID",
        sentAt: "Sent At",
        deliveredAt: "Delivered At",
        openedAt: "Opened At",
        clickedAt: "Clicked At",
        retryCount: "Retry Count",
        error: "Error",
        userId: "User ID",
        leadId: "Lead ID",
        createdAt: "Created At",
        updatedAt: "Updated At",
        emailCore: {
          title: "Core Information",
        },
        emailParties: {
          title: "Sender & Recipient",
        },
        emailMetadata: {
          title: "Metadata",
        },
        emailEngagement: {
          title: "Engagement Tracking",
        },
        technicalDetails: {
          title: "Technical Details",
        },
        associatedIds: {
          title: "Associated IDs",
        },
        timestamps: {
          title: "Timestamps",
        },
      },
    },
    pagination: {
      title: "Pagination",
      description: "Pagination information",
      page: "Current Page",
      limit: "Items Per Page",
      total: "Total Items",
      totalPages: "Total Pages",
    },
    filters: {
      title: "Applied Filters",
      description: "Currently applied filters",
      status: "Status Filter",
      type: "Type Filter",
      search: "Search Query",
      dateFrom: "Start Date",
      dateTo: "End Date",
    },
  },
  errors: {
    validation: {
      title: "Validation Error",
      description: "The provided parameters are invalid",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You must be authenticated to access this resource",
    },
    forbidden: {
      title: "Forbidden",
      description: "You do not have permission to access this resource",
    },
    notFound: {
      title: "Not Found",
      description: "The requested resource was not found",
    },
    server: {
      title: "Server Error",
      description: "An internal server error occurred",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unexpected error occurred",
    },
    unsaved: {
      title: "Unsaved Changes",
      description: "You have unsaved changes",
    },
    conflict: {
      title: "Conflict",
      description: "The request conflicts with the current state",
    },
    network: {
      title: "Network Error",
      description: "A network error occurred",
    },
  },
  success: {
    title: "Success",
    description: "Emails retrieved successfully",
  },
};
