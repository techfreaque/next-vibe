export const translations = {
  meta: {
    title: "Show HN: next-vibe — The Draft — next-vibe Blog",
    description:
      "The Hacker News post we are writing. TypeScript supremacy, unified surfaces, and a trading bot that can't trade.",
    category: "Community",
    imageAlt: "Show HN: next-vibe",
    keywords:
      "Hacker News, Show HN, next-vibe, TypeScript, MCP, unified surface, open source",
  },
  hero: {
    backToBlog: "Back to Blog",
    category: "Community",
    readTime: "5 min read",
    title: "Show HN: next-vibe",
    subtitle:
      "The Hacker News post we are writing. Two angles. One decision. Here is the reasoning.",
    hnBadge: "Show HN",
    hnSubtext: "Draft in progress",
  },
  intro: {
    title: "We are writing a Show HN post",
    paragraph1:
      "Every technical project eventually asks: how do you introduce yourself to Hacker News? The title is everything. The first two sentences decide whether someone clicks or scrolls past.",
    paragraph2:
      "We have two angles. Both are true. Both are real parts of next-vibe. The question is which one lands harder on HN — and which one starts the conversation we actually want to have.",
  },
  optionA: {
    badge: "Option A",
    title: "TypeScript supremacy",
    hnTitle:
      "Show HN: next-vibe – a TypeScript-first framework where any, unknown, object, as X, and throw are banned",
    body: "Most TypeScript projects treat the type system as optional guardrails. We treat it as load-bearing structure. The rule in next-vibe is simple: types must align completely — no any, no unknown, no bare object, no type assertions (as X), no exceptions. If your types are wrong, the architecture is wrong.\n\nTo enforce this we built vibe check: a code quality tool that runs Oxlint (Rust), ESLint, and TypeScript type checking in parallel, with three custom plugins that enforce project-specific rules beyond what standard tools catch.",
    reasoning:
      "TypeScript hardliners will engage immediately. The banned patterns are concrete and controversial. HN engineers have opinions about any and throw. This angle invites disagreement — and on HN, disagreement is engagement.",
  },
  optionB: {
    badge: "Option B",
    title: "Unified surface",
    hnTitle:
      "Show HN: next-vibe – one endpoint definition becomes web UI, CLI, MCP tool, native app, cron job, and graph node",
    body: "I got tired of writing the same logic five times. Every feature needed a web form, a CLI command, an MCP tool for AI agents, sometimes a mobile screen. Same validation, same i18n, same error handling — just dressed differently.\n\nnext-vibe solves this with a single definition.ts per feature. You describe your fields, Zod schemas, labels, error types, and examples once. The framework renders it as: Web UI, CLI command, MCP server tool, Native mobile screen, Cron/background task, Graph node (Vibe Sense).",
    reasoning:
      "The relatable pain point: writing the same thing five times. The solution is concrete and demonstrable. The graph node angle is novel. MCP + AI agents angle is timely. Broader appeal — not just TypeScript specialists.",
  },
  bannedPatterns: {
    title: "The banned patterns",
    subtitle: "These are not style preferences. They are architectural rules.",
    any: {
      name: "no any",
      description:
        "Replace with a real typed interface. If you reach for any, your architecture has a hole.",
    },
    unknown: {
      name: "no unknown",
      description:
        "Same rule. unknown is just any with extra steps. Define the type.",
    },
    object: {
      name: "no bare object",
      description:
        "Bare object is meaningless. Write the shape you actually expect.",
    },
    asX: {
      name: "no as X",
      description:
        "Type assertions are lies to the compiler. Fix the architecture instead.",
    },
    throwStatements: {
      name: "no throw",
      description:
        "Use ResponseType<T> with success(data) or fail({message, errorType}). Errors are data, not exceptions.",
    },
    hardcodedStrings: {
      name: "no hardcoded strings in JSX",
      description:
        "The checker catches untranslated literal strings. Every string needs a translation key.",
    },
  },
  vibeSense: {
    title: "The trading bot angle",
    subtitle: "A trading bot that cannot trade",
    description:
      "Vibe Sense is a node-based market analytics engine. Data sources, indicators (EMA, SMA, Bollinger Bands), evaluators that emit signals, and action nodes that react to those signals. No order execution. When a signal fires, action nodes do things like trigger an AI analysis run, send alerts, or kick off downstream workflows.",
    hookForComments:
      "Every node in the graph is just an HTTP endpoint — you can curl any step in the pipeline, test it in isolation, or call it from an AI agent. The graph engine is a scheduler, not a DSL.",
    whyItMatters:
      "Because every node is a standard endpoint, they are individually testable via CLI, accessible to AI agents via MCP, and cacheable with the same infra as everything else.",
  },
  angles: {
    title: "The angles ranked by likely HN traction",
    intro: "Based on pattern-matching against what actually performs on HN:",
    items: {
      typescript: {
        rank: "1",
        title: "TypeScript supremacy + the checker",
        reason: "Controversial, technical, concrete. Engineers have opinions.",
      },
      unifiedSurface: {
        rank: "2",
        title: "Unified surface — one definition, all surfaces",
        reason:
          "Relatable pain point. Every developer has written the same form five times.",
      },
      vibeSense: {
        rank: "3",
        title: "Vibe Sense graph engine on top of endpoints",
        reason:
          "Novel architecture. The HTTP endpoint as graph node is an interesting idea.",
      },
      agentCoordination: {
        rank: "4",
        title: "AI agent coordination layer",
        reason: "Interesting but buried in the body. Better as a comment hook.",
      },
      freeSpeech: {
        rank: "5",
        title: "unbottled.ai free-speech angle",
        reason:
          "Generates discussion but risks derailing the technical conversation.",
      },
    },
  },
  titleAlternatives: {
    title: "Alternative title options",
    items: {
      alt1: "Show HN: I banned any, unknown, object, and as X from our TypeScript codebase — here is the enforcer",
      alt2: "Show HN: next-vibe – TypeScript so strict we wrote a custom linter to ban throw statements",
      alt3: "Show HN: next-vibe – one endpoint definition, six surfaces (web/CLI/MCP/native/cron/graph)",
      alt4: "Show HN: We built a time-series graph engine where every node is just an HTTP endpoint",
    },
  },
  decision: {
    title: "The recommendation",
    option: "Option A",
    reasoning:
      "Option A for a more opinionated and technical hook. TypeScript hardliners will engage immediately. Option B if you want to showcase the full breadth. The TypeScript banned patterns angle is the most concrete, most controversial, and most likely to drive comments.",
    cta: "View on GitHub",
    github: "github.com/techfreaque/next-vibe",
  },
  ui: {
    hnSiteName: "Hacker News",
    hnNavFull:
      "Hacker News | new | past | comments | ask | show | jobs | submit",
    hnNavShort: "new | past | comments | ask | show | jobs | submit",
    hnPostMeta: "42 points by techfreaque 2 hours ago | 18 comments",
    hnRecommended: "recommended",
    hookForCommentsLabel: "Hook for comments",
  },
};
