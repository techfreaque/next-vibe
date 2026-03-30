export const translations = {
  meta: {
    title: "Show HN: next-vibe — one endpoint, every surface",
    description:
      "The Show HN post for next-vibe, plus the reasoning behind the angle. TypeScript supremacy, unified surfaces, and an accidental graph engine.",
    category: "Community",
    imageAlt: "Show HN: next-vibe",
    keywords:
      "Hacker News, Show HN, next-vibe, TypeScript, MCP, unified surface, open source",
  },
  hero: {
    backToBlog: "Back to Blog",
    category: "Show HN",
    readTime: "5 min read",
    title: "Show HN: next-vibe — one endpoint, every surface",
    subtitle: "The actual post, plus the thinking behind it.",
  },
  post: {
    label: "The post",
    body: "I got tired of writing the same logic five times.\n\nEvery feature needed a web form, a CLI command, an MCP tool for AI agents, sometimes a mobile screen. Same Zod validation, same i18n, same error handling — just dressed differently. So I built next-vibe: a framework where you write one definition.ts per feature and it renders as all of them simultaneously.\n\nThe rule is strict: types must align completely. No any, no unknown, no type assertions (as X), no throw statements. If your types are wrong, your architecture is wrong. We built vibe check to enforce it — Oxlint + ESLint + TypeScript in parallel, with custom plugins for project-specific rules.\n\nIt also powers unbottled.ai (50+ AI models, user-controlled censorship). The same codebase runs as a Next.js web app, a TanStack/Vite dev server, a React Native mobile app, a CLI, an MCP server, a cron system, and a WebSocket event bus. One endpoint definition. No duplication.\n\nThe strangest part: an abandoned trading bot I wrote years ago became the most interesting piece. Vibe Sense is a node-based analytics engine — data sources, indicators (EMA, SMA, Bollinger Bands), evaluators that emit signals. No order execution. Every node is a standard HTTP endpoint: curl-able, MCP-accessible, individually testable. The graph engine is a scheduler, not a DSL.",
    note: "This is the post going to Hacker News. Title and first two sentences are everything.",
  },
  behind: {
    label: "Behind the post",
    subtitle: "Why this angle, what else we considered, and the tradeoffs.",
  },
  whyAngle: {
    title: "Why the unified surface angle",
    p1: "The relatable pain point — writing the same thing five times — lands with any developer who has built a real product. It's not abstract. Every engineer who has maintained a REST endpoint, a CLI wrapper, and a mobile client for the same feature knows the feeling.",
    p2: "The TypeScript rules are the most controversial part. HN engineers have strong opinions about any and throw. Leading with the unified surface gets broader engagement; the TypeScript angle drives the comments.",
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
      "Vibe Sense started as a trading bot. It never executed orders — it just watched prices and fired signals. When I abandoned it, the pipeline architecture survived: data sources connect to indicators, indicators feed evaluators, evaluators emit signals, signals trigger actions. Every node is an HTTP endpoint.",
    hookForComments:
      "Every node in the graph is just an HTTP endpoint — you can curl any step in the pipeline, test it in isolation, or call it from an AI agent. The graph engine is a scheduler, not a DSL.",
    whyItMatters:
      "Because every node is a standard endpoint, they are individually testable via CLI, accessible to AI agents via MCP, and cacheable with the same infra as everything else.",
  },
  alternatives: {
    title: "Title alternatives we considered",
    items: {
      alt1: "Show HN: I banned any, unknown, object, and as X from our TypeScript codebase — here's the enforcer",
      alt2: "Show HN: next-vibe — TypeScript so strict we wrote a custom linter to ban throw statements",
      alt3: "Show HN: next-vibe — one endpoint definition, six surfaces (web/CLI/MCP/native/cron/graph)",
      alt4: "Show HN: We built a time-series graph engine where every node is just an HTTP endpoint",
    },
  },
  cta: {
    github: "View on GitHub",
    githubUrl: "github.com/techfreaque/next-vibe",
  },
};
