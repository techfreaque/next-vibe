/**
 * SSH Session Open Endpoint Definition
 * POST /ssh/session/open — Open a PTY session (SSH only)
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  scopedRequestField,
  scopedResponseField,
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
  title: "session.open.post.title" as const,
  description: "session.open.post.description" as const,
  icon: "terminal",
  category: "app.endpointCategories.ssh",
  allowedRoles: [UserRole.ADMIN],
  tags: ["category" as const],

  fields: customWidgetObject({
    render: SessionOpenContainer,
    usage: { request: "data", response: true } as const,
    children: {
      connectionId: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "session.open.post.fields.connectionId.label" as const,
        description:
          "session.open.post.fields.connectionId.description" as const,
        schema: z.string().uuid().optional(),
      }),
      name: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "session.open.post.fields.name.label" as const,
        description: "session.open.post.fields.name.description" as const,
        schema: z.string().optional(),
      }),
      cols: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "session.open.post.fields.cols.label" as const,
        description: "session.open.post.fields.cols.description" as const,
        schema: z.coerce.number().min(40).max(500).optional(),
      }),
      rows: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "session.open.post.fields.rows.label" as const,
        description: "session.open.post.fields.rows.description" as const,
        schema: z.coerce.number().min(10).max(200).optional(),
      }),
      sessionId: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "session.open.post.response.sessionId.title" as const,
        schema: z.string(),
      }),
      status: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "session.open.post.response.status.title" as const,
        schema: z.nativeEnum(SshSessionStatus),
      }),
      shell: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "session.open.post.response.shell.title" as const,
        schema: z.string(),
      }),
    },
  }),

  successTypes: {
    title: "session.open.post.success.title" as const,
    description: "session.open.post.success.description" as const,
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "session.open.post.errors.validation.title" as const,
      description: "session.open.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "session.open.post.errors.unauthorized.title" as const,
      description: "session.open.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "session.open.post.errors.forbidden.title" as const,
      description: "session.open.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "session.open.post.errors.server.title" as const,
      description: "session.open.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "session.open.post.errors.notFound.title" as const,
      description: "session.open.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "session.open.post.errors.unknown.title" as const,
      description: "session.open.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "session.open.post.errors.unsavedChanges.title" as const,
      description:
        "session.open.post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "session.open.post.errors.conflict.title" as const,
      description: "session.open.post.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "session.open.post.errors.network.title" as const,
      description: "session.open.post.errors.network.description" as const,
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
