"use client";
import { useProviderAvailability } from "next-vibe/agent/env-availability-store";
import { getAvailableChatModelCount } from "next-vibe/agent/models/all-models";
import { useTranslation } from "next-vibe/core/i18n/core/client";
import { UserRole } from "next-vibe/identity/roles/enum";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Calendar } from "next-vibe/ui/components/icons/Calendar";
import { Coins } from "next-vibe/ui/components/icons/Coins";
import { Gift } from "next-vibe/ui/components/icons/Gift";
import { History } from "next-vibe/ui/components/icons/History";
import { Link2 } from "next-vibe/ui/components/icons/Link2";
import { ShoppingCart } from "next-vibe/ui/components/icons/ShoppingCart";
import { Sparkles } from "next-vibe/ui/components/icons/Sparkles";
import { TrendingUp } from "next-vibe/ui/components/icons/TrendingUp";
import { Zap } from "next-vibe/ui/components/icons/Zap";
import { Link } from "next-vibe/ui/components/link";
import { MetricCard } from "next-vibe/ui/components/metric-card";
import { Skeleton } from "next-vibe/ui/components/skeleton";
import { Span } from "next-vibe/ui/components/span";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import {
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetUser,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import type { JSX } from "react";

import { scopedTranslation as subscriptionScopedT } from "@/_pages/subscription/i18n";
import {
  FREE_CREDIT_ALLOWANCE,
  FREE_CREDIT_SIGNED_IN_TOTAL,
} from "@/products/constants";
import {
  getPricingParams,
  ProductIds,
  productsRepository,
} from "@/products/repository-client";
import { useSubscription } from "@/subscription/hooks";

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
  const availability = useProviderAvailability();
  const totalModelCount = getAvailableChatModelCount(isAdmin, availability);

  const subscriptionEndpoint = useSubscription(logger, widgetUser);
  const currentSubscription = subscriptionEndpoint.read?.data;

  const endpoint = useEndpoint(
    creditsDefinition,
    {
      read: {
        queryOptions: {
          staleTime: 10_000,
          refetchOnWindowFocus: true,
          // Guests have a real (lead-scoped) free balance too - a disabled
          // query left them on an endless skeleton.
        },
      },
    },
    logger,
    widgetUser,
  );

  const data = endpoint.read?.data;
  // Loading, failed and loaded are three different screens - a failed load
  // gets an error + retry, never a skeleton that never resolves or a fake 0.
  const readFailed = !data && endpoint.read?.response?.success === false;
  const retryRead = (): void => {
    void endpoint.read?.refetch();
  };

  const subProduct = productsRepository.getProduct(
    ProductIds.SUBSCRIPTION,
    locale,
  );
  const packProduct = productsRepository.getProduct(
    ProductIds.CREDIT_PACK,
    locale,
  );
  const pricing = getPricingParams(locale);
  // Monthly free allowance by tier (guest / signed-in / +newsletter)
  const freeTiers = {
    guest: FREE_CREDIT_ALLOWANCE.guest,
    signedIn: FREE_CREDIT_SIGNED_IN_TOTAL,
    bonus: FREE_CREDIT_ALLOWANCE.newsletterBonus,
  };

  const totalFormatted = data ? formatCredits(data.total) : "—";
  const totalLabel = data
    ? data.total === 1
      ? t("get.balance.credit", { count: totalFormatted })
      : t("get.balance.credits", { count: totalFormatted })
    : "—";
  // Under a fifth of the signed-in monthly allowance counts as running low.
  const lowBalanceThreshold = FREE_CREDIT_SIGNED_IN_TOTAL / 5;
  const isLowBalance = data !== undefined && data.total < lowBalanceThreshold;
  const isEmptyBalance = data !== undefined && data.total <= 0;
  const headerTitle = isAdmin
    ? t("get.balance.adminTitle")
    : t("get.balance.title");
  const headerDescription = isAdmin
    ? t("get.balance.adminDescription")
    : t("get.balance.description", { modelCount: totalModelCount });

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
        const def = await import("@/subscription/create/definition");
        navigation.push(def.default.POST, {});
      } else if (tab === "history") {
        const def = await import("@/credits/history/definition");
        navigation.push(def.default.GET, {});
      } else if (tab === "remote") {
        const def = await import("next-vibe/remote-connection/list/definition");
        navigation.push(def.default.GET, {});
      }
    })();
  };

  return (
    <Div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      {/* Balance header */}
      <Div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <Div className="flex min-w-0 items-center gap-3">
          <Div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Coins className="h-5 w-5" />
          </Div>
          <Div className="flex min-w-0 flex-col gap-0.5">
            <Span className="text-lg font-semibold leading-tight tracking-tight">
              {headerTitle}
            </Span>
            <Span className="text-sm text-muted-foreground">
              {headerDescription}
            </Span>
          </Div>
        </Div>
        {data ? (
          <Span className="shrink-0 text-2xl font-semibold tabular-nums tracking-tight text-primary sm:text-3xl">
            {totalLabel}
          </Span>
        ) : readFailed ? (
          <Div className="flex shrink-0 items-center gap-2 text-sm">
            <Span className="text-destructive">
              {t("get.balance.loadFailed")}
            </Span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={retryRead}
            >
              {t("get.balance.retry")}
            </Button>
          </Div>
        ) : (
          <Skeleton className="h-9 w-32 shrink-0 rounded-md" />
        )}
      </Div>

      {/* Metric cards */}
      <Div className="px-5 pb-5 sm:px-6">
        {data ? (
          <Div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
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
            />
            <MetricCard
              label={t("get.balance.free.title")}
              value={formatCredits(data.free)}
              description={
                isAdmin
                  ? t("get.balance.free.adminDescription", freeTiers)
                  : isAuthenticated
                    ? t("get.balance.free.description", {
                        count: freeTiers.signedIn,
                        bonus: freeTiers.bonus,
                      })
                    : t("get.balance.free.descriptionGuest", freeTiers)
              }
              icon={<Zap className="h-4 w-4" />}
              variant="info"
            />
            <Link href={`/${locale}/user/referral`} className="block">
              <MetricCard
                label={t("get.balance.earned.title")}
                value={formatCredits(data.earned)}
                description={t("get.balance.earned.description")}
                icon={<Gift className="h-4 w-4" />}
                className="h-full cursor-pointer transition-colors hover:border-primary/40 hover:bg-accent/50"
              />
            </Link>
          </Div>
        ) : readFailed ? null : (
          <Div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </Div>
        )}
      </Div>

      {/* Subscription status card */}
      {currentSubscription?.hasSubscription && (
        <Div className="px-5 pb-5 sm:px-6">
          <SubscriptionStatusCard
            locale={locale}
            initialSubscription={currentSubscription}
            user={widgetUser}
            logger={logger}
          />
        </Div>
      )}

      {/* Guests: what they get now and the free step up */}
      {!isAuthenticated && (
        <Div className="px-5 pb-5 sm:px-6">
          <Div className="flex flex-col gap-3 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
            <Div className="flex flex-col gap-0.5">
              <Span className="text-sm font-semibold">
                {t("get.balance.guestPlan")}
              </Span>
              <Span className="text-sm text-muted-foreground">
                {t("get.balance.free.descriptionGuest", freeTiers)}
              </Span>
            </Div>
            <Link
              href={`/${locale}/user/signup`}
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground no-underline transition-colors hover:bg-primary/90 sm:h-10"
            >
              {t("get.balance.signUp")}
            </Link>
          </Div>
        </Div>
      )}

      {/* Low or empty balance: the moment to top up, with the real pack. */}
      {isAuthenticated && !isAdmin && isLowBalance && (
        <Div className="px-5 pb-5 sm:px-6">
          <Div className="flex flex-col gap-3 rounded-lg border border-warning/40 bg-warning/10 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
            <Div className="flex flex-col gap-0.5">
              <Span className="text-sm font-semibold">
                {isEmptyBalance
                  ? t("get.balance.lowBalance.emptyTitle")
                  : t("get.balance.lowBalance.title", {
                      count: totalFormatted,
                    })}
              </Span>
              <Span className="text-sm text-muted-foreground">
                {t("get.balance.lowBalance.hint", {
                  packCredits: packProduct.credits,
                  packPrice: pricing.packPrice,
                })}
              </Span>
            </Div>
            {activeTab !== "buy" && (
              <Button
                type="button"
                className="h-11 shrink-0 sm:h-10"
                onClick={() => handleTabClick("buy")}
              >
                {t("get.balance.lowBalance.cta")}
              </Button>
            )}
          </Div>
        </Div>
      )}

      {/* No plan yet: what they're on and the one step up */}
      {isAuthenticated &&
        !isAdmin &&
        !isLowBalance &&
        currentSubscription !== undefined &&
        !currentSubscription.hasSubscription && (
          <Div className="px-5 pb-5 sm:px-6">
            <Div className="flex flex-col gap-3 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
              <Div className="flex flex-col gap-0.5">
                <Span className="text-sm font-semibold">
                  {t("get.balance.freePlan")}
                </Span>
                <Span className="text-sm text-muted-foreground">
                  {t("get.balance.freePlanHint", {
                    count: freeTiers.signedIn,
                    bonus: freeTiers.bonus,
                    subCredits: subProduct.credits,
                  })}
                </Span>
              </Div>
              {activeTab !== "buy" && (
                <Button
                  type="button"
                  className="h-11 shrink-0 sm:h-10"
                  onClick={() => handleTabClick("buy")}
                >
                  {t("get.balance.subscribe")}
                </Button>
              )}
            </Div>
          </Div>
        )}

      {/* Tabs: 2×2 on phones, one row from sm up */}
      <Div className="border-t bg-muted/30 p-2">
        <Div
          className={cn(
            "grid grid-cols-2 gap-1",
            tabs.length === 4 ? "sm:grid-cols-4" : "sm:grid-cols-3",
          )}
          role="tablist"
        >
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <Button
                key={tab.id}
                type="button"
                variant="ghost"
                onClick={() => handleTabClick(tab.id)}
                role="tab"
                className={cn(
                  "h-11 gap-2 whitespace-nowrap rounded-lg px-3 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-card text-foreground shadow-sm ring-1 ring-border hover:bg-card"
                    : "text-muted-foreground hover:bg-card/60 hover:text-foreground",
                )}
              >
                <TabIcon
                  className={cn(
                    "h-4 w-4",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}
                />
                {tab.label}
              </Button>
            );
          })}
        </Div>
      </Div>
    </Div>
  );
}
