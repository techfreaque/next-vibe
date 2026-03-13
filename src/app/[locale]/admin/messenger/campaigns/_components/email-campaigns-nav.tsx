"use client";

import { cn } from "next-vibe/shared/utils";
import { usePathname } from "next-vibe-ui/hooks/use-pathname";
import { Div } from "next-vibe-ui/ui/div";
import { Activity } from "next-vibe-ui/ui/icons/Activity";
import { BarChart3 } from "next-vibe-ui/ui/icons/BarChart3";
import { List } from "next-vibe-ui/ui/icons/List";
import { Mail } from "next-vibe-ui/ui/icons/Mail";
import { Settings } from "next-vibe-ui/ui/icons/Settings";
import { TestTube } from "next-vibe-ui/ui/icons/TestTube";
import { Link } from "next-vibe-ui/ui/link";
import { Nav } from "next-vibe-ui/ui/nav";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation } from "./i18n";

interface EmailCampaignsNavProps {
  locale: CountryLanguage;
}

export function EmailCampaignsNav({
  locale,
}: EmailCampaignsNavProps): JSX.Element {
  const pathname = usePathname();
  const { t } = scopedTranslation.scopedT(locale);

  const navigationItems = [
    {
      href: `/${locale}/admin/messenger/campaigns` as const,
      icon: BarChart3,
      label: t("tabs.dashboard"),
      description: t("tabs.dashboard_description"),
      exact: true,
    },
    {
      href: `/${locale}/admin/messenger/campaigns/queue` as const,
      icon: List,
      label: t("tabs.queue"),
      description: t("tabs.queue_description"),
      exact: false,
    },
    {
      href: `/${locale}/admin/messenger/campaigns/journeys` as const,
      icon: Mail,
      label: t("tabs.journeys"),
      description: t("tabs.journeys_description"),
      exact: false,
    },
    {
      href: `/${locale}/admin/messenger/campaigns/ab-testing` as const,
      icon: TestTube,
      label: t("tabs.abTesting"),
      description: t("tabs.abTesting_description"),
      exact: false,
    },
    {
      href: `/${locale}/admin/messenger/campaigns/settings` as const,
      icon: Settings,
      label: t("tabs.settings"),
      description: t("tabs.settings_description"),
      exact: false,
    },
    {
      href: `/${locale}/admin/messenger/campaigns/monitoring` as const,
      icon: Activity,
      label: t("tabs.monitoring"),
      description: t("tabs.monitoring_description"),
      exact: false,
    },
  ] as const;

  return (
    <Div className="border-b border-gray-200 dark:border-gray-700">
      <Nav className="flex flex-row gap-8" aria-label={t("tabs.overview")}>
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
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
      </Nav>
    </Div>
  );
}
