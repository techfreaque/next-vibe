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
import { bankLineSchema } from "../schemas";

const BankListWidgetLazy = lazyWidget(() =>
  import("./widget").then((module) => ({ default: module.BankListWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  path: ["finance", "bank", "list"],
  aliases: ["bank-statement-lines"],
  method: Methods.GET,
  title: "list.title",
  titleShort: "list.title",
  description: "list.description",
  category: "finance",
  subCategory: "Bank reconciliation",
  icon: "list",
  tags: ["tags.bank", "tags.reconciliation"],
  allowedRoles: [UserRole.ADMIN],
  fields: customWidgetObject({
    render: BankListWidgetLazy,
    usage: { request: "data", response: true },
    children: {
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "fields.company",
        includeInCacheKey: true,
        schema: z.uuid().optional(),
        listEndpoint: async () =>
          (await import("@/companies/list/definition")).default.GET,
        labelField: "name",
      }),
      accountId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "fields.account",
        includeInCacheKey: true,
        schema: z.uuid().optional(),
        listEndpoint: async () =>
          (await import("@/chart-of-accounts/account/list/definition")).default
            .GET,
        labelField: "name",
      }),
      page: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fields.page",
        schema: z.coerce.number().int().min(1).default(1),
      }),
      lines: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "fields.line",
        schema: z.array(bankLineSchema),
      }),
      total: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "fields.total",
        schema: z.number().int(),
      }),
      currentPage: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "fields.page",
        schema: z.number().int(),
      }),
      pageCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "fields.page",
        schema: z.number().int(),
      }),
      selectedCompanyId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "fields.company",
        schema: z.uuid().nullable(),
      }),
      selectedAccountId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "fields.account",
        schema: z.uuid().nullable(),
      }),
      selectedCurrency: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "fields.currency",
        hidden: true,
        schema: z.string().optional(),
      }),
      selectedCompanyName: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "fields.company",
        schema: z.string().nullable(),
      }),
      selectedAccountName: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "fields.account",
        schema: z.string().nullable(),
      }),
    },
  }),
  errorTypes: bankErrorTypes,
  examples: {
    requests: {
      default: {
        companyId: "00000000-0000-4000-8000-000000000001",
        accountId: "00000000-0000-4000-8000-000000000002",
        page: 1,
      },
    },
    responses: {
      default: {
        lines: [
          {
            id: "00000000-0000-4000-8000-000000000003",
            transactionId: "bank-14",
            bookedDate: "2026-11-25",
            amount: "125.3400",
            currency: "EUR",
          },
        ],
        total: 1,
        currentPage: 1,
        pageCount: 1,
        selectedCompanyId: "00000000-0000-4000-8000-000000000001",
        selectedAccountId: "00000000-0000-4000-8000-000000000002",
        selectedCompanyName: "Tatra Ledger Studio",
        selectedAccountName: "Operating account",
      },
    },
  },
  successTypes: { title: "list.success", description: "list.description" },
});

export type BankListRequest = typeof GET.types.RequestOutput;
export type BankListResponse = typeof GET.types.ResponseOutput;

export default { GET };
