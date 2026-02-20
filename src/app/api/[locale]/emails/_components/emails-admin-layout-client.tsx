/**
 * Emails Admin Layout Client
 * Unified Gmail-style layout: persistent left sidebar covering IMAP + SMTP + all email management
 */

"use client";

import { cn } from "next-vibe/shared/utils";
import { usePathname } from "next-vibe-ui/hooks/use-pathname";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import {
  Archive,
  BarChart3,
  Edit,
  FileText,
  Inbox,
  Mail,
  MessageCircle,
  RefreshCw,
  Send,
  Server,
  Settings,
  Star,
  Trash2,
  Users,
} from "next-vibe-ui/ui/icons";
import { Link } from "next-vibe-ui/ui/link";
import { Span } from "next-vibe-ui/ui/span";
import type { ComponentType, JSX, ReactNode } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface EmailsAdminLayoutClientProps {
  children: ReactNode;
  locale: CountryLanguage;
}

interface SidebarItem {
  key: string;
  href: string;
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
  const { t } = simpleT(locale);

  const sections: SidebarSection[] = [
    {
      // IMAP inbox navigation
      items: [
        {
          key: "inbox",
          href: `/${locale}/admin/emails/imap/messages`,
          icon: Inbox,
          label: t("app.admin.emails.imap.nav.messages"),
          pattern: new RegExp(`^/${locale}/admin/emails/imap/messages`),
        },
        {
          key: "starred",
          href: `/${locale}/admin/emails/imap/messages?status=flagged`,
          icon: Star,
          label: t("app.admin.emails.imap.nav.starred"),
          pattern: new RegExp(
            `^/${locale}/admin/emails/imap/messages.*status=flagged`,
          ),
        },
        {
          key: "sent",
          href: `/${locale}/admin/emails/imap/messages?specialUse=sent`,
          icon: Send,
          label: t("app.admin.emails.imap.nav.sent"),
          pattern: new RegExp(
            `^/${locale}/admin/emails/imap/messages.*specialUse=sent`,
          ),
        },
        {
          key: "drafts",
          href: `/${locale}/admin/emails/imap/messages?specialUse=drafts`,
          icon: FileText,
          label: t("app.admin.emails.imap.nav.drafts"),
          pattern: new RegExp(
            `^/${locale}/admin/emails/imap/messages.*specialUse=drafts`,
          ),
        },
        {
          key: "spam",
          href: `/${locale}/admin/emails/imap/messages?specialUse=junk`,
          icon: Archive,
          label: t("app.admin.emails.imap.nav.spam"),
          pattern: new RegExp(
            `^/${locale}/admin/emails/imap/messages.*specialUse=junk`,
          ),
        },
        {
          key: "trash",
          href: `/${locale}/admin/emails/imap/messages?specialUse=trash`,
          icon: Trash2,
          label: t("app.admin.emails.imap.nav.trash"),
          pattern: new RegExp(
            `^/${locale}/admin/emails/imap/messages.*specialUse=trash`,
          ),
        },
      ],
    },
    {
      items: [
        {
          key: "outbox",
          href: `/${locale}/admin/emails/list`,
          icon: Send,
          label: t("app.admin.emails.components.nav.campaigns"),
          pattern: new RegExp(`^/${locale}/admin/emails/list`),
        },
        {
          key: "smtp-accounts",
          href: `/${locale}/admin/emails/smtp/accounts`,
          icon: Server,
          label: t("app.admin.emails.smtp.list.title"),
          pattern: new RegExp(`^/${locale}/admin/emails/smtp`),
        },
      ],
    },
    {
      items: [
        {
          key: "stats",
          href: `/${locale}/admin/emails/stats`,
          icon: BarChart3,
          label: t("app.admin.emails.components.nav.overview"),
          pattern: new RegExp(`^/${locale}/admin/emails/stats`),
        },
        {
          key: "templates",
          href: `/${locale}/admin/emails/templates`,
          icon: FileText,
          label: t("app.admin.emails.components.nav.templates"),
          pattern: new RegExp(`^/${locale}/admin/emails/templates`),
        },
      ],
    },
    {
      // Messaging channels (SMS, WhatsApp, Telegram)
      items: [
        {
          key: "messaging-accounts",
          href: `/${locale}/admin/emails/messaging/accounts`,
          icon: MessageCircle,
          label: t("app.admin.emails.components.nav.messagingAccounts"),
          pattern: new RegExp(`^/${locale}/admin/emails/messaging`),
        },
      ],
    },
    {
      items: [
        {
          key: "imap-accounts",
          href: `/${locale}/admin/emails/imap/accounts`,
          icon: Users,
          label: t("app.admin.emails.imap.nav.accounts"),
          pattern: new RegExp(`^/${locale}/admin/emails/imap/accounts`),
        },
        {
          key: "imap-config",
          href: `/${locale}/admin/emails/imap/config`,
          icon: Settings,
          label: t("app.admin.emails.imap.nav.config"),
          pattern: new RegExp(`^/${locale}/admin/emails/imap/config`),
        },
        {
          key: "imap-sync",
          href: `/${locale}/admin/emails/imap/sync`,
          icon: RefreshCw,
          label: t("app.admin.emails.imap.nav.sync"),
          pattern: new RegExp(`^/${locale}/admin/emails/imap/sync`),
        },
        {
          key: "imap-overview",
          href: `/${locale}/admin/emails/imap/overview`,
          icon: BarChart3,
          label: t("app.admin.emails.imap.nav.overview"),
          pattern: new RegExp(`^/${locale}/admin/emails/imap/overview`),
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
          <Span className="font-semibold text-sm">
            {t("app.admin.emails.components.admin.title")}
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
