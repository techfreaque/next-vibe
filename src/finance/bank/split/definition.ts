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

const BankSplitWidgetLazy = lazyWidget(() =>
  import("./widget").then((module) => ({ default: module.BankSplitWidget })),
);

const splitAllocationInputSchema = z.object({
  targetType: z.enum(["journal_line", "invoice", "bill", "account"]),
  targetId: z.uuid(),
  amount: z.string().regex(/^-?(?:0|[1-9]\d{0,9})(?:\.\d{1,4})?$/u),
  description: z.string().max(500).optional(),
});

const { POST } = createEndpoint({
  scopedTranslation,
  path: ["finance", "bank", "split"],
  aliases: ["bank-split-match"],
  method: Methods.POST,
  title: "split.title",
  titleShort: "split.title",
  description: "split.description",
  category: "finance",
  subCategory: "Bank reconciliation",
  icon: "git-branch",
  tags: ["tags.bank", "tags.reconciliation"],
  allowedRoles: [UserRole.ADMIN],
  options: {
    mutationOptions: {
      onSuccess: async (context) => {
        const [{ apiClient }, list, candidates] = await Promise.all([
          import("next-vibe/unified-ui/hooks/store"),
          import("../list/definition"),
          import("../candidates/definition"),
        ]);
        await Promise.all([
          apiClient.refetchEndpoint(list.default.GET, context.logger, {
            requestData: {
              companyId: context.requestData.companyId,
              accountId: context.responseData.selectedAccountId,
            },
          }),
          apiClient.refetchEndpoint(candidates.default.GET, context.logger, {
            requestData: {
              lineId: context.requestData.lineId,
              companyId: context.requestData.companyId,
            },
          }),
        ]);
      },
    },
  },
  fields: customWidgetObject({
    render: BankSplitWidgetLazy,
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
      allocations: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "split.allocations",
        schema: z.array(splitAllocationInputSchema).min(1).max(20),
      }),
      confirm: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.confirm",
        schema: z.boolean().default(false),
      }),
      selectedAccountId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "fields.account",
        schema: z.uuid(),
      }),
      splitCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "split.count",
        schema: z.number().int(),
      }),
      createdJournalEntryId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "adjustment.journal",
        schema: z.uuid().nullable().optional(),
      }),
      matchedAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "fields.matchedAt",
        schema: z.coerce.date(),
      }),
    },
  }),
  errorTypes: bankErrorTypes,
  examples: {
    requests: {
      default: {
        companyId: "00000000-0000-4000-8000-000000000001",
        lineId: "00000000-0000-4000-8000-000000000003",
        allocations: [
          {
            targetType: "invoice",
            targetId: "00000000-0000-4000-8000-000000000010",
            amount: "100.0000",
          },
          {
            targetType: "account",
            targetId: "00000000-0000-4000-8000-000000000011",
            amount: "25.3400",
            description: "Wire surcharge",
          },
        ],
        confirm: true,
      },
    },
    responses: {
      default: {
        selectedAccountId: "00000000-0000-4000-8000-000000000002",
        splitCount: 2,
        createdJournalEntryId: "00000000-0000-4000-8000-000000000020",
        matchedAt: "2026-11-26T10:00:00Z",
      },
    },
  },
  successTypes: { title: "split.success", description: "split.description" },
});

export type BankSplitRequest = typeof POST.types.RequestOutput;
export type BankSplitResponse = typeof POST.types.ResponseOutput;

export default { POST };
