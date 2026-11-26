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

import { JournalEntryStatusDB } from "@/chart-of-accounts/enum";
import { BillStatusDB } from "@/payment/enum";

import { FinanceSourceOptions } from "../enum";
import { financeErrorTypes } from "../error-types";
import { scopedTranslation } from "../i18n";
import {
  areaValues,
  evidenceCurrencies,
  evidenceMonth,
  evidenceProvider,
  operationValues,
} from "./rules";

const ListWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.SupplierEvidenceListWidget })),
);
const RecordWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.SupplierEvidenceRecordWidget })),
);

const companyId = requestField(scopedTranslation, {
  type: WidgetType.FORM_FIELD,
  fieldType: FieldDataType.ENTITY_PICKER,
  label: "suppliers.company",
  schema: z.uuid(),
  listEndpoint: async () =>
    (await import("@/companies/list/definition")).default.GET,
  labelField: "name",
});

const common = {
  scopedTranslation,
  path: ["finance", "supplier-evidence"],
  category: "finance",
  subCategory: "Monitoring",
  allowedRoles: [UserRole.ADMIN],
  tags: ["tags.finance"],
  errorTypes: financeErrorTypes,
  successTypes: { title: "success.title", description: "success.description" },
} as const;

const resultSchema = z.object({
  outcome: z.enum([
    "preview",
    "bound",
    "bill",
    "linked",
    "posted",
    "replayed",
    "review",
  ]),
  id: z.uuid().nullable(),
  billId: z.uuid().nullable(),
  journalEntryId: z.uuid().nullable(),
  grossAmount: z.string().nullable(),
  currency: z.string().nullable(),
  date: z.string().nullable(),
});

const { GET } = createEndpoint({
  ...common,
  method: Methods.GET,
  aliases: ["supplier-evidence"],
  title: "suppliers.title",
  titleShort: "suppliers.title",
  description: "suppliers.description",
  icon: "building",
  fields: customWidgetObject({
    render: ListWidget,
    usage: { request: "data", response: true },
    children: {
      companyId,
      month: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "suppliers.month",
        schema: evidenceMonth.optional(),
      }),
      companyName: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "suppliers.company",
        schema: z.string().optional(),
      }),
      monthly: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "suppliers.monthly",
        schema: z.object({
          month: evidenceMonth,
          currency: z.string(),
          providerReview: z.array(
            z.object({
              provider: evidenceProvider,
              counterUsd: z.number().nullable(),
              estimatedUsd: z.number().nullable(),
              unclassifiedUsd: z.number().nullable(),
              readings: z.number(),
              missingReadings: z.number(),
              receipts: z.array(
                z.object({
                  currency: z.string(),
                  savedGross: z.string(),
                  count: z.number(),
                  postedCount: z.number(),
                }),
              ),
            }),
          ),
          modelEstimates: z.array(
            z.object({
              provider: z.string(),
              modelId: z.string().nullable(),
              estimatedUsd: z.number(),
            }),
          ),
          expenses: z.array(
            z.object({ area: z.enum(areaValues), expense: z.string() }),
          ),
        }),
      }),
      bindings: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "suppliers.balances",
        schema: z.array(
          z.object({
            provider: evidenceProvider,
            vendorName: z.string(),
            vendorId: z.uuid(),
            capturedAt: z.string().nullable(),
            balanceUsd: z.number().nullable(),
            ledgerPrepaid: z.string().nullable(),
            balanceNative: z.number().nullable(),
            unit: z.string().nullable(),
            intervalSpendUsd: z.number().nullable(),
            spendEvidence: z
              .enum(["counter", "balance-delta", "usage-estimate"])
              .nullable(),
          }),
        ),
      }),
      records: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "suppliers.recent",
        schema: z.array(
          z.object({
            id: z.uuid(),
            kind: z.enum(operationValues),
            vendorName: z.string(),
            externalReference: z.string(),
            description: z.string(),
            date: z.string(),
            grossAmount: z.string(),
            currency: z.string(),
            billId: z.uuid().nullable(),
            journalEntryId: z.uuid().nullable(),
            billStatus: z.enum(BillStatusDB).nullable(),
            journalStatus: z.enum(JournalEntryStatusDB).nullable(),
          }),
        ),
      }),
    },
  }),
  examples: {
    requests: {
      default: { companyId: "00000000-0000-4000-8000-000000000001" },
    },
    responses: {
      default: {
        bindings: [],
        records: [],
        monthly: {
          month: "2026-11",
          currency: "EUR",
          expenses: [],
          modelEstimates: [],
          providerReview: [],
        },
      },
    },
  },
});

