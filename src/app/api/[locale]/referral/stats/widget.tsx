/**
 * Custom Widget for Referral Stats
 */

"use client";

import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { DollarSign, TrendingUp, Users, Wallet } from "next-vibe-ui/ui/icons";

import { useWidgetTranslation } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type definition from "./definition";
import type { StatsGetResponseOutput } from "./definition";

/**
 * Props for custom widget
 */
interface CustomWidgetProps {
  field: {
    value: StatsGetResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
  fieldName: string;
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
}: {
  title: string;
  IconComponent: React.ComponentType<{ className?: string }>;
  iconColorClassName: string;
  iconBgClassName: string;
  value: number;
  valueColorClassName: string;
  description: string;
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
            <Div className={valueClassName}>{value.toLocaleString()}</Div>
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
  const t = useWidgetTranslation();

  if (!stats) {
    return <Div />;
  }

  return (
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
      />

      <StatCard
        title={t(stats.totalEarnedTitle)}
        IconComponent={DollarSign}
        iconColorClassName={"text-blue-700 dark:text-blue-300"}
        iconBgClassName={"bg-blue-100 dark:bg-blue-900/30"}
        value={stats.totalEarnedValue}
        valueColorClassName={"text-blue-600 dark:text-blue-400"}
        description={t(stats.totalEarnedDescription)}
      />

      <StatCard
        title={t(stats.availableCreditsTitle)}
        IconComponent={Wallet}
        iconColorClassName={"text-violet-700 dark:text-violet-300"}
        iconBgClassName={"bg-violet-100 dark:bg-violet-900/30"}
        value={stats.availableCreditsValue}
        valueColorClassName={"text-violet-600 dark:text-violet-400"}
        description={t(stats.availableCreditsDescription)}
      />
    </Div>
  );
}
