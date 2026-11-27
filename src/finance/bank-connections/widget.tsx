"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Input } from "next-vibe/ui/components/input";
import { Label } from "next-vibe/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe/ui/components/select";
import { Span } from "next-vibe/ui/components/span";
import { H2, P } from "next-vibe/ui/components/typography";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { useSearchParams } from "next-vibe/ui/hooks/use-navigation";
import {
  formatDocDate,
  formatMoney,
} from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetIsSubmitting,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import { BooleanFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/boolean-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { type JSX, useId, useMemo } from "react";

import { DocumentScopePicker } from "@/finance/document-list-ui";

import { BankAccountPicker } from "../bank/account-picker";
import { BankPageHeader } from "../bank/page-header";
import definition from "./definition";

export function BankFeedListWidget(): JSX.Element {
  const t = useWidgetTranslation<typeof definition.GET>();
  const data = useWidgetValue<typeof definition.GET>();
  const locale = useWidgetLocale();
  const form = useWidgetForm<typeof definition.GET>();
  const submit = useWidgetOnSubmit();
  const { push } = useWidgetNavigation();
  const responseOnly = useWidgetResponseOnly();
  const interactive = useWidgetIsInteractive() && !responseOnly;
  const companyId = form.watch("companyId");
  const notice = useSearchParams().get("bankConsent");
  const accounts = data?.feeds ?? [];
  return (
    <WidgetShell layout="page">
      <BankPageHeader
        title={t("title")}
        subtitle={t("description")}
        actions={
          interactive && companyId ? (
            <Button
              variant={accounts.length ? "outline" : "default"}
              type="button"
              size="sm"
              onClick={() =>
                void import("./enable-banking/connect/definition").then((m) =>
                  push(m.default.POST, { data: { companyId } }),
                )
              }
            >
              {t("connect")}
            </Button>
          ) : undefined
        }
      />
      {notice === "connected" || notice === "failed" ? (
        <P
          className={
            notice === "connected"
              ? "text-sm text-success"
              : "text-sm text-destructive"
          }
        >
          {t(notice)}
        </P>
      ) : null}
      {interactive && (
        <Div className="flex flex-wrap items-center gap-3">
          <DocumentScopePicker
            kind="company"
            required
            value={companyId}
            onSelect={(id) => {
              form.reset({ companyId: id, checkApplication: false });
              submit?.();
            }}
          />
          {companyId && notice !== "connected" && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                form.setValue("checkApplication", true);
                submit?.();
              }}
            >
              {t("check")}
            </Button>
          )}
        </Div>
      )}
      <FormAlertWidget field={{}} />
      {data?.application && (
        <P className="text-sm">
          {t(
            data.application === "unavailable"
              ? "appUnavailable"
              : data.application,
          )}
        </P>
      )}
      {data && !accounts.length && (
        <Div className="space-y-2 rounded-lg border bg-card p-5">
          <P className="font-medium">{t("empty")}</P>
          <P className="max-w-prose text-sm text-muted-foreground">
            {t("linking")}
          </P>
        </Div>
      )}
      {accounts.map((feed) => (
        <Div
          key={feed.id}
          className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card p-4"
        >
          <Div className="min-w-0 space-y-1">
            <P className="font-medium">
              {feed.name} {feed.currency}
            </P>
            <P className="text-sm text-muted-foreground">
              {t("consentUntil")} {formatDocDate(feed.consentUntil, locale)}
            </P>
            {feed.accountId && !feed.privacyConfigured && (
              <P className="max-w-prose text-sm font-medium">
                {t("privacyBeforeImport")}
              </P>
            )}
            {feed.through && (
              <P className="text-sm text-muted-foreground">
                {t("through")} {formatDocDate(feed.through, locale)}
              </P>
            )}
          </Div>
          {interactive && (
            <Div className="flex flex-wrap gap-2">
              {(!feed.accountId || feed.privacyConfigured) && (
                <Button
                  type="button"
                  size="sm"
                  variant="default"
                  onClick={() =>
                    void import("./definition").then((m) =>
                      push(m.default.POST, {
                        data: {
                          companyId,
                          feedId: feed.id,
                          accountId: feed.accountId ?? feed.suggestedAccountId,
                          startDay:
                            feed.startDay ??
                            new Date().toISOString().slice(0, 10),
                          setupOnly: !feed.accountId,
                          dryRun: true,
                          daily: feed.daily,
                        },
                      }),
                    )
                  }
                >
                  {t(feed.accountId ? "previewAction" : "setup")}
                </Button>
              )}
              {feed.accountId && (
                <Button
                  type="button"
                  size="sm"
                  variant={feed.privacyConfigured ? "outline" : "default"}
                  onClick={() =>
                    void import("./privacy/definition").then(
                      ({ default: privacy }) => {
                        if (feed.privacyConfigured) {
                          return push(privacy.GET, {
                            data: { connectionId: feed.id },
                          });
                        } else {
                          return push(privacy.PATCH, {
                            data: {
                              connectionId: feed.id,
                              firstSetup: true,
                              mode: "mixed",
                              operation: "policy",
                            },
                          });
                        }
                      },
                    )
                  }
                >
                  {t(feed.privacyConfigured ? "review" : "privacyAction")}
                </Button>
              )}
            </Div>
          )}
        </Div>
      ))}
    </WidgetShell>
  );
}

