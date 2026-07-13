/**
 * Purchase Order Confirm API Route Definition
 * POST — transition PO from Sent to Confirmed
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
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { scopedTranslation } from "../../../i18n";

const OrderConfirmWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.OrderConfirmWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["purchasing", "order", "[poId]", "confirm"],
  title: "orderConfirm.post.title" as const,
  titleShort: "orderConfirm.post.titleShort" as const,
  description: "orderConfirm.post.description" as const,
  category: "purchasing",
  subCategory: "Purchasing: Orders",
  icon: "check-circle" as const,
  tags: [
    "tags.purchasing" as const,
    "tags.order" as const,
    "tags.confirm" as const,
  ],
  allowedRoles: [UserRole.ADMIN] as const,

  fields: customWidgetObject({
    render: OrderConfirmWidgetLazy,
    usage: { request: "urlPathParams", response: true },
    children: {
      poId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "orderConfirm.post.poId.label" as const,
        description: "orderConfirm.post.poId.description" as const,
        hidden: true,
        schema: z.uuid(),
        listEndpoint: async () =>
          (await import("@/purchasing/order/list/definition")).default.GET,
        labelField: "poNumber",
      }),

      result: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          id: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderConfirm.post.response.id" as const,
            hidden: true,
            schema: z.uuid(),
          }),
          status: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderConfirm.post.response.status" as const,
            schema: z.string(),
          }),
          confirmedAt: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderConfirm.post.response.confirmedAt" as const,
            fieldType: FieldDataType.DATETIME,
            schema: z.coerce.date(),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "orderConfirm.post.errors.validation.title" as const,
      description: "orderConfirm.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "orderConfirm.post.errors.unauthorized.title" as const,
      description: "orderConfirm.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "orderConfirm.post.errors.forbidden.title" as const,
      description: "orderConfirm.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "orderConfirm.post.errors.conflict.title" as const,
      description: "orderConfirm.post.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "orderConfirm.post.errors.server.title" as const,
      description: "orderConfirm.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "orderConfirm.post.errors.unknown.title" as const,
      description: "orderConfirm.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "orderConfirm.post.errors.network.title" as const,
      description: "orderConfirm.post.errors.network.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "orderConfirm.post.errors.notFound.title" as const,
      description: "orderConfirm.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "orderConfirm.post.errors.unsavedChanges.title" as const,
      description:
        "orderConfirm.post.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "orderConfirm.post.success.title" as const,
    description: "orderConfirm.post.success.description" as const,
  },

  examples: {
    urlPathParams: {
      default: { poId: "789e1234-e89b-12d3-a456-426614174000" },
    },
    responses: {
      default: {
        result: {
          id: "789e1234-e89b-12d3-a456-426614174000",
          status: "CONFIRMED",
          confirmedAt: new Date("2024-06-01"),
        },
      },
    },
  },
});

const definitions = { POST } as const;
export default definitions;
