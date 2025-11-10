# Vibe MCP Server

**Model Context Protocol (MCP) server for Vibe APIs**

Connect any MCP-compatible AI assistant (Claude Desktop, VS Code with Cline, etc.) directly to your Vibe API endpoints. Get instant access to all your API functionality through natural language, with full permission control and type safety.

## Quick Start

### Option 1: NPX (Recommended)

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

### Option 2: CLI Alias

```bash
vibe mcp
```

That's it! Your AI assistant now has access to all your Vibe API endpoints.

## What is MCP?

The [Model Context Protocol](https://modelcontextprotocol.io/) is an open standard that lets AI assistants connect to external tools and data sources. Think of it as a universal API for AI - instead of building custom integrations for every AI assistant, you expose your APIs once through MCP.

## Features

### ✨ Automatic Tool Discovery

- **Zero Configuration**: All your API endpoints automatically become MCP tools
- **Dynamic Updates**: New endpoints are instantly available
- **Smart Naming**: Uses your existing API path structure (e.g., `core:user:create`)

### 🔒 Built-in Security

- **Role-Based Access**: Only exposes tools the user has permission to use
- **Same Auth System**: Uses your existing authentication and authorization
- **Public/Private/Admin**: Respects `PUBLIC`, `CUSTOMER`, `ADMIN` roles

### 🌍 Multi-Language Support

- **Automatic Translation**: Tool descriptions in English, German, Polish, and more
- **Locale Detection**: Uses your API's i18n system
- **Fallback Handling**: Graceful degradation for missing translations

### 🔄 Recursive Tool Execution

- **Tools Can Call Tools**: MCP tools can execute other tools
- **Consistent Execution**: Same engine as CLI and web APIs
- **Full Context**: Preserves user, locale, and permissions

### 📊 Type-Safe Schemas

- **JSON Schema**: All parameters validated against your Zod schemas
- **Auto-Generated**: Derived from your endpoint definitions
- **Rich Metadata**: Includes descriptions, examples, and constraints

## Configuration Examples

### Claude Desktop (macOS)

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

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

### Claude Desktop (Windows)

Edit `%APPDATA%\Claude\claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "Vibe": {
      "command": "npx.cmd",
      "args": ["vibe", "mcp"]
    }
  }
}
```

### VS Code with Cline

Add to `.vscode/settings.json`:

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

### Custom Environment Variables

```json
{
  "mcpServers": {
    "Vibe": {
      "command": "npx",
      "args": ["vibe", "mcp"],
      "env": {
        "DEBUG": "true",
        "DATABASE_URL": "postgresql://...",
        "VIBE_LOCALE": "de-DE"
      }
    }
  }
}
```

## Usage Examples

Once connected, your AI assistant can use natural language to interact with your APIs:

### User Management

```
You: Create a new user with email john@example.com and name John Doe
AI: I'll create that user for you using the core:user:create tool...
    ✓ User created successfully with ID: uuid-1234
```

### Database Operations

```
You: Check if the database is working
AI: Let me ping the database...
    ✓ Database is healthy (response time: 12ms)
```

### Email Campaigns

```
You: List all active email campaigns
AI: Fetching campaigns with core:leads:campaigns:list...
    Found 3 active campaigns:
    1. Welcome Series (234 subscribers)
    2. Product Launch (1,432 subscribers)
    3. Re-engagement (89 subscribers)
```

### Data Analysis

```
You: Show me user signup statistics for the last 30 days
AI: I'll use the core:analytics:users:signups tool...
    [Returns chart data and analysis]
```

## Available Tools

The MCP server automatically exposes all your API endpoints as tools. Here's what gets included:

### ✅ Included

- All endpoints with proper `definition.ts` files
- Endpoints matching your role/permissions
- GET, POST, PUT, PATCH, DELETE methods
- Nested routes (e.g., `/users/:id/posts`)

### ❌ Excluded

- Endpoints without definitions
- Endpoints you don't have permission to access
- Internal-only endpoints
- Deprecated endpoints (if marked as such)

### Tool Naming

Tools are named using your API path structure with colons:

```
API Path: /v1/core/user/create
MCP Tool:  core:user:create

API Path: /v1/core/leads/campaigns/emails/send
MCP Tool:  core:leads:campaigns:emails:send
```

You can also use custom aliases defined in your `definition.ts`:

```typescript
createEndpoint({
  aliases: ["create-user", "user:new", "signup"],
  // ...
});
```

## Authentication

The MCP server uses the same authentication system as your CLI and web APIs:

### Default Behavior

- Looks for `cli@system.local` user in database
- Falls back to admin user if not found
- Uses same JWT mechanism as other interfaces

### Custom User

Set via environment variable:

```json
{
  "env": {
    "VIBE_CLI_USER_EMAIL": "your-email@example.com"
  }
}
```

### Public Endpoints

Tools from public endpoints (role: `PUBLIC`) are always available, even without authentication.

## Permissions

The MCP server respects your API's role-based access control:

### Role Hierarchy

1. **PUBLIC** - Available to everyone (unauthenticated)
2. **CUSTOMER** - Requires authentication, customer-level access
3. **ADMIN** - Requires admin privileges

### Per-Tool Permissions

Each tool shows which roles can access it:

```
Tool: core:user:delete
Allowed Roles: [ADMIN]
Description: Delete a user account

Tool: core:user:profile
Allowed Roles: [PUBLIC, CUSTOMER, ADMIN]
Description: View user profile
```

### Permission Errors

If you try to use a tool you don't have access to:

```
Error: Permission denied
You need ADMIN role to access this tool.
Current role: CUSTOMER
```

## Advanced Features

### Recursive Tool Execution

Tools can call other tools automatically:

```
You: Create a user and send them a welcome email
AI: I'll use two tools:
    1. core:user:create → Creates user
    2. core:email:send → Sends welcome email

    ✓ User created: john@example.com
    ✓ Welcome email sent
```

### Batch Operations

```
You: Create 5 test users
AI: I'll call core:user:create multiple times...
    [Shows progress for each user]
```

### Complex Workflows

```
You: Set up a new email campaign for inactive users
AI: I'll execute this workflow:
    1. core:analytics:users:inactive → Find inactive users
    2. core:leads:campaigns:create → Create campaign
    3. core:leads:campaigns:emails:add → Add users to campaign
    4. core:leads:campaigns:start → Start campaign

    [Executes each step with confirmations]
```

### Error Recovery

```
You: Update all user profiles with...
AI: Processing batch update...
    ✓ User 1 updated
    ✓ User 2 updated
    ✗ User 3 failed: Validation error
    ✓ User 4 updated

    Summary: 3 succeeded, 1 failed
    Would you like to retry the failed update?
```

## Debugging

### Enable Debug Mode

```json
{
  "env": {
    "DEBUG": "true",
    "VIBE_LOG_LEVEL": "debug"
  }
}
```

This will show:

- Tool discovery process
- Parameter validation
- Execution traces
- Performance metrics

### View Logs

The MCP server logs to stderr (won't interfere with MCP protocol on stdout):

```
[MCP] Initializing server...
[MCP] Discovering endpoints...
[MCP] Found 47 endpoints
[MCP] Registered 47 tools
[MCP] Server ready
```

### Test Connection

```bash
# Start server manually
vibe mcp

# In another terminal, send test message
echo '{"jsonrpc":"2.0","method":"tools/list","id":1}' | vibe mcp
```

### Common Issues

#### "Command not found: vibe"

```bash
npm install -g vibe
# or use npx
```

#### "No tools available"

- Check your endpoint definitions
- Verify your user permissions
- Enable debug mode to see discovery process

#### "Permission denied"

- Check your user's role in database
- Verify endpoint's `allowedRoles` in definition
- Use correct VIBE_CLI_USER_EMAIL if needed

## Performance

### Tool Discovery

- **Cold start**: ~500ms (first request)
- **Warm cache**: <50ms (subsequent requests)
- **Auto-refresh**: Updates when definitions change

### Tool Execution

- Same performance as direct API calls
- No additional overhead
- Executes in same Node process

### Resource Usage

- **Memory**: ~50MB base + your API memory
- **CPU**: Minimal (only active during requests)
- **Network**: None (local execution)

## Architecture

### How It Works

```
┌─────────────┐
│ AI Assistant│
│  (Claude)   │
└──────┬──────┘
       │ MCP Protocol (JSON-RPC)
       │ via STDIO
       ▼
┌─────────────────────┐
│  Vibe MCP Server    │
├─────────────────────┤
│ • Protocol Handler  │
│ • Tool Registry     │
│ • Permission Filter │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────────┐
│  Shared Infrastructure  │
├─────────────────────────┤
│ • Endpoint Registry     │
│ • Route Handler         │
│ • Auth System           │
│ • i18n System           │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────┐
│  Your API Endpoints │
│  (route.ts files)   │
└─────────────────────┘
```

### Shared Components

The MCP server reuses your existing infrastructure:

- **Endpoint Discovery**: Same registry as CLI uses
- **Route Execution**: Same handler as web APIs use
- **Authentication**: Same JWT system as all interfaces
- **Validation**: Same Zod schemas as your definitions
- **i18n**: Same translation system as your app

This means:

- Zero code duplication
- Consistent behavior across all interfaces
- Single source of truth for business logic
- Automatic updates when APIs change

## Comparison with Other Interfaces

| Feature        | Web API       | CLI           | AI Tool       | MCP           |
| -------------- | ------------- | ------------- | ------------- | ------------- |
| Protocol       | HTTP          | Terminal      | Function Call | JSON-RPC      |
| Transport      | Network       | Process       | In-Memory     | STDIO         |
| Authentication | JWT/Session   | CLI User      | Context       | CLI User      |
| Discovery      | OpenAPI       | Help Command  | Registry      | tools/list    |
| Execution      | Route Handler | Route Handler | Executor      | Route Handler |
| Type Safety    | Runtime       | Runtime       | Compile-time  | Runtime       |
| Best For       | Web/Mobile    | Scripts       | AI Streaming  | AI Assistants |

## Migration Guide

### From CLI Scripts

Before (CLI):

```bash
vibe core:user:create \
  --email=john@example.com \
  --name="John Doe"
```

After (MCP with AI):

```
Create a user with email john@example.com and name John Doe
```

### From Direct API Calls

Before (HTTP):

```bash
curl -X POST https://api.example.com/v1/core/user/create \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","name":"John Doe"}'
```

After (MCP with AI):

```
Create a user with email john@example.com and name John Doe
```

### From Code

Before (TypeScript):

```typescript
const response = await fetch("/api/v1/core/user/create", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "john@example.com", name: "John Doe" }),
});
```

After (MCP with AI):

```
Create a user with email john@example.com and name John Doe
```

## Best Practices

### 1. Write Clear Endpoint Descriptions

Your AI will understand your API better with good descriptions:

```typescript
// ❌ Bad
description: "Creates user";

// ✅ Good
description: "Create a new user account with email and optional profile information";
```

### 2. Use Semantic Aliases

Make tools discoverable with intuitive aliases:

```typescript
aliases: [
  "create-user", // Imperative
  "user:new", // Namespaced
  "signup", // User-facing term
  "register-account", // Alternative term
];
```

### 3. Provide Examples

Help the AI understand expected inputs:

```typescript
examples: {
  request: {
    email: "john@example.com",
    name: "John Doe",
    role: "CUSTOMER"
  }
}
```

### 4. Document Parameters

Rich descriptions improve AI understanding:

```typescript
objectField({
  email: inputField({ type: WidgetType.TEXT }, z.string().email(), {
    title: "Email Address",
    description: "User's email address for login and notifications",
    placeholder: "user@example.com",
  }),
});
```

### 5. Handle Errors Gracefully

Provide helpful error messages:

```typescript
errorTypes: {
  [EndpointErrorTypes.VALIDATION_FAILED]: {
    title: "Invalid input",
    description: "Please check that email is valid and name is not empty"
  }
}
```

## Security Considerations

### ⚠️ Important Security Notes

1. **Local Execution Only**: MCP server runs locally, not exposed to network
2. **Same Security Model**: Uses your existing auth/authz system
3. **No New Attack Surface**: No additional endpoints or ports
4. **Audit Logging**: All tool executions are logged like any API call
5. **Rate Limiting**: Respects your API's rate limits

### Production Deployment

For production use:

```json
{
  "mcpServers": {
    "Vibe": {
      "command": "npx",
      "args": ["vibe", "mcp"],
      "env": {
        "NODE_ENV": "production",
        "VIBE_LOG_LEVEL": "info",
        "DATABASE_URL": "postgresql://prod-db..."
      }
    }
  }
}
```

### Sensitive Data

MCP tools can access sensitive data:

- Only expose to trusted AI assistants
- Review which tools are available
- Monitor execution logs
- Use environment-specific configurations

## FAQ

### Q: Do I need to modify my API endpoints?

**A:** No! If you have `definition.ts` files, they automatically work as MCP tools.

### Q: Can I disable specific tools?

**A:** Yes, use `excludePaths` in your endpoint registry config or set `allowedRoles: []` in the definition.

### Q: Does this work with my existing auth system?

**A:** Yes, it uses the same authentication as your CLI and web APIs.

### Q: Can I use this in production?

**A:** Yes, it's production-ready. The MCP server runs locally and executes tools in the same way as your CLI.

### Q: What about rate limiting?

**A:** Your existing rate limiting applies. Tools execute through the same route handlers.

### Q: Can I customize tool names?

**A:** Yes, use the `aliases` field in your endpoint definitions.

### Q: Does this work offline?

**A:** Yes, if your API can run offline. No network requests are made by the MCP server itself.

### Q: Can multiple AI assistants connect?

**A:** Yes, but each runs a separate MCP server process. They don't share state.

### Q: How do I update the tools list?

**A:** Restart the MCP server (restart your AI assistant). Tools are discovered on startup.

### Q: Can I see what tools are available?

**A:** Yes, ask your AI assistant "What Vibe tools do you have access to?"

## Support

### Documentation

- [MCP Specification](https://modelcontextprotocol.io/)
- [Vibe API Documentation](../../../../../../docs/)
- [CLI Documentation](../cli/README.md)
- [AI Tool Documentation](../ai-tool/README.md)

### Issues

Report bugs or request features:

- GitHub Issues: [your-repo/issues](https://github.com/your-org/your-repo/issues)
- Tag with: `mcp`, `unified-interface`

### Community

- Discord: [Join our server](https://discord.gg/your-invite)
- Discussions: [GitHub Discussions](https://github.com/your-org/your-repo/discussions)

---

**Built with ❤️ using the Vibe unified-interface framework**
