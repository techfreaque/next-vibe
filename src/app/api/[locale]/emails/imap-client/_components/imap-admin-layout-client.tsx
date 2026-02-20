/**
 * IMAP Admin Layout Client
 * Gmail-style 2-panel layout: fixed left sidebar + right main area
 */

"use client";

import { cn } from "next-vibe/shared/utils";
import { usePathname } from "next-vibe-ui/hooks/use-pathname";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import {
  BarChart3,
  Edit,
  Mail,
  RefreshCw,
  Settings,
  Users,
} from "next-vibe-ui/ui/icons";
import { Link } from "next-vibe-ui/ui/link";
import { Span } from "next-vibe-ui/ui/span";
import type { ComponentType, JSX, ReactNode } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface ImapAdminLayoutClientProps {
  children: ReactNode;
  locale: CountryLanguage;
}

interface SidebarNavItem {
  key: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
  pattern: RegExp;
}

export function ImapAdminLayoutClient({
  children,
  locale,
}: ImapAdminLayoutClientProps): JSX.Element {
  const pathname = usePathname();
  const { t } = simpleT(locale);

  const navItems: SidebarNavItem[] = [
    {
      key: "messages",
      href: `/${locale}/admin/emails/imap/messages`,
      icon: Mail,
      label: t("app.admin.emails.imap.nav.messages"),
      pattern: new RegExp(`^/${locale}/admin/emails/imap/messages`),
    },
    {
      key: "overview",
      href: `/${locale}/admin/emails/imap/overview`,
      icon: BarChart3,
      label: t("app.admin.emails.imap.nav.overview"),
      pattern: new RegExp(`^/${locale}/admin/emails/imap/overview`),
    },
    {
      key: "accounts",
      href: `/${locale}/admin/emails/imap/accounts`,
      icon: Users,
      label: t("app.admin.emails.imap.nav.accounts"),
      pattern: new RegExp(`^/${locale}/admin/emails/imap/accounts`),
    },
    {
      key: "config",
      href: `/${locale}/admin/emails/imap/config`,
      icon: Settings,
      label: t("app.admin.emails.imap.nav.config"),
      pattern: new RegExp(`^/${locale}/admin/emails/imap/config`),
    },
    {
      key: "sync",
      href: `/${locale}/admin/emails/imap/sync`,
      icon: RefreshCw,
      label: t("app.admin.emails.imap.nav.sync"),
      pattern: new RegExp(`^/${locale}/admin/emails/imap/sync`),
    },
  ];

  return (
    <Div className="flex h-full min-h-[600px]">
      {/* Left Sidebar */}
      <Div className="w-56 flex-shrink-0 border-r bg-muted/20 flex flex-col">
        {/* App header */}
        <Div className="flex items-center gap-2 px-4 py-4 border-b">
          <Mail className="h-5 w-5 text-primary" />
          <Span className="font-semibold text-sm">
            {t("app.admin.emails.imap.title")}
          </Span>
        </Div>

        {/* Compose button */}
        <Div className="px-3 py-3">
          <Link href={`/${locale}/admin/emails/imap/compose`}>
            <Button
              type="button"
              className="w-full gap-2 rounded-full shadow-sm"
              size="sm"
            >
              <Edit className="h-4 w-4" />
              <Span>{t("app.admin.emails.imap.nav.compose")}</Span>
            </Button>
          </Link>
        </Div>

        {/* Navigation items */}
        <Div className="flex flex-col py-2 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.pattern.test(pathname);

            return (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 mx-2 px-3 py-2 rounded-full text-sm transition-colors",
                  isActive
                    ? "bg-primary/15 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <Span className="truncate">{item.label}</Span>
              </Link>
            );
          })}
        </Div>
      </Div>

      {/* Main Content Area */}
      <Div className="flex-1 min-w-0 overflow-auto">{children}</Div>
    </Div>
  );
}
