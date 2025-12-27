/**
 * Generators Functional API Definition
 * Defines endpoints for functional generator operations
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

import { UserRole } from "../../../user/user-roles/enum";

/**
 * Functional Generators Endpoint Definition
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["system", "generators", "endpoints"],
  title: "app.api.system.dev.category",
  description: "app.api.system.dev.typecheck.description",
  category: "app.api.system.dev.category",
  tags: ["app.api.system.dev.category"],
  icon: "sparkles",

  // === ROLES ===
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.MCP_OFF,
    UserRole.PRODUCTION_OFF,
  ],

  // === FIELDS ===
  fields: objectField(
    {
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.TEXT,
      label: "app.api.system.dev.lint.container.title",
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      skipEndpoints: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.system.dev.typecheck.title",
          description: "app.api.system.dev.typecheck.description",
          columns: 6,
        },
        z.boolean().default(false),
      ),

      skipSeeds: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.system.dev.typecheck.title",
          description: "app.api.system.dev.typecheck.description",
          columns: 6,
        },
        z.boolean().default(false),
      ),

      skipCronTasks: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.system.dev.typecheck.title",
          description: "app.api.system.dev.typecheck.description",
          columns: 6,
        },
        z.boolean().default(false),
      ),

      skipTRPCRouter: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.system.dev.typecheck.title",
          description: "app.api.system.dev.typecheck.description",
          columns: 6,
        },
        z.boolean().default(false),
      ),

      rootDir: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.system.dev.typecheck.title",
          description: "app.api.system.dev.typecheck.description",
          columns: 6,
        },
        z.string().optional(),
      ),

      verbose: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.system.dev.typecheck.title",
          description: "app.api.system.dev.typecheck.description",
          columns: 6,
        },
        z.boolean().default(false),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.system.dev.typecheck.success.title",
        },
        z.boolean(),
      ),
      generatorsRun: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.system.dev.typecheck.success.title",
        },
        z.coerce.number(),
      ),
      generatorsSkipped: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.system.dev.typecheck.success.title",
        },
        z.coerce.number(),
      ),
      output: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.system.dev.typecheck.success.title",
        },
        z.array(z.string()),
      ),
      results: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.system.dev.typecheck.success.title",
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
      title: "app.api.system.dev.typecheck.title",
      description: "app.api.system.dev.typecheck.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.system.dev.typecheck.title",
      description: "app.api.system.dev.typecheck.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.system.dev.typecheck.title",
      description: "app.api.system.dev.typecheck.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.system.dev.typecheck.title",
      description: "app.api.system.dev.typecheck.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.system.dev.typecheck.title",
      description: "app.api.system.dev.typecheck.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.system.dev.typecheck.title",
      description: "app.api.system.dev.typecheck.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.system.dev.typecheck.title",
      description: "app.api.system.dev.typecheck.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.system.dev.typecheck.title",
      description: "app.api.system.dev.typecheck.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.system.dev.typecheck.title",
      description: "app.api.system.dev.typecheck.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.system.dev.typecheck.success.title",
    description: "app.api.system.dev.typecheck.success.description",
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
    urlPathParams: undefined,
  },
});

const endpointsGeneratorEndpoints = { POST };
export default endpointsGeneratorEndpoints;
