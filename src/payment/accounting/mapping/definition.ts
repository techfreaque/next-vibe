import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { CurrenciesArr } from "next-vibe/core/i18n/core/config";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import type accountListDefinition from "@/chart-of-accounts/account/list/definition";

import { PaymentProvider, PaymentProviderDB } from "../../enum";
import { recognitionPolicies } from "../constants";
import { accountingCompany, accountingErrors } from "../fields";
import { scopedTranslation } from "../i18n";

const AccountMappingWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.AccountMappingWidget })),
);

const accountList = async (): Promise<typeof accountListDefinition.GET> =>
  (await import("@/chart-of-accounts/account/list/definition")).default.GET;
const accountField = {
  type: WidgetType.FORM_FIELD,
  fieldType: FieldDataType.ENTITY_PICKER,
  listEndpoint: accountList,
  labelField: "name",
} as const;
const textField = {
  type: WidgetType.FORM_FIELD,
  fieldType: FieldDataType.TEXT,
} as const;

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["payment", "accounting", "mapping"],
  aliases: ["processor-accounting-map"],
  title: "configure",
  titleShort: "configure",
  description: "intro",
  category: "payments",
  subCategory: "Providers",
  tags: ["title"],
  allowedRoles: [UserRole.ADMIN],
  icon: "package",
  fields: customWidgetObject({
    usage: { request: "data", response: true },
    render: AccountMappingWidget,
    children: {
      companyId: accountingCompany,
      productId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "product",
        schema: z.uuid(),
        listEndpoint: async () =>
          (await import("@/products/catalog/list/definition")).default.GET,
        labelField: "name",
      }),
      provider: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "provider",
        placeholder: "chooseProvider",
        schema: z.enum(PaymentProviderDB),
        options: [
          { value: PaymentProvider.STRIPE, label: "providerStripe" },
          { value: PaymentProvider.NOWPAYMENTS, label: "providerNow" },
        ],
      }),
      merchantId: requestField(scopedTranslation, {
        ...textField,
        label: "merchant",
        description: "merchantHelp",
        placeholder: "merchantPlaceholder",
        schema: z.string().trim().min(1).max(255),
      }),
      offerId: requestField(scopedTranslation, {
        ...textField,
        label: "offer",
        description: "offerHelp",
        placeholder: "offerPlaceholder",
        schema: z.string().trim().min(1).max(255),
      }),
      currency: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "currency",
        placeholder: "chooseCurrency",
        schema: z.enum(CurrenciesArr),
        options: [
          { value: "EUR", label: "currencyEur" },
          { value: "USD", label: "currencyUsd" },
          { value: "PLN", label: "currencyPln" },
        ],
      }),
      recognition: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "recognition",
        placeholder: "chooseRecognition",
        schema: z.enum(recognitionPolicies),
        options: [
          { value: "immediate", label: "immediate" },
          { value: "deferred", label: "deferred" },
        ],
      }),
      receivableAccountId: requestField(scopedTranslation, {
        ...accountField,
        label: "receivable",
        schema: z.uuid(),
      }),
      clearingAccountId: requestField(scopedTranslation, {
        ...accountField,
        label: "clearing",
        schema: z.uuid(),
      }),
      considerationAccountId: requestField(scopedTranslation, {
        ...accountField,
        label: "consideration",
        schema: z.uuid(),
      }),
      vatAccountId: requestField(scopedTranslation, {
        ...accountField,
        label: "vat",
        schema: z.uuid().optional(),
      }),
      expenseAccountId: requestField(scopedTranslation, {
        ...accountField,
        label: "expense",
        schema: z.uuid().optional(),
      }),
      allowUnstatedZeroTax: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "zeroTax",
        description: "zeroTaxHelp",
        schema: z.boolean().default(false),
      }),
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "offer",
        schema: z.uuid(),
      }),
    },
  }),
  errorTypes: accountingErrors,
  successTypes: { title: "saved", description: "intro" },
  examples: {
    requests: {
      default: {
        companyId: "00000000-0000-4000-8000-000000000001",
        productId: "00000000-0000-4000-8000-000000000002",
        provider: PaymentProviderDB[0],
        merchantId: "test:acct_fixture",
        offerId: "price_fixture",
        currency: "EUR",
        recognition: "deferred",
        receivableAccountId: "00000000-0000-4000-8000-000000000003",
        clearingAccountId: "00000000-0000-4000-8000-000000000004",
        considerationAccountId: "00000000-0000-4000-8000-000000000005",
        allowUnstatedZeroTax: false,
      },
    },
    responses: { default: { id: "00000000-0000-4000-8000-000000000006" } },
  },
});

export default { POST };
