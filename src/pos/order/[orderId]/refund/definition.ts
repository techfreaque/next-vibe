/**
 * POS Order Refund API Route Definition
 * GET: refundable lines, refund history and the default cash drawer of a sale.
 * POST: refund a completed sale fully or by lines and quantities.
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
  responseArrayField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { PosPaymentMethod, PosPaymentMethodOptions } from "../../../enum";
import { refreshPosOrder, refreshPosRegister } from "../../refresh";
import { scopedTranslation } from "./i18n";

const PosOrderRefundsWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.PosOrderRefundsWidget })),
);
const PosOrderRefundWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.PosOrderRefundWidget })),
);

const errorTypes = {
  [EndpointErrorTypes.VALIDATION_FAILED]: {
    title: "errors.validation.title",
    description: "errors.validation.description",
  },
  [EndpointErrorTypes.UNAUTHORIZED]: {
    title: "errors.unauthorized.title",
    description: "errors.unauthorized.description",
  },
  [EndpointErrorTypes.FORBIDDEN]: {
    title: "errors.forbidden.title",
    description: "errors.forbidden.description",
  },
  [EndpointErrorTypes.CONFLICT]: {
    title: "errors.conflict.title",
    description: "errors.conflict.description",
  },
  [EndpointErrorTypes.SERVER_ERROR]: {
    title: "errors.server.title",
    description: "errors.server.description",
  },
  [EndpointErrorTypes.UNKNOWN_ERROR]: {
    title: "errors.unknown.title",
    description: "errors.unknown.description",
  },
  [EndpointErrorTypes.NETWORK_ERROR]: {
    title: "errors.network.title",
    description: "errors.network.description",
  },
  [EndpointErrorTypes.NOT_FOUND]: {
    title: "errors.notFound.title",
    description: "errors.notFound.description",
  },
  [EndpointErrorTypes.UNSAVED_CHANGES]: {
    title: "errors.unsavedChanges.title",
    description: "errors.unsavedChanges.description",
  },
} as const;

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["pos", "order", "[orderId]", "refund"],
  aliases: ["pos-order-refunds"],
  title: "get.title",
  titleShort: "get.titleShort" as const,
  description: "get.description",
  category: "pos",
  subCategory: "POS: Orders",
  tags: ["tags.pos", "tags.order", "tags.refund"],
  allowedRoles: [UserRole.ADMIN],
  icon: "receipt",

  fields: customWidgetObject({
    render: PosOrderRefundsWidgetLazy,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      orderId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "get.orderId.label",
        description: "get.orderId.description",
        schema: z.uuid(),
        listEndpoint: async () =>
          (await import("@/pos/order/list/definition")).default.GET,
        labelField: "orderNumber",
      }),

      result: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          orderId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "get.response.orderId",
            hidden: true,
            schema: z.uuid(),
          }),
          orderNumber: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "get.response.orderNumber",
            schema: z.string(),
          }),
          status: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "get.response.status",
            schema: z.string(),
          }),
          currency: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "get.response.currency",
            schema: z.string(),
          }),
          total: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "get.response.total",
            schema: z.number(),
          }),
          refundedTotal: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "get.response.refundedTotal",
            schema: z.number(),
          }),
          refundableTotal: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "get.response.refundableTotal",
            schema: z.number(),
          }),
          // Settlement inputs so a form can preview the exact refund amounts.
          subtotal: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            hidden: true,
            schema: z.number(),
          }),
          taxAmount: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            hidden: true,
            schema: z.number(),
          }),
          refundedSubtotal: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            hidden: true,
            schema: z.number(),
          }),
          refundedTaxAmount: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            hidden: true,
            schema: z.number(),
          }),
          journalPosted: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "get.response.journalPosted",
            schema: z.boolean(),
          }),
          cashSession: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "get.response.cashSession",
            schema: z
              .object({
                sessionId: z.uuid(),
                terminalName: z.string(),
                available: z.number(),
              })
              .nullable(),
          }),
          lines: responseArrayField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            columns: 12,
            child: objectField(scopedTranslation, {
              type: WidgetType.CONTAINER,
              layoutType: LayoutType.GRID_2_COLUMNS,
              usage: { response: true },
              children: {
                orderItemId: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "get.response.orderItemId",
                  hidden: true,
                  schema: z.uuid(),
                }),
                description: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "get.response.description",
                  schema: z.string(),
                }),
                quantity: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "get.response.quantity",
                  schema: z.number(),
                }),
                refundedQuantity: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "get.response.refundedQuantity",
                  schema: z.number(),
                }),
                refundableQuantity: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "get.response.refundableQuantity",
                  schema: z.number(),
                }),
                unitPrice: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "get.response.unitPrice",
                  schema: z.number(),
                }),
                lineTotal: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "get.response.lineTotal",
                  schema: z.number(),
                }),
                taxRate: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "get.response.taxRate",
                  schema: z.number(),
                }),
                taxAmount: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  hidden: true,
                  schema: z.number(),
                }),
                refundedLineTotal: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  hidden: true,
                  schema: z.number(),
                }),
                refundedTaxAmount: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  hidden: true,
                  schema: z.number(),
                }),
              },
            }),
          }),
          refunds: responseArrayField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            columns: 12,
            child: objectField(scopedTranslation, {
              type: WidgetType.CONTAINER,
              layoutType: LayoutType.GRID_2_COLUMNS,
              usage: { response: true },
              children: {
                refundId: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "get.response.refundId",
                  hidden: true,
                  schema: z.uuid(),
                }),
                refundNumber: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "get.response.refundNumber",
                  schema: z.string(),
                }),
                method: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "get.response.method",
                  schema: z.enum(PosPaymentMethod),
                }),
                total: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "get.response.total",
                  schema: z.number(),
                }),
                reason: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "get.response.reason",
                  schema: z.string(),
                }),
                createdAt: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "get.response.createdAt",
                  fieldType: FieldDataType.DATETIME,
                  schema: z.coerce.date(),
                }),
              },
            }),
          }),
        },
      }),
    },
  }),

  errorTypes,

  successTypes: {
    title: "get.success.title",
    description: "get.success.description",
  },

  examples: {
    urlPathParams: {
      default: { orderId: "eeff1122-e89b-42d3-a456-426614174003" },
    },
    requests: undefined,
    responses: {
      default: {
        result: {
          orderId: "eeff1122-e89b-42d3-a456-426614174003",
          orderNumber: "POS-20261126-0001",
          status: "enums.orderStatus.completed",
          currency: "EUR",
          total: 24.6,
          refundedTotal: 12.3,
          refundableTotal: 12.3,
          subtotal: 20,
          taxAmount: 4.6,
          refundedSubtotal: 10,
          refundedTaxAmount: 2.3,
          journalPosted: true,
          cashSession: {
            sessionId: "ccddee00-e89b-42d3-a456-426614174002",
            terminalName: "Front counter",
            available: 182.4,
          },
          lines: [
            {
              orderItemId: "ff001122-e89b-42d3-a456-426614174004",
              description: "Notebook",
              quantity: 2,
              refundedQuantity: 1,
              refundableQuantity: 1,
              unitPrice: 10,
              lineTotal: 24.6,
              taxRate: 0.23,
              taxAmount: 4.6,
              refundedLineTotal: 12.3,
              refundedTaxAmount: 2.3,
            },
          ],
          refunds: [
            {
              refundId: "aa001122-e89b-42d3-a456-426614174006",
              refundNumber: "POS-20261126-0001-R1",
              method: PosPaymentMethod.CASH,
              total: 12.3,
              reason: "Damaged cover",
              createdAt: new Date("2026-11-26T10:00:00.000Z"),
            },
          ],
        },
      },
    },
  },
});

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["pos", "order", "[orderId]", "refund"],
  aliases: ["pos-order-refund"],
  title: "post.title",
  titleShort: "post.titleShort" as const,
  description: "post.description",
  category: "pos",
  subCategory: "POS: Orders",
  tags: ["tags.pos", "tags.order", "tags.refund"],
  allowedRoles: [UserRole.ADMIN],
  icon: "rotate-ccw",

  options: {
    mutationOptions: {
      onSuccess: async ({ pathParams, responseData, logger }) => {
        const { apiClient } = await import("next-vibe/unified-ui/hooks/store");
        await Promise.all([
          apiClient.refetchEndpoint(GET, logger, {
            urlPathParams: { orderId: pathParams.orderId },
          }),
          refreshPosOrder(pathParams.orderId, logger),
          refreshPosRegister(
            responseData.result.sessionId ?? undefined,
            logger,
          ),
        ]);
      },
    },
  },

  fields: customWidgetObject({
    render: PosOrderRefundWidgetLazy,
    usage: { request: "data&urlPathParams", response: true },
    children: {
      orderId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "post.orderId.label",
        description: "post.orderId.description",
        schema: z.uuid(),
        listEndpoint: async () =>
          (await import("@/pos/order/list/definition")).default.GET,
        labelField: "orderNumber",
      }),
      lines: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.lines.label",
        description: "post.lines.description",
        schema: z
          .array(
            z.object({
              orderItemId: z.uuid(),
              quantity: z.number().positive(),
            }),
          )
          .min(1)
          .optional(),
      }),
      method: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.method.label",
        description: "post.method.description",
        placeholder: "post.method.placeholder",
        options: PosPaymentMethodOptions,
        schema: z.enum(PosPaymentMethod),
      }),
      sessionId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.sessionId.label",
        description: "post.sessionId.description",
        schema: z.uuid().optional(),
      }),
      reason: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "post.reason.label",
        description: "post.reason.description",
        placeholder: "post.reason.placeholder",
        schema: z.string().trim().min(1).max(500),
      }),

      result: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          refundId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.refundId",
            hidden: true,
            schema: z.uuid(),
          }),
          refundNumber: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.refundNumber",
            schema: z.string(),
          }),
          orderId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.orderId",
            hidden: true,
            schema: z.uuid(),
          }),
          sessionId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.sessionId",
            hidden: true,
            schema: z.uuid().nullable(),
          }),
          method: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.method",
            schema: z.enum(PosPaymentMethod),
          }),
          currency: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.currency",
            schema: z.string(),
          }),
          subtotal: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.subtotal",
            schema: z.number(),
          }),
          taxAmount: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.taxAmount",
            schema: z.number(),
          }),
          total: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.total",
            schema: z.number(),
          }),
          refundedTotal: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.refundedTotal",
            schema: z.number(),
          }),
          fullyRefunded: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.fullyRefunded",
            schema: z.boolean(),
          }),
          journalEntryId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.journalEntryId",
            hidden: true,
            schema: z.uuid().nullable(),
          }),
          stockReturned: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.stockReturned",
            schema: z.number(),
          }),
        },
      }),
    },
  }),

  errorTypes,

  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },

  examples: {
    urlPathParams: {
      default: { orderId: "eeff1122-e89b-42d3-a456-426614174003" },
    },
    requests: {
      default: {
        lines: [
          { orderItemId: "ff001122-e89b-42d3-a456-426614174004", quantity: 1 },
        ],
        method: PosPaymentMethod.CASH,
        sessionId: undefined,
        reason: "Damaged cover",
      },
    },
    responses: {
      default: {
        result: {
          refundId: "aa001122-e89b-42d3-a456-426614174006",
          refundNumber: "POS-20261126-0001-R1",
          orderId: "eeff1122-e89b-42d3-a456-426614174003",
          sessionId: "ccddee00-e89b-42d3-a456-426614174002",
          method: PosPaymentMethod.CASH,
          currency: "EUR",
          subtotal: 10,
          taxAmount: 2.3,
          total: 12.3,
          refundedTotal: 12.3,
          fullyRefunded: false,
          journalEntryId: "aabb1234-e89b-42d3-a456-426614174099",
          stockReturned: 1,
        },
      },
    },
  },
});

export type PosOrderRefundsGetResponseOutput = typeof GET.types.ResponseOutput;
export type PosOrderRefundPostRequestOutput = typeof POST.types.RequestOutput;
export type PosOrderRefundPostResponseOutput = typeof POST.types.ResponseOutput;

const definitions = {
  GET,
  POST,
} as const;
export default definitions;
