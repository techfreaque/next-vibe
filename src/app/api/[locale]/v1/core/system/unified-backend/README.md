# Unified Backend

Server-side execution engines for all platforms.

## What is This?

The backend handles ALL execution logic:
- Endpoint execution (POST, GET, PUT, DELETE, PATCH)
- Route handling (Next.js API routes, tRPC procedures)
- CLI command execution
- MCP tool execution
- Task/Cron scheduling and execution
- Email sending
- Webhook processing
- Queue workers

## Platforms

### Endpoint Platform
Core endpoint execution engine used by all other platforms.

**Files**: `platforms/endpoint/`
- `handler.ts` - Single endpoint execution
- `handlers.ts` - Multiple endpoint execution
- `next-handler.ts` - Next.js route handler
- `trpc-handler.ts` - tRPC procedure handler
- `cli-handler.ts` - CLI command handler
- `validation.ts` - Request validation

### CLI Platform
Command-line execution engine.

**Files**: `platforms/cli/`
- `executor.ts` - Execute CLI commands
- `entry-point.ts` - CLI entry point
- `vibe.ts` - Vibe CLI runtime
- `route-delegation.ts` - Route delegation logic

### MCP Platform
Model Context Protocol execution engine.

**Files**: `platforms/mcp/`
- `executor.ts` - Execute MCP tools
- `protocol-handler.ts` - Handle MCP protocol
- `server.ts` - MCP server runtime
- `stdio-transport.ts` - STDIO communication

### Task Platform
Background task execution.

**Files**: `platforms/task/`
- `executor.ts` - Execute tasks
- `scheduler.ts` - Schedule tasks
- `runner.ts` - Run scheduled tasks

### Email Platform
Email sending and processing.

**Files**: `platforms/email/`
- `executor.ts` - Execute email sending
- `sender.ts` - Email sender logic

### Webhook Platform
Webhook handling and processing.

**Files**: `platforms/webhook/`
- `executor.ts` - Execute webhook handlers
- `handler.ts` - Webhook handler logic

### Queue Platform
Queue processing and workers.

**Files**: `platforms/queue/`
- `executor.ts` - Execute queue jobs
- `worker.ts` - Queue worker logic

## Shared Code

All platforms share common execution logic:

### Core
- `shared/core/execution/` - Base executor, context, result
- `shared/core/validation/` - Request validation, schema validation
- `shared/core/error/` - Error handling, recovery, retry
- `shared/core/routing/` - Route resolution, matching, delegation

### Types
- `shared/types/` - Endpoint types, field types, enums

### Utils
- `shared/utils/` - Logger, performance, debug

## Principles

1. **Pure Execution** - No UI/rendering code
2. **Type-Safe** - 100% type inference
3. **Shared Core** - All platforms use shared execution logic
4. **No Assertions** - Natural type flow
5. **No Index Files** - Direct imports only

## Usage

```typescript
// Execute an endpoint
import { executeEndpoint } from './platforms/endpoint/handler';

const result = await executeEndpoint({
  endpoint: definition,
  request: { body: data },
  context: { user, locale }
});
```