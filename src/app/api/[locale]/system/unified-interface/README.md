# Unified UI System

> **Part of NextVibe Framework** (GPL-3.0) - Located in `src/app/api/[locale]/system/unified-interface/`

**One Definition, All Platforms**

## What Is This?

The Unified UI System lets you write **one endpoint definition** and automatically get:

- ✅ **AI Tools** - Your AI assistant can call your APIs
- ✅ **CLI Commands** - Run from terminal with `vibe command-name`
- ✅ **MCP Tools** - Works in Claude Desktop, Cline, and other MCP clients
- ✅ **React Hooks** - Type-safe hooks for your web app
- ✅ **React Native** - Same hooks work on mobile
- ✅ **Widget-Based UI** - Results render beautifully everywhere

## Why Use This?

**Before**: Write separate code for AI tools, CLI, web UI, mobile UI
**After**: Write one `definition.ts` file, get everything automatically

**Benefits**:

- 🚀 **10x Faster Development** - One definition instead of 5+ implementations
- 🔒 **Type-Safe** - Full TypeScript inference everywhere
- 🎨 **Beautiful UI** - Automatic widget-based rendering
- 🔐 **Secure** - Permission system built-in
- 💰 **Cost Tracking** - Credit system integrated
- 🌍 **i18n Ready** - Multi-language support

## Quick Example

### 1. Write One Definition

```typescript
// definition.ts
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["user", "create"],
  credits: 0, // Free operation

  fields: objectField(
    { type: WidgetType.CONTAINER },
    { request: "data", response: true },
    {
      email: requestDataField({ type: WidgetType.TEXT }, z.string().email()),
      name: requestDataField({ type: WidgetType.TEXT }, z.string().min(1)),
    },
  ),
});
```

### 2. Use Everywhere Automatically

**Terminal (CLI)**:

```bash
vibe create-user --email=john@example.com --name="John Doe"
```

**AI Chat**:

```
User: "Create a user account for john@example.com named John Doe"
AI: *calls create-user tool automatically*
```

**Claude Desktop (MCP)**:

```json
{
  "mcpServers": {
    "Vibe": { "command": "npx", "args": ["vibe", "mcp"] }
  }
}
```

**React App**:

```typescript
const { mutate } = useEndpoint(definition);
mutate({ email: "john@example.com", name: "John Doe" });
```

**React Native App**:

```typescript
// Same hook works on mobile!
const { mutate } = useEndpoint(definition);
```

## How It Works

```
┌─────────────────────────────────────────┐
│         definition.ts                    │
│  • Method, path, fields                 │
│  • Widget types for UI                  │
│  • Permissions & credits                │
└─────────────────────────────────────────┘
                  │
    ┌─────────────┼─────────────┬─────────────┐
    ▼             ▼             ▼             ▼
┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐
│   AI   │  │  CLI   │  │  MCP   │  │ React  │
│  Tool  │  │Command │  │  Tool  │  │  Hook  │
└────────┘  └────────┘  └────────┘  └────────┘
```

## Widget System

Define how data should be displayed:

```typescript
// Text display
{
  type: WidgetType.TEXT;
}

// Clickable link
{
  type: WidgetType.LINK;
}

// Data table with sorting
{
  type: WidgetType.DATA_TABLE;
}

// Card grid
{
  type: WidgetType.DATA_CARDS;
}

// Search results
{
  type: WidgetType.LINK_LIST;
}

// Code with syntax highlighting
{
  type: WidgetType.CODE_OUTPUT;
}

// Markdown content
{
  type: WidgetType.MARKDOWN;
}
```

Results automatically render beautifully in:

- AI chat interface
- CLI terminal (colored output)
- React components
- React Native apps

## Permission System

Control who can access your endpoints:

