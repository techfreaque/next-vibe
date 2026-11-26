"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
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
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { BooleanFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/boolean-field/widget";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import { DocumentScopePicker } from "@/finance/document-list-ui";

import { BankAccountPicker } from "../bank/account-picker";
import { BankPageHeader } from "../bank/page-header";
import type definition from "./definition";

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
          {companyId && (
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
                  variant="outline"
                  onClick={() =>
                    void import("./definition").then((m) =>
                      push(m.default.POST, {
                        data: {
                          companyId,
                          feedId: feed.id,
                          accountId: feed.accountId ?? undefined,
                          startDay: feed.startDay,
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
  const preview = form.watch("dryRun");
  const setup = form.watch("setupOnly");
  const navigation = useWidgetNavigation();
  const result = data?.result;
  return (
    <WidgetShell layout="page">
      <BankPageHeader title={t("sync")} subtitle={t("dailyHint")} />
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
      {interactive && (
        <>
          <Div className="grid gap-3 @lg:grid-cols-2">
            <DocumentScopePicker
              kind="company"
              required
              value={companyId}
              onSelect={(id) => form.reset({ companyId: id, dryRun: true })}
            />
            <EntityPickerFieldWidget
              fieldName="feedId"
              field={children.feedId}
            />
            <BankAccountPicker
              companyId={companyId}
              accountId={form.watch("accountId")}
              onSelect={(id) => form.setValue("accountId", id)}
            />
            <TextFieldWidget fieldName="startDay" field={children.startDay} />
            <BooleanFieldWidget
              fieldName="setupOnly"
              field={children.setupOnly}
            />
            {!setup && (
              <BooleanFieldWidget fieldName="dryRun" field={children.dryRun} />
            )}
            {!setup && (
              <BooleanFieldWidget
                fieldName="matchedOnly"
                field={children.matchedOnly}
              />
            )}
            <BooleanFieldWidget fieldName="daily" field={children.daily} />
          </Div>
          <SubmitButtonWidget
            field={{
              text: setup ? "setup" : preview ? "previewAction" : "apply",
              className: "self-start",
            }}
          />
        </>
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
