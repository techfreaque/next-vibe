"use client";

import { Platform } from "next-vibe/platforms/platforms";
import { Button } from "next-vibe/ui/components/button";
import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { Div } from "next-vibe/ui/components/div";
import { Label } from "next-vibe/ui/components/label";
import { ExternalLink } from "next-vibe/ui/components/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe/ui/components/select";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  useWidgetForm,
  useWidgetIsSubmitting,
  useWidgetLogger,
  useWidgetOnSubmit,
  useWidgetPlatform,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import { BooleanFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/boolean-field/widget";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { type JSX, useId, useMemo } from "react";
import { z } from "zod";

import accountsDefinition from "@/chart-of-accounts/account/list/definition";
import { AccountSubtype } from "@/chart-of-accounts/enum";

import type definition from "./definition";

export function ConnectBankWidget({
  field: { children },
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const data = useWidgetValue<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const controlId = useId();
  const companyId = form.watch("companyId");
  const scopeReady = !data?.url && z.uuid().safeParse(companyId).success;
  const accountOptions = useMemo(
    () => ({
      read: {
        initialState: { companyId, postableOnly: true, page: 1, pageSize: 200 },
        queryOptions: { enabled: scopeReady },
      },
    }),
    [companyId, scopeReady],
  );
  const accounts =
    useEndpoint(
      accountsDefinition,
      accountOptions,
      logger,
      user,
    ).read?.data?.accounts?.filter(
      ({ isActive, isPostable, subtype }) =>
        isActive && isPostable && subtype === AccountSubtype.BANK,
    ) ?? [];
  const accountId = form.watch("ledgerAccountId");
  const country = form.watch("bankCountry");
  const bankName = form.watch("bankName");
  const onSubmit = useWidgetOnSubmit();
  const submitting = useWidgetIsSubmitting();
  const platform = useWidgetPlatform();
  const isCli = platform === Platform.CLI || platform === Platform.MCP;
  const canStart =
    accounts.some(({ id }) => id === accountId) &&
    /^[a-z]{2}$/iu.test(country?.trim() ?? "") &&
    Boolean(bankName?.trim());
  return (
    <WidgetShell layout="page">
      <Div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
        <WidgetHeader
          size="page"
          title={t(data?.url ? "ready" : "title")}
          subtitle={t(data?.url ? "continueDescription" : "description")}
        />
        {data?.url ? (
          <>
            <DetailGrid columns={2}>
              <DetailField label={t("bankName")} value={data.authorizedBank} />
              <DetailField
                label={t("ledgerAccount")}
                value={data.authorizedLedgerAccount}
              />
            </DetailGrid>
            <ExternalLink
              href={data.url}
              rel="noreferrer"
              target="_self"
              className="self-start rounded-md bg-primary px-4 py-2 text-primary-foreground"
            >
              {t("authorize")}
            </ExternalLink>
          </>
        ) : (
          <>
            <Div className="grid grid-cols-1 items-start gap-4">
              <EntityPickerFieldWidget
                fieldName="companyId"
                field={children.companyId}
              />
              <Div data-field="ledgerAccountId" className="flex flex-col gap-2">
                <Label htmlFor={controlId}>{t("ledgerAccount")}</Label>
                <Select
                  value={form.watch("ledgerAccountId") ?? ""}
                  onValueChange={(id) =>
                    form.setValue("ledgerAccountId", id, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger id={controlId} disabled={!accounts.length}>
                    <SelectValue placeholder={t("ledgerAccount")} />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Div>
              <TextFieldWidget
                fieldName="bankCountry"
                field={children.bankCountry}
              />
              <TextFieldWidget fieldName="bankName" field={children.bankName} />
            </Div>
            <BooleanFieldWidget
              fieldName="personal"
              field={children.personal}
            />
            <FormAlertWidget field={{}} />
            <Button
              type="submit"
              data-testid="endpoint-submit"
              className="self-start"
              disabled={!canStart || submitting}
              onClick={
                isCli && onSubmit
                  ? () => {
                      onSubmit();
                    }
                  : undefined
              }
            >
              {t(submitting ? "starting" : "start")}
            </Button>
          </>
        )}
      </Div>
    </WidgetShell>
  );
}
