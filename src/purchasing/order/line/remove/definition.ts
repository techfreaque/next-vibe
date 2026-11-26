/**
 * Purchase Order Line Remove API Route Definition
 * POST — remove a line item from a purchase order
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

  options: {
    mutationOptions: {
      onSuccess: async ({
        logger,
        requestData: { poId, lineId },
        responseData: { result: totals },
      }) => {
        const [{ apiClient }, order] = await Promise.all([
          import("next-vibe/unified-ui/hooks/store"),
          import("../../[poId]/get/definition"),
        ]);
        if (!totals) {
          return;
        }
        apiClient.updateEndpointData(
          order.default.GET,
          logger,
          (cached) => {
            if (!cached?.success || cached.data.result?.id !== poId) {
              return cached;
            }
            const current = cached.data.result;
            return {
              ...cached,
              data: {
                ...cached.data,
                result: {
                  ...current,
                  subtotal: totals.subtotal,
                  taxAmount: totals.taxAmount,
                  total: totals.total,
                  lines: current.lines.filter((line) => line.id !== lineId),
                },
              },
            };
          },
          { urlPathParams: { poId } },
        );
      },
    },
  },

  fields: customWidgetObject({
    render: OrderLineRemoveWidgetLazy,
    usage: { request: "data", response: true },
    children: {
      poId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        listEndpoint: async () =>
          (await import("@/purchasing/order/list/definition")).default.GET,
        labelField: "poNumber",
        label: "orderLineRemove.post.poId.label" as const,
        description: "orderLineRemove.post.poId.description" as const,
        hidden: true,
        schema: z.uuid(),
      }),

      lineId: requestField(scopedTranslation, {
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
          currency: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderCreate.currency.label",
            schema: z.string().optional(),
          }),
          removedDescription: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderLineAdd.post.itemDescription.label",
            schema: z.string().optional(),
          }),
          subtotal: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderLineRemove.post.response.subtotal" as const,
            fieldType: FieldDataType.NUMBER,
            schema: z.number(),
          }),
          taxAmount: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderLineRemove.post.response.taxAmount" as const,
            fieldType: FieldDataType.NUMBER,
            schema: z.number(),
          }),
          total: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderLineRemove.post.response.total" as const,
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
    requests: {
      default: {
        poId: "789e1234-e89b-12d3-a456-426614174000",
        lineId: "aaa11111-e89b-12d3-a456-426614174000",
      },
    },
    responses: {
      default: {
        result: {
          removedDescription: "Packing tape",
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
