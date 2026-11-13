/**
 * Anti-Farming Report Widget
 * Web: KPI cards for blocked attempts, subnet and email-domain tables, active
 * limits. CLI/MCP: a compact aligned text report.
 */

"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Platform, isCliPlatform } from "next-vibe/platforms/platforms";
import { Button } from "next-vibe/ui/components/button";
import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { Div } from "next-vibe/ui/components/div";
import { RefreshCw } from "next-vibe/ui/components/icons/RefreshCw";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { MetricCard } from "next-vibe/ui/components/metric-card";
import { MetricGrid } from "next-vibe/ui/components/metric-grid";
import { Pre } from "next-vibe/ui/components/pre";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "next-vibe/ui/components/table";
import { P } from "next-vibe/ui/components/typography";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  useWidgetContext,
  useWidgetLocale,
  useWidgetPlatform,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { IntFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/int-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "next-vibe/unified-ui/widgets/interactive/navigate-button/widget";
import type React from "react";
import { useCallback } from "react";

import type definition from "./definition";
import type { AntiFarmingReportResponseOutput } from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.GET)["fields"];
}

type ReportT = ReturnType<typeof useWidgetTranslation<typeof definition.GET>>;
type SubnetRow = AntiFarmingReportResponseOutput["subnetsByBlocked"][number];
type DomainRow = AntiFarmingReportResponseOutput["emailDomains"][number];

/** BCP-47 tag from our CountryLanguage ("en-GLOBAL" is not valid for Intl). */
function intlLocale(locale: CountryLanguage): string {
  return locale.endsWith("-GLOBAL") ? locale.split("-")[0] : locale;
}