export function BankFeedSyncWidget({
  field: { children },
}: {
  field: typeof definition.POST.fields;
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const locale = useWidgetLocale();
  const data = useWidgetValue<typeof definition.POST>();
  const responseOnly = useWidgetResponseOnly();
  const interactive = useWidgetIsInteractive() && !responseOnly;
  const companyId = form.watch("companyId");
  const startDayId = useId();
  const feedId = form.watch("feedId");
  const accountId = form.watch("accountId");
  const readOptions = useMemo(
    () => ({
      read: {
        initialState: {
          companyId,
          directoryCountry: undefined,
          directoryPersonal: undefined,
        },
        queryOptions: { enabled: interactive && Boolean(companyId) },
        formOptions: { persistForm: false },
      },
    }),
    [companyId, interactive],
  );
  const feedRead = useEndpoint(
    { GET: definition.GET },
    readOptions,
    useWidgetLogger(),
    useWidgetUser(),
  ).read;
  const feeds = feedRead?.data?.feeds;
  const feed = feeds?.find((row) => row.id === feedId);
  const setup = feed ? !feed.accountId : form.watch("setupOnly");
  const submit = useWidgetOnSubmit();
  const submitting = useWidgetIsSubmitting();
  const start = (dryRun: boolean): void => {
    form.setValue("dryRun", dryRun);
    form.setValue("matchedOnly", true);
    form.setValue("setupOnly", Boolean(setup));
    submit?.();
  };
  const navigation = useWidgetNavigation();
  const result = data?.result;
  return (
    <WidgetShell layout="page">
      <BankPageHeader
        title={t(setup || result?.setupFeedId ? "setup" : "sync")}
        subtitle={t(setup || result?.setupFeedId ? "setupHint" : "dailyHint")}
      />
      {result && !result.setupFeedId && (
        <Div className="space-y-4 rounded-lg border bg-card p-4">
          <Div className="space-y-1">
            <H2 className="text-base font-semibold">
              {t(result.preview ? "previewResult" : "importResult")}
            </H2>
            {result.bankAccountName && (
              <P className="text-sm break-words">{result.bankAccountName}</P>
            )}
            <P className="text-sm text-muted-foreground">
              {result.from === result.to
                ? t("bookingDay", { date: formatDocDate(result.from, locale) })
                : t("bookingWindow", {
                    from: formatDocDate(result.from, locale),
                    to: formatDocDate(result.to, locale),
                  })}
            </P>
          </Div>
          <Div className="grid max-w-xl gap-2">
            {(
              [
                { label: "providerBookings", count: result.providerBookings },
                { label: "eligibleBookings", count: result.eligibleBookings },
                {
                  label: "savedBookings",
                  count: result.preview ? 0 : result.imported,
                },
                { label: "skipped", count: result.skipped || undefined },
                {
                  label: "autoMatched",
                  count: result.preview ? undefined : result.autoMatched,
                },
                { label: "held", count: result.held || undefined },
                {
                  label: "privateCount",
                  count: result.privateCount || undefined,
                },
                { label: "discardedCount", count: result.discardedCount },
              ] as const
            ).map(({ label, count }) =>
              count === undefined ? null : (
                <Div
                  key={label}
                  className="flex justify-between gap-4 border-b pb-2 text-sm"
                >
                  <Span>{t(label)}</Span>
                  <Span className="tabular-nums">{count}</Span>
                </Div>
              ),
            )}
          </Div>
          <P className="max-w-prose text-sm text-muted-foreground">
            {t(result.preview ? "previewPrivacyResult" : "importPrivacyResult")}
          </P>
          {result.suppliers?.length > 0 && (
            <Div className="space-y-2 border-t pt-3">
              <P className="font-medium">{t("supplierTotals")}</P>
              {result.suppliers.map((row) => (
                <Div
                  key={(row.supplierId ?? row.name) + row.currency}
                  className="flex justify-between gap-3 text-sm"
                >
                  <Span className="min-w-0 break-words">{row.name}</Span>
                  <Span className="whitespace-nowrap tabular-nums">
                    {formatMoney(row.amount, row.currency, locale)}
                  </Span>
                </Div>
              ))}
            </Div>
          )}
        </Div>
      )}
      {interactive && !result && (
        <Div className="flex max-w-xl flex-col gap-4 rounded-xl border bg-card p-4">
          <DocumentScopePicker
            kind="company"
            required
            value={companyId}
            onSelect={(id) =>
              form.reset({ companyId: id, dryRun: true, matchedOnly: true })
            }
          />
          {feed ? (
            <P className="font-semibold">
              {feed.name} {feed.currency}
            </P>
          ) : (
            <Select
              value={feedId ?? ""}
              onValueChange={(id) => {
                const selected = feeds?.find((row) => row.id === id);
                form.reset({
                  companyId,
                  feedId: id,
                  accountId:
                    selected?.accountId ?? selected?.suggestedAccountId,
                  startDay:
                    selected?.startDay ?? new Date().toISOString().slice(0, 10),
                  dryRun: true,
                  matchedOnly: true,
                  setupOnly: !selected?.accountId,
                });
              }}
            >
              <SelectTrigger aria-label={t("select")}>
                <SelectValue placeholder={t("select")} />
              </SelectTrigger>
              <SelectContent>
                {feeds?.map((row) => (
                  <SelectItem value={row.id} key={row.id}>
                    {row.name} {row.currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {setup ? (
            <>
              <BankAccountPicker
                companyId={companyId}
                accountId={accountId}
                accountName={
                  feed?.suggestedAccountId === accountId
                    ? feed?.ledgerLabel
                    : undefined
                }
                onSelect={(id) => form.setValue("accountId", id)}
              />
              <Div className="space-y-1">
                <Label htmlFor={startDayId}>{t(children.startDay.label)}</Label>
                <Input
                  id={startDayId}
                  type="date"
                  value={form.watch("startDay") ?? ""}
                  onChangeText={(value) =>
                    form.setValue("startDay", value || undefined, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                />
              </Div>
            </>
          ) : (
            feed && (
              <>
                <P>{feed.ledgerLabel}</P>
                <P className="text-sm text-muted-foreground">
                  {t("matchedOnly")}
                </P>
                {feed.through && (
                  <BooleanFieldWidget
                    fieldName="daily"
                    field={children.daily}
                  />
                )}
              </>
            )
          )}
          <Button
            data-testid="endpoint-submit"
            type="button"
            disabled={submitting || !feed || !accountId}
            onClick={() => start(true)}
          >
            {t(setup ? "setup" : "previewAction")}
          </Button>
        </Div>
      )}
      {interactive && result && !result.setupFeedId && (
        <Div className="flex flex-wrap gap-2">
          {result.preview && (
            <Button
              type="button"
              disabled={submitting}
              onClick={() => start(false)}
            >
              {t(
                (result.eligibleBookings ?? result.imported) > result.skipped
                  ? "apply"
                  : "finishPeriod",
              )}
            </Button>
          )}
          {!result.preview && (
            <Button
              type="button"
              onClick={() =>
                void import("../bank/list/definition").then((m) =>
                  navigation.push(m.default.GET, {
                    data: { companyId, accountId, status: "all" },
                  }),
                )
              }
            >
              {t("viewTransactions")}
            </Button>
          )}
          {result.preview && (
            <Button
              variant="outline"
              type="button"
              onClick={() =>
                void import("./privacy/definition").then((m) =>
                  navigation.push(m.default.GET, {
                    data: { connectionId: feedId },
                  }),
                )
              }
            >
              {t("privacyAction")}
            </Button>
          )}
        </Div>
      )}
      <FormAlertWidget field={{}} />
      {result?.setupFeedId && (
        <Div className="flex flex-wrap items-center gap-3 rounded-lg border bg-card p-4">
          <P>{t("setupSaved")}</P>
          {interactive && (
            <Button
              type="button"
              size="sm"
              onClick={() =>
                void import("./privacy/definition").then((m) =>
                  navigation.push(m.default.PATCH, {
                    data: {
                      connectionId: result.setupFeedId,
                      companyId,
                      firstSetup: true,
                      mode: "mixed",
                      operation: "policy",
                    },
                  }),
                )
              }
            >
              {t("privacyAction")}
            </Button>
          )}
        </Div>
      )}
    </WidgetShell>
  );
}
