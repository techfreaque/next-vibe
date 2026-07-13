/**
 * Inventory Warehouse List API Route Definition
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
import { INVENTORY_WAREHOUSES_ALIAS } from "./constants";

const InventoryWarehouseListWidget = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.InventoryWarehouseListWidget,
  })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["inventory", "warehouse", "list"],
  aliases: [INVENTORY_WAREHOUSES_ALIAS] as const,
  title: "warehouseList.get.title" as const,
  titleShort: "warehouseList.get.titleShort" as const,
  description: "warehouseList.get.description" as const,
  category: "inventory" as const,
  subCategory: "Inventory: Warehouses" as const,
  tags: [
    "tags.inventory" as const,
    "tags.warehouse" as const,
    "tags.list" as const,
  ],
  allowedRoles: [UserRole.ADMIN] as const,
  defaultWebPinned: [UserRole.ADMIN] as const,
  icon: "archive" as const,

  fields: customWidgetObject({
    usage: { request: "data", response: true } as const,
    render: InventoryWarehouseListWidget,
    children: {
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "warehouseList.get.companyId.label" as const,
        description: "warehouseList.get.companyId.description" as const,
        schema: z.uuid().optional(),
        listEndpoint: async () =>
          (await import("@/companies/list/definition")).default.GET,
        labelField: "name",
      }),

      warehouses: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID_2_COLUMNS,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "warehouseList.get.response.id" as const,
              hidden: true,
              schema: z.uuid(),
            }),
            name: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "warehouseList.get.response.name" as const,
              schema: z.string(),
            }),
            code: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "warehouseList.get.response.code" as const,
              schema: z.string(),
            }),
            address: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "warehouseList.get.response.address" as const,
              schema: z.string().nullable(),
            }),
            isActive: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "warehouseList.get.response.isActive" as const,
              schema: z.boolean(),
            }),
            isDefault: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "warehouseList.get.response.isDefault" as const,
              schema: z.boolean(),
            }),
            createdAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "warehouseList.get.response.createdAt" as const,
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
      title: "warehouseList.get.errors.validation.title" as const,
      description: "warehouseList.get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "warehouseList.get.errors.unauthorized.title" as const,
      description: "warehouseList.get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "warehouseList.get.errors.forbidden.title" as const,
      description: "warehouseList.get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "warehouseList.get.errors.conflict.title" as const,
      description: "warehouseList.get.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "warehouseList.get.errors.server.title" as const,
      description: "warehouseList.get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "warehouseList.get.errors.unknown.title" as const,
      description: "warehouseList.get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "warehouseList.get.errors.network.title" as const,
      description: "warehouseList.get.errors.network.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "warehouseList.get.errors.notFound.title" as const,
      description: "warehouseList.get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "warehouseList.get.errors.unsavedChanges.title" as const,
      description:
        "warehouseList.get.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "warehouseList.get.success.title" as const,
    description: "warehouseList.get.success.description" as const,
  },

  examples: {
    requests: {
      default: {},
    },
    responses: {
      default: {
        warehouses: [
          {
            id: "aabbccdd-e89b-12d3-a456-426614174001",
            name: "Main Warehouse",
            code: "WH-01",
            address: "123 Storage Lane",
            isActive: true,
            isDefault: true,
            createdAt: new Date("2024-01-01T00:00:00.000Z"),
          },
        ],
      },
    },
  },
});

export type InventoryWarehouseListGetRequestOutput =
  typeof GET.types.RequestOutput;
export type InventoryWarehouseListGetResponseOutput =
  typeof GET.types.ResponseOutput;

const definitions = {
  GET,
} as const;
export default definitions;
