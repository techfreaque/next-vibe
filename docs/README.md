# NextVibe Documentation

Complete documentation for the NextVibe framework.

## Getting Started

- **[Quick Start](guides/quickstart.md)** - Get up and running in 5 minutes
- **[Main README](../README.md)** - Framework overview, all interfaces, key concepts
- **[Unbottled.ai Example](examples/unbottled-ai/UNBOTTLED_AI.md)** - Full commercial AI chat platform built with NextVibe

---

## Patterns & Best Practices

Core patterns for building with NextVibe. **Read the relevant doc before touching that file type.**

### Endpoint Structure

| File you're working on   | Pattern Doc                                   |
| ------------------------ | --------------------------------------------- |
| `definition.ts`          | [Definition Files](patterns/definition.md)    |
| `repository.ts`          | [Repository Patterns](patterns/repository.md) |
| `route.ts`               | [Route Patterns](patterns/route.md)           |
| `i18n/` files            | [i18n Patterns](patterns/i18n.md)             |
| `enum.ts`                | [Enum Patterns](patterns/enum.md)             |
| `db.ts` / schema         | [Database Patterns](patterns/database.md)     |
| `seeds.ts`               | [Seeds Patterns](patterns/seeds.md)           |
| `task.ts` / `tasks/`     | [Task Patterns](patterns/tasks.md)            |
| Logger usage             | [Logger Patterns](patterns/logger.md)         |
| Email sending            | [Email Patterns](patterns/email.md)           |
| `widget.tsx` / `widget/` | [Widget (Web)](patterns/widget.md)            |
| `widget.cli.tsx`         | [Widget (CLI/MCP)](patterns/widget.cli.md)    |
| `hooks.ts` / `hooks/`    | [Hooks Patterns](patterns/hooks.md)           |
| `repository.native.ts`   | [React Native](patterns/repository.native.md) |
| `repository-client.ts`   | [Client Route](patterns/repository.client.md) |
| `route-client.ts`        | [Client Route](patterns/repository.client.md) |

---

## All Platform Interfaces

NextVibe exposes every endpoint across up to 10 platforms from a single definition. Here's how each works:

### 1. Web API (REST / Next.js or TanStack/Vite)

`route.ts` wires the definition into a Next.js App Router handler via `endpointsHandler()`. Handles validation, auth, error handling, and logging automatically.

NextVibe supports two frontend frameworks - switch with `--framework=`:

| Framework  | Dev command                 | Build command                     | Notes                                         |
| ---------- | --------------------------- | --------------------------------- | --------------------------------------------- |
| `tanstack` | `vibe dev` (default)        | `vibe build --framework=tanstack` | Vite + Nitro SSR, output in `.dist-tanstack/` |
| `next`     | `vibe dev --framework=next` | `vibe build`                      | Next.js App Router, output in `.next-prod/`   |

Route files (`route.ts`) and all endpoint logic are shared between both frameworks. Only the server runner changes.

**Disable:** add `UserRole.WEB_OFF` to `allowedRoles`

### 2. React UI

Definitions auto-render as forms and data displays via `EndpointsPage`. Field types, layouts, labels, and validation come from the definition. Override with `widget.tsx` for custom rendering.

See [Widget (Web)](patterns/widget.md) for widget patterns.

### 3. React Native

`.native.ts` override files (e.g. `repository.native.ts`) provide platform-specific implementations while sharing Zod schemas and type contracts. NativeWind 5 + Expo Router.

See [React Native](patterns/repository.native.md) for override patterns.

### 4. CLI

Every endpoint becomes a CLI command. Flags are auto-generated from the request schema.

```bash
vibe web-search "quantum computing"
vibe contact --name="Jane" --message="Hello"
vibe threads --interactive   # Prompt mode
```

**Reserved flags:** `--output`, `--verbose`, `--debug`, `--locale`, `--interactive`, `--dry-run`, `--user-type`

**Disable:** `UserRole.CLI_OFF` | **Allow without auth:** `UserRole.CLI_AUTH_BYPASS`

Custom CLI rendering (Ink components) lives in `widget.cli.tsx`. See [Widget (CLI/MCP)](patterns/widget.cli.md).

### 5. CLI Package

Ship your entire endpoint collection as an installable npm package. Users get your CLI and all your platform's commands.

### 6. tRPC (opt-in)

Endpoints can be exposed as tRPC procedures with full TypeScript inference. Disabled by default - enable by running the tRPC router generator:

```bash
vibe system:generators:generate-trpc-router
```

This creates `trpc/[...trpc]/router.ts`. Delete that file to disable tRPC again. The route returns 404 when the router file is absent.

### 7. AI Tools (Function Calling)

Endpoints convert to OpenAI/Anthropic function-calling schemas automatically.

**Disable:** `UserRole.AI_TOOL_OFF`

### 8. MCP Server (Model Context Protocol)

```bash
vibe mcp          # Start MCP server
vibe mcp --verbose
```

Configure `.mcp.json` for Claude Desktop or any MCP client.

**Opt-in to tool discovery:** `UserRole.MCP_VISIBLE` | **Disable:** `UserRole.MCP_OFF`

### 9. Remote Skills (AGENT.md)

