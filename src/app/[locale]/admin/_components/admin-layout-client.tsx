/**
 * Admin Layout Client Component
 * Client-side admin layout with navigation
 */

"use client";

import { cn } from "next-vibe/shared/utils";
import { usePathname } from "next-vibe-ui/hooks/use-pathname";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Activity } from "next-vibe-ui/ui/icons/Activity";
import { Clock } from "next-vibe-ui/ui/icons/Clock";
import { Frame } from "next-vibe-ui/ui/icons/Frame";
import { Home } from "next-vibe-ui/ui/icons/Home";
import { Link2 } from "next-vibe-ui/ui/icons/Link2";
import { Mail } from "next-vibe-ui/ui/icons/Mail";
import { Menu } from "next-vibe-ui/ui/icons/Menu";
import { PanelLeft } from "next-vibe-ui/ui/icons/PanelLeft";
import { Send } from "next-vibe-ui/ui/icons/Send";
import { Shield } from "next-vibe-ui/ui/icons/Shield";
import { Terminal } from "next-vibe-ui/ui/icons/Terminal";
import { Users } from "next-vibe-ui/ui/icons/Users";
import { X } from "next-vibe-ui/ui/icons/X";
import { Zap } from "next-vibe-ui/ui/icons/Zap";
import { Link } from "next-vibe-ui/ui/link";
import { Main } from "next-vibe-ui/ui/main";
import { Span } from "next-vibe-ui/ui/span";
import { H1 } from "next-vibe-ui/ui/typography";
import type React from "react";
import type { ReactNode } from "react";
import { useState } from "react";

import CountrySelector from "@/app/[locale]/_components/country-selector";
import { ThemeToggle } from "@/app/[locale]/_components/theme-toggle";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { UserGetResponseOutput } from "@/app/api/[locale]/users/user/[id]/definition";
import { envClient } from "@/config/env-client";
import { useTranslation } from "@/i18n/core/client";
import type { CountryLanguage } from "@/i18n/core/config";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  current: boolean;
}

interface AdminLayoutClientProps {
  children: ReactNode;
  locale: CountryLanguage;
  user: JwtPayloadType;
  userData: UserGetResponseOutput;
}

