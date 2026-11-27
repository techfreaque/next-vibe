"use client";

import { Platform } from "next-vibe/platforms/platforms";
import { Button } from "next-vibe/ui/components/button";
import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { Div } from "next-vibe/ui/components/div";
import { Input } from "next-vibe/ui/components/input";
import { Label } from "next-vibe/ui/components/label";
import { ExternalLink } from "next-vibe/ui/components/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe/ui/components/select";
import { P } from "next-vibe/ui/components/typography";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  useWidgetForm,
  useWidgetIsSubmitting,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetPlatform,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import {
  type EndpointReturn,
  useEndpoint,
} from "next-vibe/unified-ui/hooks/use-endpoint";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { type JSX, useId, useMemo, useState } from "react";

import accountsDefinition from "@/chart-of-accounts/account/list/definition";
import { AccountSubtype, AccountType } from "@/chart-of-accounts/enum";
import { DocumentScopePicker } from "@/finance/document-list-ui";

import feedDefinition from "../../definition";
import type definition from "./definition";

function useDirectory(
  companyId: string,
  country: string,
  personal: boolean,
  enabled: boolean,
): EndpointReturn<{ GET: typeof feedDefinition.GET }>["read"] {
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const options = useMemo(
    () => ({
      read: {
        initialState: {
          companyId,
          directoryCountry: country,
          directoryPersonal: personal,
        },
        formOptions: { persistForm: false },
        queryOptions: { enabled: enabled && Boolean(companyId && country) },
      },
    }),
    [companyId, country, personal, enabled],
  );
  return useEndpoint({ GET: feedDefinition.GET }, options, logger, user).read;
}

