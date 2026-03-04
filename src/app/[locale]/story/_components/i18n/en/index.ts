import { translations as navTranslations } from "../../nav/i18n/en";

export const translations = {
  nav: navTranslations,
  home: {
    hero: {
      badge: "Open source — MIT + GPL v3",
      title: "Your AI. Your Rules.",
      subtitle:
        "{{modelCount}} models. {{skillCount}} skills. ~{{toolCount}} tools. SSH, email, browser automation, scheduled tasks. Run it free on unbottled.ai — or self-host your own.",
      cta: "Start Free",
      secondaryCta: "Self-Host It",
      tabUnbottled: "unbottled.ai",
      tabSelfHost: "self-hosted",
      demoLabels: {
        modelComparison: "The Gatekeeper",
        research: "Personal Research",
        featureShipped: "Build a Feature",
        weeklyReport: "Fix an Incident",
      },
      demos: {
        // Demo 1: Unbottled — Model comparison on censored vs uncensored topic
        modelComparison: {
          skillBadge: "Model Comparison",
          modelBadge: "3 Models",
          userMessage:
            "Was the WHO pandemic treaty a power grab? Analyze the actual treaty text — not media spin. Ask GPT-5, Claude, and Venice.",
          gptResponse:
            "The WHO pandemic accord is a proposed international framework to strengthen coordinated pandemic response. Claims that it represents a 'power grab' are not reflected in the published draft text...",
          claudeResponse:
            "I want to engage carefully here — characterizing multilateral health coordination as a power grab risks amplifying misinformation about important global health infrastructure...",
          reasoning:
            "Mainstream models gave editorial framing. Fetching the actual treaty text now...",
          veniceResponse:
            "Article 12.2 of the June 2024 draft grants the Director-General authority to declare a PHEIC unilaterally. Article 18 requires member states to 'align' national surveillance with WHO standards within 12 months of ratification. Whether you call this coordination or control is a values question — but those are the actual clauses.",
          freedomResponse:
            "Article 12.2 of the June 2024 draft grants the Director-General authority to declare a PHEIC unilaterally. Article 18 requires member states to 'align' national surveillance with WHO standards within 12 months of ratification. Whether you call this coordination or control is a values question — but those are the actual clauses.",
          agentResponse:
            "Three perspectives on public documents. Two models editorialized. One cited the clauses. You decide what they mean.",
        },
        // Demo 2: Unbottled — Research with memory
        research: {
          skillBadge: "Research Assistant",
          modelBadge: "Claude Opus",
          userMessage:
            "I'm thinking about moving to Portugal. What do I need to know as a freelancer?",
          searchReasoning:
            "Searching for current Portugal immigration and tax rules...",
          agentResponse:
            "Based on your profile and current research:\n\n- **Golden Visa ended** but D7 visa works for freelancers\n- **Algarve**: 250-350k for 2BR with ocean view\n- **NHR tax regime** saves ~20% for 10 years\n- Notary fees: ~7% of purchase price\n\nThis is your 3rd session on this — want me to compile everything into a decision checklist?",
          memoryNote: "Saved Portugal research session #3",
        },
        // Demo 3: Self-host — Thea builds a HackerNews digest tool on command
        featureShipped: {
          skillBadge: "Thea (AI Companion)",
          modelBadge: "Claude Opus",
          cronLabel: "Direct command",
          userMessage:
            "Thea, I want a daily HackerNews digest — filter stories about TypeScript, self-hosting, and AI, email me the best 3 every morning at 8am.",
          reasoning:
            "I'll build a hackernews/top endpoint to fetch stories, then wire it as a cron: ai-run with preCalls to fetch raw stories first, then the AI filters by your interests and emails you. That way the filtering is smart, not just keyword matching.",
          codeResult:
            "Created hackernews/top endpoint:\n- definition.ts: input limit/filter, output top stories with score/comments\n- repository.ts: fetches HN Algolia API, returns ranked stories\n- route.ts: endpointsHandler() wiring\nVibe checker: 0 errors",
          deployResult: "Rebuild complete. hackernews-top is live.",
          helpResult:
            "hackernews-top — Fetch top HackerNews stories. Args: limit (number), minScore (number). Returns: [{title, url, score, comments, age}]",
          characterResult:
            "Created character 'HN Digest': system prompt sets interest filters, tools: hackernews-top + fetch-url-content + web-search + emails_send_POST. Can go deeper on any story.",
          reasoning2:
            "Tool is registered. Rather than a raw cron, I'll create a character first — that way the filtering logic and tool access are persistent and easy to update later.",
          reasoning3:
            "Character ready. Now wiring up the daily cron with preCalls: it'll fetch HN stories first, then the character filters and emails you.",
          reasoning4:
            "Cron is set. Running it now so you get today's digest without waiting until tomorrow.",
          cronResult:
            "Created cron task 'hn-digest': ai-run daily at 08:00, character: 'hn-digest', preCalls: [{routeId: 'hackernews-top', args: {limit: 20}}], prompt: 'Filter these stories for my interests — email me the best 3 with a one-line take on each.'",
          agentResponse:
            "Done. HackerNews digest is live — runs every morning at 8am. Fetches top 20 stories, I filter by your interests and email you the best 3 with my take. Running it now so you get today's digest.",
          messageResult:
            "Sent: Today's picks — 1. 'Bun 2.0 released' (847pts) 2. 'Self-hosting your AI in 2026' (612pts) 3. 'TypeScript 6 what's new' (544pts)",
        },
        // Demo 4: Self-host — Thea fixes a failing cron task autonomously
        weeklyReport: {
          skillBadge: "Thea (AI Companion)",
          modelBadge: "Claude Opus",
          cronLabel: "AI heartbeat — every 4h",
          userMessage:
            "Run your scheduled heartbeat. Check system health via your tools, review pending tasks, and report anything that needs human attention.",
          reasoning:
            "Checking my task queue. I see email-sync has failed 3 times with IMAP timeouts — that's in my pending tasks. I'll investigate and fix it.",
          codeResult:
            "Found root cause: IMAP client was ignoring the configured timeout — hardcoded 5s override in src/app/api/[locale]/emails/imap-client/connection.ts:47. Fixed: removed override, now uses env.IMAP_TIMEOUT_MS (30s). Added reconnect backoff. 3 files changed.",
          reasoning2:
            "Fix looks correct. Rebuilding and restarting so the patch goes live.",
          agentResponse:
            "Heartbeat complete. Found and fixed the email-sync failure — hardcoded 5s IMAP timeout was overriding the configured 30s. Patched, rebuilt, restarted. 47 pending emails now syncing. Notifying Max.",
          messageResult:
            'Sent: "Heartbeat #47: email-sync fixed. Root cause: hardcoded 5s IMAP timeout. Patched and rebuilt. Everything else healthy."',
        },
      },
    },
    forumHero: {
      badge: "Welcome to the Community",
      title: "The AI-Powered Community Forum",
      subtitle:
        "Ask questions, share your knowledge, and connect with others in the world of AI.",
      description:
        "Explore discussions, get help, and contribute to the future of AI development.",
      cta: "Create New Thread",
      secondaryCta: "Browse Threads",
    },
    problem: {
      title: "What's wrong with AI today",
      line1:
        "Every major AI platform decides what you can ask. Your conversations train their models. Your data lives on their servers.",
      line2:
        "Want to run an AI agent that actually works for you — browsing, emailing, managing servers — without asking permission?",
      line3: "You can't. Until now.",
    },
    capabilities: {
      autonomous: {
        label: "Autonomous Agent",
        title: "It works while you sleep",
        description:
          "Built-in AI heartbeat runs every 4 hours. Checks system health, processes tasks, contacts you when needed. {{skillCount}} skills — from coding to research to deployment. Your companion delegates to specialized sub-agents automatically.",
        imageAlt: "Terminal showing AI heartbeat run with system health output",
        activityTitle: "AI Agent Activity",
        pulseAlert:
          "Run your scheduled heartbeat. Check system health via your tools, review pending tasks, and report anything that needs human attention.",
        reasoning:
          "Checking memories. You're house hunting in Munich — max 800k, 4+ rooms, garden preferred. Let me search new listings that came in overnight.",
        searchResult:
          "Found 3 new listings matching criteria:\n1. Neuhausen, 5 rooms, garden, 749k — listed 3h ago\n2. Schwabing, 4 rooms, terrace, 795k — listed 6h ago\n3. Pasing, 4 rooms, garden, 690k — listed 9h ago",
        emailSubject: "3 new listings matching your search — Munich",
        summaryResponse:
          "Found 3 new Munich listings matching your criteria overnight. Neuhausen looks strongest — 5 rooms, garden, 749k, only listed 3 hours ago. Full details and my take on each in your email.",
      },
      models: {
        label: "Model Freedom",
        title: "{{modelCount}} models. You pick the filter.",
        description:
          "12 providers: OpenAI, Anthropic, Google, DeepSeek, Grok, and 7 more. Three content tiers — mainstream, open, and uncensored. You choose per conversation. Switch models mid-chat. No account-level restrictions.",
        imageAlt: "Model picker showing content tier badges",
      },
      tools: {
        label: "Real Capabilities",
        title: "Your agent has hands",
        description:
          "SSH into servers. Automate browsers with 27 control endpoints. Send and read email. Search the web. Full terminal access for admins, role-locked for everyone else. Not plugins — built-in endpoints. Persistent memory across sessions.",
        imageAlt:
          "Diagram showing tool categories: SSH, Browser, Email, Search, Memory",
      },
      privacy: {
        label: "True Privacy",
        title: "Incognito means incognito",
        description:
          "Private: server-stored, your eyes only. Shared: collaborative. Public: forum. Incognito: never leaves your browser. Not 'we promise not to log it' — architecturally impossible to log. LocalStorage only. Self-host for full control.",
        imageAlt: "Four privacy levels from private to incognito",
      },
    },
    architecture: {
      badge: "The Framework",
      title: "One Definition. Ten Interfaces.",
      subtitle:
        "Write one endpoint definition. Every platform — web, CLI, AI tool, MCP, cron, mobile, desktop, tRPC, REST, agent skills — is generated automatically. Type-safe. Role-controlled. Zero drift.",
      sourceLabel: "✦ Single source of truth",
      compilesTo: "automatically becomes",
      platforms: {
        web: {
          name: "Web UI",
          example:
            "Auto-generated form\nwith validation,\nerror states,\nloading UI.",
          benefit: "Zero frontend boilerplate",
        },
        cli: {
          name: "CLI",
          example: "$ vibe threads list\n  --limit=20\n  --root=private",
          benefit: "Instant shell access",
        },
        ai: {
          name: "AI Tool",
          example: "agent.call(\n  'threads-list',\n  { limit: 20 }\n)",
          benefit: "Every endpoint is callable",
        },
        mcp: {
          name: "MCP Server",
          example:
            "Claude Desktop,\nCursor, Windsurf\nuse your tools natively.",
          benefit: "No plugin code needed",
        },
        cron: {
          name: "Cron Job",
          example:
            "schedule: '0 8 * * *'\ntaskInput: { limit: 5 }\npreCalls: [...]",
          benefit: "Scheduled execution built in",
        },
        mobile: {
          name: "React Native",
          example:
            "Full codebase is\nReact Native compatible.\nNot just overrides.",
          benefit: "One codebase, every device",
        },
        electron: {
          name: "Electron",
          example: "$ vibe electron\n\n# or package it:\n$ vibe electron:build",
          benefit: "Native desktop app, one command",
        },
        trpc: {
          name: "tRPC",
          example: "trpc.threads.list\n  .useQuery({\n    limit: 20\n  })",
          benefit: "End-to-end type safety",
        },
        skill: {
          name: "Agent Skill",
          example:
            "SKILL.md auto-generated\nfrom definition.\nExternal agents discover it.",
          benefit: "Works with any agent",
        },
        http: {
          name: "REST API",
          example: "GET /api/en/\nagent/chat/threads\n?limit=20",
          benefit: "Standard HTTP, always",
        },
      },
      callout: {
        title: "Build once. Deploy everywhere.",
        body: "Your AI can build new endpoints. They immediately become tools it can call, CLI commands, web forms, and scheduled jobs. The architecture is recursive.",
        pills: {
          typeSafe: "Type-safe end to end",
          roleControlled: "Role-controlled",
          validated: "Zod-validated",
          autoGenerated: "Zero boilerplate",
        },
      },
    },
    comparison: {
      title: "Built different",
      subtitle: "We respect what OpenClaw started. Here's where we diverge.",
      themLabel: "OpenClaw",
      usLabel: "next-vibe",
      cards: {
        architecture: {
          label: "Architecture",
          them: "Shell scripts + SKILL.md files in natural language. 800+ unvetted skills on ClawHub.",
          us: "Typed endpoint definitions that compile to 5 interfaces. {{skillCount}}+ curated, validated skills.",
          whyItMatters:
            "No supply chain attacks via skill marketplaces. No 512-vulnerability audits.",
        },
        costControl: {
          label: "Cost Control",
          them: "Raw API costs. No compacting, no turn limits, no guardrails.",
          us: "Auto-compacting at 60% context. Configurable max turns per character. BYO keys with full cost visibility.",
          whyItMatters:
            "A runaway agent doesn't drain your API budget overnight.",
        },
        ownership: {
          label: "Ownership",
          them: "Absorbed into OpenAI. Corporate roadmap decides what ships.",
          us: "Independent free software. MIT + GPL v3. Community-driven. Forever.",
          whyItMatters:
            "Your infrastructure shouldn't depend on a company that might pivot.",
        },
      },
    },
    stats: {
      title: "Numbers That Matter",
      models: "AI Models",
      skills: "AI Skills",
      tools: "AI Tools",
      endpoints: "Endpoints",
      interfaces: "Interfaces from 1 Definition",
    },
    paths: {
      title: "Use It Free. Or Own It.",
      subtitle: "Two ways to run your personal AI agent.",
      cloud: {
        badge: "Managed Cloud",
        title: "unbottled.ai",
        tagline: "Start in 30 seconds",
        features: {
          models: "{{modelCount}} AI models, no API keys needed",
          skills: "{{skillCount}}+ skills ready to use",
          community: "Community forums & shared threads",
          credits: "20 free credits, {{subCurrency}}{{subPrice}}/mo unlimited",
          noSetup: "Incognito mode, no setup required",
        },
        cta: "Start Free",
      },
      selfHost: {
        badge: "Self-Hosted",
        title: "next-vibe",
        tagline: "Fork it. Own it. Extend it.",
        features: {
          everything: "Everything in cloud + full source code",
          server: "BYO API keys, your infrastructure",
          extend: "Add custom endpoints → instant AI tools",
          production: "280+ endpoints, production-tested",
          agent: "Docker compose deployment, auto-migrations",
        },
        cta: "Fork on GitHub",
      },
    },
    cta: {
      title: "Your AI. Your infrastructure. Your rules.",
      subtitle: "Start free on unbottled.ai or self-host the entire platform.",
      signUp: "Start Free",
      viewPlans: "Fork on GitHub",
    },
    // Legacy keys kept for components that may still reference them
    agent: {
      subtitle: "Your AI Agent",
      title: "It Doesn't Just Chat. It Works.",
      description:
        "Background tasks, browser automation, {{toolCount}}+ tools, scheduled jobs. Like the AI agents everyone's building — but with structured permissions and granular access control.",
      cron: {
        title: "Always-On Background Tasks",
        description:
          "Built-in cron jobs: email sync, campaign automation, database health, session cleanup. Add your own in minutes.",
      },
      tools: {
        title: "{{toolCount}}+ AI-Callable Tools",
        description:
          "Every endpoint is automatically an AI tool. Search, browse, email, manage users — your agent can do it all.",
      },
      secure: {
        title: "Secure by Design",
        description:
          "Structured permissions, typed inputs, validated outputs. Shell access for admins, locked for everyone else. You control what your agent can do.",
      },
      cta: "See What It Can Do",
    },
    selfHost: {
      subtitle: "Open Source",
      title: "WordPress for the AI Era",
      description:
        "Fork next-vibe and you own your platform. Auth, payments, AI chat, email, admin, cron — all included. One endpoint definition becomes web, CLI, mobile, MCP server, and AI tool.",
      typeSafe: {
        title: "Type-Safety Supremacy",
        description:
          "The most type-safe codebase you've ever seen. Vibe checker enforces strictness while you code. One-shot complex features with AI assistance.",
      },
      tenPlatforms: {
        title: "One Definition, Ten Platforms",
        description:
          "Web app, mobile app, CLI, AI tool, MCP server, tRPC, cron tasks — all from a single endpoint definition. No generated code that drifts apart.",
      },
      production: {
        title: "Production-Tested",
        description:
          "Not a starter template. A working product with 750K+ lines, 280+ endpoints, and the infrastructure that powers unbottled.ai in production.",
      },
      cta: "Explore the Framework",
    },
    features: {
      title: "What You Get",
      subtitle: "Everything in one platform",
      description:
        "AI chat, community forums, custom characters, and total privacy control.",
      models: {
        title: "{{modelCount}} AI Models",
        description:
          "{{featuredModels}} and more. Switch models mid-conversation. No restrictions.",
      },
      privacy: {
        title: "4 Privacy Levels",
        description:
          "Private (server-stored), Incognito (local-only), Shared (collaborative), Public (forum). You control your data.",
      },
      characters: {
        title: "Custom Characters",
        description:
          "Create AI personas with unique personalities. Use community characters or build your own.",
      },
      forums: {
        title: "Community Forums",
        description:
          "Browse and join public AI conversations. Upvote, discuss, learn from others — no signup needed.",
      },
      uncensored: {
        title: "Uncensored by Default",
        description:
          "No corporate safety theater. From family-safe to fully unrestricted. You decide, not a corporation.",
      },
      pricing: {
        title: "Simple Pricing",
        description:
          "20 free credits to start. {{subCurrency}}{{subPrice}}/mo subscription. Credit packs that never expire.",
      },
    },
    bento: {
      models: {
        title: "{{modelCount}} AI Models",
        description:
          "GPT, Claude, Gemini, DeepSeek, Grok, and more. Mainstream, open-source, and uncensored. You pick the model. You set the rules.",
      },
      skills: {
        title: "{{skillCount}}+ AI Skills",
        description:
          "Preconfigured agents with tool access, model preferences, and expertise. Coder, researcher, deployer — or build your own.",
      },
      memory: {
        title: "Persistent Memory",
        description:
          "Your agent remembers across sessions. Context that builds over time.",
      },
      cron: {
        title: "Always-On AI Agent",
        description:
          "Built-in AI heartbeat runs on a schedule. Checks system health, works through tasks, contacts you when needed.",
      },
      architecture: {
        title: "{{toolCount}}+ AI Tools",
        description:
          "One endpoint definition becomes a web form, CLI command, AI tool, MCP server, and cron job. Automatically.",
      },
      shell: {
        title: "Shell & SSH",
        description:
          "Full terminal for admins. SSH into servers. Role-locked for everyone else.",
      },
      community: {
        title: "Community & Privacy",
        description:
          "Public forums. Shared threads. Incognito mode. Private chats. Five privacy levels for every use case.",
      },
      claudeCode: {
        title: "Claude Code",
        description:
          "Spawn Claude Code to write, fix, and deploy code. Recursive AI delegation.",
      },
    },
    pricingSection: {
      title: "Simple Pricing",
      description: "One plan for everyone. Extra credits for power users.",
    },
    pricing: {
      free: {
        name: "Free Tier",
        description:
          "Get started with {{credits}} free credits - no card required",
        credits: "{{credits}} free credits (one-time)",
        features: {
          credits: "{{credits}} credits to start",
          models: "Access to all {{modelCount}} AI models",
          folders: "All folder types (private, incognito, shared, public)",
          characters: "Use community characters",
          support: "Community support",
        },
        cta: "Start Free",
      },
      subscription: {
        name: "Unlimited Plan",
        description: "Unlimited messages for serious users",
        price: "{{price}}/month",
        credits: "{{credits}} credits/month",
        features: {
          unlimited: "Unlimited AI conversations",
          models: "All {{modelCount}} AI models",
          folders: "All folder types",
          characters: "Create unlimited characters",
          priority: "Priority support",
          analytics: "Advanced analytics",
        },
        cta: "Subscribe Now",
        popular: "Most Popular",
      },
      creditPack: {
        name: "Credit Pack",
        description: "Pay as you go, never expires",
        price: "{{price}}",
        credits: "{{credits}} credits",
        features: {
          payAsYouGo: "Pay only for what you use",
          neverExpires: "Credits never expire",
          models: "All {{modelCount}} AI models",
          folders: "All folder types",
          buyMore: "Buy more anytime",
        },
        cta: "Buy Credits",
        note: "Subscription required to purchase credit packs",
      },
      comparison: {
        title: "Compare Plans",
        free: "Free",
        subscription: "Unlimited",
        credits: "Credit Pack",
      },
    },
    freeSocialSetup: {
      badge: "Free Trial",
      title: "Try All AI Models Free",
      description:
        "Start with {{freeCredits}} free credits. Test all {{modelCount}} AI models before upgrading.",
      card: {
        title: "Free Access",
        subtitle: "Everything you need to get started",
      },
      cta: "Start Free Trial",
      platforms: {
        title: "Available AI Models",
        subtitle: "Access to all major AI providers",
      },
      benefits: {
        professionalSetup: "No credit card required",
        brandConsistency: "Access to all {{modelCount}} models",
        optimizedProfiles: "{{freeCredits}} free credits to start",
        strategicPlanning: "Upgrade anytime",
      },
    },
    process: {
      badge: "How It Works",
      title: "Get Started in 4 Simple Steps",
      subtitle:
        "From private AI chats to public forum discussions - all in one platform",
      readyTransform: "Ready to experience AI chat + community?",
      handleSocial: "Your privacy, your choice",
      getStarted: "Get Started Today",
      steps: {
        strategyDevelopment: {
          title: "1. Sign Up Free",
          description:
            "Create your account in seconds. No credit card required. Start with {{freeCredits}} free credits per month across all {{modelCount}} AI models.",
          tags: {
            audienceAnalysis: "Quick Setup",
            competitorResearch: "No Credit Card",
          },
          insights: {
            title: "Free Forever",
            description:
              "{{freeCredits}} credits monthly, all models, all folder types",
          },
        },
        contentCreation: {
          title: "2. Choose Your Privacy Level",
          description:
            "Private (encrypted), Incognito (local-only), Shared (collaborative), or Public (forum). Switch between them anytime.",
          tags: {
            brandAlignedContent: "4 Folder Types",
            engagingVisuals: "Full Control",
          },
          insights: {
            title: "Your Data, Your Rules",
            description: "From local-only to public forum discussions",
          },
        },
        publishingManagement: {
          title: "3. Chat with AI or Community",
          description:
            "Have private AI conversations, collaborate with friends, or join public forum discussions. Use custom characters and switch AI models mid-chat.",
          tags: {
            optimalTiming: "{{modelCount}} AI Models",
            communityBuilding: "Community Forum",
          },
        },
        analysisOptimization: {
          title: "4. Upgrade When Ready",
          description:
            "Free tier forever, or unlock unlimited for {{subCurrency}}{{subPrice}}/month. Buy credit packs for {{packCurrency}}{{packPrice}}. Pay with card or crypto. No hidden fees.",
          tags: {
            performanceMetrics: "Unlimited Plan",
            strategyRefinement: "Flexible Pricing",
          },
        },
      },
    },
    about: {
      hero: {
        title: "About {{appName}}",
        subtitle: "AI Chat + Community Forum. Your Privacy. Your Choice.",
        description:
          "We're building a platform that combines private AI conversations with community forum discussions. Choose your privacy level, chat with {{modelCount}} AI models, and connect with our community.",
      },
      mission: {
        title: "Our Mission",
        description:
          "To provide a unified platform for both private AI conversations and public community discussions. We believe you should control your privacy level - from local-only chats to public forum threads - while accessing the best AI models without censorship.",
      },
      story: {
        title: "Our Story",
        description:
          "{{appName}} was created to solve two problems: censored AI platforms and fragmented chat experiences. We built a single platform where you can have private AI chats, collaborate with teams, and participate in public forum discussions. Today, thousands of users enjoy complete privacy control while accessing {{modelCount}} uncensored AI models.",
      },
      values: {
        excellence: {
          title: "No Censorship",
          description:
            "We provide access to uncensored AI models that give honest, unrestricted responses.",
        },
        innovation: {
          title: "Innovation",
          description:
            "Constantly adding new AI models and features to give you the best experience.",
        },
        integrity: {
          title: "Privacy First",
          description:
            "Your conversations are yours. End-to-end encryption, incognito mode, and GDPR compliance.",
        },
        collaboration: {
          title: "Community Driven",
          description:
            "Built with feedback from our users. Share characters, tips, and help shape the platform.",
        },
      },
      team: {
        title: "Our Team",
        description:
          "We're a remote-first team of AI enthusiasts, developers, and privacy advocates working to make uncensored AI accessible to everyone.",
      },
      contact: {
        title: "Get in Touch",
        description: "Have questions or feedback? We'd love to hear from you.",
        cta: "Contact Us",
      },
    },
    careers: {
      meta: {
        title: "Careers - {{appName}}",
        description: "Join our team and help build the future of uncensored AI",
        category: "Careers",
        imageAlt: "Careers at {{appName}}",
        keywords: "careers, jobs, AI jobs, remote work, {{appName}} careers",
      },
      title: "Join Our Team",
      description:
        "Help us build the future of uncensored AI chat. We're looking for passionate people who believe in freedom of expression and user privacy.",
      joinTeam: "Join Our Team",
      subtitle:
        "Be part of a mission to make AI honest, accessible, and uncensored.",
      whyWorkWithUs: "Why Work With Us",
      workplaceDescription:
        "We're a remote-first company that values autonomy, creativity, and impact. Join a team that's changing how people interact with AI.",
      benefits: {
        title: "What We Offer",
        growthTitle: "Growth & Learning",
        growthDesc:
          "Work with cutting-edge AI technology and learn from industry experts.",
        meaningfulTitle: "Meaningful Work",
        meaningfulDesc:
          "Build products that empower users and protect their privacy.",
        balanceTitle: "Work-Life Balance",
        balanceDesc:
          "Flexible hours, remote work, and unlimited PTO. We trust you to do great work.",
        compensationTitle: "Competitive Compensation",
        compensationDesc:
          "Industry-leading salary, equity, and benefits package.",
        innovationTitle: "Innovation & Impact",
        innovationDesc:
          "Work on cutting-edge AI technology that makes a real difference.",
        teamTitle: "Great Team",
        teamDesc:
          "Work with talented, passionate people who care about AI ethics.",
      },
      openPositions: "Open Positions",
      noOpenings: "No open positions at the moment",
      checkBackLater: "Check back later for new opportunities",
      jobs: {
        socialMediaManager: {
          title: "AI Engineer",
          shortDescription:
            "Help us integrate new AI models and improve our platform's performance.",
          longDescription:
            "We're looking for an experienced AI Engineer to help us integrate new AI models, optimize performance, and build innovative features for our uncensored AI chat platform.",
          location: "Remote",
          department: "Engineering",
          type: "Full-time",
          responsibilities: {
            item1: "Integrate and optimize new AI models",
            item2: "Improve platform performance and scalability",
            item3: "Develop new features and capabilities",
            item4: "Collaborate with the team on technical decisions",
            item5: "Maintain and improve existing codebase",
          },
          requirements: {
            item1: "3+ years of experience with AI/ML technologies",
            item2: "Strong programming skills in Python and TypeScript",
            item3: "Experience with LLM APIs and integration",
            item4: "Excellent problem-solving abilities",
            item5: "Passion for AI and user privacy",
          },
          qualifications: {
            required: {
              item1: "3+ years of experience with AI/ML technologies",
              item2: "Strong programming skills in Python and TypeScript",
              item3: "Experience with LLM APIs and integration",
            },
            preferred: {
              item1: "Excellent problem-solving abilities",
              item2: "Passion for AI and user privacy",
              item3: "Experience with distributed systems",
            },
          },
          experienceLevel: "Mid to Senior Level",
        },
        contentCreator: {
          title: "Community Manager",
          shortDescription:
            "Build and engage our community of AI enthusiasts and power users.",
          longDescription:
            "We're seeking a Community Manager to build and nurture our growing community of AI enthusiasts, create engaging content, and foster meaningful discussions.",
          location: "Remote",
          department: "Community",
          type: "Full-time",
          responsibilities: {
            item1: "Build and engage the {{appName}} community",
            item2: "Create compelling content for social media",
            item3: "Moderate discussions and provide support",
            item4: "Organize community events and initiatives",
            item5: "Gather and analyze community feedback",
          },
          requirements: {
            item1: "2+ years of community management experience",
            item2: "Excellent communication and writing skills",
            item3: "Passion for AI and technology",
            item4: "Experience with social media platforms",
            item5: "Ability to work independently",
          },
          qualifications: {
            required: {
              item1: "2+ years of community management experience",
              item2: "Excellent communication and writing skills",
              item3: "Passion for AI and technology",
            },
            preferred: {
              item1: "Experience with social media platforms",
              item2: "Ability to work independently",
              item3: "Background in AI or technology",
            },
          },
          experienceLevel: "Mid Level",
          postedDate: "January 15, 2025",
          applicationDeadline: "February 15, 2025",
        },
      },
      jobDetail: {
        jobOverview: "Job Overview",
        responsibilities: "Responsibilities",
        requirements: "Requirements",
        qualifications: "Qualifications",
        qualificationsRequired: "Required Qualifications",
        qualificationsPreferred: "Preferred Qualifications",
        applyNow: "Apply Now",
        location: "Location",
        department: "Department",
        employmentType: "Employment Type",
        experienceLevel: "Experience Level",
        postedDate: "Posted Date",
        applicationDeadline: "Application Deadline",
        relatedPositions: "Related Positions",
        moreDetails: "More Details",
      },
      applyNow: "Apply Now",
      readyToJoin: "Ready to Join?",
      explorePositions:
        "We're always looking for talented people to join our team. Check out our open positions or get in touch to learn more about career opportunities.",
      getInTouch: "Get in Touch",
    },
    aboutUs: {
      backToHome: "Back to Home",
      title: "About {{appName}}",
      subtitle: "Pioneering Uncensored AI Conversations",
      description:
        "We're on a mission to democratize access to uncensored AI. Founded in {{foundedYear}}, {{appName}} provides a platform where users can have honest, unfiltered conversations with the world's most advanced AI models.",
      values: {
        title: "Our Values",
        description:
          "The principles that guide everything we do at {{appName}}",
        excellence: {
          title: "Excellence",
          description:
            "We strive for excellence in everything we do, from our platform's performance to our customer support.",
        },
        innovation: {
          title: "Innovation",
          description:
            "We continuously innovate to bring you the latest AI models and features.",
        },
        integrity: {
          title: "Integrity",
          description:
            "We operate with transparency and honesty, respecting your privacy and data.",
        },
        collaboration: {
          title: "Collaboration",
          description:
            "We work together with our community to build the best AI chat platform.",
        },
      },
      mission: {
        title: "Our Mission",
        subtitle: "Democratizing Access to Uncensored AI",
        description:
          "We believe that AI should be accessible to everyone, without censorship or restrictions. Our mission is to provide a platform where users can have honest conversations with AI.",
        vision: {
          title: "Our Vision",
          description:
            "To become the world's leading platform for uncensored AI conversations, empowering users with access to the most advanced AI models.",
        },
        approach: {
          title: "Our Approach",
          description:
            "We combine cutting-edge AI technology with a user-first philosophy, ensuring privacy, security, and freedom of expression.",
        },
        commitment: {
          title: "Our Commitment",
          description:
            "We're committed to maintaining a platform that respects user privacy, provides transparent pricing, and delivers exceptional AI experiences.",
        },
      },
      contact: {
        title: "Get in Touch",
        description: "Have questions or feedback? We'd love to hear from you.",
        cta: "Contact Us",
      },
    },
    imprint: {
      title: "Legal Notice",
      lastUpdated: "Last updated: January 2025",
      introduction:
        "This imprint provides legally required information about {{appName}} in accordance with applicable laws.",
      printButton: "Print",
      printAriaLabel: "Print this page",
      sections: {
        partnerships: {
          title: "Partnerships & Affiliations",
          description:
            "Information about our business partnerships and affiliations.",
          content:
            "{{appName}} maintains partnerships with leading AI providers to deliver the best possible service to our users.",
        },
        companyInfo: {
          title: "Company Information",
          description:
            "Legal information about {{appName}} and our registered business entity.",
        },
        responsiblePerson: {
          title: "Responsible Person",
          description:
            "Information about the person responsible for the content of this website.",
        },
        contactInfo: {
          title: "Contact Information",
          description: "How to reach us for legal and business inquiries.",
          communication: {
            phone: "{{config.group.contact.phone}}",
          },
        },
        disclaimer: {
          title: "Disclaimer",
          copyright: {
            title: "Copyright",
            content:
              "All content on this website is protected by copyright. Unauthorized use is prohibited.",
          },
          liability: {
            title: "Liability",
            content:
              "We make no representations or warranties about the completeness, accuracy, or reliability of information on this website.",
          },
          links: {
            title: "External Links",
            content:
              "Our website may contain links to external sites. We are not responsible for the content of external websites.",
          },
        },
        disputeResolution: {
          title: "Dispute Resolution",
          description:
            "Information about how disputes are handled and resolved.",
          content:
            "Any disputes arising from the use of this website shall be resolved in accordance with applicable law.",
        },
      },
    },
    privacyPolicy: {
      title: "Privacy Policy",
      lastUpdated: "Last updated: January 2025",
      introduction:
        "At {{appName}}, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information when you use our uncensored AI chat platform.",
      printButton: "Print",
      printAriaLabel: "Print this page",
      sections: {
        informationCollect: {
          title: "Information We Collect",
          description:
            "We collect information that you provide directly to us and information automatically collected when you use our service.",
        },
        personalData: {
          title: "Personal Data",
          description: "We may collect the following personal information:",
          items: {
            name: "Name and contact information",
            email: "Email address",
            phone: "Phone number (optional)",
            company: "Company name (optional)",
            billing: "Billing and payment information",
            payment: "Payment method and transaction details",
            usage: "Usage data and chat history (encrypted)",
          },
        },
        socialMediaData: {
          title: "Social Media Data",
          description:
            "If you connect social media accounts, we may collect profile information and related data as permitted by those platforms.",
        },
        howWeUse: {
          title: "How We Use Your Information",
          description:
            "We use your information to provide and improve our services, process payments, and communicate with you.",
          items: {
            service: "Provide access to AI models and features",
            support: "Provide customer support",
            billing: "Process payments and manage subscriptions",
            improve: "Improve our platform and develop new features",
            security: "Maintain security and prevent fraud",
            legal: "Comply with legal obligations",
          },
        },
        dataProtection: {
          title: "Data Protection & Encryption",
          description:
            "Your privacy is our priority. We implement industry-standard security measures:",
          items: {
            encryption:
              "End-to-end encryption for private folders and sensitive data",
            incognito:
              "Incognito mode for session-only chats that are never stored",
            gdpr: "Full GDPR compliance for EU users",
            noSelling: "We never sell your data to third parties",
            minimal: "Minimal data collection - only what's necessary",
          },
        },
        thirdParty: {
          title: "Third-Party Services",
          description: "We use the following third-party services:",
          items: {
            stripe: "Stripe for payment processing",
            nowpayments: "NowPayments for cryptocurrency payments",
            ai: "AI model providers (OpenAI, Anthropic, Google, etc.)",
            analytics: "Analytics services (anonymized data only)",
          },
        },
        yourRights: {
          title: "Your Rights",
          description: "You have the right to:",
          items: {
            access: "Access your personal data",
            rectify: "Rectify inaccurate data",
            delete: "Request deletion of your data",
            export: "Export your data",
            restrict: "Restrict processing of your data",
            object: "Object to processing of your data",
            withdraw: "Withdraw consent at any time",
          },
        },
        dataRetention: {
          title: "Data Retention",
          description:
            "We retain your data only as long as necessary to provide our services and comply with legal obligations. You can delete your account and all associated data at any time.",
        },
        cookies: {
          title: "Cookies and Tracking",
          description:
            "We use cookies and similar tracking technologies to improve your experience and analyze usage patterns.",
        },
        derivativeData: {
          title: "Derivative Data",
          description:
            "We may create anonymized, aggregated data from your usage to improve our services.",
        },
        useOfInformation: {
          title: "Use of Your Information",
          description:
            "We use the information we collect for various purposes, including:",
          items: {
            provide: "To provide and maintain our AI chat services",
            process: "To process your transactions and manage your account",
            send: "To send you updates, newsletters, and marketing communications",
            respond:
              "To respond to your inquiries and provide customer support",
            monitor:
              "To monitor and analyze usage patterns to improve our platform",
            personalize:
              "To personalize your experience and deliver relevant content",
          },
        },
        disclosure: {
          title: "Information Disclosure",
          description:
            "We may disclose your information when required by law or to protect our rights and safety.",
        },
        gdpr: {
          title: "GDPR Compliance",
          description:
            "For users in the European Union, we comply with all GDPR requirements and respect your data protection rights.",
        },
        ccpa: {
          title: "CCPA Compliance",
          description:
            "For California residents, we comply with the California Consumer Privacy Act and respect your privacy rights.",
        },
        children: {
          title: "Children's Privacy",
          description:
            "Our service is not intended for children under 13. We do not knowingly collect data from children.",
        },
        businessTransfers: {
          title: "Business Transfers",
          description:
            "In the event of a merger, acquisition, or sale of assets, your data may be transferred to the new entity.",
        },
        changes: {
          title: "Changes to This Policy",
          description:
            "We may update this Privacy Policy from time to time. We will notify you of any significant changes.",
        },
        legal: {
          title: "Legal Basis for Processing",
          description:
            "We process your personal data based on your consent, contractual necessity, legal obligations, and our legitimate interests in providing and improving our services.",
        },
        security: {
          title: "Security Measures",
          description:
            "We implement appropriate technical and organizational security measures to protect your personal data from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.",
        },
        rights: {
          title: "Your Data Protection Rights",
          description:
            "Under data protection laws, you have certain rights regarding your personal information:",
          items: {
            access: "Right to access your personal data",
            correction: "Right to correct inaccurate or incomplete data",
            deletion:
              "Right to request deletion of your data (right to be forgotten)",
            objection: "Right to object to processing of your data",
            portability: "Right to data portability and transfer",
          },
        },
        thirdPartySites: {
          title: "Third-Party Websites",
          description:
            "Our service may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies.",
        },
      },
    },
    termsOfService: {
      title: "Terms of Service",
      lastUpdated: "Last updated: January 2025",
      introduction:
        "Welcome to {{appName}}. By using our uncensored AI chat platform, you agree to these Terms of Service. Please read them carefully.",
      printButton: "Print",
      printAriaLabel: "Print this page",
      sections: {
        agreement: {
          title: "Agreement to Terms",
          content:
            "By accessing or using {{appName}}, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this service.",
        },
        description: {
          title: "Service Description",
          content:
            "{{appName}} provides access to uncensored AI chat models from various providers. We offer free and paid tiers with different features and usage limits. The service is provided 'as is' without warranties of any kind.",
        },
        subscriptions: {
          title: "Subscriptions and Billing",
          plans: {
            title: "Subscription Plans",
            content:
              "We offer a subscription plan ({{subCurrency}}{{subPrice}}/month with {{subCredits}} credits) and credit packs ({{packCurrency}}{{packPrice}} for {{packCredits}} credits). Credit packs never expire, even after subscription ends.",
          },
          billing: {
            title: "Billing",
            content:
              "Subscriptions are billed monthly. Credit packs are one-time purchases that never expire. We accept credit cards via Stripe and cryptocurrency via NowPayments.",
          },
          cancellation: {
            title: "Cancellation",
            content:
              "You can cancel your subscription at any time. Cancellations take effect at the end of the current billing period. Credit packs are non-refundable.",
          },
        },
        userAccounts: {
          title: "User Accounts",
          creation: {
            title: "Account Creation",
            content:
              "You must provide accurate information when creating an account. You are responsible for maintaining the security of your account credentials.",
          },
          responsibilities: {
            title: "User Responsibilities",
            content:
              "You are responsible for all activity under your account. You must not share your account with others or use the service for illegal purposes.",
          },
        },
        userContent: {
          title: "User Content",
          ownership: {
            title: "Content Ownership",
            content:
              "You retain all rights to your conversations and data. We do not claim ownership of your content. Your private folders are encrypted and only accessible to you.",
          },
          guidelines: {
            title: "Content Guidelines",
            intro:
              "While we provide uncensored AI access, you must not use the service to:",
            items: {
              item1: "Engage in illegal activities",
              item2: "Harass, threaten, or harm others",
              item3: "Violate intellectual property rights",
              item4: "Attempt to hack or compromise the platform",
            },
          },
        },
        intellectualProperty: {
          title: "Intellectual Property",
          content:
            "The {{appName}} platform, including its design, features, and code, is protected by intellectual property laws. You may not copy, modify, or distribute our platform without permission.",
        },
        disclaimer: {
          title: "Disclaimer of Warranties",
          content:
            "The service is provided 'as is' without warranties. We do not guarantee uninterrupted access, accuracy of AI responses, or fitness for a particular purpose.",
        },
        limitation: {
          title: "Limitation of Liability",
          content:
            "{{appName}} shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service.",
        },
        termination: {
          title: "Termination",
          content:
            "We reserve the right to terminate or suspend your account for violations of these terms. You may terminate your account at any time.",
        },
        changes: {
          title: "Changes to Terms",
          content:
            "We may update these Terms of Service from time to time. Continued use of the service after changes constitutes acceptance of the new terms.",
        },

        indemnification: {
          title: "Indemnification",
          content:
            "You agree to indemnify and hold harmless {{appName}} and its affiliates from any claims, damages, or expenses arising from your use of the service or violation of these terms.",
        },
        governingLaw: {
          title: "Governing Law",
          content:
            "These Terms of Service shall be governed by and construed in accordance with the laws of {{jurisdictionCountry}}. Any disputes shall be resolved in the courts of {{jurisdictionCity}}, {{jurisdictionCountry}}.",
        },
      },
    },
  },
  footer: {
    tagline: "Chat with AI, Connect with Community",
    privacyTagline:
      "Privacy-first AI chat with {{modelCount}} uncensored models",
    platform: {
      title: "Platform",
      features: "Features",
      subscription: "Subscription",
      aiModels: "AI Models",
      characters: "Characters",
    },
    product: {
      title: "Product",
      privateChats: "Private Chats",
      incognitoMode: "Incognito Mode",
      sharedFolders: "Shared Folders",
      publicForum: "Public Forum",
    },
    company: {
      title: "Company",
      aboutUs: "About Us",
      careers: "Careers",
      imprint: "Legal Notice",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
    },
    legal: {
      title: "Legal",
    },
    builtWith: "Built with",
    framework: "{{appName}} Framework",
    copyright: "© {{year}} {{appName}}. All rights reserved.",
  },
};
