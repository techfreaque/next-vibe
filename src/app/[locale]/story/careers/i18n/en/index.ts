export const translations = {
  meta: {
    title: "Build with next-vibe - {{appName}}",
    category: "Developers",
    description:
      "next-vibe turns any endpoint into a web form, CLI command, MCP tool, native screen, and AI-callable skill - simultaneously. Automate anything a human can do on a computer.",
    imageAlt: "next-vibe developer platform - {{appName}}",
    keywords:
      "next-vibe, AI automation, developer platform, business automation, ERP integration, production automation, {{appName}}",
    ogTitle: "Build with next-vibe - {{appName}}",
    ogDescription:
      "One codebase. Every surface. Automate production lines, ERP systems, desktop workflows - anything a human can do on a computer.",
    twitterTitle: "Build with next-vibe - {{appName}}",
    twitterDescription:
      "One codebase. Every surface. Automate production lines, ERP systems, desktop workflows - anything a human can do on a computer.",
  },

  hero: {
    eyebrow: "next-vibe developer platform",
    title: "If a human can do it on a computer, next-vibe can automate it.",
    subtitle:
      "One endpoint definition becomes a web form, CLI command, MCP tool, native screen, and AI-callable skill - simultaneously. Small scripts to full production line automation.",
    ctaPrimary: "Start building",
    ctaSecondary: "Read the docs",
  },

  audience: {
    title: "Who builds with next-vibe",
    items: {
      freelancers: {
        title: "Freelancers & agencies",
        description:
          "Deliver AI-powered tools to clients without building separate backends, CLIs, and UIs. One codebase, every surface.",
      },
      businessDevs: {
        title: "Business developers",
        description:
          "Connect your ERP, CRM, or any internal system to AI workflows. Pass data in, get decisions out - no glue code.",
      },
      industrialDevs: {
        title: "Industrial & embedded",
        description:
          "Automate device configuration on production lines. Trigger AI skills when sensors fire. Measure with Vibe Sense, act with Autopilot.",
      },
      enterpriseDevs: {
        title: "Enterprise teams",
        description:
          "Replace fragmented tooling with one unified platform. Web UI, CLI, MCP, native app - same endpoint, zero duplication.",
      },
    },
  },

  useCases: {
    title: "What you can build",
    items: {
      erpIntegration: {
        title: "ERP & business system integration",
        description:
          "Pass production data into an AI skill that classifies defects, updates inventory, or triggers reorder workflows. Your endpoint is the bridge.",
      },
      desktopAutomation: {
        title: "Full desktop automation",
        description:
          "next-vibe can take over the entire desktop including a browser. Form fills, scraping, navigation, file operations - scripted once, runs anywhere.",
      },
      productionLine: {
        title: "Production line automation",
        description:
          "Configure devices remotely via endpoint. Trigger quality checks via Vibe Sense. When a measurement crosses a threshold, an AI skill responds.",
      },
      autopilotScheduling: {
        title: "Scheduled AI actions",
        description:
          "Autopilot runs your skills on a schedule. Poll a data source every hour, summarize nightly logs, push alerts when anomalies appear.",
      },
      vibeSenseMonitoring: {
        title: "Sense → decide → act pipelines",
        description:
          "Vibe Sense measures anything: machine output, API health, queue depth. Feed the reading into a skill. The skill decides. An endpoint acts.",
      },
      skillEconomy: {
        title: "Sell what you build",
        description:
          "Wrap your automation as a skill. Share the link. Earn 15% recurring from every signup that came through your URL.",
      },
    },
  },

  architecture: {
    title: "One definition. Every surface.",
    subtitle:
      "Write one definition.ts per feature. Everything else is generated.",
    surfaces: {
      web: "Web form",
      cli: "CLI command",
      mcp: "MCP tool",
      native: "Native screen",
      cron: "Cron job",
      ai: "AI-callable skill",
    },
    description:
      "Platform is detected at runtime. The same endpoint that renders a web UI for a human becomes a machine-callable tool for an AI agent - no extra code.",
  },

  referral: {
    title: "Build it. Share it. Earn from it.",
    description:
      "Every skill you publish carries your referral link. 10% direct, 15% via skill, 20% stacked. Recurring forever from every user who signs up through you.",
    cta: "How the skill economy works",
  },

  cta: {
    title: "Start with one endpoint.",
    subtitle:
      "Add next-vibe to an existing project in minutes. Or start from the scaffold and deploy a full multi-surface tool today.",
    primary: "Get started",
    secondary: "Explore story posts",
  },

  // kept for type compatibility
  post: {
    title: "Build with next-vibe",
    description: "Developer platform endpoint",
    form: {
      title: "Configuration",
      description: "Configure parameters",
    },
    response: {
      title: "Response",
      description: "Response data",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      server: {
        title: "Server Error",
        description: "Internal server error occurred",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "Resource not found",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred",
      },
    },
    success: {
      title: "Success",
      description: "Operation completed successfully",
    },
  },
};
