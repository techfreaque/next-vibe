/**
 * Admin Streaming Layout Client Component
 * Client-side layout that determines current page from pathname
 */

"use client";

import { usePathname } from "next/navigation";
import type React from "react";
import type { ReactNode } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { StreamingNavigation } from "./streaming-navigation";

interface AdminStreamingLayoutClientProps {
  children: ReactNode;
  locale: CountryLanguage;
}

type CurrentPageType = "ai-stream" | "basic-stream";

export function AdminStreamingLayoutClient({
  children,
  locale,
}: AdminStreamingLayoutClientProps): React.JSX.Element {
  const pathname = usePathname();
  const { t } = simpleT(locale);

  // Determine current page from pathname
  const getCurrentPage = (): CurrentPageType => {
    if (pathname.includes("/admin/streaming/basic-stream")) {
      return "basic-stream";
    }
    return "ai-stream"; // Default to ai-stream
  };

  const currentPage = getCurrentPage();

  return (
    <div className="space-y-6">
      {/* Header with Navigation */}
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("streamingApi.admin.title")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t("streamingApi.admin.description")}
          </p>
        </div>

        <StreamingNavigation locale={locale} currentPage={currentPage} />
      </div>

      {/* Page Content */}
      {children}
    </div>
  );
}
