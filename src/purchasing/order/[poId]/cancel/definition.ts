/**
 * Purchase Order Cancel API Route Definition
 * POST — cancel a Draft or Sent purchase order
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

const OrderCancelWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.OrderCancelWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["purchasing", "order", "[poId]", "cancel"],
  title: "orderCancel.post.title" as const,
  titleShort: "orderCancel.post.titleShort" as const,
  description: "orderCancel.post.description" as const,
  category: "purchasing",
  subCategory: "Purchasing: Orders",
  icon: "x-circle" as const,
  tags: [
    "tags.purchasing" as const,
    "tags.order" as const,
    "tags.cancel" as const,
  ],
  allowedRoles: [UserRole.ADMIN] as const,

  fields: customWidgetObject({
    render: OrderCancelWidgetLazy,
    usage: { request: "urlPathParams", response: true },
    children: {
      poId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "orderCancel.post.poId.label" as const,
        description: "orderCancel.post.poId.description" as const,
        hidden: true,
        schema: z.uuid(),
        listEndpoint: async () =>
          (await import("@/app/api/[locale]/purchasing/order/list/definition"))
            .default.GET,
        labelField: "poNumber",
      }),

      result: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          id: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderCancel.post.response.id" as const,
            hidden: true,
            schema: z.uuid(),
          }),
          status: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderCancel.post.response.status" as const,
            schema: z.string(),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "orderCancel.post.errors.validation.title" as const,
      description: "orderCancel.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "orderCancel.post.errors.unauthorized.title" as const,
      description: "orderCancel.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "orderCancel.post.errors.forbidden.title" as const,
      description: "orderCancel.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "orderCancel.post.errors.conflict.title" as const,
      description: "orderCancel.post.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "orderCancel.post.errors.server.title" as const,
      description: "orderCancel.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "orderCancel.post.errors.unknown.title" as const,
      description: "orderCancel.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "orderCancel.post.errors.network.title" as const,
      description: "orderCancel.post.errors.network.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "orderCancel.post.errors.notFound.title" as const,
      description: "orderCancel.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "orderCancel.post.errors.unsavedChanges.title" as const,
      description:
        "orderCancel.post.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "orderCancel.post.success.title" as const,
    description: "orderCancel.post.success.description" as const,
  },

  examples: {
    urlPathParams: {
      default: { poId: "789e1234-e89b-12d3-a456-426614174000" },
    },
    responses: {
      default: {
        result: {
          id: "789e1234-e89b-12d3-a456-426614174000",
          status: "CANCELLED",
        },
      },
    },
  },
});

const definitions = { POST } as const;
export default definitions;
