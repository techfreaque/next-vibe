export const translations = {
  title: "next-vibe Framework",
  description:
    "The open-source SaaS framework powering {{appName}}. Define it once, it exists everywhere.",
  meta: {
    title: "next-vibe Framework",
    description:
      "Open-source AI-native SaaS framework. One endpoint definition, thirteen platforms.",
    category: "Framework",
    imageAlt: "next-vibe Framework Documentation",
    keywords:
      "next-vibe, framework, SaaS, open-source, AI, full-stack, TypeScript",
  },
  hero: {
    eyebrow: "Open Source · MIT + GPL v3",
    title: "One definition.",
    titleAccent: "Thirteen platforms.",
    subtitle:
      "next-vibe turns a single TypeScript definition into thirteen platforms at once - interactive web UI, CLI command, MCP tool, mobile screen, cron job, WebSocket, admin panel, and more. Full type safety, zero drift, zero repetition.",
    ctaGithub: "Star on GitHub",
    ctaDocs: "Read the pattern docs",
    stat1Label: "typed endpoints",
    stat2Value: "0",
    stat2Label: "runtime type errors",
    stat3Label: "platforms per endpoint",
    stat4Value: "2",
    stat4Label: "files required",
  },
  problem: {
    eyebrow: "The problem",
    title: "You've built the same thing thirteen times.",
    subtitle:
      "Every feature needs a custom web UI, CLI command, MCP tool, mobile screen, cron job, WebSocket handler, admin panel, and more. Same validation, same i18n, same error handling - just dressed differently. Every time.",
    callout: "next-vibe builds all thirteen from one file.",
  },
  pattern: {
    eyebrow: "The pattern",
    title: "Two files required. Every platform.",
    subtitle:
      "Each feature lives in a folder. Only definition.ts and route.ts are required - everything else is optional.",
    definitionTitle: "definition.ts - the contract",
    definitionBody:
      "Declare your fields, Zod schemas, labels, error types, and examples once. This file is the single source of truth - the framework reads it at runtime on every platform.",
    routeTitle: "repository.ts - the logic",
    routeBody:
      "Business logic lives here - DB queries, auth checks, error handling with success()/fail(). The route.ts is just a thin delegator; validation, logging, and platform registration happen automatically.",
    widgetTitle: "widget.tsx - the UI (optional)",
    widgetBody:
      "Without a widget, the framework auto-renders your fields everywhere. Add widget.tsx to ship a fully custom interactive UI - the same component renders in admin panels, embedded widgets, and mobile screens.",
    deleteLine:
      "Delete the folder. The feature disappears from every platform at once.",
  },
  surfaces: {
    eyebrow: "Every Platform",
    title: "One definition. Thirteen platforms.",
    subtitle:
      "When you add a feature to next-vibe, it doesn't just become an API endpoint. It runs everywhere at once.",
    items: {
      webApi: {
        label: "Web API",
        description: "REST endpoint, fully validated and typed",
      },
      reactUi: {
        label: "React UI",
        description: "Purpose-built interactive UI - no JSX required",
      },
      cli: {
        label: "CLI",
        description: "Every endpoint is a command with auto-generated flags",
      },
      aiTool: {
        label: "AI Tool",
        description: "Function-calling schema generated automatically",
      },
      mcpServer: {
        label: "MCP Server",
        description: "Connect Claude Desktop, Cursor, any MCP client",
      },
      reactNative: {
        label: "React Native",
        description: "iOS and Android screens from the same definition",
      },
      cron: {
        label: "Cron Job",
        description: "Schedule any endpoint on a cron expression",
      },
      websocket: {
        label: "WebSocket",
        description: "Push updates to connected clients on completion",
      },
      electron: {
        label: "Electron",
        description: "Native desktop app via the same endpoint contracts",
      },
      adminPanel: {
        label: "Admin Panel",
        description: "Auto-generated admin UI - no dedicated code",
      },
      vibeFrame: {
        label: "VibeFrame Widget",
        description: "Embeddable iframe widget for any site",
      },
      remoteSkill: {
        label: "Agent Skill",
        description: "Callable by AI agents as a structured skill",
      },
      vibeBoard: {
        label: "Vibe Sense Node",
        description: "Node in a live data-flow graph - same endpoint",
      },
    },
  },
  typescript: {
    eyebrow: "TypeScript supremacy",
    title: "No any. No unknown. No throw.",
    subtitle:
      "Types must align completely - no exceptions. This isn't a style preference. It's a structural rule enforced at build time by vibe check.",
    patterns: {
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
          "Use ResponseType<T> with success(data) or fail({message, errorType}). Errors are data.",
      },
      hardcodedStrings: {
        name: "no hardcoded strings",
        description:
          "Every string needs a translation key. The checker catches untranslated literals.",
      },
    },
    vibeCheck:
      "vibe check runs Oxlint (Rust), ESLint, and TypeScript type checking in parallel. Zero errors required before ship.",
  },
  quickstart: {
    eyebrow: "Get started",
    title: "Fork, ask, ship.",
    subtitle: "You're at {{appName}}'s level from day one.",
    step1: {
      label: "Fork & clone",
      description: "Fork on GitHub, then clone your fork locally.",
    },
    step2: {
      label: "Start the server",
      description:
        "For local development, vibe dev starts PostgreSQL in Docker, runs migrations, seeds data, and gives you hot reload. For production, vibe build && vibe start does the initial deploy. vibe rebuild is what you use after that to update production with zero downtime.",
    },
    step3: {
      label: "Login as Admin",
      description:
        'Open the app and click "Login as Admin" - the setup wizard walks you through API keys and admin password.',
    },
    step4: {
      label: "Ask the AI",
      description:
        "Open {{appName}} chat or Claude Code and describe the feature you want. The AI writes all the files - definition, route, widget, i18n - and runs vibe check automatically.",
    },
    step5: {
      label: "Ship",
      description:
        "vibe rebuild updates production with zero downtime. It checks, rebuilds, and hot-restarts - no manual file editing, no downtime.",
    },
    docsLink: "Pattern documentation",
    githubLink: "github.com/techfreaque/next-vibe",
  },
  enterprise: {
    eyebrow: "Enterprise",
    title: "Building something big?",
    description:
      "We help teams with setup, custom integrations, architecture review, and ongoing development support. Same codebase, your deployment.",
    cta: "Get in touch",
  },
};
