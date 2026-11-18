export const translations = {
  meta: {
    title: "Self-Host {{appName}} - Your Instance, Your Rules",
    description:
      "Run the full {{appName}} stack on your own machine. Four commands, then a setup wizard in the browser. Connect your {{appName}} account or bring your own keys.",
    category: "Self-Host",
    imageAlt: "Self-host {{appName}} quickstart",
    keywords:
      "self-host, next-vibe, {{appName}}, open-source, private AI, local AI, OpenRouter",
  },
  hero: {
    badge: "Free and open source",
    title: "Run it yourself.",
    titleHighlight: "Own everything.",
    subtitle:
      "The full {{appName}} stack on your machine. Connect your {{appName}} account for every model, or bring your own keys. Four commands, then the browser takes over.",
    ctaQuickstart: "Start in four commands",
    ctaGithub: "View on GitHub",
  },
  quickstart: {
    eyebrow: "Quickstart",
    title: "Four commands. Then the browser takes over.",
    intro:
      "No config files to edit. A setup wizard opens on first login and walks you through the rest.",
  },
  paths: {
    eyebrow: "Choose your AI",
    title: "Your machine. Your pick of models.",
    intro:
      "Both options live in the AI Provider step of the setup wizard. Switch any time.",
    account: {
      badge: "Recommended",
      title: "Connect your {{appName}} account",
      body: "Sign in once in the wizard. Your instance runs every chat; the models run on {{appName}} and bill your credits. No API keys to juggle.",
      points: {
        models:
          "All {{modelCount}} models, mainstream to uncensored, one login.",
        local: "Chats stay in your local database.",
        sync: "Memories, documents, skills and favorites sync by default, threads do not. One switch each.",
        paid: "Needs a paid plan or credit pack. Up to three instances per account.",
      },
      cta: "Create your {{appName}} account",
    },
    standalone: {
      badge: "No account",
      title: "Standalone, with your own keys",
      body: "No account with us. Paste a provider key in the same step and pay the provider directly.",
      points: {
        openrouter: "OpenRouter: hundreds of models, one key.",
        claude:
          "Claude Code logged in on this machine? Detected on its own. No key needed.",
        more: "More providers under View all settings, any time.",
        billing: "You pay the provider directly. No {{appName}} bill.",
      },
      cta: "Get an OpenRouter key",
    },
  },
  own: {
    eyebrow: "Your server, your rules",
    title: "Own the stack. Own the filter.",
    subtitle:
      "Your Postgres, your files, your logs. You pick the models and how much filtering sits between you and them.",
    cards: {
      data: {
        title: "Your data stays put",
        body: "Threads, memories and files live in your own database and storage path.",
      },
      filter: {
        title: "Your filtering level",
        body: "Mainstream, open or uncensored models. You decide per skill and per thread. No policy team in the loop.",
      },
      keys: {
        title: "Your bill, your call",
        body: "Model spend goes to your {{appName}} credits or straight to your own provider. Your choice.",
      },
    },
  },
  includes: {
    title: "Everything the cloud has.",
    intro: "Same codebase as {{appName}}. Nothing held back.",
    items: {
      models: "{{modelCount}} chat models, plus image, video, music and speech",
      memory: "Persistent memory and incognito chats",
      search: "Web search and page fetch",
      thea: "Thea, your AI admin: runs tasks, builds tools on request",
      admin: "Admin dashboard and cron jobs",
      tools: "SSH, browser automation, email client as AI tools",
    },
  },
  developers: {
    title: "Want to build on it?",
    body: "Every feature is one definition file that becomes a web page, a CLI command, an MCP tool and an AI tool.",
    cta: "See how next-vibe works",
  },
  help: {
    title: "Stuck, or running it for a team?",
    description:
      "Setup help, team installs, custom integrations. A human reads every message.",
  },
};
