"use client";

import { Badge } from "next-vibe/ui/ui/badge";
import { Button } from "next-vibe/ui/ui/button";
import { Div } from "next-vibe/ui/ui/div";
import { CheckCircle } from "next-vibe/ui/ui/icons/CheckCircle";
import { ChevronLeft } from "next-vibe/ui/ui/icons/ChevronLeft";
import { Info } from "next-vibe/ui/ui/icons/Info";
import { Span } from "next-vibe/ui/ui/span";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetForm,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { NumberFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/number-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { TextareaFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/textarea-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX, useEffect, useMemo } from "react";

import { scopedTranslation as coaScopedTranslation } from "../../../i18n";
import { getCachedAccount } from "../../_shared/account-picker-cache";
import type getDefinition from "../get/definition";
import type definition from "./definition";

// Map account type enum keys → badge color classes
const TYPE_COLOR: Record<string, string> = {
  "enums.accountType.ASSET":
    "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  "enums.accountType.LIABILITY":
    "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  "enums.accountType.EQUITY":
    "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  "enums.accountType.REVENUE":
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  "enums.accountType.EXPENSE":
    "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
};

export function CoaAccountUpdateWidget({
  field,
}: {
  field: (typeof definition.PATCH)["fields"];
}): JSX.Element {
  // When opened via prefillFromGet, useWidgetValue returns the GET response
  // (result.id, result.name, result.code, etc.) before any PATCH fires.
  // After a successful PATCH, it returns { updated: true }.
  const rawData = useWidgetValue<typeof definition.PATCH>();

  // GET response shape: { result: { id, code, name, type, subtype, isSystem, isActive, ... } }
  // Cast to GET response to extract context fields for the header (prefillFromGet path)
  const getResponseData = rawData as
    | (typeof getDefinition.GET)["types"]["ResponseOutput"]
    | null
    | undefined;
  const prefillAccount = getResponseData?.result;

  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.PATCH>();
  const form = useWidgetForm();
  const locale = useWidgetLocale();
  const { t: tCoa } = coaScopedTranslation.scopedT(locale);

  const accountId = form?.watch("accountId") as string | undefined;
  const hasAccount =
    accountId !== undefined && accountId !== null && accountId !== "";

  // Detect success: PATCH response is { updated: true }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isSuccess = (rawData as any)?.updated !== undefined;

  // Account context: prefillFromGet > picker cache > nothing
  // The picker cache is populated by the list widget when onPick fires.
  const account = useMemo(() => {
    if (prefillAccount) {
      return prefillAccount;
    }
    if (accountId) {
      return getCachedAccount(accountId) ?? null;
    }
    return null;
  }, [prefillAccount, accountId]);

  // When GET data arrives (prefillFromGet), populate editable form fields
  useEffect(() => {
    if (!prefillAccount || !form) {
      return;
    }
    if (prefillAccount.name) {
      form.setValue("name", prefillAccount.name);
    }
    if (prefillAccount.description) {
      form.setValue("description", prefillAccount.description);
    }
    if (
      prefillAccount.sortOrder !== undefined &&
      prefillAccount.sortOrder !== null
    ) {
      form.setValue("sortOrder", prefillAccount.sortOrder);
    }
  }, [prefillAccount, form]);

  // When picker sets accountId and we have cache data, pre-fill form fields
  useEffect(() => {
    if (prefillAccount || !accountId || !form) {
      return;
    }
    const cached = getCachedAccount(accountId);
    if (!cached) {
      return;
    }
    if (cached.name) {
      form.setValue("name", cached.name);
    }
    if (cached.description) {
      form.setValue("description", cached.description);
    }
    if (cached.sortOrder !== undefined && cached.sortOrder !== null) {
      form.setValue("sortOrder", cached.sortOrder);
    }
  }, [prefillAccount, accountId, form]);

  // Success state
  if (isSuccess) {
    return (
      <Div className="flex flex-col gap-4">
        {navigation.canGoBack && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => navigation.pop()}
            className="self-start gap-1.5 -ml-1"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("patch.widget.back")}
          </Button>
        )}
        <Div className="rounded-md border border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30 p-4 flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <Div className="flex flex-col gap-0.5">
            <Span className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
              {t("patch.widget.successTitle")}
            </Span>
            <Span className="text-sm text-emerald-700 dark:text-emerald-300">
              {t("patch.widget.successDesc")}
            </Span>
          </Div>
        </Div>
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-5">
      {navigation.canGoBack && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigation.pop()}
          className="self-start gap-1.5 -ml-1"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("patch.widget.back")}
        </Button>
      )}

      {/* Account picker — hidden when pre-filled by navigation (initiallyFilled check in widget) */}
      <EntityPickerFieldWidget
        fieldName="accountId"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        field={field.children.accountId as any}
      />

      {hasAccount && (
        <>
          {/* Account context header — shows what you're editing */}
          {account && (
            <Div className="rounded-md border bg-muted/30 p-4 flex flex-col gap-3">
              <Div className="flex items-baseline gap-3">
                {account.code && (
                  <Span className="font-mono text-sm font-semibold text-muted-foreground shrink-0">
                    {account.code}
                  </Span>
                )}
                <Span className="text-base font-bold leading-tight">
                  {account.name}
                </Span>
              </Div>

              <Div className="flex flex-wrap gap-2 items-center">
                {account.type && (
                  <Span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      TYPE_COLOR[account.type] ??
                      "bg-muted text-muted-foreground"
                    }`}
                  >
                    {tCoa(account.type as Parameters<typeof tCoa>[0])}
                  </Span>
                )}
                {account.subtype && (
                  <Badge variant="secondary" className="text-xs">
                    {tCoa(account.subtype as Parameters<typeof tCoa>[0])}
                  </Badge>
                )}
                {account.isActive === false && (
                  <Badge variant="destructive" className="text-xs">
                    {t("patch.widget.inactiveNotice")}
                  </Badge>
                )}
                {account.isSystem === true && (
                  <Badge variant="outline" className="text-xs">
                    {t("patch.isSystem.label")}
                  </Badge>
                )}
              </Div>

              {/* System account notice */}
              {account.isSystem === true && (
                <Div className="flex items-start gap-2 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-3 py-2">
                  <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                  <Span className="text-xs text-amber-800 dark:text-amber-300">
                    {t("patch.widget.systemNotice")}
                  </Span>
                </Div>
              )}
            </Div>
          )}

          {/* Editable fields */}
          <Div className="flex flex-col gap-4">
            <TextFieldWidget
              fieldName="name"
              field={withValue(field.children.name, undefined, null)}
            />
            <TextareaFieldWidget
              fieldName="description"
              field={withValue(field.children.description, undefined, null)}
            />
            <NumberFieldWidget
              fieldName="sortOrder"
              field={withValue(field.children.sortOrder, undefined, null)}
            />
          </Div>
        </>
      )}

      <FormAlertWidget field={{}} />
      {hasAccount && (
        <SubmitButtonWidget<typeof definition.PATCH>
          field={{ text: "patch.widget.submit" as const }}
        />
      )}
    </Div>
  );
}
