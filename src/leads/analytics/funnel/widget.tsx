"use client";

import {
  AnalyticsToolbar,
  BreakdownTable,
  FunnelChart,
  KpiGrid,
  KpiTile,
  TimeSeriesChart,
} from "next-vibe/ui/components/analytics";
import { Div } from "next-vibe/ui/components/div";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetLocale,
  useWidgetOnSubmit,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";

import { FunnelReach, TrafficFilter } from "../enum";
import type { LeadDrillFilters, LeadSegmentFilters } from "../filters";
import {
  DIMENSION_LABEL,
  dimensionFilter,
  DimensionTabs,
  dimensionValueLabel,
  noneRowHint,
  SEGMENT_KEYS,
  segmentChips,
  type SegmentFilterKey,
  SegmentFilterPanel,
  useLeadAnalyticsT,
  useLeadDrill,
} from "../widget-parts";
import type definition from "./definition";

const STEP_DRILL: Record<string, LeadDrillFilters> = {
  leads: {},
  humans: { traffic: TrafficFilter.HUMANS },
  firstChats: {
    traffic: TrafficFilter.HUMANS,
    reached: FunnelReach.FIRST_CHAT,
  },
  signups: { traffic: TrafficFilter.HUMANS, reached: FunnelReach.SIGNED_UP },
  emailConfirmed: {
    traffic: TrafficFilter.HUMANS,
    reached: FunnelReach.EMAIL_CONFIRMED,
  },
  payers: { traffic: TrafficFilter.HUMANS, reached: FunnelReach.PAID },
};

function ratio(numerator: number, denominator: number): number {
  return denominator > 0 ? numerator / denominator : 0;
}

function step(
  steps: ReadonlyArray<{ key: string; value: number }> | null,
  key: string,
): number | null {
  return steps ? (steps.find((entry) => entry.key === key)?.value ?? 0) : null;
}

