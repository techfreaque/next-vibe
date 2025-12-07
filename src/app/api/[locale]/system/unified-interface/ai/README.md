# AI Tool System

**Convert API endpoints to AI SDK tools for AI agents**

## Overview

The AI Tool System automatically converts your API endpoints into tools that AI agents can call. Uses the Vercel AI SDK and supports all major AI providers through OpenRouter.

## Quick Start

```typescript
import { aiToolRegistry } from "./registry";
import { getToolFactory } from "./factory";
import { toolExecutor } from "./executor";

// Get endpoints for user
const endpoints = aiToolRegistry.getEndpoints(
  { id: userId, roles: ["CUSTOMER"], isPublic: false },
  Platform.AI,
);

// Convert to AI SDK tools
const factory = getToolFactory();
const tools = factory.createToolsFromEndpoints(endpoints, toolExecutor, {
  user: { id: userId, roles: ["CUSTOMER"], isPublic: false },
  locale: "en-GLOBAL",
  logger,
});

// Use in AI SDK
import { streamText } from "ai";

const result = streamText({
  model: provider("openai/gpt-4"),
  messages,
  tools: Object.fromEntries(Array.from(tools.entries())),
});
```

## How It Works

```
1. Discovery
   └─> Scans definition.ts files
   └─> Extracts metadata (name, description, params)

2. Filtering
   └─> Filters by user permissions
   └─> Filters by platform (AI)
   └─> Returns AIToolMetadata[]

3. Conversion
   └─> Converts to AI SDK CoreTool
   └─> Generates JSON schema from Zod
   └─> Adds execution handler

4. Execution
   └─> AI calls tool with parameters
   └─> Validates permissions
   └─> Calls endpoint via route handler
   └─> Returns result to AI
```

## Endpoint Metadata

```typescript
interface DiscoveredEndpoint {
  id: string; // Unique endpoint ID
  toolName: string; // Tool name (e.g., "core_user_create")
  path: string; // Full endpoint path
  definition: {
    method: Methods; // HTTP method
    title: string; // Human-readable title
    description: string; // For AI understanding
    category?: string; // For grouping
    tags: string[]; // For filtering
    icon?: string; // For UI display
    allowedRoles: UserRoleValue[];
    fields?: FieldNode; // Field definitions for schema generation
  };
}
```

## Registry API

### Initialize

```typescript
await aiToolRegistry.initialize();
```

### Get All Endpoints

```typescript
const endpoints = aiToolRegistry.getEndpoints();
```

### Get Endpoints for User

```typescript
const endpoints = aiToolRegistry.getEndpoints(
  { id: userId, roles: ["ADMIN"], isPublic: false },
  Platform.AI,
);
```

### Get Endpoint by Tool Name

```typescript
const endpoint = aiToolRegistry.getEndpointByToolName("core_user_create");
```

### Execute Tool

```typescript
const result = await aiToolRegistry.executeTool({
  toolName: "core_user_create",
  data: { email: "john@example.com", name: "John Doe" },
  user: { id: userId, roles: ["ADMIN"], isPublic: false },
  locale: "en-GLOBAL",
  logger,
});
```

### Get Statistics

```typescript
const stats = aiToolRegistry.getStats();
// Returns: { totalEndpoints, totalTools, toolsByCategory, toolsByRole, cacheStats }
```

## Permission System

Endpoints are filtered by user roles:

```typescript
// definition.ts
allowedRoles: [UserRole.ADMIN, UserRole.CUSTOMER];

// Only users with ADMIN or CUSTOMER role can access
const endpoints = aiToolRegistry.getEndpoints(
  { id: userId, roles: ["CUSTOMER"], isPublic: false },
  Platform.AI,
);
```

## Manual Tools

Some tools are manually defined (e.g., Brave Search):

