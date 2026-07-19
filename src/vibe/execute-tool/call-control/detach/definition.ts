/**
 * Detach Call Endpoint Definition
 * POST /api/[locale]/system/execute-tool/call-control/detach
 *
 * Upgrades a single still-running tool call (by its callId) to DETACH: the call
 * keeps running in the background, its result is DISCARDED, and the turn is
 * unblocked now. Use resume-when-done instead when the result is needed.
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
  path: ["vibe", "execute-tool", "call-control", "detach"],
  aliases: ["detach"],
  title: "detachCall.post.title" as const,
  titleShort: "detachCall.post.titleShort" as const,
  description: "detachCall.post.description" as const,
  icon: "plug",
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
      title: "detachCall.post.errors.validation.title",
      description: "detachCall.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "detachCall.post.errors.unauthorized.title",
      description: "detachCall.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "detachCall.post.errors.forbidden.title",
      description: "detachCall.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "detachCall.post.errors.notFound.title",
      description: "detachCall.post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "detachCall.post.errors.server.title",
      description: "detachCall.post.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "detachCall.post.errors.network.title",
      description: "detachCall.post.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "detachCall.post.errors.unknown.title",
      description: "detachCall.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "detachCall.post.errors.unknown.title",
      description: "detachCall.post.errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "detachCall.post.errors.unknown.title",
      description: "detachCall.post.errors.unknown.description",
    },
  },

  successTypes: {
    title: "detachCall.post.success.title" as const,
    description: "detachCall.post.success.description" as const,
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

export type DetachCallRequestOutput = typeof POST.types.RequestOutput;
export type DetachCallResponseOutput = typeof POST.types.ResponseOutput;

export default endpoints;
