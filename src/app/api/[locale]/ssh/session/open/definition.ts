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
import { scopedTranslation } from "../../i18n";
import { SessionOpenContainer } from "./widget";

export const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["ssh", "session", "open"],
  title: "session.open.post.title",
  description: "session.open.post.description",
  icon: "terminal",
  category: "category",
  allowedRoles: [UserRole.ADMIN],
  tags: ["type"],

  fields: customWidgetObject({
    render: SessionOpenContainer,
    usage: { request: "data", response: true } as const,
    children: {
      connectionId: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "session.open.post.fields.connectionId.label",
        description: "session.open.post.fields.connectionId.description",
        schema: z.string().uuid().optional(),
      }),
      name: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "session.open.post.fields.name.label",
        description: "session.open.post.fields.name.description",
        schema: z.string().optional(),
      }),
      cols: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "session.open.post.fields.cols.label",
        description: "session.open.post.fields.cols.description",
        schema: z.coerce.number().min(40).max(500).optional(),
      }),
      rows: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "session.open.post.fields.rows.label",
        description: "session.open.post.fields.rows.description",
        schema: z.coerce.number().min(10).max(200).optional(),
      }),
      sessionId: responseField({
        type: WidgetType.TEXT,
        content: "session.open.post.response.sessionId.title",
        schema: z.string(),
      }),
      status: responseField({
        type: WidgetType.TEXT,
        content: "session.open.post.response.status.title",
        schema: z.nativeEnum(SshSessionStatus),
      }),
      shell: responseField({
        type: WidgetType.TEXT,
        content: "session.open.post.response.shell.title",
        schema: z.string(),
      }),
    },
  }),

  successTypes: {
    title: "session.open.post.success.title",
    description: "session.open.post.success.description",
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "session.open.post.errors.validation.title",
      description: "session.open.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "session.open.post.errors.unauthorized.title",
      description: "session.open.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "session.open.post.errors.forbidden.title",
      description: "session.open.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "session.open.post.errors.server.title",
      description: "session.open.post.errors.server.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "session.open.post.errors.notFound.title",
      description: "session.open.post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "session.open.post.errors.unknown.title",
      description: "session.open.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "session.open.post.errors.unsavedChanges.title",
      description: "session.open.post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "session.open.post.errors.conflict.title",
      description: "session.open.post.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "session.open.post.errors.network.title",
      description: "session.open.post.errors.network.description",
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
