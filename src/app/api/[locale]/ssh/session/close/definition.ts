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

import { SessionCloseContainer } from "./widget";

export const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["ssh", "session", "close"],
  title: "app.api.ssh.session.close.post.title",
  description: "app.api.ssh.session.close.post.description",
  icon: "terminal",
  category: "app.api.ssh.category",
  allowedRoles: [UserRole.ADMIN],
  tags: ["app.api.ssh.type"],

  fields: customWidgetObject({
    render: SessionCloseContainer,
    usage: { request: "data", response: true } as const,
    children: {
      sessionId: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.ssh.session.close.post.fields.sessionId.label",
        description:
          "app.api.ssh.session.close.post.fields.sessionId.description",
        schema: z.string(),
      }),
      ok: responseField({
        type: WidgetType.TEXT,
        content: "app.api.ssh.session.close.post.response.ok.title",
        schema: z.boolean(),
      }),
    },
  }),

  successTypes: {
    title: "app.api.ssh.session.close.post.success.title",
    description: "app.api.ssh.session.close.post.success.description",
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.ssh.session.close.post.errors.validation.title",
      description:
        "app.api.ssh.session.close.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.ssh.session.close.post.errors.unauthorized.title",
      description:
        "app.api.ssh.session.close.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.ssh.session.close.post.errors.forbidden.title",
      description:
        "app.api.ssh.session.close.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.ssh.session.close.post.errors.server.title",
      description: "app.api.ssh.session.close.post.errors.server.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.ssh.session.close.post.errors.notFound.title",
      description: "app.api.ssh.session.close.post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.ssh.session.close.post.errors.unknown.title",
      description: "app.api.ssh.session.close.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.ssh.session.close.post.errors.unsavedChanges.title",
      description:
        "app.api.ssh.session.close.post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.ssh.session.close.post.errors.conflict.title",
      description: "app.api.ssh.session.close.post.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.ssh.session.close.post.errors.network.title",
      description: "app.api.ssh.session.close.post.errors.network.description",
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
