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

const BankAutoMatchWidgetLazy = lazyWidget(() =>
  import("./widget").then((module) => ({
    default: module.BankAutoMatchWidget,
  })),
);

const autoMatchItemSchema = z.object({
  lineId: z.uuid(),
  transactionId: z.string(),
  bookedDate: z.iso.date(),
  amount: z.string(),
  currency: z.string(),
  targetType: z.enum(["journal_line", "invoice", "bill"]),
  targetId: z.uuid(),
  targetLabel: z.string(),
  matchKind: z.enum(["exact", "fee", "fx"]),
  basis: z.enum(["reference", "iban", "amount_date", "fx_tolerance"]),
  fee: z.number(),
  fx: z.number(),
  applied: z.boolean(),
});

const { POST } = createEndpoint({
  scopedTranslation,
  path: ["finance", "bank", "auto-match"],
  aliases: ["bank-auto-match"],
  method: Methods.POST,
  title: "autoMatch.title",
  titleShort: "autoMatch.title",
  description: "autoMatch.description",
  category: "finance",
  subCategory: "Bank reconciliation",
  icon: "sparkles",
  tags: ["tags.bank", "tags.reconciliation"],
  allowedRoles: [UserRole.ADMIN],
  options: {
    mutationOptions: {
      onSuccess: async (context) => {
        if (context.responseData.preview) {
          return;
        }
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
    render: BankAutoMatchWidgetLazy,
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
      dryRun: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "autoMatch.dryRun",
        schema: z.boolean().default(true),
      }),
      preview: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "autoMatch.dryRun",
        schema: z.boolean(),
      }),
      matchedCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "autoMatch.matchedCount",
        schema: z.number().int(),
      }),
      invoiceMatches: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "autoMatch.invoiceMatches",
        schema: z.number().int(),
      }),
      billMatches: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "autoMatch.billMatches",
        schema: z.number().int(),
      }),
      journalMatches: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "autoMatch.journalMatches",
        schema: z.number().int(),
      }),
      skippedAmbiguous: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "autoMatch.skippedAmbiguous",
        schema: z.number().int(),
      }),
      items: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "autoMatch.items",
        schema: z.array(autoMatchItemSchema),
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
        dryRun: true,
      },
    },
    responses: {
      default: {
        preview: true,
        matchedCount: 1,
        invoiceMatches: 1,
        billMatches: 0,
        journalMatches: 0,
        skippedAmbiguous: 0,
        items: [],
        selectedAccountId: "00000000-0000-4000-8000-000000000002",
      },
    },
  },
  successTypes: {
    title: "autoMatch.success",
    description: "autoMatch.description",
  },
});

export type BankAutoMatchRequest = typeof POST.types.RequestOutput;
export type BankAutoMatchResponse = typeof POST.types.ResponseOutput;

export default { POST };
