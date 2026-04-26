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
  path: ["agent", "support", "close"] as const,
  title: "close.title",
  description: "close.description",
  category: "endpointCategories.support",
  subCategory: "endpointCategories.support",
  icon: "x-circle",
  tags: ["close.tags.support", "close.tags.close"] as const,
  allowedRoles: [UserRole.ADMIN] as const,

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.STACKED,
    title: "close.title" as const,
    description: "close.description" as const,
    usage: { request: "data", response: true },
    children: {
      sessionId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "close.fields.sessionId.label" as const,
        description: "close.fields.sessionId.description" as const,
        schema: z.string().uuid(),
      }),
      closed: responseField(scopedTranslation, {
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
      },
    },
    responses: {
      default: {
        closed: true,
      },
    },
  },

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "close.errors.validation.title" as const,
      description: "close.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "close.errors.network.title" as const,
      description: "close.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "close.errors.unauthorized.title" as const,
      description: "close.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "close.errors.forbidden.title" as const,
      description: "close.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "close.errors.notFound.title" as const,
      description: "close.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "close.errors.server.title" as const,
      description: "close.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "close.errors.unknown.title" as const,
      description: "close.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "close.errors.unsaved.title" as const,
      description: "close.errors.unsaved.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "close.errors.conflict.title" as const,
      description: "close.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "close.success.title" as const,
    description: "close.success.description" as const,
  },
});

export type CloseRequestOutput = typeof POST.types.RequestOutput;
export type CloseResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
