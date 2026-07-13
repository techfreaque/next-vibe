/**
 * Purchase Order Send API Route Definition
 * POST — transition PO from Draft to Sent
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

const OrderSendWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.OrderSendWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["purchasing", "order", "[poId]", "send"],
  title: "orderSend.post.title" as const,
  titleShort: "orderSend.post.titleShort" as const,
  description: "orderSend.post.description" as const,
  category: "purchasing",
  subCategory: "Purchasing: Orders",
  icon: "send" as const,
  tags: [
    "tags.purchasing" as const,
    "tags.order" as const,
    "tags.send" as const,
  ],
  allowedRoles: [UserRole.ADMIN] as const,

  fields: customWidgetObject({
    render: OrderSendWidgetLazy,
    usage: { request: "urlPathParams", response: true },
    children: {
      poId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "orderSend.post.poId.label" as const,
        description: "orderSend.post.poId.description" as const,
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
            label: "orderSend.post.response.id" as const,
            hidden: true,
            schema: z.uuid(),
          }),
          status: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderSend.post.response.status" as const,
            schema: z.string(),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "orderSend.post.errors.validation.title" as const,
      description: "orderSend.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "orderSend.post.errors.unauthorized.title" as const,
      description: "orderSend.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "orderSend.post.errors.forbidden.title" as const,
      description: "orderSend.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "orderSend.post.errors.conflict.title" as const,
      description: "orderSend.post.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "orderSend.post.errors.server.title" as const,
      description: "orderSend.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "orderSend.post.errors.unknown.title" as const,
      description: "orderSend.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "orderSend.post.errors.network.title" as const,
      description: "orderSend.post.errors.network.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "orderSend.post.errors.notFound.title" as const,
      description: "orderSend.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "orderSend.post.errors.unsavedChanges.title" as const,
      description: "orderSend.post.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "orderSend.post.success.title" as const,
    description: "orderSend.post.success.description" as const,
  },

  examples: {
    urlPathParams: {
      default: { poId: "789e1234-e89b-12d3-a456-426614174000" },
    },
    responses: {
      default: {
        result: {
          id: "789e1234-e89b-12d3-a456-426614174000",
          status: "SENT",
        },
      },
    },
  },
});

const definitions = { POST } as const;
export default definitions;
