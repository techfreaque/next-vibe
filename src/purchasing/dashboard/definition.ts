/**
 * Purchasing Dashboard Endpoint Definition
 * GET — live KPI snapshot for purchase orders and vendors
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
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { scopedTranslation } from "../i18n";

const PurchasingDashboardWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.PurchasingDashboardWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["purchasing", "dashboard"],
  aliases: ["purchasing-dashboard"],
  title: "dashboard.get.title" as const,
  titleShort: "dashboard.get.titleShort" as const,
  description: "dashboard.get.description" as const,
  category: "purchasing",
  subCategory: "Purchasing: Orders",
  icon: "shopping-bag" as const,
  tags: ["tags.purchasing" as const, "tags.list" as const],
  allowedRoles: [UserRole.ADMIN] as const,
  defaultWebPinned: [UserRole.ADMIN] as const,

  fields: customWidgetObject({
    render: PurchasingDashboardWidgetLazy,
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

      draftCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "dashboard.get.response.draftCount" as const,
        schema: z.number(),
      }),
      confirmedCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "dashboard.get.response.confirmedCount" as const,
        schema: z.number(),
      }),
      awaitingReceiptCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "dashboard.get.response.awaitingReceiptCount" as const,
        schema: z.number(),
      }),
      activeVendorCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "dashboard.get.response.activeVendorCount" as const,
        schema: z.number(),
      }),
      dueThisWeekCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "dashboard.get.response.dueThisWeekCount" as const,
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
        draftCount: 3,
        confirmedCount: 5,
        awaitingReceiptCount: 2,
        activeVendorCount: 12,
        dueThisWeekCount: 1,
      },
    },
  },
});

export type PurchasingDashboardRequestOutput = typeof GET.types.RequestOutput;
export type PurchasingDashboardResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
