/**
 * Generate All Command Endpoint Definition
 * Production-ready endpoint for running all code generators
 */

import { z } from "zod";

import { GENERATED_DIR } from "@/env/paths";

import { UserRole } from "../../identity/roles/enum";
import { lazyWidget } from "../../unified-ui/_shared/lazy-widget";
import {
  customWidgetObject,
  objectField,
  requestField,
  responseArrayOptionalField,
  responseField,
} from "../../unified-ui/_shared/utils";
import { createEndpoint } from "../definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "../definition/enums";

const GenerateAllWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.GenerateAllWidget })),
);

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["vibe", "core", "generators"],
  title: "Generate All",
  titleShort: "Generate All",
  description: "Run all code generators",
  category: "devTools",
  subCategory: "Generators",
  tags: ["Generate All"],
  icon: "sparkles",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.CLI_AUTH_BYPASS,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.PRODUCTION_OFF,
  ],
  aliases: ["generate-all", "gen", "generate"],

  fields: customWidgetObject({
    render: GenerateAllWidget,
    usage: { request: "data", response: true } as const,
    children: {
      force: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "Force",
        description: "Ignore cached hashes and run all generators",
        columns: 4,
        schema: z.boolean().optional().default(false),
      }),

      // === RESPONSE FIELDS ===
      success: responseField({
        type: WidgetType.TEXT,
        label: "Success",
        schema: z.boolean(),
      }),

      // Progress state. Emitted via the "gen-progress" event while generators
      // run, so the CLI/web can repaint before the request resolves. This is
      // response DATA, not log output — one widget renders both the in-flight
      // and the final frame.
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
            summary: responseField({
              type: WidgetType.TEXT,
              schema: z.string().optional(),
            }),
            durationMs: responseField({
              type: WidgetType.TEXT,
              schema: z.number().optional(),
            }),
          },
        }),
      }),

      generationCompleted: responseField({
        type: WidgetType.TEXT,
        label: "Generation Completed",
        schema: z.boolean(),
      }),

      output: responseField({
        type: WidgetType.TEXT,
        label: "Output",
        schema: z.string().optional(),
      }),

      generationStats: responseField({
        type: WidgetType.TEXT,
        label: "Generation Statistics",
        schema: z.object({
          totalGenerators: z.coerce.number(),
          generatorsRun: z.coerce.number(),
          generatorsSkipped: z.coerce.number(),
          outputDirectory: z.string(),
          functionalGeneratorsCompleted: z.boolean(),
        }),
      }),
    },
  }),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "Validation Error",
      description: "Invalid request parameters",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "Network Error",
      description: "Network error occurred",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "Unauthorized",
      description: "Authentication required",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "Forbidden",
      description: "Access forbidden",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "Not Found",
      description: "Resource not found",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "Internal Error",
      description: "Internal server error occurred",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "Unknown Error",
      description: "An unknown error occurred",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "Internal Error",
      description: "Internal server error occurred",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "Conflict",
      description: "Data conflict occurred",
    },
  },

  // === WS EVENTS ===
  // Generators run for seconds. Rather than logging progress to stdout, the
  // repository emits partial response data as each generator starts and
  // finishes. The CLI taps these in-process (realtime/cli-event-tap.ts) and
  // repaints; the web client merges them into the response cache. Same widget
  // renders every frame.
  //
  // "upsert", not "merge": unlike check's fixed 3-checker array (every id
  // exists from the very first event), gen's phase rows appear over time —
  // the registry (and therefore the other 16 generator ids) isn't known until
  // AFTER the generators-index pre-step's first progress event. "merge" only
  // updates ids the accumulator already has ("insertMissing: false" in
  // applyPartialToCache), so every later id was silently dropped and the CLI
  // showed a single frozen "generators-index" row for the entire run.
  channel: { scope: "user" } as const,
  events: {
    "gen-progress": {
      responseFields: ["phases", "isComplete"] as const,
      operation: "upsert" as const,
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "Success",
    description: "Operation completed successfully",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: { force: false },
      force: { force: true },
    },
    responses: {
      default: {
        success: true,
        generationCompleted: true,
        isComplete: true,
        phases: [
          {
            id: "generators-index",
            status: "done",
            summary: "2 generators registered",
            durationMs: 120,
          },
        ],
        generationStats: {
          totalGenerators: 2,
          generatorsRun: 2,
          generatorsSkipped: 0,
          outputDirectory: GENERATED_DIR,
          functionalGeneratorsCompleted: true,
        },
      },
      withSkips: {
        success: true,
        generationCompleted: true,
        generationStats: {
          totalGenerators: 2,
          generatorsRun: 1,
          generatorsSkipped: 1,
          outputDirectory: GENERATED_DIR,
          functionalGeneratorsCompleted: true,
        },
      },
    },
  },
});

const generateAllEndpoints = { POST };
export default generateAllEndpoints;

export type GenerateAllRequestInput = typeof POST.types.RequestInput;
export type GenerateAllRequestOutput = typeof POST.types.RequestOutput;
export type GenerateAllResponseInput = typeof POST.types.ResponseInput;
export type GenerateAllResponseOutput = typeof POST.types.ResponseOutput;
