/**
 * Purchase Order Get API Route Definition
 * GET — retrieve a purchase order with all lines and receipt history
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
  requestUrlPathParamsField,
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

import { scopedTranslation } from "../../../i18n";
import listDef0 from "@/app/api/[locale]/purchasing/order/list/definition";

const OrderGetWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.OrderGetWidget })),
);

const poLineSchema = z.object({
  id: z.uuid(),
  productId: z.uuid().nullable(),
  description: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  taxRate: z.number(),
  taxAmount: z.number(),
  lineTotal: z.number(),
  quantityReceived: z.number(),
  sortOrder: z.number().nullable(),
});

const receiptSchema = z.object({
  id: z.uuid(),
  receivedAt: z.coerce.date(),
  notes: z.string().nullable(),
  lines: z.array(
    z.object({
      poLineId: z.uuid(),
      quantityReceived: z.number(),
    }),
  ),
});

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["purchasing", "order", "[poId]", "get"],
  title: "orderGet.get.title" as const,
  titleShort: "orderGet.get.titleShort" as const,
  description: "orderGet.get.description" as const,
  category: "purchasing",
  subCategory: "Purchasing: Orders",
  icon: "file-text" as const,
  tags: [
    "tags.purchasing" as const,
    "tags.order" as const,
    "tags.get" as const,
  ],
  allowedRoles: [UserRole.ADMIN] as const,

  fields: customWidgetObject({
    render: OrderGetWidgetLazy,
    usage: { request: "urlPathParams", response: true },
    children: {
      poId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "orderGet.get.poId.label" as const,
        description: "orderGet.get.poId.description" as const,
        schema: z.uuid(),
        listEndpoint: listDef0.GET,
        labelField: "poNumber",
      }),

      result: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          id: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "orderGet.get.response.id" as const,
            hidden: true,
            schema: z.uuid(),
          }),
          companyId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "orderGet.get.response.companyId" as const,
            hidden: true,
            schema: z.uuid(),
          }),
          vendorId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "orderGet.get.response.vendorId" as const,
            hidden: true,
            schema: z.uuid(),
          }),
          poNumber: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "orderGet.get.response.poNumber" as const,
            schema: z.string(),
          }),
          status: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "orderGet.get.response.status" as const,
            schema: z.string(),
          }),
          currency: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "orderGet.get.response.currency" as const,
            schema: z.string(),
          }),
          expectedDeliveryDate: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "orderGet.get.response.expectedDeliveryDate" as const,
            fieldType: FieldDataType.DATETIME,
            schema: z.coerce.date().nullable(),
          }),
          deliveryWarehouseId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "orderGet.get.response.deliveryWarehouseId" as const,
            hidden: true,
            schema: z.uuid().nullable(),
          }),
          notes: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "orderGet.get.response.notes" as const,
            schema: z.string().nullable(),
          }),
          subtotal: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "orderGet.get.response.subtotal" as const,
            fieldType: FieldDataType.NUMBER,
            schema: z.number(),
          }),
          taxAmount: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "orderGet.get.response.taxAmount" as const,
            fieldType: FieldDataType.NUMBER,
            schema: z.number(),
          }),
          total: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "orderGet.get.response.total" as const,
            fieldType: FieldDataType.NUMBER,
            schema: z.number(),
          }),
          billId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "orderGet.get.response.billId" as const,
            hidden: true,
            schema: z.uuid().nullable(),
          }),
          confirmedAt: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "orderGet.get.response.confirmedAt" as const,
            fieldType: FieldDataType.DATETIME,
            schema: z.coerce.date().nullable(),
          }),
          receivedAt: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "orderGet.get.response.receivedAt" as const,
            fieldType: FieldDataType.DATETIME,
            schema: z.coerce.date().nullable(),
          }),
          createdAt: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "orderGet.get.response.createdAt" as const,
            fieldType: FieldDataType.DATETIME,
            schema: z.coerce.date(),
          }),
          updatedAt: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "orderGet.get.response.updatedAt" as const,
            fieldType: FieldDataType.DATETIME,
            schema: z.coerce.date(),
          }),
          lines: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "orderGet.get.response.lines" as const,
            schema: z.array(poLineSchema),
          }),
          receipts: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "orderGet.get.response.receipts" as const,
            schema: z.array(receiptSchema),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "orderGet.get.errors.validation.title" as const,
      description: "orderGet.get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "orderGet.get.errors.unauthorized.title" as const,
      description: "orderGet.get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "orderGet.get.errors.forbidden.title" as const,
      description: "orderGet.get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "orderGet.get.errors.conflict.title" as const,
      description: "orderGet.get.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "orderGet.get.errors.server.title" as const,
      description: "orderGet.get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "orderGet.get.errors.unknown.title" as const,
      description: "orderGet.get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "orderGet.get.errors.network.title" as const,
      description: "orderGet.get.errors.network.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "orderGet.get.errors.notFound.title" as const,
      description: "orderGet.get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "orderGet.get.errors.unsavedChanges.title" as const,
      description: "orderGet.get.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "orderGet.get.success.title" as const,
    description: "orderGet.get.success.description" as const,
  },

  examples: {
    urlPathParams: {
      default: { poId: "789e1234-e89b-12d3-a456-426614174000" },
    },
    responses: {
      default: {
        result: {
          id: "789e1234-e89b-12d3-a456-426614174000",
          companyId: "123e4567-e89b-12d3-a456-426614174000",
          vendorId: "456e7890-e89b-12d3-a456-426614174000",
          poNumber: "PO-2024-0001",
          status: "DRAFT",
          currency: "EUR",
          expectedDeliveryDate: null,
          deliveryWarehouseId: null,
          notes: null,
          subtotal: 1000.0,
          taxAmount: 190.0,
          total: 1190.0,
          billId: null,
          confirmedAt: null,
          receivedAt: null,
          createdAt: new Date("2024-06-01"),
          updatedAt: new Date("2024-06-01"),
          lines: [],
          receipts: [],
        },
      },
    },
  },
});

export type OrderGetResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
