/**
 * Custom Widget for Referral Stats
 */

"use client";

import { Div } from "next-vibe/ui/components/div";
import { DollarSign } from "next-vibe/ui/components/icons/DollarSign";
import { Link2 } from "next-vibe/ui/components/icons/Link2";
import { TrendingUp } from "next-vibe/ui/components/icons/TrendingUp";
import { Users } from "next-vibe/ui/components/icons/Users";
import { Wallet } from "next-vibe/ui/components/icons/Wallet";
import { Span } from "next-vibe/ui/components/span";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import {
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";

import { REFERRAL_CONFIG } from "../config";
import type definition from "./definition";

/** Format credit cents as dollars: 100 credits = $1. Drops .00 for whole dollar amounts. */
function formatDollars(credits: number): string {
  const dollars = credits / 100;
  return dollars % 1 === 0
    ? `$${dollars.toFixed(0)}`
    : `$${dollars.toFixed(2)}`;
}

/**
 * One stat tile: label, big number, one-line hint.
 */
function StatCard({
  title,
  IconComponent,
  highlight = false,
  value,
  description,
  formatAsDollars = false,
}: {
  title: string;
  IconComponent: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
  value: number;
  description: string;
  formatAsDollars?: boolean;
}): React.JSX.Element {
  return (
    <Div
      className={cn(
        "flex flex-col gap-2 rounded-xl border bg-card p-4 shadow-sm sm:p-5",
        highlight && "border-primary/40 ring-1 ring-primary/20",
      )}
    >
      <Div className="flex items-center justify-between gap-2">
        <Span className="text-xs font-medium text-muted-foreground sm:text-sm">
          {title}
        </Span>
        <Span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
            highlight
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground",
          )}
        >
          <IconComponent className="h-4 w-4" />
        </Span>
      </Div>
      <Span
        className={cn(
          "text-2xl font-semibold tabular-nums tracking-tight",
          highlight ? "text-primary" : "text-foreground",
        )}
      >
        {formatAsDollars ? formatDollars(value) : value.toLocaleString()}
      </Span>
      <Span className="text-xs leading-snug text-muted-foreground">
        {description}
      </Span>
    </Div>
  );
}

/**
 * Custom container widget for referral stats
 */
export function ReferralStatsContainer(): React.JSX.Element {
  const stats = useWidgetValue<typeof definition.GET>();
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
    <Div className="flex flex-col gap-3">
      {allZero && (
        <Div className="flex items-center gap-3 rounded-lg border border-dashed bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          <Link2 className="h-4 w-4 shrink-0 text-primary" />
          <Div>{t("stats.widget.emptyMessage")}</Div>
        </Div>
      )}
      <Div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          title={t(stats.totalSignupsTitle)}
          IconComponent={Users}
          value={stats.totalSignupsValue}
          description={t(stats.totalSignupsDescription)}
        />
        <StatCard
          title={t(stats.totalRevenueTitle)}
          IconComponent={TrendingUp}
          value={stats.totalRevenueValue}
          description={t(stats.totalRevenueDescription)}
          formatAsDollars
        />
        <StatCard
          title={t(stats.totalEarnedTitle)}
          IconComponent={DollarSign}
          value={stats.totalEarnedValue}
          description={t(stats.totalEarnedDescription)}
          formatAsDollars
        />
        <StatCard
          title={t(stats.availableCreditsTitle)}
          IconComponent={Wallet}
          highlight
          value={stats.availableCreditsValue}
          description={t(stats.availableCreditsDescription, {
            minPayout: `$${(REFERRAL_CONFIG.MIN_PAYOUT_CENTS / 100).toFixed(2)}`,
          })}
          formatAsDollars
        />
      </Div>
    </Div>
  );
}
