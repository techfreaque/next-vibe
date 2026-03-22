export const translations = {
  category: "Vibe Sense",
  enums: {
    resolution: {
      "1m": "1 Minute",
      "3m": "3 Minutes",
      "5m": "5 Minutes",
      "15m": "15 Minutes",
      "30m": "30 Minutes",
      "1h": "1 Hour",
      "4h": "4 Hours",
      "1d": "1 Day",
      "1w": "1 Week",
      "1M": "1 Month",
    },
    runStatus: {
      running: "Running",
      completed: "Completed",
      failed: "Failed",
    },
    backtestActionMode: {
      simulate: "Simulate",
      execute: "Execute",
    },
    graphOwnerType: {
      system: "System",
      admin: "Admin",
      user: "User",
    },
    triggerType: {
      manual: "Manual",
      cron: "Scheduled",
    },
  },
  // Standard vibe-sense field labels (used by shared/fields.ts helpers)
  fields: {
    source: { label: "Source", description: "Input time series" },
    resolution: { label: "Resolution", description: "Computation timeframe" },
    range: { label: "Range", description: "Time range to compute" },
    lookback: {
      label: "Lookback",
      description: "Extra bars before range start for warm-up",
    },
    result: { label: "Result", description: "Output time series" },
    meta: { label: "Meta", description: "Node execution metadata" },
  },
  tags: {
    vibeSense: "vibe-sense",
    analytics: "analytics",
    pipeline: "pipeline",
  },

  // Graph list
  graphs: {
    list: {
      title: "Pipeline Graphs",
      description: "List all graphs visible to the current user",
      container: {
        title: "Graphs",
        description: "All pipeline graphs",
      },
      response: {
        graphs: "Graphs",
      },
      success: {
        title: "Graphs loaded",
        description: "Pipeline graphs retrieved successfully",
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        forbidden: { title: "Forbidden", description: "Admin access required" },
        server: { title: "Server error", description: "Failed to load graphs" },
        unknown: {
          title: "Unknown error",
          description: "An unexpected error occurred",
        },
        validation: {
          title: "Validation failed",
          description: "Invalid request",
        },
        notFound: { title: "Not found", description: "No graphs found" },
        conflict: { title: "Conflict", description: "Resource conflict" },
        network: {
          title: "Network error",
          description: "Network request failed",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "Save changes first",
        },
      },
    },
    create: {
      title: "Create Graph",
      description: "Create a new pipeline graph",
      fields: {
        name: {
          label: "Name",
          description: "Graph display name",
          placeholder: "My graph",
        },
        slug: {
          label: "Slug",
          description: "Unique identifier",
          placeholder: "my-graph",
        },
        description: {
          label: "Description",
          description: "Optional description",
          placeholder: "",
        },
        config: { label: "Config", description: "Graph DAG configuration" },
      },
      response: {
        id: "Graph ID",
      },
      success: {
        title: "Graph created",
        description: "Pipeline graph created successfully",
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        forbidden: { title: "Forbidden", description: "Admin access required" },
        server: {
          title: "Server error",
          description: "Failed to create graph",
        },
        unknown: {
          title: "Unknown error",
          description: "An unexpected error occurred",
        },
        validation: {
          title: "Validation failed",
          description: "Invalid graph config",
        },
        notFound: { title: "Not found", description: "Resource not found" },
        conflict: {
          title: "Conflict",
          description: "Graph slug already exists",
        },
        network: {
          title: "Network error",
          description: "Network request failed",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "Save changes first",
        },
      },
    },
    get: {
      title: "Get Graph",
      description: "Get a specific graph by ID",
      fields: {
        id: { label: "Graph ID", description: "UUID of the graph version" },
      },
      response: {
        graph: "Graph",
      },
      success: {
        title: "Graph loaded",
        description: "Graph retrieved successfully",
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        forbidden: { title: "Forbidden", description: "Access denied" },
        server: { title: "Server error", description: "Failed to load graph" },
        unknown: {
          title: "Unknown error",
          description: "An unexpected error occurred",
        },
        validation: { title: "Validation failed", description: "Invalid ID" },
        notFound: { title: "Not found", description: "Graph not found" },
        conflict: { title: "Conflict", description: "Resource conflict" },
        network: {
          title: "Network error",
          description: "Network request failed",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "Save changes first",
        },
      },
    },
    edit: {
      title: "Edit Graph",
      description:
        "Branch and edit a graph (creates new version, never mutates)",
      fields: {
        id: {
          label: "Graph ID",
          description: "UUID of the version to branch from",
        },
        config: { label: "Config", description: "Updated graph config" },
        name: { label: "Name", description: "Updated name" },
        description: {
          label: "Description",
          description: "Updated description",
        },
      },
      response: {
        id: "New Version ID",
      },
      success: {
        title: "Graph branched",
        description: "New graph version created successfully",
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        forbidden: { title: "Forbidden", description: "Access denied" },
        server: { title: "Server error", description: "Failed to edit graph" },
        unknown: {
          title: "Unknown error",
          description: "An unexpected error occurred",
        },
        validation: {
          title: "Validation failed",
          description: "Invalid config",
        },
        notFound: { title: "Not found", description: "Graph not found" },
        conflict: { title: "Conflict", description: "Resource conflict" },
        network: {
          title: "Network error",
          description: "Network request failed",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "Save changes first",
        },
      },
    },
    promote: {
      title: "Promote to System",
      description: "Promote an admin graph to system-owned (read-only, shared)",
      fields: {
        id: { label: "Graph ID", description: "UUID of the graph to promote" },
      },
      response: {
        id: "Graph ID",
      },
      success: {
        title: "Graph promoted",
        description: "Graph promoted to system successfully",
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        forbidden: { title: "Forbidden", description: "Admin access required" },
        server: {
          title: "Server error",
          description: "Failed to promote graph",
        },
        unknown: {
          title: "Unknown error",
          description: "An unexpected error occurred",
        },
        validation: { title: "Validation failed", description: "Invalid ID" },
        notFound: { title: "Not found", description: "Graph not found" },
        conflict: { title: "Conflict", description: "Resource conflict" },
        network: {
          title: "Network error",
          description: "Network request failed",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "Save changes first",
        },
      },
    },
    trigger: {
      title: "Trigger Graph",
      description: "Manually trigger on-demand graph execution",
      fields: {
        id: { label: "Graph ID", description: "UUID of the graph to trigger" },
        rangeFrom: { label: "From", description: "Range start (ISO date)" },
        rangeTo: { label: "To", description: "Range end (ISO date)" },
      },
      response: {
        nodeCount: "Nodes executed",
        errorCount: "Errors",
        errors: "Errors",
      },
      success: {
        title: "Graph executed",
        description: "Graph ran successfully",
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        forbidden: { title: "Forbidden", description: "Admin access required" },
        server: {
          title: "Server error",
          description: "Graph execution failed",
        },
        unknown: {
          title: "Unknown error",
          description: "An unexpected error occurred",
        },
        validation: {
          title: "Validation failed",
          description: "Invalid parameters",
        },
        notFound: { title: "Not found", description: "Graph not found" },
        conflict: { title: "Conflict", description: "Resource conflict" },
        network: {
          title: "Network error",
          description: "Network request failed",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "Save changes first",
        },
      },
    },
    backtest: {
      title: "Run Backtest",
      description: "Run a backtest over a historical range (actions simulated)",
      fields: {
        id: { label: "Graph ID", description: "UUID of the graph version" },
        rangeFrom: { label: "From", description: "Backtest range start" },
        rangeTo: { label: "To", description: "Backtest range end" },
        resolution: {
          label: "Resolution",
          description: "Timeframe for evaluation",
        },
      },
      response: {
        runId: "Run ID",
        eligible: "Eligible",
        ineligibleNodes: "Ineligible nodes",
      },
      success: {
        title: "Backtest complete",
        description: "Backtest ran successfully",
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        forbidden: { title: "Forbidden", description: "Admin access required" },
        server: { title: "Server error", description: "Backtest failed" },
        unknown: {
          title: "Unknown error",
          description: "An unexpected error occurred",
        },
        validation: {
          title: "Validation failed",
          description: "Invalid parameters",
        },
        notFound: { title: "Not found", description: "Graph not found" },
        conflict: { title: "Conflict", description: "Resource conflict" },
        network: {
          title: "Network error",
          description: "Network request failed",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "Save changes first",
        },
      },
    },
    data: {
      title: "Graph Data",
      description: "Fetch time-series data for a graph (on-demand execution)",
      fields: {
        id: { label: "Graph ID", description: "UUID of the graph" },
        rangeFrom: { label: "From", description: "Range start" },
        rangeTo: { label: "To", description: "Range end" },
      },
      response: {
        series: "Series",
        signals: "Signals",
      },
      success: {
        title: "Data loaded",
        description: "Graph data retrieved successfully",
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        forbidden: { title: "Forbidden", description: "Access denied" },
        server: { title: "Server error", description: "Failed to fetch data" },
        unknown: {
          title: "Unknown error",
          description: "An unexpected error occurred",
        },
        validation: {
          title: "Validation failed",
          description: "Invalid parameters",
        },
        notFound: { title: "Not found", description: "Graph not found" },
        conflict: { title: "Conflict", description: "Resource conflict" },
        network: {
          title: "Network error",
          description: "Network request failed",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "Save changes first",
        },
      },
    },
  },

  // Indicator node definitions
  indicators: {
    ema: {
      description:
        "Exponential Moving Average — weights recent prices more heavily",
      input: { source: { label: "Source" } },
      output: { value: { label: "EMA" } },
      params: {
        period: { label: "Period", description: "Number of periods (1–500)" },
      },
    },
    rsi: {
      description: "Relative Strength Index — momentum oscillator (0–100)",
      input: { source: { label: "Source" } },
      output: { value: { label: "RSI" } },
      params: {
        period: { label: "Period", description: "Lookback periods (2–100)" },
      },
    },
    bollinger: {
      description:
        "Bollinger Bands — volatility envelope around a moving average",
      input: { source: { label: "Source" } },
      output: {
        upper: { label: "Upper Band" },
        middle: { label: "Middle Band" },
        lower: { label: "Lower Band" },
      },
      params: {
        period: { label: "Period", description: "Moving average period" },
        stdDev: {
          label: "Std Dev",
          description: "Standard deviation multiplier",
        },
      },
    },
    macd: {
      description: "MACD — trend-following momentum indicator",
      input: { source: { label: "Source" } },
      output: {
        macd: { label: "MACD" },
        signal: { label: "Signal" },
        histogram: { label: "Histogram" },
      },
      params: {
        fastPeriod: { label: "Fast Period", description: "Fast EMA period" },
        slowPeriod: { label: "Slow Period", description: "Slow EMA period" },
        signalPeriod: {
          label: "Signal Period",
          description: "Signal EMA period",
        },
      },
    },
    ratio: {
      description: "Compute A / B per timestamp",
      input: { a: { label: "Numerator" }, b: { label: "Denominator" } },
      output: { value: { label: "Ratio" } },
    },
    delta: {
      description: "Period-over-period change",
      input: { source: { label: "Source" } },
      output: { value: { label: "Delta" } },
    },
    clamp: {
      description: "Clamp values to [min, max]",
      input: { source: { label: "Source" } },
      output: { value: { label: "Clamped" } },
      params: {
        min: { label: "Min", description: "Lower bound" },
        max: { label: "Max", description: "Upper bound" },
      },
    },
    windowAvg: {
      description: "Rolling average over N periods",
      input: { source: { label: "Source" } },
      output: { value: { label: "Avg" } },
      params: {
        size: { label: "Window", description: "Number of periods (1–500)" },
      },
    },
    windowSum: {
      description: "Rolling sum over N periods",
      input: { source: { label: "Source" } },
      output: { value: { label: "Sum" } },
      params: {
        size: { label: "Window", description: "Number of periods (1–500)" },
      },
    },
    windowMin: {
      description: "Rolling minimum over N periods",
      input: { source: { label: "Source" } },
      output: { value: { label: "Min" } },
      params: {
        size: { label: "Window", description: "Number of periods (1–500)" },
      },
    },
    windowMax: {
      description: "Rolling maximum over N periods",
      input: { source: { label: "Source" } },
      output: { value: { label: "Max" } },
      params: {
        size: { label: "Window", description: "Number of periods (1–500)" },
      },
    },
  },

  // Data source node definitions
  dataSources: {
    leadsCreated: {
      description: "Number of new leads created per minute",
      output: { value: { label: "Leads Created" } },
    },
    leadsConverted: {
      description: "Number of leads converted to users per minute",
      output: { value: { label: "Leads Converted" } },
    },
    leadsActive: {
      description: "Total active lead count (snapshot per day)",
      output: { value: { label: "Active Leads" } },
    },
    leadsBounced: {
      description: "Number of lead email bounces per minute",
      output: { value: { label: "Bounced Leads" } },
    },
    leadsEngagements: {
      description: "Total lead engagement events (opens + clicks) per minute",
      output: { value: { label: "Lead Engagements" } },
    },
    leadsEmailsSent: {
      description: "Number of campaign emails sent per minute",
      output: { value: { label: "Emails Sent" } },
    },
    leadsUnsubscribed: {
      description: "Number of leads that unsubscribed per minute",
      output: { value: { label: "Unsubscribed Leads" } },
    },
    leadsEmailOpens: {
      description: "Number of email opens tracked per minute",
      output: { value: { label: "Email Opens" } },
    },
    leadsEmailClicks: {
      description: "Number of email link clicks tracked per minute",
      output: { value: { label: "Email Clicks" } },
    },
    leadsNewsletterSubscribers: {
      description:
        "Total leads with confirmed newsletter subscription (snapshot per day)",
      output: { value: { label: "Newsletter Subscribers" } },
    },
    leadsWebsiteUsers: {
      description: "Total leads with website user status (snapshot per day)",
      output: { value: { label: "Website Users" } },
    },
    leadsCampaignRunning: {
      description:
        "Total leads currently in an active email campaign (snapshot per day)",
      output: { value: { label: "In Campaign" } },
    },
    leadsInContact: {
      description: "Total leads currently in contact status (snapshot per day)",
      output: { value: { label: "In Contact" } },
    },
    leadsWebsiteVisits: {
      description: "Number of website visit engagement events per minute",
      output: { value: { label: "Website Visits" } },
    },
    leadsFormSubmits: {
      description: "Number of form submit engagement events per minute",
      output: { value: { label: "Form Submits" } },
    },
    usersRegistered: {
      description: "Number of new user registrations per minute",
      output: { value: { label: "Users Registered" } },
    },
    usersActiveTotal: {
      description: "Total active verified user count (snapshot per day)",
      output: { value: { label: "Active Users" } },
    },
    usersBanned: {
      description: "Number of users banned per minute (approximate)",
      output: { value: { label: "Users Banned" } },
    },
    usersEmailVerified: {
      description: "Total users with verified email (snapshot per day)",
      output: { value: { label: "Email Verified" } },
    },
    usersMarketingConsent: {
      description: "Total users who gave marketing consent (snapshot per day)",
      output: { value: { label: "Marketing Consent" } },
    },
    usersWithStripe: {
      description: "Total users linked to a Stripe customer (snapshot per day)",
      output: { value: { label: "Stripe Users" } },
    },
    usersTwoFaEnabled: {
      description: "Total users with 2FA enabled (snapshot per day)",
      output: { value: { label: "2FA Enabled" } },
    },
    usersLoginAttemptsTotal: {
      description: "Total login attempts per minute",
      output: { value: { label: "Login Attempts" } },
    },
    usersLoginAttemptsFailed: {
      description: "Failed login attempts per minute",
      output: { value: { label: "Failed Logins" } },
    },
    creditsSpentTotal: {
      description: "Total credits spent per minute across all wallets",
      output: { value: { label: "Credits Spent" } },
    },
    creditsSpentByUsers: {
      description: "Credits spent by authenticated users per minute",
      output: { value: { label: "Credits Spent (Users)" } },
    },
    creditsSpentByLeads: {
      description: "Free credits spent by leads per minute",
      output: { value: { label: "Credits Spent (Leads)" } },
    },
    creditsPurchased: {
      description: "Credits purchased or added via subscription per minute",
      output: { value: { label: "Credits Purchased" } },
    },
    creditsFreeGrants: {
      description: "Free credit grants issued to leads per minute",
      output: { value: { label: "Free Grants" } },
    },
    creditsEarned: {
      description: "Credits earned via referrals per minute",
      output: { value: { label: "Credits Earned" } },
    },
    creditsExpired: {
      description: "Credits expired per minute",
      output: { value: { label: "Credits Expired" } },
    },
    creditsRefunded: {
      description: "Credits refunded per minute",
      output: { value: { label: "Credits Refunded" } },
    },
    creditsBalanceTotal: {
      description:
        "Total credit balance held across all user wallets (snapshot per day)",
      output: { value: { label: "Credit Balance" } },
    },
    creditsSubscriptionRevenue: {
      description: "Credits from subscription-type packs per minute",
      output: { value: { label: "Subscription Revenue" } },
    },
    creditsTransferVolume: {
      description: "Credit transfer volume between wallets per minute",
      output: { value: { label: "Transfer Volume" } },
    },
    creditsFreePoolUtilization: {
      description: "Percentage of free credit pool consumed (snapshot per day)",
      output: { value: { label: "Free Pool Usage" } },
    },
  },

  // Evaluator node definitions
  evaluators: {
    threshold: {
      description:
        "Fires when a series value satisfies a comparison against a constant",
      input: {
        series: { label: "Series" },
      },
      output: {
        signal: { label: "Signal" },
      },
      params: {
        op: {
          label: "Operator",
          description: "Comparison operator",
        },
        value: {
          label: "Value",
          description: "Constant to compare against",
        },
      },
    },
    and: {
      description: "Fires when all input signals fire at the same timestamp",
      input: { signals: { label: "Signals" } },
      output: { signal: { label: "Signal" } },
    },
    or: {
      description: "Fires when any input signal fires at a given timestamp",
      input: { signals: { label: "Signals" } },
      output: { signal: { label: "Signal" } },
    },
    not: {
      description: "Inverts a signal stream",
      input: { signal: { label: "Signal" } },
      output: { signal: { label: "Inverted" } },
    },
    crossover: {
      description: "Fires when series A crosses above series B",
      input: {
        seriesA: { label: "Series A" },
        seriesB: { label: "Series B" },
      },
      output: { signal: { label: "Signal" } },
    },
    script: {
      description:
        "Sandboxed custom evaluator — receives input series, returns signal events",
      input: { inputs: { label: "Inputs" } },
      output: { signal: { label: "Signal" } },
      params: {
        fn: {
          label: "Function",
          description:
            "JS function body receiving input series arrays, returning signal events",
        },
      },
    },
  },

  // Transformer node definitions
  transformers: {
    merge: {
      description: "Sum two series at matching timestamps",
      input: {
        a: { label: "Series A" },
        b: { label: "Series B" },
      },
      output: { value: { label: "Merged" } },
    },
    ratio: {
      description: "Compute A / B per timestamp",
      input: {
        a: { label: "Numerator" },
        b: { label: "Denominator" },
      },
      output: { value: { label: "Ratio" } },
    },
    delta: {
      description: "Period-over-period change",
      input: { source: { label: "Source" } },
      output: { value: { label: "Delta" } },
    },
    clamp: {
      description: "Clamp values to [min, max]",
      input: { source: { label: "Source" } },
      output: { value: { label: "Clamped" } },
      params: {
        min: { label: "Min", description: "Lower bound" },
        max: { label: "Max", description: "Upper bound" },
      },
    },
    windowAvg: {
      description: "Rolling average over N periods",
      input: { source: { label: "Source" } },
      output: { value: { label: "Avg" } },
      params: {
        size: { label: "Window", description: "Number of periods (1–500)" },
      },
    },
    windowSum: {
      description: "Rolling sum over N periods",
      input: { source: { label: "Source" } },
      output: { value: { label: "Sum" } },
      params: {
        size: { label: "Window", description: "Number of periods (1–500)" },
      },
    },
    windowMin: {
      description: "Rolling minimum over N periods",
      input: { source: { label: "Source" } },
      output: { value: { label: "Min" } },
      params: {
        size: { label: "Window", description: "Number of periods (1–500)" },
      },
    },
    windowMax: {
      description: "Rolling maximum over N periods",
      input: { source: { label: "Source" } },
      output: { value: { label: "Max" } },
      params: {
        size: { label: "Window", description: "Number of periods (1–500)" },
      },
    },
    fieldPick: {
      description: "Extract a named field from a multi-value series",
      input: { source: { label: "Multi-value" } },
      output: { value: { label: "Field" } },
      params: {
        field: {
          label: "Field Name",
          description: "Name of the field to extract",
        },
      },
    },
    jsonPath: {
      description: "Extract a value via dot-notation path from DataPoint meta",
      input: { source: { label: "Source" } },
      output: { value: { label: "Value" } },
      params: {
        path: {
          label: "Path",
          description: "Dot-notation path, e.g. data.stats.total",
        },
      },
    },
    script: {
      description: "Custom sandboxed script transformation",
      input: { inputs: { label: "Inputs" } },
      output: { value: { label: "Result" } },
      params: {
        fn: {
          label: "Function",
          description:
            "JS arrow function receiving input series arrays, returning DataPoint[]",
        },
      },
    },
  },

  // Cleanup task
  cleanup: {
    post: {
      title: "Vibe Sense Cleanup",
      description: "Run retention cleanup for datapoints and expire snapshots",
      success: {
        title: "Cleanup complete",
        description: "Retention cleanup finished",
      },
      response: {
        nodesProcessed: "Nodes processed",
        totalDeleted: "Rows deleted",
        snapshotsDeleted: "Snapshots deleted",
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        forbidden: { title: "Forbidden", description: "Admin access required" },
        server: { title: "Server error", description: "Cleanup failed" },
        unknown: {
          title: "Unknown error",
          description: "An unexpected error occurred",
        },
        validation: {
          title: "Validation failed",
          description: "Invalid request",
        },
        notFound: { title: "Not found", description: "Not found" },
        conflict: { title: "Conflict", description: "Conflict" },
        network: {
          title: "Network error",
          description: "Network request failed",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "Save changes first",
        },
      },
    },
    name: "Vibe Sense Cleanup",
    description: "Prunes old datapoints and expires snapshot cache",
  },
};
