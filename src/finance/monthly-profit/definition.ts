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

import { AccountSubtypeDB } from "@/chart-of-accounts/enum";

import { financeErrorTypes } from "../error-types";
import { scopedTranslation } from "../i18n";
import { areaValues, evidenceMonth } from "../supplier-evidence/rules";

const ProfitWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.MonthlyProfitWidget })),
);

const accountSchema = z.object({
  id: z.uuid(),
  code: z.string(),
  name: z.string(),
  subtype: z.enum(AccountSubtypeDB),
  amount: z.string(),
});

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["finance", "monthly-profit"],
  aliases: ["finance-monthly-profit"],
  title: "profit.title",
  titleShort: "profit.title",
  description: "profit.description",
  category: "finance",
  subCategory: "Monitoring",
  icon: "bar-chart-3",
  allowedRoles: [UserRole.ADMIN],
  tags: ["tags.finance"],
  errorTypes: financeErrorTypes,
  successTypes: { title: "success.title", description: "success.description" },
  fields: customWidgetObject({
    render: ProfitWidget,
    usage: { request: "data", response: true },
    children: {
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "suppliers.company",
        schema: z.uuid(),
        listEndpoint: async () =>
          (await import("@/companies/list/definition")).default.GET,
        labelField: "name",
      }),
      month: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "suppliers.month",
        schema: evidenceMonth.optional(),
      }),
      report: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "profit.title",
        schema: z.object({
          companyName: z.string(),
          month: evidenceMonth,
          currencies: z.array(
            z.object({
              currency: z.string(),
              revenue: z.string(),
              expenses: z.string(),
              net: z.string(),
              revenueAccounts: z.array(accountSchema),
              expenseAccounts: z.array(accountSchema),
              expenseAreas: z.array(
                z.object({ area: z.enum(areaValues), expense: z.string() }),
              ),
            }),
          ),
          estimates: z.array(
            z.object({
              provider: z.string(),
              modelId: z.string().nullable(),
              estimatedUsd: z.number(),
              missingExactCredits: z.number(),
              paidUsd: z.number(),
              freeUsd: z.number(),
              giftedUsd: z.number(),
              unknownUsd: z.number(),
              paidUsageValueUsd: z.number(),
              missingPaidPriceCredits: z.number(),
              marginUsd: z.number().nullable(),
            }),
          ),
        }),
      }),
    },
  }),
  examples: {
    requests: {
      default: {
        companyId: "00000000-0000-4000-8000-000000000001",
        month: "2026-11",
      },
    },
    responses: {
      default: {
        report: {
          companyName: "Sample Company",
          month: "2026-11",
          currencies: [],
          estimates: [],
        },
      },
    },
  },
});

export type MonthlyProfitRequest = typeof GET.types.RequestOutput;
export type MonthlyProfitResponse = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