const { POST } = createEndpoint({
  ...common,
  method: Methods.POST,
  aliases: ["supplier-evidence-record"],
  title: "suppliers.record",
  titleShort: "suppliers.record",
  description: "suppliers.recordDescription",
  icon: "receipt",
  fields: customWidgetObject({
    render: RecordWidget,
    usage: { request: "data", response: true },
    children: {
      companyId,
      vendorId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "suppliers.vendor",
        schema: z.uuid().optional(),
        listEndpoint: async () =>
          (await import("@/purchasing/vendor/list/definition")).default.GET,
        labelField: "name",
      }),
      operation: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "suppliers.operation",
        options: operationValues.map((value) => ({
          value,
          label: `suppliers.kind.${value}` as const,
        })),
        schema: z.enum(operationValues).default("bill"),
      }),
      provider: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "suppliers.provider",
        options: FinanceSourceOptions.filter(
          ({ value }) => evidenceProvider.safeParse(value).success,
        ),
        schema: evidenceProvider.optional(),
      }),
      externalReference: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "suppliers.reference",
        schema: z.string().trim().min(1).max(150).optional(),
      }),
      invoiceReference: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "suppliers.invoiceReference",
        schema: z.string().trim().min(1).max(150).optional(),
      }),
      bankDraftBillId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "suppliers.bankDraftBill",
        schema: z.uuid().optional(),
        listEndpoint: async () =>
          (await import("@/payment/bill/list/definition")).default.GET,
        labelField: "supplierName",
      }),
      confirmSeparateBankBill: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "suppliers.confirmSeparateBankBill",
        schema: z.boolean().optional(),
      }),
      servicePeriodStart: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "suppliers.servicePeriodStart",
        schema: z.string().trim().min(1).max(150).optional(),
      }),
      servicePeriodEnd: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "suppliers.servicePeriodEnd",
        schema: z.string().trim().min(1).max(150).optional(),
      }),
      date: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "suppliers.date",
        schema: z.string().trim().optional(),
      }),
      grossAmount: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "suppliers.gross",
        schema: z.string().trim().optional(),
      }),
      taxAmount: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "suppliers.tax",
        schema: z.string().trim().optional(),
      }),
      currency: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "suppliers.currency",
        schema: evidenceCurrencies.optional(),
      }),
      description: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "suppliers.memo",
        schema: z.string().trim().min(1).max(300).optional(),
      }),
      dryRun: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "suppliers.preview",
        schema: z.boolean().default(true),
      }),
      debitAccountId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "suppliers.debit",
        schema: z.uuid().optional(),
        listEndpoint: async () =>
          (await import("@/chart-of-accounts/account/list/definition")).default
            .GET,
        labelField: "name",
      }),
      creditAccountId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "suppliers.credit",
        schema: z.uuid().optional(),
        listEndpoint: async () =>
          (await import("@/chart-of-accounts/account/list/definition")).default
            .GET,
        labelField: "name",
      }),
      result: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "suppliers.result",
        schema: resultSchema,
      }),
    },
  }),
  examples: {
    requests: {
      default: {
        companyId: "00000000-0000-4000-8000-000000000001",
        vendorId: "00000000-0000-4000-8000-000000000002",
        operation: "bill",
        externalReference: "INV-215",
        date: "2026-11-03",
        grossAmount: "120.0000",
        taxAmount: "20.0000",
        currency: "EUR",
        description: "Design services",
        debitAccountId: "00000000-0000-4000-8000-000000000003",
        dryRun: true,
      },
    },
    responses: {
      default: {
        result: {
          outcome: "preview",
          id: null,
          billId: null,
          journalEntryId: null,
          grossAmount: "120.0000",
          currency: "EUR",
          date: "2026-11-03",
        },
      },
    },
  },
});

export type SupplierEvidenceListOutput = typeof GET.types.ResponseOutput;
export type SupplierEvidenceInput = typeof POST.types.RequestOutput;
export type SupplierEvidenceOutput = typeof POST.types.ResponseOutput;
const definitions = { GET, POST } as const;
export default definitions;
