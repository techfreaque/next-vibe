/**
 * Inventory Stock List API Route Definition
 */

import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import {
  customWidgetObject,
  objectField,
  requestField,
  responseArrayField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { scopedTranslation } from "../../i18n";
import { INVENTORY_STOCK_ALIAS } from "./constants";

const InventoryStockListWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.InventoryStockListWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["inventory", "stock", "list"],
  aliases: [INVENTORY_STOCK_ALIAS] as const,
  title: "stockList.get.title" as const,
  titleShort: "stockList.get.titleShort" as const,
  description: "stockList.get.description" as const,
  category: "inventory" as const,
  subCategory: "Inventory: Stock" as const,
  tags: [
    "tags.inventory" as const,
    "tags.stock" as const,
    "tags.list" as const,
  ],
  allowedRoles: [UserRole.ADMIN] as const,
  defaultWebPinned: [UserRole.ADMIN] as const,
  icon: "package" as const,

  fields: customWidgetObject({
    usage: { request: "data", response: true } as const,
    render: InventoryStockListWidget,
    children: {
      warehouseId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "stockList.get.warehouseId.label" as const,
        description: "stockList.get.warehouseId.description" as const,
        schema: z.uuid().optional(),
        listEndpoint: async () =>
          (
            await import("@/app/api/[locale]/inventory/warehouse/list/definition")
          ).default.GET,
        labelField: "name",
      }),
      productId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "stockList.get.productId.label" as const,
        description: "stockList.get.productId.description" as const,
        schema: z.uuid().optional(),
        listEndpoint: async () =>
          (await import("@/app/api/[locale]/products/catalog/list/definition"))
            .default.GET,
        labelField: "name",
      }),

      stockLevels: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID_2_COLUMNS,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "stockList.get.response.id",
              hidden: true,
              schema: z.uuid(),
            }),
            warehouseId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "stockList.get.response.warehouseId",
              hidden: true,
              schema: z.uuid(),
            }),
            productId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "stockList.get.response.productId",
              schema: z.uuid(),
            }),
            productName: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "stockList.get.response.productName",
              schema: z.string().nullable(),
            }),
            warehouseName: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "stockList.get.response.warehouseName",
              schema: z.string().nullable(),
            }),
            quantityOnHand: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "stockList.get.response.quantityOnHand",
              schema: z.number(),
            }),
            quantityReserved: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "stockList.get.response.quantityReserved",
              schema: z.number(),
            }),
            quantityOnOrder: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "stockList.get.response.quantityOnOrder",
              schema: z.number(),
            }),
            quantityAvailable: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "stockList.get.response.quantityAvailable",
              schema: z.number(),
            }),
            reorderPoint: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "stockList.get.response.reorderPoint",
              schema: z.number().nullable(),
            }),
            unitCost: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "stockList.get.response.unitCost",
              schema: z.number().nullable(),
            }),
            isLowStock: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "stockList.get.response.isLowStock",
              schema: z.boolean(),
            }),
            updatedAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "stockList.get.response.updatedAt",
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
      title: "stockList.get.errors.validation.title",
      description: "stockList.get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "stockList.get.errors.unauthorized.title",
      description: "stockList.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "stockList.get.errors.forbidden.title",
      description: "stockList.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "stockList.get.errors.conflict.title",
      description: "stockList.get.errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "stockList.get.errors.server.title",
      description: "stockList.get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "stockList.get.errors.unknown.title",
      description: "stockList.get.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "stockList.get.errors.network.title",
      description: "stockList.get.errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "stockList.get.errors.notFound.title",
      description: "stockList.get.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "stockList.get.errors.unsavedChanges.title",
      description: "stockList.get.errors.unsavedChanges.description",
    },
  },

  successTypes: {
    title: "stockList.get.success.title",
    description: "stockList.get.success.description",
  },

  examples: {
    requests: {
      default: {},
    },
    responses: {
      default: {
        stockLevels: [
          {
            id: "ccddee11-e89b-12d3-a456-426614174001",
            warehouseId: "aabbccdd-e89b-12d3-a456-426614174001",
            productId: "11223344-e89b-12d3-a456-426614174001",
            productName: "Widget A",
            warehouseName: "Main Warehouse",
            quantityOnHand: 100,
            quantityReserved: 10,
            quantityOnOrder: 50,
            quantityAvailable: 90,
            reorderPoint: 20,
            unitCost: 5.5,
            isLowStock: false,
            updatedAt: new Date("2024-01-01T00:00:00.000Z"),
          },
        ],
      },
    },
  },
});

export type InventoryStockListGetRequestOutput = typeof GET.types.RequestOutput;
export type InventoryStockListGetResponseOutput =
  typeof GET.types.ResponseOutput;

const definitions = {
  GET,
} as const;
export default definitions;
