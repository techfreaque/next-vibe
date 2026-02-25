/**
 * Server Start Command Endpoint Definition
 * Production-ready endpoint for starting the production server
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
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { TranslationKey } from "@/i18n/core/static-types";

import { scopedTranslation } from "./i18n";

export const START_ALIAS = "start" as const;
export const START_SERVER_ALIAS = "server:start" as const;

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "server", "start"],
  aliases: [START_ALIAS, START_SERVER_ALIAS],
  title: "post.title",
  description: "post.description",
  category: "app.endpointCategories.system",
  tags: ["tags.start"],
  icon: "zap",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.AI_TOOL_OFF,
    UserRole.WEB_OFF,
    UserRole.CLI_AUTH_BYPASS,
  ],

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.form.title",
    description: "post.form.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST FIELDS ===
      seed: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.seed.title",
        description: "post.fields.seed.description",
        columns: 6,
        schema: z.boolean().optional().default(true),
      }),

      dbSetup: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.dbSetup.title",
        description: "post.fields.dbSetup.description",
        columns: 6,
        schema: z.boolean().optional().default(true),
      }),

      taskRunner: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.taskRunner.title",
        description: "post.fields.taskRunner.description",
        columns: 6,
        schema: z.boolean().optional().default(true),
      }),

      nextServer: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.nextServer.title",
        description: "post.fields.nextServer.description",
        columns: 6,
        schema: z.boolean().optional().default(true),
      }),

      port: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.fields.port.title",
        description: "post.fields.port.description",
        columns: 12,
        schema: z.coerce.number().optional(),
      }),

      // === RESPONSE FIELDS ===

      responseMessage: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.fields.output.title",
        schema: z.string() as z.ZodType<TranslationKey>,
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
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
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
      default: {
        seed: true,
        dbSetup: true,
        taskRunner: true,
        nextServer: true,
      },
      withPort: {
        seed: true,
        dbSetup: true,
        taskRunner: true,
        nextServer: true,
        port: 3000,
      },
      noDb: {
        seed: false,
        dbSetup: false,
        taskRunner: true,
        nextServer: true,
      },
      nextOnly: {
        seed: false,
        dbSetup: false,
        taskRunner: false,
        nextServer: true,
      },
    },
    responses: {
      default: {
        responseMessage: "post.fields.output.title",
      },
      withPort: {
        responseMessage: "post.fields.output.title",
      },
      noDb: {
        responseMessage: "post.fields.output.title",
      },
      nextOnly: {
        responseMessage: "post.fields.output.title",
      },
    },
  },
});

// Export types for use in repository
export type ServerStartRequestInput = typeof POST.types.RequestInput;
export type ServerStartRequestOutput = typeof POST.types.RequestOutput;
export type ServerStartResponseInput = typeof POST.types.ResponseInput;
export type ServerStartResponseOutput = typeof POST.types.ResponseOutput;

const startDefinition = { POST };
export default startDefinition;
