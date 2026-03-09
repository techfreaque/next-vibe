/**
 * Campaign Stats Widget
 * Dashboard widget for email campaign performance metrics
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { BarChart2 } from "next-vibe-ui/ui/icons/BarChart2";
import { RefreshCw } from "next-vibe-ui/ui/icons/RefreshCw";
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
  fieldName: string;
}

// ── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  format = "number",
  variant = "default",
}: {
  label: string;
  value: number | null | undefined;
  format?: "number" | "percent" | "compact";
  variant?: "default" | "success" | "warning" | "danger" | "info";
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
    <Div className="rounded-lg border bg-card p-4 flex flex-col gap-1">
      <Span className="text-xs text-muted-foreground">{label}</Span>
      <Span className={cn("text-2xl font-bold tabular-nums", variantClass)}>
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
  INITIAL: "#3b82f6",
  FOLLOWUP_1: "#6366f1",
  FOLLOWUP_2: "#8b5cf6",
  FOLLOWUP_3: "#a855f7",
  NURTURE: "#14b8a6",
  REACTIVATION: "#22c55e",
};

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

  return (
    <Div className="flex flex-col gap-4 p-4">
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

      {/* Queue health row */}
      <Div className="grid grid-cols-2 gap-3">
        <StatCard
          label={t("get.response.pendingLeadsCount")}
          value={data?.pendingLeadsCount}
          variant="warning"
        />
        <StatCard
          label={t("get.response.emailsScheduledToday")}
          value={data?.emailsScheduledToday}
          variant="info"
        />
      </Div>

      {/* KPI row — send volume */}
      <Div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label={t("get.response.total")} value={data?.total} />
        <StatCard
          label={t("get.response.sent")}
          value={data?.sent}
          variant="info"
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

      {/* KPI row — rates */}
      <Div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          label={t("get.response.openRate")}
          value={data?.openRate}
          format="percent"
          variant="info"
        />
        <StatCard
          label={t("get.response.clickRate")}
          value={data?.clickRate}
          format="percent"
          variant="info"
        />
        <StatCard
          label={t("get.response.deliveryRate")}
          value={data?.deliveryRate}
          format="percent"
          variant="success"
        />
        <StatCard
          label={t("get.response.failed")}
          value={data?.failed}
          variant="danger"
        />
      </Div>

      {/* Stage funnel + variant breakdown side by side */}
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
                  label={s.stage}
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
              {byVariant.map((v) => (
                <BarRow
                  key={v.variant}
                  label={v.variant}
                  value={v.total}
                  max={variantMax}
                  color="hsl(var(--primary))"
                  suffix={` · ${(v.openRate * 100).toFixed(0)}%`}
                />
              ))}
            </Div>
          </Div>
        )}
      </Div>

      {/* Pending + failed counts */}
      <Div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatCard
          label={t("get.response.pending")}
          value={data?.pending}
          variant="warning"
        />
        <StatCard
          label={t("get.response.delivered")}
          value={data?.delivered}
          variant="success"
        />
        <StatCard
          label={t("get.response.failureRate")}
          value={data?.failureRate}
          format="percent"
          variant="danger"
        />
      </Div>
    </Div>
  );
}
