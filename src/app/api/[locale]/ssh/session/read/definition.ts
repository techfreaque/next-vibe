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

import { SessionReadContainer } from "./widget";

export const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["ssh", "session", "read"],
  title: "app.api.ssh.session.read.get.title",
  description: "app.api.ssh.session.read.get.description",
  icon: "terminal",
  category: "app.api.ssh.category",
  allowedRoles: [UserRole.ADMIN],
  tags: ["app.api.ssh.type"],

  fields: customWidgetObject({
    render: SessionReadContainer,
    usage: { request: "data", response: true } as const,
    children: {
      sessionId: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.ssh.session.read.get.fields.sessionId.label",
        description:
          "app.api.ssh.session.read.get.fields.sessionId.description",
        schema: z.string(),
      }),
      waitMs: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.ssh.session.read.get.fields.waitMs.label",
        description: "app.api.ssh.session.read.get.fields.waitMs.description",
        schema: z.coerce.number().min(0).max(5000).optional(),
      }),
      maxBytes: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.ssh.session.read.get.fields.maxBytes.label",
        description: "app.api.ssh.session.read.get.fields.maxBytes.description",
        schema: z.coerce.number().min(1).max(65536).optional(),
      }),
      output: responseField({
        type: WidgetType.TEXT,
        content: "app.api.ssh.session.read.get.response.output.title",
        schema: z.string(),
      }),
      eof: responseField({
        type: WidgetType.TEXT,
        content: "app.api.ssh.session.read.get.response.eof.title",
        schema: z.boolean(),
      }),
      status: responseField({
        type: WidgetType.TEXT,
        content: "app.api.ssh.session.read.get.response.status.title",
        schema: z.string(),
      }),
    },
  }),

  successTypes: {
    title: "app.api.ssh.session.read.get.success.title",
    description: "app.api.ssh.session.read.get.success.description",
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.ssh.session.read.get.errors.validation.title",
      description: "app.api.ssh.session.read.get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.ssh.session.read.get.errors.unauthorized.title",
      description:
        "app.api.ssh.session.read.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.ssh.session.read.get.errors.forbidden.title",
      description: "app.api.ssh.session.read.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.ssh.session.read.get.errors.server.title",
      description: "app.api.ssh.session.read.get.errors.server.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.ssh.session.read.get.errors.notFound.title",
      description: "app.api.ssh.session.read.get.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.ssh.session.read.get.errors.unknown.title",
      description: "app.api.ssh.session.read.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.ssh.session.read.get.errors.unsavedChanges.title",
      description:
        "app.api.ssh.session.read.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.ssh.session.read.get.errors.conflict.title",
      description: "app.api.ssh.session.read.get.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.ssh.session.read.get.errors.network.title",
      description: "app.api.ssh.session.read.get.errors.network.description",
    },
  },
  examples: {
    requests: { default: { sessionId: "sess-uuid", waitMs: 500 } },
    responses: { default: { output: "$ ", eof: false, status: "ACTIVE" } },
  },
});

export type SessionReadRequestOutput = typeof GET.types.RequestOutput;
export type SessionReadResponseOutput = typeof GET.types.ResponseOutput;

const endpoints = { GET };
export default endpoints;
