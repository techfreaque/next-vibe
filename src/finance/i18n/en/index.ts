export const translations = {
  category: "Finance",
  tags: {
    finance: "finance",
    vibeSense: "vibe-sense",
  },
  enums: {
    source: {
      stripe: "Stripe",
      nowpayments: "NOWPayments",
      openrouter: "OpenRouter",
      nanoGpt: "NanoGPT",
      venice: "Venice",
      uncensoredAi: "uncensored.ai",
      gab: "Gab AI",
      freedomGpt: "FreedomGPT",
    },
    provider: {
      all: "All providers",
    },
    eventKind: {
      charge: "Charge",
      refund: "Refund",
      dispute: "Dispute",
      cancellation: "Cancellation",
      payout: "Payout",
    },
    runStatus: {
      ok: "OK",
      skipped: "Skipped",
      failed: "Failed",
    },
    alertType: {
      negativeMargin: "Negative margin",
      thinMargin: "Thin margin",
      balanceDrain: "Balance drain",
      spendSpike: "Spend spike",
      refundSpike: "Refund spike",
      disputeSpike: "Dispute spike",
      cancellationSpike: "Cancellation spike",
      billingGap: "Billing gap",
    },
    severity: {
      warning: "Warning",
      critical: "Critical",
    },
    threshold: {
      marginFloorPct: "Margin floor (%)",
      drainMultiplier: "Drain multiplier (x trailing average)",
      hourlySpendCapUsd: "Hourly spend cap per provider ($/h)",
      minSpikeUsd: "Minimum spend to judge a spike ($)",
      refundRatePct: "Refund rate limit (% of charges)",
      disputeCountDaily: "Disputes per day",
      cancellationMultiplier: "Cancellation spike (x trailing average)",
      cancellationMin: "Minimum cancellations to judge a spike",
      billingGapPct: "Billing gap limit (% over billed)",
      alertDedupHours: "Repeat-alert window (hours)",
      minRevenueUsd: "Minimum daily revenue to judge margin ($)",
      minCostUsd: "Minimum daily cost to judge margin ($)",
    },
    scope: {
      all: "Everything",
      balances: "Provider balances only",
      revenue: "Revenue only",
    },
    metric: {
      stripeRevenue: "Stripe revenue (gross, $)",
      nowpaymentsRevenue: "NOWPayments revenue (gross, $)",
      netRevenue: "Net revenue ($)",
      refunds: "Refunds ($)",
      upstreamCost: "Upstream cost ($)",
      internalBilled: "Billed to users ($)",
      grossMarginUsd: "Gross margin ($)",
      grossMarginPct: "Gross margin (%)",
      providerSpend: "Provider spend ($)",
      providerBalance: "Provider balance remaining ($)",
      alerts: "Alerts raised",
    },
  },
  ingest: {
    title: "Finance Ingest",
    titleShort: "Ingest",
    description:
      "Read-only pull of real revenue (Stripe, NOWPayments) and real provider balances. Computes daily margin and raises alerts. Moves no money.",
    task: {
      balances:
        "Hourly: read every provider balance, measure spend, flag drains and spikes.",
      revenue:
        "Daily: pull Stripe and NOWPayments revenue, roll up margin, flag refunds, disputes and thin margin.",
    },
    fields: {
      scope: {
        label: "Scope",
        description: "What to pull",
      },
      dryRun: {
        label: "Dry run",
        description: "Read and compute, store nothing, send nothing",
      },
      windowDays: {
        label: "Revenue window (days)",
        description: "How far back to re-pull revenue. Default 3.",
      },
    },
    response: {
      dryRun: "Dry run",
      ranAt: "Ran at",
      sources: "Sources",
      days: "Daily margin",
      alertsRaised: "Alerts raised",
      alertsSuppressed: "Alerts suppressed (duplicate)",
      alerts: "Alerts",
    },
    widget: {
      hint: "Reads our own accounts only. A source without an endpoint is skipped and the reason recorded.",
      submit: "Run ingest",
      submitting: "Running…",
      result: "Ingest result",
      resultDry: "Dry run (nothing stored, nothing sent)",
      events: "{{count}} rows",
      margin: "Margin: net revenue - upstream cost",
      alerts: "Alerts: {{raised}} raised, {{suppressed}} suppressed",
    },
  },
  status: {
    title: "Finance",
    titleShort: "Finance",
    description:
      "Revenue vs upstream cost: provider balances, margin, alerts and thresholds.",
    response: {
      lastIngestAt: "Last ingest",
      sources: "Sources",
      week: "Last 7 days",
      days: "Daily margin",
      alerts: "Recent alerts",
      thresholds: "Thresholds",
    },
    widget: {
      title: "Finance",
      refresh: "Refresh",
      runIngest: "Run ingest",
      loading: "Loading finance…",
      lastIngest: "Last ingest: {{when}}",
      never: "never",
      neverRun: "Not run yet",
      margin: {
        title: "Margin (last 7 days)",
        revenue: "Net revenue",
        cost: "Upstream cost",
        margin: "Gross margin",
        pct: "Margin %",
        empty: "No rollups yet. Run an ingest.",
      },
      providers: {
        title: "Provider balances",
        lastSpend: "Spent since last reading: {{amount}}",
        noSpend: "No spend measured yet",
      },
      revenue: {
        title: "Revenue sources",
      },
      alerts: {
        title: "Recent alerts",
        empty: "No alerts. Margin and balances look normal.",
      },
      thresholds: {
        title: "Thresholds",
        hint: "Defaults apply until you set a value. Alerts repeat at most once per window.",
        custom: "Custom",
        default: "Default",
        edit: "Edit",
      },
    },
  },
  thresholds: {
    title: "Set Finance Threshold",
    titleShort: "Set Threshold",
    description:
      "Override one alert threshold. A disabled override falls back to the default.",
    fields: {
      key: { label: "Threshold", description: "Which limit to change" },
      value: { label: "Value", description: "The new limit" },
      enabled: {
        label: "Use this value",
        description: "Off: fall back to the default",
      },
      note: {
        label: "Note",
        description: "Why this limit",
        placeholder: "e.g. launch week, expect refunds",
      },
    },
    response: { key: "Saved threshold" },
    widget: {
      back: "Back",
      hint: "Changes apply on the next ingest.",
    },
  },
  series: {
    title: "Finance Series",
    titleShort: "Finance",
    description:
      "Time series from the finance monitor: revenue by processor, net revenue, upstream cost, margin, provider spend and balance, alerts.",
    fields: {
      resolution: { label: "Resolution", description: "Bucket size" },
      range: { label: "Range", description: "Time range to fetch" },
      lookback: {
        label: "Lookback",
        description: "Warm-up bars before the range",
      },
      metric: { label: "Metric", description: "Which series to chart" },
      provider: {
        label: "Provider",
        description: "Filter provider spend and balance",
      },
      result: { label: "Series", description: "Finance time series" },
      meta: { label: "Meta", description: "Execution metadata" },
    },
  },
  errors: {
    validation: {
      title: "Invalid input",
      description: "Check the highlighted fields",
    },
    unauthorized: {
      title: "Not signed in",
      description: "Sign in as admin",
    },
    forbidden: {
      title: "Admins only",
      description: "Finance tools need the admin role",
    },
    notFound: {
      title: "Not found",
      description: "That entry does not exist",
    },
    conflict: {
      title: "Conflict",
      description: "The entry changed meanwhile, reload and retry",
    },
    server: {
      title: "Server error",
      description: "Could not complete the request",
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
    invalidThreshold: "A threshold needs a non-negative number",
    ingestFailed: "Finance ingest failed: {{error}}",
  },
  success: {
    title: "Done",
    description: "Saved",
  },
};
