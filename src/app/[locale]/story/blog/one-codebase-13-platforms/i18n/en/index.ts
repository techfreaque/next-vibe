export const translations = {
  meta: {
    title: "One Codebase. 13 Platforms. Zero Compromises.",
    category: "Architecture",
    description:
      "How the Unified Surface principle turns three files into a web app, CLI command, MCP tool, native screen, and cron job - automatically.",
    imageAlt: "next-vibe Unified Surface Architecture",
    keywords:
      "next-vibe, unified surface, endpoint pattern, MCP, CLI, TypeScript, SaaS framework, full-stack",
  },
  readingTime: "12 min read",
  category: "Architecture",
  publishedDate: "March 2025",
  backToBlog: "Back to Blog",

  hero: {
    eyebrow: "The Unified Surface Principle",
    title: "One Codebase. 13 Platforms. Zero Compromises.",
    subtitle:
      "How three files become a web form, CLI command, MCP tool, native screen, and automated job - simultaneously.",
    fileBarLabel: "definition.ts → web · cli · mcp · native · cron · 10 more",
    theaCardTitle: "Who is Thea?",
    allowedRolesLabel: "allowedRoles: [...]",
    fileTreePath: "~/src/app/api/explain-to-my-boss/",
    codeBlockLabel: "allowedRoles: [",
    closingBracket: "]",
    vibeCliCommand:
      "vibe analytics/indicators/ema --source=leads_created --period=7",
  },

  intro: {
    hook: "5,802 TypeScript files. ~2.1 million lines. Zero `any`. Zero runtime type errors. One pattern. Repeated 374 times.",
    para1:
      "That's the codebase behind unbottled.ai - and the framework that powers it, next-vibe. The same architecture runs a web app, a mobile app, a CLI, an AI agent interface, an MCP server, a cron system, a websocket event bus, and a live dataflow engine.",
    para2:
      "The pattern is called the Unified Surface. Here's what it is, how it works, and why - once you see it - you'll find it hard to go back.",
  },

  fileTreeSection: {
    title: "A feature is a folder",
    intro:
      "Every feature in next-vibe lives in a folder. Three files are required. Everything else is optional.",
    fileTree: {
      line1: "explain-to-my-boss/",
      line2: "  definition.ts    ← what it does",
      line3: "  repository.ts    ← how it does it",
      line4: "  route.ts         ← makes it exist everywhere",
      line5: "  widget.tsx       ← custom React UI (optional)",
      line6: "  widget.cli.tsx   ← custom terminal UI (optional)",
    },
    explanation:
      "That's it. One folder. Three required files. And from those three files, that feature exists on up to 13 platforms simultaneously.",
  },

  platformsSection: {
    title: "13 platforms from 3 files",
    subtitle:
      "When you add a feature to next-vibe, it doesn't just become an API endpoint. It becomes everything at once.",
    platforms: {
      webApi: {
        label: "Web API",
        description: "REST endpoint, auto-validated, fully typed",
      },
      reactUi: {
        label: "React UI",
        description: "Auto-generated from the definition - no JSX written",
      },
      cli: {
        label: "CLI",
        description: "Every endpoint is a command with auto-generated flags",
      },
      aiTool: {
        label: "AI Tool Schema",
        description: "Function calling schema generated automatically",
      },
      mcpServer: {
        label: "MCP Server",
        description: "Plug into Claude Desktop, Cursor, or any MCP client",
      },
      reactNative: {
        label: "React Native",
        description: "iOS and Android screens from the same definition",
      },
      cron: {
        label: "Cron Job",
        description: "Schedule any endpoint to run on a timer",
      },
      websocket: {
        label: "WebSocket Events",
        description: "Push updates to connected clients on completion",
      },
      electron: {
        label: "Electron Desktop",
        description: "Native desktop app via the same endpoint contracts",
      },
      adminPanel: {
        label: "Admin Panel",
        description: "Auto-generated admin UI, no bespoke code needed",
      },
      vibeFrame: {
        label: "VibeFrame Widget",
        description: "Embeddable iframe widget for any website",
      },
      remoteSkill: {
        label: "Agent Skill",
        description: "Callable by AI agents as a structured skill",
      },
      vibeBoard: {
        label: "Vibe Sense Node",
        description: "Node in a live dataflow graph - same endpoint",
      },
    },
  },

  deleteFolderQuote:
    "Delete the folder. The feature ceases to exist everywhere at once.",

  platformMarkersSection: {
    title: "Platform access is one enum array",
    para1:
      "You don't write separate permission layers for each platform. Platform access is declared in the definition itself - one enum array that every platform reads natively at runtime.",
    codeComment: "// This single array controls where the feature appears",
    cliOff: "  CLI_OFF,         // blocks the CLI",
    mcpVisible: "  MCP_VISIBLE,     // opts into the MCP tool list",
    remoteSkill: "  REMOTE_SKILL,    // puts it in the agent skill file",
    productionOff: "  PRODUCTION_OFF,  // disables it in prod",
    para2:
      "Same definition. Same place. No config files to sync. No separate permission systems per platform.",
  },

  noApiSplitQuote:
    "There is no API for humans and API for AI. There's just the tool.",

  demoSection: {
    title: "The live demo: Thea builds an endpoint",
    subtitle:
      "Instead of explaining the pattern abstractly, let me show you what it looks like in practice.",
    theaIntro:
      "Thea is the AI admin for this platform. She runs on production 24/7, operating through the exact same endpoint contracts as every user - same validation, same permissions, no backdoor. And she can delegate work to a local machine.",
    demoStory:
      "I asked Thea to build a new endpoint - explain-to-my-boss - using Claude Code running on my PC. You give it a technical decision. It gives you a non-technical justification your manager will actually believe. Every developer has needed this.",

    flow: {
      step1: {
        actor: "You",
        label: "Ask Thea",
        description:
          "Type the task in the chat - two input fields, one AI-generated response, all platforms, MCP_VISIBLE, custom React and CLI widgets.",
      },
      step2: {
        actor: "Thea",
        label: "Creates task",
        description:
          'Thea reasons out loud, creates a task with targetInstance="hermes" (your local machine), and goes dormant.',
      },
      step3: {
        actor: "Local Hermes",
        label: "Picks up the task",
        description:
          "The local instance syncs every 60 seconds. No open ports. Your machine initiates the connection.",
      },
      step4: {
        actor: "Claude Code",
        label: "Builds the endpoint",
        description:
          "Interactive session. Reads existing patterns first, creates five files, runs vibe check. Zero errors.",
      },
      step5: {
        actor: "Claude Code",
        label: "Reports completion",
        description:
          "Calls complete-task with the task ID. Status: completed. Summary attached.",
      },
      step6: {
        actor: "Thea",
        label: "Wakes up",
        description:
          "wakeUp fires. Thea resumes mid-conversation via websocket, streams her response, TTS speaks.",
      },
      step7: {
        actor: "Result",
        label: "Exists everywhere",
        description:
          "Web form. CLI command. MCP tool. React Native screen. All live. From five files.",
      },
    },

    proofTitle: "The proof",
    proofPara:
      "Once Claude Code called complete-task, three things existed that didn't five minutes before:",
    proof1:
      "A custom React widget - dramatic heading, animated gradient on the AI output, a fake corporate alignment score.",
    proof2:
      "A CLI widget - ASCII banner, spinner while the AI thinks, the justification printed line by line in green.",
    proof3:
      "An MCP tool - explain-to-my-boss_POST - because MCP_VISIBLE was in the definition. Claude Desktop can now explain your decisions to your boss on your behalf.",
    proofClosing:
      "One definition. Five files total. Three completely different UIs. The endpoint contract didn't change. Only the presentation layer did.",
  },

  underTheHoodSection: {
    title: "Under the hood",
    definitionTitle: "definition.ts - the living contract",
    definitionPara:
      "The definition is not a code generator. It's a living contract that every platform reads natively at runtime. Change it - everything updates. Delete the folder - nothing breaks downstream. There's no generated code to clean up.",
    repositoryTitle: "repository.ts - no throw, ever",
    repositoryPara:
      "Repository functions never throw. Errors propagate as data - typed, explicit, and catchable by the caller. The AI can reason about failure paths. No surprise exceptions.",
    repositoryCodeComment: "// Returns ResponseType<T> - never throws",
    routeTitle: "route.ts - the entire bridge",
    routePara:
      "route.ts wires the definition to the handler. endpointsHandler takes care of validation, auth, logging, and exposure to all 13 platforms. The actual business logic is one line.",
    statsTitle: "The numbers",
    statEndpoints: "374 endpoints",
    statEndpointsDetail: "One pattern, applied 374 times",
    statAny: "Zero `any`",
    statAnyDetail: "Enforced at build time, not convention",
    statLanguages: "Three languages",
    statLanguagesDetail:
      'Compile-time checked - t("typo.here") is a compiler error',
    statsClosing: "That's not convention. It's enforced at build time.",
  },

  onePatternQuote: "One pattern. Repeated 374 times.",

  vibeSenseTeaser: {
    eyebrow: "Up next",
    title: "Vibe Sense: The pipeline is the platform",
    description:
      "Every node in a Vibe Sense graph is a regular next-vibe endpoint. The same createEndpoint(). The same 3-file structure. An EMA indicator is an endpoint. A threshold evaluator is an endpoint. And because it's an endpoint - you can call it from the CLI, from the AI, from anywhere.",
    calloutLine: "The pipeline is the platform.",
    teaser:
      "Vibe Sense is just... more endpoints. The same thing, applied to time series data. Lead funnels. Credit economy. User growth. Your platform watching itself.",
    cta: "Back to Blog",
  },

  closing: {
    title: "Define it once. It exists everywhere.",
    para: "WordPress gave everyone the power to publish. next-vibe gives you the power to build platforms that work on web, mobile, CLI, AI agents, and automation - that watch themselves, reason about their own data, and act on what they find.",
    cta: "Star next-vibe on GitHub",
    ctaLink: "https://github.com/techfreaque/next-vibe",
  },
};
