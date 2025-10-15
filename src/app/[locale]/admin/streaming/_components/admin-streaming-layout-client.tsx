/**
 * Admin Streaming Layout Client Component
 * Client-side layout that determines current page from pathname
 */

"use client";

import type React from "react";
import type { ReactNode } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { StreamingNavigation } from "./streaming-navigation";

interface AdminStreamingLayoutClientProps {
  children: ReactNode;
  locale: CountryLanguage;
}

type CurrentPageType = "ai-stream";

export function AdminStreamingLayoutClient({
  children,
  locale,
}: AdminStreamingLayoutClientProps): React.JSX.Element {
  const { t } = simpleT(locale);

  const currentPage: CurrentPageType = "ai-stream";

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
