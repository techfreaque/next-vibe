export const translations = {
  enums: {
    dateRangePreset: {
      today: "Today",
      yesterday: "Yesterday",
      last7Days: "Last 7 Days",
      last30Days: "Last 30 Days",
      last90Days: "Last 90 Days",
      thisWeek: "This Week",
      lastWeek: "Last Week",
      thisMonth: "This Month",
      lastMonth: "Last Month",
      thisQuarter: "This Quarter",
      lastQuarter: "Last Quarter",
      thisYear: "This Year",
      lastYear: "Last Year",
      custom: "Custom Range",
    },
    timePeriod: {
      hour: "Hour",
      day: "Day",
      week: "Week",
      month: "Month",
      quarter: "Quarter",
      year: "Year",
    },
    chartDataField: {
      count: "Total Count",
      completed: "Completed",
      cancelled: "Cancelled",
      noShow: "No Show",
    },
    chartType: {
      line: "Line Chart",
      bar: "Bar Chart",
      area: "Area Chart",
      pie: "Pie Chart",
      donut: "Donut Chart",
    },
  },
  get: {
    title: "Consultation Statistics",
    description: "View comprehensive consultation analytics and reports",
    container: {
      title: "Statistics Dashboard",
      description:
        "Analyze consultation data with advanced filtering and visualization",
    },

    // Request field translations
    dateRangePreset: {
      label: "Date Range Preset",
      description: "Select a predefined date range for filtering",
      placeholder: "Choose date range preset",
    },
    status: {
      label: "Consultation Status",
      description: "Filter by consultation status",
      placeholder: "Select status filter",
    },
    outcome: {
      label: "Consultation Outcome",
      description: "Filter by consultation outcome",
      placeholder: "Select outcome filter",
    },
    consultationType: {
      label: "Consultation Type",
      description: "Filter by consultation type",
      placeholder: "Select consultation type",
    },
    timePeriod: {
      label: "Time Period",
      description: "Select time period for grouping data",
      placeholder: "Choose time period",
    },
    chartType: {
      label: "Chart Type",
      description: "Select visualization chart type",
      placeholder: "Choose chart type",
    },
    userId: {
      label: "User ID",
      description: "Filter by specific user ID",
      placeholder: "Enter user ID",
    },
    leadId: {
      label: "Lead ID",
      description: "Filter by specific lead ID",
      placeholder: "Enter lead ID",
    },
    hasUserId: {
      label: "Has User ID",
      description: "Filter consultations that have an associated user",
    },
    hasLeadId: {
      label: "Has Lead ID",
      description: "Filter consultations that have an associated lead",
    },
    groupBy: {
      label: "Group By",
      description: "Group statistics by field",
      placeholder: "Select grouping field",
      options: {
        status: "Status",
        outcome: "Outcome",
        type: "Type",
        consultant: "Consultant",
        date: "Date",
      },
    },

    // Response field translations
    response: {
      title: "Statistics Response",
      description: "Consultation statistics response data",
      totalConsultations: {
        title: "Total Consultations",
        description: "Total consultations count",
      },
      scheduledConsultations: {
        title: "Scheduled Consultations",
        description: "Scheduled consultations count",
      },
      completedConsultations: {
        title: "Completed Consultations",
        description: "Completed consultations count",
      },
      cancelledConsultations: {
        title: "Cancelled Consultations",
        description: "Cancelled consultations count",
      },
      noShowConsultations: {
        title: "No-Show Consultations",
        description: "No-show consultations count",
      },
      rescheduledConsultations: {
        title: "Rescheduled Consultations",
        description: "Rescheduled consultations count",
      },
      pendingConsultations: {
        title: "Pending Consultations",
        description: "Pending consultations count",
      },
      totalRevenue: {
        title: "Total Revenue",
        description: "Total revenue amount",
      },
      averageRevenue: {
        title: "Average Revenue",
        description: "Average revenue per consultation",
      },
      averageDuration: {
        title: "Average Duration",
        description: "Average consultation duration",
      },
      completionRate: {
        title: "Completion Rate",
        description: "Consultation completion rate percentage",
      },
      cancellationRate: {
        title: "Cancellation Rate",
        description: "Consultation cancellation rate percentage",
      },
      noShowRate: {
        title: "No-Show Rate",
        description: "No-show rate percentage",
      },
      rescheduleRate: {
        title: "Reschedule Rate",
        description: "Reschedule rate percentage",
      },
      consultationsByStatus: {
        title: "Consultations by Status",
        description: "Breakdown of consultations by status",
        item: "Status breakdown item",
        status: "Status value",
        count: "Count for this status",
        percentage: "Percentage for this status",
      },
      consultationsByType: {
        title: "Consultations by Type",
        description: "Breakdown of consultations by type",
        item: "Type breakdown item",
        type: "Type value",
        count: "Count for this type",
        percentage: "Percentage for this type",
      },
      consultationsByDuration: {
        title: "Consultations by Duration",
        description: "Breakdown of consultations by duration",
        item: "Duration breakdown item",
        durationRange: "Duration range",
        count: "Count for this duration range",
        percentage: "Percentage for this duration range",
      },
      consultationsByTimeSlot: {
        title: "Consultations by Time Slot",
        description: "Breakdown of consultations by time slot",
        item: "Time slot breakdown item",
        timeSlot: "Time slot value",
        count: "Count for this time slot",
        percentage: "Percentage for this time slot",
      },
      consultationsByConsultant: {
        title: "Consultations by Consultant",
        description: "Breakdown of consultations by consultant",
        item: "Consultant breakdown item",
        consultantId: "Consultant ID",
        consultantName: "Consultant name",
        count: "Count for this consultant",
        percentage: "Percentage for this consultant",
      },
      historicalData: {
        title: "Historical Data",
        description: "Historical consultation data over time",
        item: "Historical data point",
        date: "Date for this data point",
        count: "Total count for this date",
        completed: "Completed count for this date",
        cancelled: "Cancelled count for this date",
        noShow: "No-show count for this date",
      },
      groupedStats: {
        title: "Grouped Statistics",
        description: "Statistics grouped by specified criteria",
        item: "Grouped statistic item",
        groupKey: "Group key identifier",
        groupValue: "Group value",
        count: "Count for this group",
        percentage: "Percentage for this group",
      },
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
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "Unsaved changes detected",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred",
      },
    },
    success: {
      title: "Success",
      description: "Statistics retrieved successfully",
    },
  },
};
