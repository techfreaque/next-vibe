/**
 * Inventory Stock Adjust API Route Definition
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
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "../../i18n";

const InventoryStockAdjustWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.InventoryStockAdjustWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["inventory", "stock", "adjust"],
  title: "stockAdjust.post.title" as const,
  titleShort: "stockAdjust.post.titleShort" as const,
  description: "stockAdjust.post.description" as const,
  category: "inventory" as const,
  subCategory: "Inventory: Stock" as const,
  tags: [
    "tags.inventory" as const,
    "tags.stock" as const,
    "tags.adjust" as const,
  ],
  allowedRoles: [UserRole.ADMIN] as const,
  icon: "settings" as const,

  fields: customWidgetObject({
    usage: { request: "data", response: true } as const,
    render: InventoryStockAdjustWidget,
    children: {
      warehouseId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "stockAdjust.post.warehouseId.label" as const,
        description: "stockAdjust.post.warehouseId.description" as const,
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
        label: "stockAdjust.post.productId.label" as const,
        description: "stockAdjust.post.productId.description" as const,
        schema: z.uuid(),
        listEndpoint: async () =>
          (await import("@/app/api/[locale]/products/catalog/list/definition"))
            .default.GET,
        labelField: "name",
      }),
      quantity: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "stockAdjust.post.quantity.label" as const,
        description: "stockAdjust.post.quantity.description" as const,
        schema: z.number().refine((n) => n !== 0),
      }),
      reason: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "stockAdjust.post.reason.label" as const,
        description: "stockAdjust.post.reason.description" as const,
        schema: z.string().min(1).max(500).optional(),
      }),
      unitCost: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "stockAdjust.post.unitCost.label" as const,
        description: "stockAdjust.post.unitCost.description" as const,
        schema: z.number().nonnegative().optional(),
      }),

      result: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        usage: { response: true },
        children: {
          movementId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "stockAdjust.post.response.movementId" as const,
            hidden: true,
            schema: z.uuid(),
          }),
          warehouseId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "stockAdjust.post.response.warehouseId" as const,
            hidden: true,
            schema: z.uuid(),
          }),
          productId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "stockAdjust.post.response.productId" as const,
            schema: z.uuid(),
          }),
          quantityOnHand: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "stockAdjust.post.response.quantityOnHand" as const,
            schema: z.number(),
          }),
          quantityAvailable: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "stockAdjust.post.response.quantityAvailable" as const,
            schema: z.number(),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "stockAdjust.post.errors.validation.title" as const,
      description: "stockAdjust.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "stockAdjust.post.errors.unauthorized.title" as const,
      description: "stockAdjust.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "stockAdjust.post.errors.forbidden.title" as const,
      description: "stockAdjust.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "stockAdjust.post.errors.conflict.title" as const,
      description: "stockAdjust.post.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "stockAdjust.post.errors.server.title" as const,
      description: "stockAdjust.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "stockAdjust.post.errors.unknown.title" as const,
      description: "stockAdjust.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "stockAdjust.post.errors.network.title" as const,
      description: "stockAdjust.post.errors.network.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "stockAdjust.post.errors.notFound.title" as const,
      description: "stockAdjust.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "stockAdjust.post.errors.unsavedChanges.title" as const,
      description:
        "stockAdjust.post.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "stockAdjust.post.success.title" as const,
    description: "stockAdjust.post.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        warehouseId: "aabbccdd-e89b-12d3-a456-426614174001",
        productId: "11223344-e89b-12d3-a456-426614174001",
        quantity: -5,
        reason: "Physical count correction",
      },
    },
    responses: {
      default: {
        result: {
          movementId: "ccddee11-e89b-12d3-a456-426614174001",
          warehouseId: "aabbccdd-e89b-12d3-a456-426614174001",
          productId: "11223344-e89b-12d3-a456-426614174001",
          quantityOnHand: 95,
          quantityAvailable: 85,
        },
      },
    },
  },
});

export type InventoryStockAdjustRequestOutput = typeof POST.types.RequestOutput;
export type InventoryStockAdjustResponseOutput =
  typeof POST.types.ResponseOutput;

const definitions = {
  POST,
} as const;
export default definitions;
