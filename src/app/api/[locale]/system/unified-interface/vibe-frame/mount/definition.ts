/**
 * Vibe Frame Mount — Endpoint Definition
 *
 * GET /api/[locale]/system/unified-interface/vibe-frame/mount
 *
 * Returns an isolated HTML document that renders any next-vibe endpoint
 * inside an iframe. Used by the vibe-frame embed script and VibeFrameHost component.
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

import { scopedTranslation } from "./i18n";

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["system", "unified-interface", "vibe-frame", "mount"],
  title: "get.title" as const,
  description: "get.description" as const,
  icon: "globe",
  category: "app.endpointCategories.system",

  tags: [
    "tags.vibeFrame" as const,
    "tags.embed" as const,
    "tags.widget" as const,
    "tags.iframe" as const,
  ],

  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.CLI_OFF,
    UserRole.AI_TOOL_OFF,
  ] as const,

  allowedLocalModeRoles: [] as const,

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.VERTICAL,
    title: "get.container.title" as const,
    description: "get.container.description" as const,
    usage: { request: "data", response: true } as const,
    children: {
      // === REQUEST FIELDS ===
      endpoint: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.endpoint.label" as const,
        description: "get.fields.endpoint.description" as const,
        placeholder: "get.fields.endpoint.placeholder" as const,
        columns: 6,
        schema: z.string().min(1),
      }),

      frameId: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.frameId.label" as const,
        description: "get.fields.frameId.description" as const,
        placeholder: "get.fields.frameId.placeholder" as const,
        columns: 6,
        schema: z.string().optional(),
      }),

      urlPathParams: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.urlPathParams.label" as const,
        description: "get.fields.urlPathParams.description" as const,
        placeholder: "get.fields.urlPathParams.placeholder" as const,
        columns: 6,
        schema: z.string().optional(),
      }),

      data: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.data.label" as const,
        description: "get.fields.data.description" as const,
        placeholder: "get.fields.data.placeholder" as const,
        columns: 6,
        schema: z.string().optional(),
      }),

      theme: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.theme.label" as const,
        description: "get.fields.theme.description" as const,
        columns: 3,
        schema: z
          .enum(["light", "dark", "system"])
          .optional()
          .default("system"),
      }),

      authToken: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.authToken.label" as const,
        description: "get.fields.authToken.description" as const,
        placeholder: "get.fields.authToken.placeholder" as const,
        columns: 9,
        schema: z.string().optional(),
      }),

      // === RESPONSE FIELD ===
      html: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.html.title" as const,
        schema: z.string(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title" as const,
      description: "get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title" as const,
      description: "get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title" as const,
      description: "get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title" as const,
      description: "get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title" as const,
      description: "get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.internal.title" as const,
      description: "get.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title" as const,
      description: "get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsaved.title" as const,
      description: "get.errors.unsaved.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title" as const,
      description: "get.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "get.success.mounted.title" as const,
    description: "get.success.mounted.description" as const,
  },

  examples: {
    requests: {
      default: { endpoint: "contact_POST" },
      withParams: {
        endpoint: "agent_chat_threads_threadId_GET",
        urlPathParams: '{"threadId": "abc-123"}',
        theme: "dark" as const,
      },
    },
    responses: {
      default: {
        html: "<!DOCTYPE html><html>...</html>",
      },
    },
  },
});

export type VibeFrameMountRequestOutput = typeof GET extends {
  types: { RequestOutput: infer R };
}
  ? R
  : never;
export type VibeFrameMountResponseOutput = typeof GET extends {
  types: { ResponseOutput: infer R };
}
  ? R
  : never;

export { GET };
export default { GET };
