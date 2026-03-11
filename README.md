# NextVibe

**Define it once. It exists everywhere.**

One endpoint definition. 13 platforms. Not generated code that drifts — one living contract that the web app, mobile app, CLI, AI agent, MCP server, and cron system all read natively. Change the definition, every platform updates instantly. Delete the folder, the feature ceases to exist everywhere at once.

[![License: GPL-3.0](https://img.shields.io/badge/Framework-GPL--3.0-blue.svg)](LICENSE)
[![License: MIT](https://img.shields.io/badge/App-MIT-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-7_/_TSGO-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)

> **The spiritual successor to WordPress — for the AI era.** Fork it, own it, build your platform. No vendor lock-in. No black box. You own every line.

---

## Getting Started

### Step 1 — Pick an AI Provider

You need one of these. Both can run simultaneously.

**Option A: Claude Code** _(recommended — no API key needed)_

If you have a Claude subscription and the [Claude Code CLI](https://claude.ai/code), sign in once:

```bash
claude login
```

Then select any `claude-code-*` model in the model selector. Claude Code integrates two ways:

- **As a model provider** — Thea uses your local Claude session as her AI brain (Haiku / Sonnet / Opus), billed to your existing subscription.
- **As a tool** — Thea can spawn Claude Code to execute tasks silently in the background or interactively so you can stay in the loop.

**Option B: OpenRouter** _(200+ models, pay per use)_

Add to your `.env`:

```
OPENROUTER_API_KEY="sk-or-v1-..."   # openrouter.ai/keys
```

Gives you Claude, ChatGPT, Gemini, Llama, Mistral, DeepSeek, and everything else.

---

### Step 2 — Choose Your Setup

---

#### 1. AI-Powered Workstation — Your Always-On Agent

Run NextVibe on hardware you already own: a VPS, a Mac Mini, a home server. Thea runs 24/7 with shell access, knows your codebase, monitors the platform, and delegates work to Claude Code while you sleep. No SaaS bill. You own the compute.

**Requirements:** Git, Bun, Docker

```bash
git clone https://github.com/techfreaque/next-vibe
cd next-vibe
cp .env.example .env
# Set VIBE_ADMIN_USER_PASSWORD + your AI provider (see above)
bun install
vibe build && vibe start
```

`vibe start` runs the production server and the pulse (cron heartbeat). Point Caddy/nginx at port 3000 to expose it, or use it locally as-is.

```bash
vibe rebuild   # apply code changes — rebuild + hot-restart, zero downtime
```

---

#### 2. Self-Hosted Platform — The WordPress Route

Full production deployment on your own domain. Works on any VPS. Scales to Kubernetes when you need it.

**Requirements:** Git, Bun, Docker, a domain

```bash
git clone https://github.com/techfreaque/next-vibe
cd next-vibe
cp .env.example .env
# Set VIBE_ADMIN_USER_PASSWORD + your AI provider (see above)
bash scripts/install-docker.sh   # installs Docker if needed
vibe build && vibe start
# Point Caddy / nginx at port 3000 — done
```

**Kubernetes:** edit `k8s/secret.yaml` with your env vars, then `kubectl apply -k k8s/`. Templates for web deployment, task workers, Redis, ingress, and namespace are included.

**Connect your local machine** so Thea can reach your dev tools and route tasks to your laptop:

```bash
vibe remote-connect --instance-id=hermes --remote-url=https://your-domain.com --email=you@example.com --password=...
```

Memories and tasks sync every 60 seconds in both directions. No port forwarding, no VPN — the local instance initiates the connection on the pulse.

---

#### 3. Local Development — Build Your Own SaaS

Fork, build, ship. Hot reload, isolated database, instant iteration. Your local instance stays in sync with production for task and memory sync — no public IP or open ports needed. Test fixes locally, deploy when clean.

**Requirements:** Git, Bun, Docker

```bash
git clone https://github.com/YOUR_USERNAME/next-vibe
cd next-vibe
cp .env.example .env
# Set VIBE_ADMIN_USER_PASSWORD + your AI provider (see above)
bun install
vibe dev
```

`vibe dev` starts PostgreSQL in Docker, runs migrations, seeds data, and launches the dev server with hot reload. Open `http://localhost:3000`.

```bash
vibe check     # lint + typecheck during development
vibe rebuild   # push to production — runs check, rebuild + hot-restart
```

---

## Why?

WordPress gave everyone the power to publish. But we're not just publishing anymore — we're building platforms that need to work across web, mobile, CLI, AI agents, and automation, all at once.

You build a contact form. Then support wants a CLI command. Then the AI agent needs to file tickets. Then the mobile app needs the same form. Then someone wants an MCP tool. Five implementations. Five places to update. Five places where bugs hide.

**NextVibe's answer: describe your feature once and every platform just reads it.**

---

## The Core Idea

What if you described your feature once — its inputs, outputs, validation rules, permissions, UI hints, error types, translations, and examples — and every platform just rendered it natively?

That's NextVibe. Your feature **is** its definition. The web form reads it and renders fields. The CLI reads it and creates flags. The AI agent reads it and gets a function-calling schema. The MCP server reads it and exposes a tool. Same contract. Same validation. Same types. Same truth.

There is no "API for humans" and "API for AI." There's just the tool.

### One Definition, Many Platforms

| #   | Platform             | Status          | What it does                                                                         |
| --- | -------------------- | --------------- | ------------------------------------------------------------------------------------ |
| 1   | **Web API**          | ✅ Production   | RESTful endpoint, full type safety                                                   |
| 2   | **React UI**         | ✅ Production   | Data-driven forms and display widgets from the definition                            |
| 3   | **tRPC**             | ⏸ Inactive      | Type-safe client-server calls — available but unused, replaced by a custom RPC layer |
| 4   | **CLI**              | ✅ Production   | Every endpoint is a command with auto-generated flags                                |
| 5   | **CLI Package**      | ✅ Production   | Ship your CLI as an installable npm package                                          |
| 6   | **AI Tools**         | ✅ Production   | OpenAI/Anthropic function-calling schema                                             |
| 7   | **MCP Server**       | ✅ Production   | Model Context Protocol — plug into any AI workflow                                   |
| 8   | **Remote Skills**    | 🚧 Beta         | AI-readable skill files for agent capability discovery                               |
| 9   | **Cron / Pulse**     | ✅ Production   | Scheduled execution with per-instance task routing                                   |
| 10  | **WebSocket Events** | ✅ Production   | Real-time pub/sub — in-process or Redis for scale                                    |
| 11  | **React Native**     | 🚧 Beta         | Same contract on iOS/Android — NativeWind 5 + Expo Router                            |
| 12  | **Electron**         | 🚧 Beta         | Desktop app — macOS, Linux, Windows from the same build                              |
| 13  | **Vibe Frame**       | 🧪 Experimental | Embed any endpoint as an iframe widget on any website                                |

---

## One Folder Per Feature

In a traditional stack, a feature touches a dozen files across different paradigms. Each has its own conventions. You spend more time navigating than writing.

In NextVibe, a feature is one folder. Everything lives together:

```
contact/
  definition.ts    - What it does (contract)
  repository.ts    - How it does it (logic)
  route.ts         - Makes it available on all platforms
  i18n/            - What it says (translations)
  widget.tsx       - How it looks (custom UI)
  email.tsx        - What it sends (transactional email)
  db.ts            - What it stores (database schema)
```

Rename the folder and everything moves with it. Delete it and nothing breaks. Add a field to the definition and it propagates — the web form, CLI flags, AI tool schema, and mobile screen all update from one change.

This is also what makes AI-assisted development actually work. Claude Code opens one folder, understands the pattern, and builds. No mental map of your architecture required.

---

## AI Is Not a Feature. It's a Team Member.

Most platforms treat AI as an integration — a chatbot widget bolted on. NextVibe is built around a different idea: the AI agent is a full participant, operating through the same contracts as every human.

When Thea calls your contact form endpoint, she uses the same definition a user sees in their browser. Same validation. Same permissions. No special API. No privileged backdoor.

### Central Thea + Local Hermes

```
                    CEO / CTO
                       |
                       v
              +------------------+
              |   Central Thea   |  (Production — unbottled.ai)
              |   cloud AI admin |
              +--------+---------+
                       |  remote connection (sync every 60s)
           +-----------+-----------+
           |                       |
    +------+-------+       +------+-------+
    |   Hermes     |       |   Hermes     |   (Developer machines)
    | Dev Instance |       | Dev Instance |
    +--------------+       +--------------+
```

**Central Thea** lives on production. She talks to users, manages tasks, and coordinates work. She's not an assistant — she's the AI team lead.

**Hermes** is the local worker. Connect your machine via `vibe remote-connect`. The pulse syncs memories, capabilities, and tasks every 60 seconds. Thea discovers local tools via `help(instanceId="hermes")`, executes them remotely, and routes Claude Code tasks to the right machine.

The flow: the CEO creates a task on Thea, routes it to Max's Hermes. Hermes picks it up, Claude Code executes, results sync back. No Jira. No standup. The work just flows.

- Each instance has a unique `instanceId` — set at connect time
- Tasks carry `targetInstance` — `null` means host only, a name targets that machine
- Local instances pull from cloud on the pulse — no polling infrastructure needed

**What Thea can do:** 42+ AI models · Characters · Persistent memories · Tool calling (any endpoint) · Task scheduling · MCP · Voice (TTS + STT)

---

## The Pattern

Every feature is a folder. Three files to exist on all 13 platforms. Add more as the feature grows.

### Required

```
definition.ts    - The contract: schemas, fields, validation, permissions, examples.
repository.ts    - The logic: DB operations and business rules. Returns success/failure, never throws.
route.ts         - The bridge: wires contract to logic, exposes to all platforms.
```

### Optional — Add What You Need

| File                     | What it's for                                                                                                                                                                                                                                                                                      |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `widget.tsx` / `widget/` | Custom UI widget. Without this file the definition drives rendering automatically. Add it only when you need full control over the layout. Use the folder variant when the widget needs multiple sub-components.                                                                                   |
| `widget.cli.tsx`         | CLI/MCP terminal override using Ink components. Without this file the definition drives terminal rendering automatically.                                                                                                                                                                          |
| `hooks.ts` / `hooks/`    | React hooks for client-side data fetching and mutations. Use the folder variant when many hooks are needed.                                                                                                                                                                                        |
| `repository-client.ts`   | Client-side logic that runs in the browser: localStorage/AsyncStorage mirror of the server repository (incognito/offline), shared pure-computation helpers used across widgets and hooks, or platform-agnostic storage abstraction. Static class, same `ResponseType<T>` convention as the server. |
| `route-client.ts`        | Wires `repository-client.ts` into the endpoint system so `useEndpoint()` works transparently without a server round-trip. Only needed when the definition uses `allowedClientRoles` or `useClientRoute`.                                                                                           |
| `db.ts`                  | Drizzle table definitions, co-located next to the feature that owns them.                                                                                                                                                                                                                          |
| `enum.ts`                | Domain enums with i18n labels.                                                                                                                                                                                                                                                                     |
| `seeds.ts`               | Seed data for production, development, and testing.                                                                                                                                                                                                                                                |
| `email.tsx`              | React Email template for transactional emails.                                                                                                                                                                                                                                                     |
| `task.ts`                | Scheduled cron task — thin wrapper that calls `repository.ts` for all logic. Exports a `Task[]` with name, schedule, timeout, and `maxConcurrent: 1`. Runs via the pulse in production. Use `side-task.ts` for continuous background operations that run parallel to the server.                   |
| `repository.native.ts`   | React Native override with the same class name and type contract as `repository.ts`, but calls the server via `nativeEndpoint()` instead of hitting the DB directly. Methods needed in `page.tsx` are implemented; everything else throws loudly so missing implementations surface immediately.   |
| `i18n/`                  | Scoped translations: `en/`, `de/`, `pl/` subdirs + `index.ts`.                                                                                                                                                                                                                                     |

### Folder Structure

```
src/app/api/[locale]/
  user/
    public/
      login/     -> POST /api/en-GLOBAL/user/public/login
      signup/    -> POST /api/en-GLOBAL/user/public/signup
    private/
      me/        -> GET  /api/en-GLOBAL/user/private/me
  agent/
    chat/
      threads/   -> GET/POST /api/en-GLOBAL/agent/chat/threads
```

Delete `user/private/me` and the feature disappears everywhere — web, CLI, AI tools, mobile. No orphaned code, no dead routes, no cleanup.

---

## What the Code Looks Like

### definition.ts

```typescript
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["contact"],
  title: "title",
  description: "description",
  icon: "mail",
  aliases: ["contact-form"],
  tags: ["tags.contactForm"],
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
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
    // ... all 9 error types — exhaustive, compiler enforced
  },
  successTypes: { title: "success.title", description: "success.description" },
  examples: {
    requests: { default: { name: "Jane Smith", message: "Hello!" } },
    responses: { default: { success: "Thank you!" } },
  },
});
```

From this one file: the web renders a form. The CLI creates `vibe contact-form --name="Jane" --message="..."`. The AI gets a function-calling schema. The MCP server exposes a tool. Validation and permissions — identical on every platform.

### route.ts

```typescript
// The entire route — this is all of it
export const { POST, tools } = endpointsHandler({
  endpoint: contactEndpoints,
  [Methods.POST]: {
    email: [{ render: renderCompanyMail, ignoreErrors: false }],
    handler: ({ data, user, locale, logger, t }) =>
      ContactRepository.submitContactForm(data, user, locale, logger, t),
  },
});
```

`endpointsHandler` handles validation, auth, error handling, and exposure to all 13 platforms.

### Platform Access Control

```typescript
allowedRoles: [
  UserRole.PUBLIC, // who can call it
  UserRole.CUSTOMER,
  UserRole.CLI_OFF, // block CLI + MCP
  UserRole.AI_TOOL_OFF, // block AI tool discovery
  UserRole.MCP_VISIBLE, // opt-in: appear in MCP tool list
  UserRole.REMOTE_SKILL, // opt-in: appear in AGENT.md skill files
  UserRole.PRODUCTION_OFF, // disable in production
];
```

User roles: `PUBLIC`, `CUSTOMER`, `PARTNER_ADMIN`, `PARTNER_EMPLOYEE`, `ADMIN`

Platform markers (never stored in DB): `CLI_OFF`, `AI_TOOL_OFF`, `WEB_OFF`, `MCP_OFF`, `MCP_VISIBLE`, `REMOTE_SKILL`, `CLI_AUTH_BYPASS`, `PRODUCTION_OFF`

---

## Platform Reference

**Web & React UI** — Definitions auto-render as forms and data displays via `EndpointsPage`. Override with `widget.tsx`. Disable with `WEB_OFF`.

**REST API** — `endpointsHandler()` wires to Next.js App Router. Same Zod schema validates requests and responses. Auth, error handling, and logging automatic.

**tRPC** _(inactive)_ — Endpoints can be exposed as type-safe tRPC procedures. Currently unused — the platform runs a custom RPC layer instead — but the integration is there if you want it.

**CLI** — Every endpoint is a CLI command. Flags from the request schema. `--interactive` mode prompts for each field. Reserved flags: `--output`, `--verbose`, `--debug`, `--locale`, `--interactive`, `--dry-run`, `--user-type`. Disable with `CLI_OFF`, allow unauthed use with `CLI_AUTH_BYPASS`.

**CLI Package** — Ship your endpoint collection as an installable npm package.

**AI Tools** — Auto-converted to OpenAI/Anthropic function-calling schemas. Exclude with `AI_TOOL_OFF`.

**MCP Server** — `vibe mcp` starts a full MCP server. Configure via `.mcp.json`. Opt endpoints in with `MCP_VISIBLE`.

**Remote Skills** — Mark with `REMOTE_SKILL` to appear in auto-generated `AGENT.md`, `PUBLIC_USER_SKILL.md`, and `USER_WITH_ACCOUNT_SKILL.md` files.

**Cron / Pulse** — Heartbeat cron runner, works on Vercel, self-hosted, or local dev. System tasks in code, user tasks in the database. Instance routing via `targetInstance`.

**WebSocket Events** — Declare typed events in the definition:

```typescript
events: {
  contentDelta: z.object({ delta: z.string() }),
  contentDone: z.object({ content: z.string() }),
}
```

Separate port (dev: 4000, prod: 4001). In-process pub/sub locally, Redis for multi-instance. Consume with `useWidgetEvents()`.

**React Native** _(Beta)_ — `.native.ts` overrides share the same Zod contracts. NativeWind 5 + Expo Router.

**Electron** _(Beta)_ — macOS (DMG), Linux (AppImage), Windows (NSIS) from `vibe build` + `electron-builder`.

**Vibe Frame** _(Experimental)_ — Embed any endpoint as an iframe on any website:

```html
<script src="https://unbottled.ai/vibe-frame.js"></script>
<script>
  VibeFrame.mount({
    serverUrl: "https://unbottled.ai",
    endpoint: "contact_POST",
    target: "#my-widget",
    theme: "dark",
    trigger: { type: "scroll", scrollPercent: 50 },
  });
</script>
```

Display modes: `inline`, `modal`, `slideIn`, `bottomSheet`. Trigger modes: `immediate`, `scroll`, `time`, `exitIntent`, `click`. Type-safe `postMessage` bridge. Generate embed code at `/admin/vibe-frame`.

---

## Type Safety That Actually Means Something

- **Translations are type-checked.** `t("contact.form.fields.name.label")` compiles. `t("typo.here")` is a compiler error. Across three languages.
- **Error types are exhaustive.** Every endpoint declares which errors it can return. Miss one, the compiler complains.
- **Schemas flow end-to-end.** One Zod schema validates the API, types the React hooks, generates CLI flags, and constrains the AI tool schema. Zero drift.
- **`vibe check` is one command.** Oxlint + ESLint + TypeScript together. AI agents can't skip half the checks.

245 endpoints. 750,000+ lines. Zero `any`. Zero `unknown` casts. Zero runtime type errors.

---

## Unbottled.ai — The Flagship

NextVibe is the engine. **[Unbottled.ai](https://unbottled.ai)** is the product — like WordPress.org vs WordPress.com. Fork and deploy your own, or use ours.

Free speech AI — 42+ models, user-controlled content filtering. Users choose their own censorship level.

- **AI Chat** — Multi-model, branching message trees, characters, memories, curated favorites
- **Payments** — Stripe + NowPayments (crypto), credits, referral program
- **Communication** — React Email, full SMTP/IMAP client, automated campaigns
- **Lead System** — Journey workflows, CSV import, engagement analytics
- **Admin** — Auto-generated panels, database studio, health monitoring, cron dashboard

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
| API        | tRPC 11, REST — generated from definitions                        |
| Database   | PostgreSQL + Drizzle ORM                                          |
| Validation | Zod — one schema, all platforms                                   |
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
vibe check src/path         # check a specific area

# Database
vibe migrate                # run pending migrations
vibe migrate --generate     # generate from schema changes
vibe seed / vibe reset      # seed / drop + migrate + seed
vibe studio                 # Drizzle Studio (browser DB GUI)
vibe sql "SELECT ..."       # raw SQL

# Any endpoint as a command
vibe web-search "quantum computing"
vibe contact --name="Jane" --message="Hello"

# MCP + remote
vibe mcp                    # start MCP server
vibe remote-connect --instance-id=hermes --remote-url=https://... --email=... --password=...
vibe help                   # list everything
```

---

## Docs

- **[Full Documentation Index](docs/README.md)**
- **[Quick Start](docs/guides/quickstart.md)**
- **[Definition](docs/patterns/definition.md)** · **[Repository](docs/patterns/repository.md)** · **[Route](docs/patterns/route.md)** · **[Database](docs/patterns/database.md)**
- **[i18n](docs/patterns/i18n.md)** · **[Enum](docs/patterns/enum.md)** · **[Seeds](docs/patterns/seeds.md)** · **[Logger](docs/patterns/logger.md)**
- **[Widget (Web)](docs/patterns/widget.md)** · **[Widget (CLI/MCP)](docs/patterns/widget.cli.md)** · **[Hooks](docs/patterns/hooks.md)**
- **[Email](docs/patterns/email.md)** · **[Tasks](docs/patterns/tasks.md)** · **[React Native](docs/patterns/repository.native.md)** · **[Client Repository](docs/patterns/repository.client.md)**

---

## License

**GPL-3.0 + MIT** — Framework core is GPL-3.0 (share improvements back). Everything else is MIT.

See [LICENSE](LICENSE) · [CONTRIBUTING.md](CONTRIBUTING.md)

`vibe check` must pass with zero errors and zero: `any`, `unknown`, `object`, `@ts-expect-error`, `as`, `eslint-disable`. Then PR.

---

**Creator:** Marcus Brandstatter ([max@a42.ch](mailto:max@a42.ch)) · **AI Contributors:** Claude Code, Augment, Cursor

[Issues](https://github.com/techfreaque/next-vibe/issues) · [Discussions](https://github.com/techfreaque/next-vibe/discussions)