export function FunnelReportWidget(): JSX.Element {
  const value = useWidgetValue<typeof definition.GET>();
  const form = useWidgetForm<typeof definition.GET>();
  const locale = useWidgetLocale();
  const t = useWidgetTranslation<typeof definition.GET>();
  const st = useLeadAnalyticsT(locale);
  const onSubmit = useWidgetOnSubmit();
  const { endpointMutations } = useWidgetContext();
  const drill = useLeadDrill();
  const isLoading = endpointMutations?.read?.isFetching ?? false;
  const filters: LeadSegmentFilters = {
    traffic: form.watch("traffic"),
    botFamily: form.watch("botFamily"),
    channelType: form.watch("channelType"),
    channel: form.watch("channel"),
    source: form.watch("source"),
    medium: form.watch("medium"),
    campaign: form.watch("campaign"),
    referrerHost: form.watch("referrerHost"),
    landingPath: form.watch("landingPath"),
    refCode: form.watch("refCode"),
    country: form.watch("country"),
    localeCountry: form.watch("localeCountry"),
    device: form.watch("device"),
    browser: form.watch("browser"),
    os: form.watch("os"),
    ipPrefix: form.watch("ipPrefix"),
    uaFingerprint: form.watch("uaFingerprint"),
  };
  const submit = (): void => {
    onSubmit?.();
  };
  const removeFilter = (key: SegmentFilterKey): void => {
    form.setValue(key, undefined, { shouldDirty: true });
    submit();
  };
  const clearFilters = (): void => {
    for (const key of SEGMENT_KEYS) {
      form.setValue(key, undefined, { shouldDirty: true });
    }
    submit();
  };
  const dimension = form.watch("dimension") ?? value?.dimensionUsed;
  const period = value?.window;
  const inWindow: LeadDrillFilters = period
    ? { createdFrom: period.from, createdTo: period.to }
    : {};

  const toolbar = (
    <AnalyticsToolbar
      locale={locale}
      period={period}
      isLoading={isLoading}
      onRefresh={() => endpointMutations?.read?.refetch?.()}
      value={{
        range: form.watch("range"),
        granularity: form.watch("granularity"),
        from: form.watch("from"),
        to: form.watch("to"),
      }}
      onChange={(patch) => {
        if (patch.range !== undefined) {
          form.setValue("range", patch.range, { shouldDirty: true });
        }
        if (patch.granularity !== undefined) {
          form.setValue("granularity", patch.granularity, {
            shouldDirty: true,
          });
        }
        if (patch.from !== undefined) {
          form.setValue("from", patch.from, { shouldDirty: true });
        }
        if (patch.to !== undefined) {
          form.setValue("to", patch.to, { shouldDirty: true });
        }
        submit();
      }}
      filters={segmentChips(filters, st, removeFilter)}
      onClearFilters={clearFilters}
    />
  );
  if (!value) {
    return (
      <WidgetShell>
        <WidgetHeader title={t("get.title")} />
        {toolbar}
        <LoadingBlock message={t("widget.loading")} />
      </WidgetShell>
    );
  }

  const stepLabel: Record<string, string> = {
    leads: st("leadAnalytics.metrics.leads"),
    humans: st("leadAnalytics.metrics.humanLeads"),
    firstChats: st("leadAnalytics.metrics.firstChats"),
    signups: st("leadAnalytics.metrics.signups"),
    emailConfirmed: st("leadAnalytics.metrics.emailConfirmed"),
    payers: st("leadAnalytics.metrics.payers"),
  };
  const now = (key: string): number => step(value.steps, key) ?? 0;
  const prev = (key: string): number | null => step(value.previousSteps, key);
  const prevRatio = (a: string, b: string): number | null => {
    const top = prev(a);
    const bottom = prev(b);
    return top === null || bottom === null ? null : ratio(top, bottom);
  };
  const series = (key: string): number[] =>
    value.trend.series.find((entry) => entry.key === key)?.values ?? [];
  const usedDimension = dimension ?? value.dimensionUsed;

  return (
    <WidgetShell>
      <WidgetHeader title={t("get.title")} />
      {toolbar}
      <SectionGroup
        title={t("widget.filtersTitle")}
        subtitle={t("widget.filtersSubtitle")}
        collapsible
        defaultOpen={false}
      >
        <SegmentFilterPanel onApply={submit} applyLabel={t("widget.apply")} />
      </SectionGroup>
      <KpiGrid columns={4}>
        <KpiTile
          label={stepLabel.humans}
          value={now("humans")}
          previous={prev("humans")}
          hint={t("widget.cohortHint", {
            count: now("leads").toLocaleString(locale),
          })}
          sparkline={series("humans")}
          locale={locale}
          onClick={() =>
            drill({ ...filters, ...inWindow, ...STEP_DRILL.humans })
          }
        />
        <KpiTile
          label={t("widget.signupRate")}
          value={ratio(now("signups"), now("humans"))}
          previous={prevRatio("signups", "humans")}
          format="percent"
          hint={t("widget.ofHumans", {
            count: now("signups").toLocaleString(locale),
            total: now("humans").toLocaleString(locale),
          })}
          locale={locale}
          onClick={() =>
            drill({ ...filters, ...inWindow, ...STEP_DRILL.signups })
          }
        />
        <KpiTile
          label={t("widget.payRate")}
          value={ratio(now("payers"), now("signups"))}
          previous={prevRatio("payers", "signups")}
          format="percent"
          hint={t("widget.ofSignups", {
            count: now("payers").toLocaleString(locale),
            total: now("signups").toLocaleString(locale),
          })}
          locale={locale}
          onClick={() =>
            drill({ ...filters, ...inWindow, ...STEP_DRILL.payers })
          }
        />
        <KpiTile
          label={t("widget.overallRate")}
          value={ratio(now("payers"), now("humans"))}
          previous={prevRatio("payers", "humans")}
          format="percent"
          hint={t("widget.ofHumans", {
            count: now("payers").toLocaleString(locale),
            total: now("humans").toLocaleString(locale),
          })}
          tone="positive"
          locale={locale}
        />
      </KpiGrid>

      <Div className="grid min-w-0 grid-cols-1 gap-4 @3xl:grid-cols-2">
        <FunnelChart
          title={t("widget.funnelTitle")}
          subtitle={t("widget.funnelSubtitle")}
          locale={locale}
          steps={value.steps.slice(1).map((entry) => ({
            key: entry.key,
            label: stepLabel[entry.key] ?? entry.key,
            value: entry.value,
            onClick: () =>
              drill({ ...filters, ...inWindow, ...STEP_DRILL[entry.key] }),
          }))}
        />
        <TimeSeriesChart
          title={t("widget.trendTitle")}
          subtitle={t("widget.trendSubtitle")}
          buckets={value.trend.buckets}
          bucket={value.window.bucket}
          variant="line"
          locale={locale}
          series={[
            {
              key: "humans",
              label: stepLabel.humans,
              values: series("humans"),
              color: 1,
            },
            {
              key: "signups",
              label: stepLabel.signups,
              values: series("signups"),
              color: 2,
            },
            {
              key: "payers",
              label: stepLabel.payers,
              values: series("payers"),
              color: 5,
            },
          ]}
        />
      </Div>

      <SignupStepsSection
        value={value}
        usedDimension={usedDimension}
        t={t}
        st={st}
        locale={locale}
      />

      <Div className="flex min-w-0 flex-col gap-2">
        <DimensionTabs
          value={usedDimension}
          t={st}
          ariaLabel={st("leadAnalytics.dimension.label")}
          onChange={(next) => {
            form.setValue("dimension", next, { shouldDirty: true });
            submit();
          }}
        />
        <BreakdownTable
          title={t("widget.segmentsTitle")}
          subtitle={t("widget.segmentsSubtitle")}
          dimensionLabel={st(DIMENSION_LABEL[usedDimension])}
          locale={locale}
          shareKey="humans"
          limit={15}
          emptyLabel={t("widget.empty")}
          columns={[
            { key: "leads", label: stepLabel.leads, secondary: true },
            { key: "humans", label: stepLabel.humans },
            { key: "firstChats", label: stepLabel.firstChats, secondary: true },
            { key: "signups", label: stepLabel.signups },
            {
              key: "signupRate",
              label: t("widget.signupRate"),
              format: "percent",
            },
            { key: "payers", label: stepLabel.payers },
            {
              key: "overall",
              label: t("widget.overallShort"),
              format: "percent",
            },
          ]}
          rows={value.segments.map((row) => ({
            id: row.key ?? "(none)",
            label: dimensionValueLabel(row.key, st),
            sublabel: noneRowHint(row.key, st),
            values: row.metrics,
            onClick: () =>
              drill({
                ...filters,
                ...dimensionFilter(usedDimension, row.key),
                ...inWindow,
              }),
          }))}
        />
      </Div>
    </WidgetShell>
  );
}

