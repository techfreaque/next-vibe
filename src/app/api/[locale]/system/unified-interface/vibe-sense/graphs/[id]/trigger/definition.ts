/**
 * Vibe Sense — Graph Trigger Definition
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  requestUrlPathParamsField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";
import { TriggerWidget } from "./widget";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: [
    "system",
    "unified-interface",
    "vibe-sense",
    "graphs",
    "[id]",
    "trigger",
  ],
  title: "post.title",
  description: "post.description",
  icon: "play",
  category: "app.endpointCategories.analytics",
  tags: ["tags.vibeSense" as const],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: TriggerWidget,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      id: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "post.fields.id.label",
        description: "post.fields.id.description",
        hidden: true,
        schema: z.string().uuid(),
      }),
      rangeFrom: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.rangeFrom.label",
        description: "post.fields.rangeFrom.description",
        schema: z.string().datetime(),
      }),
      rangeTo: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.rangeTo.label",
        description: "post.fields.rangeTo.description",
        schema: z.string().datetime(),
      }),
      nodeCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.nodeCount",
        schema: z.number(),
      }),
      errorCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.errorCount",
        schema: z.number(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title",
      description: "post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title",
      description: "post.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title",
      description: "post.errors.network.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title",
      description: "post.errors.unsavedChanges.description",
    },
  },
  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },
  examples: {
    urlPathParams: {
      default: { id: "550e8400-e29b-41d4-a716-446655440000" },
    },
    requests: {
      default: {
        rangeFrom: "2024-01-01T00:00:00Z",
        rangeTo: "2024-01-31T23:59:59Z",
      },
    },
    responses: { default: { nodeCount: 5, errorCount: 0 } },
  },
});

const definitions = { POST };
export default definitions;
