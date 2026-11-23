export const translations = {
  meta: {
    title: "next-vibe Framework: One Definition, Every Surface",
    description:
      "Open-source TypeScript framework. One definition.ts becomes a web UI, CLI command, MCP tool, native screen, AI tool and cron job. Plus an OpenAI and Anthropic compatible hosted API.",
    category: "Framework",
    imageAlt: "next-vibe framework for developers",
    keywords:
      "next-vibe, TypeScript framework, MCP server, CLI, AI tools, Zod, Drizzle, OpenAI compatible API",
  },
  hero: {
    eyebrow: "Open source · MIT + GPL v3",
    title: "One definition.ts.",
    titleAccent: "Every surface.",
    subtitle:
      "next-vibe is a TypeScript framework where one endpoint definition becomes a web UI, a CLI command, an MCP tool, a native screen, an AI tool, a cron job and seven more surfaces. Same validation, same types, no glue code.",
    ctaQuickstart: "Run it in four commands",
    ctaGithub: "View on GitHub",
    stat1Label: "typed endpoints in this repo",
    stat2Label: "surfaces per endpoint",
    stat3Label: "languages per string",
    stat4Label: "definition per feature",
  },
  example: {
    eyebrow: "One real endpoint",
    title: "Follow the contact form.",
    intro:
      "The contact endpoint from the repo, live at the bottom of this page. Two files to read. Six of its thirteen surfaces below.",
    source: "Read the full source on GitHub",
    live: "Try the live form",
    becomes: "What it becomes",
    more: "Plus seven more",
    moreSurfaces: {
      webApi: "REST API",
      websocket: "WebSocket events",
      electron: "Electron app",
      adminPanel: "Admin panel",
      vibeFrame: "Embeddable widget",
      remoteSkill: "Agent skill",
      vibeBoard: "Analytics node",
    },
    surfaces: {
      web: {
        title: "Web UI",
        body: "The form at the bottom of this page. Fields, validation and the success alert come from the definition.",
      },
      cli: {
        title: "CLI command",
        body: "vibe contact-form. One flag per field, help text with examples built in.",
      },
      mcp: {
        title: "MCP tool",
        body: "Any MCP client calls contact-form through vibe mcp. Input schema straight from Zod.",
      },
      ai: {
        title: "AI tool",
        body: "Models can call it. requiresConfirmation makes the user approve before it sends.",
      },
      native: {
        title: "Native screen",
        body: "The Expo app renders the same widget with native inputs.",
      },
      cron: {
        title: "Cron job",
        body: "Any endpoint can run on a schedule. Same handler, no second code path.",
      },
    },
    callsTitle: "Four ways in",
    callsBody:
      "Real invocations. CLI, MCP and AI calls hit the contact handler above. The Cron tab is a real scheduled task from the repo.",
  },
  pattern: {
    eyebrow: "The pattern",
    title: "A feature is a folder.",
    subtitle:
      "definition.ts and route.ts are required. Widget, emails, table and translations sit next to them. Nothing lives in a central registry you edit by hand.",
    deleteLine:
      "Delete the folder and run vibe gen. The feature disappears from every surface at once.",
  },
  hood: {
    eyebrow: "Under the hood",
    title: "Boring parts, done once.",
    intro:
      "The framework owns validation, auth, logging, i18n and realtime. Your folder owns the business logic.",
    platform: {
      title: "Roles and platform markers",
      body: "allowedRoles decides who may call an endpoint. Platform markers decide where it shows up: AI_TOOL_OFF hides it from models, PRODUCTION_OFF keeps it out of production. Checked on every surface.",
    },
    data: {
      title: "Zod, Drizzle, PostgreSQL",
      body: "Zod validates input and output and generates every tool schema. Repositories own persistence through Drizzle. Migrations live in the repo. Out of the box it runs on embedded PGlite, no Docker. Point DATABASE_URL at any Postgres when you outgrow it.",
    },
    realtime: {
      title: "Typed realtime",
      body: "Endpoints declare event schemas and channel scopes. Clients subscribe over WebSocket for streamed tokens and task progress. Pub/sub runs in process or on Redis.",
    },
    remote: {
      title: "Connected instances",
      body: "Instances connect to each other, run tools on a peer and sync the data you allow. Each side enforces its own permissions. This is how a self-hosted install uses unbottled.ai models.",
    },
  },
  typescript: {
    title: "No any. No unknown. No throw.",
    subtitle:
      "Types line up end to end, with zero exceptions. vibe check enforces it before anything ships.",
    patterns: {
      any: {
        name: "no any",
        description:
          "Write the real interface. Reaching for any means the architecture has a hole.",
      },
      unknown: {
        name: "no unknown",
        description: "Same rule. unknown is any with extra steps.",
      },
      object: {
        name: "no bare object",
        description: "Write the shape you expect. object says nothing.",
      },
      asX: {
        name: "no as X",
        description:
          "Casts lie to the compiler. Fix the types at the source instead.",
      },
      throwStatements: {
        name: "no throw",
        description:
          "Return ResponseType<T> via success(data) or fail({ message, errorType }). Errors are data.",
      },
      hardcodedStrings: {
        name: "no raw strings",
        description:
          "Every user-facing string is a translation key. The linter catches literals.",
      },
    },
    vibeCheck:
      "vibe check runs Oxlint, ESLint and the TypeScript checker in parallel. Zero errors, or it does not ship.",
  },
  quickstart: {
    eyebrow: "Quickstart",
    title: "Four commands. Then the browser takes over.",
    intro:
      "Clone, install, start. A setup wizard handles the admin login and your AI provider. No config files to edit.",
    selfHost: "Self-hosting guide",
    docs: "Pattern docs on GitHub",
  },
  api: {
    eyebrow: "Hosted API",
    title: "Or just call the {{appName}} API.",
    intro:
      "No install needed. OpenAI and Anthropic compatible: keep your SDK, change the base URL and the key.",
    endpoints: {
      chat: "OpenAI Chat Completions",
      responses: "OpenAI Responses",
      messages: "Anthropic Messages",
      models: "Model list with prices",
    },
    access:
      "{{modelCount}} models behind one key, billed in {{appName}} credits. API keys unlock with any subscription or credit pack.",
    docs: "Read the API docs",
    keys: "Create an API key",
  },
  examples: {
    eyebrow: "In this repo",
    title: "Not just AI chat.",
    subtitle:
      "Whole business domains ship in this repo, each built on the same pattern.",
    items: {
      aiPlatform: {
        label: "AI platform",
        title: "{{appName}}",
        body: "{{modelCount}} models, chat, memory, agents, billing and MCP. This exact codebase, in production.",
      },
      commerce: {
        label: "Commerce",
        title: "Products and point of sale",
        body: "Products, point of sale, inventory and purchasing.",
      },
      finance: {
        label: "Finance",
        title: "Accounting and payments",
        body: "Chart of accounts, tax rates, invoices, Stripe and crypto payments.",
      },
      crm: {
        label: "CRM",
        title: "Leads and messaging",
        body: "Leads, newsletter, email inbox and SMS.",
      },
    },
  },
  maturity: {
    eyebrow: "Honest status",
    title: "What ships today.",
    stable: {
      title: "In production",
      body: "{{appName}} runs on this codebase: web, CLI, MCP, AI tools, cron, realtime, payments. Production builds run on Next.js. Local development defaults to TanStack Start and Vite.",
    },
    beta: {
      title: "Beta",
      body: "React Native screens, instance-to-instance sync and remote skills work, with rough edges.",
    },
    honest: {
      title: "Expect churn",
      body: "One team, moving fast, opinionated. No semver yet, and the docs trail the code. Pin a commit or fork it.",
    },
  },
  contact: {
    eyebrow: "The endpoint, live",
    title: "Questions, or building something big?",
    description:
      "Setup, custom integrations, architecture review. This form is the contact endpoint from the top of the page, rendered by the framework.",
  },
  code: {
    copy: "Copy",
    copied: "Copied",
    wrap: "Wrap",
    terminal: "Terminal",
    cli: "CLI",
    mcp: "MCP",
    ai: "AI tool",
    cron: "Cron",
    anthropic: "Anthropic (curl)",
  },
};
