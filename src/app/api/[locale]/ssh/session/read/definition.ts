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

import { lazyWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-widget";

const SessionReadContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.SessionReadContainer })),
);

export const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["ssh", "session", "read"],
  title: "session.read.get.title" as const,
  description: "session.read.get.description" as const,
  icon: "terminal",
  category: "endpointCategories.ssh",
  subCategory: "endpointCategories.sshTerminal",
  allowedRoles: [UserRole.ADMIN],
  tags: ["category" as const],

  fields: customWidgetObject({
    render: SessionReadContainer,
    usage: { request: "data", response: true } as const,
    children: {
      sessionId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "session.read.get.fields.sessionId.label" as const,
        description: "session.read.get.fields.sessionId.description" as const,
        schema: z.string(),
      }),
      waitMs: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "session.read.get.fields.waitMs.label" as const,
        description: "session.read.get.fields.waitMs.description" as const,
        schema: z.coerce.number().min(0).max(5000).optional(),
      }),
      maxBytes: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "session.read.get.fields.maxBytes.label" as const,
        description: "session.read.get.fields.maxBytes.description" as const,
        schema: z.coerce.number().min(1).max(65536).optional(),
      }),
      output: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "session.read.get.response.output.title" as const,
        schema: z.string(),
      }),
      eof: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "session.read.get.response.eof.title" as const,
        schema: z.boolean(),
      }),
      status: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "session.read.get.response.status.title" as const,
        schema: z.string(),
      }),
    },
  }),

  successTypes: {
    title: "session.read.get.success.title" as const,
    description: "session.read.get.success.description" as const,
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "session.read.get.errors.validation.title" as const,
      description: "session.read.get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "session.read.get.errors.unauthorized.title" as const,
      description: "session.read.get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "session.read.get.errors.forbidden.title" as const,
      description: "session.read.get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "session.read.get.errors.server.title" as const,
      description: "session.read.get.errors.server.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "session.read.get.errors.notFound.title" as const,
      description: "session.read.get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "session.read.get.errors.unknown.title" as const,
      description: "session.read.get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "session.read.get.errors.unsavedChanges.title" as const,
      description:
        "session.read.get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "session.read.get.errors.conflict.title" as const,
      description: "session.read.get.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "session.read.get.errors.network.title" as const,
      description: "session.read.get.errors.network.description" as const,
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
