import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { CurrenciesArr } from "next-vibe/core/i18n/core/config";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "../i18n";

const RecurringCreateWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.RecurringCreateWidget })),
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

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["payment", "invoice", "recurring", "create"],
  aliases: ["recurring-invoice-create"],
  title: "recurring.createTitle" as const,
  titleShort: "recurring.createTitle" as const,
  description: "recurring.createDescription" as const,
  category: "payments",
  subCategory: "Transactions",
  icon: "plus" as const,
  tags: ["tags.payment" as const, "tags.recurring" as const],
  allowedRoles: [UserRole.ADMIN] as const,
  options: {
    mutationOptions: {
      onSuccess: async (ctx) => {
        const [{ apiClient }, list] = await Promise.all([
          import("next-vibe/unified-ui/hooks/store"),
          import("../list/definition"),
        ]);
        await apiClient.refetchEndpoint(list.default.GET, ctx.logger, {
          requestData: { companyId: ctx.requestData.companyId },
        });
      },
    },
  },
  fields: customWidgetObject({
    render: RecurringCreateWidgetLazy,
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
      title: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.title" as const,
        schema: z.string().min(1).max(160),
      }),
      customerName: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.customerName" as const,
        schema: z.string().min(1).max(160),
      }),
      customerEmail: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.EMAIL,
        label: "fields.customerEmail" as const,
        schema: z.email().optional(),
      }),
      frequency: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "fields.frequency" as const,
        options: [
          { value: "MONTHLY", label: "recurring.frequency.MONTHLY" as const },
          {
            value: "QUARTERLY",
            label: "recurring.frequency.QUARTERLY" as const,
          },
          { value: "YEARLY", label: "recurring.frequency.YEARLY" as const },
        ],
        schema: z.enum(["MONTHLY", "QUARTERLY", "YEARLY"]).default("MONTHLY"),
      }),
      nextRunDate: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.nextRunDate" as const,
        schema: z.iso.date(),
      }),
      endDate: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.endDate" as const,
        schema: z.iso.date().optional(),
      }),
      dueDays: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fields.dueDays" as const,
        schema: z.coerce.number().int().min(0).max(365).default(14),
      }),
      currency: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.currency" as const,
        schema: z.enum(CurrenciesArr).default("EUR"),
      }),
      lineDescription: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.lineDescription" as const,
        schema: z.string().min(1).max(300),
      }),
      lineQuantity: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fields.lineQuantity" as const,
        schema: z.coerce.number().positive().default(1),
      }),
      lineUnitPrice: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fields.lineUnitPrice" as const,
        schema: z.coerce.number().positive(),
      }),
      lineTaxRate: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fields.lineTaxRate" as const,
        schema: z.coerce.number().min(0).max(1).default(0.19),
      }),
      notes: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "fields.notes" as const,
        schema: z.string().max(1000).optional(),
      }),
      isEnabled: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.isEnabled" as const,
        schema: z.boolean().default(false),
      }),
      autoIssue: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.autoIssue" as const,
        schema: z.boolean().default(true),
      }),
      autoSendEmail: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.autoSendEmail" as const,
        schema: z.boolean().default(false),
      }),
      scheduleId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "fields.scheduleId" as const,
        schema: z.uuid(),
      }),
    },
  }),
  errorTypes,
  examples: {
    requests: {
      default: {
        companyId: "00000000-0000-4000-8000-000000000001",
        title: "Monthly retainer",
        customerName: "ACME GmbH",
        customerEmail: "ap@acme.example",
        frequency: "MONTHLY",
        nextRunDate: "2026-12-01",
        dueDays: 14,
        currency: "EUR",
        lineDescription: "Managed hosting & support",
        lineQuantity: 1,
        lineUnitPrice: 400,
        lineTaxRate: 0.19,
        isEnabled: false,
        autoIssue: true,
        autoSendEmail: false,
      },
    },
    responses: {
      default: { scheduleId: "00000000-0000-4000-8000-000000000010" },
    },
  },
  successTypes: {
    title: "recurring.createSuccess" as const,
    description: "recurring.createDescription" as const,
  },
});

export type RecurringCreateRequest = typeof POST.types.RequestOutput;
export type RecurringCreateResponse = typeof POST.types.ResponseOutput;

export default { POST };
