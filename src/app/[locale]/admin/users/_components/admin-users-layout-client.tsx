/**
 * Admin Users Layout Client Component
 * Client-side layout that determines current page from pathname
 */

"use client";

import { usePathname } from "next/navigation";
import type React from "react";
import type { ReactNode } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { UsersNavigation } from "./users-navigation";

interface AdminUsersLayoutClientProps {
  children: ReactNode;
  locale: CountryLanguage;
}

export enum CurrentPageType {
  overview = "overview",
  list = "list",
  add = "add",
}

export function AdminUsersLayoutClient({
  children,
  locale,
}: AdminUsersLayoutClientProps): React.JSX.Element {
  const pathname = usePathname();
  const { t } = simpleT(locale);

  // Determine current page from pathname
  const getCurrentPage = (): CurrentPageType => {
    if (pathname.includes("/admin/users/list")) {
      return CurrentPageType.list;
    }
    if (pathname.includes("/admin/users/create")) {
      return CurrentPageType.add;
    }
    return CurrentPageType.overview;
  };

  const currentPage = getCurrentPage();

  return (
    <div className="space-y-6">
      {/* Header with Navigation */}
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("users.admin.title")}
          </h1>
        </div>

        <UsersNavigation locale={locale} currentPage={currentPage} />
      </div>

      {/* Page Content */}
      {children}
    </div>
  );
}
