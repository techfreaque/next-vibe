export const translations = {
  meta: {
    title: "Self-Host {{appName}} - Your Instance, Your Rules",
    description:
      "Run the full {{appName}} stack on your own server. BYO API keys, Thea as your AI admin, full control. Free forever.",
    category: "Self-Host",
    imageAlt: "Self-host {{appName}} quickstart",
    keywords:
      "self-host, next-vibe, {{appName}}, open-source, AI, VPS, Docker, Kubernetes",
  },
  hero: {
    badge: "Free forever - MIT + GPL v3",
    title: "Run it yourself.",
    titleHighlight: "Own everything.",
    subtitle:
      "The full {{appName}} stack on your own server. Every model, every tool, every feature - plus Thea as your AI admin who monitors and self-heals your instance 24/7.",
    ctaQuickstart: "Jump to Quickstart",
    ctaGithub: "Star on GitHub",
  },
  includes: {
    title: "Everything the cloud has. Plus more.",
    items: {
      models:
        "{{modelCount}} models - use your own API keys, pay providers directly",
      memory: "Persistent memory, incognito mode, 4 privacy levels",
      search: "Live web search + full page fetch",
      thea: "Thea: AI admin who monitors, self-heals, and builds tools on command",
      admin: "Admin dashboard, DB studio, cron dashboard, health monitoring",
      ssh: "SSH, browser automation, email client - Thea's tools",
      sync: "Local instance sync with {{appName}} cloud (beta)",
      free: "Free forever - MIT + GPL v3, no vendor lock-in",
    },
  },
  quickstart: {
    title: "Quickstart",
    subtitle: "Three commands. Up in 5 minutes.",
    step1: {
      title: "Clone and install",
      description: "Get the code and install dependencies.",
    },
    step2: {
      title: "Start the dev server",
      description:
        "Starts PostgreSQL in Docker, runs migrations, seeds data, and opens at localhost:3000.",
      noDocker:
        'No Docker? Set DATABASE_URL="file:///absolute/path/data.db" in .env and vibe dev runs on embedded PGlite instead.',
    },
    step3: {
      title: "Log in and configure",
      description:
        'Click "Login as Admin" on the login page - no password needed in dev. You\'ll be taken to the settings page where a wizard walks you through API key setup and admin password.',
    },
    step4: {
      title: "Pick an AI provider",
      optionA: {
        label: "Option A: Claude Code (recommended)",
        description:
          "No API key needed. Uses your existing Claude subscription. Select any claude-code-* model in the model picker.",
      },
      optionB: {
        label: "Option B: OpenRouter",
        description:
          "Every OpenRouter model, pay per use. Get your key at openrouter.ai/keys.",
      },
    },
  },
  vps: {
    title: "Deploying to a VPS?",
    description:
      "Works on any Linux VPS. Point nginx or Caddy at port 3000 - done.",
    docker: "Docker setup",
    kubernetes: "Kubernetes",
    kubernetesDescription:
      "Includes templates for web, task workers, Redis, ingress, and namespace.",
  },
  localSync: {
    title: "Connect your local machine (beta)",
    description:
      "Thea can route tasks to Claude Code on your dev machine. Go to Admin → Remote Connections in the dashboard to add your local instance URL. Memories and tasks sync every 60 seconds - no port forwarding, no VPN.",
  },
  own: {
    eyebrow: "Your server, your rules",
    title: "Own the stack. Own the filter.",
    subtitle:
      "No account at someone else's company. Your Postgres, your keys, your logs. You pick the models and you pick how much filtering sits between you and them.",
    cards: {
      data: {
        title: "Your data stays put",
        body: "Threads, memories and files live in your own Postgres and storage path. Nothing phones home.",
      },
      filter: {
        title: "Your filtering level",
        body: "Mainstream, open or uncensored models. You decide per skill, per thread, per user. No policy team in the loop.",
      },
      keys: {
        title: "Your keys",
        body: "Bring OpenRouter, a local model or Claude Code. Spend goes to your provider, not through ours.",
      },
    },
  },
  env: {
    title: "What it takes",
    intro:
      "Bun, Docker and a handful of env vars. That is the whole checklist for a private instance.",
    envLabel: "Minimum config",
    composeLabel: "Production on a VPS",
  },
  instances: {
    title: "Three instances, three jobs",
    intro:
      "One codebase runs as separate instances. Same code, different database and role. This is how we run our own.",
    atlas: {
      name: "Atlas",
      body: "The dev instance. Hot reload, throwaway database. Where code gets written.",
    },
    hermes: {
      name: "Hermes",
      body: "Your daily driver. Local preview on its own Postgres. This is the one you live in.",
    },
    thea: {
      name: "Thea",
      body: "The cloud instance on your VPS. Always on, runs your crons, takes tasks from the other two.",
    },
    note: "Instances connect to each other. Threads and tasks sync between your laptop and your server.",
  },
  fork: {
    title: "Same framework, different product",
    body: "next-vibe-headunit is a car-PC fork. Media, navigation, climate, Bluetooth and radio are all endpoints, and each one is also a CLI command and an AI tool. Different product, same three files.",
  },
  enterprise: {
    title: "Need help setting up?",
    description:
      "We can help with deployment, custom integrations, and ongoing development support.",
  },
};
