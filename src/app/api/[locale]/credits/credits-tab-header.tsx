"use client";
import { useTranslation } from "next-vibe/core/i18n/core/client";
import { cn } from "next-vibe/core/utils/utils";
import { UserRole } from "next-vibe/identity/roles/enum";
import { useEndpoint } from "next-vibe/platforms/react/hooks/use-endpoint";
import { Badge } from "next-vibe/ui/web/ui/badge";
import { Button } from "next-vibe/ui/web/ui/button";
import { Div } from "next-vibe/ui/web/ui/div";
import { Calendar } from "next-vibe/ui/web/ui/icons/Calendar";
import { Coins } from "next-vibe/ui/web/ui/icons/Coins";
import { Gift } from "next-vibe/ui/web/ui/icons/Gift";
import { History } from "next-vibe/ui/web/ui/icons/History";
import { Link2 } from "next-vibe/ui/web/ui/icons/Link2";
import { ShoppingCart } from "next-vibe/ui/web/ui/icons/ShoppingCart";
import { Sparkles } from "next-vibe/ui/web/ui/icons/Sparkles";
import { TrendingUp } from "next-vibe/ui/web/ui/icons/TrendingUp";
import { Zap } from "next-vibe/ui/web/ui/icons/Zap";
import { Link } from "next-vibe/ui/web/ui/link";
import { MetricCard } from "next-vibe/ui/web/ui/metric-card";
import { MetricGrid } from "next-vibe/ui/web/ui/metric-grid";
import { Skeleton } from "next-vibe/ui/web/ui/skeleton";
import { Span } from "next-vibe/ui/web/ui/span";
import {
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetUser,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";

import { scopedTranslation as subscriptionScopedT } from "@/app/[locale]/subscription/i18n";
import {
  ProductIds,
  productsRepository,
} from "@/app/api/[locale]/products/repository-client";
import { useSubscription } from "@/app/api/[locale]/subscription/hooks";

import creditsDefinition from "./definition";
import { scopedTranslation } from "./i18n";
import { SubscriptionStatusCard } from "./subscription-status-card";

type TabId = "overview" | "buy" | "history" | "remote";

interface CreditsTabHeaderProps {
  activeTab: TabId;
}

function formatCredits(amount: number): string {
  const rounded = Math.round(amount * 100) / 100;
  if (rounded === Math.floor(rounded)) {
    return rounded.toString();
  }
  return rounded.toFixed(2);
}

export function CreditsTabHeader({
  activeTab,
}: CreditsTabHeaderProps): JSX.Element {
  const { locale: currentLocale } = useTranslation();
  const { t } = scopedTranslation.scopedT(currentLocale);
  const { t: tSub } = subscriptionScopedT.scopedT(currentLocale);
  const locale = useWidgetLocale();
  const widgetUser = useWidgetUser();
  const navigation = useWidgetNavigation();
  const logger = useWidgetLogger();

  const isAdmin =
    !widgetUser.isPublic && widgetUser.roles.includes(UserRole.ADMIN);
  const isAuthenticated = !widgetUser.isPublic;

  const subscriptionEndpoint = useSubscription(logger, widgetUser);
  const currentSubscription = subscriptionEndpoint.read?.data;

  const endpoint = useEndpoint(
    creditsDefinition,
    {
      read: {
        queryOptions: {
          staleTime: 10_000,
          refetchOnWindowFocus: true,
          enabled: isAuthenticated,
        },
      },
    },
    logger,
    widgetUser,
  );

  const data = endpoint.read?.data;

  const subProduct = productsRepository.getProduct(
    ProductIds.SUBSCRIPTION,
    locale,
  );
  const freeProduct = productsRepository.getProduct(
    ProductIds.FREE_TIER,
    locale,
  );

  const totalFormatted = data ? formatCredits(data.total) : "—";
  const totalLabel = data
    ? data.total === 1
      ? t("get.balance.credit", { count: totalFormatted })
      : t("get.balance.credits", { count: totalFormatted })
    : "—";
  const headerTitle = isAdmin
    ? t("get.balance.adminTitle")
    : t("get.balance.title");
  const headerDescription = isAdmin
    ? t("get.balance.adminDescription")
    : t("get.balance.description", { modelCount: "—" });

  interface TabDef {
    id: TabId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }
  const tabs: TabDef[] = [
    {
      id: "overview",
      label: tSub("subscription.tabs.overview"),
      icon: TrendingUp,
    },
    { id: "buy", label: tSub("subscription.tabs.buy"), icon: ShoppingCart },
    { id: "history", label: tSub("subscription.tabs.history"), icon: History },
    ...(isAuthenticated
      ? [
          {
            id: "remote" as TabId,
            label: tSub("subscription.tabs.remote"),
            icon: Link2,
          },
        ]
      : []),
  ];

  const handleTabClick = (tab: TabId): void => {
    if (tab === activeTab) {
      return;
    }
    void (async (): Promise<void> => {
      if (tab === "overview") {
        navigation.pop();
      } else if (tab === "buy") {
        const def =
          await import("@/app/api/[locale]/subscription/create/definition");
        navigation.push(def.default.POST, {});
      } else if (tab === "history") {
        const def =
          await import("@/app/api/[locale]/credits/history/definition");
        navigation.push(def.default.GET, {});
      } else if (tab === "remote") {
        const def =
          await import("@/app/api/[locale]/remote-connection/list/definition");
        navigation.push(def.default.GET, {});
      }
    })();
  };

  const colCount = tabs.length;

  return (
    <Div className="rounded-lg border bg-card overflow-hidden">
      {/* Balance header */}
      <Div className="flex items-start justify-between gap-4 p-6 pb-4">
        <Div className="flex items-center gap-3">
          <Div className="p-2 rounded-lg bg-primary/10 shrink-0">
            <Coins className="h-6 w-6 text-primary" />
          </Div>
          <Div className="flex flex-col gap-0.5">
            <Span className="text-xl font-semibold leading-tight">
              {headerTitle}
            </Span>
            <Span className="text-sm text-muted-foreground">
              {headerDescription}
            </Span>
          </Div>
        </Div>
        <Badge className="text-base font-bold px-4 py-1.5 shrink-0">
          {totalLabel}
        </Badge>
      </Div>

      {/* Metric cards */}
      <Div className="px-6 pb-4">
        {data ? (
          <MetricGrid columns={4}>
            <MetricCard
              label={t("get.balance.expiring.title")}
              value={formatCredits(data.expiring)}
              description={
                isAdmin
                  ? t("get.balance.expiring.adminDescription")
                  : t("get.balance.expiring.description", {
                      subCredits: subProduct.credits,
                    })
              }
              icon={<Calendar className="h-4 w-4" />}
              variant="warning"
              colored
            />
            <MetricCard
              label={t("get.balance.permanent.title")}
              value={formatCredits(data.permanent)}
              description={
                isAdmin
                  ? t("get.balance.permanent.adminDescription")
                  : t("get.balance.permanent.description")
              }
              icon={<Sparkles className="h-4 w-4" />}
              variant="success"
              colored
            />
            <MetricCard
              label={t("get.balance.free.title")}
              value={formatCredits(data.free)}
              description={
                isAdmin
                  ? t("get.balance.free.adminDescription", {
                      count: freeProduct.credits,
                    })
                  : t("get.balance.free.description", {
                      count: freeProduct.credits,
                    })
              }
              icon={<Zap className="h-4 w-4" />}
              variant="info"
              colored
            />
            <Link href={`/${locale}/user/referral`} className="block">
              <MetricCard
                label={t("get.balance.earned.title")}
                value={formatCredits(data.earned)}
                description={t("get.balance.earned.description")}
                icon={<Gift className="h-4 w-4" />}
                variant="violet"
                colored
                className="h-full hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-colors cursor-pointer"
              />
            </Link>
          </MetricGrid>
        ) : (
          <Div className="grid grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </Div>
        )}
      </Div>

      {/* Subscription status card */}
      {currentSubscription && (
        <Div className="px-6 pb-4">
          <SubscriptionStatusCard
            locale={locale}
            initialSubscription={currentSubscription}
          />
        </Div>
      )}

      {/* Pill tab nav */}
      <Div className="px-6 pb-4">
        <Div className="inline-flex h-11 items-center justify-center rounded-lg bg-muted/50 p-1 text-muted-foreground border border-border w-full">
          <Div className={`grid w-full grid-cols-${colCount.toString()} gap-1`}>
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <Button
                  key={tab.id}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleTabClick(tab.id)}
                  className={cn(
                    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-auto",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "hover:bg-muted/80 hover:text-foreground",
                  )}
                >
                  <TabIcon className="h-4 w-4" />
                  {tab.label}
                </Button>
              );
            })}
          </Div>
        </Div>
      </Div>
    </Div>
  );
}
