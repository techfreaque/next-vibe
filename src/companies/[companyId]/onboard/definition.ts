/**
 * Company Onboarding Endpoint Definition
 * POST — atomic company setup: CoA + tax rates + default cash/bank accounts
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  requestField,
  requestUrlPathParamsField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "./i18n";

const CompanyOnboardWidget = lazyWidget(() =>
  import("./widget").then((module) => ({
    default: module.CompanyOnboardWidget,
  })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["companies", "[companyId]", "onboard"],
  title: "post.title" as const,
  titleShort: "post.titleShort" as const,
  description: "post.description" as const,
  category: "companies",
  subCategory: "Company Management",
  icon: "building" as const,
  tags: [
    "tags.companies" as const,
    "tags.onboard" as const,
    "tags.setup" as const,
  ],
  allowedRoles: [UserRole.ADMIN] as const,

  fields: customWidgetObject({
    render: CompanyOnboardWidget,
    usage: { request: "data&urlPathParams", response: true },
    children: {
      // URL PATH PARAMS
      companyId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "post.companyId.label" as const,
        description: "post.companyId.description" as const,
        schema: z.uuid(),
        listEndpoint: async () =>
          (await import("@/companies/list/definition")).default.GET,
        labelField: "name",
      }),

      // REQUEST FIELDS
      country: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.country.label" as const,
        description: "post.country.description" as const,
        placeholder: "post.country.placeholder" as const,
        columns: 12,
        options: [
          { value: "AT", label: "enums.country.AT" as const },
          { value: "DE", label: "enums.country.DE" as const },
          { value: "XX", label: "enums.country.XX" as const },
        ],
        schema: z.enum(["AT", "DE", "XX"]),
      }),

      openFirstPeriod: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.period.open",
        description: "post.period.description",
        schema: z.boolean().optional(),
      }),
      periodName: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.period.name",
        schema: z.string().trim().min(1).max(100).optional(),
      }),
      periodStart: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "post.period.start",
        schema: z.iso.date().optional(),
      }),
      periodEnd: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "post.period.end",
        schema: z.iso.date().optional(),
      }),

      // RESPONSE FIELDS
      hasPeriods: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.period.title",
        schema: z.boolean().optional(),
      }),
      periodCreated: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.period.open",
        schema: z.boolean().optional(),
      }),
      periodNameOut: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.period.name",
        schema: z.string().optional(),
      }),
      companyIdOut: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.companyId.label",
        schema: z.uuid().optional(),
      }),

      companyName: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.companyId.label",
        schema: z.string().optional(),
      }),

      accountsCreated: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.accountsCreated" as const,
        schema: z.number(),
      }),

      accountsSkipped: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.accountsSkipped" as const,
        schema: z.number(),
      }),

      taxRatesCreated: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.taxRatesCreated" as const,
        schema: z.number(),
      }),

      cashAccountId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.cashAccountId" as const,
        schema: z.uuid().nullable(),
      }),

      bankAccountId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.bankAccountId" as const,
        schema: z.uuid().nullable(),
      }),

      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.success" as const,
        schema: z.boolean(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title" as const,
      description: "post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title" as const,
      description: "post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title" as const,
      description: "post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title" as const,
      description: "post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title" as const,
      description: "post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title" as const,
      description: "post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title" as const,
      description: "post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title" as const,
      description: "post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title" as const,
      description: "post.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "post.success.title" as const,
    description: "post.success.description" as const,
  },

  examples: {
    urlPathParams: {
      default: { companyId: "00000000-0000-0000-0000-000000000001" },
    },
    requests: {
      default: { country: "DE" },
    },
    responses: {
      default: {
        accountsCreated: 42,
        accountsSkipped: 0,
        taxRatesCreated: 3,
        cashAccountId: "111e4567-e89b-12d3-a456-426614174000",
        bankAccountId: "222e4567-e89b-12d3-a456-426614174000",
        success: true,
      },
    },
  },
});

export type CompanyOnboardUrlPathParams = typeof POST.types.UrlVariablesOutput;
export type CompanyOnboardRequestOutput = typeof POST.types.RequestOutput;
export type CompanyOnboardResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
