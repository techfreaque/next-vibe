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
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "../invoice/recurring/i18n";

const CompanyPaymentSettingsWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.CompanyPaymentSettingsWidget,
  })),
);

const errorTypes = {
  [EndpointErrorTypes.VALIDATION_FAILED]: {
    title: "errors.validation.title" as const,
    description: "errors.validation.description" as const,
  },
  [EndpointErrorTypes.NETWORK_ERROR]: {
    title: "errors.network.title" as const,
    description: "errors.network.description" as const,
  },
  [EndpointErrorTypes.UNAUTHORIZED]: {
    title: "errors.unauthorized.title" as const,
    description: "errors.unauthorized.description" as const,
  },
  [EndpointErrorTypes.FORBIDDEN]: {
    title: "errors.forbidden.title" as const,
    description: "errors.forbidden.description" as const,
  },
  [EndpointErrorTypes.NOT_FOUND]: {
    title: "errors.notFound.title" as const,
    description: "errors.notFound.description" as const,
  },
  [EndpointErrorTypes.SERVER_ERROR]: {
    title: "errors.server.title" as const,
    description: "errors.server.description" as const,
  },
  [EndpointErrorTypes.UNKNOWN_ERROR]: {
    title: "errors.unknown.title" as const,
    description: "errors.unknown.description" as const,
  },
  [EndpointErrorTypes.UNSAVED_CHANGES]: {
    title: "errors.unsavedChanges.title" as const,
    description: "errors.unsavedChanges.description" as const,
  },
  [EndpointErrorTypes.CONFLICT]: {
    title: "errors.conflict.title" as const,
    description: "errors.conflict.description" as const,
  },
} as const;

const settingsShape = {
  bankAccountHolder: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    label: "settings.bankAccountHolder" as const,
    schema: z.string().nullable(),
  }),
  bankIban: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    label: "settings.bankIban" as const,
    schema: z.string().nullable(),
  }),
  bankBic: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    label: "settings.bankBic" as const,
    schema: z.string().nullable(),
  }),
  stripeEnabled: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    label: "settings.stripeEnabled" as const,
    schema: z.boolean(),
  }),
  stripeAccountLabel: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    label: "settings.stripeAccountLabel" as const,
    schema: z.string().nullable(),
  }),
  stripeClearingAccountId: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    label: "settings.stripeClearingAccountId" as const,
    schema: z.uuid().nullable(),
  }),
  autoBookStripePayments: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    label: "settings.autoBookStripePayments" as const,
    schema: z.boolean(),
  }),
  recurringInvoicesEnabled: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    label: "settings.recurringInvoicesEnabled" as const,
    schema: z.boolean(),
  }),
};

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["payment", "company-settings"],
  aliases: ["company-payment-settings"],
  title: "settings.title" as const,
  titleShort: "settings.title" as const,
  description: "settings.description" as const,
  category: "payments",
  subCategory: "Transactions",
  icon: "settings" as const,
  tags: ["tags.payment" as const, "tags.settings" as const],
  allowedRoles: [UserRole.ADMIN] as const,
  fields: customWidgetObject({
    render: CompanyPaymentSettingsWidgetLazy,
    usage: { request: "data", response: true },
    children: {
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "fields.companyId" as const,
        includeInCacheKey: true,
        schema: z.uuid(),
        listEndpoint: async () =>
          (await import("@/companies/list/definition")).default.GET,
        labelField: "name",
      }),
      ...settingsShape,
    },
  }),
  errorTypes,
  examples: {
    requests: {
      default: { companyId: "00000000-0000-4000-8000-000000000001" },
    },
    responses: {
      default: {
        bankAccountHolder: "Muster GmbH",
        bankIban: "DE89370400440532013000",
        bankBic: "COBADEFFXXX",
        stripeEnabled: false,
        stripeAccountLabel: null,
        stripeClearingAccountId: null,
        autoBookStripePayments: true,
        recurringInvoicesEnabled: false,
      },
    },
  },
  successTypes: {
    title: "settings.loadSuccess" as const,
    description: "settings.description" as const,
  },
});

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["payment", "company-settings"],
  aliases: ["company-payment-settings-save"],
  title: "settings.saveTitle" as const,
  titleShort: "settings.saveTitle" as const,
  description: "settings.description" as const,
  category: "payments",
  subCategory: "Transactions",
  icon: "save" as const,
  tags: ["tags.payment" as const, "tags.settings" as const],
  allowedRoles: [UserRole.ADMIN] as const,
  options: {
    mutationOptions: {
      onSuccess: async (ctx) => {
        const { apiClient } = await import("next-vibe/unified-ui/hooks/store");
        await apiClient.refetchEndpoint(GET, ctx.logger, {
          requestData: { companyId: ctx.requestData.companyId },
        });
      },
    },
  },
  fields: customWidgetObject({
    render: CompanyPaymentSettingsWidgetLazy,
    usage: { request: "data", response: true },
    children: {
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "fields.companyId" as const,
        schema: z.uuid(),
        listEndpoint: async () =>
          (await import("@/companies/list/definition")).default.GET,
        labelField: "name",
      }),
      bankAccountHolder: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "settings.bankAccountHolder" as const,
        schema: z.string().max(140).nullable().optional(),
      }),
      bankIban: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "settings.bankIban" as const,
        schema: z.string().max(50).nullable().optional(),
      }),
      bankBic: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "settings.bankBic" as const,
        schema: z.string().max(20).nullable().optional(),
      }),
      stripeEnabled: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "settings.stripeEnabled" as const,
        schema: z.boolean().default(false),
      }),
      stripeAccountLabel: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "settings.stripeAccountLabel" as const,
        schema: z.string().max(120).nullable().optional(),
      }),
      stripeClearingAccountId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "settings.stripeClearingAccountId" as const,
        schema: z.uuid().nullable().optional(),
        listEndpoint: async () =>
          (await import("@/chart-of-accounts/account/list/definition")).default
            .GET,
        labelField: "name",
      }),
      autoBookStripePayments: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "settings.autoBookStripePayments" as const,
        schema: z.boolean().default(true),
      }),
      recurringInvoicesEnabled: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "settings.recurringInvoicesEnabled" as const,
        schema: z.boolean().default(false),
      }),
      saved: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "settings.saveSuccess" as const,
        schema: z.boolean(),
      }),
    },
  }),
  errorTypes,
  examples: {
    requests: {
      default: {
        companyId: "00000000-0000-4000-8000-000000000001",
        bankAccountHolder: "Muster GmbH",
        bankIban: "DE89370400440532013000",
        bankBic: "COBADEFFXXX",
        stripeEnabled: true,
        autoBookStripePayments: true,
        recurringInvoicesEnabled: false,
      },
    },
    responses: {
      default: { saved: true },
    },
  },
  successTypes: {
    title: "settings.saveSuccess" as const,
    description: "settings.description" as const,
  },
});

export type CompanyPaymentSettingsGetRequest = typeof GET.types.RequestOutput;
export type CompanyPaymentSettingsGetResponse = typeof GET.types.ResponseOutput;
export type CompanyPaymentSettingsPostRequest = typeof POST.types.RequestOutput;
export type CompanyPaymentSettingsPostResponse =
  typeof POST.types.ResponseOutput;

export default { GET, POST };
