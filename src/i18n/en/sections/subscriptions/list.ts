export const listTranslations = {
  title: "All Subscriptions",
  description: "Browse and manage all user subscriptions in the system",
  empty: {
    title: "No subscriptions found",
    description:
      "No subscriptions match your current filters. Try adjusting your search criteria.",
  },
  table: {
    headers: {
      user: "User",
      plan: "Plan",
      status: "Status",
      billingInterval: "Billing",
      currentPeriod: "Current Period",
      nextBilling: "Next Billing",
      createdAt: "Created",
      actions: "Actions",
    },
  },
  filters: {
    search: {
      placeholder: "Search subscriptions by user email or plan...",
    },
    status: {
      label: "Status",
      all: "All Statuses",
      incomplete: "Incomplete",
      incompleteExpired: "Incomplete Expired",
      trialing: "Trialing",
      active: "Active",
      pastDue: "Past Due",
      canceled: "Canceled",
      unpaid: "Unpaid",
      paused: "Paused",
    },
    plan: {
      label: "Plan",
      all: "All Plans",
      starter: "Starter",
      professional: "Professional",
      premium: "Premium",
      enterprise: "Enterprise",
    },
    billingInterval: {
      label: "Billing Interval",
      all: "All Intervals",
      monthly: "Monthly",
      yearly: "Yearly",
    },
    sortBy: {
      label: "Sort by",
      createdAt: "Created Date",
      updatedAt: "Updated Date",
      currentPeriodStart: "Period Start",
      currentPeriodEnd: "Period End",
    },
    sortOrder: {
      label: "Order",
      asc: "Ascending",
      desc: "Descending",
    },
  },
  pagination: {
    showing: "Showing {{start}} to {{end}} of {{total}} subscriptions",
    page: "Page {{current}} of {{total}}",
  },
};
