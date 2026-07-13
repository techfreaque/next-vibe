/**
 * Inventory Warehouse Create API Route Definition
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

const InventoryWarehouseCreateWidget = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.InventoryWarehouseCreateWidget,
  })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["inventory", "warehouse", "create"],
  title: "warehouseCreate.post.title" as const,
  titleShort: "warehouseCreate.post.titleShort" as const,
  description: "warehouseCreate.post.description" as const,
  category: "inventory",
  subCategory: "Inventory: Warehouses",
  tags: [
    "tags.inventory" as const,
    "tags.warehouse" as const,
    "tags.create" as const,
  ],
  allowedRoles: [UserRole.ADMIN] as const,
  icon: "archive" as const,

  fields: customWidgetObject({
    usage: { request: "data", response: true } as const,
    render: InventoryWarehouseCreateWidget,
    children: {
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "warehouseCreate.post.companyId.label" as const,
        description: "warehouseCreate.post.companyId.description" as const,
        schema: z.uuid(),
        listEndpoint: async () =>
          (await import("@/companies/list/definition")).default.GET,
        labelField: "name",
      }),
      name: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "warehouseCreate.post.name.label" as const,
        description: "warehouseCreate.post.name.description" as const,
        placeholder: "warehouseCreate.post.name.placeholder" as const,
        schema: z.string().min(1).max(255),
      }),
      code: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "warehouseCreate.post.code.label" as const,
        description: "warehouseCreate.post.code.description" as const,
        placeholder: "warehouseCreate.post.code.placeholder" as const,
        schema: z.string().min(1).max(20),
      }),
      address: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "warehouseCreate.post.address.label" as const,
        description: "warehouseCreate.post.address.description" as const,
        placeholder: "warehouseCreate.post.address.placeholder" as const,
        schema: z.string().optional(),
      }),
      isActive: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "warehouseCreate.post.isActive.label" as const,
        description: "warehouseCreate.post.isActive.description" as const,
        schema: z.boolean().default(true),
      }),
      isDefault: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "warehouseCreate.post.isDefault.label" as const,
        description: "warehouseCreate.post.isDefault.description" as const,
        schema: z.boolean().default(false),
      }),

      result: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        usage: { response: true },
        children: {
          id: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "warehouseCreate.post.response.id" as const,
            hidden: true,
            schema: z.uuid(),
          }),
          companyId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "warehouseCreate.post.response.companyId" as const,
            hidden: true,
            schema: z.uuid(),
          }),
          name: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "warehouseCreate.post.response.name" as const,
            schema: z.string(),
          }),
          code: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "warehouseCreate.post.response.code" as const,
            schema: z.string(),
          }),
          isActive: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "warehouseCreate.post.response.isActive" as const,
            schema: z.boolean(),
          }),
          isDefault: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "warehouseCreate.post.response.isDefault" as const,
            schema: z.boolean(),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "warehouseCreate.post.errors.validation.title" as const,
      description:
        "warehouseCreate.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "warehouseCreate.post.errors.unauthorized.title" as const,
      description:
        "warehouseCreate.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "warehouseCreate.post.errors.forbidden.title" as const,
      description: "warehouseCreate.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "warehouseCreate.post.errors.conflict.title" as const,
      description: "warehouseCreate.post.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "warehouseCreate.post.errors.server.title" as const,
      description: "warehouseCreate.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "warehouseCreate.post.errors.unknown.title" as const,
      description: "warehouseCreate.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "warehouseCreate.post.errors.network.title" as const,
      description: "warehouseCreate.post.errors.network.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "warehouseCreate.post.errors.notFound.title" as const,
      description: "warehouseCreate.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "warehouseCreate.post.errors.unsavedChanges.title" as const,
      description:
        "warehouseCreate.post.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "warehouseCreate.post.success.title" as const,
    description: "warehouseCreate.post.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        companyId: "123e4567-e89b-12d3-a456-426614174000",
        name: "Main Warehouse",
        code: "WH-01",
        address: "123 Storage Lane",
        isActive: true,
        isDefault: true,
      },
    },
    responses: {
      default: {
        result: {
          id: "aabbccdd-e89b-12d3-a456-426614174001",
          companyId: "123e4567-e89b-12d3-a456-426614174000",
          name: "Main Warehouse",
          code: "WH-01",
          isActive: true,
          isDefault: true,
        },
      },
    },
  },
});

export type InventoryWarehouseCreateRequestOutput =
  typeof POST.types.RequestOutput;
export type InventoryWarehouseCreateResponseOutput =
  typeof POST.types.ResponseOutput;

const definitions = {
  POST,
} as const;
export default definitions;
