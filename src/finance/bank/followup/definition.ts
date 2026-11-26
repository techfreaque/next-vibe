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

const FollowupWidget = lazyWidget(() =>
  import("./widget").then((module) => ({ default: module.BankFollowupWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["finance", "bank", "followup"],
  aliases: ["bank-statement-followup"],
  title: "adjustment.followup",
  titleShort: "adjustment.followup",
  description: "adjustment.followupHint",
  category: "finance",
  subCategory: "Bank reconciliation",
  icon: "receipt",
  tags: ["tags.bank", "tags.reconciliation"],
  allowedRoles: [UserRole.ADMIN],
  fields: customWidgetObject({
    render: FollowupWidget,
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
      lineId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.line",
        schema: z.uuid(),
      }),
      action: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "adjustment.followup",
        schema: z.enum(["release", "draft"]),
        options: [
          { value: "release", label: "adjustment.release" },
          { value: "draft", label: "adjustment.draft" },
        ],
      }),
      vendorId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "adjustment.vendor",
        schema: z.uuid().optional(),
        listEndpoint: async () =>
          (await import("@/purchasing/vendor/list/definition")).default.GET,
        labelField: "name",
      }),
      expenseAccountId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "adjustment.expenseAccount",
        schema: z.uuid().optional(),
        listEndpoint: async () =>
          (await import("@/chart-of-accounts/account/list/definition")).default
            .GET,
        labelField: "name",
      }),
      expectedJournalLineId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.journalLine",
        schema: z.uuid().optional(),
      }),
      expectedMatchedAt: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.matchedAt",
        schema: z.iso.datetime().optional(),
      }),
      reverseDate: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "adjustment.reversalDate",
        schema: z.iso.date().optional(),
      }),
      reason: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "adjustment.reason",
        schema: z.string().trim().min(1).max(300).optional(),
      }),
      confirm: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.confirm",
        schema: z.boolean().default(false),
      }),
      released: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "adjustment.release",
        schema: z.boolean(),
      }),
      billId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "adjustment.draft",
        schema: z.uuid().nullable(),
      }),
      reversalId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "adjustment.journal",
        schema: z.uuid().nullable(),
      }),
    },
  }),
  errorTypes: bankErrorTypes,
  successTypes: {
    title: "adjustment.followup",
    description: "adjustment.followupHint",
  },
  examples: {
    requests: {
      default: {
        companyId: "00000000-0000-4000-8000-000000000001",
        lineId: "00000000-0000-4000-8000-000000000002",
        action: "draft",
        confirm: false,
      },
    },
    responses: { default: { released: false, billId: null, reversalId: null } },
  },
});

export type BankFollowupInput = typeof POST.types.RequestOutput;
export type BankFollowupOutput = typeof POST.types.ResponseOutput;
export default { POST };
