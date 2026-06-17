/**
 * Inventory Transfer List API Route Definition
 */

import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";
import { z } from "zod";

import companiesListDef from "@/app/api/[locale]/companies/list/definition";
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

import { scopedTranslation } from "../../i18n";
import { INVENTORY_TRANSFERS_ALIAS } from "./constants";

const InventoryTransferListWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.InventoryTransferListWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["inventory", "transfer", "list"],
  aliases: [INVENTORY_TRANSFERS_ALIAS] as const,
  title: "transferList.get.title" as const,
  titleShort: "transferList.get.titleShort" as const,
  description: "transferList.get.description" as const,
  category: "inventory" as const,
  subCategory: "Inventory: Transfers" as const,
  tags: [
    "tags.inventory" as const,
    "tags.transfer" as const,
    "tags.list" as const,
  ],
  allowedRoles: [UserRole.ADMIN] as const,
  defaultWebPinned: [UserRole.ADMIN] as const,
  icon: "refresh-cw" as const,

  fields: customWidgetObject({
    usage: { request: "data", response: true } as const,
    render: InventoryTransferListWidget,
    children: {
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "transferList.get.companyId.label" as const,
        description: "transferList.get.companyId.description" as const,
        schema: z.uuid().optional(),
        listEndpoint: companiesListDef.GET,
        labelField: "name",
      }),

      transfers: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID_2_COLUMNS,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "transferList.get.response.id" as const,
              hidden: true,
              schema: z.uuid(),
            }),
            fromWarehouseId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "transferList.get.response.fromWarehouseId" as const,
              hidden: true,
              schema: z.uuid(),
            }),
            fromWarehouseName: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "transferList.get.response.fromWarehouseName" as const,
              schema: z.string(),
            }),
            toWarehouseId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "transferList.get.response.toWarehouseId" as const,
              hidden: true,
              schema: z.uuid(),
            }),
            toWarehouseName: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "transferList.get.response.toWarehouseName" as const,
              schema: z.string(),
            }),
            status: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "transferList.get.response.status" as const,
              schema: z.string(),
            }),
            reference: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "transferList.get.response.reference" as const,
              schema: z.string().nullable(),
            }),
            createdAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "transferList.get.response.createdAt" as const,
              fieldType: FieldDataType.DATETIME,
              schema: z.coerce.date(),
            }),
            completedAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "transferList.get.response.completedAt" as const,
              fieldType: FieldDataType.DATETIME,
              schema: z.coerce.date().nullable(),
            }),
          },
        }),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "transferList.get.errors.validation.title" as const,
      description: "transferList.get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "transferList.get.errors.unauthorized.title" as const,
      description: "transferList.get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "transferList.get.errors.forbidden.title" as const,
      description: "transferList.get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "transferList.get.errors.conflict.title" as const,
      description: "transferList.get.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "transferList.get.errors.server.title" as const,
      description: "transferList.get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "transferList.get.errors.unknown.title" as const,
      description: "transferList.get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "transferList.get.errors.network.title" as const,
      description: "transferList.get.errors.network.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "transferList.get.errors.notFound.title" as const,
      description: "transferList.get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "transferList.get.errors.unsavedChanges.title" as const,
      description:
        "transferList.get.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "transferList.get.success.title" as const,
    description: "transferList.get.success.description" as const,
  },

  examples: {
    requests: {
      default: {},
    },
    responses: {
      default: {
        transfers: [
          {
            id: "ddee1122-e89b-12d3-a456-426614174001",
            fromWarehouseId: "aabbccdd-e89b-12d3-a456-426614174001",
            fromWarehouseName: "Main Warehouse",
            toWarehouseId: "aabbccdd-e89b-12d3-a456-426614174002",
            toWarehouseName: "Secondary Warehouse",
            status: "DRAFT",
            reference: "TR-2024-001",
            createdAt: new Date("2024-01-01T00:00:00.000Z"),
            completedAt: null,
          },
        ],
      },
    },
  },
});

export type InventoryTransferListGetRequestOutput =
  typeof GET.types.RequestOutput;
export type InventoryTransferListGetResponseOutput =
  typeof GET.types.ResponseOutput;

const definitions = {
  GET,
} as const;
export default definitions;
