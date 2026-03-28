"use client";

import type { Route } from "next";
import type { IconComponent } from "next-vibe-ui/lib/helper";
import { Div } from "next-vibe-ui/ui/div";
import { History } from "next-vibe-ui/ui/icons/History";
import { Link2 } from "next-vibe-ui/ui/icons/Link2";
import { ShoppingCart } from "next-vibe-ui/ui/icons/ShoppingCart";
import { TrendingUp } from "next-vibe-ui/ui/icons/TrendingUp";
import { Link } from "next-vibe-ui/ui/link";
import { cn } from "next-vibe/shared/utils/utils";
import type { JSX } from "react";

import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { scopedTranslation } from "@/app/[locale]/subscription/i18n";

interface SubscriptionTabsNavProps {
  locale: CountryLanguage;
  activeTab: string;
  user: JwtPayloadType;
}

export function SubscriptionTabsNav({
  locale,
  activeTab,
  user,
}: SubscriptionTabsNavProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);

  const tabs: Array<{
    value: string;
    href: Route;
    icon: IconComponent;
    label: string;
  }> = [
    {
      value: "overview",
      href: `/${locale}/subscription/overview`,
      icon: TrendingUp,
      label: t("subscription.tabs.overview"),
    },
    {
      value: "buy",
      href: `/${locale}/subscription/buy`,
      icon: ShoppingCart,
      label: t("subscription.tabs.buy"),
    },
    {
      value: "history",
      href: `/${locale}/subscription/history`,
      icon: History,
      label: t("subscription.tabs.history"),
    },
    ...(user.isPublic
      ? []
      : [
          {
            value: "remote",
            href: `/${locale}/subscription/remote`,
            icon: Link2,
            label: t("subscription.tabs.remote"),
          },
        ]),
  ];

  return (
    <Div className="inline-flex h-11 items-center justify-center rounded-lg bg-muted/50 p-1 text-muted-foreground border border-border w-full">
      <Div className={`grid w-full grid-cols-${tabs.length.toString()} gap-1`}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.value;

          return (
            <Link
              key={tab.value}
              href={tab.href}
              className={cn(
                "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "hover:bg-muted/80 hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </Link>
          );
        })}
      </Div>
    </Div>
  );
}