function BankSelection({
  companyId,
  onNext,
}: {
  companyId: string;
  onNext: () => void;
}): JSX.Element {
  const form = useWidgetForm<typeof definition.POST>();
  const t = useWidgetTranslation<typeof definition.POST>();
  const locale = useWidgetLocale();
  const region = useMemo(
    () => new Intl.DisplayNames([locale.split("-")[0]], { type: "region" }),
    [locale],
  );
  const id = useId();
  const [search, setSearch] = useState("");
  const country = form.watch("bankCountry") ?? "";
  const personal = form.watch("personal") ?? true;
  const bank = form.watch("bankName");
  const countryRead = useDirectory(companyId, "countries", true, true);
  const countries = countryRead?.data?.directory;
  const bankRead = useDirectory(
    companyId,
    country,
    personal,
    countries?.choices.includes(country) ?? false,
  );
  const result = bankRead?.data?.directory;
  const banks =
    result?.country === country && result.personal === personal
      ? result
      : undefined;
  const query = search.trim().toLocaleLowerCase();
  const options =
    banks?.choices
      .filter(
        (name) =>
          name.toLocaleLowerCase().includes(query) ||
          name.toLocaleLowerCase() === query.replace(/\s+bank$/u, ""),
      )
      .slice(0, 20) ?? [];
  const failed =
    !countryRead?.isLoading &&
    (countryRead?.error || (countries && countries.status !== "ready"))
      ? countryRead
      : country &&
          !bankRead?.isLoading &&
          (bankRead?.error || (banks && banks.status !== "ready"))
        ? bankRead
        : undefined;
  return (
    <Div className="flex flex-col gap-4">
      <Div className="grid gap-4 @2xl:grid-cols-2">
        <Div className="min-w-0 space-y-2">
          <Label htmlFor={id}>{t("bankCountry")}</Label>
          <Select
            value={country}
            onValueChange={(value) => {
              form.setValue("bankCountry", value);
              form.setValue("bankName", "");
              setSearch("");
            }}
          >
            <SelectTrigger
              id={id}
              className="min-h-11"
              disabled={!countries?.choices.length}
            >
              <SelectValue placeholder={t("bankCountry")} />
            </SelectTrigger>
            <SelectContent>
              {countries?.choices
                .map((code) => ({ code, label: region.of(code) ?? code }))
                .toSorted((a, b) =>
                  a.label.localeCompare(b.label, locale.split("-")[0]),
                )
                .map(({ code, label }) => (
                  <SelectItem key={code} value={code}>
                    {label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </Div>
        <Div className="min-w-0 space-y-2">
          <Label htmlFor={`${id}-type`}>{t("psu")}</Label>
          <Select
            value={personal ? "personal" : "business"}
            onValueChange={(value) => {
              form.setValue("personal", value === "personal");
              form.setValue("bankName", "");
              setSearch("");
            }}
          >
            <SelectTrigger id={`${id}-type`} className="min-h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="personal">{t("personal")}</SelectItem>
              <SelectItem value="business">{t("business")}</SelectItem>
            </SelectContent>
          </Select>
        </Div>
      </Div>
      {failed ? (
        <Div className="space-y-2">
          <P>
            {t(
              failed.data?.directory?.status === "unconfigured"
                ? "unconfigured"
                : "directoryUnavailable",
            )}
          </P>
          <Button
            type="button"
            variant="outline"
            onClick={() => void failed.refetch()}
          >
            {t("retry")}
          </Button>
        </Div>
      ) : (!countries || (country && !banks)) && companyId ? (
        <P>{t("loading")}</P>
      ) : null}
      {banks?.status === "ready" && (
        <Div className="space-y-2">
          <Label htmlFor={`${id}-search`}>{t("search")}</Label>
          <Input
            id={`${id}-search`}
            className="min-h-11"
            value={search}
            onChangeText={(value) => {
              setSearch(value);
              form.setValue("bankName", "");
            }}
          />
          <Div className="flex max-h-52 flex-col gap-1 overflow-y-auto">
            {options.map((name) => (
              <Button
                key={name}
                type="button"
                variant={name === bank ? "secondary" : "ghost"}
                aria-pressed={name === bank}
                className="min-h-11 justify-start whitespace-normal text-start"
                onClick={() => {
                  form.setValue("bankName", name);
                  setSearch(name);
                }}
              >
                {name}
              </Button>
            ))}
            {!options.length && (
              <P className="text-sm text-muted-foreground">{t("noBanks")}</P>
            )}
          </Div>
        </Div>
      )}
      <Button
        type="button"
        className="min-h-11 w-full @md:w-auto @md:self-start"
        disabled={!banks?.choices.includes(bank)}
        onClick={onNext}
      >
        {t("next")}
      </Button>
    </Div>
  );
}

export function ConnectBankWidget(): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const data = useWidgetValue<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const logger = useWidgetLogger();
  const navigation = useWidgetNavigation();
  const user = useWidgetUser();
  const controlId = useId();
  const companyId = form.watch("companyId");
  const [ledgerStep, setLedgerStep] = useState(false);
  const accountId = form.watch("ledgerAccountId");
  const accountOptions = useMemo(
    () => ({
      read: {
        initialState: {
          companyId,
          postableOnly: true,
          subtypes: [AccountSubtype.BANK],
          page: 1,
          pageSize: 200,
        },
        queryOptions: {
          enabled: Boolean(companyId) && ledgerStep && !data?.url,
        },
      },
    }),
    [companyId, ledgerStep, data?.url],
  );
  const read = useEndpoint(
    accountsDefinition,
    accountOptions,
    logger,
    user,
  ).read;
  const accounts =
    read?.data?.accounts?.filter(
      (row) =>
        row.companyId === companyId &&
        row.isPostable &&
        row.isActive &&
        row.subtype === AccountSubtype.BANK,
    ) ?? [];
  const onSubmit = useWidgetOnSubmit();
  const submitting = useWidgetIsSubmitting();
  const platform = useWidgetPlatform();
  const isCli = platform === Platform.CLI || platform === Platform.MCP;
  return (
    <WidgetShell layout="page">
      <Div className="mx-auto flex w-full min-w-0 max-w-2xl flex-col gap-5">
        <WidgetHeader
          size="page"
          title={t("title")}
          subtitle={t("description")}
        />
        <Div className="flex flex-col gap-4 rounded-xl border bg-card p-4 @md:p-6">
          <P className="text-sm font-semibold text-muted-foreground">
            {t(
              data?.url
                ? "authorizeStep"
                : ledgerStep
                  ? "ledgerStep"
                  : "bankStep",
            )}
          </P>
          {data?.url ? (
            <>
              <DetailGrid columns={2}>
                <DetailField
                  label={t("bankName")}
                  value={data.authorizedBank}
                />
                <DetailField
                  label={t("ledgerAccount")}
                  value={data.authorizedLedgerAccount}
                />
              </DetailGrid>
              <ExternalLink
                href={data.url}
                rel="noreferrer"
                target="_self"
                className="rounded-md bg-primary px-4 py-3 text-center text-primary-foreground @md:self-start"
              >
                {t("authorize")}
              </ExternalLink>
            </>
          ) : ledgerStep ? (
            <>
              <DetailField
                label={t("bankName")}
                value={form.watch("bankName")}
              />
              <Div className="space-y-2" data-field="ledgerAccountId">
                <Label htmlFor={controlId}>{t("ledgerAccount")}</Label>
                <Select
                  value={accountId ?? ""}
                  onValueChange={(value) =>
                    form.setValue("ledgerAccountId", value, {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger
                    id={controlId}
                    className="min-h-11"
                    disabled={!accounts.length}
                  >
                    <SelectValue placeholder={t("ledgerAccount")} />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((row) => (
                      <SelectItem key={row.id} value={row.id}>
                        {`${row.code} · ${row.name}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {read?.data && !accounts.length && (
                  <P className="text-sm">{t("noLedger")}</P>
                )}
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-11"
                  onClick={() =>
                    void import("@/chart-of-accounts/account/create/definition").then(
                      (m) =>
                        navigation.push(m.default.POST, {
                          renderInModal: true,
                          popNavigationOnSuccess: 1,
                          onSuccessCallback: () => {
                            void read?.refetch();
                          },
                          data: {
                            companyId,
                            type: AccountType.ASSET,
                            subtype: AccountSubtype.BANK,
                          },
                        }),
                    )
                  }
                >
                  {t("createAccount")}
                </Button>
              </Div>
              <Div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  className="min-h-11"
                  onClick={() => setLedgerStep(false)}
                >
                  {t("back")}
                </Button>
                <Button
                  data-testid="endpoint-submit"
                  type="submit"
                  className="min-h-11"
                  disabled={
                    submitting || !accounts.some((row) => row.id === accountId)
                  }
                  onClick={isCli && onSubmit ? () => onSubmit() : undefined}
                >
                  {t(submitting ? "starting" : "start")}
                </Button>
              </Div>
            </>
          ) : (
            <>
              <DocumentScopePicker
                kind="company"
                required
                value={companyId}
                onSelect={(value) =>
                  form.reset({ companyId: value, personal: true })
                }
              />
              <BankSelection
                key={companyId}
                companyId={companyId}
                onNext={() => setLedgerStep(true)}
              />
            </>
          )}
          <FormAlertWidget field={{}} />
        </Div>
      </Div>
    </WidgetShell>
  );
}
