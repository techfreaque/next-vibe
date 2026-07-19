/**
 * Cancel Tool Endpoint Definition
 * POST /api/[locale]/system/execute-tool/cancel-tool
 *
 * Interrupts a single in-flight tool call (identified by its callId) while it is
 * still running. The call unwinds and returns an error AS its tool result — the
 * turn and any sibling parallel tool calls keep running. AI-callable during
 * parallel execution (e.g. abandon a stuck command without ending the turn).
 */

import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { scopedTranslation } from "next-vibe/platforms/ai/i18n";
import {
  objectField,
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["vibe", "execute-tool", "call-control", "cancel"],
  aliases: ["cancel"],
  title: "cancelTool.post.title" as const,
  titleShort: "cancelTool.post.titleShort" as const,
  description: "cancelTool.post.description" as const,
  icon: "x-circle",
  category: "ai",
  subCategory: "Tools",
  tags: ["tools.get.tags.tools" as const],

  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
    UserRole.ADMIN,
  ] as const,

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true } as const,
    children: {
      callId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 12,
        schema: z.string().min(1),
      }),

      delivered: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.boolean(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "cancelTool.post.errors.validation.title",
      description: "cancelTool.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "cancelTool.post.errors.unauthorized.title",
      description: "cancelTool.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "cancelTool.post.errors.forbidden.title",
      description: "cancelTool.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "cancelTool.post.errors.notFound.title",
      description: "cancelTool.post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "cancelTool.post.errors.server.title",
      description: "cancelTool.post.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "cancelTool.post.errors.network.title",
      description: "cancelTool.post.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "cancelTool.post.errors.unknown.title",
      description: "cancelTool.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "cancelTool.post.errors.unknown.title",
      description: "cancelTool.post.errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "cancelTool.post.errors.unknown.title",
      description: "cancelTool.post.errors.unknown.description",
    },
  },

  successTypes: {
    title: "cancelTool.post.success.title" as const,
    description: "cancelTool.post.success.description" as const,
  },

  examples: {
    requests: {
      default: { callId: "functions.execute-tool:3" },
    },
    responses: {
      default: { delivered: true },
    },
  },
});

export const endpoints = { POST };

export type CancelToolRequestOutput = typeof POST.types.RequestOutput;
export type CancelToolResponseOutput = typeof POST.types.ResponseOutput;

export default endpoints;
