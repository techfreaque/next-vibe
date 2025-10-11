/**
 * Consultations Navigation Component
 * Navigation tabs for consultation admin pages
 */

import { BarChart3, Calendar, List, Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

type ConsultationPage = "stats" | "list" | "calendar";

interface ConsultationsNavigationProps {
  locale: CountryLanguage;
  currentPage: ConsultationPage;
}

export function ConsultationsNavigation({
  locale,
  currentPage,
}: ConsultationsNavigationProps): JSX.Element {
  const { t } = simpleT(locale);

  const navigationItems = [
    {
      key: "stats",
      href: `/${locale}/admin/consultations/stats` as const,
      icon: BarChart3,
      label: t("consultations.nav.stats"),
      description: t("consultations.admin.stats.title"),
    },
    {
      key: "list",
      href: `/${locale}/admin/consultations/list` as const,
      icon: List,
      label: t("consultations.nav.list"),
      description: t("consultations.admin.list.title"),
    },
    {
      key: "calendar",
      href: `/${locale}/admin/consultations/calendar` as const,
      icon: Calendar,
      label: t("consultations.nav.calendar"),
      description: t("consultations.admin.calendar.title"),
    },
  ] as const;

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <nav className="-mb-px flex space-x-8">
          {navigationItems.map((item) => {
            const isActive = currentPage === item.key;
            const Icon = item.icon;

            return (
              <Link key={item.key} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium transition-colors",
                    isActive
                      ? "border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Create New Button */}
        <Link href={`/${locale}/admin/consultations/new`}>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {t("consultations.admin.actions.createNew")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
