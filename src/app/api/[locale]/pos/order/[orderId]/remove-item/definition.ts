/**
 * POS Order Remove Item API Route Definition
 * Removes a line item from an open order
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
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

import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";

import posOrderListDefinitions from "@/app/api/[locale]/pos/order/list/definition";

import { scopedTranslation } from "../../../i18n";

const PosOrderRemoveItemWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.PosOrderRemoveItemWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["pos", "order", "[orderId]", "remove-item"],
  title: "orderRemoveItem.post.title",
  titleShort: "orderRemoveItem.post.titleShort" as const,
  description: "orderRemoveItem.post.description",
  category: "pos",
  subCategory: "POS: Orders",
  tags: ["tags.pos", "tags.order", "tags.removeItem"],
  allowedRoles: [UserRole.ADMIN],
  icon: "minus",

  fields: customWidgetObject({
    render: PosOrderRemoveItemWidgetLazy,
    usage: { request: "data", response: true },
    children: {
      details: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.GRID_2_COLUMNS,
        usage: { request: "data" },
        children: {
          orderId: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.ENTITY_PICKER,
            label: "orderRemoveItem.post.orderId.label",
            description: "orderRemoveItem.post.orderId.description",
            schema: z.uuid(),
            listEndpoint: posOrderListDefinitions.GET,
            labelField: "id",
          }),
          itemId: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "orderRemoveItem.post.itemId.label",
            description: "orderRemoveItem.post.itemId.description",
            schema: z.uuid(),
          }),
        },
      }),

      result: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          orderId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "orderRemoveItem.post.response.orderId",
            schema: z.uuid(),
          }),
          orderTotal: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "orderRemoveItem.post.response.orderTotal",
            schema: z.number(),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "orderRemoveItem.post.errors.validation.title",
      description: "orderRemoveItem.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "orderRemoveItem.post.errors.unauthorized.title",
      description: "orderRemoveItem.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "orderRemoveItem.post.errors.forbidden.title",
      description: "orderRemoveItem.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "orderRemoveItem.post.errors.conflict.title",
      description: "orderRemoveItem.post.errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "orderRemoveItem.post.errors.server.title",
      description: "orderRemoveItem.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "orderRemoveItem.post.errors.unknown.title",
      description: "orderRemoveItem.post.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "orderRemoveItem.post.errors.network.title",
      description: "orderRemoveItem.post.errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "orderRemoveItem.post.errors.notFound.title",
      description: "orderRemoveItem.post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "orderRemoveItem.post.errors.unsavedChanges.title",
      description: "orderRemoveItem.post.errors.unsavedChanges.description",
    },
  },

  successTypes: {
    title: "orderRemoveItem.post.success.title",
    description: "orderRemoveItem.post.success.description",
  },

  examples: {
    requests: {
      default: {
        details: {
          orderId: "eeff1122-e89b-12d3-a456-426614174003",
          itemId: "ff001122-e89b-12d3-a456-426614174004",
        },
      },
    },
    responses: {
      default: {
        result: {
          orderId: "eeff1122-e89b-12d3-a456-426614174003",
          orderTotal: 0,
        },
      },
    },
  },
});

export type PosOrderRemoveItemPostRequestOutput =
  typeof POST.types.RequestOutput;

const definitions = {
  POST,
} as const;
export default definitions;
