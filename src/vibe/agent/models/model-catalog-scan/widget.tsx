/**
 * Model Catalog Scan widgets (web, CLI, MCP, AI, native)
 * GET: latest report + history. POST: run form + the fresh report.
 */

"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  formatSimpleDate,
  formatTimestamp,
} from "next-vibe/core/i18n/core/localization-utils";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { ListItem } from "next-vibe/ui/components/list-item";
import { MetricCard } from "next-vibe/ui/components/metric-card";
import { MetricGrid } from "next-vibe/ui/components/metric-grid";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import { P } from "next-vibe/ui/components/typography";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { BooleanFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/boolean-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";
import { type ModelCatalogScanT, scopedTranslation } from "./i18n";
import type { CatalogReport, CatalogScanSummary } from "./schema";

function formatUsd(value: number | null, locale: CountryLanguage): string {
  return value === null
    ? "?"
    : new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 6,
      }).format(value);
}

function ScanMeta({
  scan,
  report,
  locale,
  t,
}: {
  scan: CatalogScanSummary;
  report: CatalogReport;
  locale: CountryLanguage;
  t: ModelCatalogScanT;
}): JSX.Element {
  return (
    <Div className="flex flex-wrap items-center gap-2">
      <StatusPill
        status="scanned"
        variant="muted"
        label={`${t("widget.scannedAt")} ${formatTimestamp(scan.scannedAt, locale)}`}
      />
      <StatusPill
        status="since"
        variant="muted"
        label={`${t("widget.newSince")} ${formatTimestamp(report.newSince, locale)}`}
      />
      {scan.emailedTo.length > 0 ? (
        <StatusPill
          status="emailed"
          variant="success"
          label={`${t("widget.emailedTo")} ${scan.emailedTo.join(", ")}`}
        />
      ) : (
        <StatusPill
          status="not-emailed"
          variant="muted"
          label={t("widget.notEmailed")}
        />
      )}
      {scan.emailError ? (
        <StatusPill
          status="email-error"
          variant="danger"
          label={`${t("widget.emailError")}: ${scan.emailError}`}
        />
      ) : null}
    </Div>
  );
}

