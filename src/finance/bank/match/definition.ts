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
  requestUrlPathParamsField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { bankErrorTypes } from "../endpoint-errors";
import { scopedTranslation } from "../i18n";

const BankMatchWidgetLazy = lazyWidget(() =>
  import("./widget").then((module) => ({ default: module.BankMatchWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  path: ["finance", "bank", "match"],
  aliases: ["bank-confirm-match"],
  method: Methods.POST,
  title: "match.title",
  titleShort: "match.title",
  description: "match.description",
  category: "finance",
  subCategory: "Bank reconciliation",
  icon: "check-circle",
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
            urlPathParams: { lineId: context.pathParams.lineId },
          }),
        ]);
      },
    },
  },
  fields: customWidgetObject({
    render: BankMatchWidgetLazy,
    usage: { request: "data&urlPathParams", response: true },
    children: {
      lineId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.line",
        schema: z.uuid(),
      }),
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "fields.company",
        schema: z.uuid(),
        listEndpoint: async () =>
          (await import("@/companies/list/definition")).default.GET,
        labelField: "name",
      }),
      journalLineId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.journalLine",
        schema: z.uuid(),
      }),
      confirm: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.confirm",
        schema: z.boolean().default(false),
      }),
      matchedJournalLineId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "fields.journalLine",
        schema: z.uuid(),
      }),
      selectedAccountId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "fields.account",
        schema: z.uuid(),
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
    urlPathParams: {
      default: { lineId: "00000000-0000-4000-8000-000000000003" },
    },
    requests: {
      default: {
        companyId: "00000000-0000-4000-8000-000000000001",
        journalLineId: "00000000-0000-4000-8000-000000000004",
        confirm: true,
      },
    },
    responses: {
      default: {
        matchedJournalLineId: "00000000-0000-4000-8000-000000000004",
        selectedAccountId: "00000000-0000-4000-8000-000000000002",
        matchedAt: "2026-11-25T10:15:00Z",
      },
    },
  },
  successTypes: { title: "match.success", description: "match.description" },
});

export type BankMatchRequest = typeof POST.types.RequestOutput;
export type BankMatchResponse = typeof POST.types.ResponseOutput;
export type BankMatchPath = typeof POST.types.UrlVariablesOutput;

export default { POST };
