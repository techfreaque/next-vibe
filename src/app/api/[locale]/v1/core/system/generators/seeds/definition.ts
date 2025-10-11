/**
 * Seeds Generator API Definition
 * Defines endpoints for generating database seed files
 */

import { z } from "zod";

import {
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";
import { LayoutType } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/types";

import { UserRoleValue } from "../../user/user-roles/enum";

/**
 * Seeds generation response schema
 */
const seedsGenerationResponseSchema = z.object({
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
const POST = (createEndpoint)({
  method: Methods.POST,
  path: ["v1", "core", "system", "generators", "seeds"],
  title: "core.system.db.seed.title",
  description: "core.system.db.seed.description",

  allowedRoles: [UserRole.ADMIN, UserRole.CLI_ONLY],

  fields: objectField(
    {
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.TEXT,
      label: "core.system.db.seed.title",
      layout: { columns: 12 },
    },
    { request: "data", response: true },
    {
      outputDir: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "core.system.db.seed.title",
          description: "core.system.db.seed.description",
          layout: { columns: 6 },
        },
        z
          .string()
          .default("src/app/api/[locale]/v1/core/system/generated/seeds"),
      ),

      includeTestData: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "core.system.db.seed.title",
          description: "core.system.db.seed.description",
          layout: { columns: 3 },
        },
        z.boolean().default(true),
      ),

      includeProdData: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "core.system.db.seed.title",
          description: "core.system.db.seed.description",
          layout: { columns: 3 },
        },
        z.boolean().default(false),
      ),

      verbose: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "core.system.db.seed.title",
          description: "core.system.db.seed.description",
          layout: { columns: 6 },
        },
        z.boolean().default(false),
      ),

      dryRun: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "core.system.db.seed.title",
          description: "core.system.db.seed.description",
          layout: { columns: 6 },
        },
        z.boolean().default(false),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "core.system.db.seed.title",
        },
        z.boolean(),
      ),
      message: responseField(
        {
          type: WidgetType.TEXT,
          content: "core.system.db.seed.title",
        },
        z.string(),
      ),
      seedsFound: responseField(
        {
          type: WidgetType.TEXT,
          content: "core.system.db.seed.title",
        },
        z.number(),
      ),
      duration: responseField(
        {
          type: WidgetType.TEXT,
          content: "core.system.db.seed.title",
        },
        z.number(),
      ),
      outputPath: responseField(
        {
          type: WidgetType.TEXT,
          content: "core.system.db.seed.title",
        },
        z.string(),
      ),
    },
  ),

  examples: {
    requests: {
      default: {
        outputDir: "src/app/api/[locale]/v1/core/system/generated/seeds",
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
        outputPath: "src/app/api/[locale]/v1/core/system/generated/seeds",
      },
    },
    urlPathVariables: {
      default: {},
    },
  },
});

const seedsGeneratorEndpoints = { POST };
export default seedsGeneratorEndpoints;
