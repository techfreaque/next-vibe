/**
 * POS Order Remove Payment API Route Definition
 * Takes one tender back off an open order (for example a mistyped card payment)
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

import { refreshPosOrder, refreshPosRegister } from "../../refresh";
import { scopedTranslation } from "./i18n";

const PosOrderRemovePaymentWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.PosOrderRemovePaymentWidget,
  })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["pos", "order", "[orderId]", "remove-payment"],
  aliases: ["pos-order-remove-payment"],
  title: "post.title",
  titleShort: "post.titleShort" as const,
  description: "post.description",
  category: "pos",
  subCategory: "POS: Orders",
  tags: ["tags.pos", "tags.order", "tags.removePayment"],
  allowedRoles: [UserRole.ADMIN],
  icon: "rotate-ccw",

  options: {
    mutationOptions: {
      onSuccess: async ({ pathParams, responseData, logger }) => {
        await Promise.all([
          refreshPosOrder(pathParams.orderId, logger),
          refreshPosRegister(responseData.result.sessionId, logger),
        ]);
      },
    },
  },

  fields: customWidgetObject({
    render: PosOrderRemovePaymentWidgetLazy,
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
      paymentId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.paymentId.label",
        description: "post.paymentId.description",
        schema: z.uuid(),
      }),

      result: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          orderId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.orderId",
            hidden: true,
            schema: z.uuid(),
          }),
          paymentId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.paymentId",
            hidden: true,
            schema: z.uuid(),
          }),
          sessionId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.sessionId",
            hidden: true,
            schema: z.uuid(),
          }),
          currency: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.currency",
            schema: z.string(),
          }),
          totalPaid: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.totalPaid",
            schema: z.number(),
          }),
          outstanding: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.outstanding",
            schema: z.number(),
          }),
          remainingPayments: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.remainingPayments",
            schema: z.number(),
          }),
        },
      }),
    },
  }),

  errorTypes: {
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
  },

  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },

  examples: {
    urlPathParams: {
      default: { orderId: "eeff1122-e89b-12d3-a456-426614174003" },
    },
    requests: {
      default: {
        paymentId: "11223344-e89b-42d3-a456-426614174005",
      },
    },
    responses: {
      default: {
        result: {
          orderId: "eeff1122-e89b-12d3-a456-426614174003",
          paymentId: "11223344-e89b-42d3-a456-426614174005",
          sessionId: "ccddee00-e89b-42d3-a456-426614174002",
          currency: "EUR",
          totalPaid: 0,
          outstanding: 12,
          remainingPayments: 0,
        },
      },
    },
  },
});

export type PosOrderRemovePaymentPostRequestOutput =
  typeof POST.types.RequestOutput;
export type PosOrderRemovePaymentPostResponseOutput =
  typeof POST.types.ResponseOutput;

const definitions = {
  POST,
} as const;
export default definitions;
