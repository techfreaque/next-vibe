# NextVibe

**Define it once. It exists everywhere.**

One endpoint definition. 13 platforms. Not generated code that drifts - one living contract that the web app, mobile app, CLI, AI agent, MCP server, cron system, and dataflow engine all read natively. Change the definition, every platform updates instantly. Delete the folder, the feature ceases to exist everywhere at once.

[![License: GPL-3.0](https://img.shields.io/badge/Framework-GPL--3.0-blue.svg)](LICENSE)
[![License: MIT](https://img.shields.io/badge/App-MIT-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-7_/_TSGO-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)

> **The spiritual successor to WordPress - for the AI era.** Fork it, own it, build your platform. No vendor lock-in. No black box. You own every line.

---

## Getting Started

### Step 1 - Pick an AI Provider

**Option A: Claude Code** _(recommended - no API key needed)_

If you have a Claude subscription and the [Claude Code CLI](https://claude.ai/code), sign in once:

```bash
claude login
```

Select any `claude-code-*` model in the model selector. Claude Code integrates two ways:

- **As a model provider** - Thea uses your local Claude session as her AI brain, billed to your existing subscription.
- **As a tool** - Thea spawns Claude Code to execute tasks silently in the background or interactively.

**Option B: OpenRouter** _(200+ models, pay per use)_

```
OPENROUTER_API_KEY="sk-or-v1-..."   # openrouter.ai/keys
```

Gives you Claude, ChatGPT, Gemini, Llama, Mistral, DeepSeek, and everything else.

---

### Step 2 - Choose Your Setup

#### 1. AI-Powered Workstation - Your Always-On Agent

Run NextVibe on hardware you own: a VPS, a Mac Mini, a home server. Thea runs 24/7 with shell access, knows your codebase, monitors the platform, and delegates work to Claude Code while you sleep.

```bash
git clone https://github.com/techfreaque/next-vibe
cd next-vibe
cp .env.example .env
# Set VIBE_ADMIN_USER_PASSWORD + your AI provider (see above)
bun install
vibe build && vibe start
```

#### 2. Self-Hosted Platform - The WordPress Route

Full production deployment on your own domain. Works on any VPS. Scales to Kubernetes when you need it.

```bash
git clone https://github.com/techfreaque/next-vibe
cd next-vibe
cp .env.example .env
bash scripts/install-docker.sh
vibe build && vibe start
# Point Caddy / nginx at port 3000 - done
```

**Kubernetes:** edit `k8s/secret.yaml`, then `kubectl apply -k k8s/`. Templates for web, task workers, Redis, ingress, and namespace included.

**Connect your local machine** so Thea can route tasks to your dev tools:

```bash
vibe remote-connect --instance-id=hermes --remote-url=https://your-domain.com --email=you@example.com --password=...
```

Memories and tasks sync every 60 seconds. No port forwarding, no VPN - local instance initiates the connection on the pulse.

#### 3. Local Development - Build Your Own SaaS

```bash
git clone https://github.com/YOUR_USERNAME/next-vibe
cd next-vibe
cp .env.example .env
bun install
vibe dev
```

`vibe dev` starts PostgreSQL in Docker, runs migrations, seeds data, and launches the dev server with hot reload.

```bash
vibe check     # lint + typecheck
vibe rebuild   # push to production - check + rebuild + hot-restart, zero downtime
```

---

## The Core Idea

You build a contact form. Then support wants a CLI command. Then the AI agent needs to file tickets. Then mobile needs the same form. Then someone wants an MCP tool. Five implementations. Five places where bugs hide.

**NextVibe's answer:** describe your feature once - its inputs, outputs, validation, permissions, UI hints, error types, translations, and examples - and every platform renders it natively.

| #   | Platform             | Status       | What it does                                                                                                      |
| --- | -------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------- |
| 1   | **Web API**          | ✅ Production | RESTful endpoint, full type safety                                                                                |
| 2   | **React UI**         | ✅ Production | Data-driven forms and display widgets from the definition                                                         |
| 3   | **CLI**              | ✅ Production | Every endpoint is a command with auto-generated flags                                                             |
| 4   | **CLI Package**      | ✅ Production | Ship your CLI as an installable npm package                                                                       |
| 5   | **AI Tools**         | ✅ Production | OpenAI/Anthropic function-calling schema - auto-generated                                                         |
| 6   | **MCP Server**       | ✅ Production | Model Context Protocol - plug into any AI workflow                                                                |
| 7   | **Remote Skills**    | 🚧 Beta       | AI-readable skill files for agent capability discovery                                                            |
| 8   | **Cron / Pulse**     | ✅ Production | Scheduled execution with per-instance task routing                                                                |
| 9   | **WebSocket Events** | ✅ Production | Real-time pub/sub - in-process or Redis for scale                                                                 |
| 10  | **React Native**     | 🚧 Beta       | Same contract on iOS/Android - NativeWind 5 + Expo Router                                                         |
| 11  | **Electron**         | 🚧 Beta       | Desktop app - macOS, Linux, Windows from the same build                                                           |
| 12  | **Vibe Frame**       | 🚧 Beta       | Embed any endpoint as an iframe widget on any website. Federated widgets (any remote NextVibe instance) included. |
| 13  | **tRPC**             | ⏸ Inactive   | Type-safe client-server calls - available but unused, replaced by a custom RPC layer                              |

There is no "API for humans" and "API for AI." There's just the tool.

---

## One Folder Per Feature

```
contact/
  definition.ts    - What it does (contract)
  route.ts         - Makes it available on all 13 platforms
  repository.ts    - Where the logic lives (convention - can be inline in route.ts)
  i18n/            - What it says (translations)
  widget.tsx       - How it looks (custom React UI override)
  widget.cli.tsx   - How it looks in the terminal (Ink override)
  email.tsx        - What it sends (transactional email)
  db.ts            - What it stores (Drizzle schema)
```

Only `definition.ts` and `route.ts` are required. Everything else is added when you need it. Add a field to `definition.ts` - the web form, CLI flags, AI tool schema, and mobile screen all update. Delete the folder - the feature is gone from every platform. No orphaned code, no dead routes, no cleanup.

→ Full pattern docs: [Definition](docs/patterns/definition.md) · [Route](docs/patterns/route.md) · [Repository](docs/patterns/repository.md) · [Widget](docs/patterns/widget.md) · [All patterns](docs/README.md)

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

From this one file: web renders a form · CLI gets `vibe contact --name="Jane" --message="..."` · AI gets a function-calling schema · MCP server exposes a tool · validation and permissions identical on every platform.

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

### Platform access control - one array controls everything

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

Most platforms treat AI as a chatbot widget bolted on. NextVibe is built around a different idea: the AI agent is a full participant, operating through the same contracts as every human.

When Thea calls your contact endpoint, she uses the same definition a user sees in their browser. Same validation. Same permissions. No special API.

### Skills & Skills

Every AI skill in NextVibe is two things at once: a **persona** for the user (name, avatar, personality, memory context) and a **skill set** for the AI (which endpoints it can call, which models it uses, what it's optimized for). The `.md` skill file is what other platforms - Claude Code, Cursor - read to discover the skill's capabilities. A stats analyst skill can call `ema_GET`, `rsi_GET`, `bollinger-bands_GET` directly as AI tools.

### Central Thea + Local Hermes

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

**Thea** runs 24/7 on production. She talks to users, manages tasks, coordinates work, and runs the platform. Not an assistant - the AI team lead.

**Hermes** is the local worker. Connect via `vibe remote-connect`. The pulse syncs memories, capabilities, and tasks every 60 seconds. Thea discovers local tools via `help(instanceId="hermes")`, executes them remotely, and routes Claude Code tasks to the right machine. No Jira. No standup.

**What Thea can do:** 42+ AI models · skill.ts files · Persistent memories · Tool calling (any endpoint) · Task scheduling · MCP · Voice (TTS + STT)

---

## Vibe Sense - Your Platform Watching Itself

Vibe Sense is a dataflow engine built entirely on the same endpoint pattern. Every node **is** an endpoint.

```
DataSource endpoints → Indicator endpoints → Transformer endpoints → Evaluator endpoints → Action endpoints
```

An EMA node is just `vibe analytics/indicators/ema --period=14 --source=leads-created`. A threshold evaluator is `vibe analytics/evaluators/threshold --value=... --threshold=100`. Chain them into a graph. The graph engine calls them via `getRouteHandler()`. Same contracts. Same type safety. Same validation.

**Ships with graph seeds:** lead funnel monitoring, credit economy health, user growth tracking. Ready on first boot.

Use cases: business metric monitoring · trading strategy execution · IoT anomaly detection · email deliverability health · any process that can be described as data → conditions → actions.
Chara
The graph builder canvas is live in the admin panel. Backtest: replay any strategy over history - evaluator calls are intercepted so nothing fires. Multi-resolution: mix 5-minute and daily timeframes in the same graph.

→ [Vibe Sense docs](docs/vibe-sense/)

---

## Type Safety That Actually Means Something

- **Translations are type-checked.** `t("contact.form.fields.name.label")` compiles. `t("typo.here")` is a compiler error. Across three languages.
- **Error types are exhaustive.** Every endpoint declares which errors it can return. Miss one, the compiler complains.
- **Schemas flow end-to-end.** One Zod schema validates the API, types the React hooks, generates CLI flags, and constrains the AI tool schema. Zero drift.
- **`vibe check` is one command.** Oxlint + ESLint + TypeScript together, in parallel. AI agents can't skip half the checks.

**245 endpoints. 750,000+ lines. Zero `any`. Zero `unknown` casts. Zero runtime type errors.**

`@next-vibe/checker` is available as a standalone npm package - bring the same zero-escape-hatch quality enforcement to any TypeScript project.

---

## Unbottled.ai - The Flagship

NextVibe is the engine. **[Unbottled.ai](https://unbottled.ai)** is the product - like WordPress.org vs WordPress.com. Fork and deploy your own, or use ours.

Free speech AI - 42+ models, user-controlled content filtering. Users choose their own censorship level.

- **AI Chat** - Multi-model, branching message trees, skills, memories, curated favorites
- **Payments** - Stripe + NowPayments (crypto), credits, referral program
- **Communication** - React Email, full SMTP/IMAP client, automated campaigns
- **Lead System** - Journey workflows, CSV import, engagement analytics
- **Admin** - Auto-generated panels, database studio, health monitoring, cron dashboard

| Metric                           | Value          |
| -------------------------------- | -------------- |
| TypeScript files                 | 4,400+         |
| Lines of code                    | 750,000+       |
| Endpoint definitions             | 245            |
| Platforms per endpoint           | Up to 13       |
| Database tables                  | 25+            |
| Languages (compile-time checked) | 3 (en, de, pl) |
| Runtime type errors              | 0              |

---

## Tech Stack

| Layer      | Technology                                                        |
| ---------- | ----------------------------------------------------------------- |
| Runtime    | Bun                                                               |
| Language   | TypeScript 7 / TSGO (strict mode)                                 |
| Web        | Next.js 16 (App Router), React 19, Tailwind CSS 4, shadcn-like UI |
| Mobile     | React Native, NativeWind 5, Expo Router                           |
| Desktop    | Electron 40                                                       |
| Database   | PostgreSQL + Drizzle ORM                                          |
| Validation | Zod - one schema, all platforms                                   |
| AI         | Claude Code, OpenRouter (200+ models)                             |
| MCP        | Model Context Protocol server                                     |
| Quality    | Vibe checker (Oxlint + ESLint + TypeScript)                       |
| Email      | React Email + SMTP/IMAP                                           |
| Payments   | Stripe, NowPayments                                               |

---

## Vibe CLI

```bash
# Dev & production
vibe dev                    # start dev server + Docker DB (add -r to reset)
vibe build                  # build for production
vibe start                  # start production server + cron tasks
vibe rebuild                # check + rebuild + hot-restart (zero downtime)

# Code quality
vibe check                  # lint + typecheck in one command
vibe check src/path file.ts # check a specific area, one or more files

# Database
vibe migrate                # run pending migrations
vibe migrate --generate     # generate from schema changes
vibe seed / vibe reset      # seed / drop + migrate + seed
vibe studio                 # Drizzle Studio (browser DB GUI)
vibe sql "SELECT ..."       # raw SQL

# Any endpoint as a command
vibe web-search "quantum computing"
vibe analytics/indicators/ema --period=14 --source=leads-created

# MCP + remote
vibe mcp                    # start MCP server
vibe remote-connect --instance-id=hermes --remote-url=https://... --email=... --password=...
vibe help                   # list everything
```

---

## Docs

- **[Full Documentation Index](docs/README.md)**
- **[Definition](docs/patterns/definition.md)** · **[Repository](docs/patterns/repository.md)** · **[Route](docs/patterns/route.md)** · **[Database](docs/patterns/database.md)**
- **[i18n](docs/patterns/i18n.md)** · **[Enum](docs/patterns/enum.md)** · **[Seeds](docs/patterns/seeds.md)** · **[Logger](docs/patterns/logger.md)**
- **[Widget (Web)](docs/patterns/widget.md)** · **[Widget (CLI/MCP)](docs/patterns/widget.cli.md)** · **[Hooks](docs/patterns/hooks.md)**
- **[Email](docs/patterns/email.md)** · **[Tasks](docs/patterns/tasks.md)** · **[React Native](docs/patterns/repository.native.md)** · **[Client Repository](docs/patterns/repository.client.md)**

---

## Roadmap

### New Platforms

The endpoint definition is the single source of truth. Every new platform is a new renderer + one new permission marker. Labels, types, validation, permissions, UI hints, and examples are already there - most new platforms need almost nothing added.

| #   | Platform                        | Marker                | What it unlocks                                                                                                                                                                                                                                       |
| --- | ------------------------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Trading Endpoints**           | -                     | Exchange connectivity (order placement, portfolio queries, position management) as first-class endpoints. Feeds Vibe Sense natively - price series, P&L, position data become data sources. Full strategy builder in the graph editor.                |
| 2   | **Browser Extension**           | `EXTENSION_VISIBLE`   | Every endpoint becomes a browser action or context menu item. The definition drives a popup UI. Right-click an email → "Add to leads" → endpoint fires. VibeFrame's cross-origin bridge adapts directly to the extension sandbox.                     |
| 3   | **Voice / Telephony**           | `VOICE_VISIBLE`       | Endpoints callable via phone or voice assistant. Field labels become IVR prompts, Zod validates speech-to-text output, response fields become TTS. TTS + STT already in the platform.                                                                 |
| 4   | **Actionable Email**            | `EMAIL_ACTIONABLE`    | Endpoints callable directly from an email - approve, confirm, trigger a workflow - via signed one-time tokens. React Email already in the stack. No browser required.                                                                                 |
| 5   | **Spreadsheet / Grid**          | `SPREADSHEET_VISIBLE` | Collection endpoints as live editable spreadsheets. Columns from response fields, row actions from endpoints, validation from Zod. Embeddable via VibeFrame.                                                                                          |
| 6   | **Webhook Receiver**            | `WEBHOOK_SOURCE`      | Endpoints as inbound webhook targets. The definition declares the expected payload as a Zod schema, validates and normalizes it, and feeds Vibe Sense as a time series.                                                                               |
| 7   | **GraphQL**                     | `GRAPHQL_VISIBLE`     | Endpoints exposed as GraphQL queries and mutations. No `.graphql` file to maintain - generated live from the registry. Subscriptions map to existing WebSocket events.                                                                                |
| 8   | **OpenAPI / Swagger**           | `OPENAPI_VISIBLE`     | Fully compliant OpenAPI 3.1 spec generated live from the registry. Always current because it IS the definition.                                                                                                                                       |
| 9   | **Automation Platforms**        | `AUTOMATION_VISIBLE`  | Endpoints published as triggers and actions in Zapier, Make, and n8n. Your platform appears as a native app generated from your definitions.                                                                                                          |
| 10  | **Slash Commands**              | `SLASH_COMMAND`       | Endpoints callable as slash commands inside Notion, Linear, or Slack. The CLI flag parser already handles this syntax.                                                                                                                                |
| 11  | **QR Code / NFC**               | `QR_VISIBLE`          | Endpoints reachable via QR code or NFC tap with pre-filled parameters and signed tokens. Scan at a venue → check-in fires.                                                                                                                            |
| 12  | **PDF / Document Generation**   | `DOCUMENT_OUTPUT`     | Response fields renderable as PDF documents. Invoice, contract, report - the response schema defines the document structure. No separate template system.                                                                                             |
| 13  | **IoT / MQTT**                  | `IOT_VISIBLE`         | Endpoints exposed as MQTT topics. A sensor publishes, the endpoint validates, the result feeds Vibe Sense. Threshold evaluator detects anomaly, fires an action. The full monitoring chain applies to physical hardware.                              |
| 14  | **AR / Spatial**                | `SPATIAL_VISIBLE`     | Response fields rendered as spatial UI in AR/VR - Apple Vision Pro, Meta Quest, WebXR. Vibe Sense graphs as floating time series in physical space.                                                                                                   |
| 15  | **Print / Label**               | `PRINT_VISIBLE`       | Endpoints that produce structured output renderable as print layouts, shipping labels, or receipts. ZPL for thermal printers, PDF for standard.                                                                                                       |
| 16  | **Watch / Wearable**            | `WEARABLE_VISIBLE`    | Simplified endpoint surfaces for Apple Watch or Wear OS. Single-action endpoints become watch complications. Vibe Sense evaluator signals become glanceable health indicators on the wrist.                                                           |
| 17  | **Game Engine / SDK**           | `GAMEDEV_VISIBLE`     | Endpoints as Unity/Unreal/Godot SDK calls. Leaderboards, player state, matchmaking, analytics - each a typed endpoint. Same definition drives the web admin panel and the game client.                                                                |
| 18  | **Blockchain / Smart Contract** | `ONCHAIN_VISIBLE`     | Endpoint schemas mapped to smart contract ABI. Zod validates on-chain data the same way it validates API payloads. Vibe Sense tracks on-chain events as time series.                                                                                  |
| 19  | **A2A (Agent-to-Agent)**        | `A2A_VISIBLE`         | Endpoints discoverable and callable by external AI agents via the Agent-to-Agent protocol (Google/Linux Foundation). The definition already contains everything an Agent Card needs. Agents negotiate tasks without human intermediation.             |
| 20  | **Remote Tool Rendering**       | -                     | VibeFrame renders a remote endpoint's field-driven UI locally without a local server - the definition travels with the widget. Any NextVibe instance can expose its endpoints as embeddable, fully-interactive widgets on any other site or instance. |

---

### Framework & Ecosystem

| #   | Feature                               | What it does                                                                                                                                                                                                                                                                                                                    |
| --- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Module Store**                      | A registry of NextVibe-compatible GitHub repos - plug-and-play features, integrations, and AI skill packs. Clone a module directly into your instance with one command. Each module is a folder of endpoints. Browse, install, update, remove - like a package manager, but the packages are live features in your codebase.    |
| 2   | **Import-Aware Setup Wizard**         | On first install, the setup wizard scans which imports are actually used and removes modules you didn't select. Choose "e-commerce" and payments, lead journeys, and email campaigns stay. Skip "admin" and that entire tree is cleanly excised. No dead code. No unused routes.                                                |
| 3   | **Module Dependency Graph**           | Static analysis of endpoint imports - knows exactly which files depend on which features. When you remove a module, it tells you every file that needs updating. Safe removals. Safe upgrades.                                                                                                                                  |
| 4   | **Vibe Sense Graph Builder - Polish** | The canvas and node palette are live. Remaining work: inline param editing for all node types, live chart preview while editing, backtest UI with result overlay, mobile-responsive layout.                                                                                                                                     |
| 5   | **Multi-Tenant Support**              | Multiple tenants from one instance. Isolated data, custom branding, per-tenant feature flags, and optionally per-tenant Vibe Sense graphs.                                                                                                                                                                                      |
| 6   | **Plugin API**                        | A stable public API surface for extending NextVibe without forking. Plugins register endpoints, DB tables, seeds, i18n keys, and admin nav items through a declared interface. Enable/disable without touching framework code.                                                                                                  |
| 7   | **Visual Admin Builder**              | Drag-and-drop admin panel construction. Drag endpoint widgets onto a canvas, arrange layouts, save as a named admin page. Output is stored config, not generated code.                                                                                                                                                          |
| 8   | **Vibe UI - Native Parity**           | React Native component parity with the web library. Same types, same props, same behavior - but production-ready on iOS and Android. This is the difference between "runs on native" and "looks native."                                                                                                                        |
| 9   | **Federation - VibeFrame Layer**      | Remote connect already handles instance-to-instance task routing, memory sync, and capability discovery. The remaining piece: VibeFrame rendering remote endpoints from a connected instance without a local server - UI widgets, Vibe Sense graphs, and tools from instance B render natively inside instance A's admin panel. |
| 10  | **Marketplace & Revenue Share**       | Module authors publish to the store, set a price, earn when other instances install. NextVibe handles the licensing check on install. Revenue split between author and the project. The ecosystem funds itself.                                                                                                                 |

---

## License

**GPL-3.0 + MIT** - Framework core is GPL-3.0 (share improvements back). Everything else is MIT.

See [LICENSE](LICENSE) · [CONTRIBUTING.md](CONTRIBUTING.md)

`vibe check` must pass with zero errors and zero: `any`, `unknown`, `object`, `@ts-expect-error`, `as`, `eslint-disable`. Then PR.

---

**Creator:** Marcus Brandstatter ([max@a42.ch](mailto:max@a42.ch)) · **AI Contributors:** Claude Code, Augment, Cursor

[Issues](https://github.com/techfreaque/next-vibe/issues) · [Discussions](https://github.com/techfreaque/next-vibe/discussions)
