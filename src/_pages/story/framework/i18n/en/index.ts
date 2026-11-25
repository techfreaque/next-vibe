export const translations = {
  meta: {
    title: "Developers: next-vibe Framework, Uncensored AI API, MCP",
    description:
      "Write one endpoint, get a web UI, CLI command, MCP tool, AI tool and more. Open source. Clone, install, run. Plus one OpenAI and Anthropic compatible API for mainstream and uncensored models.",
    category: "Developers",
    imageAlt: "unbottled.ai for developers: API, MCP and self-hosting",
    keywords:
      "uncensored AI API, OpenAI compatible API, Anthropic compatible API, abliterated model API, UncensoredLM API, MCP server, self-hosted AI, next-vibe",
  },
  hero: {
    eyebrow: "For developers",
    title: "One definition.ts.",
    titleAccent: "Every surface.",
    subtitle:
      "next-vibe is the open-source TypeScript framework behind {{appName}}. Write one endpoint, get a web UI, CLI command, MCP tool, AI tool and more. Same validation, same types, no glue code.",
    ctaFramework: "See the pattern",
    ctaKeys: "Use the API",
    stats: {
      endpoints: "typed endpoints in the repo",
      surfaces: "surfaces from one definition",
      languages: "languages, every string translated",
      models: "chat models, one API key",
    },
  },
  paths: {
    api: {
      label: "Call the API",
      title: "Call {{modelCount}} models with one key",
      body: "Your OpenAI or Anthropic code, our base URL. Mainstream and uncensored models on one key.",
      link: "Quickstart",
    },
    selfHost: {
      label: "Self-host",
      title: "Run the whole platform",
      body: "Open source. Clone, install, run. The browser handles the rest.",
      link: "Install it",
    },
    framework: {
      label: "Build on it",
      title: "One definition, every surface",
      body: "Write an endpoint once. Get a web UI, CLI command, MCP tool, AI tool and more.",
      link: "See the pattern",
    },
  },
  quickstart: {
    eyebrow: "Quickstart",
    title: "First response in three steps.",
    intro:
      "The API speaks OpenAI Chat Completions and Responses, and Anthropic Messages. Your code runs here after three changes: the base URL, the key and a model id from `GET /v1/models`.",
    step1: {
      title: "Unlock the API and create a key",
      description:
        "Any plan from {{subPrice}} a month unlocks it. Then open API keys, name a key and copy it. You see it once.",
      ctaPlans: "See plans",
      ctaKeys: "Open API keys",
    },
    step2: {
      title: "Point your client at us",
      description:
        "OpenAI clients take the first URL. Claude Code and Anthropic SDKs take the second.",
      baseUrl: "OpenAI base URL",
      baseUrlNote:
        "Any locale works in the path. It only changes the language of error messages.",
      anthropicBaseUrl: "Anthropic base URL",
      anthropicNote:
        "No `/v1` at the end: Anthropic clients append `/v1/messages` themselves.",
    },
    step3: {
      title: "Send a request",
      description:
        "Put your key in and run it. `{{model}}` is one model id. `GET /v1/models` lists every id your key can call.",
      response: "Example response",
    },
    agents: {
      title: "Coding agents work out of the box",
      body: "Tested setups, copy and paste:",
      link: "Coding agent setups",
    },
    reference: "Full API reference",
  },
  pricing: {
    eyebrow: "Pricing",
    title: "A plan unlocks the API. You pay per call, in credits.",
    intro:
      "Same rates as the chat app. No API surcharge, no seat fees, one balance.",
    unlockTitle: "Unlocks the API",
    unlockPlan: "Any plan, from {{subPrice}} a month",
    unlockGrant: "Credits granted by our team, such as tester credits",
    neverTitle: "Never unlocks it",
    never:
      "The free tier: monthly allowance, signup and newsletter bonuses, referral earnings. Without a plan or granted credits, every `/v1` call answers 402 `paid_plan_required`.",
    billTitle: "How a call is billed",
    bill: "Provider cost plus our markup, in credits. `GET /v1/models` lists each model's credits per million input and output tokens. Every response reports `usage.credits_charged`; streams do with `stream_options.include_usage`.",
    topup:
      "Need more? Subscribers top up with credit packs from {{packPrice}}. Pack credits never expire.",
    facts: {
      credit: "1 credit = 1 US cent",
      rate: "{{rate}} requests per minute per key",
      keys: "Up to {{maxKeys}} keys per account",
      preflight: "Short on credits: 402 before anything runs",
    },
    modelsTitle: "Every price comes from the API itself",
    modelsResponse: "Example response",
  },
  uncensored: {
    eyebrow: "Uncensored models",
    title: "Two kinds of uncensored. Both on the API.",
    intro:
      "Most uncensored AI is a mainstream model with the refusals cut or trained out. We run those, and one trained differently from the start. Pick per request with the model id.",
    abliterated: {
      label: "Abliterated and fine-tuned",
      title: "Mainstream models that stop dodging",
      body: "Refusals cut from the weights or trained out. Same knowledge, straight answers.",
    },
    worldview: {
      label: "Truly uncensored",
      title: "A model with its own worldview",
      body: "{{model}} is trained on books and documents banned from the mainstream internet, resulting in a model with contrary political opinions.",
    },
    more: "+{{count}} more",
    consent:
      "Confirm 18+ once on the API keys page. Until then uncensored models answer 403 `uncensored_consent_required`, and nothing is charged.",
    allModels: "All uncensored models",
    catalog: "Browse the model catalog",
  },
  mcp: {
    eyebrow: "MCP and CLI",
    title: "Your agent already knows your app.",
    intro:
      "`bun i` writes the MCP config for Claude Code, Cursor, VS Code, OpenCode and Codex. Open the repo in your agent and the tools are there.",
    points: {
      stdio: "MCP over stdio. No extra server, no port.",
      roles:
        "Same roles and validation as the web UI. Models reach only what your role allows.",
      connect:
        "Connect the install to your {{appName}} account and its agents run on our models.",
      help: "Every command documents itself: `vibe <command> --help`.",
    },
    configNote:
      "The `atlas` entry `bun i` writes, trimmed. The real file also has a `hermes` server and uses your clone's path.",
  },
  selfHost: {
    eyebrow: "Self-host",
    title: "Run all of it yourself.",
    intro:
      "The platform behind {{appName}} is open source. Clone, install, run. Then the browser takes over. No Docker, no config files.",
    terminal: "Terminal",
    db: "Embedded Postgres (PGlite) by default. Point `DATABASE_URL` at your own Postgres when you outgrow it.",
    guide: "Self-hosting guide",
    github: "Code on GitHub",
  },
  framework: {
    eyebrow: "The framework",
    title: "Follow one endpoint.",
    intro:
      "The contact form from this repo, trimmed but real. One definition becomes a web UI, CLI command, MCP tool, native screen, AI tool and cron job. The live form sits at the bottom of this page.",
    tabAdd: "Add yours",
    call: {
      title: "Call it",
      cli: "CLI",
      mcp: "MCP",
      ai: "AI tool",
      cron: "Cron",
    },
    becomes: "The contact form becomes",
    more: "Plus {{count}} more surfaces",
    source: "Full source on GitHub",
    live: "Try it live below",
    docs: "Pattern docs on GitHub",
    deleteLine:
      "A feature is a folder. Delete it, run `vibe gen`, and it disappears from every surface at once.",
    moreSurfaces: {
      webApi: "REST API",
      websocket: "WebSocket events",
      adminPanel: "Admin panel",
      vibeFrame: "Embeddable widget",
    },
    surfaces: {
      web: {
        title: "Web UI",
        body: "The form at the bottom of this page. Fields, validation and the success alert come from the definition.",
      },
      cli: {
        title: "CLI command",
        body: "`vibe contact-form`, one flag per field, help text built in.",
      },
      mcp: {
        title: "MCP tool",
        body: "Agents reach it over `vibe mcp` through the `execute-tool` tool. Input schema straight from Zod.",
      },
      ai: {
        title: "AI tool",
        body: "Models can call it. `requiresConfirmation` makes the user approve first.",
      },
      native: {
        title: "Native screen",
        body: "The Expo app renders the same widget with native inputs. Beta.",
      },
      cron: {
        title: "Cron job",
        body: "Any endpoint runs on a schedule. Same handler, no second code path.",
      },
    },
    maturity: {
      stable: {
        title: "In production",
        body: "{{appName}} runs on this codebase: web, CLI, MCP, AI tools, cron, realtime, payments.",
      },
      beta: {
        title: "Beta",
        body: "React Native screens, instance-to-instance sync and remote skills work, with rough edges.",
      },
      churn: {
        title: "Expect churn",
        body: "One team, moving fast. No semver yet, and the docs trail the code. Pin a commit or fork it.",
      },
    },
  },
  faq: {
    title: "Questions developers ask",
    free: {
      q: "Is there a free API tier?",
      a: "No. The API unlocks with any plan, from {{subPrice}} a month, or with credits granted by our team. The free chat allowance does not unlock it.",
    },
    sdks: {
      q: "Which SDKs and tools work?",
      a: "The official OpenAI and Anthropic SDKs, any OpenAI-compatible library, and coding agents like Claude Code, Codex CLI, OpenCode, Aider, Cline and Continue. Change the base URL and the key.",
    },
    price: {
      q: "How is a call priced?",
      a: "In credits. One credit is one US cent. Each model has a credit rate per million input and output tokens, listed in `GET /v1/models`. Every response reports `usage.credits_charged` (streams with `stream_options.include_usage`), so you always know what a call cost.",
    },
    uncensored: {
      q: "Can I call uncensored models over the API?",
      a: "Yes. Confirm once on the API keys page that you are 18 or older, then call them like any other model. Abliterated models and UncensoredLM use the same endpoints.",
    },
    media: {
      q: "Images, voice, video and music too?",
      a: "Same key. `/v1/images`, `/v1/audio`, `/v1/videos` and `/v1/music` follow the OpenAI shapes where one exists. The API reference covers every endpoint.",
    },
    limits: {
      q: "What are the rate limits?",
      a: "{{rate}} requests per minute per key by default. Over the limit you get HTTP 429 with a `Retry-After` header. Need more throughput? Use the contact form below.",
    },
    selfHost: {
      q: "Is self-hosting free?",
      a: "Yes. The code is open source: MIT for the app, GPL v3 for the framework. Bring your own provider keys, or connect the install to your {{appName}} account and pay for what you use.",
    },
    docker: {
      q: "Do I need Docker or a database server?",
      a: "No. The default database is embedded Postgres (PGlite). Switch to full Postgres later by changing `DATABASE_URL`.",
    },
  },
  contact: {
    eyebrow: "The endpoint, live",
    title: "Questions, or building something big?",
    description:
      "Setup, custom integrations, architecture review. The team that built it answers. This form is the contact endpoint from the framework section.",
  },
  code: {
    copy: "Copy",
    copied: "Copied",
    wrap: "Wrap lines",
    anthropic: "Anthropic",
  },
};
