/**
 * Generate All Command Endpoint Definition
 * Production-ready endpoint for running all code generators
 */

import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { scopedTranslation } from "next-vibe/core/generators/i18n";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

const GenerateAllWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.GenerateAllWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["vibe", "core", "generators"],
  title: "post.title",
  titleShort: "post.titleShort",
  description: "post.description",
  category: "devTools",
  subCategory: "Generators",
  tags: ["post.title"],
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
      force: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.force.label",
        description: "post.fields.force.description",
        columns: 4,
        schema: z.boolean().optional().default(false),
      }),

      // === RESPONSE FIELDS ===
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.fields.success.title",
        schema: z.boolean(),
      }),

      output: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.fields.output.title",
        schema: z.string().optional(),
      }),

      generationStats: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.fields.generationStats.title",
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
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title",
      description: "post.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title",
      description: "post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.internal.title",
      description: "post.errors.internal.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.internal.title",
      description: "post.errors.internal.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
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
        generationStats: {
          totalGenerators: 2,
          generatorsRun: 2,
          generatorsSkipped: 0,
          outputDirectory: "src/generated",
          functionalGeneratorsCompleted: true,
        },
      },
      withSkips: {
        success: true,
        generationStats: {
          totalGenerators: 2,
          generatorsRun: 1,
          generatorsSkipped: 1,
          outputDirectory: "src/generated",
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
