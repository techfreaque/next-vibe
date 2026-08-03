/**
 * Purchase Order Line Add API Route Definition
 * POST — add a line item to a purchase order
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  objectField,
  requestField,
  requestUrlPathParamsField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "../../../i18n";

const OrderLineAddWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.OrderLineAddWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["purchasing", "order", "line", "add"],
  title: "orderLineAdd.post.title" as const,
  titleShort: "orderLineAdd.post.titleShort" as const,
  description: "orderLineAdd.post.description" as const,
  category: "purchasing",
  subCategory: "Purchasing: Orders",
  icon: "plus" as const,
  tags: [
    "tags.purchasing" as const,
    "tags.order" as const,
    "tags.addLine" as const,
  ],
  allowedRoles: [UserRole.ADMIN] as const,

  fields: customWidgetObject({
    render: OrderLineAddWidgetLazy,
    usage: { request: "data&urlPathParams", response: true },
    children: {
      poId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        listEndpoint: async () =>
          (await import("@/purchasing/order/list/definition")).default.GET,
        labelField: "poNumber",
        label: "orderLineAdd.post.poId.label" as const,
        description: "orderLineAdd.post.poId.description" as const,
        hidden: true,
        schema: z.uuid(),
      }),

      productId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        listEndpoint: async () =>
          (await import("@/products/catalog/list/definition")).default.GET,
        labelField: "name",
        label: "orderLineAdd.post.productId.label" as const,
        description: "orderLineAdd.post.productId.description" as const,
        placeholder: "orderLineAdd.post.productId.placeholder" as const,
        schema: z.uuid().optional(),
      }),

      itemDescription: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "orderLineAdd.post.itemDescription.label" as const,
        description: "orderLineAdd.post.itemDescription.description" as const,
        placeholder: "orderLineAdd.post.itemDescription.placeholder" as const,
        schema: z.string().min(1),
      }),

      quantity: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "orderLineAdd.post.quantity.label" as const,
        description: "orderLineAdd.post.quantity.description" as const,
        placeholder: "orderLineAdd.post.quantity.placeholder" as const,
        schema: z.number().positive(),
      }),

      unitPrice: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "orderLineAdd.post.unitPrice.label" as const,
        description: "orderLineAdd.post.unitPrice.description" as const,
        placeholder: "orderLineAdd.post.unitPrice.placeholder" as const,
        schema: z.number().min(0),
      }),

      taxRate: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "orderLineAdd.post.taxRate.label" as const,
        description: "orderLineAdd.post.taxRate.description" as const,
        placeholder: "orderLineAdd.post.taxRate.placeholder" as const,
        schema: z.number().min(0).max(1).optional(),
      }),

      result: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          lineId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderLineAdd.post.response.lineId" as const,
            hidden: true,
            schema: z.uuid(),
          }),
          subtotal: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderLineAdd.post.response.subtotal" as const,
            fieldType: FieldDataType.NUMBER,
            schema: z.number(),
          }),
          taxAmount: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderLineAdd.post.response.taxAmount" as const,
            fieldType: FieldDataType.NUMBER,
            schema: z.number(),
          }),
          total: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderLineAdd.post.response.total" as const,
            fieldType: FieldDataType.NUMBER,
            schema: z.number(),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "orderLineAdd.post.errors.validation.title" as const,
      description: "orderLineAdd.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "orderLineAdd.post.errors.unauthorized.title" as const,
      description: "orderLineAdd.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "orderLineAdd.post.errors.forbidden.title" as const,
      description: "orderLineAdd.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "orderLineAdd.post.errors.conflict.title" as const,
      description: "orderLineAdd.post.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "orderLineAdd.post.errors.server.title" as const,
      description: "orderLineAdd.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "orderLineAdd.post.errors.unknown.title" as const,
      description: "orderLineAdd.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "orderLineAdd.post.errors.network.title" as const,
      description: "orderLineAdd.post.errors.network.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "orderLineAdd.post.errors.notFound.title" as const,
      description: "orderLineAdd.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "orderLineAdd.post.errors.unsavedChanges.title" as const,
      description:
        "orderLineAdd.post.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "orderLineAdd.post.success.title" as const,
    description: "orderLineAdd.post.success.description" as const,
  },

  examples: {
    urlPathParams: {
      default: { poId: "789e1234-e89b-12d3-a456-426614174000" },
    },
    requests: {
      default: {
        productId: undefined,
        itemDescription: "Office chairs",
        quantity: 10,
        unitPrice: 99.0,
        taxRate: 0.19,
      },
    },
    responses: {
      default: {
        result: {
          lineId: "aaa11111-e89b-12d3-a456-426614174000",
          subtotal: 990.0,
          taxAmount: 188.1,
          total: 1178.1,
        },
      },
    },
  },
});

export type OrderLineAddRequestOutput = typeof POST.types.RequestOutput;
export type OrderLineAddResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST } as const;
export default definitions;
