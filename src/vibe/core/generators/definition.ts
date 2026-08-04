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
  requestField,
  responseField,
} from "../../unified-ui/_shared/utils";
import { createEndpoint } from "../definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
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
