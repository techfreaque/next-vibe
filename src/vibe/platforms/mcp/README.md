# MCP Server

Exposes vibe endpoints as [Model Context Protocol](https://modelcontextprotocol.io/) tools over
JSON-RPC on STDIO, for AI assistants (Claude Code, Claude Desktop, Cline, …).

MCP is one of this framework's surfaces. The closest sibling is the [CLI](../cli/README.md); both
execute the same endpoints through the same handler.

---

## Quick start

```jsonc
{
  "mcpServers": {
    "vibe": {
      "command": "vibe",
      "args": ["mcp"],
    },
  },
}
```

Editor configs are generated from [`mcp.template.json`](./mcp.template.json) by `vibe setup` — edit
the template rather than the emitted `.mcp.json`, which is overwritten.

Debug logging: add `--verbose` to `args`. Because stdout is the protocol channel, debug output goes
to the **log file** (`.tmp/.vibe-mcp.log`), never the console — see [`logger/spec.md`](../../logger/spec.md).

---

## Tool discovery is opt-in

A tool appears in the MCP tool list **only if its definition carries `MCP_VISIBLE`**:

```typescript
allowedRoles: [UserRole.ADMIN, UserRole.MCP_VISIBLE] as const,
```

This is the one place where a marker is opt-in rather than opt-out. `checkMcpDiscoveryAccess`
(`core/permissions/registry.ts`) requires `MCP_VISIBLE` and rejects anything carrying
`CLI_OFF` or `MCP_OFF`.

**Discovery and execution are separate gates.** Execution is opt-_out_: a tool without
`MCP_VISIBLE` is still executable over MCP (via `execute-tool`) as long as it has neither `CLI_OFF`
nor `MCP_OFF`. It simply does not advertise itself. That asymmetry is deliberate — it keeps the
advertised tool list small without making everything else unreachable.

---

## Tool naming

`getPreferredToolName()` (`core/core-utils/path.ts`): **the first alias, if the endpoint has any;
otherwise the canonical `<path>_<METHOD>` name.**

```
help-tool  →  aliases: ["tool-help", "help", "h", …]  →  "tool-help"
an endpoint with no aliases, path ["tools","x"], GET  →  "tools_x_GET"
```

So the first entry in `aliases` is load-bearing — it is the name agents will call. Order it
deliberately.

---

## Architecture

```
AI assistant → JSON-RPC/STDIO → protocol-handler → registry → route handler → repository
```

| File                         | Role                                                |
| ---------------------------- | --------------------------------------------------- |
| `server/stdio-transport.ts`  | stdin/stdout framing. Never writes to stdout itself |
| `server/protocol-handler.ts` | JSON-RPC dispatch; enforces `initialize` first      |
| `server/converter.ts`        | endpoint definition → MCP tool schema               |
| `server/server.ts`           | wiring                                              |
| `registry.ts`                | which tools are visible/executable for the caller   |
| `hot-loader.ts`              | endpoint loading                                    |
| `serve/`                     | the `mcp` endpoint itself                           |

Reused from the rest of the framework: the endpoint registry, the route handler, and the Zod schemas
from the definitions. An MCP tool call and a CLI command reach the same handler by the same path —
only the rendering differs.

---

## Access

The MCP session resolves its caller through the normal route executor, using the same role-based
access control as every other surface: session file (`.vibe.session`) → `VIBE_ADMIN_USER_EMAIL` →
public user. If `VIBE_ADMIN_USER_EMAIL` is set but no such user exists, the call fails rather than
silently downgrading.

What gates each individual tool is the **permission registry**, from `allowedRoles` + platform
markers (`CLI_OFF`, `MCP_OFF`, `MCP_VISIBLE`, `PRODUCTION_OFF`) — evaluated per call against the
resolved user.

---

## Output

MCP responses are rendered by the endpoint's `widget.tsx` through the MCP renderer
(`unified-ui/renderers/mcp/`). Widgets branch on `useWidgetPlatform() === Platform.MCP` to emit
plain text — no chalk, no borders, one line per item. See
[`docs/patterns/widget.md`](../../docs/patterns/widget.md#mcp-output-rules-strict).

---

## Related

- [CLI README](../cli/README.md)
- [Patterns](../../docs/patterns/README.md)
