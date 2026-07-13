/**
 * Inventory Stock Receive API Route Definition
 */

import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import {
  customWidgetObject,
  objectField,
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { scopedTranslation } from "../../i18n";

const InventoryStockReceiveWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.InventoryStockReceiveWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["inventory", "stock", "receive"],
  title: "stockReceive.post.title" as const,
  titleShort: "stockReceive.post.titleShort" as const,
  description: "stockReceive.post.description" as const,
  category: "inventory" as const,
  subCategory: "Inventory: Stock" as const,
  tags: [
    "tags.inventory" as const,
    "tags.stock" as const,
    "tags.receive" as const,
  ],
  allowedRoles: [UserRole.ADMIN] as const,
  icon: "package" as const,

  fields: customWidgetObject({
    usage: { request: "data", response: true } as const,
    render: InventoryStockReceiveWidget,
    children: {
      warehouseId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "stockReceive.post.warehouseId.label" as const,
        description: "stockReceive.post.warehouseId.description" as const,
        schema: z.uuid(),
        listEndpoint: async () =>
          (
            await import("@/app/api/[locale]/inventory/warehouse/list/definition")
          ).default.GET,
        labelField: "name",
      }),
      productId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "stockReceive.post.productId.label" as const,
        description: "stockReceive.post.productId.description" as const,
        schema: z.uuid(),
        listEndpoint: async () =>
          (await import("@/app/api/[locale]/products/catalog/list/definition"))
            .default.GET,
        labelField: "name",
      }),
      quantity: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "stockReceive.post.quantity.label" as const,
        description: "stockReceive.post.quantity.description" as const,
        schema: z.number().positive(),
      }),
      unitCost: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "stockReceive.post.unitCost.label" as const,
        description: "stockReceive.post.unitCost.description" as const,
        schema: z.number().nonnegative().optional(),
      }),
      reference: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "stockReceive.post.reference.label" as const,
        description: "stockReceive.post.reference.description" as const,
        schema: z.string().max(100).optional(),
      }),

      result: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        usage: { response: true },
        children: {
          movementId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "stockReceive.post.response.movementId" as const,
            hidden: true,
            schema: z.uuid(),
          }),
          warehouseId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "stockReceive.post.response.warehouseId" as const,
            hidden: true,
            schema: z.uuid(),
          }),
          productId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "stockReceive.post.response.productId" as const,
            schema: z.uuid(),
          }),
          quantityOnHand: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "stockReceive.post.response.quantityOnHand" as const,
            schema: z.number(),
          }),
          unitCost: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "stockReceive.post.response.unitCost" as const,
            schema: z.number().nullable(),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "stockReceive.post.errors.validation.title" as const,
      description: "stockReceive.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "stockReceive.post.errors.unauthorized.title" as const,
      description: "stockReceive.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "stockReceive.post.errors.forbidden.title" as const,
      description: "stockReceive.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "stockReceive.post.errors.conflict.title" as const,
      description: "stockReceive.post.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "stockReceive.post.errors.server.title" as const,
      description: "stockReceive.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "stockReceive.post.errors.unknown.title" as const,
      description: "stockReceive.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "stockReceive.post.errors.network.title" as const,
      description: "stockReceive.post.errors.network.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "stockReceive.post.errors.notFound.title" as const,
      description: "stockReceive.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "stockReceive.post.errors.unsavedChanges.title" as const,
      description:
        "stockReceive.post.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "stockReceive.post.success.title" as const,
    description: "stockReceive.post.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        warehouseId: "aabbccdd-e89b-12d3-a456-426614174001",
        productId: "11223344-e89b-12d3-a456-426614174001",
        quantity: 100,
        unitCost: 5.5,
        reference: "PO-2024-001",
      },
    },
    responses: {
      default: {
        result: {
          movementId: "ccddee11-e89b-12d3-a456-426614174001",
          warehouseId: "aabbccdd-e89b-12d3-a456-426614174001",
          productId: "11223344-e89b-12d3-a456-426614174001",
          quantityOnHand: 200,
          unitCost: 5.5,
        },
      },
    },
  },
});

export type InventoryStockReceiveRequestOutput =
  typeof POST.types.RequestOutput;
export type InventoryStockReceiveResponseOutput =
  typeof POST.types.ResponseOutput;

const definitions = {
  POST,
} as const;
export default definitions;
