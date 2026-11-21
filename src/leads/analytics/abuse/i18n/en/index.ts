import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/en";

import { translations as leadAnalyticsTranslations } from "@/leads/analytics/i18n/en";

export const translations = {
  ...analyticsTranslations,
  ...leadAnalyticsTranslations,
  tags: {
    leads: "leads",
    analytics: "analytics",
  },
  get: {
    title: "Abuse signals",
    titleShort: "Abuse",
    description:
      "Lead and signup bursts from one network or one user agent, and free credits burned by visitors who never signed up. Every row opens the matching leads.",
    fields: {
      minLeads: {
        label: "Burst threshold",
        description:
          "Leads from one cluster in the period before it counts as a burst",
      },
    },
    response: {
      window: "Period",
      groupByUsed: "Grouped by",
      minLeadsUsed: "Burst threshold",
      kpis: "Key numbers",
      trend: "Leads from flagged clusters",
      clusters: "Clusters",
      burners: "Top free-credit burners",
    },
    errors: {
      unauthorized: { title: "Unauthorized", description: "Log in as admin." },
      validation: {
        title: "Invalid filters",
        description: "Check the period and filter values.",
      },
      server: {
        title: "Report failed",
        description: "The abuse report could not be computed.",
      },
      unknown: { title: "Unknown error", description: "Something went wrong." },
      network: { title: "Network error", description: "Server not reachable." },
      forbidden: { title: "Forbidden", description: "Admins only." },
      notFound: { title: "Not found", description: "No report data." },
      unsavedChanges: {
        title: "Unsaved changes",
        description: "Apply or discard your filter changes.",
      },
      conflict: { title: "Conflict", description: "Data changed. Reload." },
    },
    success: {
      title: "Report ready",
      description: "Abuse report loaded.",
    },
  },
  widget: {
    fast: "Fast",
    noIp: "No IP",
    perHour: "Leads/hour",
    thresholdOption: "{{count}}+ leads",
    loading: "Loading abuse signals...",
    flaggedPrefixes: "Flagged networks",
    flaggedAgents: "Flagged agents",
    thresholdHint: "{{count}}+ leads in the period",
    flaggedLeads: "Leads in bursts",
    flaggedShare: "{{percent}}% of new leads",
    freeCredits: "Free credits burned",
    freeCreditsHint: "By visitors without an account",
    burners: "Burning visitors",
    burnersHint: "Non-users spending free credits",
    trendTitle: "Leads from bursts",
    trendSubtitle: "Bursts = clusters with {{count}}+ leads in the period.",
    seriesFlagged: "From bursts",
    seriesOther: "Other leads",
    clustersIpTitle: "Bursts by network",
    clustersUaTitle: "Bursts by user agent",
    clustersSubtitle:
      "Sorted by leads per hour. Fast = {{rate}}+ leads/hour. Click a row for its leads.",
    prefix: "Network",
    userAgent: "User agent",
    prefixes: "Distinct networks",
    agents: "Distinct agents",
    noClusters: "No cluster reached {{count}} leads in this period.",
    burnersTitle: "Top free-credit burners",
    burnersSubtitle: "Visitors without an account. Click to open the lead.",
    lead: "Lead",
    requests: "Requests",
    noBurners: "No free credits burned by non-users in this period.",
    filtersTitle: "Segment",
    filtersSubtitle: "Narrow every number on this page.",
    apply: "Apply",
  },
};
