/**
 * POS Order Add Payment API Route Definition
 * Records a payment against an open order
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

import { PosPaymentMethod, PosPaymentMethodOptions } from "../../../enum";
import { scopedTranslation } from "../../../i18n";

const PosOrderAddPaymentWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.PosOrderAddPaymentWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["pos", "order", "[orderId]", "add-payment"],
  title: "orderAddPayment.post.title",
  titleShort: "orderAddPayment.post.titleShort" as const,
  description: "orderAddPayment.post.description",
  category: "pos",
  subCategory: "POS: Orders",
  tags: ["tags.pos", "tags.order", "tags.addPayment"],
  allowedRoles: [UserRole.ADMIN],
  icon: "credit-card",

  fields: customWidgetObject({
    render: PosOrderAddPaymentWidgetLazy,
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
            label: "orderAddPayment.post.orderId.label",
            description: "orderAddPayment.post.orderId.description",
            schema: z.uuid(),
            listEndpoint: async () =>
              (await import("@/app/api/[locale]/pos/order/list/definition"))
                .default.GET,
            labelField: "id",
          }),
          method: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "orderAddPayment.post.method.label",
            description: "orderAddPayment.post.method.description",
            placeholder: "orderAddPayment.post.method.placeholder",
            options: PosPaymentMethodOptions,
            schema: z.enum(PosPaymentMethod),
          }),
          amount: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.NUMBER,
            label: "orderAddPayment.post.amount.label",
            description: "orderAddPayment.post.amount.description",
            placeholder: "orderAddPayment.post.amount.placeholder",
            schema: z.number().positive(),
          }),
          change: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.NUMBER,
            label: "orderAddPayment.post.change.label",
            description: "orderAddPayment.post.change.description",
            placeholder: "orderAddPayment.post.change.placeholder",
            schema: z.number().min(0).optional(),
          }),
          reference: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "orderAddPayment.post.reference.label",
            description: "orderAddPayment.post.reference.description",
            schema: z.string().max(255).optional(),
          }),
          accountNodeId: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "orderAddPayment.post.accountNodeId.label",
            description: "orderAddPayment.post.accountNodeId.description",
            schema: z.uuid().optional(),
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
            label: "orderAddPayment.post.response.id",
            schema: z.uuid(),
          }),
          method: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderAddPayment.post.response.method",
            schema: z.string(),
          }),
          amount: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderAddPayment.post.response.amount",
            schema: z.number(),
          }),
          change: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderAddPayment.post.response.change",
            schema: z.number(),
          }),
          totalPaid: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderAddPayment.post.response.totalPaid",
            schema: z.number(),
          }),
          outstanding: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderAddPayment.post.response.outstanding",
            schema: z.number(),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "orderAddPayment.post.errors.validation.title",
      description: "orderAddPayment.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "orderAddPayment.post.errors.unauthorized.title",
      description: "orderAddPayment.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "orderAddPayment.post.errors.forbidden.title",
      description: "orderAddPayment.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "orderAddPayment.post.errors.conflict.title",
      description: "orderAddPayment.post.errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "orderAddPayment.post.errors.server.title",
      description: "orderAddPayment.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "orderAddPayment.post.errors.unknown.title",
      description: "orderAddPayment.post.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "orderAddPayment.post.errors.network.title",
      description: "orderAddPayment.post.errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "orderAddPayment.post.errors.notFound.title",
      description: "orderAddPayment.post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "orderAddPayment.post.errors.unsavedChanges.title",
      description: "orderAddPayment.post.errors.unsavedChanges.description",
    },
  },

  successTypes: {
    title: "orderAddPayment.post.success.title",
    description: "orderAddPayment.post.success.description",
  },

  examples: {
    requests: {
      default: {
        details: {
          orderId: "eeff1122-e89b-12d3-a456-426614174003",
          method: PosPaymentMethod.CASH,
          amount: 10.0,
          change: 1.6,
          reference: undefined,
          accountNodeId: undefined,
        },
      },
    },
    responses: {
      default: {
        result: {
          id: "11223344-e89b-12d3-a456-426614174005",
          method: PosPaymentMethod.CASH,
          amount: 10.0,
          change: 1.6,
          totalPaid: 10.0,
          outstanding: 0,
        },
      },
    },
  },
});

export type PosOrderAddPaymentPostRequestOutput =
  typeof POST.types.RequestOutput;

const definitions = {
  POST,
} as const;
export default definitions;
