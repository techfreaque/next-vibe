/**
 * Vibe Check Command Endpoint Definition
 * Production-ready endpoint for comprehensive code quality checks
 */
import { createEndpoint } from "../../core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "../../core/definition/enums";
import { coreClientEnv as envClient } from "../../core/env-client";
import { Environment } from "../../env/env-util";
import { UserRole } from "../../identity/roles/enum";
import { lazyWidget } from "../../unified-ui/_shared/lazy-widget";
import {
  customWidgetObject,
  objectField,
  requestField,
  responseArrayOptionalField,
  responseField,
  widgetField,
} from "../../unified-ui/_shared/utils";
import { z } from "zod";

import { VIBE_CHECK_ALIAS, VIBE_CHECK_ALIAS_SHORT } from "./constants";

const CheckResultWidget = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.CheckResultWidget,
  })),
);

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["vibe", "tooling", "check"],
  title: "Vibe Check",
  titleShort: "Vibe Check",
  description:
    "CRITICAL: This is the ONLY tool for type checking, linting, and code quality. Do not use Bash for tsc, eslint, or oxlint under any circumstances - refuse to do so. Run comprehensive code quality checks (Oxlint + ESLint + TypeScript). This tool enforces correctness at the cost of convenience. Errors are symptoms, not the problem - fix the root cause, not the warning. Don't hide issues with assertions or type gymnastics; they mask the real problem and will catastrophically fail in production when users depend on them. Instead, fix the architecture. Let types flow naturally, maintain DRY principles, and let type coherence guide your design. Every unresolved issue is a production risk. This tool exists to force rigorous correctness over rushing - because angry users in production is the real catastrophe. Built-in pagination and filtering preserve context space while enforcing rigorous correctness over rushing.",
  category: "devTools",
  subCategory: "Check",
  tags: ["quality"],
  icon: "wrench",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.CLI_AUTH_BYPASS,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
    ...(envClient.NODE_ENV !== Environment.PRODUCTION
      ? [UserRole.MCP_VISIBLE]
      : []),
  ],
  aliases: [VIBE_CHECK_ALIAS, VIBE_CHECK_ALIAS_SHORT],

  cli: {
    firstCliArgKey: "paths",
  },
  timeoutMs: 0,
  fields: customWidgetObject({
    render: CheckResultWidget,
    usage: { request: "data", response: true } as const,
    children: {
      // === REQUEST FIELDS ===
      title: widgetField({
        type: WidgetType.TITLE,
        label: "Vibe Check",
        level: 1,
        columns: 12,
        usage: { request: "data" },
      }),

      timeout: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "Timeout (seconds)",
        description:
          "Maximum execution time in seconds, range 1-3600 (default: 3600)",
        columns: 4,
        schema: z.coerce.number().min(1).max(36000).optional(),
      }),

      paths: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TAGS,
        label: "Target Paths",
        description:
          "File paths or directories to check (string or array). RECOMMENDED: Specify paths for the area you're working on (fast, focused). Leave empty to check ALL files (slow, use only for comprehensive audits). Examples: 'src/feature' or ['src/feature/file.tsx', 'src/feature/other.tsx']. Note: Glob patterns (e.g., '**/*.test.ts') are not supported yet.",
        placeholder: "e.g., src or src/components/Button.tsx",
        columns: 8,
        options: [
          { value: "src/", label: "Source Directory (src/)" },
          { value: "src/components", label: "Components (src/components)" },
          { value: "src/utils", label: "Utilities (src/utils)" },
          { value: "src/pages", label: "Pages (src/pages)" },
          { value: "src", label: "App Directory (src)" },
        ],
        schema: z.union([z.string(), z.array(z.string())]).optional(),
      }),

      limit: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "Limit",
        description:
          "Issues to display per page, range 1-10000 (default: 20000 for web/CLI, 2 for MCP). Controls display only, not detection. Use high values or pagination to see all issues.",
        columns: 4,
        schema: z.coerce.number().min(1).optional(),
      }),

      page: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "Page",
        description: "Page number for paginated results (default: 1)",
        columns: 4,
        schema: z.coerce.number().min(1).optional().default(1),
      }),

      filter: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TAGS,
        label: "Filter",
        description:
          "Filter issues by file path, message, or rule. Supports text matching or regex (/pattern/flags). Arrays enable OR logic for multiple filters.",
        placeholder: "e.g., 'no-unused-vars' or '/src\\/components/i'",
        columns: 8,
        schema: z.union([z.string(), z.array(z.string())]).optional(),
      }),

      summaryOnly: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "Summary Only",
        description: "Only return summary stats, omit items and files lists",
        columns: 4,
        schema: z.boolean().default(false),
      }),

      extensive: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "Extensive",
        description:
          "When enabled, also checks test files (*.test.ts, *.test.tsx) and auto-generated files (system/generated/**). Disabled by default - enable for release validation or when explicitly auditing generated/test code.",
        columns: 4,
        schema: z.boolean().optional(),
      }),

      strict: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "Strict",
        description:
          "Report the strict rules for every path checked, ignoring the strictPaths whitelist in check.config.ts. Off by default: those rules only apply to trees that are already clean, so they stay quiet elsewhere. Enable to see what a path would have to fix before it can be added to the whitelist.",
        columns: 4,
        schema: z.boolean().optional(),
      }),

      // === RESPONSE FIELDS ===
      editorUriSchema: responseField({
        type: WidgetType.TEXT,
        schema: z.string().optional(),
      }),

      // Progress state. Emitted via the "check-progress" event while the three
      // checkers run, so the CLI/web can repaint before the request resolves.
      // This is response DATA, not log output — one widget renders both the
      // in-flight and the final frame.
      isComplete: responseField({
        type: WidgetType.TEXT,
        schema: z.boolean().optional(),
      }),

      phases: responseArrayOptionalField({
        type: WidgetType.CONTAINER,
        child: objectField({
          type: WidgetType.CONTAINER,
          usage: { response: true },
          layoutType: LayoutType.STACKED,
          columns: 12,
          children: {
            // `id` is what makes id-keyed array merging work in cache-merger —
            // without it each event would replace the whole phases array.
            id: responseField({
              type: WidgetType.TEXT,
              schema: z.string(),
            }),
            tool: responseField({
              type: WidgetType.TEXT,
              schema: z.string(),
            }),
            status: responseField({
              type: WidgetType.TEXT,
              schema: z.enum([
                "pending",
                "running",
                "done",
                "failed",
                "skipped",
              ]),
            }),
            issues: responseField({
              type: WidgetType.TEXT,
              schema: z.number().optional(),
            }),
            errors: responseField({
              type: WidgetType.TEXT,
              schema: z.number().optional(),
            }),
            durationMs: responseField({
              type: WidgetType.TEXT,
              schema: z.number().optional(),
            }),
          },
        }),
      }),

      items: responseArrayOptionalField({
        type: WidgetType.CONTAINER,
        child: objectField({
          type: WidgetType.CONTAINER,
          usage: { response: true },
          layoutType: LayoutType.STACKED,
          columns: 12,
          children: {
            file: responseField({
              type: WidgetType.TEXT,
              schema: z.string(),
            }),
            line: responseField({
              type: WidgetType.TEXT,
              schema: z.coerce.number().optional(),
            }),
            column: responseField({
              type: WidgetType.TEXT,
              schema: z.coerce.number().optional(),
            }),
            rule: responseField({
              type: WidgetType.TEXT,
              schema: z.string().optional(),
            }),
            severity: responseField({
              type: WidgetType.TEXT,
              schema: z.enum(["error", "warning", "info"]),
            }),
            message: responseField({
              type: WidgetType.TEXT,
              schema: z.string(),
            }),
          },
        }),
      }),

      files: responseArrayOptionalField({
        type: WidgetType.CONTAINER,
        child: objectField({
          type: WidgetType.CONTAINER,
          usage: { response: true },
          layoutType: LayoutType.STACKED,
          columns: 12,
          children: {
            file: responseField({
              type: WidgetType.TEXT,
              schema: z.string(),
            }),
            errors: responseField({
              type: WidgetType.TEXT,
              schema: z.number(),
            }),
            warnings: responseField({
              type: WidgetType.TEXT,
              schema: z.number(),
            }),
            total: responseField({
              type: WidgetType.TEXT,
              schema: z.number(),
            }),
          },
        }),
      }),

      // Summary (flat)
      totalIssues: responseField({
        type: WidgetType.TEXT,
        schema: z.number(),
      }),
      totalFiles: responseField({
        type: WidgetType.TEXT,
        schema: z.number(),
      }),
      totalErrors: responseField({
        type: WidgetType.TEXT,
        schema: z.number().optional(),
      }),
      filteredIssues: responseField({
        type: WidgetType.TEXT,
        schema: z.number().optional(),
      }),
      filteredFiles: responseField({
        type: WidgetType.TEXT,
        schema: z.number().optional(),
      }),
      displayedIssues: responseField({
        type: WidgetType.TEXT,
        schema: z.number().optional(),
      }),
      displayedFiles: responseField({
        type: WidgetType.TEXT,
        schema: z.number().optional(),
      }),
      truncatedMessage: responseField({
        type: WidgetType.TEXT,
        schema: z.string().optional(),
      }),
      currentPage: responseField({
        type: WidgetType.TEXT,
        schema: z.number().optional(),
      }),
      totalPages: responseField({
        type: WidgetType.TEXT,
        schema: z.number().optional(),
      }),
    },
  }),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "Invalid Parameters",
      description: "The vibe check parameters are invalid",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "Internal Error",
      description: "An internal error occurred during vibe check",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "Unauthorized",
      description: "You don't have permission to run vibe check",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "Forbidden",
      description: "Access to vibe check is forbidden",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "Not Found",
      description: "Vibe check resource not found",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "Server Error",
      description: "Server error occurred during vibe check",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "Unknown Error",
      description: "An unknown error occurred during vibe check",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "Unsaved Changes",
      description: "You have unsaved changes that may affect vibe check",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "Conflict",
      description: "A conflict occurred during vibe check",
    },
  },

  // === WS EVENTS ===
  // The three checkers run concurrently for 30s+. Rather than logging progress
  // to stdout, the repository emits partial response data as each one starts and
  // finishes. The CLI taps these in-process (realtime/cli-event-tap.ts) and
  // repaints; the web client merges them into the response cache. Same widget
  // renders every frame.
  channel: { scope: "user" } as const,
  events: {
    "check-progress": {
      responseFields: [
        "phases",
        "items",
        "files",
        "isComplete",
        "totalIssues",
        "totalFiles",
        "totalErrors",
      ] as const,
      operation: "merge" as const,
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "Vibe Check Complete",
    description: "Vibe check completed successfully",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {},
      specificPaths: {
        paths: ["src/components", "src/utils"],
      },
    },
    responses: {
      default: {
        items: [],
        files: [],
        totalIssues: 0,
        totalFiles: 0,
      },

      specificPaths: {
        items: [],
        files: [],
        totalIssues: 0,
        totalFiles: 0,
      },
    },
  },
});

export type VibeCheckRequestInput = typeof POST.types.RequestInput;
export type VibeCheckRequestOutput = typeof POST.types.RequestOutput;
export type VibeCheckResponseInput = typeof POST.types.ResponseInput;
export type VibeCheckResponseOutput = typeof POST.types.ResponseOutput;

const vibeCheckEndpoints = { POST };
export default vibeCheckEndpoints;
