import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/en";

export const translations = {
  ...analyticsTranslations,
  title: "Signups",
  titleShort: "Signups",
  description:
    "Who signed up, from which channel or ref code, how many verified, stayed active and paid, and who burns free credits. Every number against the previous period, every tile and row opens the matching accounts.",
  category: "Users",
  tag: "Statistics",
  response: {
    window: "Period",
    kpis: "KPIs",
    totals: "Totals",
    signupTrend: "Signups over time",
    activityTrend: "Activity over time",
    funnel: "Signup funnel",
    byChannel: "By channel",
    byRefCode: "By ref code",
    byPlan: "Subscribers by plan",
    byLocale: "By locale",
    freeBurners: "Top free burners",
  },
  widget: {
    planLapsed: "Lapsed subscription",
    planPacks: "Credit packs only",
    groups: {
      abuse: "Abuse",
      signups: "This period's signups",
      accounts: "All matching accounts, this period",
    },
    cliHint:
      "Accounts behind these signups: vibe users-list --audience=enums.audience.humans --signupFrom={{from}} --signupTo={{to}}",
    loading: "Crunching numbers...",
    filters: "Filters",
    openUsers: "Open accounts",
    empty: "No signups in this period.",
    noJourney: "(not tracked)",
    noRefCodes: "No ref-code signups in this period.",
    noSubscribers: "No active subscribers in this cohort.",
    noBurners: "Nobody burned free credits in this period.",
    signedUpOn: "joined {{date}}",
    banned: "Banned",
    unverified: "Unverified",
    kpi: {
      revenuePerPayerHint: "Revenue in period / paying accounts",
      revenuePerPayer: "Revenue per payer",
      revenuePeriod: "Revenue in period",
      activatedRate: "Spent credits",
      signups: "Signups",
      signupsHint:
        "Signed up in the period. {{total}} matching accounts all time",
      verifiedRate: "Verified",
      paidConversion: "Paid conversion",
      ofSignups: "{{count}} of {{total}} signups",
      activeUsers: "Active accounts",
      activeHint: "All matching accounts that spent credits in the period",
      payingUsers: "Paying accounts",
      payingHint: "All matching accounts that paid in the period",
      revenue: "Revenue",
      revenueHint:
        "All matching accounts, succeeded payments in the period, USD",
      freeBurn: "Free credit burn",
      freeBurnHint: "Credits spent by never-paid accounts. Accounts: {{count}}",
      banned: "Banned signups",
      bannedHint: "Signed up in the period, banned now",
    },
    series: {
      paid: "Paid",
      verified: "Verified, not paid",
      unverified: "Unverified, not paid",
      active: "Active accounts",
      paying: "Paying accounts",
    },
    funnel: {
      paid: "Paid",
      active: "Spent credits",
      verified: "Verified email",
      signups: "Signed up",
    },
    charts: {
      signups: "Signups",
      signupsHint:
        "New accounts per bucket, split by what they did since. Click a bar for the accounts.",
      activity: "Activity",
      activityHint:
        "All matching accounts per bucket. Legend shows distinct accounts in the period",
      funnel: "Signup milestones",
      funnelHint:
        "Signups in the period that reached each milestone. Counts match the tiles above.",
      byChannel: "Signups by first-touch channel",
      byChannelHint:
        "First touch of these signups. Revenue = their payments in the period",
      byRefCode: "Signups by ref code",
      byRefCodeHint:
        "Signups credited to a code, else the first-visit code. Can exceed the ref: channel rows",
      byPlan: "Paying accounts by plan",
      byPlanHint:
        "Accounts that paid in the period and their revenue; adds up to the Paying and Revenue tiles",
      byLocale: "Signups by locale",
      freeBurners: "Top free burners",
      freeBurnersHint: "Never paid, most credits spent in the period",
    },
    columns: {
      ofSignups: "% of signups",
      accounts: "Accounts",
      milestone: "Milestone",
      active: "Spent credits",
      creditsGranted: "Granted",
      creditsSpentTotal: "All time",
      creditBalance: "Balance",
      signups: "Signups",
      verified: "Verified",
      paid: "Paid",
      conversion: "Conv.",
      revenue: "Revenue in period",
      channel: "Channel",
      refCode: "Ref code",
      plan: "Plan",
      subscribers: "Accounts",
      revenueWindow: "Revenue",
      locale: "Locale",
      account: "Account",
      creditsSpent: "In period",
    },
    definitions:
      "Humans only by default: admins and test domains are excluded. Active = spent credits on the own or a linked guest wallet. Revenue in USD at static FX rates. Conversion counts payments made any time after signup.",
  },
  errors: {
    validation: {
      title: "Invalid stats request",
      description: "Check the window and dates",
    },
    unauthorized: {
      title: "Sign in required",
      description: "Sign in to view stats",
    },
    forbidden: {
      title: "Admins only",
      description: "You need the admin role to view stats",
    },
    notFound: {
      title: "No data",
      description: "Nothing to report for this window",
    },
    server: {
      title: "Could not compute stats",
      description: "The server failed to compute user statistics",
    },
    network: {
      title: "Network error",
      description: "Could not reach the server",
    },
    unknown: {
      title: "Unexpected error",
      description: "Something went wrong computing stats",
    },
    unsavedChanges: {
      title: "Unsaved changes",
      description: "You have unsaved changes",
    },
    conflict: {
      title: "Conflict",
      description: "The request conflicts with current data",
    },
  },
  success: {
    title: "Stats ready",
    description: "User statistics computed",
  },
};
