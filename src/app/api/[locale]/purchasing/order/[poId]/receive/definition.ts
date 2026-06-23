/**
 * Purchase Order Receive API Route Definition
 * POST — record goods receipt against a PO
 */

import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";
import { z } from "zod";

import orderListDefinitions from "@/app/api/[locale]/purchasing/order/list/definition";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
  requestField,
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

import { scopedTranslation } from "../../../i18n";

const OrderReceiveWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.OrderReceiveWidget })),
);

const receiveLineSchema = z.object({
  poLineId: z.uuid(),
  quantityReceived: z.number().positive(),
});

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["purchasing", "order", "[poId]", "receive"],
  title: "orderReceive.post.title" as const,
  titleShort: "orderReceive.post.titleShort" as const,
  description: "orderReceive.post.description" as const,
  category: "purchasing",
  subCategory: "Purchasing: Orders",
  icon: "package" as const,
  tags: [
    "tags.purchasing" as const,
    "tags.order" as const,
    "tags.receive" as const,
  ],
  allowedRoles: [UserRole.ADMIN] as const,

  fields: customWidgetObject({
    render: OrderReceiveWidgetLazy,
    usage: { request: "data&urlPathParams", response: true },
    children: {
      poId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "orderReceive.post.poId.label" as const,
        description: "orderReceive.post.poId.description" as const,
        hidden: true,
        schema: z.uuid(),
        listEndpoint: orderListDefinitions.GET,
        labelField: "poNumber",
      }),
      warehouseId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "orderReceive.post.warehouseId.label" as const,
        description: "orderReceive.post.warehouseId.description" as const,
        placeholder: "orderReceive.post.warehouseId.placeholder" as const,
        schema: z.uuid().optional(),
      }),
      notes: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "orderReceive.post.notes.label" as const,
        description: "orderReceive.post.notes.description" as const,
        placeholder: "orderReceive.post.notes.placeholder" as const,
        columns: 12,
        schema: z.string().optional(),
      }),
      lines: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "orderReceive.post.lines.label" as const,
        description: "orderReceive.post.lines.description" as const,
        schema: z.array(receiveLineSchema).min(1),
      }),

      result: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          receiptId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderReceive.post.response.receiptId" as const,
            schema: z.uuid(),
          }),
          status: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderReceive.post.response.status" as const,
            schema: z.string(),
          }),
          receivedAt: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderReceive.post.response.receivedAt" as const,
            fieldType: FieldDataType.DATETIME,
            schema: z.coerce.date(),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "orderReceive.post.errors.validation.title" as const,
      description: "orderReceive.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "orderReceive.post.errors.unauthorized.title" as const,
      description: "orderReceive.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "orderReceive.post.errors.forbidden.title" as const,
      description: "orderReceive.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "orderReceive.post.errors.conflict.title" as const,
      description: "orderReceive.post.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "orderReceive.post.errors.server.title" as const,
      description: "orderReceive.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "orderReceive.post.errors.unknown.title" as const,
      description: "orderReceive.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "orderReceive.post.errors.network.title" as const,
      description: "orderReceive.post.errors.network.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "orderReceive.post.errors.notFound.title" as const,
      description: "orderReceive.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "orderReceive.post.errors.unsavedChanges.title" as const,
      description:
        "orderReceive.post.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "orderReceive.post.success.title" as const,
    description: "orderReceive.post.success.description" as const,
  },

  examples: {
    urlPathParams: {
      default: { poId: "789e1234-e89b-12d3-a456-426614174000" },
    },
    requests: {
      default: {
        warehouseId: undefined,
        notes: "Delivery note #12345",
        lines: [
          {
            poLineId: "aaa11111-e89b-12d3-a456-426614174000",
            quantityReceived: 5,
          },
        ],
      },
    },
    responses: {
      default: {
        result: {
          receiptId: "bbb22222-e89b-12d3-a456-426614174000",
          status: "PARTIALLY_RECEIVED",
          receivedAt: new Date("2024-06-05"),
        },
      },
    },
  },
});

export type OrderReceiveRequestOutput = typeof POST.types.RequestOutput;
export type OrderReceiveResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST } as const;
export default definitions;
