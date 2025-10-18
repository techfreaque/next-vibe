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
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import type React from "react";
import type { ReactNode } from "react";
import { useState } from "react";

import CountrySelector from "@/app/[locale]/_components/country-selector";
import { ThemeToggle } from "@/app/[locale]/_components/nav/theme-toggle";
import type { CompleteUserType } from "@/app/api/[locale]/v1/core/user/definition";
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
      name: t("admin.dashboard.navigation.dashboard"),
      href: `/${locale}/admin`,
      icon: Home,
      current: pathname === `/${locale}/admin`,
    },
    {
      name: t("admin.dashboard.navigation.leadManagement"),
      href: `/${locale}/admin/leads` as const,
      icon: Users,
      current: pathname.startsWith(`/${locale}/admin/leads`),
    },
    {
      name: t("admin.dashboard.navigation.users"),
      href: `/${locale}/admin/users` as const,
      icon: Users,
      current: pathname.startsWith(`/${locale}/admin/users`),
    },
    {
      name: t("admin.dashboard.navigation.consultations"),
      href: `/${locale}/admin/consultations` as const,
      icon: Calendar,
      current: pathname.startsWith(`/${locale}/admin/consultations`),
    },
    {
      name: t("admin.dashboard.navigation.emails"),
      href: `/${locale}/admin/emails` as const,
      icon: Mail,
      current: pathname.startsWith(`/${locale}/admin/emails`),
    },
    {
      name: t("admin.dashboard.navigation.cronTasks"),
      href: `/${locale}/admin/cron` as const,
      icon: Clock,
      current: pathname.startsWith(`/${locale}/admin/cron`),
    },
  ] as const satisfies readonly NavigationItem[];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          sidebarOpen ? "block" : "hidden",
        )}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white dark:bg-gray-800 shadow-xl">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                {t("admin.dashboard.navigation.admin")}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
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
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="flex h-16 items-center px-4">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
              {t("admin.dashboard.navigation.adminPanel")}
            </span>
          </div>
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
          <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user.privateName.charAt(0)}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {user.privateName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t("admin.dashboard.navigation.administrator")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden ml-4"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>

          <div className="flex flex-1 justify-between px-4 lg:px-6">
            <div className="flex items-center">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t("admin.dashboard.navigation.adminDashboard")}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Theme toggle */}
              <ThemeToggle locale={locale} />

              {/* Locale selector */}
              <CountrySelector isNavBar locale={locale} />

              <Link
                href={`/${locale}/`}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {t("admin.dashboard.navigation.backToApp")}
              </Link>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
