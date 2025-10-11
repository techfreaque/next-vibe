/**
 * Emails Navigation Component
 * Navigation tabs for emails admin sections
 */

"use client";

import { BarChart3, Database, List, Settings } from "lucide-react";
import Link from "next/link";
import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface EmailsNavigationProps {
  locale: CountryLanguage;
  currentPage: "stats" | "list" | "imap" | "smtp";
}

export function EmailsNavigation({
  locale,
  currentPage,
}: EmailsNavigationProps): JSX.Element {
  const { t } = simpleT(locale);

  const navigationItems = [
    {
      key: "stats",
      href: `/${locale}/admin/emails/stats` as const,
      icon: BarChart3,
      label: t("emails.nav.overview"),
      description: t("emails.admin.stats.title"),
    },
    {
      key: "list",
      href: `/${locale}/admin/emails/list` as const,
      icon: List,
      label: t("emails.nav.campaigns"),
      description: t("emails.admin.title"),
    },
    {
      key: "imap",
      href: `/${locale}/admin/emails/imap` as const,
      icon: Database,
      label: t("emails.nav.imap"),
      description: t("imap.imapServer"),
    },
    {
      key: "smtp",
      href: `/${locale}/admin/emails/smtp` as const,
      icon: Settings,
      label: t("admin.dashboard.smtp.nav.accounts"),
      description: t("admin.dashboard.smtp.nav.accounts_description"),
    },
  ] as const;

  return (
    <div className="flex space-x-1 rounded-lg bg-muted p-1">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPage === item.key;

        return (
          <Button
            key={item.key}
            asChild
            variant={isActive ? "default" : "ghost"}
            size="sm"
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Link href={item.href}>
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          </Button>
        );
      })}
    </div>
  );
}
