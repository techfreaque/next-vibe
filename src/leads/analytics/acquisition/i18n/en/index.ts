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
    title: "Acquisition",
    titleShort: "Acquisition",
    description:
      "Where visitors and leads come from: channel, source, referrer, campaign, landing page, country, device, humans vs bots. Every number opens the matching leads.",
    response: {
      window: "Period",
      kpis: "Key numbers",
      trend: "Trend",
      breakdown: "Breakdown",
      agents: "Agents",
      coverage: "Tracking coverage",
    },
    errors: {
      unauthorized: { title: "Unauthorized", description: "Log in as admin." },
      validation: {
        title: "Invalid filters",
        description: "Check the period and filter values.",
      },
      server: {
        title: "Report failed",
        description: "The acquisition report could not be computed.",
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
      description: "Acquisition report loaded.",
    },
  },
  widget: {
    revenue: "Revenue",
    humanVisits: "Human visits",
    botVisits: "Bot visits",
    botVisitsHint: "{{count}} bot visits",
    unknownLeadsHint: "{{count}} more without a user agent (unknown)",
    botsTitle: "Bot leads",
    botsSubtitle: "Crawlers, previews and scripts. Click a bar for its leads.",
    loading: "Loading acquisition report...",
    coverage:
      "Visits are tracked since {{date}}. Older leads count, but without visits.",
    botShareHint: "{{percent}} of new leads",
    leadsTitle: "Human leads",
    leadsSubtitle: "New human leads. Click a bar for its leads.",
    visitsTitle: "Tracked visits",
    visitsSubtitle: "Tracked arrivals. Humans vs leads classified as bots.",
    conversionsTitle: "Signups and payers",
    conversionsSubtitle: "By the day each step happened.",
    breakdownTitle: "Where leads come from",
    breakdownSubtitle: "First touch. Click a row for its leads.",
    agentsTitle: "Who shows up",
    agentsSubtitle: "Agent family from the user agent.",
    filtersTitle: "Segment",
    filtersSubtitle: "Narrow every number on this page.",
    apply: "Apply",
    empty: "No leads in this period.",
    emptyHint: "Pick a longer period or clear the filters.",
  },
};