Endpoints marked `REMOTE_SKILL` appear in AI-readable skill markdown files auto-generated from definitions:

- `AGENT.md` - All agent-accessible skills
- `PUBLIC_USER_SKILL.md` - Skills for unauthenticated users
- `USER_WITH_ACCOUNT_SKILL.md` - Skills for authenticated users

Generated by `ai/skills/markdown-generator.ts`.

### 10. Cron Tasks / The Pulse

Tasks defined with `task.ts` run on a cron schedule. Supports instance routing (`targetInstance`), concurrent execution limits, and timeout configuration.

Tasks run via `Platform.CRON` (same permissions as `Platform.AI`). The pulse handles both system tasks (defined in code) and user-created tasks (stored in DB).

See [Task Patterns](patterns/tasks.md).

---

## Additional Interfaces

### Vibe Frame - Embed Anywhere

Embed any endpoint as an isolated iframe on any website:

```html
<script src="https://your-domain.com/vibe-frame.js"></script>
<script>
  VibeFrame.mount({
    serverUrl: "https://your-domain.com",
    endpoint: "contact_POST",
    target: "#widget",
    theme: "dark",
    trigger: { type: "scroll", scrollPercent: 50 },
  });
</script>
```

**Display modes:** `inline`, `modal`, `slideIn`, `bottomSheet`

**Trigger modes:** `immediate`, `scroll`, `time`, `exitIntent`, `click`

**Bridge messages** (parent ↔ iframe): `vf:init`, `vf:auth`, `vf:theme`, `vf:data`, `vf:navigate` (parent→frame) and `vf:ready`, `vf:resize`, `vf:success`, `vf:error`, `vf:close` (frame→parent)

Test and generate embed code at `/admin/vibe-frame`.

Key files:

- `system/unified-interface/vibe-frame/types.ts` - `FrameMountConfig`, bridge message types
- `system/unified-interface/vibe-frame/bridge.ts` - `createParentBridge()`, `createFrameBridge()`
- `app/[locale]/frame/[...path]/` - iframe mount route

### WebSocket Events

Endpoints can stream typed events to connected clients:

```typescript
const { GET } = createEndpoint({
  events: {
    contentDelta: z.object({ delta: z.string() }),
    contentDone: z.object({ content: z.string() }),
  },
  // ...
});
```

Standalone Bun server on separate port (dev: 4000, prod: 4001). Pub/sub adapters: local (dev) or Redis (multi-instance prod).

Client hook: `useWidgetEvents(definition, channel)` returns `{ on, connected, lastEvent }`.

Key files: `system/unified-interface/websocket/`

---

## Platform Access Control Reference

Endpoint access is controlled by the `allowedRoles` array in `definition.ts`:

### User Permission Roles (stored in DB)

| Role               | Description                |
| ------------------ | -------------------------- |
| `PUBLIC`           | No authentication required |
| `CUSTOMER`         | Registered user            |
| `PARTNER_ADMIN`    | Partner administrator      |
| `PARTNER_EMPLOYEE` | Partner employee           |
| `ADMIN`            | Platform administrator     |

### Platform Markers (config only - never stored in DB)

| Marker            | Effect                                 |
| ----------------- | -------------------------------------- |
| `CLI_OFF`         | Block on CLI and MCP                   |
| `AI_TOOL_OFF`     | Block as AI tool                       |
| `WEB_OFF`         | Block on web (tRPC / Next.js)          |
| `MCP_OFF`         | Block on MCP specifically              |
| `MCP_VISIBLE`     | Opt-in: appear in MCP server tool list |
| `REMOTE_SKILL`    | Opt-in: appear in AGENT.md skill files |
| `CLI_AUTH_BYPASS` | Allow without authentication on CLI    |
| `PRODUCTION_OFF`  | Disabled in production                 |

---

## Architecture Reference

### Directory Layout

```
src/app/api/[locale]/
  system/
    unified-interface/
      ai/skills/           - Remote skill markdown generation
      cli/                 - CLI runtime + commands
      mcp/                 - MCP server
      react/               - React hooks (useEndpoint, useApiQuery)
      react-native/        - React Native support
      shared/
        endpoints/         - createEndpoint(), endpointsHandler(), registry
        logger/            - EndpointLogger
        types/             - Platform enum, WidgetType, FieldDataType, enums
        permissions/       - Role-based access control
      tasks/               - Cron jobs and pulse tasks
      trpc/                - tRPC router
      unified-ui/
        renderers/         - React, MCP, CLI, Native renderers
        widgets/           - Form field and display components
      vibe-frame/          - iframe embedding system
      websocket/           - WebSocket event streaming
```

---

## Practical Guides

- **[Debugging](guides/debugging.md)** - Debugging techniques
- **[Stripe Webhooks](guides/stripe-webhooks.md)** - Payment integration
- **[Remote Connection](guides/remote-connection.md)** - Connect local ↔ cloud instances, tool discovery, memory sync, remote execution modes

---

## Contributing to Documentation

Documentation improvements are welcome! Please:

1. Keep docs concise and focused
2. Include code examples where helpful
3. Link to related documentation
4. Ensure examples match actual code
5. Run `vibe check` before submitting

See [CONTRIBUTING.md](../CONTRIBUTING.md) for more details.
