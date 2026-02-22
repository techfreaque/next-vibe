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
import { SessionReadContainer } from "./widget";

export const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["ssh", "session", "read"],
  title: "session.read.get.title",
  description: "session.read.get.description",
  icon: "terminal",
  category: "category",
  allowedRoles: [UserRole.ADMIN],
  tags: ["type"],

  fields: customWidgetObject({
    render: SessionReadContainer,
    usage: { request: "data", response: true } as const,
    children: {
      sessionId: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "session.read.get.fields.sessionId.label",
        description: "session.read.get.fields.sessionId.description",
        schema: z.string(),
      }),
      waitMs: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "session.read.get.fields.waitMs.label",
        description: "session.read.get.fields.waitMs.description",
        schema: z.coerce.number().min(0).max(5000).optional(),
      }),
      maxBytes: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "session.read.get.fields.maxBytes.label",
        description: "session.read.get.fields.maxBytes.description",
        schema: z.coerce.number().min(1).max(65536).optional(),
      }),
      output: responseField({
        type: WidgetType.TEXT,
        content: "session.read.get.response.output.title",
        schema: z.string(),
      }),
      eof: responseField({
        type: WidgetType.TEXT,
        content: "session.read.get.response.eof.title",
        schema: z.boolean(),
      }),
      status: responseField({
        type: WidgetType.TEXT,
        content: "session.read.get.response.status.title",
        schema: z.string(),
      }),
    },
  }),

  successTypes: {
    title: "session.read.get.success.title",
    description: "session.read.get.success.description",
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "session.read.get.errors.validation.title",
      description: "session.read.get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "session.read.get.errors.unauthorized.title",
      description: "session.read.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "session.read.get.errors.forbidden.title",
      description: "session.read.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "session.read.get.errors.server.title",
      description: "session.read.get.errors.server.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "session.read.get.errors.notFound.title",
      description: "session.read.get.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "session.read.get.errors.unknown.title",
      description: "session.read.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "session.read.get.errors.unsavedChanges.title",
      description: "session.read.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "session.read.get.errors.conflict.title",
      description: "session.read.get.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "session.read.get.errors.network.title",
      description: "session.read.get.errors.network.description",
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
