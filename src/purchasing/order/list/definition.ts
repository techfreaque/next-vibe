/**
 * Purchase Order List API Route Definition
 * GET — list purchase orders for a company
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
  responseArrayField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { PurchaseOrderStatusDB, PurchaseOrderStatusOptions } from "../../enum";
import { scopedTranslation } from "../../i18n";
import { PURCHASING_ORDERS_ALIAS } from "./constants";

const OrderListWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.OrderListWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["purchasing", "order", "list"],
  aliases: [PURCHASING_ORDERS_ALIAS] as const,
  title: "orderList.get.title" as const,
  titleShort: "orderList.get.titleShort" as const,
  description: "orderList.get.description" as const,
  category: "purchasing",
  subCategory: "Purchasing: Orders",
  icon: "file-text" as const,
  tags: [
    "tags.purchasing" as const,
    "tags.order" as const,
    "tags.list" as const,
  ],
  allowedRoles: [UserRole.ADMIN] as const,
  defaultWebPinned: [UserRole.ADMIN] as const,

  fields: customWidgetObject({
    render: OrderListWidgetLazy,
    usage: { request: "data", response: true },
    children: {
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        listEndpoint: async () =>
          (await import("@/companies/list/definition")).default.GET,
        labelField: "name",
        label: "orderList.get.companyId.label" as const,
        description: "orderList.get.companyId.description" as const,
        schema: z.uuid().optional(),
      }),
      status: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "orderList.get.status.label" as const,
        description: "orderList.get.status.description" as const,
        options: PurchaseOrderStatusOptions,
        schema: z.enum(PurchaseOrderStatusDB).optional(),
      }),

      result: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.STACKED,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "orderList.get.response.id" as const,
              hidden: true,
              schema: z.uuid(),
            }),
            poNumber: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "orderList.get.response.poNumber" as const,
              schema: z.string(),
            }),
            vendorId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "orderList.get.response.vendorId" as const,
              hidden: true,
              schema: z.uuid(),
            }),
            vendorName: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "orderList.get.response.vendorName" as const,
              schema: z.string(),
            }),
            status: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "orderList.get.response.status" as const,
              schema: z.string(),
            }),
            currency: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "orderList.get.response.currency" as const,
              schema: z.string(),
            }),
            total: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "orderList.get.response.total" as const,
              fieldType: FieldDataType.NUMBER,
              schema: z.number(),
            }),
            expectedDeliveryDate: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "orderList.get.response.expectedDeliveryDate" as const,
              fieldType: FieldDataType.DATETIME,
              schema: z.coerce.date().nullable(),
            }),
            createdAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "orderList.get.response.createdAt" as const,
              fieldType: FieldDataType.DATETIME,
              schema: z.coerce.date(),
            }),
          },
        }),
      }),
    },
  }),

  options: {
    formOptions: {
      autoSubmit: true,
      debounceMs: 300,
    },
  },

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "orderList.get.errors.validation.title" as const,
      description: "orderList.get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "orderList.get.errors.unauthorized.title" as const,
      description: "orderList.get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "orderList.get.errors.forbidden.title" as const,
      description: "orderList.get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "orderList.get.errors.conflict.title" as const,
      description: "orderList.get.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "orderList.get.errors.server.title" as const,
      description: "orderList.get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "orderList.get.errors.unknown.title" as const,
      description: "orderList.get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "orderList.get.errors.network.title" as const,
      description: "orderList.get.errors.network.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "orderList.get.errors.notFound.title" as const,
      description: "orderList.get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "orderList.get.errors.unsavedChanges.title" as const,
      description: "orderList.get.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "orderList.get.success.title" as const,
    description: "orderList.get.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        companyId: undefined,
        status: undefined,
      },
    },
    responses: {
      default: {
        result: [
          {
            id: "789e1234-e89b-12d3-a456-426614174000",
            poNumber: "PO-2024-0001",
            vendorId: "456e7890-e89b-12d3-a456-426614174000",
            vendorName: "Acme GmbH",
            status: "DRAFT",
            currency: "EUR",
            total: 1190.0,
            expectedDeliveryDate: null,
            createdAt: new Date("2024-06-01"),
          },
        ],
      },
    },
  },
});

export type OrderListRequestOutput = typeof GET.types.RequestOutput;
export type OrderListResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