function formatDay(date: Date, locale: CountryLanguage): string {
  return new Date(date).toLocaleDateString(intlLocale(locale), {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function formatSeen(date: Date, locale: CountryLanguage): string {
  return new Date(date).toLocaleString(intlLocale(locale), {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

function cell(value: string, width: number): string {
  if (value.length > width) {
    return `${value.slice(0, Math.max(0, width - 1))}~`;
  }
  return value.padEnd(width);
}

function num(value: string, width: number): string {
  return value.padStart(width);
}

// ─── CLI / MCP text report ──────────────────────────────────────────────────

const SUBNET_W = 26;
const NUM_W = 9;

function subnetHeader(t: ReportT): string {
  return [
    cell(t("widget.col.subnet"), SUBNET_W),
    num(t("widget.col.blocked"), NUM_W),
    num(t("widget.col.accountGranted"), NUM_W),
    num(t("widget.col.accountBlocked"), NUM_W),
    num(t("widget.col.guestGranted"), NUM_W),
    num(t("widget.col.guestBlocked"), NUM_W),
    `  ${t("widget.col.lastSeen")}`,
  ].join(" ");
}

function subnetLine(r: SubnetRow, locale: CountryLanguage): string {
  return [
    cell(r.subnet, SUBNET_W),
    num(String(r.blocked), NUM_W),
    num(String(r.accountGranted), NUM_W),
    num(String(r.accountBlocked), NUM_W),
    num(String(r.guestGranted), NUM_W),
    num(String(r.guestBlocked), NUM_W),
    `  ${formatSeen(r.lastSeen, locale)}`,
  ].join(" ");
}

function renderText(
  data: AntiFarmingReportResponseOutput,
  t: ReportT,
  locale: CountryLanguage,
): string {
  const { totals, thresholds: th } = data;
  const lines: string[] = [];
  lines.push(
    t("widget.windowLine", {
      days: data.window.days,
      from: formatDay(data.window.from, locale),
      month: data.window.month,
    }),
  );
  lines.push("");
  lines.push(
    `${t("widget.kpi.total")}: ${totals.total} | ${t("widget.kpi.subnetAccountLimit")}: ${totals.subnetAccountLimit} | ${t("widget.kpi.subnetGuestLimit")}: ${totals.subnetGuestLimit} | ${t("widget.kpi.duplicateEmail")}: ${totals.duplicateEmail} | ${t("widget.kpi.disposableEmail")}: ${totals.disposableEmail}`,
  );

  const subnetSection = (title: string, rows: SubnetRow[]): void => {
    lines.push("");
    lines.push(title);
    if (rows.length === 0) {
      lines.push(`  ${t("widget.empty.subnets")}`);
      return;
    }
    lines.push(`  ${subnetHeader(t)}`);
    for (const r of rows) {
      lines.push(`  ${subnetLine(r, locale)}`);
    }
  };
  subnetSection(t("get.response.subnetsByBlocked"), data.subnetsByBlocked);
  subnetSection(t("get.response.subnetsByClaims"), data.subnetsByClaims);
  lines.push(`  ${t("widget.colHint")}`);

  lines.push("");
  lines.push(t("get.response.emailDomains"));
  if (data.emailDomains.length === 0) {
    lines.push(`  ${t("widget.empty.domains")}`);
  } else {
    lines.push(
      `  ${[
        cell(t("widget.col.domain"), SUBNET_W),
        num(t("widget.col.total"), NUM_W),
        num(t("widget.col.duplicate"), NUM_W + 2),
        num(t("widget.col.disposable"), NUM_W + 2),
        `  ${t("widget.col.lastSeen")}`,
      ].join(" ")}`,
    );
    for (const d of data.emailDomains) {
      lines.push(
        `  ${[
          cell(d.domain, SUBNET_W),
          num(String(d.total), NUM_W),
          num(String(d.duplicate), NUM_W + 2),
          num(String(d.disposable), NUM_W + 2),
          `  ${formatSeen(d.lastSeen, locale)}`,
        ].join(" ")}`,
      );
    }
  }

  lines.push("");
  lines.push(t("get.response.thresholds"));
  lines.push(
    `  ${t("widget.limits.accountPerSubnet")}: ${th.accountPoolsPerSubnetPerMonth} | ${t("widget.limits.guestPerSubnet")}: ${th.guestPoolsPerSubnetPerDay}`,
  );
  lines.push(
    `  ${t("widget.limits.guestIpWindow")}: ${th.guestIpPoolWindowHours} | ${t("widget.limits.signupLookback")}: ${th.signupGuestSpendLookbackHours}`,
  );
  lines.push(
    `  ${t("widget.limits.subnetPrefix")}: IPv4 /${th.subnetPrefixV4}, IPv6 /${th.subnetPrefixV6}`,
  );
  return lines.join("\n");
}

// ─── Web pieces ─────────────────────────────────────────────────────────────

function SubnetTable({
  rows,
  t,
  locale,
}: {
  rows: SubnetRow[];
  t: ReportT;
  locale: CountryLanguage;
}): React.JSX.Element {
  if (rows.length === 0) {
    return (
      <P className="text-sm text-muted-foreground">
        {t("widget.empty.subnets")}
      </P>
    );
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("widget.col.subnet")}</TableHead>
          <TableHead className="text-right">
            {t("widget.col.blocked")}
          </TableHead>
          <TableHead className="text-right">
            {t("widget.col.accountGranted")}
          </TableHead>
          <TableHead className="text-right">
            {t("widget.col.accountBlocked")}
          </TableHead>
          <TableHead className="text-right">
            {t("widget.col.guestGranted")}
          </TableHead>
          <TableHead className="text-right">
            {t("widget.col.guestBlocked")}
          </TableHead>
          <TableHead className="text-right">
            {t("widget.col.lastSeen")}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r.subnet}>
            <TableCell className="font-mono text-xs">{r.subnet}</TableCell>
            <TableCell className="text-right tabular-nums font-medium">
              {r.blocked}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {r.accountGranted}
            </TableCell>
            <TableCell className="text-right tabular-nums text-destructive">
              {r.accountBlocked}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {r.guestGranted}
            </TableCell>
            <TableCell className="text-right tabular-nums text-destructive">
              {r.guestBlocked}
            </TableCell>
            <TableCell className="text-right text-xs text-muted-foreground whitespace-nowrap">
              {formatSeen(r.lastSeen, locale)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function DomainTable({
  rows,
  t,
  locale,
}: {
  rows: DomainRow[];
  t: ReportT;
  locale: CountryLanguage;
}): React.JSX.Element {
  if (rows.length === 0) {
    return (
      <P className="text-sm text-muted-foreground">
        {t("widget.empty.domains")}
      </P>
    );
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("widget.col.domain")}</TableHead>
          <TableHead className="text-right">{t("widget.col.total")}</TableHead>
          <TableHead className="text-right">
            {t("widget.col.duplicate")}
          </TableHead>
          <TableHead className="text-right">
            {t("widget.col.disposable")}
          </TableHead>
          <TableHead className="text-right">
            {t("widget.col.lastSeen")}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((d) => (
          <TableRow key={d.domain}>
            <TableCell className="font-mono text-xs">{d.domain}</TableCell>
            <TableCell className="text-right tabular-nums font-medium">
              {d.total}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {d.duplicate}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {d.disposable}
            </TableCell>
            <TableCell className="text-right text-xs text-muted-foreground whitespace-nowrap">
              {formatSeen(d.lastSeen, locale)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// ─── Widget ─────────────────────────────────────────────────────────────────

export function AntiFarmingReportWidget({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const { endpointMutations } = useWidgetContext();
  const data = useWidgetValue<typeof definition.GET>();

  const handleRefresh = useCallback((): void => {
    endpointMutations?.read?.refetch?.();
  }, [endpointMutations]);

  if (responseOnly && (isCliPlatform(platform) || platform === Platform.MCP)) {
    return data ? <Pre>{renderText(data, t, locale)}</Pre> : <Pre>{""}</Pre>;
  }

  return (
    <WidgetShell>
      <WidgetHeader
        title={t("get.title")}
        backButton={<NavigateButtonWidget field={children.backButton} />}
        actions={
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            title={t("widget.refresh")}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        }
      />

      <Div className="grid grid-cols-2 @lg:grid-cols-4 gap-3 items-end">
        <IntFieldWidget fieldName="days" field={children.days} />
      </Div>

      <FormAlertWidget field={children.formAlert} />

      {!data ? (
        endpointMutations?.read?.isLoading !== false && (
          <LoadingBlock message={t("widget.loading")} />
        )
      ) : (
        <>
          <P className="text-xs text-muted-foreground">
            {t("widget.windowLine", {
              days: data.window.days,
              from: formatDay(data.window.from, locale),
              month: data.window.month,
            })}
          </P>

          <MetricGrid columns={4}>
            <MetricCard
              label={t("widget.kpi.total")}
              value={data.totals.total}
              variant={data.totals.total > 0 ? "warning" : "default"}
            />
            <MetricCard
              label={t("widget.kpi.subnetAccountLimit")}
              value={data.totals.subnetAccountLimit}
            />
            <MetricCard
              label={t("widget.kpi.subnetGuestLimit")}
              value={data.totals.subnetGuestLimit}
            />
            <MetricCard
              label={t("widget.kpi.duplicateEmail")}
              value={data.totals.duplicateEmail}
              description={`${t("widget.kpi.disposableEmail")}: ${data.totals.disposableEmail}`}
            />
          </MetricGrid>

          <SectionGroup title={t("get.response.subnetsByBlocked")}>
            <SubnetTable rows={data.subnetsByBlocked} t={t} locale={locale} />
          </SectionGroup>

          <SectionGroup title={t("get.response.subnetsByClaims")}>
            <SubnetTable rows={data.subnetsByClaims} t={t} locale={locale} />
            <P className="text-xs text-muted-foreground pt-2">
              {t("widget.colHint")}
            </P>
          </SectionGroup>

          <SectionGroup title={t("get.response.emailDomains")}>
            <DomainTable rows={data.emailDomains} t={t} locale={locale} />
          </SectionGroup>

          <SectionGroup title={t("get.response.thresholds")}>
            <DetailGrid columns={2}>
              <DetailField
                label={t("widget.limits.accountPerSubnet")}
                value={String(data.thresholds.accountPoolsPerSubnetPerMonth)}
              />
              <DetailField
                label={t("widget.limits.guestPerSubnet")}
                value={String(data.thresholds.guestPoolsPerSubnetPerDay)}
              />
              <DetailField
                label={t("widget.limits.guestIpWindow")}
                value={String(data.thresholds.guestIpPoolWindowHours)}
              />
              <DetailField
                label={t("widget.limits.signupLookback")}
                value={String(data.thresholds.signupGuestSpendLookbackHours)}
              />
              <DetailField
                label={t("widget.limits.subnetPrefix")}
                value={`IPv4 /${data.thresholds.subnetPrefixV4}, IPv6 /${data.thresholds.subnetPrefixV6}`}
              />
            </DetailGrid>
          </SectionGroup>
        </>
      )}
    </WidgetShell>
  );
}
