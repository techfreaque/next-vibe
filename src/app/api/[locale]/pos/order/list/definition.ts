/**
 * POS Order List API Route Definition
 * Lists orders for a session with optional status filter and pagination
 */

import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";
import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
  requestField,
  responseArrayField,
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

import { PosOrderStatusOptions } from "../../enum";
import { PosOrderStatusDB } from "../../enum";
import { scopedTranslation } from "../../i18n";
import { POS_ORDER_LIST_ALIAS } from "./constants";

const PosOrderListWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.PosOrderListWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["pos", "order", "list"],
  aliases: [POS_ORDER_LIST_ALIAS] as const,
  title: "orderList.get.title",
  titleShort: "orderList.get.titleShort" as const,
  description: "orderList.get.description",
  category: "pos",
  subCategory: "POS: Orders",
  tags: ["tags.pos", "tags.order", "tags.list"],
  allowedRoles: [UserRole.ADMIN],
  defaultWebPinned: [UserRole.ADMIN],
  icon: "list",

  fields: customWidgetObject({
    render: PosOrderListWidgetLazy,
    usage: { request: "data", response: true },
    children: {
      input: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.GRID_2_COLUMNS,
        usage: { request: "data" },
        children: {
          sessionId: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "orderList.get.sessionId.label",
            description: "orderList.get.sessionId.description",
            schema: z.uuid(),
          }),
          status: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "orderList.get.status.label",
            description: "orderList.get.status.description",
            placeholder: "orderList.get.status.placeholder",
            options: PosOrderStatusOptions,
            schema: z.enum(PosOrderStatusDB).optional(),
          }),
        },
      }),
      page: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "orderList.get.page.label",
        description: "orderList.get.page.description",
        schema: z.number().int().min(1).optional(),
      }),
      pageSize: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "orderList.get.pageSize.label",
        description: "orderList.get.pageSize.description",
        schema: z.number().int().min(1).max(100).optional(),
      }),

      count: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "orderList.get.response.count",
        schema: z.number(),
      }),

      orders: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        columns: 12,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID_2_COLUMNS,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "orderList.get.response.id",
              schema: z.uuid(),
            }),
            orderNumber: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "orderList.get.response.orderNumber",
              schema: z.string(),
            }),
            sessionId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "orderList.get.response.sessionId",
              schema: z.uuid(),
            }),
            status: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "orderList.get.response.status",
              schema: z.string(),
            }),
            currency: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "orderList.get.response.currency",
              schema: z.string(),
            }),
            total: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "orderList.get.response.total",
              schema: z.number(),
            }),
            createdAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "orderList.get.response.createdAt",
              fieldType: FieldDataType.DATETIME,
              schema: z.coerce.date(),
            }),
          },
        }),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "orderList.get.errors.validation.title",
      description: "orderList.get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "orderList.get.errors.unauthorized.title",
      description: "orderList.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "orderList.get.errors.forbidden.title",
      description: "orderList.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "orderList.get.errors.conflict.title",
      description: "orderList.get.errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "orderList.get.errors.server.title",
      description: "orderList.get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "orderList.get.errors.unknown.title",
      description: "orderList.get.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "orderList.get.errors.network.title",
      description: "orderList.get.errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "orderList.get.errors.notFound.title",
      description: "orderList.get.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "orderList.get.errors.unsavedChanges.title",
      description: "orderList.get.errors.unsavedChanges.description",
    },
  },

  successTypes: {
    title: "orderList.get.success.title",
    description: "orderList.get.success.description",
  },

  examples: {
    requests: {
      default: {
        input: {
          sessionId: "ccddee00-e89b-12d3-a456-426614174002",
          status: undefined,
        },
        page: 1,
        pageSize: 20,
      },
    },
    responses: {
      default: {
        count: 0,
        orders: [],
      },
    },
  },
});

export type PosOrderListRequestOutput = typeof GET.types.RequestOutput;
export type PosOrderListResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
