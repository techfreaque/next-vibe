/**
 * Run database seeds Endpoint Definition
 * Production-ready endpoint for run database seeds
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { UserRole } from "../../../user/user-roles/enum";
import { scopedTranslation } from "./i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "db", "seed"],
  title: "post.title",
  description: "post.description",
  category: "endpointCategories.systemDatabase",
  tags: ["tag"],
  icon: "leaf",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.PRODUCTION_OFF,
  ],
  aliases: ["seed", "db:seed"],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.form.title",
    description: "post.form.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST FIELDS ===
      environment: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.environment.title",
        description: "fields.environment.description",
        columns: 6,
        schema: z.enum(["dev", "test", "prod"]).default("dev"),
      }),

      // === RESPONSE FIELDS ===
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.success.title",
        schema: z.boolean(),
      }),

      seedsExecuted: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.seedsExecuted.title",
        schema: z.coerce.number(),
      }),

      collections: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "fields.collections.title",
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 3,
          usage: { response: true },
          children: {
            name: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "fields.collections.name.title",
              fieldType: FieldDataType.TEXT,
              schema: z.string(),
            }),
            status: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "fields.collections.status.title",
              schema: z.enum(["success", "skipped", "failed"]),
            }),
            recordsCreated: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "fields.collections.recordsCreated.title",
              fieldType: FieldDataType.NUMBER,
              schema: z.coerce.number(),
            }),
          },
        }),
      }),

      totalRecords: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.totalRecords.title",
        schema: z.coerce.number(),
      }),

      duration: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.duration.title",
        schema: z.coerce.number(),
      }),
    },
  }),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title",
      description: "post.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title",
      description: "post.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title",
      description: "post.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.server.title",
      description: "post.errors.server.description",
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
      default: { environment: "dev" as const },
      prod: { environment: "prod" as const },
    },
    responses: {
      default: {
        success: true,
        seedsExecuted: 12,
        collections: [
          { name: "users", status: "success", recordsCreated: 10 },
          { name: "roles", status: "success", recordsCreated: 5 },
          { name: "permissions", status: "success", recordsCreated: 25 },
        ],
        totalRecords: 260,
        duration: 2500,
      },
    },
  },
});

const endpoints = { POST } as const;
export default endpoints;

// Export types
export type SeedRequestInput = typeof POST.types.RequestInput;
export type SeedRequestOutput = typeof POST.types.RequestOutput;
export type SeedResponseInput = typeof POST.types.ResponseInput;
export type SeedResponseOutput = typeof POST.types.ResponseOutput;
