/**
 * Dynamic Endpoint Generator Definition
 * Generates endpoint.ts with dynamic imports and flat path structure
 */

import { translatedValueSchema } from "next-vibe/core/definition/common.schema";
import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { scopedTranslation } from "next-vibe/tooling/generators/endpoint/i18n";
import {
  objectField,
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "tooling", "generators", "endpoint"],
  title: "post.title" as const,
  titleShort: "post.titleShort" as const,
  description: "post.description" as const,
  category: "devTools",
  subCategory: "Generators",
  tags: ["post.title" as const],
  icon: "wand",
  allowedRoles: [
    // use vibe generate instead
  ] as const,

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.container.title" as const,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST FIELDS ===
      outputFile: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.outputFile.label" as const,
        description: "post.fields.outputFile.description" as const,
        columns: 12,
        schema: z.string().default("src/generated/endpoint.ts"),
      }),

      dryRun: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.dryRun.label" as const,
        description: "post.fields.dryRun.description" as const,
        columns: 6,
        schema: z.boolean().optional().default(false),
      }),

      // === RESPONSE FIELDS ===
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.fields.success.title" as const,
        schema: z.boolean(),
      }),
      message: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.fields.message.title" as const,
        schema: translatedValueSchema,
      }),
      endpointsFound: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.fields.endpointsFound.title" as const,
        schema: z.coerce.number(),
      }),
      duration: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.fields.duration.title" as const,
        schema: z.coerce.number(),
      }),
    },
  }),

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        outputFile: "src/generated/endpoint.ts",
        dryRun: false,
      },
    },
    responses: {
      default: {
        success: true,
        message: "Generated dynamic endpoint with 152 endpoints in 150ms",
        endpointsFound: 152,
        duration: 150,
      },
    },
  },

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title" as const,
      description: "post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.server.title" as const,
      description: "post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.server.title" as const,
      description: "post.errors.server.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.server.title" as const,
      description: "post.errors.server.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.server.title" as const,
      description: "post.errors.server.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title" as const,
      description: "post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.server.title" as const,
      description: "post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.server.title" as const,
      description: "post.errors.server.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.server.title" as const,
      description: "post.errors.server.description" as const,
    },
  },

  successTypes: {
    title: "post.success.title" as const,
    description: "post.success.description" as const,
  },
});

const endpointDynamicGeneratorEndpoints = { POST };
export default endpointDynamicGeneratorEndpoints;
