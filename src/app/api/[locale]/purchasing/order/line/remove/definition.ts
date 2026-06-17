/**
 * Purchase Order Line Remove API Route Definition
 * POST — remove a line item from a purchase order
 */

import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";
import { z } from "zod";

import orderListDefinitions from "@/app/api/[locale]/purchasing/order/list/definition";
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
import orderListDefinitions from "@/app/api/[locale]/purchasing/order/list/definition";

import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";

import { scopedTranslation } from "../../../i18n";

const OrderLineRemoveWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.OrderLineRemoveWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["purchasing", "order", "line", "remove"],
  title: "orderLineRemove.post.title" as const,
  titleShort: "orderLineRemove.post.titleShort" as const,
  description: "orderLineRemove.post.description" as const,
  category: "purchasing",
  subCategory: "Purchasing: Orders",
  icon: "trash" as const,
  tags: [
    "tags.purchasing" as const,
    "tags.order" as const,
    "tags.removeLine" as const,
  ],
  allowedRoles: [UserRole.ADMIN] as const,

  fields: customWidgetObject({
    render: OrderLineRemoveWidgetLazy,
    usage: { request: "urlPathParams", response: true },
    children: {
      poId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        listEndpoint: orderListDefinitions.GET,
        labelField: "poNumber",
        label: "orderLineRemove.post.poId.label" as const,
        description: "orderLineRemove.post.poId.description" as const,
        hidden: true,
        schema: z.uuid(),
      }),

      lineId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "orderLineRemove.post.lineId.label" as const,
        description: "orderLineRemove.post.lineId.description" as const,
        hidden: true,
        schema: z.uuid(),
      }),

      result: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          subtotal: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "orderLineRemove.post.response.subtotal" as const,
            fieldType: FieldDataType.NUMBER,
            schema: z.number(),
          }),
          taxAmount: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "orderLineRemove.post.response.taxAmount" as const,
            fieldType: FieldDataType.NUMBER,
            schema: z.number(),
          }),
          total: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "orderLineRemove.post.response.total" as const,
            fieldType: FieldDataType.NUMBER,
            schema: z.number(),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "orderLineRemove.post.errors.validation.title" as const,
      description:
        "orderLineRemove.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "orderLineRemove.post.errors.unauthorized.title" as const,
      description:
        "orderLineRemove.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "orderLineRemove.post.errors.forbidden.title" as const,
      description: "orderLineRemove.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "orderLineRemove.post.errors.conflict.title" as const,
      description: "orderLineRemove.post.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "orderLineRemove.post.errors.server.title" as const,
      description: "orderLineRemove.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "orderLineRemove.post.errors.unknown.title" as const,
      description: "orderLineRemove.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "orderLineRemove.post.errors.network.title" as const,
      description: "orderLineRemove.post.errors.network.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "orderLineRemove.post.errors.notFound.title" as const,
      description: "orderLineRemove.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "orderLineRemove.post.errors.unsavedChanges.title" as const,
      description:
        "orderLineRemove.post.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "orderLineRemove.post.success.title" as const,
    description: "orderLineRemove.post.success.description" as const,
  },

  examples: {
    urlPathParams: {
      default: {
        poId: "789e1234-e89b-12d3-a456-426614174000",
        lineId: "aaa11111-e89b-12d3-a456-426614174000",
      },
    },
    responses: {
      default: {
        result: {
          subtotal: 0,
          taxAmount: 0,
          total: 0,
        },
      },
    },
  },
});

export type OrderLineRemoveResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST } as const;
export default definitions;
