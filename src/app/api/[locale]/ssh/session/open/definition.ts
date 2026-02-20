/**
 * SSH Session Open Endpoint Definition
 * POST /ssh/session/open — Open a PTY session (SSH only)
 */

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

import { SshSessionStatus } from "../../enum";
import { SessionOpenContainer } from "./widget";

export const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["ssh", "session", "open"],
  title: "app.api.ssh.session.open.post.title",
  description: "app.api.ssh.session.open.post.description",
  icon: "terminal",
  category: "app.api.ssh.category",
  allowedRoles: [UserRole.ADMIN],
  tags: ["app.api.ssh.type"],

  fields: customWidgetObject({
    render: SessionOpenContainer,
    usage: { request: "data", response: true } as const,
    children: {
      connectionId: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.ssh.session.open.post.fields.connectionId.label",
        description:
          "app.api.ssh.session.open.post.fields.connectionId.description",
        schema: z.string().uuid().optional(),
      }),
      name: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.ssh.session.open.post.fields.name.label",
        description: "app.api.ssh.session.open.post.fields.name.description",
        schema: z.string().optional(),
      }),
      cols: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.ssh.session.open.post.fields.cols.label",
        description: "app.api.ssh.session.open.post.fields.cols.description",
        schema: z.coerce.number().min(40).max(500).optional(),
      }),
      rows: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.ssh.session.open.post.fields.rows.label",
        description: "app.api.ssh.session.open.post.fields.rows.description",
        schema: z.coerce.number().min(10).max(200).optional(),
      }),
      sessionId: responseField({
        type: WidgetType.TEXT,
        content: "app.api.ssh.session.open.post.response.sessionId.title",
        schema: z.string(),
      }),
      status: responseField({
        type: WidgetType.TEXT,
        content: "app.api.ssh.session.open.post.response.status.title",
        schema: z.nativeEnum(SshSessionStatus),
      }),
      shell: responseField({
        type: WidgetType.TEXT,
        content: "app.api.ssh.session.open.post.response.shell.title",
        schema: z.string(),
      }),
    },
  }),

  successTypes: {
    title: "app.api.ssh.session.open.post.success.title",
    description: "app.api.ssh.session.open.post.success.description",
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.ssh.session.open.post.errors.validation.title",
      description:
        "app.api.ssh.session.open.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.ssh.session.open.post.errors.unauthorized.title",
      description:
        "app.api.ssh.session.open.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.ssh.session.open.post.errors.forbidden.title",
      description: "app.api.ssh.session.open.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.ssh.session.open.post.errors.server.title",
      description: "app.api.ssh.session.open.post.errors.server.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.ssh.session.open.post.errors.notFound.title",
      description: "app.api.ssh.session.open.post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.ssh.session.open.post.errors.unknown.title",
      description: "app.api.ssh.session.open.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.ssh.session.open.post.errors.unsavedChanges.title",
      description:
        "app.api.ssh.session.open.post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.ssh.session.open.post.errors.conflict.title",
      description: "app.api.ssh.session.open.post.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.ssh.session.open.post.errors.network.title",
      description: "app.api.ssh.session.open.post.errors.network.description",
    },
  },

  examples: {
    requests: { default: { cols: 220, rows: 50 } },
    responses: {
      default: {
        sessionId: "sess-uuid",
        status: SshSessionStatus.ACTIVE,
        shell: "/bin/bash",
      },
    },
  },
});

export type SessionOpenRequestOutput = typeof POST.types.RequestOutput;
export type SessionOpenResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