function ReportView({
  scan,
  report,
  locale,
  t,
}: {
  scan: CatalogScanSummary;
  report: CatalogReport;
  locale: CountryLanguage;
  t: ModelCatalogScanT;
}): JSX.Element {
  const uncensoredCount = report.newModels.filter((m) => m.uncensored).length;
  const failedSources = report.sources.filter((s) => !s.ok).length;

  return (
    <Div className="flex flex-col gap-4">
      <ScanMeta scan={scan} report={report} locale={locale} t={t} />

      <MetricGrid columns={3}>
        <MetricCard
          label={t("widget.metrics.newModels")}
          value={report.newModels.length}
          variant={report.newModels.length > 0 ? "info" : "default"}
        />
        <MetricCard
          label={t("widget.metrics.uncensored")}
          value={uncensoredCount}
          variant={uncensoredCount > 0 ? "info" : "default"}
        />
        <MetricCard
          label={t("widget.metrics.priceChanges")}
          value={report.priceChanges.length}
          variant={report.priceChanges.length > 0 ? "warning" : "default"}
        />
        <MetricCard
          label={t("widget.metrics.missing")}
          value={report.missingUpstream.length}
          variant={report.missingUpstream.length > 0 ? "danger" : "default"}
        />
        <MetricCard
          label={t("widget.metrics.deprecations")}
          value={report.deprecations.length}
          variant={report.deprecations.length > 0 ? "warning" : "default"}
        />
        <MetricCard
          label={t("widget.metrics.sourceErrors")}
          value={failedSources}
          variant={failedSources > 0 ? "danger" : "success"}
        />
      </MetricGrid>

      <SectionGroup
        title={`${t("widget.sections.newModels")} (${report.newModels.length})`}
        collapsible
        defaultOpen
      >
        {report.newModels.length === 0 ? (
          <P className="text-sm text-muted-foreground">{t("widget.nothing")}</P>
        ) : (
          report.newModels.map((m) => (
            <ListItem
              key={`${m.apiProvider}-${m.providerModel}`}
              title={m.name}
              subtitle={`${m.apiProvider} · ${m.providerModel}`}
              badges={
                <Div className="flex flex-wrap gap-1">
                  <StatusPill
                    status={m.kind}
                    variant="default"
                    label={m.kind}
                  />
                  {m.uncensored ? (
                    <StatusPill
                      status="uncensored"
                      variant="info"
                      label={t("widget.uncensored")}
                    />
                  ) : null}
                </Div>
              }
              meta={`${formatUsd(m.inputUsdPer1M, locale)} / ${formatUsd(m.outputUsdPer1M, locale)} ${t("widget.perMillion")} · ${t("widget.context")} ${m.contextWindow?.toLocaleString(locale) ?? "?"} · ${m.createdAt ? formatSimpleDate(new Date(m.createdAt), locale) : "?"}`}
            />
          ))
        )}
      </SectionGroup>

      <SectionGroup
        title={`${t("widget.sections.priceChanges")} (${report.priceChanges.length})`}
        collapsible
        defaultOpen={report.priceChanges.length > 0}
      >
        {report.priceChanges.length === 0 ? (
          <P className="text-sm text-muted-foreground">{t("widget.nothing")}</P>
        ) : (
          report.priceChanges.map((c) => (
            <ListItem
              key={`${c.apiProvider}-${c.providerModel}-${c.modelId}-${c.field}`}
              title={`${c.modelId} · ${c.field}`}
              subtitle={`${c.apiProvider} · ${c.providerModel}`}
              badges={
                c.suspect ? (
                  <StatusPill
                    status="suspect"
                    variant="warning"
                    label={t("widget.suspect")}
                  />
                ) : undefined
              }
              meta={`${c.oldValue} → ${c.newValue} (${c.changePercent > 0 ? "+" : ""}${c.changePercent}%)`}
            />
          ))
        )}
      </SectionGroup>

      <SectionGroup
        title={`${t("widget.sections.missing")} (${report.missingUpstream.length})`}
        collapsible
        defaultOpen={report.missingUpstream.some((m) => !m.legacy)}
      >
        {report.missingUpstream.length === 0 ? (
          <P className="text-sm text-muted-foreground">{t("widget.nothing")}</P>
        ) : (
          report.missingUpstream.map((m) => (
            <ListItem
              key={`${m.apiProvider}-${m.providerModel}-${m.modelId}`}
              title={m.modelId}
              subtitle={`${m.apiProvider} · ${m.providerModel}`}
              badges={
                m.legacy ? (
                  <StatusPill
                    status="legacy"
                    variant="muted"
                    label={t("widget.legacy")}
                  />
                ) : undefined
              }
            />
          ))
        )}
      </SectionGroup>

      <SectionGroup
        title={`${t("widget.sections.deprecations")} (${report.deprecations.length})`}
        collapsible
        defaultOpen={report.deprecations.some((d) => !d.legacy)}
      >
        {report.deprecations.length === 0 ? (
          <P className="text-sm text-muted-foreground">{t("widget.nothing")}</P>
        ) : (
          report.deprecations.map((d) => (
            <ListItem
              key={`${d.apiProvider}-${d.providerModel}-${d.modelId}`}
              title={d.modelId}
              subtitle={`${d.apiProvider} · ${d.providerModel}`}
              meta={formatSimpleDate(new Date(d.expiresAt), locale)}
              badges={
                d.legacy ? (
                  <StatusPill
                    status="legacy"
                    variant="muted"
                    label={t("widget.legacy")}
                  />
                ) : undefined
              }
            />
          ))
        )}
      </SectionGroup>

      <SectionGroup
        title={`${t("widget.sections.sources")} (${report.sources.length})`}
        collapsible
        defaultOpen={failedSources > 0}
      >
        {report.sources.map((s) => (
          <ListItem
            key={s.source}
            title={s.source}
            subtitle={
              s.ok ? `${s.modelCount} ${t("widget.models")}` : (s.error ?? "")
            }
            badges={
              <StatusPill
                status={s.ok ? "ok" : "failed"}
                variant={s.ok ? "success" : "danger"}
                label={s.ok ? t("widget.ok") : t("widget.failed")}
              />
            }
          />
        ))}
      </SectionGroup>
    </Div>
  );
}

