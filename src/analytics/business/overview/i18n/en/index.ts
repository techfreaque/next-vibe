import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/en";

import { translations as leadAnalyticsTranslations } from "@/leads/analytics/i18n/en";

export const translations = {
  ...analyticsTranslations,
  ...leadAnalyticsTranslations,
  platformSummary: {
    grossReceipts: "Gross receipts",
    refunds: "Refunds",
    netReceipts: "Receipts after refunds",

    valuationBasis:
      "Margin uses credits at list price minus provider cost. Only usage with a recorded cost is included.",
    valuationCost: "Estimated AI cost",
    valuationMargin: "Estimated AI usage margin",
    newAccount: "Account registered",
    receivedPayment: "Payment received",
    completedTask: "Scheduled task completed",
    operations: "Operations",
    emptyActivity: "No activity in this period.",
    period: "Last 30 days compared with the previous 30 days",
    retry: "Try again",
    title: "Platform overview",
    description:
      "Review acquisition, revenue and service health over the last 30 days.",
    unavailable: "Unavailable",
    recent: "Recent activity",
    recentPayments: "Recent payments",
    emptyPayments: "No payments in the last 30 days.",
  },
  category: "Analytics",
  tags: {
    analytics: "Analytics",
    overview: "Overview",
  },
  get: {
    title: "Business overview",
    titleShort: "Overview",
    description:
      "Traffic, leads, signups, payers, revenue, AI cost and alerts for a period, compared with the previous period. Every number opens the report behind it.",
    response: {
      window: "Period",
      generatedAt: "Data as of",
      acquisition: "Acquisition",
      referral: "Referrals",
      money: "Money",
      ops: "Operations",
    },
    widget: {
      kpi: {
        visits: "Human visits",
        humanLeads: "New leads",
        botLeadsHint: "{{count}} bot leads excluded",
        botVisitsHint: "{{count}} bot visits excluded",
        excludedLeadsHint:
          "{{bots}} bot and {{unknown}} unknown leads excluded",
        excludedVisitsHint:
          "{{bots}} bot and {{unknown}} unknown visits excluded",
        creditSpendHintNoPrevCost:
          "Provider cost {{cost}} (not recorded in the previous period). {{guests}} by guests.",
        creditSpendHintNoCompare:
          "Provider cost {{cost}}. {{guests}} by guests.",
        payersHint: "Distinct payers in period",
        signups: "Signups",
        signupRateHint: "{{rate}} of new leads",
        payers: "Customers who paid",
        revenue: "Revenue",
        revenueHint: "Cash collected, approx. USD",
        revenueNetHint:
          "Cash collected, approx. USD. {{net}} after AI provider cost.",
        creditSpend: "AI usage (credits consumed)",
        guestSpendHint: "{{amount}} by guests",
        creditSpendHint:
          "Provider cost {{cost}} (vs {{previous}}). {{guests}} by guests.",
        margin: "AI usage margin",
        marginPartial: "AI margin (partial)",
        marginHint:
          "Provider cost {{cost}}. Billed minus cost where cost is known.",
        marginBaseHint:
          "{{rate}} of {{base}} billed usage with cost data. Provider cost {{cost}}.",
        marginRateHint:
          "{{margin}} on {{base}} with cost data ({{coverage}} of usage).",
        errors: "Unresolved errors",
        errorsHint: "{{count}} occurrences in period",
        botShare: "Bot share of leads",
        botShareHint: "{{count}} bot leads, top source in Needs attention",
        botShareTopHint: "{{count}} bot leads. Top burst {{prefix}}.",
      },
      trafficChart: "Human leads and signups",
      trafficChartHint: "Bots excluded",
      moneyChart: "Revenue",
      moneyChartHint: "Cash collected per bucket",
      series: {
        visits: "Visits",
        leads: "New leads",
        signups: "Signups",
        revenueUsd: "Revenue",
        spendUsd: "AI usage billed",
        upstreamCostUsd: "Provider cost",
      },
      sources: "Where leads come from (first touch)",
      sourcesDimension: "Channel",
      sourcesHint:
        "Activity in this period by each person's first-touch channel",
      referralsHint:
        "Clicks, signups and payments credited to the code in this period",
      leadShare: "Lead share",
      revenueShare: "Revenue share",
      footerSources:
        "Revenue in these rows: {{rows}} of {{total}} collected in the period",
      footerReferrals:
        "Credited to codes (commission basis): {{rows}} of {{total}} collected in the period",
      referrals: "Top referral codes",
      referralsDimension: "Code",
      columns: {
        leads: "Leads",
        signups: "Signups",
        payers: "Payers",
        clicks: "Clicks",
        revenueUsd: "Revenue",
        conversion: "Lead to signup",
        clickToSignup: "Click to signup",
      },
      alerts: {
        severity: { high: "High", medium: "Medium", low: "Low" },
        title: "Needs attention",
        none: "Nothing needs attention in this period.",
        abuse:
          "{{count}} IP ranges with lead bursts, top {{prefix}} ({{leads}} leads)",
        payouts: "{{count}} payout requests waiting ({{amount}})",
        tasks: "{{count}} scheduled tasks failing",
        connections: "{{count}} remote connections unhealthy",
        failedPayments: "Failed payments in the last 30 days: {{count}}",
        disputes: "Open payment disputes: {{count}}",
        costCoverage:
          "Provider cost known for only {{coverage}} of AI usage, margin is partial",
        unattributed: "{{share}} of revenue has no known source ({{amount}})",
        errors:
          "{{count}} unresolved errors, {{occurrences}} occurrences in period",
        errorsSince:
          "{{count}} unresolved errors, {{occurrences}} occurrences since {{date}} (daily counts start then)",
      },
      open: {
        acquisition: "Acquisition report",
        funnel: "Funnel",
        referrals: "Referral overview",
        revenue: "Revenue report",
        usage: "AI usage report",
        errors: "Error logs",
      },
      unavailable: "This section could not be loaded.",
      asOf: "Data as of {{time}}. Cached for one minute.",
      loading: "Loading overview",
    },
    errors: {
      unauthorized: {
        title: "Not signed in",
        description: "Sign in as an admin to see the business overview.",
      },
      validation: {
        title: "Invalid period",
        description: "Check the period and dates.",
      },
      server: {
        title: "Overview failed",
        description: "The overview could not be computed. Try again.",
      },
      unknown: {
        title: "Unexpected error",
        description: "Something went wrong while loading the overview.",
      },
      network: {
        title: "Network error",
        description: "The server could not be reached.",
      },
      forbidden: {
        title: "Admins only",
        description: "Only admins can see the business overview.",
      },
      notFound: {
        title: "Not found",
        description: "The overview is not available.",
      },
      unsavedChanges: {
        title: "Unsaved changes",
        description: "Save or discard your changes first.",
      },
      conflict: {
        title: "Conflict",
        description: "The data changed while loading. Try again.",
      },
    },
    success: {
      title: "Overview loaded",
      description: "Business overview for the selected period.",
    },
  },
};
