/**
 * Real, trimmed code from src/desktop/get-focused-window and src/credits/expire.
 * Used on the developers + self-host pages. Keep in sync with those files.
 */

export const SURFACE_DEFINITION = `// definition.ts - the ONE source of truth
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["desktop", "get-focused-window"],
  aliases: ["desktop-get-focused-window"] as const,
  title: "get-focused-window.title",
  icon: "eye",
  allowedRoles: [UserRole.ADMIN, UserRole.PRODUCTION_OFF],

  fields: customWidgetObject({
    render: GetFocusedWindowWidget, // one widget, every platform
    usage: { request: "data", response: true } as const,
    children: {
      windowTitle: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get-focused-window.response.windowTitle",
        schema: z.string().optional(),
      }),
      pid: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get-focused-window.response.pid",
        schema: z.number().optional(),
      }),
    },
  }),
  errorTypes: { /* all 9 EndpointErrorTypes - required */ },
  successTypes: { /* title + description */ },
  examples: { /* request + response samples */ },
});`;

export const SURFACE_ROUTE = `// route.ts - wire definition to repository
export const { POST, tools } = endpointsHandler({
  endpoint: getFocusedWindowEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ t, logger }) =>
      DesktopWindowRepository.getFocusedWindow(t, logger),
  },
});`;

export const SURFACE_CLI = `$ vibe desktop-get-focused-window

  ◆ Focused Window
    Mozilla Firefox
    pid: 2820  2293×916  monitor: DP-2`;

export const SURFACE_MCP = `// .mcp.json - any MCP client (Claude, Cursor, ...)
{
  "mcpServers": {
    "my-app": { "command": "vibe", "args": ["mcp"] }
  }
}

// the client now lists: desktop-get-focused-window
// input and output schemas come from the Zod fields above`;

export const SURFACE_AI = `// Same definition, exposed as a function-calling tool.
// The model reads the Zod schema + description. No wrapper.
//
//   user:  "What window am I looking at?"
//   model: desktop-get-focused-window({})
//   tool:  { windowTitle: "Mozilla Firefox", pid: 2820 }
//
// Hide it from the model: add UserRole.AI_TOOL_OFF`;

export const SURFACE_CRON = `// task.ts - the same handler on a schedule
const task = createCronTask(
  definition.POST,
  tools.POST, // <- the route handler from route.ts
  {
    id: "credits-expire",
    schedule: CRON_SCHEDULES.DAILY_MIDNIGHT,
    category: TaskCategory.MAINTENANCE,
    priority: CronTaskPriority.MEDIUM,
    timeout: TASK_TIMEOUTS.SHORT,
    enabled: true,
    taskInput: undefined,
  },
);
export const tasks: Task[] = [task];`;

export const SURFACE_ADD = `mkdir -p src/desktop/get-focused-window
# write definition.ts, repository.ts, route.ts (+ widget.tsx)

vibe gen    # regenerates route, CLI, MCP and tool registries
vibe check src/desktop/get-focused-window   # 0 errors or it's not done

vibe desktop-get-focused-window             # CLI, right now
# web:   /en-US/tools/desktop-get-focused-window
# MCP:   already listed - restart your client`;

export const INSTANCE_ENV = `# .env - the minimum for a private instance
JWT_SECRET_KEY="<openssl rand -hex 32>"
VIBE_ADMIN_USER_EMAIL="you@example.com"
VIBE_ADMIN_USER_PASSWORD="<strong password>"
DATABASE_URL="postgres://postgres:postgres@localhost:5432/postgres"
NEXT_PUBLIC_APP_URL="https://chat.example.com"
NEXT_PUBLIC_VIBE_MODE="agent"   # personal instance: no auth wall, no payments`;

export const INSTANCE_COMPOSE = `# production: Postgres + app image, one command
bash scripts/install-docker.sh
# = docker compose -f docker-compose.prod.yml
#   builds postgres (pgvector), pulls the app image, restarts

# update later, zero downtime
vibe rebuild`;

export const INSTANCE_MODEL = `vibe dev                    # Atlas  - coding instance, hot reload
vibe --hermes dev           # Hermes - your daily driver, own database
vibe --hermes --remote ...  # target a connected remote instance`;
