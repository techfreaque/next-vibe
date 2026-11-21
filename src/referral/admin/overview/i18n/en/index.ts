import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/en";

export const translations = {
  ...analyticsTranslations,
  category: "Referral",
  tags: {
    referral: "referral",
    admin: "admin",
    analytics: "analytics",
  },
  enums: {
    sort: {
      revenue: "Revenue",
      commission: "Commission",
      payers: "Paying users",
      signups: "Signups",
      leads: "Leads",
      clicks: "Clicks",
      conversion: "Click to signup",
      ownerQueue: "Owner payout queue",
      ownerFree: "Owner free to pay (lowest first)",
      newest: "Newest code",
    },
  },
  get: {
    title: "Referral Overview",
    titleShort: "Overview",
    description:
      "Every referral code and partner in one view: clicks, leads, signups, paying users, revenue, commission and the payout queue, compared with the previous period.",
    fields: {
      search: {
        label: "Search",
        description: "Code, label or owner email",
        placeholder: "Code, label or owner email",
      },
      ownerUserId: {
        label: "Owner",
        description: "Only codes of this partner (user id)",
      },
      activeOnly: {
        label: "Active codes only",
        description: "Hide deactivated codes",
      },
      sortBy: {
        label: "Sort codes by",
        description: "Order of the per-code table",
      },
      limit: {
        label: "Codes shown",
        description: "Maximum rows in the per-code table",
      },
    },
    response: {
      window: "Period",
      kpis: "Key numbers",
      trend: "Trend",
      codes: "Codes",
      codesTotal: "Codes in scope",
      overCommittedOwners: "Owners over-committed",
      payouts: "Payout queue",
    },
    widget: {
      kpi: {
        clicks: "Clicks",
        clicksHint: "Browser arrivals with a code",
        leads: "Leads",
        leadsHint: "Visitors credited to a code",
        signups: "Signups",
        signupsHint: "{{rate}} of clicks",
        payers: "Paying users",
        payersHint: "Referred users who paid in this period",
        revenue: "Revenue",
        revenueHint: "Paid by referred users",
        commission: "Commission earned",
        commissionHint: "{{pending}} on hold, {{confirmed}} confirmed",
        payoutsPaid: "Payouts paid",
        payoutsPaidHint: "Completed in this period",
        queue: "Payout queue",
        queueHint: "{{count}} open requests",
        queueEmpty: "Nothing waiting",
      },
      chart: {
        traffic: "Traffic",
        trafficSub: "Clicks and credited leads",
        conversions: "Conversions",
        conversionsSub: "New signups and paying users",
        money: "Revenue and commission",
        moneySub: "USD, by payment date",
      },
      series: {
        clicks: "Clicks",
        leads: "Leads",
        signups: "Signups",
        payers: "Paying users",
        revenue: "Revenue",
        commission: "Commission",
      },
      table: {
        title: "Codes",
        subtitle: "{{shown}} of {{total}} codes. Click a code for its report.",
        dimension: "Code",
        clicks: "Clicks",
        leads: "Leads",
        signups: "Signups",
        payers: "Payers",
        conversion: "Click to signup",
        revenue: "Revenue",
        commission: "Commission",
        signupsChange: "Signups vs prev.",
        ownerQueue: "Owner queue",
        ownerFree: "Owner free to pay",
        inactive: "inactive",
        overCommitted: "over-committed",
        overCommittedOwners: "{{count}} owners over-committed",
        empty: "No codes match these filters.",
        sort: "Sort",
      },
      payouts: {
        title: "Payouts by state",
        subtitle:
          "Current state of all requests. Click a state to work the list.",
        dimension: "State",
        count: "Requests",
        amount: "Amount",
        open: "Open payouts",
        empty: "No payout requests yet.",
      },
      filters: {
        search: "Search",
        owner: "Owner",
        activeOnly: "Active only",
        searchPlaceholder: "Code, label or owner email",
      },
      loading: "Loading referral overview",
      cli: {
        payouts: "Payout queue: {{count}} open, {{amount}}",
      },
    },
  },
  errors: {
    validation: {
      title: "Invalid filters",
      description: "Check the period and the filters",
    },
    unauthorized: {
      title: "Not signed in",
      description: "Sign in as an admin to see referral analytics",
    },
    forbidden: {
      title: "Admins only",
      description: "Only admins can see referral analytics",
    },
    notFound: {
      title: "Not found",
      description: "Nothing matches these filters",
    },
    conflict: {
      title: "Conflict",
      description: "The data changed while loading, try again",
    },
    server: {
      title: "Server error",
      description: "Could not build the referral overview",
    },
    network: {
      title: "Network error",
      description: "Request did not reach the server",
    },
    unknown: {
      title: "Unknown error",
      description: "Something unexpected failed",
    },
    unsavedChanges: {
      title: "Unsaved changes",
      description: "Save or discard your changes first",
    },
  },
  success: {
    title: "Loaded",
    description: "Referral overview loaded",
  },
};
