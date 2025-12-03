# Browser API - Chrome DevTools MCP Wrapper

This directory contains a typesafe wrapper around the Chrome DevTools MCP server, providing 26 individual endpoint pairs (definition.ts + route.ts) for each Chrome DevTools tool.

## Architecture

The wrapper is designed to match the Chrome MCP tools exactly, with each tool having its own:
- **definition.ts**: Typesafe endpoint definition with Zod validation and UI metadata
- **route.ts**: Route handler that calls the MCP tool via the Vibe MCP bridge

### Directory Structure

```
browser/
├── shared/
│   ├── types.ts          # Common type definitions
│   ├── repository.ts     # Shared MCP execution logic
│   └── tool-specs.ts     # TypeScript tool specifications (source of truth)
├── click/
│   ├── definition.ts
│   └── route.ts
├── drag/
│   ├── definition.ts
│   └── route.ts
... (24 more tools)
└── README.md            # This file
```

## Available Tools

### Input Automation (8 tools)
- **click** - Click on an element (single or double click)
- **drag** - Drag an element onto another element
- **fill** - Type text into an input or textarea
- **fill_form** - Fill multiple form elements at once
- **handle_dialog** - Handle browser dialogs (accept/dismiss)
- **hover** - Hover over an element
- **press_key** - Press a key or key combination
- **upload_file** - Upload a file through a file input

### Navigation (6 tools)
- **close_page** - Close a page by index
- **list_pages** - Get list of open browser pages
- **navigate_page** - Navigate to URL or back/forward/reload
- **new_page** - Create a new page
- **select_page** - Select a page for future operations
- **wait_for** - Wait for text to appear on page

### Emulation (2 tools)
- **emulate** - Emulate CPU throttling and network conditions
- **resize_page** - Resize the page viewport

### Performance (3 tools)
- **performance_analyze_insight** - Get detailed performance insight information
- **performance_start_trace** - Start performance trace recording
- **performance_stop_trace** - Stop performance trace recording

### Network (2 tools)
- **get_network_request** - Get a specific network request by ID
- **list_network_requests** - List all network requests

### Debugging (5 tools)
- **evaluate_script** - Execute JavaScript in the page context
- **get_console_message** - Get a console message by ID
- **list_console_messages** - List all console messages
- **take_screenshot** - Take a screenshot of page or element
- **take_snapshot** - Take an a11y tree text snapshot

## Usage

Each tool is available as an individual Next.js API route:

```
POST /api/en/browser/click
POST /api/en/browser/navigate_page
POST /api/en/browser/take_screenshot
... etc
```

### Example Request

```typescript
// Click on an element
POST /api/en/browser/click
{
  "uid": "element-123",
  "dblClick": false
}

// Take a screenshot
POST /api/en/browser/take_screenshot
{
  "format": "png",
  "fullPage": true
}

// Navigate to a URL
POST /api/en/browser/navigate_page
{
  "type": "url",
  "url": "https://example.com"
}
```

### Example Response

All tools return a consistent response format:

```typescript
{
  "success": true,
  "result": { /* tool-specific result data */ },
  "executionId": "exec_1234567890_abc123"
}
```

On error:

```typescript
{
  "success": false,
  "error": "Error message",
  "executionId": "exec_1234567890_abc123"
}
```

## How It Works

1. Each tool endpoint receives a typesafe request validated by Zod
2. The route handler calls `executeMCPTool()` from `shared/repository.ts`
3. The shared repository calls the Vibe MCP browser endpoint
4. Vibe MCP routes the request to the Chrome DevTools MCP server
5. The result is returned through the chain back to the client

### MCP Integration

The wrapper integrates with the Chrome DevTools MCP through the Vibe MCP bridge:

```
Client → Next.js Route → Shared Repository → Vibe MCP → Chrome DevTools MCP
```

The Vibe MCP server (`mcp__vibe__v1_core_browser_POST`) acts as a bridge, translating the unified browser API format to the specific Chrome MCP tool calls.

## Development

### Regenerating Tools

If the Chrome DevTools MCP tools are updated, you can regenerate all endpoints:

```bash
# Update shared/tool-specs.ts with new specifications
# Then run the generator with Bun
bun scripts/generate-browser-tools.ts
```

The tool specifications are now managed in TypeScript (`shared/tool-specs.ts`) for better type safety and IDE support.

### Adding New Tools

1. Add tool specification to `shared/tool-specs.ts`
2. Run the generator script: `bun scripts/generate-browser-tools.ts`
3. Add translations for the new tool
4. Run the endpoint generator to register the new route: `vibe generate`

## Type Safety

All endpoints are fully typesafe with:
- Zod validation for request/response
- TypeScript types exported from definitions
- UI metadata for automatic form generation
- Translation keys for i18n support

## Testing

To test a tool endpoint via CLI:

```bash
# Using the Vibe CLI
vibe browser click --uid "element-123"
vibe browser navigate-page --type url --url "https://example.com"
vibe browser take-screenshot --format png --full-page
```

## Notes

- The old monolithic `/api/browser` endpoint has been kept for backward compatibility but should be deprecated in favor of the individual tool endpoints
- All tools support the same authentication and authorization as other API endpoints
- Each tool has its own i18n translations in the respective `i18n/` directories
- The Vibe MCP bridge handles the connection to the Chrome DevTools MCP server

## Related Files

- `/src/app/api/[locale]/browser/route.ts` - Legacy monolithic endpoint (deprecated)
- `/scripts/generate-browser-tools.ts` - TypeScript tool generator script
- `/src/app/api/[locale]/browser/shared/tool-specs.ts` - TypeScript tool specifications (source of truth)
