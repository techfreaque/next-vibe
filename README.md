# NextVibe

**Define it once. It exists everywhere.**

One folder per feature. `definition.ts` defines the contract, `route.ts` wires it up, `widget.tsx` makes it yours. Two required, one you'll always want. 13 platforms. Not generated code that drifts - one living contract that the web UI, CLI, AI agent, MCP server, mobile app, cron system, and dataflow engine all read natively. Change the definition, every platform updates. Delete the folder, the feature ceases to exist everywhere at once.

[![License: GPL-3.0](https://img.shields.io/badge/Framework-GPL--3.0-blue.svg)](LICENSE)
[![License: MIT](https://img.shields.io/badge/App-MIT-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-7_/_TSGO-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)

> **The spiritual successor to WordPress - for the AI era.** Fork it, own it, build your platform. No vendor lock-in. No black box. You own every line.

> **Linux only (for now).** Mac and Windows aren't officially supported yet. Getting it running on either is probably a few Claude Code or Codex prompts away - we just don't have a Mac. PRs and issues welcome.

> **Interactive CLI broken since v3.2.0.** `vibe -i` / `--interactive` is temporarily disabled. The trade-off was intentional: the entire codebase now runs on CLI and web through the same renderer layer. `next-vibe-ui` has a CLI equivalent of every component - same props, same types, shadcn-derived for web, Ink-based for terminal. Interactive mode returns once the unified renderer is fully stable.

> **Migrating from Next.js to TanStack Start + Vite Nitro.** Dev already defaults to TanStack - fast cold start, lighter footprint, and still optimizing. Production runs Next.js - stable and proven. The tradeoff: occasional SSR hydration errors in dev that clear on refresh. Actively being resolved.

---

## Getting Started

```bash
git clone https://github.com/techfreaque/next-vibe
cd next-vibe
bun install
```

Three commands, three situations:

```bash
vibe dev                  # local development (Docker DB, migrations, seeds, hot reload)
vibe build && vibe start  # production, first time
vibe rebuild              # production, zero-downtime update after changes
```

Open the app → **Login as Admin** (no password in dev) → the setup wizard walks you through AI provider config and admin credentials.

**Claude Code** _(recommended - no API key)_: `claude login`, then pick any `(claude-code)` model in the model selector.
**OpenRouter** _(100+ models, pay per use)_: paste your key from [openrouter.ai/keys](https://openrouter.ai/keys).

### Deploy

Works on any VPS. Scales to Kubernetes.

```bash
bash scripts/install-docker.sh     # Docker deployment
# or: vibe build && vibe start     # bare metal
# Point Caddy / nginx at port 3000
```

**Kubernetes:** `kubectl apply -k k8s/` - templates for web, workers, Redis, ingress, namespace.

**Connect your dev machine:** Admin → Remote Connections → add your local URL. Thea discovers your tools, syncs memories and tasks every 60s. Your machine initiates the connection - no port forwarding needed.

---

## The Core Idea

You build a contact form. Support wants a CLI command. The AI needs to file tickets. Mobile needs the same form. Someone asks for an MCP tool. Five implementations. Five places where bugs hide.

NextVibe: describe the feature once - inputs, outputs, validation, permissions, UI hints, error types, translations, examples - and every platform renders it natively.

| #   | Platform             | Status        | What it does                                                        |
| --- | -------------------- | ------------- | ------------------------------------------------------------------- |
| 1   | **Web API**          | ✅ Production | RESTful endpoint, full type safety                                  |
| 2   | **React UI**         | ✅ Production | Data-driven forms and widgets from the definition                   |
| 3   | **CLI**              | ✅ Production | Every endpoint is a command with auto-generated flags               |
| 4   | **CLI Package**      | ✅ Production | Ship your CLI as an installable npm package                         |
| 5   | **AI Tools**         | ✅ Production | Function-calling schema for any provider - auto-generated           |
| 6   | **MCP Server**       | ✅ Production | Model Context Protocol - plug into any AI workflow                  |
| 7   | **Remote Skills**    | 🚧 Beta       | AI-readable skill files for cross-agent capability discovery        |
| 8   | **Cron / Pulse**     | ✅ Production | Scheduled execution with per-instance task routing                  |
| 9   | **WebSocket Events** | ✅ Production | Real-time pub/sub - in-process or Redis for scale                   |
| 10  | **React Native**     | 🚧 Beta       | Same contract on iOS/Android - NativeWind 5 + Expo Router           |
| 11  | **Electron**         | 🚧 Beta       | Desktop app from the same build                                     |
| 12  | **Vibe Frame**       | 🚧 Beta       | Embed any endpoint as a widget on any website. Federation built in. |
| 13  | **tRPC**             | ⏸ Inactive    | Available but replaced by a custom RPC layer                        |

There is no "API for humans" and "API for AI." There's one contract. Everything reads it.

---

## One Folder = One Feature

```
contact/
  definition.ts    - The contract (fields, validation, permissions, examples)
  route.ts         - Wires it to all 13 platforms
  repository.ts    - Business logic (or inline in route.ts)
  i18n/            - Translations (en, de, pl - compile-time checked)
  widget.tsx       - Custom web/native UI
  widget.cli.tsx   - Custom terminal UI (Ink)
  email.tsx        - Transactional email template
  db.ts            - Drizzle schema
```

`definition.ts` and `route.ts` are required. `widget.tsx` is optional but you'll want it for any non-trivial endpoint — it's how users actually experience the feature. Everything else is added when needed. Add a field to the definition — web form, CLI flags, AI tool schema, and mobile screen all update. Delete the folder — gone from every platform. No orphans. No cleanup.

> [Definition](docs/patterns/definition.md) · [Route](docs/patterns/route.md) · [Repository](docs/patterns/repository.md) · [Widget](docs/patterns/widget.md) · [All patterns](docs/README.md)

---

## What the Code Looks Like

### definition.ts

```typescript
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["contact"],
  allowedRoles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    usage: { request: "data", response: true } as const,
    children: {
      name: requestField(scopedTranslation, {
        schema: z.string().min(2),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "form.fields.name.label",
      }),
      message: requestField(scopedTranslation, {
        schema: z.string().min(10),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "form.fields.message.label",
      }),
      success: responseField(scopedTranslation, {
        schema: z.string(),
        type: WidgetType.ALERT,
      }),
    },
  }),

  errorTypes: {
    /* all 9 - exhaustive, compiler enforced */
  },
  successTypes: { title: "success.title", description: "success.description" },
  examples: {
    requests: { default: { name: "Jane Smith", message: "Hello!" } },
    responses: { default: { success: "Thank you!" } },
  },
});
```

From this one file: web renders a form · CLI gets `vibe contact --name="Jane" --message="..."` · AI gets a function-calling schema · MCP server exposes a tool · validation and permissions identical everywhere.

### route.ts

```typescript
export const { POST, tools } = endpointsHandler({
  endpoint: contactEndpoints,
  [Methods.POST]: {
    email: [{ render: renderCompanyMail, ignoreErrors: false }],
    handler: ({ data, user, locale, logger, t }) =>
      ContactRepository.submitContactForm(data, user, locale, logger, t),
  },
});
```

### Access control - one array

```typescript
allowedRoles: [
  UserRole.PUBLIC, // who can call it
  UserRole.CLI_OFF, // block CLI + MCP
  UserRole.AI_TOOL_OFF, // block AI tool discovery
  UserRole.MCP_VISIBLE, // opt-in: appear in MCP tool list
  UserRole.REMOTE_SKILL, // opt-in: appear in AGENT.md skill files
  UserRole.PRODUCTION_OFF, // disable in production
];
```

---

## AI Is Not a Feature. It's a Team Member.

The agent operates through the same contracts as every human user. When Thea calls your contact endpoint, she hits the same `definition.ts` and `route.ts` as the browser. Same validation. Same permissions. No special API.

### Skills (skill.ts)

A skill is a saved AI configuration: persona, model selection, tool whitelist. Users or the AI create them, favorite them, and on the next turn the model already knows what sub-agents are available.

This is how delegation works. A cheap orchestrator handles the conversation. When it needs serious writing, it calls `master-writer` - pinned to Claude Opus. Research? `researcher` - Grok with search tools. The expensive model only runs when that specific capability is needed. Any skill can call any other. Users shape the team; the AI routes automatically.

The generated `.md` skill file is machine-readable - Claude Code, Cursor, or any MCP client can discover and call skills directly. Skills are context-efficient by design: `skill-create` pins only `help-tool` and `execute-tool`. One call to `help-tool` returns the full schema for any tool on demand.

### Thea + Hermes

```
              +------------------+
              |   Central Thea   |  (Production - always on)
              |   AI team lead   |
              +--------+---------+
                       |  remote connection (sync every 60s)
           +-----------+-----------+
           |                       |
    +------+-------+       +------+-------+
    |   Hermes     |       |   Hermes     |   (Developer machines)
    | Dev Instance |       | Dev Instance |
    +--------------+       +--------------+
```

**Thea** runs 24/7 on production. Talks to users, manages tasks, coordinates work. Not an assistant - the AI team lead.

**Hermes** is the local worker. `vibe remote-connect` links your machine. The pulse syncs memories, capabilities, and tasks every 60 seconds. Thea discovers local tools via `help(instanceId="hermes")`, executes remotely, routes coding tasks to the right machine.

**Capabilities:** 100+ AI models · skill delegation · persistent memories · tool calling (any endpoint) · task scheduling · MCP · any-to-any modality (text · image · audio · video · music)

---

## Vibe Sense

A dataflow engine built on the same endpoint pattern. Every node **is** an endpoint.

```
DataSource → Indicator → Transformer → Evaluator → Action
```

An EMA node is `vibe analytics/indicators/ema --period=14 --source=leads-created`. A threshold evaluator is `vibe analytics/evaluators/threshold --value=... --threshold=100`. Chain them into a graph. Same contracts. Same type safety.

Graph builder canvas is live in admin. Backtest replays any strategy over history - evaluator calls are intercepted so nothing fires. Mix timeframes freely.

**Ships with seeds:** lead funnel monitoring, credit economy health, user growth tracking.

**Use cases:** business metrics · trading strategies · IoT anomaly detection · email deliverability · any pipeline that's data → conditions → actions.

> [Vibe Sense docs](docs/vibe-sense/)

---

## Type Safety

- **Translations are compile-time checked.** `t("contact.form.fields.name.label")` compiles. `t("typo.here")` is a compiler error. Three languages.
- **Error types are exhaustive.** Every endpoint declares its possible errors. Miss one, compiler fails.
- **Schemas flow end-to-end.** One Zod schema validates the API, types the hooks, generates CLI flags, constrains the AI tool schema. Zero drift.
- **`vibe check` runs everything.** Oxlint + ESLint + TypeScript in parallel. One command. No shortcuts.

**430+ endpoints. 2,100,000+ lines. Zero `any`. Zero `unknown` casts. Zero runtime type errors.**

`@next-vibe/checker` ships as a standalone npm package for any TypeScript project.

---

## Unbottled.ai - The Flagship

NextVibe is the engine. **[Unbottled.ai](https://unbottled.ai)** is the product. Like WordPress.org vs WordPress.com - fork and deploy your own, or use ours.

Free speech AI. 100+ models. Users choose their own content filtering level.

- **AI Chat** - Multi-model, branching message trees, skills, memories, favorites
- **Payments** - Stripe + NowPayments (crypto), credits, referral program
- **Communication** - React Email, SMTP/IMAP client, automated campaigns
- **Lead System** - Journey workflows, CSV import, engagement analytics
- **Admin** - Auto-generated panels, database studio, health monitoring, cron dashboard

| Metric                           | Value          |
| -------------------------------- | -------------- |
| TypeScript files                 | 7,000+         |
| Lines of code                    | 2,100,000+     |
| Endpoint definitions             | 430+           |
| Platforms per endpoint           | Up to 13       |
| Database tables                  | 28+            |
| Languages (compile-time checked) | 3 (en, de, pl) |
| Runtime type errors              | 0              |

---

## Tech Stack

| Layer      | Technology                                                                                            |
| ---------- | ----------------------------------------------------------------------------------------------------- |
| Runtime    | Bun                                                                                                   |
| Language   | TypeScript 7 / TSGO (strict mode)                                                                     |
| Web        | TanStack Start + Vite Nitro (dev) · Next.js 16 (prod) · React 19 · Tailwind CSS 4 · shadcn-derived UI |
| Mobile     | React Native, NativeWind 5, Expo Router                                                               |
| Desktop    | Electron 40                                                                                           |
| Database   | PostgreSQL + Drizzle ORM                                                                              |
| Validation | Zod - one schema, all platforms                                                                       |
| AI         | Claude Code, OpenRouter (100+ models)                                                                 |
| MCP        | Model Context Protocol server                                                                         |
| Quality    | Vibe checker (Oxlint + ESLint + TypeScript)                                                           |
| Email      | React Email + SMTP/IMAP                                                                               |
| Payments   | Stripe, NowPayments                                                                                   |

---

## CLI

```bash
# Dev & production
vibe dev                    # dev server + Docker DB (add -r to reset)
vibe build                  # build for production
vibe start                  # start production + cron tasks
vibe rebuild                # check + rebuild + hot-restart (zero downtime)

# Quality
vibe check                  # lint + typecheck in one command
vibe check src/path file.ts # check specific files

# Database
vibe migrate                # run pending migrations
vibe migrate --generate     # generate from schema changes
vibe seed / vibe reset      # seed / drop + migrate + seed
vibe studio                 # Drizzle Studio (browser DB GUI)
vibe sql "SELECT ..."       # raw SQL

# Any endpoint = a command
vibe web-search "quantum computing"
vibe analytics/indicators/ema --period=14 --source=leads-created

# MCP + remote
vibe mcp                    # start MCP server
vibe remote-connect --help
vibe help                   # list everything
```

---

## Docs

- **[Full Index](docs/README.md)**
- [Definition](docs/patterns/definition.md) · [Repository](docs/patterns/repository.md) · [Route](docs/patterns/route.md) · [Database](docs/patterns/database.md)
- [i18n](docs/patterns/i18n.md) · [Enum](docs/patterns/enum.md) · [Seeds](docs/patterns/seeds.md) · [Logger](docs/patterns/logger.md)
- [Widget (Web)](docs/patterns/widget.md) · [Widget (CLI/MCP)](docs/patterns/widget.cli.md) · [Hooks](docs/patterns/hooks.md)
- [Email](docs/patterns/email.md) · [Tasks](docs/patterns/tasks.md) · [React Native](docs/patterns/repository.native.md) · [Client Repository](docs/patterns/repository.client.md)

---

## Roadmap

### New Platforms

Every new platform is a renderer + one permission marker. The definition already has everything it needs.

| #   | Platform                  | What it unlocks                                                                                                         |
| --- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| 1   | **Trading Endpoints**     | Exchange connectivity as first-class endpoints. Feeds Vibe Sense natively - price, P&L, positions as data sources.      |
| 2   | **Browser Extension**     | Endpoints as browser actions. Right-click → "Add to leads" → fires. Definition drives the popup UI.                     |
| 3   | **Voice / Telephony**     | Endpoints callable via phone. Field labels become IVR prompts, Zod validates STT output. TTS + STT already in platform. |
| 4   | **Actionable Email**      | Endpoints callable from email via signed tokens. Approve, confirm, trigger - no browser required.                       |
| 5   | **Spreadsheet / Grid**    | Collection endpoints as live editable grids. Columns from response fields, validation from Zod.                         |
| 6   | **Webhook Receiver**      | Inbound webhooks. Definition declares payload schema, validates, feeds Vibe Sense.                                      |
| 7   | **GraphQL**               | Generated live from the registry. No `.graphql` files. Subscriptions map to WebSocket events.                           |
| 8   | **OpenAPI / Swagger**     | OpenAPI 3.1 spec generated live. Always current because it IS the definition.                                           |
| 9   | **Automation Platforms**  | Endpoints as Zapier/Make/n8n triggers and actions. Your platform appears as a native app.                               |
| 10  | **Slash Commands**        | Endpoints as slash commands in Notion, Linear, Slack.                                                                   |
| 11  | **QR / NFC**              | Endpoints reachable via scan or tap with pre-filled params and signed tokens.                                           |
| 12  | **PDF / Documents**       | Response fields renderable as invoices, contracts, reports. Schema defines structure.                                   |
| 13  | **IoT / MQTT**            | Endpoints as MQTT topics. Sensor → validate → Vibe Sense → anomaly → action.                                            |
| 14  | **AR / Spatial**          | Response fields as spatial UI. Vision Pro, Quest, WebXR.                                                                |
| 15  | **Print / Label**         | Structured output as shipping labels, receipts. ZPL for thermal, PDF for standard.                                      |
| 16  | **Wearable**              | Single-action endpoints as watch complications. Vibe Sense signals as glanceable indicators.                            |
| 17  | **Game Engine**           | Unity/Unreal/Godot SDK calls. Leaderboards, matchmaking, analytics - typed endpoints.                                   |
| 18  | **Blockchain**            | Schemas mapped to smart contract ABI. Zod validates on-chain data.                                                      |
| 19  | **A2A (Agent-to-Agent)**  | Google/LF Agent-to-Agent protocol. The definition already contains everything an Agent Card needs.                      |
| 20  | **Remote Tool Rendering** | VibeFrame renders remote endpoints without a local server. The definition travels with the widget.                      |

### Framework & Ecosystem

| #   | Feature                         | What it does                                                                                           |
| --- | ------------------------------- | ------------------------------------------------------------------------------------------------------ |
| 1   | **Module Store**                | Registry of plug-and-play feature repos. Clone into your instance with one command.                    |
| 2   | **Import-Aware Setup Wizard**   | First install scans imports, removes unselected modules. No dead code.                                 |
| 3   | **Module Dependency Graph**     | Static analysis knows which files depend on which features. Safe removals, safe upgrades.              |
| 4   | **Vibe Sense Polish**           | Inline param editing, live chart preview, backtest UI, mobile-responsive canvas.                       |
| 5   | **Multi-Tenant**                | Isolated data, custom branding, per-tenant feature flags and Vibe Sense graphs.                        |
| 6   | **Plugin API**                  | Extend without forking. Plugins register endpoints, tables, seeds, i18n, nav items.                    |
| 7   | **Visual Admin Builder**        | Drag endpoint widgets onto a canvas. Output is config, not generated code.                             |
| 8   | **Native Parity**               | Production-ready React Native components. Same types, same props - looks native, not "runs on native." |
| 9   | **Federation**                  | VibeFrame renders remote endpoints from connected instances inside your admin panel.                   |
| 10  | **Marketplace & Revenue Share** | Module authors publish, set prices, earn on installs. The ecosystem funds itself.                      |

---

## License

**GPL-3.0 + MIT** - Framework core is GPL-3.0 (share improvements back). Everything else is MIT.

[LICENSE](LICENSE) · [CONTRIBUTING.md](CONTRIBUTING.md)

`vibe check` must pass with zero errors. Zero `any`, `unknown`, `object`, `@ts-expect-error`, `as`, `eslint-disable`. Then PR.

---

**Creator:** Marcus Brandstatter ([max@a42.ch](mailto:max@a42.ch)) · **AI Contributors:** Claude Code, Augment, Cursor

[Issues](https://github.com/techfreaque/next-vibe/issues) · [Discussions](https://github.com/techfreaque/next-vibe/discussions)
