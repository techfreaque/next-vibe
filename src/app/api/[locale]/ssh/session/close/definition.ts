import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "../../i18n";
import { SessionCloseContainer } from "./widget";

export const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["ssh", "session", "close"],
  title: "session.close.post.title",
  description: "session.close.post.description",
  icon: "terminal",
  category: "category",
  allowedRoles: [UserRole.ADMIN],
  tags: ["type"],

  fields: customWidgetObject({
    render: SessionCloseContainer,
    usage: { request: "data", response: true } as const,
    children: {
      sessionId: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "session.close.post.fields.sessionId.label",
        description: "session.close.post.fields.sessionId.description",
        schema: z.string(),
      }),
      ok: responseField({
        type: WidgetType.TEXT,
        content: "session.close.post.response.ok.title",
        schema: z.boolean(),
      }),
    },
  }),

  successTypes: {
    title: "session.close.post.success.title",
    description: "session.close.post.success.description",
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "session.close.post.errors.validation.title",
      description: "session.close.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "session.close.post.errors.unauthorized.title",
      description: "session.close.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "session.close.post.errors.forbidden.title",
      description: "session.close.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "session.close.post.errors.server.title",
      description: "session.close.post.errors.server.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "session.close.post.errors.notFound.title",
      description: "session.close.post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "session.close.post.errors.unknown.title",
      description: "session.close.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "session.close.post.errors.unsavedChanges.title",
      description: "session.close.post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "session.close.post.errors.conflict.title",
      description: "session.close.post.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "session.close.post.errors.network.title",
      description: "session.close.post.errors.network.description",
    },
  },
  examples: {
    requests: { default: { sessionId: "sess-uuid" } },
    responses: { default: { ok: true } },
  },
});

export type SessionCloseRequestOutput = typeof POST.types.RequestOutput;
export type SessionCloseResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
