export const translations = {
  meta: {
    title: "Self-Host {{appName}}: Your Server, Every Model",
    description:
      "Run {{appName}} on your own machine. git clone, bun i, vibe dev. Sign in with your {{appName}} account and all {{modelCount}} models work. No provider keys.",
    category: "Self-Host",
    imageAlt: "Self-host {{appName}} on your own machine",
    keywords:
      "self-host, self-hosted AI chat, next-vibe, {{appName}}, open source, private AI, local AI, uncensored AI",
  },
  hero: {
    badge: "Free and open source",
    title: "Your server.",
    titleHighlight: "Every model.",
    subtitle:
      "Run {{appName}} on your own machine. Sign in with your {{appName}} account and all {{modelCount}} models work. No provider keys. Your chats never leave your database.",
    ctaStart: "Get it running",
    ctaGithub: "View on GitHub",
  },
  diagram: {
    link: "One sign-in",
    instance: {
      label: "Runs on your machine",
      title: "Your instance",
      points: {
        chats: "Chats, memories and documents in your own Postgres",
        files: "Uploads and generated media on your disk",
        tools: "Thea, cron jobs and every AI tool",
        admin: "Your admin login. Your rules.",
      },
    },
    account: {
      label: "Runs on {{appName}}",
      title: "Your account",
      points: {
        models: "{{modelCount}} models, mainstream to uncensored",
        credits: "Usage billed to your {{appName}} credits",
        keys: "Zero provider keys to manage",
        unlock: "Unlocks with any plan or credit pack",
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
        cd: "Step inside",
        install: "Install. Also puts vibe on your PATH.",
        dev: "Start. Database and seed data set up on their own.",
      },
      facts: {
        docker: "No Docker",
        postgres: "No Postgres install",
        config: "No .env editing",
      },
      troubleshoot: {
        notFound: {
          problem: "vibe: command not found?",
          fix: "Open a new terminal, or run",
        },
        port: {
          problem: "Port 3000 taken?",
          fix: "Use another port:",
        },
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
          body: "Enter your {{appName}} email and password. Every model unlocks with any plan or credit pack. No keys.",
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
          title: "Chats stay local",
          body: "Threads live in your database. They never sync unless you turn it on.",
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
      bill: {
        title: "Your bill, your call",
        body: "Model spend goes to your {{appName}} credits or straight to your own provider. You pick.",
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
  server: {
    eyebrow: "Going live",
    title: "Put it on a server.",
    intro:
      "Same repo, same three commands. Then a production build instead of the dev server.",
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
