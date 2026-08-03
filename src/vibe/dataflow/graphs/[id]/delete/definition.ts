/**
 * Vibe Sense - Graph Delete Definition
 *
 * Hard-delete a graph. Only permitted when the graph has no datapoints
 * (see repository.deleteGraph) — otherwise archive it instead.
 */

import { createEndpoint } from "../../../../core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "../../../../core/definition/enums";
import { scopedTranslation } from "./i18n";
import { UserRole } from "../../../../identity/roles/enum";
import { lazyWidget } from "../../../../unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "../../../../unified-ui/_shared/utils";
import {
  requestUrlPathParamsField,
  responseField,
} from "../../../../unified-ui/_shared/utils-i18n";
import { z } from "zod";

const DeleteWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.DeleteWidget })),
);

const { DELETE } = createEndpoint({
  scopedTranslation,
  method: Methods.DELETE,
  path: ["vibe", "dataflow", "graphs", "[id]", "delete"],
  title: "delete.title",
  titleShort: "delete.titleShort",
  description: "delete.description",
  icon: "trash",
  category: "analytics",
  subCategory: "Vibe Sense",
  tags: ["tags.vibeSense" as const],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: DeleteWidget,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      id: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        listEndpoint: async () =>
          (await import("../../definition")).default.GET,
        labelField: "name",
        label: "delete.fields.id.label",
        description: "delete.fields.id.description",
        hidden: true,
        schema: z.string().uuid(),
      }),
      deletedId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "delete.response.deletedId",
        schema: z.string(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "delete.errors.unauthorized.title",
      description: "delete.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "delete.errors.forbidden.title",
      description: "delete.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "delete.errors.server.title",
      description: "delete.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "delete.errors.unknown.title",
      description: "delete.errors.unknown.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "delete.errors.validation.title",
      description: "delete.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "delete.errors.notFound.title",
      description: "delete.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "delete.errors.conflict.title",
      description: "delete.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "delete.errors.network.title",
      description: "delete.errors.network.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "delete.errors.unsavedChanges.title",
      description: "delete.errors.unsavedChanges.description",
    },
  },
  successTypes: {
    title: "delete.success.title",
    description: "delete.success.description",
  },
  examples: {
    urlPathParams: {
      default: { id: "550e8400-e29b-41d4-a716-446655440000" },
    },
    responses: {
      default: { deletedId: "550e8400-e29b-41d4-a716-446655440000" },
    },
  },
});

const definitions = { DELETE };
export default definitions;

export type GraphDeleteDeleteResponseOutput =
  typeof DELETE.types.ResponseOutput;
