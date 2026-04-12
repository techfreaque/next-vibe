/**
 * Custom Widget for Referral Stats
 */

"use client";

import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { DollarSign } from "next-vibe-ui/ui/icons/DollarSign";
import { TrendingUp } from "next-vibe-ui/ui/icons/TrendingUp";
import { Users } from "next-vibe-ui/ui/icons/Users";
import { Wallet } from "next-vibe-ui/ui/icons/Wallet";

import { useWidgetTranslation } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import { Link2 } from "next-vibe-ui/ui/icons/Link2";

import { REFERRAL_CONFIG } from "../config";
import type definition from "./definition";
import type { StatsGetResponseOutput } from "./definition";

/**
 * Props for custom widget
 */
interface CustomWidgetProps {
  field: {
    value: StatsGetResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
}

/** Format credit cents as dollars: 100 credits = $1. Drops .00 for whole dollar amounts. */
function formatDollars(credits: number): string {
  const dollars = credits / 100;
  return dollars % 1 === 0
    ? `$${dollars.toFixed(0)}`
    : `$${dollars.toFixed(2)}`;
}

/**
 * Stat card component with modern design
 */
function StatCard({
  title,
  IconComponent,
  iconColorClassName: iconColor,
  iconBgClassName: iconBg,
  value,
  valueColorClassName: valueColor,
  description,
  formatAsDollars = false,
}: {
  title: string;
  IconComponent: React.ComponentType<{ className?: string }>;
  iconColorClassName: string;
  iconBgClassName: string;
  value: number;
  valueColorClassName: string;
  description: string;
  formatAsDollars?: boolean;
}): React.JSX.Element {
  const valueClassName = `text-2xl font-bold tabular-nums tracking-tight ${valueColor}`;
  const iconContainerClassName = `flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${iconBg}`;
  const iconClassName = `h-6 w-6 ${iconColor}`;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <Div className="flex items-start justify-between gap-4">
          <Div className="flex-1 space-y-1">
            <Div className="text-sm font-medium text-muted-foreground">
              {title}
            </Div>
            <Div className={valueClassName}>
              {formatAsDollars ? formatDollars(value) : value.toLocaleString()}
            </Div>
            <Div className="text-xs text-muted-foreground">{description}</Div>
          </Div>
          <Div className={iconContainerClassName}>
            <IconComponent className={iconClassName} />
          </Div>
        </Div>
      </CardContent>
    </Card>
  );
}

/**
 * Custom container widget for referral stats
 */
export function ReferralStatsContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const stats = field.value;
  const t = useWidgetTranslation<typeof definition.GET>();

  if (!stats) {
    return <Div />;
  }

  const allZero =
    stats.totalSignupsValue === 0 &&
    stats.totalRevenueValue === 0 &&
    stats.totalEarnedValue === 0 &&
    stats.availableCreditsValue === 0;

  return (
    <Div className="space-y-4">
      {allZero && (
        <Div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/50 border text-sm text-muted-foreground">
          <Link2 className="h-4 w-4 shrink-0 text-violet-400" />
          <Div>{t("stats.widget.emptyMessage")}</Div>
        </Div>
      )}
      <Div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t(stats.totalSignupsTitle)}
          IconComponent={Users}
          iconColorClassName={"text-slate-700 dark:text-slate-300"}
          iconBgClassName={"bg-slate-100 dark:bg-slate-800"}
          value={stats.totalSignupsValue}
          valueColorClassName={"text-foreground"}
          description={t(stats.totalSignupsDescription)}
        />

        <StatCard
          title={t(stats.totalRevenueTitle)}
          IconComponent={TrendingUp}
          iconColorClassName={"text-emerald-700 dark:text-emerald-300"}
          iconBgClassName={"bg-emerald-100 dark:bg-emerald-900/30"}
          value={stats.totalRevenueValue}
          valueColorClassName={"text-emerald-600 dark:text-emerald-400"}
          description={t(stats.totalRevenueDescription)}
          formatAsDollars
        />

        <StatCard
          title={t(stats.totalEarnedTitle)}
          IconComponent={DollarSign}
          iconColorClassName={"text-info"}
          iconBgClassName={"bg-info/10"}
          value={stats.totalEarnedValue}
          valueColorClassName={"text-info"}
          description={t(stats.totalEarnedDescription)}
          formatAsDollars
        />

        <StatCard
          title={t(stats.availableCreditsTitle)}
          IconComponent={Wallet}
          iconColorClassName={
            stats.availableCreditsReadyForPayout
              ? "text-violet-700 dark:text-violet-300"
              : "text-warning"
          }
          iconBgClassName={
            stats.availableCreditsReadyForPayout
              ? "bg-violet-100 dark:bg-violet-900/30"
              : "bg-warning/10"
          }
          value={stats.availableCreditsValue}
          valueColorClassName={
            stats.availableCreditsReadyForPayout
              ? "text-violet-600 dark:text-violet-400"
              : "text-warning"
          }
          description={t(stats.availableCreditsDescription, {
            minPayout: `$${(REFERRAL_CONFIG.MIN_PAYOUT_CENTS / 100).toFixed(2)}`,
          })}
          formatAsDollars
        />
      </Div>
    </Div>
  );
}
