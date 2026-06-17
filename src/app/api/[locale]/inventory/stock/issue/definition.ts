/**
 * Inventory Stock Issue API Route Definition
 */

import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";
import { z } from "zod";

import warehouseListDef from "@/app/api/[locale]/inventory/warehouse/list/definition";
import productCatalogListDef from "@/app/api/[locale]/products/catalog/list/definition";
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

const InventoryStockIssueWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.InventoryStockIssueWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["inventory", "stock", "issue"],
  title: "stockIssue.post.title" as const,
  titleShort: "stockIssue.post.titleShort" as const,
  description: "stockIssue.post.description" as const,
  category: "inventory" as const,
  subCategory: "Inventory: Stock" as const,
  tags: [
    "tags.inventory" as const,
    "tags.stock" as const,
    "tags.issue" as const,
  ],
  allowedRoles: [UserRole.ADMIN] as const,
  icon: "minus" as const,

  fields: customWidgetObject({
    usage: { request: "data", response: true } as const,
    render: InventoryStockIssueWidget,
    children: {
      warehouseId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "stockIssue.post.warehouseId.label" as const,
        description: "stockIssue.post.warehouseId.description" as const,
        schema: z.uuid(),
        listEndpoint: warehouseListDef.GET,
        labelField: "name",
      }),
      productId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "stockIssue.post.productId.label" as const,
        description: "stockIssue.post.productId.description" as const,
        schema: z.uuid(),
        listEndpoint: productCatalogListDef.GET,
        labelField: "name",
      }),
      quantity: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "stockIssue.post.quantity.label" as const,
        description: "stockIssue.post.quantity.description" as const,
        schema: z.number().positive(),
      }),
      reference: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "stockIssue.post.reference.label" as const,
        description: "stockIssue.post.reference.description" as const,
        schema: z.string().max(100).optional(),
      }),
      unitCost: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "stockIssue.post.unitCost.label" as const,
        description: "stockIssue.post.unitCost.description" as const,
        schema: z.number().nonnegative().optional(),
      }),

      result: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        usage: { response: true },
        children: {
          movementId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "stockIssue.post.response.movementId" as const,
            hidden: true,
            schema: z.uuid(),
          }),
          warehouseId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "stockIssue.post.response.warehouseId" as const,
            hidden: true,
            schema: z.uuid(),
          }),
          productId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "stockIssue.post.response.productId" as const,
            schema: z.uuid(),
          }),
          quantityOnHand: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "stockIssue.post.response.quantityOnHand" as const,
            schema: z.number(),
          }),
          quantityAvailable: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "stockIssue.post.response.quantityAvailable" as const,
            schema: z.number(),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "stockIssue.post.errors.validation.title" as const,
      description: "stockIssue.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "stockIssue.post.errors.unauthorized.title" as const,
      description: "stockIssue.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "stockIssue.post.errors.forbidden.title" as const,
      description: "stockIssue.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "stockIssue.post.errors.conflict.title" as const,
      description: "stockIssue.post.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "stockIssue.post.errors.server.title" as const,
      description: "stockIssue.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "stockIssue.post.errors.unknown.title" as const,
      description: "stockIssue.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "stockIssue.post.errors.network.title" as const,
      description: "stockIssue.post.errors.network.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "stockIssue.post.errors.notFound.title" as const,
      description: "stockIssue.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "stockIssue.post.errors.unsavedChanges.title" as const,
      description: "stockIssue.post.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "stockIssue.post.success.title" as const,
    description: "stockIssue.post.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        warehouseId: "aabbccdd-e89b-12d3-a456-426614174001",
        productId: "11223344-e89b-12d3-a456-426614174001",
        quantity: 10,
        reference: "WO-2024-001",
      },
    },
    responses: {
      default: {
        result: {
          movementId: "ccddee11-e89b-12d3-a456-426614174001",
          warehouseId: "aabbccdd-e89b-12d3-a456-426614174001",
          productId: "11223344-e89b-12d3-a456-426614174001",
          quantityOnHand: 90,
          quantityAvailable: 80,
        },
      },
    },
  },
});

export type InventoryStockIssueRequestOutput = typeof POST.types.RequestOutput;
export type InventoryStockIssueResponseOutput =
  typeof POST.types.ResponseOutput;

const definitions = {
  POST,
} as const;
export default definitions;
