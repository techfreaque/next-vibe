/**
 * Dismiss Task Endpoint Definition
 * POST /api/[locale]/system/engine/execute-tool/dismiss-task
 *
 * Cancels a pending wakeUp revival: the tool continues running in the background
 * but the thread is unblocked immediately. The result is silently discarded when
 * the tool eventually completes.
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
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "execute-tool", "dismiss-task"],
  aliases: ["dismiss-task"],
  title: "dismissTask.post.title" as const,
  titleShort: "dismissTask.post.titleShort" as const,
  description: "dismissTask.post.description" as const,
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

      dismissed: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.boolean(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "dismissTask.post.errors.validation.title",
      description: "dismissTask.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "dismissTask.post.errors.unauthorized.title",
      description: "dismissTask.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "dismissTask.post.errors.forbidden.title",
      description: "dismissTask.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "dismissTask.post.errors.notFound.title",
      description: "dismissTask.post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "dismissTask.post.errors.server.title",
      description: "dismissTask.post.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "dismissTask.post.errors.network.title",
      description: "dismissTask.post.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "dismissTask.post.errors.unknown.title",
      description: "dismissTask.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "dismissTask.post.errors.server.title",
      description: "dismissTask.post.errors.server.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "dismissTask.post.errors.server.title",
      description: "dismissTask.post.errors.server.description",
    },
  },

  successTypes: {
    title: "dismissTask.post.success.title",
    description: "dismissTask.post.success.description",
  },

  examples: {
    requests: {
      default: {
        callId: "pending-call-uuid-here",
      },
    },
    responses: {
      default: {
        dismissed: true,
      },
    },
  },
});

export const endpoints = { POST };

export type DismissTaskRequestOutput = typeof POST.types.RequestOutput;
export type DismissTaskResponseOutput = typeof POST.types.ResponseOutput;

export default endpoints;
