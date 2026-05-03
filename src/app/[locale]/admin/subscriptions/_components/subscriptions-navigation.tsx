/**
 * Subscriptions Navigation Component
 * Navigation tabs for subscriptions admin pages
 */

"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { BarChart3 } from "next-vibe-ui/ui/icons/BarChart3";
import { CreditCard } from "next-vibe-ui/ui/icons/CreditCard";
import { GitBranch } from "next-vibe-ui/ui/icons/GitBranch";
import { ShoppingCart } from "next-vibe-ui/ui/icons/ShoppingCart";
import { Link as NextLink } from "next-vibe-ui/ui/link";
import { Nav } from "next-vibe-ui/ui/nav";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation as pageT } from "../i18n";
import { CurrentPageType } from "./admin-subscriptions-layout-client";

interface SubscriptionsNavigationProps {
  locale: CountryLanguage;
  currentPage: CurrentPageType;
}

export function SubscriptionsNavigation({
  locale,
  currentPage,
}: SubscriptionsNavigationProps): JSX.Element {
  const { t } = pageT.scopedT(locale);

  const navigationItems = [
    {
      key: CurrentPageType.stats,
      href: `/${locale}/admin/subscriptions` as const,
      icon: BarChart3,
      label: t("tabs.stats"),
      description: t("tabs.stats_description"),
    },
    {
      key: CurrentPageType.list,
      href: `/${locale}/admin/subscriptions/list` as const,
      icon: CreditCard,
      label: t("tabs.list"),
      description: t("tabs.list_description"),
    },
    {
      key: CurrentPageType.purchases,
      href: `/${locale}/admin/subscriptions/purchases` as const,
      icon: ShoppingCart,
      label: t("tabs.purchases"),
      description: t("tabs.purchases_description"),
    },
    {
      key: CurrentPageType.referrals,
      href: `/${locale}/admin/subscriptions/referrals` as const,
      icon: GitBranch,
      label: t("tabs.referrals"),
      description: t("tabs.referrals_description"),
    },
  ] as const;

  return (
    <Div className="border-b border-gray-200 dark:border-gray-700">
      <Nav className="flex flex-row gap-8" aria-label={t("tabs.overview")}>
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.key === currentPage;

          return (
            <NextLink
              key={item.key}
              href={item.href}
              className={cn(
                "group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                className={cn(
                  "mr-2 h-5 w-5",
                  isActive
                    ? "text-primary"
                    : "text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300",
                )}
              />
              <Span>{item.label}</Span>
            </NextLink>
          );
        })}
      </Nav>
    </Div>
  );
}
