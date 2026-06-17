/**
 * Chart of Accounts — Accounting Dashboard Endpoint Definition
 * GET — summary stats and navigation hub for the accounting module
 */

import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";
import { z } from "zod";

import listDef0 from "@/app/api/[locale]/companies/list/definition";
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

import { scopedTranslation } from "./i18n";

const AccountingDashboardWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.AccountingDashboardWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["chart-of-accounts", "dashboard"],
  aliases: ["accounting-dashboard"],
  allowedRoles: [UserRole.ADMIN, UserRole.PARTNER_ADMIN] as const,
  defaultWebPinned: [UserRole.ADMIN, UserRole.PARTNER_ADMIN] as const,

  title: "dashboard.title" as const,
  titleShort: "dashboard.titleShort" as const,
  description: "dashboard.description" as const,
  icon: "bar-chart-2",
  category: "accounting",
  subCategory: "Accounting",
  tags: ["tag" as const],

  fields: customWidgetObject({
    usage: { request: "data", response: true },
    render: AccountingDashboardWidget,
    children: {
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "dashboard.companyId.label" as const,
        description: "dashboard.companyId.description" as const,
        schema: z.string().uuid().optional(),
        listEndpoint: listDef0.GET,
        labelField: "name",
      }),

      // Response fields
      accountCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "dashboard.response.accountCount" as const,
        schema: z.number(),
      }),
      draftEntryCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "dashboard.response.draftEntryCount" as const,
        schema: z.number(),
      }),
      postedThisMonthCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "dashboard.response.postedThisMonthCount" as const,
        schema: z.number(),
      }),
      hasSetup: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "dashboard.response.hasSetup" as const,
        schema: z.boolean(),
      }),
      currency: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "dashboard.response.currency" as const,
        schema: z.string(),
      }),
      currentPeriodId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "dashboard.response.currentPeriod" as const,
        schema: z.string().nullable(),
      }),
      currentPeriodName: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "dashboard.response.currentPeriod" as const,
        schema: z.string().nullable(),
      }),
      currentPeriodStatus: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "dashboard.response.currentPeriod" as const,
        schema: z.string().nullable(),
      }),
      currentPeriodStartDate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "dashboard.response.currentPeriod" as const,
        schema: z.string().nullable(),
      }),
      currentPeriodEndDate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "dashboard.response.currentPeriod" as const,
        schema: z.string().nullable(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "dashboard.errors.unauthorized.title" as const,
      description: "dashboard.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "dashboard.errors.validation.title" as const,
      description: "dashboard.errors.validation.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "dashboard.errors.forbidden.title" as const,
      description: "dashboard.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "dashboard.errors.server.title" as const,
      description: "dashboard.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "dashboard.errors.unknown.title" as const,
      description: "dashboard.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "dashboard.errors.conflict.title" as const,
      description: "dashboard.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "dashboard.errors.network.title" as const,
      description: "dashboard.errors.network.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "dashboard.errors.notFound.title" as const,
      description: "dashboard.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "dashboard.errors.unsavedChanges.title" as const,
      description: "dashboard.errors.unsavedChanges.description" as const,
    },
  },

  options: {
    formOptions: {
      autoSubmit: true,
      debounceMs: 300,
    },
  },

  successTypes: {
    title: "dashboard.success.title" as const,
    description: "dashboard.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        companyId: undefined,
      },
    },
    responses: {
      default: {
        currentPeriodId: null,
        currentPeriodName: null,
        currentPeriodStatus: null,
        currentPeriodStartDate: null,
        currentPeriodEndDate: null,
        accountCount: 0,
        draftEntryCount: 0,
        postedThisMonthCount: 0,
        hasSetup: false,
        currency: "EUR",
      },
    },
  },
});

export type AccountingDashboardRequestInput = typeof GET.types.RequestInput;
export type AccountingDashboardRequestOutput = typeof GET.types.RequestOutput;
export type AccountingDashboardResponseInput = typeof GET.types.ResponseInput;
export type AccountingDashboardResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
