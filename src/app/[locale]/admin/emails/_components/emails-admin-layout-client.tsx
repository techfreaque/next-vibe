/**
 * Emails Admin Layout Client
 * Client component for email admin layout with navigation
 */

"use client";

import { BarChart3, Database, List, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import type { ComponentType, JSX, ReactNode } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface EmailsAdminLayoutClientProps {
  children: ReactNode;
  locale: CountryLanguage;
}

interface NavigationItem {
  key: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
  description: string;
  pattern: RegExp;
}

export function EmailsAdminLayoutClient({
  children,
  locale,
}: EmailsAdminLayoutClientProps): JSX.Element {
  const pathname = usePathname();
  const { t } = simpleT(locale);

  const navigationItems: NavigationItem[] = [
    {
      key: "stats",
      href: `/${locale}/admin/emails/stats`,
      icon: BarChart3,
      label: t("app.admin.emails.components.nav.overview"),
      description: t("app.admin.emails.components.admin.stats.title"),
      pattern: new RegExp(`^/${locale}/admin/emails/stats`),
    },
    {
      key: "list",
      href: `/${locale}/admin/emails/list`,
      icon: List,
      label: t("app.admin.emails.components.nav.campaigns"),
      description: t("app.admin.emails.components.admin.title"),
      pattern: new RegExp(`^/${locale}/admin/emails/list`),
    },
    {
      key: "imap",
      href: `/${locale}/admin/emails/imap`,
      icon: Database,
      label: t("app.admin.emails.components.nav.imap"),
      description: t("app.admin.emails.imap.admin.overview.title"),
      pattern: new RegExp(`^/${locale}/admin/emails/imap`),
    },
    {
      key: "smtp",
      href: `/${locale}/admin/emails/smtp`,
      icon: Settings,
      label: t("app.admin.emails.smtp.list.title"),
      description: t("app.admin.emails.smtp.list.description"),
      pattern: new RegExp(`^/${locale}/admin/emails/smtp`),
    },
  ];

  const currentSection = navigationItems.find((item) =>
    item.pattern.test(pathname),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("app.admin.emails.components.admin.title")}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {t("app.admin.emails.components.admin.description")}
          </p>
        </div>

        {/* Main Navigation */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentSection?.key === item.key;

                return (
                  <Button
                    key={item.key}
                    asChild
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                        : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-600",
                    )}
                  >
                    <Link href={item.href} className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </Button>
                );
              })}
            </div>

            {/* Current Section Description */}
            {currentSection && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {currentSection.description}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Page Content */}
      <div className="min-h-[600px]">{children}</div>
    </div>
  );
}
