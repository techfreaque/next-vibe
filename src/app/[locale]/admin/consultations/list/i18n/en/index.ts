export const translations = {
  list: {
    title: "Consultation List",
    description: "View and manage all consultations",
    filters: {
      status: "Filter by Status",
      dateRange: "Date Range",
      businessType: "Business Type",
      searchPlaceholder: "Search consultations...",
      clearFilters: "Clear Filters",
      applyFilters: "Apply Filters",
    },
    table: {
      columns: {
        user: "User",
        email: "Email",
        phone: "Phone",
        status: "Status",
        businessType: "Business Type",
        preferredDate: "Preferred Date",
        scheduledDate: "Scheduled Date",
        message: "Message",
        createdAt: "Created",
        actions: "Actions",
      },
      actions: {
        edit: "Edit",
        delete: "Delete",
        schedule: "Schedule",
        complete: "Mark Complete",
        cancel: "Cancel",
      },
      pagination: {
        showing: "Showing",
        of: "of",
        results: "results",
        previous: "Previous",
        next: "Next",
        page: "Page",
      },
    },
    states: {
      loading: "Loading consultations...",
      noResults: "No consultations found",
      error: "Error loading consultations",
    },
  },
};
