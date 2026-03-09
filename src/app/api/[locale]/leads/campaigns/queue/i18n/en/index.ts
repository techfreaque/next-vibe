export const translations = {
  title: "Campaign Queue",
  description: "Leads currently active in email campaigns",
  get: {
    title: "Campaign Queue",
    description: "View paginated list of leads currently in email campaigns",
    fields: {
      page: {
        label: "Page",
        description: "Page number",
      },
      pageSize: {
        label: "Page Size",
        description: "Number of records per page",
      },
      campaignType: {
        label: "Campaign Type",
        description: "Filter by campaign type",
      },
    },
    response: {
      leadId: "Lead ID",
      leadEmail: "Email",
      businessName: "Business",
      campaignType: "Campaign Type",
      journeyVariant: "Journey Variant",
      currentStage: "Current Stage",
      nextScheduledAt: "Next Email",
      emailsSent: "Sent",
      emailsOpened: "Opened",
      emailsClicked: "Clicked",
      startedAt: "Started At",
      total: "Total",
      page: "Page",
      pageSize: "Page Size",
      items: "Queue Items",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to view the campaign queue",
      },
      forbidden: {
        title: "Forbidden",
        description: "You do not have permission to view the campaign queue",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while fetching the campaign queue",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid input parameters",
      },
    },
    success: {
      title: "Queue Retrieved",
      description: "Campaign queue retrieved successfully",
    },
  },
  widget: {
    title: "Campaign Queue",
    refresh: "Refresh",
    noData: "No leads currently in campaigns",
    empty: "No leads found",
    columnEmail: "Email",
    columnBusiness: "Business",
    columnType: "Type",
    columnStage: "Stage",
    columnVariant: "Variant",
    columnNext: "Next Email",
    columnSent: "Sent",
    columnOpen: "Opened",
    columnClick: "Clicked",
    columnStarted: "Started",
    never: "—",
    pagination: "Page {{page}} of {{totalPages}} · {{total}} leads",
  },
};
