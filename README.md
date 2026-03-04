# NextVibe

**Define it once. It exists everywhere.**

One endpoint definition. 10+ platforms. Not generated code that drifts apart — one living contract that the web app, mobile app, CLI, AI agent, MCP server, and cron system all read natively. Change the definition, every platform updates instantly. Delete the folder, the feature ceases to exist everywhere at once.

[![License: GPL-3.0](https://img.shields.io/badge/Framework-GPL--3.0-blue.svg)](LICENSE)
[![License: MIT](https://img.shields.io/badge/App-MIT-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-7_/_TSGO-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)

> **The spiritual successor to WordPress — for the AI era.** Fork it, own it, build your platform. No dependency. No black box. You own every line.

---

## Two Ways to Use NextVibe

**Use it as your personal AI platform.** Fork, deploy, and own your own [unbottled.ai](https://unbottled.ai) — a production-ready AI platform with 42+ models, voice, characters, memories, payments, and an autonomous AI admin (Thea) that runs the platform alongside you. Up and running in 30 seconds.

**Use it as your AI SaaS framework.** NextVibe is the WordPress for the AI era. Build any AI-powered SaaS product on the same foundations: authentication, payments, email, admin panels, background tasks, a full CLI, MCP server, and an AI agent that operates it all autonomously. 245 endpoints already built. Everything else follows the same one-folder pattern.

---

## Quick Start

```bash
# Fork on GitHub, then:
git clone https://github.com/YOUR_USERNAME/next-vibe
cd next-vibe
cp .env.example .env
# Add at minimum: OPENROUTER_API_KEY in .env
# Set a strong ADMIN_PASSWORD before exposing to the internet
bun install
vibe dev
```

`vibe dev` starts PostgreSQL in Docker, creates the database, runs migrations, seeds data, and launches everything. Open `http://localhost:3000`.

### Connect to Central Thea (optional)

Three env vars turn your local instance into a Hermes worker — synced with Central Thea, receiving tasks, executing autonomously:

```env
INSTANCE_ID="hermes"                          # Your unique instance name
THEA_REMOTE_URL="https://your-thea-url.com"   # Central Thea URL
THEA_REMOTE_API_KEY="your-shared-api-key"     # Shared sync key (32+ chars)
```

---

## Why?

WordPress gave everyone the power to publish. But we're not just publishing anymore — we're building AI-powered platforms that need to work across web, mobile, CLI, AI agents, and automation, all at once.

You build a contact form for the web. Then support wants a CLI command to submit tickets. Then the AI agent needs to file issues on behalf of users. Then the mobile app needs the same form. Then someone wants an MCP tool so external agents can reach you. Five implementations of the same thing. Five places to update when the schema changes. Five places where bugs hide.

NextVibe's answer: **describe your feature once and every platform just reads it.**

---

## The Core Idea

What if you described your feature once — its inputs, outputs, validation rules, permissions, UI hints, error types, translations, and examples — and every platform just... read that description and rendered it natively?

That's NextVibe. Your feature **is** its definition. The web form reads it and renders input fields. The CLI reads it and creates flags. The AI agent reads it and gets a function-calling schema. The MCP server reads it and exposes a tool. The cron system reads it and knows how to execute it. Same contract. Same validation. Same types. Same truth.

An AI agent and a human user interact with your product through the exact same interface. There is no "API for humans" and "API for AI." There's just the tool.

### One Definition, Ten Platforms

| #   | Platform          | What it does                                              |
| --- | ----------------- | --------------------------------------------------------- |
| 1   | **Web API**       | RESTful endpoint, full type safety                        |
| 2   | **React UI**      | Data-driven forms and display widgets from the definition |
| 3   | **React Native**  | Same components on iOS/Android — NativeWind + Expo        |
| 4   | **CLI**           | Every endpoint is a command with auto-generated flags     |
| 5   | **CLI Package**   | Ship your CLI as an installable npm package               |
| 6   | **tRPC**          | Type-safe client-server calls, zero config                |
| 7   | **AI Tools**      | OpenAI/Anthropic function-calling schema                  |
| 8   | **MCP Server**    | Model Context Protocol — plug into any AI workflow        |
| 9   | **Remote Skills** | AI-readable skill files for agent discovery               |
| 10  | **Cron Tasks**    | Scheduled execution with instance routing                 |

---

## Zero Context Switching

This is the part that changes how you work.

In a traditional stack, building a feature means touching a dozen files across different paradigms: the API handler, the validation schema, the frontend form, the CLI command, the AI tool spec, the docs. Each has its own conventions, its own file format, its own way of thinking. You spend more time navigating the codebase than writing logic.

In NextVibe, a feature is one folder. Everything about that feature — its contract, its logic, its database schema, its translations, its UI, its tests, its email templates — lives together. You open one folder and you see everything. You close it and you're done.

```
contact/
  definition.ts    — What it does (contract)
  repository.ts    — How it does it (logic)
  route.ts         — Make it available (all platforms)
  i18n/            — What it says (translations)
  email.tsx        — What it sends (transactional email)
  widget.tsx       — How it looks (custom UI)
  db.ts            — What it stores (database schema)
```

There's no "API folder" and "components folder" and "utils folder" that you have to mentally stitch together. The feature is self-contained. Rename the folder and everything moves with it. Delete it and nothing breaks. Add a new field to the definition and it propagates — the web form, the CLI flags, the AI tool schema, the mobile screen, all updated from one change.

This isn't just convenient. It's what makes it possible for an AI agent to build features autonomously. Claude Code doesn't need a mental map of your architecture — it opens one folder, understands the pattern, and works.

---

## AI Is Not a Feature. It's a Team Member.

Most platforms treat AI as an integration — a chatbot widget, an API wrapper. NextVibe is built around a fundamentally different idea: the AI agent is a full participant in your organization, operating through the same contracts as every human.

When Thea (the AI admin) calls your contact form endpoint, she uses the same definition a user sees in their browser. When she creates a task, it goes through the same validation. When she reads a memory, it comes from the same repository. No special API. No privileged backdoor. The same system, the same rules.

This is what makes the Thea/Hermes architecture possible:

### Central Thea + Local Hermes

```
                    CEO / CTO
                       |
                       v
              +------------------+
              |   Central Thea   |  (Production Server)
              |   unbottled.ai   |
              +--------+---------+
                       |
           +-----------+-----------+
           |                       |
    +------+-------+       +------+-------+
    |   Hermes     |       |   Hermes     |   (Developer machines)
    | Dev Instance |       | Dev Instance |
    |  localhost   |       |  localhost   |
    +--------------+       +--------------+
```

**Central Thea** lives on production. She talks to users, monitors the platform, manages tasks, and coordinates work. The CEO/CTO directs her. She's not an assistant — she's the AI team lead.

**Hermes** is the local worker. Every developer runs their own instance. It syncs with Central Thea, pulls tasks assigned to it, executes them via Claude Code, and reports back. Each developer has a dedicated AI pair programmer that takes direction from the central intelligence.

The flow is natural: the CEO creates a task on Thea — "refactor the payment flow" — routes it to Max's Hermes. Hermes picks it up, Claude Code executes, results sync back. Max reviews, iterates, ships. No Jira ticket. No standup. The work just flows.

### Task Routing

- Each instance has a unique `INSTANCE_ID` — `"hermes-max"`, `"hermes-laura"`, `"thea-prod"`
- Tasks carry a `targetInstance` — `null` means host only, a name targets that specific machine
- Hermes instances poll Central Thea automatically — tasks arrive without manual coordination
- The CEO/CTO creates work on Central Thea, it propagates to the right developer's machine

### What Thea Can Do

She has everything she needs to operate the platform:

- **42+ AI models** — Claude, GPT, Gemini, DeepSeek, Llama, Mistral, and more
- **Characters** — Different personas with their own prompts and behavior
- **Memories** — Persistent context that grows across conversations
- **Tools** — Call any endpoint as a function, same contracts as the UI
- **Tasks** — Schedule work, route it to instances, track execution
- **MCP** — Connect to external tools via Model Context Protocol
- **Voice** — Real-time speech with text-to-speech and speech-to-text

---

## All Interfaces, Documented

### Web & React UI

Every definition automatically renders as a web form and data display via `EndpointsPage`. No separate component needed — the definition contains field types, layouts, labels, and validation. Custom `widget.tsx` files override the auto-render when needed.

Platform access: controlled via `allowedRoles`. `WEB_OFF` disables web access.

### REST API (Next.js)

`route.ts` wires the definition to a Next.js App Router handler via `endpointsHandler()`. The same Zod schema validates HTTP requests and responses. Authentication, error handling, and logging are handled automatically.

### React Native

`.native.ts` override files (e.g. `repository.native.ts`) provide platform-specific implementations while sharing the same Zod schemas and type contracts. NativeWind 5 + Expo Router.

### CLI

Every endpoint becomes a CLI command automatically. Flags are generated from the definition's request schema.

```bash
vibe help                    # List all commands
vibe web-search "quantum computing"
vibe contact --name="Jane" --message="Hello"
vibe threads --interactive   # Prompt mode
```

`--interactive` mode prompts for each field. Reserved flags: `--output`, `--verbose`, `--debug`, `--locale`, `--interactive`, `--dry-run`, `--user-type`.

Platform access: `CLI_OFF` disables CLI access. `CLI_AUTH_BYPASS` allows unauthenticated CLI use.

### CLI Package

Ship your entire endpoint collection as an installable npm package. Users get your CLI, your platform's commands, your definitions — all in one `npm install`.

### tRPC

All endpoints are automatically exposed as type-safe tRPC procedures. Consume from React with full TypeScript inference. Zero configuration beyond the definition.

### AI Tools (Function Calling)

Endpoints are automatically converted to OpenAI/Anthropic function-calling schemas. Add `AI_TOOL_OFF` to `allowedRoles` to exclude an endpoint from AI tool discovery.

### MCP Server (Model Context Protocol)

Start a full MCP server that exposes all permitted endpoints as tools:

```bash
vibe mcp          # Start MCP server
```

Configure Claude Desktop or any MCP-compatible client via `.mcp.json`. Add `MCP_VISIBLE` to `allowedRoles` to opt-in to MCP tool discovery.

### Remote Skills (AGENT.md)

Mark endpoints with `REMOTE_SKILL` in `allowedRoles` to have them appear in AI-readable skill markdown files:

- `AGENT.md` — All agent-accessible skills
- `PUBLIC_USER_SKILL.md` — Skills for public (unauthenticated) users
- `USER_WITH_ACCOUNT_SKILL.md` — Skills for authenticated users

These files are auto-generated from endpoint definitions and consumed by AI agents for capability discovery.

### Cron Tasks / The Pulse

The pulse is the platform's heartbeat — a cron runner that keeps everything alive. Works on Vercel, self-hosted, or local dev — no extra infrastructure needed.

**System tasks** are defined in the codebase — task sync, cleanup, health checks. **User-created tasks** live in the database. Agents can create them. Admins can through the UI.

Tasks run via `Platform.CRON`, which behaves like `Platform.AI` for permissions. Instance routing (`targetInstance`) ensures tasks run on the right machine.

### Vibe Frame — Embed Anywhere

**Vibe Frame** lets you embed any endpoint as an isolated iframe on any website — your marketing site, a third-party page, anywhere with a `<script>` tag.

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

**Display modes:** `inline`, `modal`, `slideIn`, `bottomSheet`

**Trigger modes:** `immediate`, `scroll`, `time`, `exitIntent`, `click`

**Callbacks:** `onReady`, `onSuccess`, `onError`, `onClose`, `onNavigate`, `onAuthRequired`

The frame communicates with its host via a type-safe `postMessage` bridge (all messages prefixed `vf:`). Auth tokens, theme updates, and form pre-fill can be pushed from the host at any time.

Test and generate embed code at `/admin/vibe-frame`.

Platform access: `CLI_OFF` and `AI_TOOL_OFF` are standard — the embed runs on the same `NEXT_API` platform.

### WebSocket Events

Endpoints can declare typed WebSocket events for real-time updates:

```typescript
const { GET } = createEndpoint({
  events: {
    contentDelta: z.object({ delta: z.string() }),
    contentDone: z.object({ content: z.string() }),
  },
  // ...
});
```

The WebSocket server runs on a separate port (dev: 4000, prod: 4001). Pub/sub via in-process adapter (local dev) or Redis (multi-instance prod). Consume on the client with `useWidgetEvents()`.

---

## The Pattern

Every feature is a folder. You need three files to exist on all ten platforms. Everything else you add as the feature grows.

### Required

```
definition.ts    — The contract. Schemas, fields, validation, permissions, examples.
repository.ts    — The logic. Database operations, business rules. Returns success or failure, never throws.
route.ts         — The bridge. Wires the contract to the logic, exposes it to all platforms.
```

### Optional — Add What You Need

```
i18n/            — Translations. Scoped per feature, type-checked at compile time.
hooks.ts         — React hooks for client-side data fetching.
widget.tsx       — Custom UI widget when the auto-generated form isn't enough.
widget.cli.tsx   — CLI/MCP override widget (Ink components) when terminal display needs customization.
db.ts            — Database schema. Drizzle table definitions, lives next to the feature that owns it.
enum.ts          — Domain enums with i18n labels. One pattern, used everywhere.
seeds.ts         — Seed data for production, development and testing.
email.tsx        — React Email template. Transactional emails tied to the feature.
task.ts          — Cron task definition. Scheduled work tied to the feature.
env.ts           — Domain-specific environment variables.
repository.native.ts — React Native override for platform-specific implementations.
```

The folder structure mirrors your API:

```
src/app/api/[locale]/
  user/
    public/
      login/          -> POST /api/en-GLOBAL/user/public/login
      signup/         -> POST /api/en-GLOBAL/user/public/signup
    private/
      me/             -> GET  /api/en-GLOBAL/user/private/me
  agent/
    chat/
      threads/        -> GET/POST /api/en-GLOBAL/agent/chat/threads
```

Delete `user/private/me` and the user profile feature disappears — from the web, the CLI, the AI tools, the mobile app, everywhere. No orphaned code. No dead routes. No cleanup.

### What a Definition Looks Like

```typescript
// contact/definition.ts
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["contact"],
  title: "title",
  description: "description",
  category: "category",
  icon: "mail",
  aliases: ["contact-form"],
  tags: ["tags.contactForm", "tags.helpSupport"],
  allowedRoles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN],

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    usage: { request: "data", response: true } as const,
    children: {
      name: scopedRequestField(scopedTranslation, {
        schema: z.string().min(2),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "form.fields.name.label",
      }),
      message: scopedRequestField(scopedTranslation, {
        schema: z.string().min(10),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "form.fields.message.label",
      }),
      success: scopedResponseField(scopedTranslation, {
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

From this one file: the web renders a contact form. The CLI creates `vibe contact-form --name="Jane" --message="..."`. The AI gets a function-calling schema. The MCP server exposes a tool. Validation and permissions — identical on every platform.

### What the Route Looks Like

```typescript
// contact/route.ts — real code, complete
export const { POST, tools } = endpointsHandler({
  endpoint: contactEndpoints,
  [Methods.POST]: {
    email: [{ render: renderCompanyMail, ignoreErrors: false }],
    handler: ({ data, user, locale, logger, t }) =>
      ContactRepository.submitContactForm(data, user, locale, logger, t),
  },
});
```

`endpointsHandler` handles validation, auth, error handling, and exposes to all ten platforms. No boilerplate.

### Platform Access Control

Control which platforms can access each endpoint via `allowedRoles`:

```typescript
allowedRoles: [
  UserRole.PUBLIC,      // Who can call it (user permissions)
  UserRole.CUSTOMER,
  UserRole.CLI_OFF,     // Block on CLI + MCP
  UserRole.AI_TOOL_OFF, // Block as AI tool
  UserRole.MCP_VISIBLE, // Opt-in: appear in MCP tool list
  UserRole.REMOTE_SKILL, // Opt-in: appear in AGENT.md skill files
  UserRole.PRODUCTION_OFF, // Disable in production
] as const,
```

User roles: `PUBLIC`, `CUSTOMER`, `PARTNER_ADMIN`, `PARTNER_EMPLOYEE`, `ADMIN`

Platform markers (config only, never stored in DB): `CLI_OFF`, `AI_TOOL_OFF`, `WEB_OFF`, `MCP_OFF`, `MCP_VISIBLE`, `REMOTE_SKILL`, `CLI_AUTH_BYPASS`, `PRODUCTION_OFF`

---

## Recursive Simplicity

There's one pattern. It applies everywhere. Learn it once, build anything.

Every feature follows the same three-file structure whether it's a simple contact form or a complex AI chat system with branching conversations. The contact form has `definition.ts`, `repository.ts`, `route.ts`. The AI chat system has the same three files — it just has more optional files alongside them (`db.ts`, `hooks.ts`, `widget.tsx`, `i18n/`).

This is what "recursive" means in practice: the pattern nests. A chat thread contains messages. Messages contain attachments. Each is its own folder with the same three files. The complexity lives in the nesting, not in the pattern. You never learn a new way of doing things — you just go deeper.

This is also why AI agents can build features in this codebase. The pattern is so consistent that there's no ambiguity about where code goes or what it should look like. Show an AI agent one example and it can build the next hundred.

---

## Type Safety That Actually Means Something

Most projects claim "full type safety" and mean they use TypeScript. NextVibe means something different:

- **Translations are type-checked.** `t("contact.form.fields.name.label")` compiles. `t("typo.here")` is a TypeScript error. Across three languages.
- **Error types are exhaustive.** Every endpoint declares exactly which errors it can return. Miss one, the compiler complains.
- **Schemas flow end-to-end.** The Zod schema in the definition validates the API request and response, types the React hooks, generates the CLI flags, and constrains the AI tool schema. One schema, zero drift.
- **`vibe check` is one command.** Oxlint + ESLint + TypeScript. You can't run lint without types or types without lint. AI agents can't skip half the checks.

232 endpoints. 750,000+ lines. Zero `any`. Zero `unknown` casts. Zero runtime type errors.

---

## Unbottled.ai — The Flagship

NextVibe is the engine. **Unbottled.ai** is the product.

Like WordPress.org and WordPress.com — NextVibe is the open-source platform anyone can fork and deploy. Unbottled.ai is our deployment: a production AI platform serving real users, proving the pattern works at scale.

Free speech AI — 42+ models, user-controlled content filtering. Users choose their own censorship level, not a corporation.

- **AI Chat** — Multi-model conversations with branching message trees, characters, persistent memories, curated favorites
- **Payments** — Stripe + NowPayments (crypto), credit system, referral program with earnings tracking
- **Communication** — React Email templates, full SMTP/IMAP client, automated email campaigns
- **Lead System** — Journey-based workflows, CSV batch import, engagement analytics
- **Admin** — Data-driven panels auto-generated from definitions, database studio, health monitoring, cron dashboard

Every feature in Unbottled.ai is built with the same definition pattern described above. The AI chat system, the payment flow, the email campaigns — all folders with `definition.ts`, `repository.ts`, `route.ts`. No special cases. No escape hatches.

### The Numbers

| Metric                           | Value          |
| -------------------------------- | -------------- |
| TypeScript files                 | 4,400+         |
| Lines of code                    | 750,000+       |
| Endpoint definitions             | 232            |
| Platform interfaces per endpoint | Up to 10       |
| Database tables                  | 25+            |
| Languages (compile-time checked) | 3 (en, de, pl) |
| Runtime type errors              | 0              |

---

## Tech Stack

| Layer      | Technology                                                        |
| ---------- | ----------------------------------------------------------------- |
| Runtime    | Bun                                                               |
| Language   | TypeScript 7 / TSGO (strict mode)                                 |
| Web        | Next.js 16 (App Router), React 19, Tailwind CSS 4, shadcn like ui |
| Mobile     | React Native, NativeWind 5, Expo Router                           |
| API        | tRPC 11, REST — generated from definitions                        |
| Database   | PostgreSQL + Drizzle ORM                                          |
| Validation | Zod — one schema, all platforms                                   |
| AI         | OpenAI, Anthropic, Google AI, OpenRouter (42+ models)             |
| MCP        | Model Context Protocol server                                     |
| Quality    | Vibe checker (Oxlint + ESLint + TypeScript)                       |
| Email      | React Email + SMTP/IMAP                                           |
| Payments   | Stripe, NowPayments                                               |

---

## Vibe CLI

Every endpoint is also a CLI command. Plus the usual dev tools:

```bash
vibe dev                    # Start everything (add -r to reset the database)
vibe build                  # Build for production
vibe start                  # Start production server & cron tasks
vibe rebuild                # Rebuild & hot-restart production (zero-downtime)

vibe check                  # Lint + typecheck, one command
vibe check src/path         # Check specific area

vibe help                   # List all commands

# Database tools
vibe migrate                # Run migrations
vibe migrate --generate     # Generate from schema changes
vibe seed                   # Seed database
vibe reset                  # Drop + migrate + seed
vibe studio                 # Drizzle Studio (DB GUI)
vibe sql "SELECT ..."       # Raw SQL

# Any endpoint, as a CLI command:
vibe web-search "What is quantum computing?"
vibe contact --name="Jane" --message="Hello"

# MCP server
vibe mcp                    # Start MCP server
vibe mcp --verbose          # With debug logging
```

---

## Docs

- **[Full Documentation Index](docs/README.md)**
- **[Quick Start](docs/guides/quickstart.md)**
- **[Definitions](docs/patterns/definition.md)**
- **[Repository](docs/patterns/repository.md)**
- **[Database](docs/patterns/database.md)**
- **[i18n](docs/patterns/i18n.md)**
- **[Widget (Web)](docs/patterns/widget.md)**
- **[Widget (CLI/MCP)](docs/patterns/widget.cli.md)**
- **[Hooks](docs/patterns/hooks.md)**
- **[Enums](docs/patterns/enum.md)**
- **[Tasks](docs/patterns/tasks.md)**
- **[Logger](docs/patterns/logger.md)**
- **[Email](docs/patterns/email.md)**
- **[Seeds](docs/patterns/seeds.md)**
- **[React Native](docs/patterns/repository.native.md)**

---

## License

**GPL-3.0 + MIT** — Framework core is GPL-3.0 (share improvements). Everything else is MIT (do whatever you want).

See [LICENSE](LICENSE).

---

## Contributing

Fork. Branch. Build. `vibe check` (zero errors and zero: `any`, `unknown`, `object`, `@ts-expect-error`, `as`, `eslint-disable`). PR.

See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## Team

**Creator:** Marcus Brandstatter ([max@a42.ch](mailto:max@a42.ch))

**AI Contributors:** Claude Code, Augment, Cursor

**Support:** [Issues](https://github.com/techfreaque/next-vibe/issues) / [Discussions](https://github.com/techfreaque/next-vibe/discussions) / max@a42.ch
