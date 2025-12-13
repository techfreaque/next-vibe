export const translations = {
  get: {
    title: "List Leads",
    description: "Retrieve a paginated list of leads with filtering",
    form: {
      title: "Lead List Filters",
      description: "Configure filters for lead list",
    },
    actions: {
      refresh: "Refresh",
      refreshing: "Refreshing...",
    },
    page: {
      label: "Page Number",
      description: "Page number for pagination",
      placeholder: "Enter page number",
    },
    limit: {
      label: "Results Per Page",
      description: "Number of results to show per page",
      placeholder: "Enter limit",
    },
    status: {
      label: "Lead Status",
      description: "Filter by lead status",
      placeholder: "Select status",
    },
    currentCampaignStage: {
      label: "Campaign Stage",
      description: "Filter by current campaign stage",
      placeholder: "Select campaign stage",
    },
    source: {
      label: "Lead Source",
      description: "Filter by lead source",
      placeholder: "Select source",
    },
    country: {
      label: "Country",
      description: "Filter by country",
      placeholder: "Select countries",
    },
    language: {
      label: "Language",
      description: "Filter by language",
      placeholder: "Select languages",
    },
    search: {
      label: "Search",
      description: "Search leads by name, email, or business",
      placeholder: "Enter search term",
    },
    searchPagination: {
      title: "Search & Pagination",
      description: "Search and pagination controls",
    },
    statusFilters: {
      title: "Status & Campaign Filters",
      description: "Filter by status, campaign stage, and source",
    },
    locationFilters: {
      title: "Location Filters",
      description: "Filter by country and language",
    },
    sortingOptions: {
      title: "Sorting Options",
      description: "Configure result sorting",
    },
    sortBy: {
      label: "Sort By",
      description: "Field to sort results by",
      placeholder: "Select sort field",
    },
    sortOrder: {
      label: "Sort Order",
      description: "Sort order for results",
      placeholder: "Select sort order",
    },
    response: {
      title: "Lead List Response",
      description: "Paginated list of leads with metadata",
      leads: {
        title: "Lead Details",
        description: "Individual lead information",
        id: "Lead ID",
        email: "Email Address",
        businessName: "Business Name",
        contactName: "Contact Name",
        phone: "Phone Number",
        website: "Website",
        country: "Country",
        language: "Language",
        status: "Status",
        source: "Source",
        notes: "Notes",
        convertedUserId: "Converted User ID",
        convertedAt: "Converted At",
        signedUpAt: "Signed Up At",
        consultationBookedAt: "Consultation Booked At",
        subscriptionConfirmedAt: "Subscription Confirmed At",
        currentCampaignStage: "Current Campaign Stage",
        emailsSent: "Emails Sent",
        lastEmailSentAt: "Last Email Sent At",
        unsubscribedAt: "Unsubscribed At",
        emailsOpened: "Emails Opened",
        emailsClicked: "Emails Clicked",
        lastEngagementAt: "Last Engagement At",
        metadata: "Metadata",
        createdAt: "Created At",
        updatedAt: "Updated At",
      },
      total: "Total Leads",
      page: "Current Page",
      limit: "Page Size",
      totalPages: "Total Pages",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required to list leads",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid filter parameters",
      },
      server: {
        title: "Server Error",
        description: "Internal server error occurred while fetching leads",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred while fetching leads",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred while fetching leads",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden for lead list",
      },
      notFound: {
        title: "Not Found",
        description: "Leads not found",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred while fetching leads",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes in the lead list",
      },
    },
    success: {
      title: "Success",
      description: "Lead list retrieved successfully",
    },
  },
};
