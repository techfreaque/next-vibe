# MCP Server

**Model Context Protocol executor for the Vibe unified-interface**

Exposes API endpoints as MCP tools for AI assistants (Claude Desktop, Cline, etc.).

## Quick Start

Add to your AI assistant's MCP configuration:

```json
{
  "mcpServers": {
    "Vibe": {
      "command": "vibe",
      "args": ["mcp"]
    }
  }
}
```

## What is MCP?

[Model Context Protocol](https://modelcontextprotocol.io/) is an open standard for connecting AI assistants to external tools via JSON-RPC over STDIO.

## Configuration Examples

### Claude Desktop

macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
Windows: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "Vibe": {
      "command": "npx",
      "args": ["vibe", "mcp"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

### VS Code (Cline)

`.vscode/settings.json`:

```json
{
  "cline.mcpServers": {
    "Vibe": {
      "command": "npx",
      "args": ["vibe", "mcp"]
    }
  }
}
```

## Architecture

The MCP server is another executor of the unified-interface framework, reusing:

- **Endpoint Discovery**: Same registry as CLI
- **Route Execution**: Same handler as web APIs
- **Authentication**: Same JWT system (uses `cli@system.local` user)
- **Validation**: Same Zod schemas from definitions
- **i18n**: Same translation system

```
AI Assistant → MCP Protocol (JSON-RPC/STDIO) → Tool Registry → Route Handler → API Endpoints
```

## Tool Naming

Tools are named using API path structure:

```
/user/create (POST) → v1_core_user_create_POST
/leads/list (GET)    → v1_core_leads_list_GET
```

Custom aliases can be defined in `definition.ts`:

```typescript
createEndpoint({
  aliases: ["create-user"],
  // ...
});
```

## Authentication & Permissions

- Uses same role-based access control as other interfaces
- Auth flow: Session file (.vibe.session) → `VIBE_CLI_USER_EMAIL` env var → Public user with new lead
- If `VIBE_CLI_USER_EMAIL` is set but user not found in DB, returns error
- Public endpoints available without authentication

## Debug Mode

Add `--verbose` flag to enable debug logging:

```json
{
  "mcpServers": {
    "Vibe": {
      "command": "vibe",
      "args": ["mcp", "--verbose"]
    }
  }
}
```
