/**
 * Inventory Warehouse Update API Route Definition
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

import { scopedTranslation } from "../../../i18n";

const InventoryWarehouseUpdateWidget = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.InventoryWarehouseUpdateWidget,
  })),
);

const { PATCH } = createEndpoint({
  scopedTranslation,
  method: Methods.PATCH,
  path: ["inventory", "warehouse", "[warehouseId]", "update"],
  title: "warehouseUpdate.patch.title" as const,
  titleShort: "warehouseUpdate.patch.titleShort" as const,
  description: "warehouseUpdate.patch.description" as const,
  category: "inventory",
  subCategory: "Inventory: Warehouses",
  tags: [
    "tags.inventory" as const,
    "tags.warehouse" as const,
    "tags.update" as const,
  ],
  allowedRoles: [UserRole.ADMIN] as const,
  icon: "archive" as const,

  fields: customWidgetObject({
    usage: { request: "data", response: true } as const,
    render: InventoryWarehouseUpdateWidget,
    children: {
      warehouseId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "warehouseUpdate.patch.warehouseId.label" as const,
        description: "warehouseUpdate.patch.warehouseId.description" as const,
        schema: z.uuid(),
        urlPathParam: true,
        listEndpoint: async () =>
          (
            await import("@/app/api/[locale]/inventory/warehouse/list/definition")
          ).default.GET,
        labelField: "name",
      }),
      name: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "warehouseUpdate.patch.name.label" as const,
        description: "warehouseUpdate.patch.name.description" as const,
        schema: z.string().min(1).max(255).optional(),
      }),
      code: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "warehouseUpdate.patch.code.label" as const,
        description: "warehouseUpdate.patch.code.description" as const,
        schema: z.string().min(1).max(20).optional(),
      }),
      address: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "warehouseUpdate.patch.address.label" as const,
        description: "warehouseUpdate.patch.address.description" as const,
        schema: z.string().optional(),
      }),
      isActive: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "warehouseUpdate.patch.isActive.label" as const,
        description: "warehouseUpdate.patch.isActive.description" as const,
        schema: z.boolean().optional(),
      }),
      isDefault: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "warehouseUpdate.patch.isDefault.label" as const,
        description: "warehouseUpdate.patch.isDefault.description" as const,
        schema: z.boolean().optional(),
      }),

      result: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        usage: { response: true },
        children: {
          id: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "warehouseUpdate.patch.response.id" as const,
            hidden: true,
            schema: z.uuid(),
          }),
          name: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "warehouseUpdate.patch.response.name" as const,
            schema: z.string(),
          }),
          code: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "warehouseUpdate.patch.response.code" as const,
            schema: z.string(),
          }),
          isActive: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "warehouseUpdate.patch.response.isActive" as const,
            schema: z.boolean(),
          }),
          isDefault: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "warehouseUpdate.patch.response.isDefault" as const,
            schema: z.boolean(),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "warehouseUpdate.patch.errors.validation.title" as const,
      description:
        "warehouseUpdate.patch.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "warehouseUpdate.patch.errors.unauthorized.title" as const,
      description:
        "warehouseUpdate.patch.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "warehouseUpdate.patch.errors.forbidden.title" as const,
      description:
        "warehouseUpdate.patch.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "warehouseUpdate.patch.errors.conflict.title" as const,
      description: "warehouseUpdate.patch.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "warehouseUpdate.patch.errors.server.title" as const,
      description: "warehouseUpdate.patch.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "warehouseUpdate.patch.errors.unknown.title" as const,
      description: "warehouseUpdate.patch.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "warehouseUpdate.patch.errors.network.title" as const,
      description: "warehouseUpdate.patch.errors.network.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "warehouseUpdate.patch.errors.notFound.title" as const,
      description: "warehouseUpdate.patch.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "warehouseUpdate.patch.errors.unsavedChanges.title" as const,
      description:
        "warehouseUpdate.patch.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "warehouseUpdate.patch.success.title" as const,
    description: "warehouseUpdate.patch.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        warehouseId: "aabbccdd-e89b-12d3-a456-426614174001",
        name: "Main Warehouse Updated",
        isActive: true,
      },
    },
    responses: {
      default: {
        result: {
          id: "aabbccdd-e89b-12d3-a456-426614174001",
          name: "Main Warehouse Updated",
          code: "WH-01",
          isActive: true,
          isDefault: true,
        },
      },
    },
  },
});

export type InventoryWarehouseUpdateRequestOutput =
  typeof PATCH.types.RequestOutput;
export type InventoryWarehouseUpdateResponseOutput =
  typeof PATCH.types.ResponseOutput;

const definitions = {
  PATCH,
} as const;
export default definitions;
