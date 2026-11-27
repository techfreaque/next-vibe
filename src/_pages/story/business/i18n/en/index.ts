export const translations = {
  meta: {
    title: "Self-Hosted Accounting, CRM and AI in One App | {{appName}}",
    description:
      "Double-entry accounting, invoicing, purchasing, inventory, point of sale, CRM and newsletters in one open-source app. Runs on your server. Every feature is a tool your AI can use.",
    category: "Business",
    imageAlt: "{{appName}} self-hosted business suite: accounting, CRM and AI",
    keywords:
      "self-hosted accounting software, open source ERP, open source accounting, double-entry bookkeeping, invoicing software, AI accounting, self-hosted CRM, {{appName}}",
  },
  hero: {
    badge: "Open-source business suite",
    title: "Your books. Your server.",
    titleHighlight: "AI built in.",
    subtitle:
      "Double-entry accounting, invoicing, purchasing, inventory, point of sale, CRM and newsletters in one open-source app. It runs on your server. Every feature is a tool your AI can use.",
    ctaStart: "Run it yourself",
    ctaGithub: "View on GitHub",
    shotAlt: "Trial balance of a demo company: debits equal credits",
    stats: {
      actions: "actions your AI can run",
      reports: "ledger reports, live",
      charts: "charts of accounts: SKR03, ÖKR, SK, IFRS",
      languages: "languages built in",
    },
  },
  ledger: {
    eyebrow: "The books",
    title: "Double-entry. Enforced.",
    intro:
      "Invoices, bills, payments and till sales post to the general ledger on their own, including multi-currency entries with daily ECB rates, realized FX gains and losses, and period-end revaluation. Debits must equal credits, or nothing posts.",
    points: {
      balanced: {
        title: "Balanced or rejected",
        body: "Every journal entry needs at least two lines and exact balance. Checked on create, post and reverse.",
      },
      final: {
        title: "Posted means final",
        body: "No silent edits. A mistake gets a reversal entry that mirrors the original and links back to it.",
      },
      periods: {
        title: "Periods that close",
        body: "Entries must land in an open period. Closing is blocked while drafts remain and records who closed it.",
      },
      templates: {
        title: "Start from your country",
        body: "Germany (SKR03), Austria (ÖKR) or Slovakia (SK): VAT rates, cash and bank accounts come with it. Anywhere else: a generic IFRS chart, you add the rates.",
      },
    },
    reportsLabel: "Reports, live from the ledger",
    reports: {
      balanceSheet: "Balance sheet",
      profitLoss: "Profit and loss",
      trialBalance: "Trial balance",
      aging: "Receivables aging",
      vat: "VAT report",
      payablesAging: "Payables aging",
      journalExport: "Journal CSV export",
      taxFilings:
        "Country tax filings (DE UStVA/EÜR, AT UVA, SK DPH/KV, generic VAT)",
    },
    shotAlt: "Supplier bills with status and amounts in the {{appName}} admin",
  },
  flows: {
    eyebrow: "Money in, money out",
    title: "From quote to ledger without retyping.",
    intro:
      "Each document moves to the next with one action. The bookkeeping happens on the way.",
    posted: "Posted to the ledger",
    sales: {
      title: "Sales",
      steps: {
        estimate: "Estimate",
        invoice: "Invoice",
        payment: "Payment recorded",
      },
      note: "Credit notes, branded PDFs with ZUGFeRD and QR payment codes, email delivery with resend log, recurring schedules and Stripe online payment links.",
    },
    purchasing: {
      title: "Purchasing",
      steps: {
        order: "Purchase order",
        receipt: "Goods received",
        bill: "Supplier bill",
        payment: "Bill paid",
      },
      note: "Vendors with default tax rates. Partial deliveries tracked per line. Receipts book stock into the warehouse.",
    },
    pos: {
      title: "Point of sale",
      steps: {
        session: "Open till",
        order: "Ring up",
        payment: "Cash, card or transfer",
      },
      note: "Sales and refunds move stock from the till's warehouse and book COGS with configurable negative-stock rules. Closing counts cash against the session's orders.",
    },
    inventory: {
      title: "Inventory",
      body: "Warehouses, stock receipts, issues and adjustments, transfers between locations. Every movement lands in an append-only log with who made it.",
    },
  },
  suite: {
    eyebrow: "Around the books",
    title: "The rest of the company, same app.",
    intro:
      "Same login, same database, same admin. No sync between five subscriptions.",
    aiLabel: "Any model",
    toolCount: "{{count}} actions",
    cards: {
      crm: {
        title: "CRM and leads",
        body: "Import contacts from CSV, track deals and outreach, export when you need it.",
      },
      newsletter: {
        title: "Newsletter and campaigns",
        body: "Double opt-in, one-click unsubscribe, bounce handling, email journeys.",
      },
      messaging: {
        title: "Inbox and messaging",
        body: "Your mailbox over IMAP and SMTP, plus SMS, Telegram and WhatsApp Business.",
      },
      payments: {
        title: "Subscription billing",
        body: "Stripe and crypto checkout, webhooks and refunds for subscription plans.",
      },
      team: {
        title: "Companies and roles",
        body: "Run several companies. Invite your team as owner, admin, accountant, member or viewer.",
      },
      ai: {
        title: "Scheduled agents",
        body: "Agents run reports and checks on a schedule. Use your {{appName}} account or your own provider key.",
      },
    },
  },
  ai: {
    eyebrow: "AI that does the work",
    title: "Ask your books. Get answers, not charts.",
    intro:
      "Every accounting action is a typed tool. Your AI calls the same code the admin buttons call, with the same checks.",
    points: {
      chat: "Ask in plain words. The model runs the report and explains it.",
      cli: "Script month-end from your terminal. Every tool is a CLI command.",
      mcp: "Claude Code, Cursor and Codex reach the same tools over MCP.",
      permissions:
        "Agents act as the user who runs them. Same company role, same checks.",
    },
    demo: {
      label: "Example",
      question: "Who owes us money, and how late are they?",
      tool: "Receivables aging",
      answer:
        "Three customers are overdue, 4,180 EUR in total. The largest, 2,380 EUR, is 47 days late. Want the invoice numbers?",
    },
    tabs: {
      cli: "CLI",
      mcp: "MCP",
    },
  },
  compare: {
    eyebrow: "The difference",
    title: "Typical accounting SaaS vs. your own server.",
    intro:
      "Hosted tools are convenient. Here is what you trade for that, and where they still win.",
    colSaas: "Typical accounting SaaS",
    colUs: "{{appName}}, self-hosted",
    colSaasShort: "SaaS",
    colUsShort: "Self-hosted",
    rows: {
      data: {
        label: "Where your books live",
        saas: "Their cloud, their terms",
        us: "Your server, your Postgres",
      },
      seats: {
        label: "Price per user",
        saas: "Monthly fee per seat",
        us: "No seat fees. You pay for hosting and the AI you use.",
      },
      ai: {
        label: "AI",
        saas: "Add-on, or not at all",
        us: "Every feature is an AI tool, any model",
      },
      code: {
        label: "Source code",
        saas: "Closed",
        us: "Open on GitHub",
      },
      missing: {
        label: "A feature you need",
        saas: "Wait for the roadmap",
        us: "Build it: one definition file",
      },
      exit: {
        label: "Leaving",
        saas: "Export what they allow",
        us: "It is already your database",
      },
      filings: {
        label: "Bank feeds and tax filing",
        saas: "Often built in",
        us: "Built in: Enable Banking feeds, CAMT.053/MT940/CSV statement import and matching, plus DE UStVA/EÜR, AT UVA, SK DPH/KV and generic VAT exports.",
      },
      hosting: {
        label: "Running it",
        saas: "Done for you",
        us: "You run it. We help if you ask.",
      },
    },
  },
  start: {
    eyebrow: "Setup",
    title: "Three commands. Then create your company.",
    intro:
      "Clone, install, run. The setup wizard handles the admin login and AI. Then add your company in the admin. Germany, Austria or Slovakia: chart of accounts, VAT rates, cash and bank accounts in one step. Anywhere else: a generic IFRS chart to build on.",
    terminalTitle: "Start your instance",
    guide: "Full self-hosting guide",
    developers: "Build your own modules",
  },
  code: {
    copy: "Copy",
    copied: "Copied",
    wrap: "Wrap lines",
  },
  help: {
    title: "Moving a company onto it?",
    description:
      "Setup help, data migration, custom modules. A human reads every message.",
  },
};
