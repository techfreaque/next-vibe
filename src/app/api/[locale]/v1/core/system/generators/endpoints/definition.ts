/**
 * Generators Functional API Definition
 * Defines endpoints for functional generator operations
 */

import { z } from "zod";

import {
  EndpointErrorTypes,
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

import { UserRole } from "../../../user/user-roles/enum";

/**
 * Functional Generators Endpoint Definition
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "system", "generators", "endpoints"],
  title: "core.system.dev.category",
  description: "core.system.dev.typecheck.description",
  category: "core.system.dev.category",
  tags: ["core.system.dev.category"],

  // === ROLES ===
  allowedRoles: [UserRole.ADMIN, UserRole.CLI_ONLY],

  // === FIELDS ===
  fields: objectField(
    {
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.TEXT,
      label: "core.system.dev.lint.container.title",
      layout: { columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      skipEndpoints: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "core.system.dev.typecheck.title",
          description: "core.system.dev.typecheck.description",
          required: false,
          layout: { columns: 6 },
        },
        z.boolean().default(false),
      ),

      skipSeeds: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "core.system.dev.typecheck.title",
          description: "core.system.dev.typecheck.description",
          required: false,
          layout: { columns: 6 },
        },
        z.boolean().default(false),
      ),

      skipCronTasks: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "core.system.dev.typecheck.title",
          description: "core.system.dev.typecheck.description",
          required: false,
          layout: { columns: 6 },
        },
        z.boolean().default(false),
      ),

      skipTRPCRouter: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "core.system.dev.typecheck.title",
          description: "core.system.dev.typecheck.description",
          required: false,
          layout: { columns: 6 },
        },
        z.boolean().default(false),
      ),

      rootDir: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "core.system.dev.typecheck.title",
          description: "core.system.dev.typecheck.description",
          required: false,
          layout: { columns: 6 },
        },
        z.string().optional(),
      ),

      verbose: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "core.system.dev.typecheck.title",
          description: "core.system.dev.typecheck.description",
          required: false,
          layout: { columns: 6 },
        },
        z.boolean().default(false),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "core.system.dev.typecheck.success.title",
        },
        z.boolean(),
      ),
      generatorsRun: responseField(
        {
          type: WidgetType.TEXT,
          content: "core.system.dev.typecheck.success.title",
        },
        z.number(),
      ),
      generatorsSkipped: responseField(
        {
          type: WidgetType.TEXT,
          content: "core.system.dev.typecheck.success.title",
        },
        z.number(),
      ),
      output: responseField(
        {
          type: WidgetType.TEXT,
          content: "core.system.dev.typecheck.success.title",
        },
        z.array(z.string()),
      ),
      results: responseField(
        {
          type: WidgetType.TEXT,
          content: "core.system.dev.typecheck.success.title",
        },
        z.object({
          endpoints: z.boolean(),
          seeds: z.boolean(),
          cronTasks: z.boolean(),
          trpcRouter: z.boolean(),
        }),
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "core.system.dev.typecheck.title",
      description: "core.system.dev.typecheck.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "core.system.dev.typecheck.title",
      description: "core.system.dev.typecheck.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "core.system.dev.typecheck.title",
      description: "core.system.dev.typecheck.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "core.system.dev.typecheck.title",
      description: "core.system.dev.typecheck.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "core.system.dev.typecheck.title",
      description: "core.system.dev.typecheck.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "core.system.dev.typecheck.title",
      description: "core.system.dev.typecheck.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "core.system.dev.typecheck.title",
      description: "core.system.dev.typecheck.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "core.system.dev.typecheck.title",
      description: "core.system.dev.typecheck.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "core.system.dev.typecheck.title",
      description: "core.system.dev.typecheck.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "core.system.dev.typecheck.success.title",
    description: "core.system.dev.typecheck.success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        skipEndpoints: false,
        skipSeeds: false,
        skipCronTasks: false,
        skipTRPCRouter: false,
        verbose: false,
      },
    },
    responses: {
      default: {
        success: true,
        generatorsRun: 4,
        generatorsSkipped: 0,
        output: [
          "Generated endpoints",
          "Generated seeds",
          "Generated cron tasks",
          "Generated tRPC router",
        ],
        results: {
          endpoints: true,
          seeds: true,
          cronTasks: true,
          trpcRouter: true,
        },
      },
    },
    urlPathVariables: {
      default: {},
    },
  },
});

const endpointsGeneratorEndpoints = { POST };
export default endpointsGeneratorEndpoints;
