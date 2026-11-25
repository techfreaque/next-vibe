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

import { BANK_STATEMENT_CSV_LIMIT } from "../csv";
import { bankErrorTypes } from "../endpoint-errors";
import { scopedTranslation } from "../i18n";

const BankImportWidgetLazy = lazyWidget(() =>
  import("./widget").then((module) => ({ default: module.BankImportWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  path: ["finance", "bank", "import"],
  aliases: ["bank-statement-import"],
  method: Methods.POST,
  title: "import.title",
  titleShort: "import.title",
  description: "import.description",
  category: "finance",
  subCategory: "Bank reconciliation",
  icon: "upload",
  tags: ["tags.bank", "tags.reconciliation"],
  allowedRoles: [UserRole.ADMIN],
  options: {
    mutationOptions: {
      onSuccess: async (context) => {
        const [{ apiClient }, list] = await Promise.all([
          import("next-vibe/unified-ui/hooks/store"),
          import("../list/definition"),
        ]);
        await apiClient.refetchEndpoint(list.default.GET, context.logger, {
          requestData: {
            companyId: context.requestData.companyId,
            accountId: context.requestData.accountId,
          },
        });
      },
    },
  },
  fields: customWidgetObject({
    render: BankImportWidgetLazy,
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
      csv: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "fields.csv",
        schema: z.string().max(BANK_STATEMENT_CSV_LIMIT),
      }),
      imported: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "fields.imported",
        schema: z.number().int(),
      }),
      skipped: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "fields.skipped",
        schema: z.number().int(),
      }),
      selectedCompanyId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "fields.company",
        schema: z.uuid(),
      }),
      selectedAccountId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "fields.account",
        schema: z.uuid(),
      }),
    },
  }),
  errorTypes: bankErrorTypes,
  examples: {
    requests: {
      default: {
        companyId: "00000000-0000-4000-8000-000000000001",
        accountId: "00000000-0000-4000-8000-000000000002",
        csv: "transactionId,date,amount,currency\nbank-14,2026-11-25,+125.34,EUR",
      },
    },
    responses: {
      default: {
        imported: 1,
        skipped: 0,
        selectedCompanyId: "00000000-0000-4000-8000-000000000001",
        selectedAccountId: "00000000-0000-4000-8000-000000000002",
      },
    },
  },
  successTypes: { title: "import.success", description: "import.description" },
});

export type BankImportRequest = typeof POST.types.RequestOutput;
export type BankImportResponse = typeof POST.types.ResponseOutput;

export default { POST };