export function AdminLayoutClient({
  children,
  locale,
  user,
  userData,
}: AdminLayoutClientProps): React.JSX.Element {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useTranslation();

  const allNavigation = [
    {
      name: t("app.admin.components.navigation.dashboard"),
      href: `/${locale}/admin`,
      icon: Home,
      current: pathname === `/${locale}/admin`,
      hidden: false,
    },
    {
      name: t("app.admin.components.navigation.leadManagement"),
      href: `/${locale}/admin/leads` as const,
      icon: Users,
      current: pathname.startsWith(`/${locale}/admin/leads`),
      hidden: envClient.NEXT_PUBLIC_LOCAL_MODE,
    },
    {
      name: t("app.admin.components.navigation.emailCampaigns"),
      href: `/${locale}/admin/email-campaigns` as const,
      icon: Send,
      current: pathname.startsWith(`/${locale}/admin/email-campaigns`),
      hidden: envClient.NEXT_PUBLIC_LOCAL_MODE,
    },
    {
      name: t("app.admin.components.navigation.users"),
      href: `/${locale}/admin/users` as const,
      icon: Users,
      current: pathname.startsWith(`/${locale}/admin/users`),
      hidden: false,
    },
    {
      name: t("app.admin.components.navigation.emails"),
      href: `/${locale}/admin/emails` as const,
      icon: Mail,
      current: pathname.startsWith(`/${locale}/admin/emails`),
      hidden: false,
    },
    {
      name: t("app.admin.components.navigation.cronTasks"),
      href: `/${locale}/admin/cron` as const,
      icon: Clock,
      current: pathname.startsWith(`/${locale}/admin/cron`),
      hidden: false,
    },
    {
      name: t("app.admin.components.navigation.sshAccess"),
      href: `/${locale}/admin/ssh` as const,
      icon: Terminal,
      current: pathname.startsWith(`/${locale}/admin/ssh`),
      hidden: false,
    },
    {
      name: t("app.admin.components.navigation.remoteConnections"),
      href: `/${locale}/admin/remote` as const,
      icon: Link2,
      current: pathname.startsWith(`/${locale}/admin/remote`),
      hidden: false,
    },
    {
      name: t("app.admin.components.navigation.vibeSense"),
      href: `/${locale}/admin/vibe-sense` as const,
      icon: Activity,
      current: pathname.startsWith(`/${locale}/admin/vibe-sense`),
      hidden: false,
    },
    {
      name: t("app.admin.components.navigation.endpoints"),
      href: `/${locale}/admin/endpoints` as const,
      icon: Zap,
      current: pathname.startsWith(`/${locale}/admin/endpoints`),
      hidden: false,
    },
    {
      name: t("app.admin.components.navigation.vibeFrame"),
      href: `/${locale}/admin/vibe-frame` as const,
      icon: Frame,
      current: pathname.startsWith(`/${locale}/admin/vibe-frame`),
      hidden: false,
    },
  ];

  const navigation = allNavigation.filter(
    (item) => !item.hidden,
  ) satisfies readonly NavigationItem[];

  const sidebarW = collapsed ? "w-14" : "w-64";

  const sidebarContent = (isMobile: boolean): React.JSX.Element => {
    const isCollapsed = !isMobile && collapsed;
    return (
      <>
        <Div
          className={cn(
            "flex h-16 items-center border-b border-border shrink-0",
            isCollapsed ? "justify-center px-0" : "justify-between px-4",
          )}
        >
          {isCollapsed ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={(): void => setCollapsed(false)}
              aria-label="Expand sidebar"
              className="text-foreground/60 hover:text-foreground hover:bg-accent"
            >
              <PanelLeft className="h-5 w-5" />
            </Button>
          ) : (
            <>
              <Div className="flex items-center gap-2">
                <Shield className="h-7 w-7 text-primary shrink-0" />
                <Span className="text-lg font-bold text-foreground">
                  {isMobile
                    ? t("app.admin.components.navigation.admin")
                    : t("app.admin.components.navigation.adminPanel")}
                </Span>
              </Div>
              {isMobile ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(): void => setSidebarOpen(false)}
                  aria-label="Close sidebar"
                  className="text-foreground/60 hover:text-foreground hover:bg-accent"
                >
                  <X className="h-5 w-5" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(): void => setCollapsed(true)}
                  aria-label="Collapse sidebar"
                  className="text-foreground/60 hover:text-foreground hover:bg-accent"
                >
                  <PanelLeft className="h-5 w-5" />
                </Button>
              )}
            </>
          )}
        </Div>

        <Div
          className={cn(
            "flex-1 flex flex-col gap-0.5 py-3 overflow-y-auto overflow-x-hidden",
            isCollapsed ? "px-1 items-center" : "px-2",
          )}
        >
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              title={isCollapsed ? item.name : undefined}
              className={cn(
                "group flex items-center gap-3 py-2 text-sm font-medium rounded-md transition-colors",
                isCollapsed ? "w-10 justify-center px-0" : "px-3",
                item.current
                  ? "bg-accent text-foreground"
                  : "text-foreground/60 hover:bg-accent/60 hover:text-foreground",
              )}
              onClick={isMobile ? (): void => setSidebarOpen(false) : undefined}
            >
              <item.icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  item.current
                    ? "text-primary"
                    : "text-foreground/40 group-hover:text-foreground/70",
                )}
              />
              {!isCollapsed && item.name}
            </Link>
          ))}
        </Div>

        <Div
          className={cn(
            "shrink-0 border-t border-border",
            isCollapsed ? "p-2 flex justify-center" : "p-4",
          )}
        >
          <Div
            className={cn(
              "flex items-center",
              isCollapsed ? "justify-center" : "gap-3",
            )}
          >
            <Div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0">
              <Span className="text-sm font-semibold text-primary-foreground">
                {userData.privateName.charAt(0).toUpperCase()}
              </Span>
            </Div>
            {!isCollapsed && (
              <Div className="flex flex-col min-w-0">
                <Span className="text-sm font-medium text-foreground truncate">
                  {userData.privateName}
                </Span>
                <Span className="text-xs text-foreground/50 truncate">
                  {t("app.admin.components.navigation.administrator")}
                </Span>
              </Div>
            )}
          </Div>
        </Div>
      </>
    );
  };

  return (
    <Div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <Button
          variant="ghost"
          size="unset"
          type="button"
          className="fixed inset-0 z-40 bg-foreground/20 border-0 p-0 cursor-pointer lg:hidden"
          onClick={(): void => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      {/* Mobile sidebar drawer */}
      <Div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-background border-r border-border transition-transform duration-200 ease-in-out lg:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {sidebarContent(true)}
      </Div>

      {/* Desktop sidebar */}
      <Div
        className={cn(
          "hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col transition-all duration-200 ease-in-out",
          sidebarW,
        )}
      >
        <Div className="flex flex-col grow bg-background border-r border-border overflow-hidden">
          {sidebarContent(false)}
        </Div>
      </Div>

      {/* Main content */}
      <Div
        className={cn(
          "transition-all duration-200 ease-in-out",
          collapsed ? "lg:pl-14" : "lg:pl-64",
        )}
      >
        {/* Top bar */}
        <Div className="sticky top-0 z-40 flex h-16 items-center bg-background border-b border-border shadow-sm">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden ml-2 shrink-0"
            onClick={(): void => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <Div className="flex flex-1 items-center justify-between px-4 lg:px-6 gap-4">
            <H1 className="text-base font-semibold text-foreground truncate">
              {navigation.find((item) => item.current)?.name ??
                t("app.admin.components.navigation.adminDashboard")}
            </H1>

            <Div className="flex items-center gap-2 shrink-0">
              <ThemeToggle locale={locale} />
              <CountrySelector isNavBar locale={locale} user={user} />
              <Link
                href={`/${locale}/`}
                className="hidden sm:inline-flex text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-accent"
              >
                {t("app.admin.components.navigation.backToApp")}
              </Link>
            </Div>
          </Div>
        </Div>

        {/* Page content */}
        <Main className="flex-1">{children}</Main>
      </Div>
    </Div>
  );
}
