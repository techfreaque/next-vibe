/**
 * Custom Widget for Referral Stats
 */

"use client";

import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { AlertCircle } from "next-vibe/ui/components/icons/AlertCircle";
import { Coins } from "next-vibe/ui/components/icons/Coins";
import { Link2 } from "next-vibe/ui/components/icons/Link2";
import { TrendingUp } from "next-vibe/ui/components/icons/TrendingUp";
import { Users } from "next-vibe/ui/components/icons/Users";
import { Wallet } from "next-vibe/ui/components/icons/Wallet";
import { Span } from "next-vibe/ui/components/span";
import { canRetryRecordRead } from "next-vibe/unified-ui/_shared/admin-record-context";
import { AdminRecordDetail } from "next-vibe/unified-ui/_shared/admin-record-detail";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import {
  formatMoney,
  formatQuantity,
} from "next-vibe/unified-ui/_shared/format-money";
import { useRelatedEntityNavigation } from "next-vibe/unified-ui/_shared/related-entities";
import {
  useWidgetEndpointMutations,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetResponse,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";

import { REFERRAL_CONFIG } from "../config";
import type definition from "./definition";

/**
 * One stat tile: label, big number, one-line hint.
 */
function StatCard({
  title,
  IconComponent,
  highlight = false,
  value,
  description,
}: {
  title: string;
  IconComponent: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
  value: string;
  description: string;
}): React.JSX.Element {
  return (
    <Div
      className={cn(
        "flex flex-col min-w-0 gap-2 rounded-xl border bg-card p-3 shadow-sm sm:p-5",
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
          "text-2xl font-semibold tabular-nums tracking-tight break-words",
          highlight ? "text-primary" : "text-foreground",
        )}
      >
        {value}
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
  const user = useWidgetUser();
  const response = useWidgetResponse();
  const read = useWidgetEndpointMutations()?.read;
  const title = t("stats.get.title");
  const locale = useWidgetLocale();
  const interactive = useWidgetIsInteractive();
  const navigate = useRelatedEntityNavigation();
  const isAdmin =
    !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);

  const openOverview = (): void =>
    navigate(() =>
      import("../admin/overview/definition").then(
        (module) => module.default.GET,
      ),
    );
  const openCodes = (): void =>
    navigate(() =>
      import("../codes/list/definition").then((module) => module.default.GET),
    );

  if (!stats) {
    if (response?.success === false && !read?.isFetching && !read?.isLoading) {
      const icon = <AlertCircle className="size-5 text-destructive" />;
      const retry =
        interactive && read && canRetryRecordRead(response.errorType.errorCode);
      return (
        <AdminRecordDetail
          title={title}
          border={false}
          state={{
            kind: "error",
            title: t("stats.widget.loadError"),
            icon,
            action: retry
              ? {
                  label: t("stats.widget.retry"),
                  onClick: () => void read.refetch(),
                }
              : undefined,
          }}
        />
      );
    }
    return (
      <AdminRecordDetail
        title={title}
        border={false}
        state={{ kind: "loading", label: t("stats.widget.loading") }}
      />
    );
  }

  const measured = stats.totalRevenueMeasuredPurchases;
  const purchases = stats.totalRevenuePurchaseCount;
  const revenue =
    measured || purchases === 0
      ? formatMoney(stats.totalRevenueValue / 100, "USD", locale)
      : t("stats.widget.revenueUnavailable");
  const revenueDescription =
    measured !== undefined && purchases
      ? t("stats.widget.revenueCoverage", {
          measured: measured.toLocaleString(locale),
          total: purchases.toLocaleString(locale),
        })
      : t(stats.totalRevenueDescription);
  const walletUnits = (value: number): string =>
    t("stats.widget.walletUnits", { amount: formatQuantity(value, locale) });
  const allZero =
    stats.totalSignupsValue === 0 &&
    purchases === 0 &&
    stats.totalEarnedValue === 0 &&
    stats.availableCreditsValue === 0;

  if (allZero) {
    const icon = <Link2 className="size-5 text-primary" />;
    return (
      <AdminRecordDetail
        title={title}
        border={false}
        state={{
          kind: "empty",
          title: t("stats.widget.emptyTitle"),
          message: t(
            isAdmin
              ? "stats.widget.emptyAdminMessage"
              : "stats.widget.emptyMessage",
          ),
          icon,
          action: interactive
            ? {
                label: isAdmin
                  ? t("stats.widget.openOverview")
                  : t("stats.widget.openCodes"),
                onClick: isAdmin ? openOverview : openCodes,
              }
            : undefined,
        }}
      />
    );
  }

  return (
    <AdminRecordDetail title={title} border={false}>
      {isAdmin && (
        <Div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm">
          <Span>{t("stats.widget.adminNotice")}</Span>
          {interactive && (
            <Button type="button" size="sm" onClick={openOverview}>
              {t("stats.widget.openOverview")}
            </Button>
          )}
        </Div>
      )}
      <Div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title={t(stats.totalSignupsTitle)}
          IconComponent={Users}
          value={stats.totalSignupsValue.toLocaleString(locale)}
          description={t(stats.totalSignupsDescription)}
        />
        <StatCard
          title={t(stats.totalRevenueTitle)}
          IconComponent={TrendingUp}
          value={revenue}
          description={revenueDescription}
        />
        <StatCard
          title={t(stats.totalEarnedTitle)}
          IconComponent={Coins}
          value={walletUnits(stats.totalEarnedValue)}
          description={t(stats.totalEarnedDescription)}
        />
        <StatCard
          title={t(stats.availableCreditsTitle)}
          IconComponent={Wallet}
          highlight
          value={walletUnits(stats.availableCreditsValue)}
          description={t(stats.availableCreditsDescription, {
            minPayout: formatQuantity(REFERRAL_CONFIG.MIN_PAYOUT_CENTS, locale),
          })}
        />
      </Div>
    </AdminRecordDetail>
  );
}
