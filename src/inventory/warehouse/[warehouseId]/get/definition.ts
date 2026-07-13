/**
 * Inventory Warehouse Get API Route Definition
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
  requestUrlPathParamsField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { scopedTranslation } from "../../../i18n";

const InventoryWarehouseGetWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.InventoryWarehouseGetWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["inventory", "warehouse", "[warehouseId]", "get"],
  title: "warehouseGet.get.title" as const,
  titleShort: "warehouseGet.get.titleShort" as const,
  description: "warehouseGet.get.description" as const,
  category: "inventory",
  subCategory: "Inventory: Warehouses",
  tags: [
    "tags.inventory" as const,
    "tags.warehouse" as const,
    "tags.get" as const,
  ],
  allowedRoles: [UserRole.ADMIN] as const,
  icon: "archive" as const,

  fields: customWidgetObject({
    render: InventoryWarehouseGetWidget,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      warehouseId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "warehouseGet.get.warehouseId.label" as const,
        description: "warehouseGet.get.warehouseId.description" as const,
        schema: z.uuid(),
        listEndpoint: async () =>
          (await import("@/inventory/warehouse/list/definition")).default.GET,
        labelField: "name",
      }),

      result: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.GRID_2_COLUMNS,
        usage: { response: true },
        children: {
          id: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "warehouseGet.get.response.id" as const,
            hidden: true,
            schema: z.uuid(),
          }),
          companyId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "warehouseGet.get.response.companyId" as const,
            hidden: true,
            schema: z.uuid(),
          }),
          name: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "warehouseGet.get.response.name" as const,
            schema: z.string(),
          }),
          code: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "warehouseGet.get.response.code" as const,
            schema: z.string(),
          }),
          address: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "warehouseGet.get.response.address" as const,
            schema: z.string().nullable(),
          }),
          isActive: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "warehouseGet.get.response.isActive" as const,
            schema: z.boolean(),
          }),
          isDefault: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "warehouseGet.get.response.isDefault" as const,
            schema: z.boolean(),
          }),
          createdAt: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "warehouseGet.get.response.createdAt" as const,
            fieldType: FieldDataType.DATETIME,
            schema: z.coerce.date(),
          }),
          updatedAt: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "warehouseGet.get.response.updatedAt" as const,
            fieldType: FieldDataType.DATETIME,
            schema: z.coerce.date(),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "warehouseGet.get.errors.validation.title" as const,
      description: "warehouseGet.get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "warehouseGet.get.errors.unauthorized.title" as const,
      description: "warehouseGet.get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "warehouseGet.get.errors.forbidden.title" as const,
      description: "warehouseGet.get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "warehouseGet.get.errors.conflict.title" as const,
      description: "warehouseGet.get.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "warehouseGet.get.errors.server.title" as const,
      description: "warehouseGet.get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "warehouseGet.get.errors.unknown.title" as const,
      description: "warehouseGet.get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "warehouseGet.get.errors.network.title" as const,
      description: "warehouseGet.get.errors.network.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "warehouseGet.get.errors.notFound.title" as const,
      description: "warehouseGet.get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "warehouseGet.get.errors.unsavedChanges.title" as const,
      description:
        "warehouseGet.get.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "warehouseGet.get.success.title" as const,
    description: "warehouseGet.get.success.description" as const,
  },

  examples: {
    urlPathParams: {
      default: {
        warehouseId: "aabbccdd-e89b-12d3-a456-426614174001",
      },
    },
    requests: undefined,
    responses: {
      default: {
        result: {
          id: "aabbccdd-e89b-12d3-a456-426614174001",
          companyId: "123e4567-e89b-12d3-a456-426614174000",
          name: "Main Warehouse",
          code: "WH-01",
          address: "123 Storage Lane",
          isActive: true,
          isDefault: true,
          createdAt: new Date("2024-01-01T00:00:00.000Z"),
          updatedAt: new Date("2024-01-01T00:00:00.000Z"),
        },
      },
    },
  },
});

export type InventoryWarehouseGetRequestOutput = typeof GET.types.RequestOutput;
export type InventoryWarehouseGetResponseOutput =
  typeof GET.types.ResponseOutput;

const definitions = {
  GET,
} as const;
export default definitions;
