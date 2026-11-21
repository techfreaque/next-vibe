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
    title: "Funnel",
    titleShort: "Funnel",
    description:
      "Leads created in the period and how far they got: human, first chat, signup, email confirmed, paid. Per channel, source or ref code. Every step opens its leads.",
    response: {
      window: "Period",
      dimensionUsed: "Segment dimension",
      steps: "Funnel steps",
      previousSteps: "Previous period steps",
      rates: "Conversion rates",
      segments: "Funnel per segment",
      trend: "Cohort trend",
      signupSteps: "Signup steps in the period",
      previousSignupSteps: "Signup steps in the previous period",
      signupSegments: "Signup steps per segment",
    },
    errors: {
      unauthorized: { title: "Unauthorized", description: "Log in as admin." },
      validation: {
        title: "Invalid filters",
        description: "Check the period and filter values.",
      },
      server: {
        title: "Report failed",
        description: "The funnel report could not be computed.",
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
      description: "Funnel report loaded.",
    },
  },
  widget: {
    signupTitle: "Signup confirmation",
    signupSubtitle:
      "Leads per step, dated when the step happened. Drop-off shows where signups die.",
    started: "Started",
    emailSent: "Email sent",
    sendFailed: "Send failed",
    bounced: "Bounced",
    expired: "Expired",
    confirmed: "Confirmed",
    confirmRate: "Confirm rate",
    ofStarted: "{{count}} of {{total}} started",
    signupSegmentsTitle: "Signup steps per segment",
    signupSegmentsSubtitle: "Same steps split by the selected dimension.",
    signupEmpty: "No signup activity in this period.",
    signupLost: "Lost at email",
    signupLostHint: "Bounced, failed or expired before confirming",
    loading: "Loading funnel...",
    cohortHint: "of {{count}} leads created",
    signupRate: "Signup rate",
    payRate: "Pay rate",
    overallRate: "Human to payer",
    overallShort: "To payer",
    ofHumans: "{{count}} of {{total}} human leads",
    ofSignups: "{{count}} of {{total}} signups",
    funnelTitle: "Cohort funnel",
    funnelSubtitle:
      "Funnel from human leads. Bots and raw leads: see the first card.",
    trendTitle: "Cohort by creation day",
    trendSubtitle: "Human leads and how many of them converted.",
    segmentsTitle: "Funnel per segment",
    segmentsSubtitle: "Rates are per human lead. Click a row for its leads.",
    filtersTitle: "Segment",
    filtersSubtitle: "Narrow every number on this page.",
    apply: "Apply",
    empty: "No leads in this period.",
  },
};
