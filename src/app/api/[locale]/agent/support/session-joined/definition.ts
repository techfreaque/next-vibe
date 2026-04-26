import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "../i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST as const,
  path: ["agent", "support", "session-joined"] as const,
  title: "sessionJoined.title",
  description: "sessionJoined.description",
  category: "endpointCategories.support",
  subCategory: "endpointCategories.support",
  icon: "check-circle",
  tags: ["sessionJoined.tags.support", "sessionJoined.tags.callback"] as const,
  allowedRoles: [UserRole.ADMIN] as const,

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.STACKED,
    title: "sessionJoined.title" as const,
    description: "sessionJoined.description" as const,
    usage: { request: "data", response: true },
    children: {
      sessionId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "sessionJoined.fields.sessionId.label" as const,
        description: "sessionJoined.fields.sessionId.description" as const,
        schema: z.string().uuid(),
      }),
      threadId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "sessionJoined.fields.threadId.label" as const,
        description: "sessionJoined.fields.threadId.description" as const,
        schema: z.string().uuid(),
      }),
      joinedMessage: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "sessionJoined.fields.joinedMessage.label" as const,
        description: "sessionJoined.fields.joinedMessage.description" as const,
        schema: z.string(),
      }),
      acknowledged: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.boolean(),
      }),
    },
  }),

  examples: {
    requests: {
      default: {
        sessionId: "660e8400-e29b-41d4-a716-446655440000",
        threadId: "550e8400-e29b-41d4-a716-446655440000",
        joinedMessage: "A supporter has joined the session.",
      },
    },
    responses: {
      default: {
        acknowledged: true,
      },
    },
  },

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "sessionJoined.errors.validation.title" as const,
      description: "sessionJoined.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "sessionJoined.errors.network.title" as const,
      description: "sessionJoined.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "sessionJoined.errors.unauthorized.title" as const,
      description: "sessionJoined.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "sessionJoined.errors.forbidden.title" as const,
      description: "sessionJoined.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "sessionJoined.errors.notFound.title" as const,
      description: "sessionJoined.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "sessionJoined.errors.server.title" as const,
      description: "sessionJoined.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "sessionJoined.errors.unknown.title" as const,
      description: "sessionJoined.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "sessionJoined.errors.unsaved.title" as const,
      description: "sessionJoined.errors.unsaved.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "sessionJoined.errors.conflict.title" as const,
      description: "sessionJoined.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "sessionJoined.success.title" as const,
    description: "sessionJoined.success.description" as const,
  },
});

export type SessionJoinedRequestOutput = typeof POST.types.RequestOutput;
export type SessionJoinedResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
