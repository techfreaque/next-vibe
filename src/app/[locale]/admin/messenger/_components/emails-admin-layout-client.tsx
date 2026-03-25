/**
 * Messenger Admin Layout Client
 * Unified layout: persistent left sidebar for all messenger features
 */

"use client";

import type { Route } from "next";
import { usePathname } from "next-vibe-ui/hooks/use-pathname";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { BarChart3 } from "next-vibe-ui/ui/icons/BarChart3";
import { Edit } from "next-vibe-ui/ui/icons/Edit";
import { FileText } from "next-vibe-ui/ui/icons/FileText";
import { Inbox } from "next-vibe-ui/ui/icons/Inbox";
import { Mail } from "next-vibe-ui/ui/icons/Mail";
import { Send } from "next-vibe-ui/ui/icons/Send";
import { Server } from "next-vibe-ui/ui/icons/Server";
import { Link } from "next-vibe-ui/ui/link";
import { Span } from "next-vibe-ui/ui/span";
import { cn } from "next-vibe/shared/utils";
import type { ComponentType, JSX, ReactNode } from "react";

import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation } from "./i18n";

interface EmailsAdminLayoutClientProps {
  children: ReactNode;
  locale: CountryLanguage;
}

interface SidebarItem {
  key: string;
  href: Route;
  icon: ComponentType<{ className?: string }>;
  label: string;
  pattern: RegExp;
}

interface SidebarSection {
  items: SidebarItem[];
}

export function EmailsAdminLayoutClient({
  children,
  locale,
}: EmailsAdminLayoutClientProps): JSX.Element {
  const pathname = usePathname();
  const { t } = scopedTranslation.scopedT(locale);

  const sections: SidebarSection[] = [
    {
      items: [
        {
          key: "inbox",
          href: `/${locale}/admin/messenger/inbox`,
          icon: Inbox,
          label: t("nav.inbox"),
          pattern: new RegExp(`^/${locale}/admin/messenger/inbox`),
        },
        {
          key: "campaigns",
          href: `/${locale}/admin/messenger/campaigns`,
          icon: Send,
          label: t("nav.campaigns"),
          pattern: new RegExp(`^/${locale}/admin/messenger/campaigns`),
        },
        {
          key: "accounts",
          href: `/${locale}/admin/messenger/accounts`,
          icon: Server,
          label: t("nav.accounts"),
          pattern: new RegExp(`^/${locale}/admin/messenger/accounts`),
        },
        {
          key: "templates",
          href: `/${locale}/admin/messenger/templates`,
          icon: FileText,
          label: t("nav.templates"),
          pattern: new RegExp(`^/${locale}/admin/messenger/templates`),
        },
        {
          key: "stats",
          href: `/${locale}/admin/messenger/stats`,
          icon: BarChart3,
          label: t("nav.overview"),
          pattern: new RegExp(`^/${locale}/admin/messenger/stats`),
        },
      ],
    },
  ];

  return (
    <Div className="flex h-full min-h-[600px]">
      {/* ── Left Sidebar ── */}
      <Div className="w-56 flex-shrink-0 border-r bg-muted/20 flex flex-col">
        {/* Logo / header */}
        <Div className="flex items-center gap-2 px-4 py-4 border-b">
          <Mail className="h-5 w-5 text-primary" />
          <Span className="font-semibold text-sm">{t("admin.title")}</Span>
        </Div>

        {/* Compose button */}
        <Div className="px-3 py-3">
          <Link href={`/${locale}/admin/messenger/inbox/compose`}>
            <Button
              type="button"
              className="w-full gap-2 rounded-full shadow-sm"
              size="sm"
            >
              <Edit className="h-4 w-4" />
              <Span>{t("nav.compose")}</Span>
            </Button>
          </Link>
        </Div>

        {/* Nav sections */}
        <Div className="flex flex-col flex-1 overflow-y-auto py-1">
          {sections.map((section, si) => (
            <Div key={si}>
              {/* Thin divider between sections */}
              {si > 0 && (
                <Div className="mx-3 my-2 border-t border-border/60" />
              )}

              {section.items.map((item) => {
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
          ))}
        </Div>
      </Div>

      {/* ── Main Content ── */}
      <Div className="flex-1 min-w-0 overflow-auto">{children}</Div>
    </Div>
  );
}