export function ModelCatalogScanWidget(): JSX.Element {
  const locale = useWidgetLocale();
  const { t } = scopedTranslation.scopedT(locale);
  const value = useWidgetValue<typeof definition.GET>();
  const navigation = useWidgetNavigation();

  const handleRun = (): void => {
    void (async (): Promise<void> => {
      const def = await import("./definition");
      navigation.push(def.default.POST, {});
    })();
  };

  const backButton = navigation.canGoBack ? (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={(): void => navigation.pop()}
    >
      {t("widget.back")}
    </Button>
  ) : undefined;

  return (
    <WidgetShell layout="page" className="gap-4">
      <WidgetHeader
        size="page"
        title={t("get.title")}
        backButton={backButton}
        actions={
          <Button
            type="button"
            className="min-h-10 w-full @lg:w-auto"
            onClick={handleRun}
          >
            {t("widget.runNow")}
          </Button>
        }
      />
      {value?.scan && value.report ? (
        <>
          <ReportView
            scan={value.scan}
            report={value.report}
            locale={locale}
            t={t}
          />
          {value.history.length > 1 ? (
            <SectionGroup
              title={t("widget.sections.history")}
              collapsible
              defaultOpen={false}
            >
              {value.history.map((h) => (
                <ListItem
                  key={h.id}
                  title={formatTimestamp(h.scannedAt, locale)}
                  meta={`${h.newModels} ${t("widget.metrics.newModels")} · ${h.priceChanges} ${t("widget.metrics.priceChanges")} · ${h.missingUpstream} ${t("widget.metrics.missing")}`}
                />
              ))}
            </SectionGroup>
          ) : null}
        </>
      ) : value ? (
        <EmptyBlock
          title={t("widget.empty.title")}
          message={t("widget.empty.message")}
          action={{ label: t("widget.runNow"), onClick: handleRun }}
        />
      ) : null}
    </WidgetShell>
  );
}

export function ModelCatalogScanRunWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const children = field.children;
  const locale = useWidgetLocale();
  const { t } = scopedTranslation.scopedT(locale);
  const result = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();

  const backButton = navigation.canGoBack ? (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={(): void => navigation.pop()}
    >
      {t("widget.back")}
    </Button>
  ) : undefined;

  return (
    <WidgetShell layout="page" className="gap-4">
      <WidgetHeader
        size="page"
        title={t("post.title")}
        backButton={backButton}
      />
      <Div className="grid gap-3 @md:grid-cols-2">
        <BooleanFieldWidget fieldName="force" field={children.force} />
        <BooleanFieldWidget fieldName="sendEmail" field={children.sendEmail} />
      </Div>
      <FormAlertWidget field={{}} />
      <Div className="flex justify-end">
        <SubmitButtonWidget<typeof definition.POST>
          field={{
            text: "widget.runNow",
            loadingText: "widget.running",
            icon: "search",
            variant: "primary",
            size: "sm",
          }}
        />
      </Div>
      {result?.skipped ? (
        <P className="text-sm text-muted-foreground">{t("widget.skipped")}</P>
      ) : null}
      {result?.scan && result.report ? (
        <ReportView
          scan={result.scan}
          report={result.report}
          locale={locale}
          t={t}
        />
      ) : null}
    </WidgetShell>
  );
}
