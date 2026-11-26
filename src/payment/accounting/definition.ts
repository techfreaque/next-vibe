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

import { PaymentProviderDB } from "../enum";
import { accountingSourceKinds } from "./constants";
import { accountingCompany, accountingErrors } from "./fields";
import { scopedTranslation } from "./i18n";

const list = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.AccountingListWidget })),
);
const reconcile = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.AccountingReconcileWidget })),
);

const outcome = z.enum([
  "posted",
  "alreadyPosted",
  "ready",
  "forbidden",
  "missingEvidence",
  "missingMapping",
  "unsupportedCurrency",
  "unmatchedTransaction",
  "unverifiedTax",
  "invalidAccounts",
  "periodClosed",
  "unverifiedRefundAllocation",
  "deferredRefundNeedsReview",
  "feeNeedsBill",
  "feeBillLinked",
  "taxRegimeConflict",
  "inconsistentEvidence",
  "postingFailed",
]);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["payment", "accounting"],
  aliases: ["processor-accounting"],
  title: "title",
  titleShort: "title",
  description: "intro",
  category: "payments",
  subCategory: "Providers",
  tags: ["title"],
  allowedRoles: [UserRole.ADMIN],
  icon: "receipt",
  fields: customWidgetObject({
    render: list,
    usage: { request: "data", response: true },
    children: {
      companyId: accountingCompany,
      rows: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "sources",
        schema: z.array(
          z.object({
            id: z.uuid(),
            provider: z.enum(PaymentProviderDB),
            merchantId: z.string(),
            sourceKind: z.enum(accountingSourceKinds),
            externalId: z.string(),
            currency: z.string(),
            grossMinor: z.number(),
            taxMinor: z.number().nullable(),
            feeMinor: z.number().nullable(),
          }),
        ),
      }),
      stripeTestMerchant: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "stripeTest",
        schema: z.string().optional(),
      }),
      stripeLiveMerchant: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "stripeLive",
        schema: z.string().optional(),
      }),
      nowMerchant: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "nowMerchant",
        schema: z.string().optional(),
      }),
    },
  }),
  errorTypes: accountingErrors,
  successTypes: { title: "sources", description: "intro" },
  examples: {
    requests: {
      default: { companyId: "00000000-0000-4000-8000-000000000001" },
    },
    responses: { default: { rows: [] } },
  },
});

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["payment", "accounting"],
  aliases: ["processor-accounting-reconcile"],
  title: "review",
  titleShort: "review",
  description: "intro",
  category: "payments",
  subCategory: "Providers",
  tags: ["title"],
  allowedRoles: [UserRole.ADMIN],
  icon: "receipt",
  fields: customWidgetObject({
    render: reconcile,
    usage: { request: "data", response: true },
    children: {
      companyId: accountingCompany,
      evidenceIds: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "ids",
        schema: z
          .string()
          .max(1_024)
          .refine(
            (value) =>
              z
                .array(z.uuid())
                .min(1)
                .max(25)
                .safeParse(value.split(",").map((part) => part.trim())).success,
          ),
      }),
      dryRun: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "dryRun",
        schema: z.boolean().default(true),
      }),
      results: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "sources",
        schema: z.array(
          z.object({
            id: z.uuid(),
            status: outcome,
            invoiceId: z.uuid().nullish(),
            journalEntryId: z.uuid().optional(),
            billId: z.uuid().optional(),
            creditsConsumed: z.number().optional(),
            creditsGranted: z.number().optional(),
            recognizedMinor: z.number().int().optional(),
            remainingLiabilityMinor: z.number().int().optional(),
            currency: z.string().optional(),
            grossMinor: z.number().optional(),
            netMinor: z.number().optional(),
            taxMinor: z.number().optional(),
            feeMinor: z.number().nullable().optional(),
          }),
        ),
      }),
    },
  }),
  errorTypes: accountingErrors,
  successTypes: { title: "ready", description: "review" },
  examples: {
    requests: {
      default: {
        companyId: "00000000-0000-4000-8000-000000000001",
        evidenceIds: "00000000-0000-4000-8000-000000000002",
        dryRun: true,
      },
    },
    responses: { default: { results: [] } },
  },
});

export default { GET, POST };
