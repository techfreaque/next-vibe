/**
 * Purchase Order Convert to Bill API Route Definition
 * POST — create an AP bill from a purchase order
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

import orderListDefinitions from "@/app/api/[locale]/purchasing/order/list/definition";
import { scopedTranslation } from "../../../i18n";

const OrderConvertToBillWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.OrderConvertToBillWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["purchasing", "order", "[poId]", "convert-to-bill"],
  title: "orderConvertToBill.post.title" as const,
  titleShort: "orderConvertToBill.post.titleShort" as const,
  description: "orderConvertToBill.post.description" as const,
  category: "purchasing",
  subCategory: "Purchasing: Orders",
  icon: "receipt" as const,
  tags: [
    "tags.purchasing" as const,
    "tags.order" as const,
    "tags.convertToBill" as const,
  ],
  allowedRoles: [UserRole.ADMIN] as const,

  fields: customWidgetObject({
    render: OrderConvertToBillWidgetLazy,
    usage: { request: "urlPathParams", response: true },
    children: {
      poId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "orderConvertToBill.post.poId.label" as const,
        description: "orderConvertToBill.post.poId.description" as const,
        hidden: true,
        schema: z.uuid(),
        listEndpoint: orderListDefinitions.GET,
        labelField: "poNumber",
      }),

      result: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          billId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "orderConvertToBill.post.response.billId" as const,
            schema: z.uuid(),
          }),
          billNumber: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "orderConvertToBill.post.response.billNumber" as const,
            schema: z.string(),
          }),
          poId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "orderConvertToBill.post.response.poId" as const,
            hidden: true,
            schema: z.uuid(),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "orderConvertToBill.post.errors.validation.title" as const,
      description:
        "orderConvertToBill.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "orderConvertToBill.post.errors.unauthorized.title" as const,
      description:
        "orderConvertToBill.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "orderConvertToBill.post.errors.forbidden.title" as const,
      description:
        "orderConvertToBill.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "orderConvertToBill.post.errors.conflict.title" as const,
      description:
        "orderConvertToBill.post.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "orderConvertToBill.post.errors.server.title" as const,
      description: "orderConvertToBill.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "orderConvertToBill.post.errors.unknown.title" as const,
      description:
        "orderConvertToBill.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "orderConvertToBill.post.errors.network.title" as const,
      description:
        "orderConvertToBill.post.errors.network.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "orderConvertToBill.post.errors.notFound.title" as const,
      description:
        "orderConvertToBill.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "orderConvertToBill.post.errors.unsavedChanges.title" as const,
      description:
        "orderConvertToBill.post.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "orderConvertToBill.post.success.title" as const,
    description: "orderConvertToBill.post.success.description" as const,
  },

  examples: {
    urlPathParams: {
      default: { poId: "789e1234-e89b-12d3-a456-426614174000" },
    },
    responses: {
      default: {
        result: {
          billId: "ccc33333-e89b-12d3-a456-426614174000",
          billNumber: "PO-PO-2024-0001",
          poId: "789e1234-e89b-12d3-a456-426614174000",
        },
      },
    },
  },
});

const definitions = { POST } as const;
export default definitions;
