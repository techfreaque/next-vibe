"use client";

import { History, ShoppingCart, TrendingUp } from "next-vibe-ui/ui/icons";
import { usePathname } from "next-vibe-ui/hooks/use-navigation";
import Link from "next/link";
import type { JSX } from "react";
import { cn } from "next-vibe/shared/utils/utils";
import { Div } from "next-vibe-ui/ui/div";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface SubscriptionTabsNavProps {
  locale: CountryLanguage;
}

export function SubscriptionTabsNav({
  locale,
}: SubscriptionTabsNavProps): JSX.Element {
  const { t } = simpleT(locale);
  const pathname = usePathname();

  const tabs = [
    {
      value: "overview",
      href: `/${locale}/subscription/overview`,
      icon: TrendingUp,
      label: t("app.subscription.subscription.tabs.overview"),
    },
    {
      value: "buy",
      href: `/${locale}/subscription/buy-credits`,
      icon: ShoppingCart,
      label: t("app.subscription.subscription.tabs.buy"),
    },
    {
      value: "history",
      href: `/${locale}/subscription/history`,
      icon: History,
      label: t("app.subscription.subscription.tabs.history"),
    },
  ];

  return (
    <Div className="inline-flex h-11 items-center justify-center rounded-lg bg-muted/50 p-1 text-muted-foreground border border-border w-full">
      <Div className="grid w-full grid-cols-3 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;

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
