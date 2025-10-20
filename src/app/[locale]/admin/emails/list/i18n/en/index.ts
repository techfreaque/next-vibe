export const translations = {
  // UI translations for list page
  admin: {
    title: "Email Management",
    description:
      "Monitor email campaigns, track performance, and analyze engagement",
    filters: {
      title: "Filters",
      search: "Search emails...",
      status: "Filter by status",
      type: "Filter by type",
      clear: "Clear Filters",
      quick_filters: "Quick Filters",
      quick: {
        sent: "Sent",
        opened: "Opened",
        bounced: "Bounced",
        lead_campaigns: "Lead Campaigns",
      },
    },
    status: {
      all: "All Statuses",
      pending: "Pending",
      sent: "Sent",
      delivered: "Delivered",
      opened: "Opened",
      clicked: "Clicked",
      bounced: "Bounced",
      failed: "Failed",
      unsubscribed: "Unsubscribed",
    },
    type: {
      all: "All Types",
      transactional: "Transactional",
      marketing: "Marketing",
      notification: "Notification",
      system: "System",
      lead_campaign: "Lead Campaign",
      user_communication: "User Communication",
    },
    sort: {
      field: "Sort by",
      created_at: "Created Date",
      sent_at: "Sent Date",
      subject: "Subject",
      recipient_email: "Recipient",
      status: "Status",
      type: "Type",
      order: "Sort order",
      desc: "Descending",
      asc: "Ascending",
    },
    table: {
      subject: "Subject",
      recipient: "Recipient",
      status: "Status",
      type: "Type",
      sentAt: "Sent At",
      actions: "Actions",
    },
    messages: {
      noEmails: "No emails found",
      noEmailsDescription:
        "Try adjusting your filters or create a new email campaign",
    },
  },

  pagination: {
    showing: "Showing {start} to {end} of {total} results",
    previous: "Previous",
    next: "Next",
  },

  // Navigation translations
  nav: {
    campaigns: "Email List",
  },

  // API endpoint translations
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
