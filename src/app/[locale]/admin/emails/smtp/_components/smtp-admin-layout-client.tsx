/**
 * SMTP Admin Layout Client
 * Client component for SMTP admin layout with sub-navigation
 */

"use client";

import { Plus, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "next-vibe/shared/utils";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import type { ComponentType, JSX, ReactNode } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface SmtpAdminLayoutClientProps {
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

export function SmtpAdminLayoutClient({
  children,
  locale,
}: SmtpAdminLayoutClientProps): JSX.Element {
  const pathname = usePathname();
  const { t } = simpleT(locale);

  const subNavigationItems: SubNavigationItem[] = [
    {
      key: "accounts",
      href: `/${locale}/admin/emails/smtp/accounts`,
      icon: Users,
      label: t("app.admin.emails.smtp.list.title"),
      description: t("app.admin.emails.smtp.list.description"),
      pattern: new RegExp(`^/${locale}/admin/emails/smtp/accounts`),
    },
    {
      key: "create",
      href: `/${locale}/admin/emails/smtp/create`,
      icon: Plus,
      label: t("app.admin.emails.smtp.admin.create.title"),
      description: t("app.admin.emails.smtp.admin.create.description"),
      pattern: new RegExp(`^/${locale}/admin/emails/smtp/create`),
    },
  ];

  const currentSubSection = subNavigationItems.find((item) =>
    item.pattern.test(pathname),
  );

  return (
    <div className="space-y-6">
      {/* SMTP Sub-Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t("app.admin.emails.smtp.list.title")}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("app.admin.emails.smtp.list.description")}
              </p>
            </div>

            {/* Sub Navigation Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex space-x-8" aria-label={t("app.admin.emails.smtp.list.title")}>
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
