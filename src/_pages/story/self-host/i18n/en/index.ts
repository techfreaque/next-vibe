export const translations = {
  meta: {
    title: "Self-Host {{appName}}: AI, Accounting and CRM on Your Server",
    description:
      "Run {{appName}} on your own machine. git clone, bun i, vibe dev. All {{modelCount}} AI models through your {{appName}} account, plus accounting, CRM and newsletters. Your data stays in your database.",
    category: "Self-Host",
    imageAlt: "Self-host {{appName}} on your own machine",
    keywords:
      "self-host, self-hosted AI chat, next-vibe, {{appName}}, open source, private AI, local AI, uncensored AI, self-hosted accounting, open source ERP, self-hosted CRM",
  },
  hero: {
    badge: "Free and open source",
    title: "Your server.",
    titleHighlight: "Your AI. Your business.",
    subtitle:
      "Run {{appName}} on your own machine. Sign in with your {{appName}} account and all {{modelCount}} models work. No provider keys. Accounting, CRM, newsletters and agents ship in the same app.",
    ctaStart: "Get it running",
    ctaGithub: "View on GitHub",
  },
  diagram: {
    link: "One sign-in",
    instance: {
      label: "Runs on your machine",
      title: "Your instance",
      points: {
        chats: "Chats, books and customers in your own Postgres",
        files: "Uploads and generated media on your disk",
        tools: "Thea, cron jobs and every AI tool",
        admin: "Your admin, your rules.",
      },
    },
    account: {
      label: "Runs on {{appName}}",
      title: "Your account",
      points: {
        models: "{{modelCount}} models, billed to your credits",
        keys: "Zero provider keys",
      },
    },
  },
  suite: {
    eyebrow: "What you install",
    title: "Far more than a chat app.",
    intro:
      "One codebase. One database. One admin. Every module ships in the same install.",
    link: "See the full business suite",
    cards: {
      ai: {
        title: "AI chat",
        body: "{{modelCount}} models, memory, web search and incognito chats. Images, video, music and speech.",
      },
      agents: {
        title: "An agent that works",
        body: "Thea, the built-in agent, runs tasks on a schedule and uses SSH, a browser and your email as tools.",
      },
      books: {
        title: "Accounting and ERP",
        body: "Double-entry ledger, invoices, bills, purchasing, inventory and point of sale.",
      },
      customers: {
        title: "Customers",
        body: "CRM with CSV import, newsletters with double opt-in, one inbox for email, SMS, Telegram and WhatsApp.",
      },
      payments: {
        title: "Payments",
        body: "Stripe and crypto checkout for subscription plans, with webhooks and refunds.",
      },
      build: {
        title: "Your own features",
        body: "One definition file becomes a web page, a CLI command, an MCP tool and an AI tool.",
      },
    },
  },
  start: {
    eyebrow: "Setup",
    title: "Clone. Install. Run.",
    intro:
      "Three commands in the terminal. Everything else happens in your browser. No config files to edit.",
    terminal: {
      eyebrow: "In the terminal",
      title: "Start your instance",
      copyAll: "Copy all",
      copy: "Copy",
      copied: "Copied",
      rows: {
        clone: "Get the code",
        install: "Open the next-vibe folder in your terminal, then install",
        dev: "Start. Database and seed data set up on their own.",
      },
      facts: {
        docker: "No Docker",
        postgres: "No Postgres install",
        config: "No .env editing",
      },
    },
    prereqs: {
      summary: "New machine? Install git and Bun first",
      body: "Once per machine. You need git and Bun 1.3 or newer. Pick your system.",
      newTerminal: "Then open a new terminal, so git and bun are on your PATH.",
    },
    browser: {
      eyebrow: "In the browser",
      title: "The setup wizard does the rest",
      recommended: "Recommended",
      steps: {
        open: {
          title: "Open {{url}}",
          body: 'A fresh instance opens the setup wizard on its own. Click "Start setup".',
        },
        admin: {
          title: "Create your admin login",
          body: "Your email, your password. It replaces the built-in default. Security keys are already generated.",
        },
        ai: {
          title: "Connect your {{appName}} account",
          body: "Enter your {{appName}} email and password. Done.",
        },
        extras: {
          title: "Extras, when you need them",
          body: "Email, Stripe payments, S3 storage. All optional. Skip and come back later.",
        },
      },
      done: "Finish setup. Start chatting.",
    },
  },
  ai: {
    eyebrow: "Connect AI",
    title: "One sign-in. Every model.",
    intro: "Your instance runs the app. {{appName}} runs the models.",
    account: {
      badge: "Recommended",
      title: "Your {{appName}} account",
      body: "Sign in once in the setup wizard. Every chat runs on your instance, every model call runs on {{appName}} and bills your credits.",
      points: {
        models: {
          title: "{{modelCount}} models",
          body: "Mainstream, open and uncensored. Same lineup as {{appName}}.",
        },
        local: {
          title: "History stays local",
          body: "Threads are stored in your database. Only model calls go through {{appName}}. Thread sync is off unless you turn it on.",
        },
        sync: {
          title: "Your setup follows you",
          body: "Memories, documents, skills and favorites sync by default. One switch each.",
        },
        paid: {
          title: "Any purchase unlocks it",
          body: "A subscription or any credit pack. Up to three instances per account.",
        },
      },
      cta: "Create your {{appName}} account",
      pricing: "See plans",
    },
    claude: {
      title: "Claude Code on this machine",
      body: "Logged in with the claude CLI? The wizard detects it. Claude models run on your Claude subscription. Nothing to enter.",
    },
    keys: {
      title: "Your own provider keys",
      body: "No {{appName}} account. Paste a key in the same step and pay the provider directly.",
      providers: {
        openrouter: "OpenRouter",
        venice: "Venice AI",
        nanogpt: "NanoGPT",
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
      api: {
        title: "Your API, too",
        body: "Every module is a CLI command and an MCP tool on your instance. Script it or point your agent at it.",
      },
      filter: {
        title: "Your filtering level",
        body: "Mainstream, open or uncensored models. You decide per skill and per thread. No policy team in the loop.",
      },
      code: {
        title: "Open code, no lock-in",
        body: "Same codebase as {{appName}}, public on GitHub. Read it, change it, fork it.",
      },
    },
  },
  server: {
    eyebrow: "Going live",
    title: "Put it on a server.",
    intro:
      "Same clone and install. Then a production build instead of the dev server.",
    terminalTitle: "On your server",
    rows: {
      start: "First start: production build",
      update: "After pulling changes: zero-downtime update",
    },
    points: {
      proxy: "Point Caddy or nginx at port 3000 for HTTPS.",
      env: "Same setup wizard on first visit. Prefer env vars? Set them in your deployment and restart.",
      connect:
        "Connect your {{appName}} account from the server, exactly like on your laptop.",
      db: "Embedded Postgres (PGlite) by default. Point DATABASE_URL at your own Postgres for production.",
    },
  },
  developers: {
    title: "Want to build on it?",
    body: "Every module is plain TypeScript in the repo. Fork it, extend it, or write your own.",
    cta: "See how next-vibe works",
  },
  help: {
    title: "Stuck, or running it for a team?",
    description:
      "Setup help, team installs, custom integrations. A human reads every message.",
  },
};
