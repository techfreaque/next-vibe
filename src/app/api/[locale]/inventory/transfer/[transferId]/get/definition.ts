/**
 * Inventory Transfer Get API Route Definition
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
  requestField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";

import { scopedTranslation } from "../../../i18n";
import listDef0 from "@/app/api/[locale]/inventory/transfer/list/definition";

const InventoryTransferGetWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.InventoryTransferGetWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["inventory", "transfer", "[transferId]", "get"],
  title: "transferGet.get.title" as const,
  titleShort: "transferGet.get.titleShort" as const,
  description: "transferGet.get.description" as const,
  category: "inventory" as const,
  subCategory: "Inventory: Transfers" as const,
  tags: [
    "tags.inventory" as const,
    "tags.transfer" as const,
    "tags.get" as const,
  ],
  allowedRoles: [UserRole.ADMIN] as const,
  icon: "refresh-cw" as const,

  fields: customWidgetObject({
    usage: { request: "data", response: true } as const,
    render: InventoryTransferGetWidget,
    children: {
      transferId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "transferGet.get.transferId.label" as const,
        description: "transferGet.get.transferId.description" as const,
        schema: z.uuid(),
        urlPathParam: true,
        listEndpoint: listDef0.GET,
        labelField: "transferNumber",
      }),

      result: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        usage: { response: true },
        children: {
          id: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "transferGet.get.response.id" as const,
            hidden: true,
            schema: z.uuid(),
          }),
          companyId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "transferGet.get.response.companyId" as const,
            hidden: true,
            schema: z.uuid(),
          }),
          fromWarehouseId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "transferGet.get.response.fromWarehouseId" as const,
            hidden: true,
            schema: z.uuid(),
          }),
          fromWarehouseName: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "transferGet.get.response.fromWarehouseName" as const,
            schema: z.string(),
          }),
          toWarehouseId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "transferGet.get.response.toWarehouseId" as const,
            hidden: true,
            schema: z.uuid(),
          }),
          toWarehouseName: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "transferGet.get.response.toWarehouseName" as const,
            schema: z.string(),
          }),
          status: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "transferGet.get.response.status" as const,
            schema: z.string(),
          }),
          reference: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "transferGet.get.response.reference" as const,
            schema: z.string().nullable(),
          }),
          notes: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "transferGet.get.response.notes" as const,
            schema: z.string().nullable(),
          }),
          createdAt: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "transferGet.get.response.createdAt" as const,
            fieldType: FieldDataType.DATETIME,
            schema: z.coerce.date(),
          }),
          completedAt: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "transferGet.get.response.completedAt" as const,
            fieldType: FieldDataType.DATETIME,
            schema: z.coerce.date().nullable(),
          }),
          items: responseArrayField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            child: objectField(scopedTranslation, {
              type: WidgetType.CONTAINER,
              layoutType: LayoutType.GRID_2_COLUMNS,
              usage: { response: true },
              children: {
                id: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "transferGet.get.response.id" as const,
                  hidden: true,
                  schema: z.uuid(),
                }),
                productId: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "transferGet.get.response.productId" as const,
                  hidden: true,
                  schema: z.uuid(),
                }),
                productName: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "transferGet.get.response.productName" as const,
                  schema: z.string(),
                }),
                quantityRequested: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content:
                    "transferGet.get.response.quantityRequested" as const,
                  schema: z.number(),
                }),
                quantityReceived: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "transferGet.get.response.quantityReceived" as const,
                  schema: z.number(),
                }),
              },
            }),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "transferGet.get.errors.validation.title" as const,
      description: "transferGet.get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "transferGet.get.errors.unauthorized.title" as const,
      description: "transferGet.get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "transferGet.get.errors.forbidden.title" as const,
      description: "transferGet.get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "transferGet.get.errors.conflict.title" as const,
      description: "transferGet.get.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "transferGet.get.errors.server.title" as const,
      description: "transferGet.get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "transferGet.get.errors.unknown.title" as const,
      description: "transferGet.get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "transferGet.get.errors.network.title" as const,
      description: "transferGet.get.errors.network.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "transferGet.get.errors.notFound.title" as const,
      description: "transferGet.get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "transferGet.get.errors.unsavedChanges.title" as const,
      description: "transferGet.get.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "transferGet.get.success.title" as const,
    description: "transferGet.get.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        transferId: "ddee1122-e89b-12d3-a456-426614174001",
      },
    },
    responses: {
      default: {
        result: {
          id: "ddee1122-e89b-12d3-a456-426614174001",
          companyId: "123e4567-e89b-12d3-a456-426614174000",
          fromWarehouseId: "aabbccdd-e89b-12d3-a456-426614174001",
          fromWarehouseName: "Main Warehouse",
          toWarehouseId: "aabbccdd-e89b-12d3-a456-426614174002",
          toWarehouseName: "Branch Office",
          status: "DRAFT",
          reference: "TR-2024-001",
          notes: null,
          createdAt: new Date("2024-01-01T00:00:00.000Z"),
          completedAt: null,
          items: [
            {
              id: "eeff2233-e89b-12d3-a456-426614174001",
              productId: "11223344-e89b-12d3-a456-426614174001",
              productName: "Widget A",
              quantityRequested: 50,
              quantityReceived: 0,
            },
          ],
        },
      },
    },
  },
});

export type InventoryTransferGetRequestOutput = typeof GET.types.RequestOutput;
export type InventoryTransferGetResponseOutput =
  typeof GET.types.ResponseOutput;

const definitions = {
  GET,
} as const;
export default definitions;
