/**
 * POS Order Create API Route Definition
 * Creates a new order in an open session
 */

import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";
import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
  requestField,
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

import { scopedTranslation } from "../../i18n";

const PosOrderCreateWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.PosOrderCreateWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["pos", "order", "create"],
  title: "orderCreate.post.title",
  titleShort: "orderCreate.post.titleShort" as const,
  description: "orderCreate.post.description",
  category: "pos",
  subCategory: "POS: Orders",
  tags: ["tags.pos", "tags.order", "tags.create"],
  allowedRoles: [UserRole.ADMIN],
  icon: "shopping-cart",

  fields: customWidgetObject({
    render: PosOrderCreateWidgetLazy,
    usage: { request: "data", response: true },
    children: {
      details: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.GRID_2_COLUMNS,
        usage: { request: "data" },
        children: {
          sessionId: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "orderCreate.post.sessionId.label",
            description: "orderCreate.post.sessionId.description",
            schema: z.uuid(),
          }),
          customerId: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "orderCreate.post.customerId.label",
            description: "orderCreate.post.customerId.description",
            schema: z.uuid().optional(),
          }),
          currency: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "orderCreate.post.currency.label",
            description: "orderCreate.post.currency.description",
            placeholder: "orderCreate.post.currency.placeholder",
            schema: z.string().length(3).optional(),
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
            content: "orderCreate.post.response.id",
            schema: z.uuid(),
          }),
          orderNumber: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "orderCreate.post.response.orderNumber",
            schema: z.string(),
          }),
          sessionId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "orderCreate.post.response.sessionId",
            schema: z.uuid(),
          }),
          status: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "orderCreate.post.response.status",
            schema: z.string(),
          }),
          currency: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "orderCreate.post.response.currency",
            schema: z.string(),
          }),
          total: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "orderCreate.post.response.total",
            schema: z.number(),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "orderCreate.post.errors.validation.title",
      description: "orderCreate.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "orderCreate.post.errors.unauthorized.title",
      description: "orderCreate.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "orderCreate.post.errors.forbidden.title",
      description: "orderCreate.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "orderCreate.post.errors.conflict.title",
      description: "orderCreate.post.errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "orderCreate.post.errors.server.title",
      description: "orderCreate.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "orderCreate.post.errors.unknown.title",
      description: "orderCreate.post.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "orderCreate.post.errors.network.title",
      description: "orderCreate.post.errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "orderCreate.post.errors.notFound.title",
      description: "orderCreate.post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "orderCreate.post.errors.unsavedChanges.title",
      description: "orderCreate.post.errors.unsavedChanges.description",
    },
  },

  successTypes: {
    title: "orderCreate.post.success.title",
    description: "orderCreate.post.success.description",
  },

  examples: {
    requests: {
      default: {
        details: {
          sessionId: "ccddee00-e89b-12d3-a456-426614174002",
          customerId: undefined,
          currency: "EUR",
        },
      },
    },
    responses: {
      default: {
        result: {
          id: "eeff1122-e89b-12d3-a456-426614174003",
          orderNumber: "POS-20240101-0001",
          sessionId: "ccddee00-e89b-12d3-a456-426614174002",
          status: "OPEN",
          currency: "EUR",
          total: 0,
        },
      },
    },
  },
});

export type PosOrderCreatePostRequestOutput = typeof POST.types.RequestOutput;

const definitions = {
  POST,
} as const;
export default definitions;
