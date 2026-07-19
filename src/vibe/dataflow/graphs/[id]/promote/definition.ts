/**
 * Vibe Sense - Graph Promote Definition
 */

import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { scopedTranslation } from "next-vibe/dataflow/graphs/[id]/promote/i18n";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  requestUrlPathParamsField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

const PromoteWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.PromoteWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["vibe", "dataflow", "graphs", "[id]", "promote"],
  title: "post.title",
  titleShort: "post.titleShort",
  description: "post.description",
  icon: "shield",
  category: "analytics",
  subCategory: "Vibe Sense",
  tags: ["tags.vibeSense" as const],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: PromoteWidget,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      id: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        listEndpoint: async () =>
          (await import("next-vibe/dataflow/graphs/definition")).default.GET,
        labelField: "name",
        label: "post.fields.id.label",
        description: "post.fields.id.description",
        hidden: true,
        schema: z.string().uuid(),
      }),
      promotedId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.promotedId",
        schema: z.string(),
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
    responses: {
      default: { promotedId: "550e8400-e29b-41d4-a716-446655440000" },
    },
  },
});

const definitions = { POST };
export default definitions;

export type GraphPromotePostResponseOutput = typeof POST.types.ResponseOutput;
