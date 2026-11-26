"use client";

import { Div } from "next-vibe/ui/components/div";
import { Label } from "next-vibe/ui/components/label";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe/ui/components/select";
import { Span } from "next-vibe/ui/components/span";
import {
  useWidgetForm,
  useWidgetLogger,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import {
  AdminForm,
  AdminFormSection,
} from "next-vibe/unified-ui/widgets/containers/admin-form/widget";
import { BooleanFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/boolean-field/widget";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX, useEffect, useId, useMemo } from "react";
import { z } from "zod";

import accountsDefinition from "@/chart-of-accounts/account/list/definition";
import { AccountSubtype, AccountType } from "@/chart-of-accounts/enum";
import { useWorkspaceCompany } from "@/companies/_shared/workspace-company-context";
import productsDefinition from "@/products/catalog/list/definition";

import type definition from "./definition";

interface Option {
  id: string;
  name: string;
}

function MappingOption({
  name,
  label,
  value,
  options,
  hint,
  placeholder,
  emptyHint,
  onSelect,
}: {
  name: string;
  label: string;
  value?: string;
  options: readonly Option[];
  hint?: string;
  placeholder: string;
  emptyHint?: string;
  onSelect: (value: string) => void;
}): JSX.Element {
  const id = useId();
  return (
    <Div data-field={name} className="flex min-w-0 flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Select value={value ?? ""} onValueChange={onSelect}>
        <SelectTrigger id={id} disabled={!options.length}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.id} value={option.id}>
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {(options.length ? hint : (emptyHint ?? hint)) && (
        <Span className="text-xs text-muted-foreground">
          {options.length ? hint : (emptyHint ?? hint)}
        </Span>
      )}
    </Div>
  );
}

type AccountFieldName =
  | "receivableAccountId"
  | "clearingAccountId"
  | "considerationAccountId"
  | "vatAccountId"
  | "expenseAccountId";

export function AccountMappingWidget({
  field: { children },
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const data = useWidgetValue<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const companyId = form.watch("companyId");
  const activeCompanyId = useWorkspaceCompany()?.active?.id;
  // Smart default: start in the company the admin is working in.
  useEffect(() => {
    if (activeCompanyId && !form.getValues("companyId")) {
      form.setValue("companyId", activeCompanyId, { shouldDirty: true });
    }
  }, [activeCompanyId, form]);
  const scopeReady = z.uuid().safeParse(companyId).success;
  const productOptions = useMemo(
    () => ({
      read: {
        initialState: {
          filters: { companyId, isActive: true },
          page: 1,
          pageSize: 100,
        },
        queryOptions: { enabled: scopeReady },
      },
    }),
    [companyId, scopeReady],
  );
  const accountOptions = useMemo(
    () => ({
      read: {
        initialState: { companyId, postableOnly: true, page: 1, pageSize: 200 },
        queryOptions: { enabled: scopeReady },
      },
    }),
    [companyId, scopeReady],
  );
  const products = useEndpoint(productsDefinition, productOptions, logger, user)
    .read?.data?.products;
  const accounts = useEndpoint(accountsDefinition, accountOptions, logger, user)
    .read?.data?.accounts;
  const matchingProducts =
    products?.filter(({ sku, isActive }) => sku && isActive) ?? [];
  const matchingAccounts =
    accounts
      ?.filter(({ isActive, isPostable }) => isActive && isPostable)
      .map((account) => ({
        ...account,
        name: `${account.code} ${account.name}`,
      })) ?? [];
  const requiredOptions: Record<AccountFieldName, Option[]> = {
    receivableAccountId: matchingAccounts.filter(
      ({ subtype }) => subtype === AccountSubtype.ACCOUNTS_RECEIVABLE,
    ),
    clearingAccountId: matchingAccounts.filter(
      ({ subtype }) => subtype === AccountSubtype.CURRENT_ASSET,
    ),
    considerationAccountId: matchingAccounts.filter(
      ({ type }) =>
        type ===
        (form.watch("recognition") === "deferred"
          ? AccountType.LIABILITY
          : AccountType.REVENUE),
    ),
    vatAccountId: matchingAccounts.filter(
      ({ subtype }) => subtype === AccountSubtype.VAT_PAYABLE,
    ),
    expenseAccountId: matchingAccounts.filter(
      ({ type }) => type === AccountType.EXPENSE,
    ),
  };
  const scopeLoaded = scopeReady && accounts !== undefined;
  const select =
    (name: AccountFieldName) =>
    (value: string): void =>
      form.setValue(name, value, { shouldDirty: true, shouldValidate: true });
  const accountOption = (
    name: AccountFieldName,
    label: string,
    hint: string,
  ): JSX.Element => (
    <MappingOption
      name={name}
      label={label}
      value={form.watch(name)}
      options={requiredOptions[name]}
      placeholder={scopeReady ? t("chooseAccount") : t("chooseCompanyFirst")}
      hint={hint}
      emptyHint={scopeLoaded ? t("noMatchingAccount") : undefined}
      onSelect={select(name)}
    />
  );

  // Smart default: when the chart has exactly one account for a role, use it.
  const singleChoices = (
    Object.keys(requiredOptions) as AccountFieldName[]
  ).flatMap((name) =>
    requiredOptions[name].length === 1 && !form.getValues(name)
      ? [{ name, id: requiredOptions[name][0].id }]
      : [],
  );
  const singleKey = singleChoices.map(({ name, id }) => `${name}:${id}`).join();
  // A changed recognition policy invalidates a revenue/liability pick.
  const consideration = form.watch("considerationAccountId");
  const staleConsideration =
    scopeLoaded &&
    !!consideration &&
    !requiredOptions.considerationAccountId.some(
      ({ id }) => id === consideration,
    );
  useEffect(() => {
    if (staleConsideration) {
      form.setValue("considerationAccountId", "", { shouldDirty: true });
    }
  }, [staleConsideration, form]);
  useEffect(() => {
    for (const { name, id } of singleChoices) {
      form.setValue(name, id, { shouldDirty: true });
    }
    // singleKey captures the choices; the array itself is rebuilt every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleKey, form]);

  if (data?.id) {
    return (
      <AdminForm
        title={t("configure")}
        description={t("intro")}
        primaryAction={null}
      >
        <ResultBanner title={t("saved")} variant="success" />
      </AdminForm>
    );
  }

  return (
    <AdminForm
      title={t("configure")}
      description={t("intro")}
      width="wide"
      alert={<FormAlertWidget field={{}} />}
      primaryAction={<SubmitButtonWidget field={{ text: "saveOffer" }} />}
    >
      <AdminFormSection title={t("sectionOffer")} columns={2}>
        <Div data-field="companyId" className="flex min-w-0 flex-col gap-2">
          <Label>{t("company")}</Label>
          <EntityPickerFieldWidget
            fieldName="companyId"
            field={children.companyId}
            showLabel={false}
          />
        </Div>
        <MappingOption
          name="productId"
          label={t("product")}
          value={form.watch("productId")}
          options={matchingProducts}
          placeholder={
            scopeReady ? t("chooseProduct") : t("chooseCompanyFirst")
          }
          hint={t("productHint")}
          emptyHint={
            scopeReady && products !== undefined
              ? t("noMatchingProduct")
              : undefined
          }
          onSelect={(value) =>
            form.setValue("productId", value, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
        />
        <SelectFieldWidget fieldName="provider" field={children.provider} />
        <SelectFieldWidget fieldName="currency" field={children.currency} />
        <TextFieldWidget fieldName="merchantId" field={children.merchantId} />
        <TextFieldWidget fieldName="offerId" field={children.offerId} />
      </AdminFormSection>
      <AdminFormSection title={t("sectionBooks")} columns={2}>
        <SelectFieldWidget
          fieldName="recognition"
          field={children.recognition}
        />
        {accountOption(
          "receivableAccountId",
          t("receivable"),
          t("receivableHint"),
        )}
        {accountOption("clearingAccountId", t("clearing"), t("clearingHint"))}
        {accountOption(
          "considerationAccountId",
          t("consideration"),
          t("considerationHint"),
        )}
        {accountOption("vatAccountId", t("vat"), t("vatHint"))}
        {accountOption("expenseAccountId", t("expense"), t("expenseHint"))}
      </AdminFormSection>
      <AdminFormSection title={t("sectionTax")} columns={1}>
        <BooleanFieldWidget
          fieldName="allowUnstatedZeroTax"
          field={children.allowUnstatedZeroTax}
        />
      </AdminFormSection>
    </AdminForm>
  );
}
