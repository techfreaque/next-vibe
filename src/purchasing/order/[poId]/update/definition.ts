/**
 * Purchase Order Update API Route Definition
 * PATCH — edit a Draft purchase order
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

const OrderUpdateWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.OrderUpdateWidget })),
);

const lineSchema = z.object({
  description: z.string().min(1).max(255),
  productId: z.uuid().optional(),
  quantity: z.number().positive(),
  unitPrice: z.number().min(0),
  taxRate: z.number().min(0).max(1).default(0),
  sortOrder: z.number().int().optional(),
});

const { PATCH } = createEndpoint({
  scopedTranslation,
  method: Methods.PATCH,
  path: ["purchasing", "order", "[poId]", "update"],
  title: "orderUpdate.patch.title" as const,
  titleShort: "orderUpdate.patch.titleShort" as const,
  description: "orderUpdate.patch.description" as const,
  category: "purchasing",
  subCategory: "Purchasing: Orders",
  icon: "file-text" as const,
  tags: [
    "tags.purchasing" as const,
    "tags.order" as const,
    "tags.update" as const,
  ],
  allowedRoles: [UserRole.ADMIN] as const,

  fields: customWidgetObject({
    render: OrderUpdateWidgetLazy,
    usage: { request: "data&urlPathParams", response: true },
    children: {
      poId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "orderUpdate.patch.poId.label" as const,
        description: "orderUpdate.patch.poId.description" as const,
        hidden: true,
        schema: z.uuid(),
        listEndpoint: async () =>
          (await import("@/purchasing/order/list/definition")).default.GET,
        labelField: "poNumber",
      }),
      vendorId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        listEndpoint: async () =>
          (await import("@/purchasing/vendor/list/definition")).default.GET,
        labelField: "name",
        label: "orderUpdate.patch.vendorId.label" as const,
        description: "orderUpdate.patch.vendorId.description" as const,
        placeholder: "orderUpdate.patch.vendorId.placeholder" as const,
        schema: z.uuid().optional(),
      }),
      currency: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "orderUpdate.patch.currency.label" as const,
        description: "orderUpdate.patch.currency.description" as const,
        placeholder: "orderUpdate.patch.currency.placeholder" as const,
        columns: 4,
        schema: z.string().min(3).max(3).optional(),
      }),
      expectedDeliveryDate: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "orderUpdate.patch.expectedDeliveryDate.label" as const,
        description:
          "orderUpdate.patch.expectedDeliveryDate.description" as const,
        placeholder:
          "orderUpdate.patch.expectedDeliveryDate.placeholder" as const,
        columns: 4,
        schema: z.coerce.date().optional(),
      }),
      deliveryWarehouseId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "orderUpdate.patch.deliveryWarehouseId.label" as const,
        description:
          "orderUpdate.patch.deliveryWarehouseId.description" as const,
        placeholder:
          "orderUpdate.patch.deliveryWarehouseId.placeholder" as const,
        columns: 4,
        schema: z.uuid().optional(),
      }),
      notes: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "orderUpdate.patch.notes.label" as const,
        description: "orderUpdate.patch.notes.description" as const,
        placeholder: "orderUpdate.patch.notes.placeholder" as const,
        columns: 12,
        schema: z.string().optional(),
      }),
      lines: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "orderUpdate.patch.lines.label" as const,
        description: "orderUpdate.patch.lines.description" as const,
        schema: z.array(lineSchema).optional(),
      }),

      result: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          id: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderUpdate.patch.response.id" as const,
            hidden: true,
            schema: z.uuid(),
          }),
          status: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderUpdate.patch.response.status" as const,
            schema: z.string(),
          }),
          subtotal: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderUpdate.patch.response.subtotal" as const,
            fieldType: FieldDataType.NUMBER,
            schema: z.number(),
          }),
          taxAmount: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderUpdate.patch.response.taxAmount" as const,
            fieldType: FieldDataType.NUMBER,
            schema: z.number(),
          }),
          total: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderUpdate.patch.response.total" as const,
            fieldType: FieldDataType.NUMBER,
            schema: z.number(),
          }),
          updatedAt: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderUpdate.patch.response.updatedAt" as const,
            fieldType: FieldDataType.DATETIME,
            schema: z.coerce.date(),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "orderUpdate.patch.errors.validation.title" as const,
      description: "orderUpdate.patch.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "orderUpdate.patch.errors.unauthorized.title" as const,
      description: "orderUpdate.patch.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "orderUpdate.patch.errors.forbidden.title" as const,
      description: "orderUpdate.patch.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "orderUpdate.patch.errors.conflict.title" as const,
      description: "orderUpdate.patch.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "orderUpdate.patch.errors.server.title" as const,
      description: "orderUpdate.patch.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "orderUpdate.patch.errors.unknown.title" as const,
      description: "orderUpdate.patch.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "orderUpdate.patch.errors.network.title" as const,
      description: "orderUpdate.patch.errors.network.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "orderUpdate.patch.errors.notFound.title" as const,
      description: "orderUpdate.patch.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "orderUpdate.patch.errors.unsavedChanges.title" as const,
      description:
        "orderUpdate.patch.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "orderUpdate.patch.success.title" as const,
    description: "orderUpdate.patch.success.description" as const,
  },

  examples: {
    urlPathParams: {
      default: { poId: "789e1234-e89b-12d3-a456-426614174000" },
    },
    requests: {
      default: {
        vendorId: undefined,
        currency: undefined,
        expectedDeliveryDate: undefined,
        deliveryWarehouseId: undefined,
        notes: "Updated notes",
        lines: undefined,
      },
    },
    responses: {
      default: {
        result: {
          id: "789e1234-e89b-12d3-a456-426614174000",
          status: "DRAFT",
          subtotal: 1000.0,
          taxAmount: 190.0,
          total: 1190.0,
          updatedAt: new Date("2024-06-01"),
        },
      },
    },
  },
});

export type OrderUpdateRequestOutput = typeof PATCH.types.RequestOutput;
export type OrderUpdateResponseOutput = typeof PATCH.types.ResponseOutput;

const definitions = { PATCH } as const;
export default definitions;
