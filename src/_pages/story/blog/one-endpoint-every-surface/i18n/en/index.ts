export const translations = {
  meta: {
    title: "One endpoint. Every surface. - next-vibe",
    description:
      "Write one definition.ts per feature. It renders as a web form, CLI command, MCP tool, native screen, cron job - simultaneously. No duplication. Types enforced.",
    category: "Architecture",
    imageAlt:
      "next-vibe unified surface architecture - one endpoint, every platform",
    keywords:
      "next-vibe, TypeScript, unified surface, MCP, CLI, definition.ts, open source, SaaS framework",
  },
  hero: {
    backToBlog: "Back to Blog",
    category: "Architecture",
    readTime: "5 min read",
    title: "One endpoint. Every surface.",
    subtitle:
      "Write one definition per feature. Web form, CLI command, MCP tool, native screen, cron job - all at once. No duplication.",
  },
  intro: {
    paragraph1:
      "Every feature needed a web form, a CLI command, an MCP tool for AI agents, sometimes a mobile screen. Same Zod validation, same i18n, same error handling - just dressed differently. So I built next-vibe: a framework where you write one definition.ts per feature and it renders as all of them simultaneously.",
    paragraph2:
      "It also powers {{appName}} - {{modelCount}} AI models, user-controlled censorship. The same codebase runs as a Next.js web app, a TanStack/Vite dev server, a React Native mobile app, a CLI, an MCP server, a cron system, and a WebSocket event bus. One endpoint definition. No duplication.",
  },
  typeRules: {
    title: "Types must align. No exceptions.",
    subtitle:
      "These are not style preferences. They are architectural rules baked into the framework.",
    intro:
      "The rule is strict: types must align completely. If your types are wrong, your architecture is wrong. We built vibe check to enforce it - Oxlint + ESLint + TypeScript in parallel, with custom plugins for project-specific rules.",
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
    title: "The accidental graph engine",
    subtitle: "A trading bot that cannot trade",
    description:
      "Vibe Sense started as a trading bot. It never executed orders - it just watched prices and fired signals. When I abandoned it, the pipeline architecture survived: data sources connect to indicators, indicators feed evaluators, evaluators emit signals, signals trigger actions. Every node is an HTTP endpoint.",
    quote:
      "Every node in the graph is just an HTTP endpoint - you can curl any step in the pipeline, test it in isolation, or call it from an AI agent. The graph engine is a scheduler, not a DSL.",
    whyItMatters:
      "Because every node is a standard endpoint, they are individually testable via CLI, accessible to AI agents via MCP, and cacheable with the same infra as everything else. The graph engine does not invent its own language. It schedules endpoints.",
  },
  cta: {
    github: "View on GitHub",
    clone: "git clone https://github.com/techfreaque/next-vibe",
  },
};
