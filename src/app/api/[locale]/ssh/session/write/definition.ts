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
import { SessionWriteContainer } from "./widget";

export const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["ssh", "session", "write"],
  title: "session.write.post.title" as const,
  description: "session.write.post.description" as const,
  icon: "terminal",
  category: "endpointCategories.ssh",
  subCategory: "endpointCategories.sshTerminal",
  allowedRoles: [UserRole.ADMIN],
  tags: ["category" as const],

  fields: customWidgetObject({
    render: SessionWriteContainer,
    usage: { request: "data", response: true } as const,
    children: {
      sessionId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "session.write.post.fields.sessionId.label" as const,
        description: "session.write.post.fields.sessionId.description" as const,
        schema: z.string(),
      }),
      input: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "session.write.post.fields.input.label" as const,
        description: "session.write.post.fields.input.description" as const,
        schema: z.string(),
      }),
      raw: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "session.write.post.fields.raw.label" as const,
        description: "session.write.post.fields.raw.description" as const,
        schema: z.boolean().optional(),
      }),
      ok: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "session.write.post.response.ok.title" as const,
        schema: z.boolean(),
      }),
    },
  }),

  successTypes: {
    title: "session.write.post.success.title" as const,
    description: "session.write.post.success.description" as const,
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "session.write.post.errors.validation.title" as const,
      description: "session.write.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "session.write.post.errors.unauthorized.title" as const,
      description:
        "session.write.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "session.write.post.errors.forbidden.title" as const,
      description: "session.write.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "session.write.post.errors.server.title" as const,
      description: "session.write.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "session.write.post.errors.notFound.title" as const,
      description: "session.write.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "session.write.post.errors.unknown.title" as const,
      description: "session.write.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "session.write.post.errors.unsavedChanges.title" as const,
      description:
        "session.write.post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "session.write.post.errors.conflict.title" as const,
      description: "session.write.post.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "session.write.post.errors.network.title" as const,
      description: "session.write.post.errors.network.description" as const,
    },
  },
  examples: {
    requests: { default: { sessionId: "sess-uuid", input: "ls -la" } },
    responses: { default: { ok: true } },
  },
});

export type SessionWriteRequestOutput = typeof POST.types.RequestOutput;
export type SessionWriteResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
