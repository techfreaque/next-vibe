/**
 * POS Register (till screen) API Route Definition
 * The cashier's working screen for one open session: products, cart, tender.
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
  requestUrlPathParamsField,
  responseArrayField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { PosSessionStatus, PosSessionStatusDB } from "../../../enum";
import { POS_REGISTER_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

const PosRegisterWidgetLazy = lazyWidget(() =>
  import("./widget/widget").then((m) => ({ default: m.PosRegisterWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["pos", "session", "[sessionId]", "register"],
  aliases: [POS_REGISTER_ALIAS] as const,
  title: "get.title",
  titleShort: "get.titleShort" as const,
  description: "get.description",
  category: "pos",
  subCategory: "POS: Sessions",
  tags: ["tags.pos", "tags.register"],
  allowedRoles: [UserRole.ADMIN],
  icon: "shopping-cart",

  fields: customWidgetObject({
    render: PosRegisterWidgetLazy,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      sessionId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.sessionId.label",
        description: "get.sessionId.description",
        schema: z.uuid(),
      }),

      session: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          id: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            hidden: true,
            schema: z.uuid(),
          }),
          status: responseField(scopedTranslation, {
            type: WidgetType.BADGE,
            label: "get.response.status",
            schema: z.enum(PosSessionStatusDB),
          }),
          terminalId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            hidden: true,
            schema: z.uuid(),
          }),
          terminalName: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "get.response.terminalName",
            schema: z.string(),
          }),
          companyId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            hidden: true,
            schema: z.uuid(),
          }),
          companyName: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "get.response.companyName",
            schema: z.string(),
          }),
          currency: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "get.response.currency",
            schema: z.string(),
          }),
          openedAt: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            fieldType: FieldDataType.DATETIME,
            label: "get.response.openedAt",
            schema: z.coerce.date(),
          }),
          openingFloat: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "get.response.openingFloat",
            schema: z.number(),
          }),
          salesCount: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "get.response.salesCount",
            schema: z.number(),
          }),
          salesTotal: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "get.response.salesTotal",
            schema: z.number(),
          }),
        },
      }),

      emptyOrderId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.uuid().nullable(),
      }),

      openOrders: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        label: "get.response.openOrders",
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID_2_COLUMNS,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              hidden: true,
              schema: z.uuid(),
            }),
            orderNumber: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.orderNumber",
              schema: z.string(),
            }),
            itemCount: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.itemCount",
              schema: z.number(),
            }),
            total: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.total",
              schema: z.number(),
            }),
            createdAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              fieldType: FieldDataType.DATETIME,
              label: "get.response.createdAt",
              schema: z.coerce.date(),
            }),
          },
        }),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title",
      description: "get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title",
      description: "get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title",
      description: "get.errors.forbidden.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title",
      description: "get.errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title",
      description: "get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title",
      description: "get.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title",
      description: "get.errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title",
      description: "get.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title",
      description: "get.errors.unsavedChanges.description",
    },
  },

  options: {
    formOptions: {
      autoSubmit: true,
      debounceMs: 0,
    },
  },

  successTypes: {
    title: "get.success.title",
    description: "get.success.description",
  },

  examples: {
    urlPathParams: {
      default: {
        sessionId: "ccddee00-e89b-12d3-a456-426614174002",
      },
    },
    requests: undefined,
    responses: {
      default: {
        session: {
          id: "ccddee00-e89b-12d3-a456-426614174002",
          status: PosSessionStatus.OPEN,
          terminalId: "aabbccdd-e89b-12d3-a456-426614174001",
          terminalName: "Front counter",
          companyId: "e7f27962-ea54-447c-a142-be1d609eb4dc",
          companyName: "Demo Company",
          currency: "EUR",
          openedAt: new Date("2026-11-26T08:00:00.000Z"),
          openingFloat: 150,
          salesCount: 12,
          salesTotal: 486.4,
        },
        emptyOrderId: null,
        openOrders: [
          {
            id: "eeff1122-e89b-12d3-a456-426614174003",
            orderNumber: "POS-20261126-0013",
            itemCount: 2,
            total: 54.3,
            createdAt: new Date("2026-11-26T14:12:00.000Z"),
          },
        ],
      },
    },
  },
});

export type PosRegisterGetResponseOutput = typeof GET.types.ResponseOutput;

const definitions = {
  GET,
} as const;
export default definitions;
