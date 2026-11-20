/**
 * Finance Status Widget (web, CLI, MCP, AI, native)
 * Provider balances and ingest state, margin summary, recent alerts and the
 * threshold editor. One widget, all platforms.
 */

"use client";

import { Badge } from "next-vibe/ui/components/badge";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { RefreshCw } from "next-vibe/ui/components/icons/RefreshCw";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { Span } from "next-vibe/ui/components/span";
import { H3, P } from "next-vibe/ui/components/typography";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { useRelatedEntityNavigation } from "next-vibe/unified-ui/_shared/related-entities";
import {
  useWidgetEndpointMutations,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetResponse,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import type { JSX } from "react";

import { FINANCE_CONFIG } from "../config";
import { FinanceSource } from "../enum";
import { dayKey, startOfUtcDay } from "../logic";
import type definition from "./definition";

type StatusT = ReturnType<typeof useWidgetTranslation<typeof definition.GET>>;

function Section({
  title,
  count,
  children,
}: {
  title: string;
  count?: number;
  children: JSX.Element | JSX.Element[];
}): JSX.Element {
  return (
    <Div className="flex flex-col gap-2">
      <Div className="flex flex-wrap items-center gap-2">
        <H3 className="text-sm font-semibold">{title}</H3>
        {count !== undefined && (
          <Badge variant={count > 0 ? "secondary" : "outline"}>{count}</Badge>
        )}
      </Div>
      {children}
    </Div>
  );
}

function Empty({ text }: { text: string }): JSX.Element {
  return <P className="text-sm text-muted-foreground">{text}</P>;
}

export function FinanceStatusWidget(): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const t: StatusT = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const { push: navigate, pop, canGoBack } = useWidgetNavigation();
  const mutations = useWidgetEndpointMutations();
  const response = useWidgetResponse();
  const responseOnly = useWidgetResponseOnly();
  const isInteractive = useWidgetIsInteractive() && !responseOnly;
  const openRelated = useRelatedEntityNavigation();

  const money = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    currencyDisplay: "code",
    maximumFractionDigits: 2,
  });
  const pct = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 });
  const when = (iso: string | null): string =>
    iso ? new Date(iso).toLocaleString(locale) : t("status.widget.never");

  const runIngest = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../ingest/definition");
      navigate(def.default.POST, { renderInModal: true });
    })();
  };

  const editThreshold = (
    key: NonNullable<typeof data>["thresholds"][number]["key"],
    value: number,
    enabled: boolean,
    note: string | null,
  ): void => {
    void (async (): Promise<void> => {
      const def = await import("../thresholds/definition");
      navigate(def.default.POST, {
        renderInModal: true,
        popNavigationOnSuccess: 1,
        data: { key, value, enabled, note: note ?? undefined },
      });
    })();
  };

  if (!data) {
    return (
      <WidgetShell>
        <WidgetHeader title={t("status.widget.title")} />
        <FormAlertWidget field={{}} />
        {!response && <LoadingBlock message={t("status.widget.loading")} />}
      </WidgetShell>
    );
  }

  const readingIsStale = (timestamp: string | null, cadence: number): boolean =>
    timestamp !== null &&
    new Date(data.asOf).getTime() - new Date(timestamp).getTime() > 2 * cadence;
  const marginValue = (amount: number): string =>
    data.week.marginDays > 0
      ? money.format(amount)
      : t("status.widget.missingCost");

  const revenue = data.sources.filter((s) => isRevenue(s.source));
  const provs = data.sources.filter((s) => !isRevenue(s.source));

  return (
    <WidgetShell className="min-w-0">
      <Div className="flex min-w-0 flex-col gap-5">
        <WidgetHeader
          title={t("status.widget.title")}
          className="flex-wrap"
          backButton={
            isInteractive && canGoBack ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => pop()}
                className="-ml-1"
                aria-label={t("status.widget.back")}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            ) : undefined
          }
          actions={
            isInteractive && (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => void mutations?.read?.refetch?.()}
                  aria-label={t("status.widget.refresh")}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button type="button" size="sm" onClick={runIngest}>
                  {t("status.widget.runIngest")}
                </Button>
              </>
            )
          }
        />
        <FormAlertWidget field={{}} />
        <Div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <Span>
            {t("status.widget.lastIngest", { when: when(data.lastIngestAt) })}
          </Span>
          <Span>
            {t("status.widget.lastSuccessful", {
              when: when(data.lastSuccessfulIngestAt),
            })}
          </Span>
        </Div>
        {isInteractive && (
          <SectionGroup title={t("documents.heading")}>
            <Div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() =>
                  openRelated(() =>
                    import("@/payment/invoice/list/definition").then(
                      (module) => module.default.GET,
                    ),
                  )
                }
              >
                {t("documents.invoices")}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() =>
                  openRelated(() =>
                    import("@/payment/bill/list/definition").then(
                      (module) => module.default.GET,
                    ),
                  )
                }
              >
                {t("documents.bills")}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() =>
                  openRelated(() =>
                    import("@/payment/estimate/list/definition").then(
                      (module) => module.default.GET,
                    ),
                  )
                }
              >
                {t("documents.estimates")}
              </Button>
            </Div>
          </SectionGroup>
        )}

        <Section title={t("status.widget.margin.title")}>
          <>
            <Div className="grid grid-cols-2 gap-2 @md:grid-cols-3 @xl:grid-cols-5">
              <Stat
                label={t("status.widget.margin.revenue")}
                value={marginValue(data.week.netRevenueUsd)}
              />
              <Stat
                label={t("status.widget.margin.fees")}
                value={marginValue(data.week.processorFeesUsd)}
              />
              <Stat
                label={t("status.widget.margin.cost")}
                value={marginValue(data.week.upstreamCostUsd)}
              />
              <Stat
                label={t("status.widget.margin.margin")}
                value={marginValue(data.week.grossMarginUsd)}
                negative={data.week.grossMarginUsd < 0}
              />
              <Stat
                label={t("status.widget.margin.pct")}
                value={
                  data.week.grossMarginPct === null
                    ? t("status.widget.margin.missingPct")
                    : `${pct.format(data.week.grossMarginPct)}%`
                }
                negative={(data.week.grossMarginPct ?? 0) < 0}
              />
            </Div>
            {data.week.totalDays > 0 && !data.week.costComplete && (
              <P className="text-xs text-muted-foreground">
                {t("status.widget.margin.costIncomplete", {
                  tracked: data.week.marginDays,
                  total: data.week.expectedDays,
                  revenue: money.format(data.week.netRevenueAllDaysUsd),
                })}
              </P>
            )}
            {data.days.length === 0 ? (
              <Empty text={t("status.widget.margin.empty")} />
            ) : (
              <Div className="flex flex-col divide-y divide-border rounded-lg border overflow-hidden">
                {data.days.map((d) => (
                  <Div
                    key={d.day}
                    className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-4 py-2 text-sm tabular-nums"
                  >
                    <Span className="font-medium">{d.day}</Span>
                    <Span className="text-muted-foreground">
                      {money.format(d.netRevenueUsd)} -{" "}
                      {d.processorFeesUsd > 0
                        ? `${money.format(d.processorFeesUsd)} - `
                        : ""}
                      {d.upstreamCostUsd === null
                        ? t("status.widget.margin.costUnknown")
                        : money.format(d.upstreamCostUsd)}
                    </Span>
                    <Span
                      className={
                        (d.grossMarginUsd ?? 0) < 0
                          ? "text-destructive font-semibold"
                          : "font-semibold"
                      }
                    >
                      {d.grossMarginUsd === null
                        ? t(d.costCoverage)
                        : `${money.format(d.grossMarginUsd)}${
                            d.grossMarginPct === null
                              ? ""
                              : ` (${pct.format(d.grossMarginPct)}%)`
                          }`}
                    </Span>
                  </Div>
                ))}
              </Div>
            )}
          </>
        </Section>

        <Section
          title={t("status.widget.providers.title")}
          count={provs.length}
        >
          <Div className="flex flex-col divide-y divide-border rounded-lg border overflow-hidden">
            {provs.length === 0 && (
              <Empty text={t("status.widget.noSources")} />
            )}
            {provs.map((s) => (
              <Div key={s.source} className="flex flex-col gap-1 px-4 py-3">
                <Div className="flex flex-wrap items-center justify-between gap-2">
                  <Div className="flex min-w-0 flex-wrap items-center gap-2">
                    <Span className="text-sm font-semibold truncate">
                      {t(s.source)}
                    </Span>
                    <StatusBadge status={s.status} t={t} />
                    {readingIsStale(s.snapshotAt, FINANCE_CONFIG.hourMs) && (
                      <Badge variant="outline">
                        {t("status.widget.stale")}
                      </Badge>
                    )}
                  </Div>
                  <Span className="text-sm font-bold tabular-nums">
                    {s.balanceUsd !== null
                      ? money.format(s.balanceUsd)
                      : s.balanceNative !== null
                        ? `${pct.format(s.balanceNative)} ${s.unit ?? ""}`
                        : t("status.widget.noBalance")}
                  </Span>
                </Div>
                <Div className="flex flex-wrap gap-x-3 text-xs text-muted-foreground">
                  {s.lastSpendUsd !== null && (
                    <Span>
                      {t(
                        s.fallback
                          ? "status.widget.providers.lastSpendEstimate"
                          : "status.widget.providers.lastSpend",
                        { amount: money.format(s.lastSpendUsd) },
                      )}
                    </Span>
                  )}
                  {s.lastSpendNative !== null && (
                    <Span>
                      {s.source === FinanceSource.FREEDOM_GPT && s.snapshotAt
                        ? t("status.widget.providers.previousDaySpend", {
                            amount: `${pct.format(s.lastSpendNative)} ${s.unit ?? ""}`,
                            day: dayKey(
                              new Date(
                                startOfUtcDay(
                                  new Date(s.snapshotAt),
                                ).getTime() - FINANCE_CONFIG.dayMs,
                              ),
                            ),
                          })
                        : t("status.widget.providers.lastNativeSpend", {
                            amount: `${pct.format(s.lastSpendNative)} ${s.unit ?? ""}`,
                          })}
                    </Span>
                  )}
                  {s.lastSpendUsd === null && s.lastSpendNative === null && (
                    <Span>{t("status.widget.providers.noSpend")}</Span>
                  )}
                  {s.snapshotAt && (
                    <Span>
                      {t("status.widget.snapshot", {
                        when: when(s.snapshotAt),
                      })}
                    </Span>
                  )}
                  <Span>
                    {t("status.widget.lastSuccessful", {
                      when: when(s.lastOkAt),
                    })}
                  </Span>
                </Div>
                {s.reason && (
                  <Span className="text-xs text-muted-foreground">
                    {s.reason}
                  </Span>
                )}
              </Div>
            ))}
          </Div>
        </Section>

        <Section
          title={t("status.widget.revenue.title")}
          count={revenue.length}
        >
          <Div className="flex flex-col divide-y divide-border rounded-lg border overflow-hidden">
            {revenue.length === 0 && (
              <Empty text={t("status.widget.noSources")} />
            )}
            {revenue.map((s) => (
              <Div key={s.source} className="flex flex-col gap-1 px-4 py-3">
                <Div className="flex flex-wrap items-center gap-2">
                  <Span className="text-sm font-semibold">{t(s.source)}</Span>
                  <StatusBadge status={s.status} t={t} />
                  {readingIsStale(s.lastOkAt, FINANCE_CONFIG.dayMs) && (
                    <Badge variant="outline">{t("status.widget.stale")}</Badge>
                  )}
                  {s.fallback && (
                    <Badge variant="destructive">
                      {t("status.widget.revenue.fallback")}
                    </Badge>
                  )}
                  <Span className="text-xs text-muted-foreground">
                    {t("status.widget.lastSuccessful", {
                      when: when(s.lastOkAt),
                    })}
                  </Span>
                </Div>
                {s.reason && (
                  <Span className="text-xs text-muted-foreground">
                    {s.reason}
                  </Span>
                )}
              </Div>
            ))}
          </Div>
        </Section>

        <Section
          title={t("status.widget.alerts.title")}
          count={data.alerts.length}
        >
          {data.alerts.length === 0 ? (
            <Empty text={t("status.widget.alerts.empty")} />
          ) : (
            <Div className="flex flex-col divide-y divide-border rounded-lg border overflow-hidden">
              {data.alerts.map((a) => (
                <Div key={a.id} className="flex flex-col gap-1 px-4 py-3">
                  <Div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant={
                        a.severity === "enums.severity.critical"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {t(a.type)}
                    </Badge>
                    <Span className="text-xs text-muted-foreground">
                      {when(a.createdAt)}
                    </Span>
                  </Div>
                  <Span className="text-sm">{a.message}</Span>
                  <Span className="text-xs text-muted-foreground">
                    {a.delivery}
                  </Span>
                </Div>
              ))}
            </Div>
          )}
        </Section>

        <Section title={t("status.widget.thresholds.title")}>
          <P className="text-xs text-muted-foreground">
            {t("status.widget.thresholds.hint")}
          </P>
          <Div className="flex flex-col divide-y divide-border rounded-lg border overflow-hidden">
            {data.thresholds.map((th) => (
              <Div
                key={th.key}
                className="flex items-center justify-between gap-3 px-4 py-2"
              >
                <Div className="flex flex-col min-w-0">
                  <Span className="text-sm font-medium truncate">
                    {t(th.key)}
                  </Span>
                  <Span className="text-xs text-muted-foreground">
                    {th.enabled
                      ? t("status.widget.thresholds.custom")
                      : t("status.widget.thresholds.default")}
                    {th.note ? ` · ${th.note}` : ""}
                  </Span>
                </Div>
                <Div className="flex flex-wrap items-center gap-2">
                  <Span className="text-sm font-bold tabular-nums">
                    {pct.format(th.value)}
                  </Span>
                  {isInteractive && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        editThreshold(th.key, th.value, true, th.note)
                      }
                    >
                      {t("status.widget.thresholds.edit")}
                    </Button>
                  )}
                </Div>
              </Div>
            ))}
          </Div>
        </Section>
      </Div>
    </WidgetShell>
  );
}

function isRevenue(source: string): boolean {
  return (
    source === "enums.source.stripe" || source === "enums.source.nowpayments"
  );
}

function Stat({
  label,
  value,
  negative,
}: {
  label: string;
  value: string;
  negative?: boolean;
}): JSX.Element {
  return (
    <Div className="flex min-w-0 flex-col gap-0.5 rounded-lg border px-3 py-2">
      <Span className="text-xs text-muted-foreground">{label}</Span>
      <Span
        className={`text-base font-bold tabular-nums [overflow-wrap:anywhere] ${negative ? "text-destructive" : ""}`}
      >
        {value}
      </Span>
    </Div>
  );
}

function StatusBadge({
  status,
  t,
}: {
  status:
    | "enums.runStatus.ok"
    | "enums.runStatus.skipped"
    | "enums.runStatus.failed"
    | null;
  t: StatusT;
}): JSX.Element {
  if (status === null) {
    return <Badge variant="outline">{t("status.widget.neverRun")}</Badge>;
  }
  return (
    <Badge
      variant={
        status === "enums.runStatus.ok"
          ? "secondary"
          : status === "enums.runStatus.failed"
            ? "destructive"
            : "outline"
      }
    >
      {t(status)}
    </Badge>
  );
}
