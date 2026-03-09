/**
 * Admin Users Layout Client Component
 * Client-side layout that determines current page from pathname
 */

"use client";

import { usePathname } from "next-vibe-ui/hooks/use-pathname";
import { Div } from "next-vibe-ui/ui/div";
import type React from "react";
import type { ReactNode } from "react";

import type { CountryLanguage } from "@/i18n/core/config";

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
    <Div className="flex flex-col gap-6">
      {/* Header with Navigation */}
      <Div className="flex flex-col gap-4">
        <UsersNavigation locale={locale} currentPage={currentPage} />
      </Div>

      {/* Page Content */}
      {children}
    </Div>
  );
}
