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
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  useWidgetForm,
  useWidgetLogger,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import { BooleanFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/boolean-field/widget";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX, useId, useMemo } from "react";
import { z } from "zod";

import accountsDefinition from "@/chart-of-accounts/account/list/definition";
import { AccountSubtype, AccountType } from "@/chart-of-accounts/enum";
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
  onSelect,
}: {
  name: string;
  label: string;
  value?: string;
  options: readonly Option[];
  hint?: string;
  onSelect: (value: string) => void;
}): JSX.Element {
  const id = useId();
  return (
    <Div data-field={name} className="flex min-w-0 flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Select value={value ?? ""} onValueChange={onSelect}>
        <SelectTrigger id={id} disabled={!options.length}>
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.id} value={option.id}>
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hint && <Span className="text-xs text-muted-foreground">{hint}</Span>}
    </Div>
  );
}

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
    accounts?.filter(({ isActive, isPostable }) => isActive && isPostable) ??
    [];
  const requiredOptions = {
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
  return (
    <WidgetShell layout="page">
      <WidgetHeader title={t("configure")} subtitle={t("intro")} size="page" />
      {data?.id ? (
        <ResultBanner title={t("saved")} variant="success" />
      ) : (
        <>
          <Div className="grid grid-cols-1 gap-3 @lg:grid-cols-2">
            <EntityPickerFieldWidget
              fieldName="companyId"
              field={children.companyId}
            />
            <MappingOption
              name="productId"
              label={t("product")}
              value={form.watch("productId")}
              options={matchingProducts}
              onSelect={(value) =>
                form.setValue("productId", value, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            />
            <SelectFieldWidget fieldName="provider" field={children.provider} />
            <TextFieldWidget
              fieldName="merchantId"
              field={children.merchantId}
            />
            <TextFieldWidget fieldName="offerId" field={children.offerId} />
            <SelectFieldWidget fieldName="currency" field={children.currency} />
            <SelectFieldWidget
              fieldName="recognition"
              field={children.recognition}
            />
            <MappingOption
              name="receivableAccountId"
              label={t("receivable")}
              value={form.watch("receivableAccountId")}
              options={requiredOptions.receivableAccountId}
              onSelect={(value) =>
                form.setValue("receivableAccountId", value, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            />
            <MappingOption
              name="clearingAccountId"
              label={t("clearing")}
              value={form.watch("clearingAccountId")}
              options={requiredOptions.clearingAccountId}
              onSelect={(value) =>
                form.setValue("clearingAccountId", value, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            />
            <MappingOption
              name="considerationAccountId"
              label={t("consideration")}
              value={form.watch("considerationAccountId")}
              options={requiredOptions.considerationAccountId}
              onSelect={(value) =>
                form.setValue("considerationAccountId", value, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            />
            <MappingOption
              name="vatAccountId"
              label={t("vat")}
              value={form.watch("vatAccountId")}
              options={requiredOptions.vatAccountId}
              hint={
                scopeReady && accounts && !requiredOptions.vatAccountId.length
                  ? t("noVatAccount")
                  : undefined
              }
              onSelect={(value) =>
                form.setValue("vatAccountId", value, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            />
            <MappingOption
              name="expenseAccountId"
              label={t("expense")}
              value={form.watch("expenseAccountId")}
              options={requiredOptions.expenseAccountId}
              onSelect={(value) =>
                form.setValue("expenseAccountId", value, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            />
          </Div>
          <BooleanFieldWidget
            fieldName="allowUnstatedZeroTax"
            field={children.allowUnstatedZeroTax}
          />
          <FormAlertWidget field={{}} />
          <SubmitButtonWidget
            field={{ text: "saveOffer", className: "self-end" }}
          />
        </>
      )}
    </WidgetShell>
  );
}
