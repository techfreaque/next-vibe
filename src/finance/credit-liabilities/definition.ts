import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
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

import { scopedTranslation } from "./i18n";

const CreditLiabilityWidget = lazyWidget(() =>
  import("./widget").then(({ CreditLiabilityWidget: Widget }) => ({
    default: Widget,
  })),
);
const validation = {
  title: "errors.validation.title",
  description: "errors.validation.description",
} as const;
const forbidden = {
  title: "errors.forbidden.title",
  description: "errors.forbidden.description",
} as const;
const serverError = {
  title: "errors.server.title",
  description: "errors.server.description",
} as const;

const { GET } = createEndpoint({
  scopedTranslation,
  path: ["finance", "credit-liabilities"],
  aliases: ["finance-credit-liabilities"],
  method: Methods.GET,
  title: "title",
  titleShort: "title",
  description: "description",
  category: "finance",
  subCategory: "Credit liabilities",
  icon: "wallet",
  tags: ["tag"],
  allowedRoles: [UserRole.ADMIN],
  options: {
    autoFetchRequires: ["companyId"],
    formOptions: { autoSubmit: true, debounceMs: 250 },
  },
  fields: customWidgetObject({
    render: CreditLiabilityWidget,
    usage: { request: "data", response: true },
    children: {
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "company",
        schema: z.uuid().optional(),
        listEndpoint: async () =>
          (await import("@/companies/list/definition")).default.GET,
        labelField: "name",
      }),
      reportCompanyId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.uuid().nullable(),
      }),
      companyName: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "company",
        schema: z.string().nullable(),
      }),
      asOfDate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "asOf",
        schema: z.iso.date(),
      }),
      balances: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "title",
        schema: z.array(
          z.object({
            accountId: z.uuid(),
            accountCode: z.string(),
            accountName: z.string(),
            currency: z.string(),
            amount: z.string().regex(/^-?\d+(?:\.\d{1,4})?$/),
          }),
        ),
      }),
    },
  }),
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: validation,
    [EndpointErrorTypes.UNAUTHORIZED]: forbidden,
    [EndpointErrorTypes.FORBIDDEN]: forbidden,
    [EndpointErrorTypes.NOT_FOUND]: forbidden,
    [EndpointErrorTypes.CONFLICT]: validation,
    [EndpointErrorTypes.UNSAVED_CHANGES]: validation,
    [EndpointErrorTypes.NETWORK_ERROR]: serverError,
    [EndpointErrorTypes.SERVER_ERROR]: serverError,
    [EndpointErrorTypes.UNKNOWN_ERROR]: serverError,
  },
  successTypes: { title: "title", description: "description" },
  examples: {
    requests: {
      default: { companyId: "00000000-0000-4000-8000-000000000001" },
    },
    responses: {
      default: {
        reportCompanyId: "00000000-0000-4000-8000-000000000001",
        companyName: "Example company",
        asOfDate: "2026-01-31",
        balances: [
          {
            accountId: "00000000-0000-4000-8000-000000000002",
            accountCode: "2300",
            accountName: "Deferred credit sales",
            currency: "EUR",
            amount: "61.2000",
          },
        ],
      },
    },
  },
});
export type CreditLiabilityInput = typeof GET.types.RequestOutput;
export type CreditLiabilityOutput = typeof GET.types.ResponseOutput;
export default { GET };
