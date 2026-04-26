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
  path: ["agent", "support", "join"] as const,
  title: "join.title",
  description: "join.description",
  category: "endpointCategories.support",
  subCategory: "endpointCategories.support",
  icon: "user-plus",
  tags: ["join.tags.support", "join.tags.join"] as const,
  allowedRoles: [UserRole.ADMIN] as const,

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.STACKED,
    title: "join.title" as const,
    description: "join.description" as const,
    usage: { request: "data", response: true },
    children: {
      sessionId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "join.fields.sessionId.label" as const,
        description: "join.fields.sessionId.description" as const,
        schema: z.string().uuid(),
      }),
      threadId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.string().uuid().nullable(),
      }),
      initiatorInstanceUrl: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.string().nullable(),
      }),
    },
  }),

  examples: {
    requests: {
      default: {
        sessionId: "660e8400-e29b-41d4-a716-446655440000",
      },
    },
    responses: {
      default: {
        threadId: "550e8400-e29b-41d4-a716-446655440000",
        initiatorInstanceUrl: "https://hermes.example.com",
      },
    },
  },

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "join.errors.validation.title" as const,
      description: "join.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "join.errors.network.title" as const,
      description: "join.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "join.errors.unauthorized.title" as const,
      description: "join.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "join.errors.forbidden.title" as const,
      description: "join.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "join.errors.notFound.title" as const,
      description: "join.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "join.errors.server.title" as const,
      description: "join.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "join.errors.unknown.title" as const,
      description: "join.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "join.errors.unsaved.title" as const,
      description: "join.errors.unsaved.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "join.errors.conflict.title" as const,
      description: "join.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "join.success.title" as const,
    description: "join.success.description" as const,
  },
});

export type JoinRequestInput = typeof POST.types.RequestInput;
export type JoinRequestOutput = typeof POST.types.RequestOutput;
export type JoinResponseInput = typeof POST.types.ResponseInput;
export type JoinResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
