"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { Span } from "next-vibe/ui/components/span";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetForm,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import {
  AdminForm,
  AdminFormSection,
} from "next-vibe/unified-ui/widgets/containers/admin-form/widget";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { NumberFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/number-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { TextareaFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/textarea-field/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX, useEffect, useMemo, useRef } from "react";

import { scopedTranslation as coaScopedTranslation } from "../../../i18n";
import { getCachedAccount } from "../../_shared/account-picker-cache";
import getDefinition from "../get/definition";
import type definition from "./definition";

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
  const logger = useWidgetLogger();
  const user = useWidgetUser();

  const accountId = form?.watch("accountId") as string | undefined;
  const hasAccount =
    accountId !== undefined && accountId !== null && accountId !== "";

  // Detect success: PATCH response is { updated: true }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isSuccess = (rawData as any)?.updated !== undefined;

  // Account context: prefillFromGet > picker cache > fetched by id (a URL
  // opened directly carries only the id).
  const cachedAccount = accountId ? getCachedAccount(accountId) : undefined;
  const needsFetch = !prefillAccount && !cachedAccount && hasAccount;
  const fetchId = accountId ?? "";
  const getOptions = useMemo(
    () => ({
      read: {
        urlPathParams: { accountId: fetchId },
        queryOptions: { enabled: needsFetch },
      },
    }),
    [fetchId, needsFetch],
  );
  const fetchedAccount = useEndpoint(getDefinition, getOptions, logger, user)
    .read?.data?.result;
  const account =
    prefillAccount ??
    cachedAccount ??
    (fetchedAccount?.id === accountId ? fetchedAccount : null);

  // Fill the editable fields once per account, never over the user's edits.
  const filledFor = useRef<string | null>(null);
  useEffect(() => {
    if (!account || !form || !accountId || filledFor.current === accountId) {
      return;
    }
    filledFor.current = accountId;
    if (account.name) {
      form.setValue("name", account.name);
    }
    if (account.description) {
      form.setValue("description", account.description);
    }
    if (account.sortOrder !== undefined && account.sortOrder !== null) {
      form.setValue("sortOrder", account.sortOrder);
    }
  }, [account, form, accountId]);

  const backButton = navigation.canGoBack ? (
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
  ) : undefined;

  if (isSuccess) {
    return (
      <WidgetShell layout="page" className="mx-auto w-full max-w-3xl">
        {backButton}
        <ResultBanner
          variant="success"
          title={t("patch.widget.successTitle")}
          message={t("patch.widget.successDesc")}
        />
      </WidgetShell>
    );
  }

  const title = account?.name
    ? account.code
      ? `${account.code} · ${account.name}`
      : account.name
    : t("patch.title");

  return (
    <AdminForm
      title={title}
      description={account ? t("patch.title") : t("patch.widget.selectPrompt")}
      backButton={backButton}
      primaryAction={
        hasAccount ? (
          <SubmitButtonWidget<typeof definition.PATCH>
            field={{ text: "patch.widget.submit" as const }}
          />
        ) : null
      }
    >
      <EntityPickerFieldWidget
        fieldName="accountId"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        field={field.children.accountId as any}
      />

      {hasAccount && account && (
        <Div className="flex flex-wrap items-center gap-2">
          {account.type && (
            <StatusPill
              status="muted"
              variant="muted"
              label={tCoa(account.type as Parameters<typeof tCoa>[0])}
            />
          )}
          {account.subtype && (
            <StatusPill
              status="muted"
              variant="muted"
              label={tCoa(account.subtype as Parameters<typeof tCoa>[0])}
            />
          )}
          {account.isActive === false && (
            <StatusPill
              status="warning"
              variant="warning"
              label={t("patch.widget.inactiveNotice")}
            />
          )}
          {account.isSystem === true && (
            <Span className="text-sm text-muted-foreground">
              {t("patch.widget.systemNotice")}
            </Span>
          )}
        </Div>
      )}

      {hasAccount && (
        <AdminFormSection title={t("patch.widget.sectionDetails")}>
          <TextFieldWidget
            fieldName="name"
            field={withValue(field.children.name, undefined, null)}
          />
          <TextareaFieldWidget
            fieldName="description"
            field={withValue(field.children.description, undefined, null)}
          />
          <Div className="@md:max-w-48">
            <NumberFieldWidget
              fieldName="sortOrder"
              field={withValue(field.children.sortOrder, undefined, null)}
            />
          </Div>
        </AdminFormSection>
      )}
    </AdminForm>
  );
}
