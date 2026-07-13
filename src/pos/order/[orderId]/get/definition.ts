/**
 * POS Order Get API Route Definition
 * Retrieves a single order with items and payments
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
  requestUrlPathParamsField,
  responseArrayField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { scopedTranslation } from "../../../i18n";

const PosOrderGetWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.PosOrderGetWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["pos", "order", "[orderId]", "get"],
  aliases: ["pos-order-get"],
  title: "orderGet.get.title",
  titleShort: "orderGet.get.titleShort" as const,
  description: "orderGet.get.description",
  category: "pos",
  subCategory: "POS: Orders",
  tags: ["tags.pos", "tags.order", "tags.get"],
  allowedRoles: [UserRole.ADMIN],
  icon: "shopping-cart",

  fields: customWidgetObject({
    render: PosOrderGetWidgetLazy,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      orderId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "orderGet.get.orderId.label",
        description: "orderGet.get.orderId.description",
        schema: z.uuid(),
        listEndpoint: async () =>
          (await import("../../list/definition")).default.GET,
        labelField: "orderNumber",
      }),

      result: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          id: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderGet.get.response.id",
            hidden: true,
            schema: z.uuid(),
          }),
          orderNumber: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderGet.get.response.orderNumber",
            schema: z.string(),
          }),
          sessionId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderGet.get.response.sessionId",
            schema: z.uuid(),
          }),
          customerId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderGet.get.response.customerId",
            schema: z.uuid().nullable(),
          }),
          status: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderGet.get.response.status",
            schema: z.string(),
          }),
          currency: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderGet.get.response.currency",
            schema: z.string(),
          }),
          subtotal: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderGet.get.response.subtotal",
            schema: z.number(),
          }),
          taxAmount: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderGet.get.response.taxAmount",
            schema: z.number(),
          }),
          total: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderGet.get.response.total",
            schema: z.number(),
          }),
          journalEntryId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderGet.get.response.journalEntryId",
            schema: z.uuid().nullable(),
          }),
          createdAt: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderGet.get.response.createdAt",
            fieldType: FieldDataType.DATETIME,
            schema: z.coerce.date(),
          }),

          items: responseArrayField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            columns: 12,
            child: objectField(scopedTranslation, {
              type: WidgetType.CONTAINER,
              layoutType: LayoutType.GRID_2_COLUMNS,
              usage: { response: true },
              children: {
                itemId: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "orderGet.get.response.itemId",
                  schema: z.uuid(),
                }),
                productId: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "orderGet.get.response.productId",
                  schema: z.uuid().nullable(),
                }),
                description: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "orderGet.get.response.description",
                  schema: z.string(),
                }),
                quantity: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "orderGet.get.response.quantity",
                  schema: z.number(),
                }),
                unitPrice: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "orderGet.get.response.unitPrice",
                  schema: z.number(),
                }),
                taxRate: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "orderGet.get.response.taxRate",
                  schema: z.number(),
                }),
                taxAmountItem: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "orderGet.get.response.taxAmountItem",
                  schema: z.number(),
                }),
                lineTotal: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "orderGet.get.response.lineTotal",
                  schema: z.number(),
                }),
              },
            }),
          }),

          payments: responseArrayField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            columns: 12,
            child: objectField(scopedTranslation, {
              type: WidgetType.CONTAINER,
              layoutType: LayoutType.GRID_2_COLUMNS,
              usage: { response: true },
              children: {
                paymentId: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "orderGet.get.response.paymentId",
                  schema: z.uuid(),
                }),
                method: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "orderGet.get.response.method",
                  schema: z.string(),
                }),
                amount: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "orderGet.get.response.amount",
                  schema: z.number(),
                }),
                change: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "orderGet.get.response.change",
                  schema: z.number(),
                }),
                reference: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "orderGet.get.response.reference",
                  schema: z.string().nullable(),
                }),
              },
            }),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "orderGet.get.errors.validation.title",
      description: "orderGet.get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "orderGet.get.errors.unauthorized.title",
      description: "orderGet.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "orderGet.get.errors.forbidden.title",
      description: "orderGet.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "orderGet.get.errors.conflict.title",
      description: "orderGet.get.errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "orderGet.get.errors.server.title",
      description: "orderGet.get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "orderGet.get.errors.unknown.title",
      description: "orderGet.get.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "orderGet.get.errors.network.title",
      description: "orderGet.get.errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "orderGet.get.errors.notFound.title",
      description: "orderGet.get.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "orderGet.get.errors.unsavedChanges.title",
      description: "orderGet.get.errors.unsavedChanges.description",
    },
  },

  successTypes: {
    title: "orderGet.get.success.title",
    description: "orderGet.get.success.description",
  },

  examples: {
    urlPathParams: {
      default: { orderId: "eeff1122-e89b-12d3-a456-426614174003" },
    },
    requests: undefined,
    responses: {
      default: {
        result: {
          id: "eeff1122-e89b-12d3-a456-426614174003",
          orderNumber: "POS-20240101-0001",
          sessionId: "ccddee00-e89b-12d3-a456-426614174002",
          customerId: null,
          status: "OPEN",
          currency: "EUR",
          subtotal: 10.0,
          taxAmount: 2.0,
          total: 12.0,
          journalEntryId: null,
          createdAt: new Date("2024-01-01T10:00:00.000Z"),
          items: [],
          payments: [],
        },
      },
    },
  },
});

export type PosOrderGetRequestOutput = typeof GET.types.RequestOutput;
export type PosOrderGetResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
