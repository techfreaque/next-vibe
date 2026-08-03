/**
 * POS Order Complete API Route Definition
 * Completes an order, validates full payment, and posts a journal entry
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
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "../../../i18n";

const PosOrderCompleteWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.PosOrderCompleteWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["pos", "order", "[orderId]", "complete"],
  title: "orderComplete.post.title",
  titleShort: "orderComplete.post.titleShort" as const,
  description: "orderComplete.post.description",
  category: "pos",
  subCategory: "POS: Orders",
  tags: ["tags.pos", "tags.order", "tags.complete"],
  allowedRoles: [UserRole.ADMIN],
  icon: "check-circle",

  fields: customWidgetObject({
    render: PosOrderCompleteWidgetLazy,
    usage: { request: "data", response: true },
    children: {
      orderId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "orderComplete.post.orderId.label",
        description: "orderComplete.post.orderId.description",
        schema: z.uuid(),
        listEndpoint: async () =>
          (await import("@/pos/order/list/definition")).default.GET,
        labelField: "id",
      }),

      result: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          id: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderComplete.post.response.id",
            schema: z.uuid(),
          }),
          status: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderComplete.post.response.status",
            schema: z.string(),
          }),
          total: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderComplete.post.response.total",
            schema: z.number(),
          }),
          journalEntryId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderComplete.post.response.journalEntryId",
            schema: z.uuid().nullable(),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "orderComplete.post.errors.validation.title",
      description: "orderComplete.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "orderComplete.post.errors.unauthorized.title",
      description: "orderComplete.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "orderComplete.post.errors.forbidden.title",
      description: "orderComplete.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "orderComplete.post.errors.conflict.title",
      description: "orderComplete.post.errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "orderComplete.post.errors.server.title",
      description: "orderComplete.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "orderComplete.post.errors.unknown.title",
      description: "orderComplete.post.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "orderComplete.post.errors.network.title",
      description: "orderComplete.post.errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "orderComplete.post.errors.notFound.title",
      description: "orderComplete.post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "orderComplete.post.errors.unsavedChanges.title",
      description: "orderComplete.post.errors.unsavedChanges.description",
    },
  },

  successTypes: {
    title: "orderComplete.post.success.title",
    description: "orderComplete.post.success.description",
  },

  examples: {
    requests: {
      default: {
        orderId: "eeff1122-e89b-12d3-a456-426614174003",
      },
    },
    responses: {
      default: {
        result: {
          id: "eeff1122-e89b-12d3-a456-426614174003",
          status: "COMPLETED",
          total: 8.4,
          journalEntryId: "aabb1234-e89b-12d3-a456-426614174099",
        },
      },
    },
  },
});

export type PosOrderCompletePostRequestOutput = typeof POST.types.RequestOutput;

const definitions = {
  POST,
} as const;
export default definitions;
