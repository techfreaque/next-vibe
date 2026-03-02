/**
 * Seeds Generator API Definition
 * Defines endpoints for generating database seed files
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  scopedObjectFieldNew,
  scopedRequestField,
  scopedResponseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { scopedTranslation } from "./i18n";

/**
 * Seeds generation response schema
 * Currently unused but kept for future API versioning
 */
export const seedsGenerationResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  seedsFound: z.coerce.number(),
  duration: z.coerce.number(),
  outputDir: z.string().optional(),
  includeTestData: z.boolean().optional(),
  includeProdData: z.boolean().optional(),
});

/**
 * POST endpoint definition - Generate seeds
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "generators", "seeds"],
  title: "post.title",
  description: "post.description",
  category: "app.endpointCategories.system",
  tags: ["success.generated"],
  icon: "leaf",
  allowedRoles: [
    // use vibe generate instead
  ],

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.title",
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      outputDir: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.title",
        description: "post.description",
        columns: 6,
        schema: z.string().default("src/app/api/[locale]/system/generated"),
      }),

      includeTestData: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.title",
        description: "post.description",
        columns: 3,
        schema: z.boolean().default(true),
      }),

      includeProdData: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.title",
        description: "post.description",
        columns: 3,
        schema: z.boolean().default(false),
      }),

      verbose: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.title",
        description: "post.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),

      dryRun: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.title",
        description: "post.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),

      // === RESPONSE FIELDS ===
      success: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.title",
        schema: z.boolean(),
      }),
      message: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.title",
        schema: z.string(),
      }),
      seedsFound: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.title",
        schema: z.coerce.number(),
      }),
      duration: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.title",
        schema: z.coerce.number(),
      }),
      outputPath: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.title",
        schema: z.string(),
      }),
    },
  }),

  examples: {
    requests: {
      default: {
        outputDir: "src/app/api/[locale]/system/generated",
        includeTestData: true,
        includeProdData: false,
        verbose: false,
        dryRun: false,
      },
    },
    responses: {
      default: {
        success: true,
        message: "Generated seeds file with 5 seeds in 150ms",
        seedsFound: 5,
        duration: 150,
        outputPath: "src/app/api/[locale]/system/generated",
      },
    },
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
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
      title: "post.errors.server.title",
      description: "post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title",
      description: "post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title",
      description: "post.errors.network.description",
    },
  },
  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },
});

// Export types for repository usage
export type SeedsGeneratorRequestInput = typeof POST.types.RequestInput;
export type SeedsGeneratorRequestOutput = typeof POST.types.RequestOutput;
export type SeedsGeneratorResponseInput = typeof POST.types.ResponseInput;
export type SeedsGeneratorResponseOutput = typeof POST.types.ResponseOutput;

const seedsGeneratorEndpoints = { POST };
export default seedsGeneratorEndpoints;
