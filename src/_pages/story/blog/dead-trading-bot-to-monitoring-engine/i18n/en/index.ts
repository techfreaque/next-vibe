export const translations = {
  meta: {
    title:
      "My dead trading bot became a platform monitoring engine - next-vibe",
    description:
      "I abandoned a trading bot years ago. Then I realized its architecture - DataSource, Indicator, Evaluator, Action - applies to any business. So I rebuilt it inside next-vibe. Every node is an endpoint.",
    category: "Vibe Sense",
    imageAlt: "Vibe Sense monitoring pipeline - next-vibe",
    keywords:
      "vibe sense, monitoring, trading bot, endpoints, EMA, pipeline, next-vibe, TypeScript",
    ogTitle: "My dead trading bot became a platform monitoring engine",
    ogDescription:
      "The trading bot had this architecture right. I just got wrong where I built it.",
    twitterTitle: "Dead trading bot → live monitoring engine",
    twitterDescription:
      "Every node is an endpoint. The pipeline is just endpoints calling endpoints.",
  },
  backToBlog: "Back to blog",
  hero: {
    eyebrow: "Vibe Sense",
    title: "This is your platform watching itself.",
    subtitle:
      "I abandoned a trading bot years ago. Its architecture became the most interesting part of next-vibe. Every node in the graph is an endpoint - callable from the CLI, discoverable by AI, wired into your platform.",
    readTime: "14 min read",
    date: "Architecture",
  },
  origin: {
    title: "The trading bot I abandoned",
    paragraph1:
      "A few years ago I forked OctoBot and built something I called Octane. Python backend, React frontend. You could drag technical indicators onto a canvas, chain evaluators together, configure execution rules, set up alerts, fire orders. It had a full visual strategy builder. I still run it for my own portfolio.",
    paragraph2:
      "I abandoned it as a codebase. The Python was sprawling, the architecture had accumulated enough debt that every change felt expensive, and I had other things to build.",
    paragraph3:
      "But I kept thinking about it. Specifically about what made it work as a system.",
    quoteText:
      "The trading bot had this architecture right. The thing I got wrong was building it in isolation.",
    timeline: {
      octane: {
        label: "Octane (OctoBot fork)",
        description:
          "Visual strategy builder, drag-and-drop indicators, Python backend. Abandoned as a codebase.",
      },
      insight: {
        label: "The realization",
        description:
          "That structure doesn't describe trading. It describes any business process with data over time.",
      },
      rebuilt: {
        label: "Rebuilt inside next-vibe",
        description:
          "Properly typed. Every node is a standard endpoint. Accessible everywhere the platform is.",
      },
    },
  },
  insight: {
    title: "Every business is a time series",
    intro:
      "In a trading bot, the pieces are simple. A data source: price data, volume, whatever you're reading. An indicator: moving average, RSI, MACD - takes raw data, produces a derived signal. An evaluator: is the fast MA above the slow MA? Boolean condition. An action: when the evaluator fires, do something.",
    realization:
      "That structure doesn't describe trading. It describes any business process where you have data over time, conditions you care about, and actions you want to take when those conditions are met.",
    examples: {
      userGrowth: {
        label: "User growth",
        description:
          "That's a time series. Is it trending down? That's an evaluator. Send a win-back campaign. That's an action.",
      },
      emailHealth: {
        label: "Email campaign health",
        description:
          "Open rates, bounce rates, unsubscribe rates. All time series. All conditions you can evaluate. All triggerable.",
      },
      creditEconomy: {
        label: "Credit economy",
        description:
          "Spending velocity. Burn rate vs. purchase rate. All of it.",
      },
      revenueAnomaly: {
        label: "Revenue anomalies",
        description:
          "Refund rate spikes above 20% in a day - Thea gets notified before you see it in a dashboard.",
      },
    },
  },
  architecture: {
    title: "The four node types",
    subtitle:
      "Three node types you need to understand to read any graph. Plus a fourth that closes the loop.",
    dataSource: {
      label: "DataSource",
      description:
        "A domain-owned endpoint that queries your database and returns { timestamp, value }[] for a given time range and resolution. Lives with its domain. Knows about its own schema.",
    },
    indicator: {
      label: "Indicator",
      description:
        "A pure, reusable computation endpoint - EMA, RSI, MACD, Bollinger Bands, clamp, delta, window average. No SQL. No domain knowledge. Call it on any data source.",
    },
    evaluator: {
      label: "Evaluator",
      description:
        "A threshold or condition. Takes a series and asks a question. Is this value below 0.7? Did this ratio exceed 20%? Outputs a signal - fired or not fired.",
    },
    action: {
      label: "Action",
      description:
        "When the upstream evaluator fires, a specific endpoint gets called. In-process. No HTTP. Same validation, same auth, same response type as any other call in the system.",
    },
    connector: "feeds into",
  },
  unified: {
    title: "Every node is an endpoint",
    intro:
      "Here's the thing I want to land right now, before we go any further.",
    oldApproach: {
      label: "Old approach (Octane)",
      description:
        "EMA exists only as a node in a graph. You can't call it from the CLI. It doesn't show up as an AI tool. It's a private implementation detail.",
    },
    newApproach: {
      label: "next-vibe approach",
      description:
        "Every Vibe Sense node is a standard endpoint, defined with createEndpoint(), registered in the same endpoint registry as everything else on the platform.",
    },
    cliCaption:
      "The same EMA endpoint that ran as a node in the lead funnel graph - same definition, same validation, same auth - callable standalone from the CLI.",
    insight:
      "The SAME endpoint that's a node in your lead funnel graph is also a standalone tool on 13 platforms.",
    keyLine: "The pipeline is just endpoints calling endpoints.",
  },
  actionCallout: {
    title: "But actions aren't trades",
    body: "When a signal fires, the engine calls any endpoint. In-process. No HTTP round-trip. An alert. A campaign trigger. An AI escalation with pre-filled context. Thea gets notified. A win-back sequence starts. Whatever is wired to that evaluator.",
    noWebhook: "No webhook.",
    noAlerting: "No custom alerting service.",
    noZapier: "No Zapier.",
    punchline: "The platform calls itself.",
    examples: {
      alert: {
        label: "Alert",
        description: "Call complete-task - Thea picks it up immediately.",
      },
      campaign: {
        label: "Campaign",
        description:
          "Trigger a conversion sequence when lead velocity crosses a threshold.",
      },
      ai: {
        label: "AI escalation",
        description:
          "Fire an AI run with pre-filled context about what signal triggered it.",
      },
    },
  },
  funnel: {
    title: "Walking the lead funnel graph",
    subtitle:
      "This is the Lead Acquisition Funnel. It runs every six hours. Let's trace it top to bottom.",
    column1: {
      label: "Column 1: Data sources",
      description:
        "Real endpoints. Each lives at leads/data-sources/. They accept a time range and resolution, run their SQL query, return { timestamp, value }[].",
      nodes: {
        created: {
          name: "leads.created",
          description:
            "Queries leads by created_at. Sparse - hours with no new leads produce no data point.",
        },
        converted: {
          name: "leads.converted",
          description:
            "Grouped by converted_at, counts leads that reached SIGNED_UP status.",
        },
        bounced: {
          name: "leads.bounced",
          description: "Leads with bounced email per time bucket.",
        },
        active: {
          name: "leads.active",
          description:
            "Snapshot indicator at ONE_DAY resolution. Counts total leads not in terminal states.",
        },
      },
    },
    column2: {
      label: "Column 2: Indicators",
      description:
        'Pure computation. The EMA endpoint lives at analytics/indicators/ema. Its graph config is just { type: "indicator", indicatorId: "ema", params: { period: 7 } }.',
      nodes: {
        ema7: {
          name: "leads_created_ema7",
          description:
            "EMA indicator, period=7. Automatically extends the upstream fetch range for warmup.",
        },
        conversionRate: {
          name: "conversion_rate",
          description:
            "Transformer: divides leads.converted by leads.created per time bucket. Clamped 0–1.",
        },
      },
    },
    column3: {
      label: "Column 3: Evaluators",
      description:
        "Threshold conditions. Each outputs a signal - fired or not fired.",
      nodes: {
        leadDrop: {
          name: "eval_lead_drop",
          description:
            "EMA(7) < 0.7 at ONE_WEEK resolution. Lead creation velocity smoothed over 7 periods drops below 70%.",
        },
        zeroLeads: {
          name: "eval_zero_leads",
          description:
            "leads.created < 1/day. A whole day passes with no new leads at all.",
        },
        lowConversion: {
          name: "eval_low_conversion",
          description:
            "conversion_rate < 5%/week. Funnel conversion falls below 5%.",
        },
      },
    },
  },
  domainOwned: {
    title: "Domain-owned data sources",
    subtitle:
      "One of the architectural decisions I'm most satisfied with: data sources live with their domain, not in some central vibe-sense/ directory.",
    leadsLabel: "Leads domain",
    leadsCount: "... 15 data sources total",
    creditsLabel: "Credits domain",
    creditsCount: "... 17 data sources total",
    explanation:
      "leads/data-sources/leads-created knows about the leads table. It imports from leads/db. It uses LeadStatus from leads/enum. If you delete the leads module, the data sources go with it. Nothing orphaned.",
    indicators: {
      label: "Indicators at analytics/indicators/",
      description:
        "Pure computation - EMA, RSI, MACD, Bollinger Bands, clamp, delta, window average. No domain knowledge. Call them on any data source.",
    },
    registration:
      "At startup, the indicator registry auto-discovers both. Data source endpoints register as node definitions. Indicator endpoints register as node definitions. You add a new domain, you add data-sources/ endpoints, you export graphSeeds. They appear.",
    keyLine: "The domain owns its own observability.",
  },
  safety: {
    title: "Versioning, backtest, persist",
    subtitle: "Three things that make Vibe Sense safe to run in production.",
    versioning: {
      label: "Versioning",
      description:
        "Graphs are versioned. When you edit a graph, you create a new version - never mutate the active one. The new version is a draft. You promote it explicitly. Rollback is trivial.",
    },
    backtest: {
      label: "Backtest",
      description:
        "Before promoting, you can backtest over a historical time range. Conditions evaluate. Signals record. Endpoints never fire. Gate closed.",
    },
    persist: {
      label: "Persist modes",
      always: {
        label: "always",
        description:
          "Every computed data point is written to the datapoints store. For event-based indicators: leads created per minute, credits spent per minute.",
      },
      snapshot: {
        label: "snapshot",
        description:
          "Computed on demand, cached, but not stored to the main table. Daily totals, cumulative counts.",
      },
      never: {
        label: "never",
        description:
          "Always recomputed live from inputs. EMA outputs, ratios - no storage cost. Lookback auto-extended for warmup.",
      },
    },
  },
  ships: {
    title: "What ships vs. what's coming",
    prodReady: {
      label: "Production-ready today",
      items: {
        engine:
          "Full engine: data source endpoints, indicator endpoints (EMA, RSI, MACD, Bollinger, clamp, delta, window), threshold evaluators, transformer nodes, endpoint action nodes.",
        execution:
          "Topological execution via graph walker. Multi-resolution support with automatic scale-up/down. Lookback-aware range extension.",
        versioning:
          "Versioning, backtest mode with full run history, signal persistence as audit trail.",
        cli: "CLI access - vibe vibe-sense-ema, vibe vibe-sense-rsi, any indicator endpoint, callable standalone.",
        mcp: "MCP registration - indicator endpoints show up in the tool list. Thea can call indicators directly.",
        seeds:
          "Seed graphs: 29 graphs across 9 domains - leads, credits, users, subscriptions, referrals, newsletters, payments, messenger, AI chat, and system health. All run out of the box on vibe dev.",
      },
    },
    coming: {
      label: "Coming next",
      items: {
        builder:
          "Visual drag-and-drop graph builder. The engine is fully built. The canvas editor is the next chapter.",
        trading:
          "Trading endpoints. Price data source endpoints, exchange API endpoints, order execution wired as endpoint nodes. A trading graph is just another graph.",
        marketplace:
          "Strategy marketplace. Once you can build graphs visually, you can share them. Import a pre-built lead monitoring strategy. Fork it, modify it.",
      },
    },
  },
  vision: {
    title: "What this actually is",
    paragraph1:
      "Every business process that can be described as: given this data, when these conditions are met, do this - that's a Vibe Sense graph. Monitoring, yes. Alerting, yes. But also: automated lead qualification, revenue anomaly detection, credit economy balancing, marketing automation.",
    paragraph2:
      "The trading bot had this architecture right. Indicators, evaluators, actions, backtest mode. The thing I got wrong was building it in isolation. In Octane, EMA was locked inside the pipeline. In next-vibe, EMA is a first-class endpoint.",
    keyLine:
      "You don't build a monitoring system. You build your platform. The monitoring system is already there.",
    closeTagline:
      "Define it once. It exists everywhere. The pipeline is just endpoints calling endpoints.",
    cta: {
      primary: "View on GitHub",
      secondary: "Back to blog",
    },
    quickstart: {
      label: "Quick start",
      description:
        "vibe dev starts PostgreSQL in Docker, runs migrations, seeds data, seeds the Vibe Sense graphs, backfills 365 days of historical data, and launches the dev server. Open localhost:3000. The graphs are running.",
    },
  },
  ui: {
    checkMark: "✓",
    crossMark: "✗",
    arrowMark: "→",
    emaFunctionLabel: "computeEma()",
  },
};
