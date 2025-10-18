/**
 * IMAP Admin Layout Client
 * Client component for IMAP admin layout with sub-navigation
 */

"use client";

import { BarChart3, Mail, RefreshCw, Settings, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "next-vibe/shared/utils";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import type { ComponentType, JSX, ReactNode } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface ImapAdminLayoutClientProps {
  children: ReactNode;
  locale: CountryLanguage;
}

interface SubNavigationItem {
  key: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
  description: string;
  pattern: RegExp;
}

export function ImapAdminLayoutClient({
  children,
  locale,
}: ImapAdminLayoutClientProps): JSX.Element {
  const pathname = usePathname();
  const { t } = simpleT(locale);

  const subNavigationItems: SubNavigationItem[] = [
    {
      key: "overview",
      href: `/${locale}/admin/emails/imap/overview`,
      icon: BarChart3,
      label: t("app.admin.emails.imap.nav.overview"),
      description: t("app.admin.emails.imap.nav.overview_description"),
      pattern: new RegExp(`^/${locale}/admin/emails/imap/overview`),
    },
    {
      key: "accounts",
      href: `/${locale}/admin/emails/imap/accounts`,
      icon: Users,
      label: t("app.admin.emails.imap.nav.accounts"),
      description: t("app.admin.emails.imap.nav.accounts_description"),
      pattern: new RegExp(`^/${locale}/admin/emails/imap/accounts`),
    },
    {
      key: "messages",
      href: `/${locale}/admin/emails/imap/messages`,
      icon: Mail,
      label: t("app.admin.emails.imap.nav.messages"),
      description: t("app.admin.emails.imap.nav.messages_description"),
      pattern: new RegExp(`^/${locale}/admin/emails/imap/messages`),
    },
    {
      key: "config",
      href: `/${locale}/admin/emails/imap/config`,
      icon: Settings,
      label: t("app.admin.emails.imap.nav.config"),
      description: t("app.admin.emails.imap.nav.config_description"),
      pattern: new RegExp(`^/${locale}/admin/emails/imap/config`),
    },
    {
      key: "sync",
      href: `/${locale}/admin/emails/imap/sync`,
      icon: RefreshCw,
      label: t("app.admin.emails.imap.nav.sync"),
      description: t("app.admin.emails.imap.nav.sync_description"),
      pattern: new RegExp(`^/${locale}/admin/emails/imap/sync`),
    },
  ];

  const currentSubSection = subNavigationItems.find((item) =>
    item.pattern.test(pathname),
  );

  return (
    <div className="space-y-6">
      {/* IMAP Sub-Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t("app.admin.emails.imap.title")}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("app.admin.emails.imap.nav.overview_description")}
              </p>
            </div>

            {/* Sub Navigation Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex space-x-8" aria-label={t("app.admin.emails.imap.title")}>
                {subNavigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentSubSection?.key === item.key;

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

            {/* Current Sub-Section Description */}
            {currentSubSection && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {currentSubSection.description}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Page Content */}
      <div className="min-h-[400px]">{children}</div>
    </div>
  );
}
