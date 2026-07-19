/**
 * Database Generate Endpoint Definition
 */

import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { scopedTranslation } from "next-vibe/database/generate/i18n";
import { UserRole } from "next-vibe/identity/roles/enum";
import {
  objectField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { DB_GENERATE_ALIAS } from "./constants";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["vibe", "database", "generate"],
  title: "post.title",
  titleShort: "post.titleShort",
  description: "post.description",
  category: "database",
  subCategory: "Migrations",
  tags: ["tag"],
  icon: "file-plus",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.CLI_AUTH_BYPASS,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
  ],
  aliases: [DB_GENERATE_ALIAS] as const,

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.form.title",
    description: "post.form.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // === RESPONSE FIELDS ===
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "fields.success.title",
        schema: z.boolean(),
      }),

      output: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "fields.output.title",
        schema: z.string(),
      }),

      duration: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "fields.duration.title",
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
      title: "post.errors.server.title",
      description: "post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.server.title",
      description: "post.errors.server.description",
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
    requests: undefined,
    responses: {
      default: {
        success: true,
        output: "✅ Migration files generated successfully",
        duration: 450,
      },
    },
  },
});

const endpoints = { POST };
export default endpoints;

export type GenerateRequestInput = typeof POST.types.RequestInput;
export type GenerateRequestOutput = typeof POST.types.RequestOutput;
export type GenerateResponseInput = typeof POST.types.ResponseInput;
export type GenerateResponseOutput = typeof POST.types.ResponseOutput;
