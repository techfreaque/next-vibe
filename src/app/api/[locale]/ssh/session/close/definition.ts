import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
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
  title: "session.close.post.title" as const,
  description: "session.close.post.description" as const,
  icon: "terminal",
  category: "app.endpointCategories.ssh",
  allowedRoles: [UserRole.ADMIN],
  tags: ["category" as const],

  fields: customWidgetObject({
    render: SessionCloseContainer,
    usage: { request: "data", response: true } as const,
    children: {
      sessionId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "session.close.post.fields.sessionId.label" as const,
        description: "session.close.post.fields.sessionId.description" as const,
        schema: z.string(),
      }),
      ok: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "session.close.post.response.ok.title" as const,
        schema: z.boolean(),
      }),
    },
  }),

  successTypes: {
    title: "session.close.post.success.title" as const,
    description: "session.close.post.success.description" as const,
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "session.close.post.errors.validation.title" as const,
      description: "session.close.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "session.close.post.errors.unauthorized.title" as const,
      description:
        "session.close.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "session.close.post.errors.forbidden.title" as const,
      description: "session.close.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "session.close.post.errors.server.title" as const,
      description: "session.close.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "session.close.post.errors.notFound.title" as const,
      description: "session.close.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "session.close.post.errors.unknown.title" as const,
      description: "session.close.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "session.close.post.errors.unsavedChanges.title" as const,
      description:
        "session.close.post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "session.close.post.errors.conflict.title" as const,
      description: "session.close.post.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "session.close.post.errors.network.title" as const,
      description: "session.close.post.errors.network.description" as const,
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