```typescript
// tools/brave-search/repository.ts
export const braveSearch = tool({
  description: "Search the internet for current information",
  parameters: z.object({
    query: z.string().min(1).max(400),
    maxResults: z.number().optional(),
  }),
  execute: async ({ query, maxResults }) => {
    const service = getBraveSearchService();
    return await service.search(query, { maxResults });
  },
});
```

Manual tools are registered separately and merged with discovered tools.

## Tool Naming

Tools are named using path segments:

```
API Path: /user/create
Tool Name: core_user_create

API Path: /leads/campaigns/emails/send
Tool Name: core_leads_campaigns_emails_send
```

## Integration with Chat

### Stream API

```typescript
// Get available endpoints
const endpoints = aiToolRegistry.getEndpoints(user, Platform.AI);

// Convert to AI SDK tools
const factory = getToolFactory();
const allTools = factory.createToolsFromEndpoints(endpoints, toolExecutor, {
  user,
  locale,
  logger,
});

// Filter by requested tools
const requestedTools =
  data.tools === null
    ? new Map()
    : data.tools?.length
      ? new Map(
          Array.from(allTools.entries()).filter(([name]) =>
            data.tools.includes(name),
          ),
        )
      : allTools;

// Use in AI SDK
const result = streamText({
  model: provider(modelId),
  messages,
  tools: Object.fromEntries(Array.from(requestedTools.entries())),
});
```

### Tool Call Storage

```typescript
// Collect tool calls during streaming
const collectedToolCalls: ToolCall[] = [];

for await (const part of result.fullStream) {
  if (part.type === "tool-call") {
    collectedToolCalls.push({
      toolName: part.toolName,
      args: part.args,
    });
  }
}

// Store in message metadata
await db.insert(chatMessages).values({
  metadata: { toolCalls: collectedToolCalls },
});
```

### Frontend Display

```typescript
// tool-call-display.tsx
<ToolCallDisplay
  toolCalls={message.toolCalls}
  locale={locale}
/>
```

## Cost Tracking

Tools can define costs:

```typescript
// definition.ts
tool: {
  displayName: "Search the Web",
  icon: "search",
  cost: 0.65, // 0.65 credits per search (from FEATURE_COSTS)
}
```

Costs are:

- Deducted from user credits
- Stored in message metadata
- Displayed in UI

## Configuration

The AI system uses the shared platform configuration system. Configuration is handled by the BaseRegistry class which the ToolRegistry extends.

```typescript
// Platform-specific filtering is handled via:
// 1. Platform opt-out checks (platformOptOut field)
// 2. Role-based access control (allowedRoles field)
// 3. Public vs authenticated user filtering (isPublic field)
```

## Best Practices

### 1. Write Clear Descriptions

```typescript
// ✅ Good
description: "Create a new user account with email and optional profile information";
```

### 2. Provide Examples

```typescript
examples: {
  requests: {
    default: {
      email: "john@example.com",
      name: "John Doe",
    }
  }
}
```

### 3. Define Endpoint Metadata

```typescript
// In definition.ts
{
  title: "app.api.user.create.title",
  description: "app.api.user.create.description",
  category: "app.api.user.category",
  tags: ["user", "create"],
  icon: "user-plus",
}
```

### 4. Handle Errors

```typescript
errorTypes: {
  [EndpointErrorTypes.VALIDATION_FAILED]: {
    title: "Invalid input",
    description: "Please check that email is valid"
  }
}
```

## Troubleshooting

**"No tools available"**

- Check endpoint definitions exist
- Verify user permissions
- Check that endpoints aren't opted out via platformOptOut

**"Permission denied"**

- Check user's roles match endpoint's allowedRoles
- Verify user context is properly passed
- Check Platform.AI filtering

**"Tool execution failed"**

- Check endpoint route handler exists
- Verify parameters match Zod schema generated from fields
- Enable debug logging with logger.debug()

## Related

- [Main README](../README.md)
- [CLI README](../cli/README.md)
- [MCP README](../mcp/README.md)
- [React README](../react/README.md)
