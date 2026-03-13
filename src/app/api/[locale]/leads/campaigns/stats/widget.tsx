/**
 * Campaign Stats Widget
 * Dashboard widget for email campaign performance metrics
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Activity } from "next-vibe-ui/ui/icons/Activity";
import { BarChart2 } from "next-vibe-ui/ui/icons/BarChart2";
import { RefreshCw } from "next-vibe-ui/ui/icons/RefreshCw";
import { Users } from "next-vibe-ui/ui/icons/Users";
import { Zap } from "next-vibe-ui/ui/icons/Zap";
import { Span } from "next-vibe-ui/ui/span";
import React, { useMemo } from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import {
  useWidgetContext,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type definition from "./definition";

type GetResponseOutput = typeof definition.GET.types.ResponseOutput;

interface CustomWidgetProps {
  field: {
    value: GetResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
}

// ── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  format = "number",
  variant = "default",
  size = "default",
}: {
  label: string;
  value: number | null | undefined;
  format?: "number" | "percent" | "compact";
  variant?: "default" | "success" | "warning" | "danger" | "info";
  size?: "default" | "large";
}): React.JSX.Element {
  const variantClass = {
    default: "text-foreground",
    success: "text-green-600 dark:text-green-400",
    warning: "text-yellow-600 dark:text-yellow-400",
    danger: "text-red-600 dark:text-red-400",
    info: "text-blue-600 dark:text-blue-400",
  }[variant];

  const formatted = useMemo(() => {
    if (value === null || value === undefined) {
      return "—";
    }
    if (format === "percent") {
      return `${(value * 100).toFixed(1)}%`;
    }
    if (format === "compact" && value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return value.toLocaleString();
  }, [value, format]);

  return (
    <Div className="flex flex-col gap-1">
      <Span className="text-xs text-muted-foreground">{label}</Span>
      <Span
        className={cn(
          "font-bold tabular-nums",
          size === "large" ? "text-3xl" : "text-2xl",
          variantClass,
        )}
      >
        {formatted}
      </Span>
    </Div>
  );
}

// ── Bar row ──────────────────────────────────────────────────────────────────

function BarRow({
  label,
  value,
  max,
  color,
  suffix,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  suffix?: string;
}): React.JSX.Element {
  const widthPct = max > 0 ? `${(value / max) * 100}%` : "0%";
  return (
    <Div className="flex items-center gap-2">
      <Span className="text-xs text-muted-foreground w-28 truncate flex-shrink-0">
        {label}
      </Span>
      <Div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <Div
          style={{
            width: widthPct,
            height: "100%",
            borderRadius: "9999px",
            backgroundColor: color,
          }}
        />
      </Div>
      <Span className="text-xs tabular-nums w-14 text-right">
        {value.toLocaleString()}
        {suffix}
      </Span>
    </Div>
  );
}

// ── Stage funnel ─────────────────────────────────────────────────────────────

const STAGE_COLORS: Record<string, string> = {
  "enums.emailCampaignStage.initial": "#3b82f6",
  "enums.emailCampaignStage.followup1": "#6366f1",
  "enums.emailCampaignStage.followup2": "#8b5cf6",
  "enums.emailCampaignStage.followup3": "#a855f7",
  "enums.emailCampaignStage.nurture": "#14b8a6",
  "enums.emailCampaignStage.reactivation": "#22c55e",
};

const STAGE_LABELS: Record<string, string> = {
  "enums.emailCampaignStage.notStarted": "Not Started",
  "enums.emailCampaignStage.initial": "Initial Contact",
  "enums.emailCampaignStage.followup1": "Follow-up 1",
  "enums.emailCampaignStage.followup2": "Follow-up 2",
  "enums.emailCampaignStage.followup3": "Follow-up 3",
  "enums.emailCampaignStage.nurture": "Nurture",
  "enums.emailCampaignStage.reactivation": "Reactivation",
};

const VARIANT_LABELS: Record<string, string> = {
  "enums.emailJourneyVariant.uncensoredConvert": "Uncensored Convert",
  "enums.emailJourneyVariant.sideHustle": "Side Hustle",
  "enums.emailJourneyVariant.quietRecommendation": "Quiet Recommendation",
  "enums.emailJourneyVariant.signupNurture": "Signup Nurture",
  "enums.emailJourneyVariant.retention": "Retention",
  "enums.emailJourneyVariant.winback": "Winback",
};

const VARIANT_COLORS: string[] = [
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#14b8a6",
  "#f59e0b",
  "#ef4444",
];

// ── Main component ───────────────────────────────────────────────────────────

export function CampaignStatsWidget({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const { endpointMutations } = useWidgetContext();
  const t = useWidgetTranslation<typeof definition.GET>();
  const data = field.value;

  const byStage = data?.byStage ?? [];
  const byVariant = data?.byJourneyVariant ?? [];

  const stageMax = Math.max(...byStage.map((s) => s.total), 1);
  const variantMax = Math.max(...byVariant.map((v) => v.total), 1);

  const hasData = data !== null && data !== undefined;

  return (
    <Div className="flex flex-col gap-6 p-4">
      {/* Header */}
      <Div className="flex items-center gap-2">
        <BarChart2 className="h-5 w-5 text-muted-foreground" />
        <Span className="font-semibold text-base mr-auto">
          {t("widget.title")}
        </Span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => endpointMutations?.read?.refetch?.()}
          title={t("widget.refresh")}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </Div>

      {/* ── Hero row: 2 large highlight cards ───────────────────────── */}
      <Div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Active campaigns card */}
        <Div className="rounded-xl border bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-5 flex flex-col gap-3">
          <Div className="flex items-center gap-2">
            <Div className="rounded-lg bg-blue-100 dark:bg-blue-900/50 p-2">
              <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </Div>
            <Span className="text-sm font-medium text-blue-900 dark:text-blue-100">
              {t("widget.activeCampaigns")}
            </Span>
          </Div>
          <Div className="grid grid-cols-2 gap-4">
            <StatCard
              label={t("get.response.pendingLeadsCount")}
              value={data?.pendingLeadsCount}
              variant="info"
              size="large"
            />
            <StatCard
              label={t("get.response.emailsScheduledToday")}
              value={data?.emailsScheduledToday}
              variant="info"
              size="large"
            />
          </Div>
        </Div>

        {/* Today's activity card */}
        <Div className="rounded-xl border bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 p-5 flex flex-col gap-3">
          <Div className="flex items-center gap-2">
            <Div className="rounded-lg bg-green-100 dark:bg-green-900/50 p-2">
              <Zap className="h-4 w-4 text-green-600 dark:text-green-400" />
            </Div>
            <Span className="text-sm font-medium text-green-900 dark:text-green-100">
              {t("widget.sendPerformance")}
            </Span>
          </Div>
          <Div className="grid grid-cols-2 gap-4">
            <StatCard
              label={t("get.response.sent")}
              value={data?.sent}
              variant="success"
              size="large"
            />
            <StatCard
              label={t("get.response.delivered")}
              value={data?.delivered}
              variant="success"
              size="large"
            />
          </Div>
        </Div>
      </Div>

      {/* ── KPI row: 4 compact rate cards ───────────────────────────── */}
      <Div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Div className="rounded-lg border bg-card p-4 flex flex-col gap-1">
          <Span className="text-xs text-muted-foreground">
            {t("get.response.openRate")}
          </Span>
          <Span className="text-2xl font-bold tabular-nums text-blue-600 dark:text-blue-400">
            {hasData ? `${(data.openRate * 100).toFixed(1)}%` : "—"}
          </Span>
          <Span className="text-xs text-muted-foreground">
            {hasData
              ? `${data.opened.toLocaleString()} / ${data.sent.toLocaleString()}`
              : ""}
          </Span>
        </Div>
        <Div className="rounded-lg border bg-card p-4 flex flex-col gap-1">
          <Span className="text-xs text-muted-foreground">
            {t("get.response.clickRate")}
          </Span>
          <Span className="text-2xl font-bold tabular-nums text-blue-600 dark:text-blue-400">
            {hasData ? `${(data.clickRate * 100).toFixed(1)}%` : "—"}
          </Span>
          <Span className="text-xs text-muted-foreground">
            {hasData
              ? `${data.clicked.toLocaleString()} / ${data.sent.toLocaleString()}`
              : ""}
          </Span>
        </Div>
        <Div className="rounded-lg border bg-card p-4 flex flex-col gap-1">
          <Span className="text-xs text-muted-foreground">
            {t("get.response.deliveryRate")}
          </Span>
          <Span className="text-2xl font-bold tabular-nums text-green-600 dark:text-green-400">
            {hasData ? `${(data.deliveryRate * 100).toFixed(1)}%` : "—"}
          </Span>
          <Span className="text-xs text-muted-foreground">
            {hasData
              ? `${data.delivered.toLocaleString()} / ${data.total.toLocaleString()}`
              : ""}
          </Span>
        </Div>
        <Div className="rounded-lg border bg-card p-4 flex flex-col gap-1">
          <Span className="text-xs text-muted-foreground">
            {t("get.response.failureRate")}
          </Span>
          <Span
            className={cn(
              "text-2xl font-bold tabular-nums",
              hasData && data.failureRate > 0.05
                ? "text-red-600 dark:text-red-400"
                : "text-foreground",
            )}
          >
            {hasData ? `${(data.failureRate * 100).toFixed(1)}%` : "—"}
          </Span>
          <Span className="text-xs text-muted-foreground">
            {hasData
              ? `${data.failed.toLocaleString()} ${t("get.response.failed").toLowerCase()}`
              : ""}
          </Span>
        </Div>
      </Div>

      {/* ── Lead overview (compact) ─────────────────────────────────── */}
      {hasData && data.totalLeads > 0 && (
        <Div className="rounded-lg border bg-card p-4">
          <Div className="flex items-center gap-2 mb-3">
            <Users className="h-4 w-4 text-muted-foreground" />
            <Span className="text-sm font-semibold">
              {t("widget.leadOverview")}
            </Span>
          </Div>
          <Div className="grid grid-cols-3 gap-4">
            <StatCard
              label={t("widget.totalLeads")}
              value={data.totalLeads}
              format="compact"
            />
            <StatCard
              label={t("widget.linkedLeadsCount")}
              value={data.linkedLeadsCount}
              format="compact"
              variant="info"
            />
            <StatCard
              label={t("widget.uniquePersonsEstimate")}
              value={data.uniquePersonsEstimate}
              format="compact"
              variant="success"
            />
          </Div>
        </Div>
      )}

      {/* ── Stage funnel + variant breakdown side by side ────────────── */}
      <Div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {byStage.length > 0 && (
          <Div className="rounded-lg border bg-card p-4">
            <Span className="text-sm font-semibold mb-3 block">
              {t("widget.stageLabel")}
            </Span>
            <Div className="flex flex-col gap-1.5">
              {byStage.map((s) => (
                <BarRow
                  key={s.stage}
                  label={STAGE_LABELS[s.stage] ?? s.stage}
                  value={s.total}
                  max={stageMax}
                  color={STAGE_COLORS[s.stage] ?? "hsl(var(--primary))"}
                />
              ))}
            </Div>
          </Div>
        )}

        {byVariant.length > 0 && (
          <Div className="rounded-lg border bg-card p-4">
            <Span className="text-sm font-semibold mb-3 block">
              {t("widget.variantLabel")}
            </Span>
            <Div className="flex flex-col gap-1.5">
              {byVariant.map((v, i) => (
                <BarRow
                  key={v.variant}
                  label={VARIANT_LABELS[v.variant] ?? v.variant}
                  value={v.total}
                  max={variantMax}
                  color={VARIANT_COLORS[i % VARIANT_COLORS.length]}
                  suffix={` · ${(v.openRate * 100).toFixed(0)}%`}
                />
              ))}
            </Div>
          </Div>
        )}
      </Div>

      {/* ── Volume summary row ──────────────────────────────────────── */}
      <Div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label={t("get.response.total")} value={data?.total} />
        <StatCard
          label={t("get.response.pending")}
          value={data?.pending}
          variant="warning"
        />
        <StatCard
          label={t("get.response.opened")}
          value={data?.opened}
          variant="success"
        />
        <StatCard
          label={t("get.response.clicked")}
          value={data?.clicked}
          variant="success"
        />
      </Div>
    </Div>
  );
}
