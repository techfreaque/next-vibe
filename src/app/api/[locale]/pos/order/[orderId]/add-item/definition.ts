/**
 * POS Order Add Item API Route Definition
 * Adds a line item to an open order
 */

import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import {
  customWidgetObject,
  objectField,
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { scopedTranslation } from "../../../i18n";

const PosOrderAddItemWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.PosOrderAddItemWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["pos", "order", "[orderId]", "add-item"],
  title: "orderAddItem.post.title",
  titleShort: "orderAddItem.post.titleShort" as const,
  description: "orderAddItem.post.description",
  category: "pos",
  subCategory: "POS: Orders",
  tags: ["tags.pos", "tags.order", "tags.addItem"],
  allowedRoles: [UserRole.ADMIN],
  icon: "plus",

  fields: customWidgetObject({
    render: PosOrderAddItemWidgetLazy,
    usage: { request: "data", response: true },
    children: {
      orderId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "orderAddItem.post.orderId.label",
        description: "orderAddItem.post.orderId.description",
        schema: z.uuid(),
        listEndpoint: async () =>
          (await import("@/app/api/[locale]/pos/order/list/definition")).default
            .GET,
        labelField: "id",
      }),

      item: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.GRID_2_COLUMNS,
        usage: { request: "data" },
        children: {
          productId: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "orderAddItem.post.productId.label",
            description: "orderAddItem.post.productId.description",
            schema: z.uuid().optional(),
          }),
          description: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "orderAddItem.post.itemDescription.label",
            description: "orderAddItem.post.itemDescription.description",
            placeholder: "orderAddItem.post.itemDescription.placeholder",
            schema: z.string().min(1).max(500).optional(),
          }),
          quantity: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.NUMBER,
            label: "orderAddItem.post.quantity.label",
            description: "orderAddItem.post.quantity.description",
            placeholder: "orderAddItem.post.quantity.placeholder",
            schema: z.number().positive().optional(),
          }),
          unitPrice: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.NUMBER,
            label: "orderAddItem.post.unitPrice.label",
            description: "orderAddItem.post.unitPrice.description",
            placeholder: "orderAddItem.post.unitPrice.placeholder",
            schema: z.number().min(0).optional(),
          }),
          taxRate: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.NUMBER,
            label: "orderAddItem.post.taxRate.label",
            description: "orderAddItem.post.taxRate.description",
            placeholder: "orderAddItem.post.taxRate.placeholder",
            schema: z.number().min(0).max(1).optional(),
          }),
        },
      }),

      result: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          id: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderAddItem.post.response.id",
            schema: z.uuid(),
          }),
          description: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderAddItem.post.response.description",
            schema: z.string(),
          }),
          quantity: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderAddItem.post.response.quantity",
            schema: z.number(),
          }),
          unitPrice: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderAddItem.post.response.unitPrice",
            schema: z.number(),
          }),
          taxAmount: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderAddItem.post.response.taxAmount",
            schema: z.number(),
          }),
          lineTotal: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderAddItem.post.response.lineTotal",
            schema: z.number(),
          }),
          orderTotal: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderAddItem.post.response.orderTotal",
            schema: z.number(),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "orderAddItem.post.errors.validation.title",
      description: "orderAddItem.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "orderAddItem.post.errors.unauthorized.title",
      description: "orderAddItem.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "orderAddItem.post.errors.forbidden.title",
      description: "orderAddItem.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "orderAddItem.post.errors.conflict.title",
      description: "orderAddItem.post.errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "orderAddItem.post.errors.server.title",
      description: "orderAddItem.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "orderAddItem.post.errors.unknown.title",
      description: "orderAddItem.post.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "orderAddItem.post.errors.network.title",
      description: "orderAddItem.post.errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "orderAddItem.post.errors.notFound.title",
      description: "orderAddItem.post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "orderAddItem.post.errors.unsavedChanges.title",
      description: "orderAddItem.post.errors.unsavedChanges.description",
    },
  },

  successTypes: {
    title: "orderAddItem.post.success.title",
    description: "orderAddItem.post.success.description",
  },

  examples: {
    requests: {
      default: {
        orderId: "eeff1122-e89b-12d3-a456-426614174003",
        item: {
          productId: undefined,
          description: "Coffee",
          quantity: 2,
          unitPrice: 3.5,
          taxRate: 0.2,
        },
      },
    },
    responses: {
      default: {
        result: {
          id: "ff001122-e89b-12d3-a456-426614174004",
          description: "Coffee",
          quantity: 2,
          unitPrice: 3.5,
          taxAmount: 1.4,
          lineTotal: 8.4,
          orderTotal: 8.4,
        },
      },
    },
  },
});

export type PosOrderAddItemPostRequestOutput = typeof POST.types.RequestOutput;

const definitions = {
  POST,
} as const;
export default definitions;
