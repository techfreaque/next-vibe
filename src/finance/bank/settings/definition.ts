import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
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

import { bankErrorTypes } from "../endpoint-errors";
import { scopedTranslation } from "../i18n";

const SettingsWidget = lazyWidget(() =>
  import("./widget").then((module) => ({ default: module.BankSettingsWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["finance", "bank", "settings"],
  aliases: ["bank-reconciliation-settings"],
  title: "adjustment.settings",
  titleShort: "adjustment.settings",
  description: "adjustment.settingsHint",
  category: "finance",
  subCategory: "Bank reconciliation",
  icon: "settings",
  tags: ["tags.bank", "tags.reconciliation"],
  allowedRoles: [UserRole.ADMIN],
  fields: customWidgetObject({
    render: SettingsWidget,
    usage: { request: "data", response: true },
    children: {
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "fields.company",
        schema: z.uuid(),
        listEndpoint: async () =>
          (await import("@/companies/list/definition")).default.GET,
        labelField: "name",
      }),
      accountId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "fields.account",
        schema: z.uuid(),
        listEndpoint: async () =>
          (await import("@/chart-of-accounts/account/list/definition")).default
            .GET,
        labelField: "name",
      }),
      bookedCurrency: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "statement.columns.currency",
        schema: z
          .string()
          .trim()
          .regex(/^[A-Z]{3}$/u),
      }),
      foreignCurrency: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "adjustment.foreignCurrency",
        schema: z
          .string()
          .trim()
          .regex(/^[A-Z]{3}$/u)
          .optional(),
      }),
      maxFxDifference: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "adjustment.absTolerance",
        schema: z
          .string()
          .trim()
          .regex(/^\d{1,10}(?:\.\d{1,4})?$/u)
          .optional(),
      }),
      maxFxBps: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "adjustment.bpsTolerance",
        schema: z.number().int().min(1).max(10_000).optional(),
      }),
      maxDateDistanceDays: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "adjustment.days",
        schema: z.number().int().min(0).max(90),
      }),
      gainAccountId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "adjustment.gainAccount",
        schema: z.uuid().optional(),
        listEndpoint: async () =>
          (await import("@/chart-of-accounts/account/list/definition")).default
            .GET,
        labelField: "name",
      }),
      lossAccountId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "adjustment.lossAccount",
        schema: z.uuid().optional(),
        listEndpoint: async () =>
          (await import("@/chart-of-accounts/account/list/definition")).default
            .GET,
        labelField: "name",
      }),
      feeAccountId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "adjustment.feeAccount",
        schema: z.uuid().optional(),
        listEndpoint: async () =>
          (await import("@/chart-of-accounts/account/list/definition")).default
            .GET,
        labelField: "name",
      }),
      saved: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "adjustment.settingsSaved",
        schema: z.boolean(),
      }),
    },
  }),
  errorTypes: bankErrorTypes,
  successTypes: {
    title: "adjustment.settingsSaved",
    description: "adjustment.settingsHint",
  },
  examples: {
    requests: {
      default: {
        companyId: "00000000-0000-4000-8000-000000000001",
        accountId: "00000000-0000-4000-8000-000000000002",
        bookedCurrency: "EUR",
        maxDateDistanceDays: 7,
      },
    },
    responses: { default: { saved: true } },
  },
});

export type BankSettingsInput = typeof POST.types.RequestOutput;
export type BankSettingsOutput = typeof POST.types.ResponseOutput;
export default { POST };
