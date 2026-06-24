/**
 * Inventory Dashboard Endpoint Definition
 * GET — live KPI snapshot for stock health, transfers, and warehouses
 */

import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";
import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
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

import { scopedTranslation } from "../i18n";

const InventoryDashboardWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.InventoryDashboardWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["inventory", "dashboard"],
  aliases: ["inventory-dashboard"],
  title: "dashboard.get.title" as const,
  titleShort: "dashboard.get.titleShort" as const,
  description: "dashboard.get.description" as const,
  category: "inventory",
  subCategory: "Inventory: Stock",
  icon: "box" as const,
  tags: ["tags.inventory" as const, "tags.list" as const],
  allowedRoles: [UserRole.ADMIN] as const,
  defaultWebPinned: [UserRole.ADMIN] as const,

  fields: customWidgetObject({
    render: InventoryDashboardWidgetLazy,
    usage: { request: "data", response: true },
    children: {
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "dashboard.get.companyId.label" as const,
        description: "dashboard.get.companyId.description" as const,
        schema: z.string().uuid().optional(),
        listEndpoint: async () =>
          (await import("@/app/api/[locale]/companies/list/definition")).default
            .GET,
        labelField: "name",
      }),

      inStockCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "dashboard.get.response.inStockCount" as const,
        schema: z.number(),
      }),
      outOfStockCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "dashboard.get.response.outOfStockCount" as const,
        schema: z.number(),
      }),
      lowStockCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "dashboard.get.response.lowStockCount" as const,
        schema: z.number(),
      }),
      pendingTransferCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "dashboard.get.response.pendingTransferCount" as const,
        schema: z.number(),
      }),
      warehouseCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "dashboard.get.response.warehouseCount" as const,
        schema: z.number(),
      }),
    },
  }),

  options: {
    formOptions: {
      autoSubmit: true,
      debounceMs: 0,
    },
  },

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "dashboard.get.errors.validation.title" as const,
      description: "dashboard.get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "dashboard.get.errors.unauthorized.title" as const,
      description: "dashboard.get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "dashboard.get.errors.forbidden.title" as const,
      description: "dashboard.get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "dashboard.get.errors.conflict.title" as const,
      description: "dashboard.get.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "dashboard.get.errors.server.title" as const,
      description: "dashboard.get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "dashboard.get.errors.unknown.title" as const,
      description: "dashboard.get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "dashboard.get.errors.network.title" as const,
      description: "dashboard.get.errors.network.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "dashboard.get.errors.notFound.title" as const,
      description: "dashboard.get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "dashboard.get.errors.unsavedChanges.title" as const,
      description: "dashboard.get.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "dashboard.get.success.title" as const,
    description: "dashboard.get.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        companyId: undefined,
      },
    },
    responses: {
      default: {
        inStockCount: 42,
        outOfStockCount: 3,
        lowStockCount: 7,
        pendingTransferCount: 2,
        warehouseCount: 4,
      },
    },
  },
});

export type InventoryDashboardRequestOutput = typeof GET.types.RequestOutput;
export type InventoryDashboardResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
