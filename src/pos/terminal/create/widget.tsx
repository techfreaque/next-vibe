"use client";

import { Button } from "next-vibe/ui/components/button";
import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Label } from "next-vibe/ui/components/label";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { SectionGroup } from "next-vibe/ui/components/section-group";
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
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import { CurrencySelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/currency-select-field/widget";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX, useEffect, useId, useMemo } from "react";
import { useWatch } from "react-hook-form";
import { z } from "zod";

import accountListDefinition from "@/chart-of-accounts/account/list/definition";
import { AccountSubtype } from "@/chart-of-accounts/enum";
import { useWorkspaceCompany } from "@/companies/_shared/workspace-company-context";
import warehouseDefinition from "@/inventory/warehouse/list/definition";

import { posTerminalNameMap } from "../list/widget";
import type definition from "./definition";

interface PosTerminalCreateWidgetProps {
  field: (typeof definition.POST)["fields"];
}

const NONE = "none";

function accountLabel(account: { code: string; name: string }): string {
  return `${account.code} · ${account.name}`;
}

export function PosTerminalCreateWidget({
  field,
}: PosTerminalCreateWidgetProps): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const isInteractive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const interactive = isInteractive && !responseOnly;
  const workspace = useWorkspaceCompany();
  const result = data?.result;
  const fields = field.children.details.children;

  const warehousePickerId = useId();
  const cashPickerId = useId();
  const companyId = useWatch({
    control: form.control,
    name: "details.companyId",
  });
  const warehouseId = useWatch({
    control: form.control,
    name: "details.warehouseId",
  });
  const cashAccountNodeId = useWatch({
    control: form.control,
    name: "details.cashAccountNodeId",
  });
  const currency = useWatch({
    control: form.control,
    name: "details.currency",
  });
  const scopeReady = z.uuid().safeParse(companyId).success;
  const company = workspace?.companies.find(({ id }) => id === companyId);
  const loadScope = interactive && scopeReady && !result;

  const warehouseOptions = useMemo(
    () => ({
      read: {
        initialState: { companyId },
        queryOptions: { enabled: loadScope },
      },
    }),
    [companyId, loadScope],
  );
  const warehouseRows = useEndpoint(
    warehouseDefinition,
    warehouseOptions,
    logger,
    user,
  ).read?.data?.warehouses;

  // Only postable cash and bank accounts of this company can hold a drawer.
  const accountOptions = useMemo(
    () => ({
      read: {
        initialState: {
          companyId,
          postableOnly: true,
          subtypes: [AccountSubtype.CASH, AccountSubtype.BANK],
          page: 1,
          pageSize: 100,
        },
        queryOptions: { enabled: loadScope },
      },
    }),
    [companyId, loadScope],
  );
  const cashAccounts = useEndpoint(
    accountListDefinition,
    accountOptions,
    logger,
    user,
  ).read?.data?.accounts;

  // Seed the till currency from the company once it is known.
  const companyCurrency = company?.currency ?? undefined;
  useEffect(() => {
    if (interactive && !result && companyCurrency && !currency) {
      form.setValue("details.currency", companyCurrency, { shouldDirty: true });
    }
  }, [companyCurrency, currency, form, interactive, result]);

  const back = (): void => {
    if (navigation.canGoBack) {
      navigation.pop();
      return;
    }
    void import("../list/definition").then((def) =>
      navigation.push(def.default.GET, {}),
    );
  };

  const openTill = (terminalId: string, name: string): void => {
    posTerminalNameMap.set(terminalId, name);
    void Promise.all([
      import("../../session/open/definition"),
      import("../../session/[sessionId]/register/definition"),
    ]).then(([openDef, registerDef]) =>
      navigation.push(openDef.default.POST, {
        data: { details: { terminalId, openingFloat: 0 } },
        replaceOnSuccess: {
          endpoint: registerDef.default.GET,
          getUrlPathParams: (response) => ({ sessionId: response.result.id }),
        },
      }),
    );
  };

  const backButton =
    interactive && navigation.canGoBack ? (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => navigation.pop()}
        className="-ml-1 gap-1.5"
      >
        <ChevronLeft className="h-4 w-4" />
        {t("terminalCreate.post.widget.back")}
      </Button>
    ) : undefined;

  if (result?.id) {
    return (
      <WidgetShell layout="page" className="mx-auto max-w-3xl">
        <WidgetHeader size="page" title={result.name} backButton={backButton} />
        <ResultBanner
          variant="success"
          title={t("terminalCreate.post.success.title")}
          message={t("terminalCreate.post.success.description")}
        >
          <DetailGrid columns={3}>
            <DetailField
              label={t("terminalCreate.post.name.label")}
              value={result.name}
            />
            <DetailField
              label={t("terminalCreate.post.currency.label")}
              value={result.currency}
            />
            <DetailField
              label={t("terminalCreate.post.warehouseId.label")}
              value={
                result.warehouseName ??
                t("terminalCreate.post.widget.noWarehouse")
              }
            />
          </DetailGrid>
        </ResultBanner>
        {interactive ? (
          <Div className="flex flex-wrap justify-end gap-2">
            <Button type="button" variant="outline" onClick={back}>
              {t("terminalCreate.post.widget.backToList")}
            </Button>
            <Button
              type="button"
              onClick={() => openTill(result.id, result.name)}
            >
              {t("terminalCreate.post.widget.openTill")}
            </Button>
          </Div>
        ) : null}
      </WidgetShell>
    );
  }

  return (
    <WidgetShell layout="page" className="mx-auto max-w-3xl">
      <WidgetHeader
        size="page"
        title={t("terminalCreate.post.widget.title")}
        subtitle={
          company
            ? t("terminalCreate.post.widget.subtitleCompany", {
                company: company.name,
              })
            : t("terminalCreate.post.widget.subtitle")
        }
        backButton={backButton}
      />

      <FormAlertWidget field={{}} />

      <SectionGroup title={t("terminalCreate.post.widget.sectionTill")}>
        <Div className="grid min-w-0 grid-cols-1 gap-4 @md:grid-cols-2">
          <Div className="min-w-0 @md:col-span-2 empty:hidden">
            <EntityPickerFieldWidget
              fieldName="details.companyId"
              field={fields.companyId}
            />
          </Div>
          <TextFieldWidget
            fieldName="details.name"
            field={withValue(fields.name, undefined, null)}
          />
          <TextFieldWidget
            fieldName="details.location"
            field={withValue(fields.location, undefined, null)}
          />
        </Div>
      </SectionGroup>

      <SectionGroup
        title={t("terminalCreate.post.widget.sectionMoney")}
        subtitle={t("terminalCreate.post.widget.sectionMoneyHint")}
      >
        <Div className="grid min-w-0 grid-cols-1 gap-4 @md:grid-cols-2">
          <CurrencySelectFieldWidget
            fieldName="details.currency"
            field={withValue(fields.currency, undefined, null)}
          />
          <Div className="flex min-w-0 flex-col gap-2">
            <Label htmlFor={cashPickerId}>
              {t("terminalCreate.post.cashAccountNodeId.label")}
            </Label>
            <Select
              value={cashAccountNodeId ?? NONE}
              onValueChange={(value) =>
                form.setValue(
                  "details.cashAccountNodeId",
                  value === NONE ? undefined : value,
                  { shouldDirty: true, shouldValidate: true },
                )
              }
            >
              <SelectTrigger
                id={cashPickerId}
                className="h-10"
                disabled={!scopeReady || !interactive}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>
                  {t("terminalCreate.post.widget.defaultCashAccount")}
                </SelectItem>
                {(cashAccounts ?? []).map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {accountLabel(account)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Span className="text-xs text-muted-foreground">
              {scopeReady
                ? t("terminalCreate.post.cashAccountNodeId.description")
                : t("terminalCreate.post.widget.chooseCompanyFirst")}
            </Span>
          </Div>
        </Div>
      </SectionGroup>

      <SectionGroup
        title={t("terminalCreate.post.widget.sectionStock")}
        subtitle={t("terminalCreate.post.widget.sectionStockHint")}
      >
        <Div className="grid min-w-0 grid-cols-1 gap-4 @md:grid-cols-2">
          <Div className="flex min-w-0 flex-col gap-2">
            <Label htmlFor={warehousePickerId}>
              {t("terminalCreate.post.warehouseId.label")}
            </Label>
            <Select
              value={warehouseId ?? NONE}
              onValueChange={(value) =>
                form.setValue(
                  "details.warehouseId",
                  value === NONE ? undefined : value,
                  { shouldDirty: true, shouldValidate: true },
                )
              }
            >
              <SelectTrigger
                id={warehousePickerId}
                className="h-10"
                disabled={!scopeReady || !interactive}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>
                  {t("terminalCreate.post.widget.noWarehouse")}
                </SelectItem>
                {(warehouseRows ?? []).map((row) =>
                  row.isActive ? (
                    <SelectItem key={row.id} value={row.id}>
                      {row.name}
                    </SelectItem>
                  ) : null,
                )}
              </SelectContent>
            </Select>
            <Span className="text-xs text-muted-foreground">
              {scopeReady
                ? t("terminalCreate.post.warehouseId.description")
                : t("terminalCreate.post.widget.chooseCompanyFirst")}
            </Span>
          </Div>
        </Div>
      </SectionGroup>

      <Div className="flex flex-wrap items-center justify-end gap-2">
        {interactive ? (
          <Button type="button" variant="ghost" onClick={back}>
            {t("terminalCreate.post.widget.cancel")}
          </Button>
        ) : null}
        <SubmitButtonWidget<typeof definition.POST>
          field={{ text: "terminalCreate.post.widget.submit" }}
        />
      </Div>
    </WidgetShell>
  );
}