```typescript
allowedRoles: [UserRole.ADMIN]; // Only admins
allowedRoles: [UserRole.CUSTOMER]; // Authenticated users
allowedRoles: [UserRole.PUBLIC]; // Everyone
allowedRoles: [UserRole.CLI_OFF]; // Disable CLI access
allowedRoles: [UserRole.AI_TOOL_OFF]; // Disable AI access
```

Permissions enforced automatically everywhere.

## Credit System

Set credit costs for your endpoints:

```typescript
credits: 0; // Free
credits: 0.65; // Web search (calculated from FEATURE_COSTS)
credits: 0.52; // Text-to-speech per 1000 chars (calculated)
credits: 10; // Expensive (e.g., GPT-4 message)
```

Credits automatically:

- Checked before execution
- Deducted after success
- Logged in database
- Displayed in UI

## Type Safety

Full TypeScript inference everywhere:

```typescript
// Types automatically inferred from definition
export type RequestInput = typeof POST.types.RequestInput;
export type ResponseOutput = typeof POST.types.ResponseOutput;

// Use in your code with full autocomplete
const result: ResponseOutput = await endpoint.mutate(input);
```

## i18n Support

All user-facing text uses translation keys:

```typescript
title: "app.api.user.create.post.title";
description: "app.api.user.create.post.description";
```

Automatically translated in:

- AI tool descriptions
- CLI help text
- MCP tool descriptions
- React UI labels
- Error messages

## Real-World Example: Web Search

```typescript
// brave-search/definition.ts
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["agent", "web", "brave-search"],
  credits: FEATURE_COSTS.BRAVE_SEARCH, // 0.65 credits per search

  aiTool: {
    displayName: "Search the Web",
    icon: "search",
    instructions: "Use this to find current information online",
  },

  fields: objectField(
    { type: WidgetType.CONTAINER },
    { request: "urlPathParams", response: true },
    {
      query: requestUrlParamField({ type: WidgetType.TEXT }, z.string().min(1)),
      results: responseArrayField(
        { type: WidgetType.LINK_LIST }, // Renders as clickable links!
        objectField(
          { type: WidgetType.LINK_CARD },
          { response: true },
          {
            title: responseField({ type: WidgetType.TEXT }, z.string()),
            url: responseField({ type: WidgetType.LINK }, z.string()),
            snippet: responseField({ type: WidgetType.MARKDOWN }, z.string()),
          },
        ),
      ),
    },
  ),
});
```

**Result**: AI can search the web, and results display as beautiful, clickable link cards in the chat interface!

## Best Practices

### For Developers

1. **Choose Appropriate Widget Types**
   - Match widget to data type
   - Use LINK for URLs
   - Use DATA_TABLE for tabular data
   - Use MARKDOWN for rich text

2. **Set Reasonable Credit Costs**
   - Free for simple operations
   - 1-5 credits for API calls
   - 10+ credits for expensive operations

3. **Write Clear AI Instructions**
   - Tell AI when to use your tool
   - Provide examples
   - Explain parameters

4. **Use Semantic Aliases**
   - Multiple ways to call same command
   - User-friendly names
   - Namespace related commands

5. **Handle Errors Gracefully**
   - Return clear error messages
   - Suggest fixes
   - Log for debugging

## Troubleshooting

**Tool not showing in AI chat**:

- Check `allowedRoles` includes user's role
- Verify `aiTool` metadata is defined
- Check user has enough credits

**CLI command not found**:

- Check `aliases` are defined
- Run `vibe list` to see all commands
- Verify permissions

**Widget not rendering**:

- Check widget type is registered
- Verify data structure matches widget
- Check browser console for errors

**Type errors**:

- Run `npx vibe check` to validate
- Check Zod schemas match data
- Verify imports are correct

## Learn More

- **PLAN.md** - Implementation roadmap for contributors
- **shared/widgets/** - Widget component documentation
- **ai-tool/** - AI tool system details
- **cli/** - CLI system details
- **mcp/** - MCP integration details

---

**Status**: Production Ready
**Version**: 1.0.0
**Last Updated**: 2025-01-30
