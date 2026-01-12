/**
 * Emails Admin Layout Client
 * Client component for email admin layout with navigation
 */

"use client";

import { cn } from "next-vibe/shared/utils";
import { usePathname } from "next-vibe-ui/hooks/use-pathname";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import {
  BarChart3,
  Database,
  FileText,
  List,
  Settings,
} from "next-vibe-ui/ui/icons";
import { Link } from "next-vibe-ui/ui/link";
import { Span } from "next-vibe-ui/ui/span";
import { H1, P } from "next-vibe-ui/ui/typography";
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
      key: "templates",
      href: `/${locale}/admin/emails/templates`,
      icon: FileText,
      label: t("app.admin.emails.components.nav.templates"),
      description: t("app.admin.emails.templates.overview.description"),
      pattern: new RegExp(`^/${locale}/admin/emails/templates`),
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
    <Div className="flex flex-col gap-6">
      {/* Header */}
      <Div className="flex flex-col gap-4">
        <Div>
          <H1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("app.admin.emails.components.admin.title")}
          </H1>
          <P className="mt-2 text-gray-600 dark:text-gray-400">
            {t("app.admin.emails.components.admin.description")}
          </P>
        </Div>

        {/* Main Navigation */}
        <Card>
          <CardContent className="p-4">
            <Div className="flex flex-wrap gap-2">
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
                      <Span>{item.label}</Span>
                    </Link>
                  </Button>
                );
              })}
            </Div>

            {/* Current Section Description */}
            {currentSection && (
              <Div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <P className="text-sm text-gray-600 dark:text-gray-400">
                  {currentSection.description}
                </P>
              </Div>
            )}
          </CardContent>
        </Card>
      </Div>

      {/* Page Content */}
      <Div className="min-h-[600px]">{children}</Div>
    </Div>
  );
}
