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
import { SessionWriteContainer } from "./widget";

export const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["ssh", "session", "write"],
  title: "session.write.post.title",
  description: "session.write.post.description",
  icon: "terminal",
  category: "category",
  allowedRoles: [UserRole.ADMIN],
  tags: ["type"],

  fields: customWidgetObject({
    render: SessionWriteContainer,
    usage: { request: "data", response: true } as const,
    children: {
      sessionId: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "session.write.post.fields.sessionId.label",
        description: "session.write.post.fields.sessionId.description",
        schema: z.string(),
      }),
      input: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "session.write.post.fields.input.label",
        description: "session.write.post.fields.input.description",
        schema: z.string(),
      }),
      raw: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "session.write.post.fields.raw.label",
        description: "session.write.post.fields.raw.description",
        schema: z.boolean().optional(),
      }),
      ok: responseField({
        type: WidgetType.TEXT,
        content: "session.write.post.response.ok.title",
        schema: z.boolean(),
      }),
    },
  }),

  successTypes: {
    title: "session.write.post.success.title",
    description: "session.write.post.success.description",
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "session.write.post.errors.validation.title",
      description: "session.write.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "session.write.post.errors.unauthorized.title",
      description: "session.write.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "session.write.post.errors.forbidden.title",
      description: "session.write.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "session.write.post.errors.server.title",
      description: "session.write.post.errors.server.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "session.write.post.errors.notFound.title",
      description: "session.write.post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "session.write.post.errors.unknown.title",
      description: "session.write.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "session.write.post.errors.unsavedChanges.title",
      description: "session.write.post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "session.write.post.errors.conflict.title",
      description: "session.write.post.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "session.write.post.errors.network.title",
      description: "session.write.post.errors.network.description",
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
