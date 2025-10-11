export const translations = {
  get: {
    title: "Email Agent Status",
    description: "Retrieve processing status for emails",
    form: {
      title: "Status Query Parameters",
      description: "Filter and sort email agent processing status",
    },
    page: {
      label: "Page",
      description: "Page number for pagination",
    },
    limit: {
      label: "Limit",
      description: "Number of items per page",
    },
    emailId: {
      label: "Email ID",
      description: "Filter by specific email ID",
    },
    accountId: {
      label: "Account ID",
      description: "Filter by email account ID",
    },
    status: {
      label: "Status",
      description: "Filter by processing status",
    },
    actionType: {
      label: "Action Type",
      description: "Filter by action type",
    },
    priority: {
      label: "Priority",
      description: "Filter by processing priority",
    },
    sortBy: {
      label: "Sort By",
      description: "Fields to sort by",
    },
    sortOrder: {
      label: "Sort Order",
      description: "Sort order direction",
    },
    dateFrom: {
      label: "Date From",
      description: "Filter from this date",
    },
    dateTo: {
      label: "Date To",
      description: "Filter until this date",
    },
    response: {
      title: "Status Response",
      description: "Email agent processing status results",
      items: {
        item: "Status Item",
        emailId: "Email ID",
        status: "Status",
        lastProcessedAt: "Last Processed",
        hardRulesResult: "Hard Rules Result",
        aiProcessingResult: "AI Processing Result",
        priority: "Priority",
        createdAt: "Created At",
        updatedAt: "Updated At",
      },
      total: "Total",
      page: "Page",
      limit: "Limit",
      totalPages: "Total Pages",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to access agent status",
      },
      validation: {
        title: "Validation Failed",
        description: "Invalid parameters provided",
      },
      server: {
        title: "Server Error",
        description: "Failed to retrieve agent status",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      network: {
        title: "Network Error",
        description: "Network communication failed",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access to this resource is forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "Requested resource not found",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "Resource conflict occurred",
      },
    },
    success: {
      title: "Success",
      description: "Agent status retrieved successfully",
    },
  },
  post: {
    title: "Email Agent Status (CLI)",
    description: "CLI version for retrieving processing status",
    form: {
      title: "Status Query Parameters",
      description: "Configure parameters for status retrieval",
    },
    page: {
      label: "Page",
      description: "Page number for pagination",
    },
    limit: {
      label: "Limit",
      description: "Number of items per page",
    },
    response: {
      title: "Status Response",
      description: "Email agent processing status results",
      items: {
        item: "Status Item",
        emailId: "Email ID",
        status: "Status",
        lastProcessedAt: "Last Processed",
        hardRulesResult: "Hard Rules Result",
        aiProcessingResult: "AI Processing Result",
        priority: "Priority",
        createdAt: "Created At",
        updatedAt: "Updated At",
      },
      total: "Total",
      page: "Page",
      limit: "Limit",
      totalPages: "Total Pages",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to access agent status",
      },
      validation: {
        title: "Validation Failed",
        description: "Invalid parameters provided",
      },
      server: {
        title: "Server Error",
        description: "Failed to retrieve agent status",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      network: {
        title: "Network Error",
        description: "Network communication failed",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access to this resource is forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "Requested resource not found",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "Resource conflict occurred",
      },
    },
    success: {
      title: "Success",
      description: "Agent status retrieved successfully",
    },
  },
};
