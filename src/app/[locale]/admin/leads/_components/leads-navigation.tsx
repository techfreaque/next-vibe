/**
 * Leads Navigation Component
 * Navigation tabs for different leads admin pages
 */

"use client";

import {
  BarChart3,
  List,
  Mail,
  Settings,
  TestTube,
} from "next-vibe-ui/ui/icons";
import { cn } from "next-vibe/shared/utils";
import { Link } from "next-vibe-ui/ui/link";
import { Span } from "next-vibe-ui/ui/span";
import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { CurrentPageType } from "./admin-leads-layout-client";

interface LeadsNavigationProps {
  locale: CountryLanguage;
  currentPage: CurrentPageType;
}

export function LeadsNavigation({
  locale,
  currentPage,
}: LeadsNavigationProps): JSX.Element {
  const { t } = simpleT(locale);

  const navigationItems = [
    {
      key: CurrentPageType.stats,
      href: `/${locale}/admin/leads` as const,
      icon: BarChart3,
      label: t("app.admin.leads.leads.admin.tabs.stats"),
      description: t("app.admin.leads.leads.admin.tabs.stats_description"),
    },
    {
      key: CurrentPageType.list,
      href: `/${locale}/admin/leads/list` as const,
      icon: List,
      label: t("app.admin.leads.leads.admin.tabs.leads"),
      description: t("app.admin.leads.leads.admin.tabs.leads_description"),
    },
    {
      key: CurrentPageType.emails,
      href: `/${locale}/admin/leads/emails` as const,
      icon: Mail,
      label: t("app.admin.leads.leads.admin.tabs.emails"),
      description: t("app.admin.leads.leads.admin.tabs.emails_description"),
    },
    {
      key: CurrentPageType.abTesting,
      href: `/${locale}/admin/leads/ab-testing` as const,
      icon: TestTube,
      label: t("app.admin.leads.leads.admin.tabs.abTesting"),
      description: t("app.admin.leads.leads.admin.tabs.abTesting_description"),
    },
    {
      key: CurrentPageType.campaignStarter,
      href: `/${locale}/admin/leads/campaign-starter` as const,
      icon: Settings,
      label: t("app.admin.leads.leads.admin.tabs.campaignStarter"),
      description: t(
        "app.admin.leads.leads.admin.tabs.campaignStarter_description",
      ),
    },
  ] as const;

  return (
    <Div className="border-b border-gray-200 dark:border-gray-700">
      <nav
        className="flex flex flex-row gap-8"
        aria-label={t("app.admin.leads.leads.admin.tabs.overview")}
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
              <Span>{item.label}</Span>
            </Link>
          );
        })}
      </nav>
    </Div>
  );
}
