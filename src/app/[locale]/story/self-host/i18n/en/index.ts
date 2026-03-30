export const translations = {
  meta: {
    title: "Self-Host unbottled.ai — Your Instance, Your Rules",
    description:
      "Run the full unbottled.ai stack on your own server. BYO API keys, Thea as your AI admin, full control. Free forever.",
    category: "Self-Host",
    imageAlt: "Self-host unbottled.ai quickstart",
    keywords:
      "self-host, next-vibe, unbottled.ai, open-source, AI, VPS, Docker, Kubernetes",
  },
  hero: {
    badge: "Free forever — MIT + GPL v3",
    title: "Run it yourself.",
    titleHighlight: "Own everything.",
    subtitle:
      "The full unbottled.ai stack on your own server. Every model, every tool, every feature — plus Thea as your AI admin who monitors and self-heals your instance 24/7.",
    ctaQuickstart: "Jump to Quickstart",
    ctaGithub: "Star on GitHub",
  },
  includes: {
    title: "Everything the cloud has. Plus more.",
    items: {
      models: "42+ models — use your own API keys, pay providers directly",
      memory: "Persistent memory, incognito mode, 4 privacy levels",
      search: "Live web search + full page fetch",
      thea: "Thea: AI admin who monitors, self-heals, and builds tools on command",
      admin: "Admin dashboard, DB studio, cron dashboard, health monitoring",
      ssh: "SSH, browser automation, email client — Thea's tools",
      sync: "Local instance sync with unbottled.ai cloud (beta)",
      free: "Free forever — MIT + GPL v3, no vendor lock-in",
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
    },
    step3: {
      title: "Log in and configure",
      description:
        'Click "Login as Admin" on the login page — no password needed in dev. You\'ll be taken to the settings page where a wizard walks you through API key setup and admin password.',
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
          "200+ models, pay per use. Get your key at openrouter.ai/keys.",
      },
    },
  },
  vps: {
    title: "Deploying to a VPS?",
    description:
      "Works on any Linux VPS. Point nginx or Caddy at port 3000 — done.",
    docker: "Docker setup",
    kubernetes: "Kubernetes",
    kubernetesDescription:
      "Includes templates for web, task workers, Redis, ingress, and namespace.",
  },
  localSync: {
    title: "Connect your local machine (beta)",
    description:
      "Thea can route tasks to Claude Code on your dev machine. Go to Admin → Remote Connections in the dashboard to add your local instance URL. Memories and tasks sync every 60 seconds — no port forwarding, no VPN.",
  },
  enterprise: {
    title: "Need help setting up?",
    description:
      "We can help with deployment, custom integrations, and ongoing development support.",
    cta: "Get in touch",
  },
};
