/**
 * Shared analytics vocabulary.
 *
 * Endpoints that use `analyticsWindowFields` spread these translations at the
 * root of their own i18n (`...analyticsTranslations`) so the field labels and
 * enum values resolve in their scope as well.
 */
export const translations = {
  analytics: {
    review: "Review",
    reviewItem: "Review {{item}}",
    range: {
      label: "Period",
      description: "Time window for the report",
      last7Days: "Last 7 days",
      last30Days: "Last 30 days",
      last90Days: "Last 90 days",
      last6Months: "Last 6 months",
      last12Months: "Last 12 months",
      allTime: "All time",
      custom: "Custom",
    },
    rangeShort: {
      last7Days: "7d",
      last30Days: "30d",
      last90Days: "90d",
      last6Months: "6m",
      last12Months: "12m",
      allTime: "All",
      custom: "Custom",
    },
    from: {
      label: "From",
      description: "Start date (custom period, inclusive)",
    },
    to: {
      label: "To",
      description: "End date (custom period, inclusive)",
    },
    granularity: {
      label: "Group by",
      description: "Bucket size for charts",
      auto: "Auto",
      day: "Day",
      week: "Week",
      month: "Month",
    },
    chart: {
      points: "{{value}} pp",
      vsValue: "vs {{value}}",
      comparedTo: "vs {{period}}",
      vsPrevious: "vs previous period",
      noPrevious: "no previous data",
      empty: "No data in this period.",
      total: "Total",
      other: "Other",
      share: "Share",
      unknown: "Unknown",
      none: "(none)",
      ofPrevious: "of previous step",
      ofFirst: "of first step",
      dropOff: "drop-off",
      open: "Open",
      openList: "Open list",
      period: "Period",
      showing: "Showing {{count}} of {{total}}",
      showAll: "Show all",
      showLess: "Show less",
      series: "Series",
      value: "Value",
      apply: "Apply",
      clearFilters: "Clear filters",
      filters: "Filters",
      refresh: "Refresh",
      byGranularity: "by {{granularity}}",
      groupedBy: {
        day: "by day",
        week: "by week",
        month: "by month",
      },
    },
  },
};
