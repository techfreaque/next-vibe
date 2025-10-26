/**
 * Users Navigation Component
 * Navigation tabs for users admin pages
 */

"use client";

import { BarChart3, List, UserPlus } from "lucide-react";
import Link from "next/link";
import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { CurrentPageType } from "./admin-users-layout-client";

interface UsersNavigationProps {
  locale: CountryLanguage;
  currentPage: CurrentPageType;
}

export function UsersNavigation({
  locale,
  currentPage,
}: UsersNavigationProps): JSX.Element {
  const { t } = simpleT(locale);

  const navigationItems = [
    {
      key: CurrentPageType.overview,
      href: `/${locale}/admin/users` as const,
      icon: BarChart3,
      label: t("app.admin.users.tabs.stats"),
      description: t("app.admin.users.tabs.stats_description"),
    },
    {
      key: CurrentPageType.list,
      href: `/${locale}/admin/users/list` as const,
      icon: List,
      label: t("app.admin.users.tabs.list"),
      description: t("app.admin.users.tabs.list_description"),
    },
    {
      key: CurrentPageType.add,
      href: `/${locale}/admin/users/create` as const,
      icon: UserPlus,
      label: t("app.admin.users.tabs.add"),
      description: t("app.admin.users.tabs.add_description"),
    },
  ] as const;

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav
        className="flex space-x-8"
        aria-label={t("app.admin.users.tabs.overview")}
      >
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.key === currentPage;

          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                isActive
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                className={cn(
                  "mr-2 h-5 w-5",
                  isActive
                    ? "text-blue-500 dark:text-blue-400"
                    : "text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300",
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
