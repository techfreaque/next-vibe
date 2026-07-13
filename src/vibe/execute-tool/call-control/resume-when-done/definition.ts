/**
 * Resume-When-Done Endpoint Definition
 * POST /api/[locale]/system/execute-tool/call-control/resume-when-done
 *
 * Upgrades a single still-running tool call (by its callId) to WAKE_UP: the call
 * keeps running in the background, the turn ends, and the thread revives with the
 * result when the work completes. AI-callable during parallel execution.
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
  path: ["vibe", "execute-tool", "call-control", "resume-when-done"],
  aliases: ["resume-when-done"],
  title: "resumeWhenDone.post.title" as const,
  titleShort: "resumeWhenDone.post.titleShort" as const,
  description: "resumeWhenDone.post.description" as const,
  icon: "clock",
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
      title: "resumeWhenDone.post.errors.validation.title",
      description: "resumeWhenDone.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "resumeWhenDone.post.errors.unauthorized.title",
      description: "resumeWhenDone.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "resumeWhenDone.post.errors.forbidden.title",
      description: "resumeWhenDone.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "resumeWhenDone.post.errors.notFound.title",
      description: "resumeWhenDone.post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "resumeWhenDone.post.errors.server.title",
      description: "resumeWhenDone.post.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "resumeWhenDone.post.errors.network.title",
      description: "resumeWhenDone.post.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "resumeWhenDone.post.errors.unknown.title",
      description: "resumeWhenDone.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "resumeWhenDone.post.errors.unknown.title",
      description: "resumeWhenDone.post.errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "resumeWhenDone.post.errors.unknown.title",
      description: "resumeWhenDone.post.errors.unknown.description",
    },
  },

  successTypes: {
    title: "resumeWhenDone.post.success.title" as const,
    description: "resumeWhenDone.post.success.description" as const,
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

export type ResumeWhenDoneRequestOutput = typeof POST.types.RequestOutput;
export type ResumeWhenDoneResponseOutput = typeof POST.types.ResponseOutput;

export default endpoints;
