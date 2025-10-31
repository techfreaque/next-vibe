/**
 * Admin Layout Client Component
 * Client-side admin layout with navigation
 */

"use client";

import {
  Calendar,
  Clock,
  Home,
  Mail,
  Menu,
  Shield,
  Users,
  X,
} from "lucide-react";
import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Span } from "next-vibe-ui/ui/span";
import { Div } from "next-vibe-ui/ui/div";
import { H1 } from "next-vibe-ui/ui/typography";
import { Link } from "next-vibe-ui/ui/link";
import { usePathname } from "next-vibe-ui/hooks/use-pathname";
import type React from "react";
import type { ReactNode } from "react";
import { useState } from "react";

import CountrySelector from "@/app/[locale]/_components/country-selector";
import { ThemeToggle } from "@/app/[locale]/_components/nav/theme-toggle";
import type { CompleteUserType } from "@/app/api/[locale]/v1/core/user/types";
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
  user: CompleteUserType;
}

export function AdminLayoutClient({
  children,
  locale,
  user,
}: AdminLayoutClientProps): React.JSX.Element {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useTranslation();

  const navigation = [
    {
      name: t("app.admin.components.navigation.dashboard"),
      href: `/${locale}/admin`,
      icon: Home,
      current: pathname === `/${locale}/admin`,
    },
    {
      name: t("app.admin.components.navigation.leadManagement"),
      href: `/${locale}/admin/leads` as const,
      icon: Users,
      current: pathname.startsWith(`/${locale}/admin/leads`),
    },
    {
      name: t("app.admin.components.navigation.users"),
      href: `/${locale}/admin/users` as const,
      icon: Users,
      current: pathname.startsWith(`/${locale}/admin/users`),
    },
    {
      name: t("app.admin.components.navigation.consultations"),
      href: `/${locale}/admin/consultations` as const,
      icon: Calendar,
      current: pathname.startsWith(`/${locale}/admin/consultations`),
    },
    {
      name: t("app.admin.components.navigation.emails"),
      href: `/${locale}/admin/emails` as const,
      icon: Mail,
      current: pathname.startsWith(`/${locale}/admin/emails`),
    },
    {
      name: t("app.admin.components.navigation.cronTasks"),
      href: `/${locale}/admin/cron` as const,
      icon: Clock,
      current: pathname.startsWith(`/${locale}/admin/cron`),
    },
  ] as const satisfies readonly NavigationItem[];

  return (
    <Div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar */}
      <Div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          sidebarOpen ? "block" : "hidden",
        )}
      >
        <button
          type="button"
          className="fixed inset-0 bg-gray-600 bg-opacity-75 border-0 p-0 cursor-pointer"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
        <Div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white dark:bg-gray-800 shadow-xl">
          <Div className="flex h-16 items-center justify-between px-4">
            <Div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600" />
              <Span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                {t("app.admin.components.navigation.admin")}
              </Span>
            </Div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </Div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                  item.current
                    ? "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white",
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5",
                    item.current
                      ? "text-blue-500"
                      : "text-gray-400 group-hover:text-gray-500",
                  )}
                />
                {item.name}
              </Link>
            ))}
          </nav>
        </Div>
      </Div>

      {/* Desktop sidebar */}
      <Div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <Div className="flex flex-col flex-grow bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <Div className="flex h-16 items-center px-4">
            <Shield className="h-8 w-8 text-blue-600" />
            <Span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
              {t("app.admin.components.navigation.adminPanel")}
            </Span>
          </Div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                  item.current
                    ? "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white",
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5",
                    item.current
                      ? "text-blue-500"
                      : "text-gray-400 group-hover:text-gray-500",
                  )}
                />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User info */}
          <Div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 p-4">
            <Div className="flex items-center">
              <Div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                <Span className="text-sm font-medium text-white">
                  {user.privateName.charAt(0)}
                </Span>
              </Div>
              <Div className="ml-3">
                <Span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {user.privateName}
                </Span>
                <Span className="text-xs text-gray-500 dark:text-gray-400">
                  {t("app.admin.components.navigation.administrator")}
                </Span>
              </Div>
            </Div>
          </Div>
        </Div>
      </Div>

      {/* Main content */}
      <Div className="lg:pl-64">
        {/* Top bar */}
        <Div className="sticky top-0 z-40 flex h-16 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden ml-4"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>

          <Div className="flex flex-1 justify-between px-4 lg:px-6">
            <Div className="flex items-center">
              <H1 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t("app.admin.components.navigation.adminDashboard")}
              </H1>
            </Div>

            <Div className="flex items-center space-x-4">
              {/* Theme toggle */}
              <ThemeToggle locale={locale} />

              {/* Locale selector */}
              <CountrySelector isNavBar locale={locale} />

              <Link
                href={`/${locale}/`}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {t("app.admin.components.navigation.backToApp")}
              </Link>
            </Div>
          </Div>
        </Div>

        {/* Page content */}
        <main className="flex-1">{children}</main>
      </Div>
    </Div>
  );
}
