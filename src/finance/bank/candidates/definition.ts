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
import {
  bankCandidateSchema,
  bankDocumentCandidateSchema,
  bankLineSchema,
  bankSplitRecordSchema,
} from "../schemas";

const BankCandidatesWidgetLazy = lazyWidget(() =>
  import("./widget").then((module) => ({
    default: module.BankCandidatesWidget,
  })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  path: ["finance", "bank", "candidates"],
  aliases: ["bank-match-candidates"],
  method: Methods.GET,
  title: "candidates.title",
  titleShort: "candidates.title",
  description: "candidates.description",
  category: "finance",
  subCategory: "Bank reconciliation",
  icon: "search",
  tags: ["tags.bank", "tags.reconciliation"],
  allowedRoles: [UserRole.ADMIN],
  fields: customWidgetObject({
    render: BankCandidatesWidgetLazy,
    usage: { request: "data", response: true },
    children: {
      lineId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.line",
        includeInCacheKey: true,
        schema: z.uuid(),
      }),
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "fields.company",
        includeInCacheKey: true,
        schema: z.uuid(),
        listEndpoint: async () =>
          (await import("@/companies/list/definition")).default.GET,
        labelField: "name",
      }),
      statementLine: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "fields.line",
        schema: bankLineSchema,
      }),
      matches: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "fields.journalLine",
        schema: z.array(bankCandidateSchema),
      }),
      documentCandidates: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "split.documentCandidates",
        schema: z.array(bankDocumentCandidateSchema).optional(),
      }),
      splits: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "split.allocations",
        schema: z.array(bankSplitRecordSchema).optional(),
      }),
      selectedCompanyId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "fields.company",
        schema: z.uuid(),
      }),
      matchedJournalLineId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "fields.journalLine",
        schema: z.uuid().nullable(),
      }),
      matchedAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "fields.matchedAt",
        schema: z.string().nullable().optional(),
      }),
      canMatch: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "fields.confirm",
        schema: z.boolean(),
      }),
    },
  }),
  errorTypes: bankErrorTypes,
  examples: {
    requests: {
      default: {
        companyId: "00000000-0000-4000-8000-000000000001",
        lineId: "00000000-0000-4000-8000-000000000003",
      },
    },
    responses: {
      default: {
        statementLine: {
          id: "00000000-0000-4000-8000-000000000003",
          transactionId: "bank-14",
          bookedDate: "2026-11-25",
          amount: "125.3400",
          currency: "EUR",
        },
        matches: [
          {
            id: "00000000-0000-4000-8000-000000000004",
            entryNumber: "JE-2026-0042",
            description: "Customer payment",
            journalDate: "2026-11-25T10:00:00Z",
          },
        ],
        selectedCompanyId: "00000000-0000-4000-8000-000000000001",
        matchedJournalLineId: null,
        canMatch: true,
      },
    },
  },
  successTypes: {
    title: "candidates.success",
    description: "candidates.description",
  },
});

export type BankCandidatesRequest = Omit<
  typeof GET.types.RequestOutput,
  "lineId"
>;
export type BankCandidatesResponse = typeof GET.types.ResponseOutput;
export type BankCandidatesPath = Pick<typeof GET.types.RequestOutput, "lineId">;

export default { GET };