type FunnelValue = NonNullable<
  ReturnType<typeof useWidgetValue<typeof definition.GET>>
>;

/** Signup confirmation steps: started, mail, bounce/expiry, confirmed. */
function SignupStepsSection({
  value,
  usedDimension,
  t,
  st,
  locale,
}: {
  value: FunnelValue;
  usedDimension: FunnelValue["dimensionUsed"];
  t: ReturnType<typeof useWidgetTranslation<typeof definition.GET>>;
  st: ReturnType<typeof useLeadAnalyticsT>;
  locale: ReturnType<typeof useWidgetLocale>;
}): JSX.Element {
  const now = (key: string): number => step(value.signupSteps, key) ?? 0;
  const prev = (key: string): number | null =>
    step(value.previousSignupSteps, key);
  const prevStarted = prev("started");
  const prevConfirmed = prev("confirmed");
  const label: Record<string, string> = {
    started: t("widget.started"),
    emailSent: t("widget.emailSent"),
    sendFailed: t("widget.sendFailed"),
    bounced: t("widget.bounced"),
    expired: t("widget.expired"),
    confirmed: t("widget.confirmed"),
  };
  return (
    <SectionGroup
      title={t("widget.signupTitle")}
      subtitle={t("widget.signupSubtitle")}
    >
      <KpiGrid columns={4}>
        <KpiTile
          label={label.started}
          value={now("started")}
          previous={prevStarted}
          locale={locale}
        />
        <KpiTile
          label={t("widget.confirmRate")}
          value={ratio(now("confirmed"), now("started"))}
          previous={
            prevStarted === null || prevConfirmed === null
              ? null
              : ratio(prevConfirmed, prevStarted)
          }
          format="percent"
          hint={t("widget.ofStarted", {
            count: now("confirmed").toLocaleString(locale),
            total: now("started").toLocaleString(locale),
          })}
          tone="positive"
          locale={locale}
        />
        <KpiTile
          label={label.bounced}
          value={now("bounced")}
          previous={prev("bounced")}
          hint={t("widget.signupLostHint")}
          invertDelta
          locale={locale}
        />
        <KpiTile
          label={label.expired}
          value={now("expired")}
          previous={prev("expired")}
          hint={`${label.sendFailed}: ${now("sendFailed").toLocaleString(locale)}`}
          invertDelta
          locale={locale}
        />
      </KpiGrid>
      <Div className="grid min-w-0 grid-cols-1 gap-4 @3xl:grid-cols-2">
        <FunnelChart
          title={t("widget.signupTitle")}
          locale={locale}
          steps={["started", "emailSent", "confirmed"].map((key) => ({
            key,
            label: label[key] ?? key,
            value: now(key),
          }))}
        />
        <BreakdownTable
          title={t("widget.signupSegmentsTitle")}
          subtitle={t("widget.signupSegmentsSubtitle")}
          dimensionLabel={st(DIMENSION_LABEL[usedDimension])}
          locale={locale}
          shareKey="started"
          limit={10}
          emptyLabel={t("widget.signupEmpty")}
          columns={[
            { key: "started", label: label.started },
            { key: "emailSent", label: label.emailSent, secondary: true },
            { key: "bounced", label: label.bounced, secondary: true },
            { key: "expired", label: label.expired, secondary: true },
            { key: "confirmed", label: label.confirmed },
            {
              key: "confirmRate",
              label: t("widget.confirmRate"),
              format: "percent",
            },
          ]}
          rows={value.signupSegments.map((row) => ({
            id: row.key ?? "(none)",
            label: dimensionValueLabel(row.key, st),
            sublabel: noneRowHint(row.key, st),
            values: row.metrics,
          }))}
        />
      </Div>
    </SectionGroup>
  );
}
