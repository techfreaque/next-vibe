import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/en";

export const translations = {
  ...analyticsTranslations,
  title: "Campaign performance",
  description:
    "Is campaign mail leaving, what is stuck in the queue, and how each journey performs",
  enums: {
    emailJourneyVariantFilter: {
      all: "All",
      uncensoredConvert: "Uncensored Convert",
      sideHustle: "Side Hustle",
      quietRecommendation: "Quiet Recommendation",
      signupNurture: "Signup Nurture",
      retention: "Retention",
      winback: "Winback",
      newsletterMay2026: "Newsletter May 2026",
      newsletterNov2026: "Newsletter November 2026",
    },
    emailJourneyVariant: {
      uncensoredConvert: "Uncensored Convert",
      sideHustle: "Side Hustle",
      quietRecommendation: "Quiet Recommendation",
      signupNurture: "Signup Nurture",
      retention: "Retention",
      winback: "Winback",
      newsletterMay2026: "Newsletter May 2026",
      newsletterNov2026: "Newsletter November 2026",
    },
    emailCampaignStageFilter: {
      all: "All",
    },
    emailCampaignStage: {
      notStarted: "Not Started",
      initial: "Initial Contact",
      followup1: "Follow-up 1",
      followup2: "Follow-up 2",
      followup3: "Follow-up 3",
      nurture: "Nurture",
      reactivation: "Reactivation",
    },
  },
  get: {
    title: "Campaign performance",
    titleShort: "Campaigns",
    description:
      "Engine status, queue health and email performance over time: sent, opened, clicked, unsubscribed, bounced and failed per journey variant, stage and locale. Every number opens the matching leads.",
    fields: {
      journeyVariant: {
        label: "Journey variant",
        description: "Only this email journey",
        placeholder: "Any journey",
      },
      stage: {
        label: "Stage",
        description: "Only emails of this campaign stage",
        placeholder: "Any stage",
      },
      locale: {
        label: "Locale",
        description: "Rendered locale (de-DE) or language (de)",
        placeholder: "Any locale",
      },
    },
    response: {
      variantTrend: "Sent by journey",
      window: "Period",
      engine: "Engine status",
      queue: "Queue health",
      kpis: "KPIs",
      totals: "Totals",
      trend: "Sent, opened, clicked",
      problems: "Failures, bounces, unsubscribes",
      funnel: "Email funnel",
      byVariant: "By journey variant",
      byStage: "By stage",
      byLocale: "By locale",
      topErrors: "Top send errors",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to view campaign stats",
      },
      forbidden: {
        title: "Forbidden",
        description: "You do not have permission to view campaign stats",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while fetching campaign stats",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid input parameters",
      },
    },
    success: {
      title: "Stats Retrieved",
      description: "Campaign statistics retrieved successfully",
    },
  },
  widget: {
    groups: {
      now: "Right now",
      period: "In the selected period",
    },
    stuck: "Never sent",
    title: "Campaign performance",
    loading: "Loading campaign numbers...",
    filters: "Filters",
    openQueue: "Open queue",
    empty: "Nothing sent in this period.",
    emptySendingOff: "Nothing sent in this period. Sending is off, see above.",
    noProblems: "No failures, bounces or unsubscribes in this period.",
    noErrors: "No send errors in this period.",
    sentNoteOff:
      "Zero sends here mean the engine is off, not that nobody engages.",
    errors: {
      duplicate: "Skipped: duplicate recipient",
      statusChange: "Skipped: lead became {{status}}",
    },
    engine: {
      starterOff:
        "campaign-starter is off too, so no new leads enter journeys.",
      otherPath:
        "Those came from another path (blast or manual run), not the dispatcher.",
      openDispatcher: "Open dispatcher settings",
      neverSent: "No campaign email was ever sent.",
      lastSend: "Last send {{when}}. Sent in the last 24h: {{count}}.",
      offTitle: "Sending is off",
      failingTitle: "Dispatcher failing ({{count}} runs in a row)",
      onTitle: "Sending is on",
      missing:
        "The email-campaigns dispatcher has no cron schedule. {{count}} due emails sit in the queue and will never send until it is scheduled.",
      disabled:
        "The email-campaigns dispatcher is disabled. {{count}} due emails wait in the queue.",
      on: "Last run {{last}}, next run {{next}}.",
      noError: "No error message recorded.",
      openDue: "Show {{count}} leads",
      state: {
        missing: "not scheduled",
        disabled: "disabled",
        failing: "failing",
        running: "running",
      },
    },
    queue: {
      oldestBiggest:
        "{{emails}} leads. Biggest backlog: {{journey}} ({{count}} emails)",
      stuckClaims: "Stuck send claims",
      stuckClaimsHint: "Claimed over 1h ago, never confirmed",
      stuckDaysHint: "Due since {{when}}",
      stuckDays: "Oldest due, days",
      nothingScheduled: "Nothing scheduled",
      dueNow: "Due emails",
      oldest: "{{emails}} leads waiting",
      nothingDue: "Nothing waiting",
      scheduled: "Scheduled for later",
      scheduledHint: "{{count}} in the next 24h, next {{when}}",
    },
    kpi: {
      bouncedOff:
        "bounce-processor is off, so bounces may be undercounted. {{rate}} of sent",
      ofSentRate: "{{rate}} of sent",
      skippedHint: "Dedupe and status skips not counted: {{count}}",
      sent: "Sent",
      openRate: "Open rate",
      clickRate: "Click rate",
      ofSent: "{{count}} of the emails sent",
      unsubscribed: "Unsubscribed",
      bounced: "Bounced",
      failed: "Send errors in period",
    },
    series: {
      sent: "Sent",
      opened: "Opened",
      clicked: "Clicked",
      failed: "Send errors",
      bounced: "Bounced",
      unsubscribed: "Unsubscribed",
    },
    charts: {
      errorsHint:
        "Real failures only. Dedupe and status skips not shown: {{count}}",
      variantTrendHint: "Emails sent per bucket, split by journey variant",
      variantTrend: "Sent by journey",
      trend: "Sent, opened, clicked",
      trendHint:
        "By send day: emails sent, and how many of them were opened or clicked later. Click a day for those leads.",
      problems: "Problems",
      problemsHint: "Failed sends, bounces and unsubscribes per bucket",
      funnel: "Email funnel",
      funnelHint: "Emails sent in the period and what recipients did with them",
      byVariant: "By journey variant",
      byVariantHint: "Sent in the period. Due = waiting in the queue now.",
      byStage: "By stage",
      byLocale: "By locale",
      errors: "Send errors",
    },
    columns: {
      failed: "Send errors",
      sent: "Sent",
      openRate: "Open",
      clickRate: "Click",
      unsubscribed: "Unsub.",
      bounced: "Bounced",
      due: "Due emails",
      variant: "Journey",
      stage: "Stage",
      locale: "Locale",
      error: "Error",
      count: "Count",
    },
    definitions:
      "Open and click rates count emails sent in the period that were opened or clicked at any time. Due = pending and scheduled in the past: only the email-campaigns dispatcher sends them. Locale = rendered locale, else the lead's language and country.",
  },
};
