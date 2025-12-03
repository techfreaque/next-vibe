/**
 * Seeds Generator API Definition
 * Defines endpoints for generating database seed files
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

/**
 * Seeds generation response schema
 * Currently unused but kept for future API versioning
 */
export const seedsGenerationResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  seedsFound: z.number(),
  duration: z.number(),
  outputDir: z.string().optional(),
  includeTestData: z.boolean().optional(),
  includeProdData: z.boolean().optional(),
});

/**
 * POST endpoint definition - Generate seeds
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["system", "generators", "seeds"],
  title: "app.api.system.generators.seeds.post.title",
  description: "app.api.system.generators.seeds.post.description",
  category: "app.api.system.generators.category",
  tags: ["app.api.system.generators.seeds.success.generated"],
  allowedRoles: [UserRole.ADMIN, UserRole.WEB_OFF, UserRole.AI_TOOL_OFF],

  fields: objectField(
    {
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.TEXT,
      label: "app.api.system.db.seed.post.title",
      columns: 12,
    },
    { request: "data", response: true },
    {
      outputDir: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.system.db.seed.post.title",
          description: "app.api.system.db.seed.post.description",
          columns: 6,
        },
        z.string().default("src/app/api/[locale]/system/generated"),
      ),

      includeTestData: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.system.db.seed.post.title",
          description: "app.api.system.db.seed.post.description",
          columns: 3,
        },
        z.boolean().default(true),
      ),

      includeProdData: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.system.db.seed.post.title",
          description: "app.api.system.db.seed.post.description",
          columns: 3,
        },
        z.boolean().default(false),
      ),

      verbose: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.system.db.seed.post.title",
          description: "app.api.system.db.seed.post.description",
          columns: 6,
        },
        z.boolean().default(false),
      ),

      dryRun: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.system.db.seed.post.title",
          description: "app.api.system.db.seed.post.description",
          columns: 6,
        },
        z.boolean().default(false),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.system.db.seed.post.title",
        },
        z.boolean(),
      ),
      message: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.system.db.seed.post.title",
        },
        z.string(),
      ),
      seedsFound: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.system.db.seed.post.title",
        },
        z.number(),
      ),
      duration: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.system.db.seed.post.title",
        },
        z.number(),
      ),
      outputPath: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.system.db.seed.post.title",
        },
        z.string(),
      ),
    },
  ),

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
    urlPathParams: undefined,
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.system.generators.seeds.post.errors.validation.title",
      description:
        "app.api.system.generators.seeds.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.system.generators.seeds.post.errors.unauthorized.title",
      description:
        "app.api.system.generators.seeds.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.system.generators.seeds.post.errors.forbidden.title",
      description:
        "app.api.system.generators.seeds.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.system.generators.seeds.post.errors.notFound.title",
      description:
        "app.api.system.generators.seeds.post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.system.generators.seeds.post.errors.server.title",
      description:
        "app.api.system.generators.seeds.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.system.generators.seeds.post.errors.unknown.title",
      description:
        "app.api.system.generators.seeds.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.system.generators.seeds.post.errors.unsavedChanges.title",
      description:
        "app.api.system.generators.seeds.post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.system.generators.seeds.post.errors.conflict.title",
      description:
        "app.api.system.generators.seeds.post.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.system.generators.seeds.post.errors.network.title",
      description:
        "app.api.system.generators.seeds.post.errors.network.description",
    },
  },
  successTypes: {
    title: "app.api.system.generators.seeds.post.success.title",
    description: "app.api.system.generators.seeds.post.success.description",
  },
});

// Export types for repository usage
export type SeedsGeneratorRequestInput = typeof POST.types.RequestInput;
export type SeedsGeneratorRequestOutput = typeof POST.types.RequestOutput;
export type SeedsGeneratorResponseInput = typeof POST.types.ResponseInput;
export type SeedsGeneratorResponseOutput = typeof POST.types.ResponseOutput;

const seedsGeneratorEndpoints = { POST };
export default seedsGeneratorEndpoints;
