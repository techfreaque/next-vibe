/**
 * Streaming Navigation Component
 * Navigation tabs for streaming admin pages
 */

"use client";

import { Bot, Zap } from "lucide-react";
import Link from "next/link";
import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface StreamingNavigationProps {
  locale: CountryLanguage;
  currentPage: "ai-stream" | "basic-stream";
}

export function StreamingNavigation({
  locale,
  currentPage,
}: StreamingNavigationProps): JSX.Element {
  const { t } = simpleT(locale);

  const navigationItems = [
    {
      key: "ai-stream",
      href: `/${locale}/admin/streaming/ai-stream` as const,
      icon: Bot,
      label: t("streamingApi.nav.aiStream"),
      description: t("streamingApi.nav.aiStreamDescription"),
    },
    {
      key: "basic-stream",
      href: `/${locale}/admin/streaming/basic-stream` as const,
      icon: Zap,
      label: t("streamingApi.nav.basicStream"),
      description: t("streamingApi.nav.basicStreamDescription"),
    },
  ] as const;

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="-mb-px flex space-x-8">
        {navigationItems.map((item) => {
          const isActive = currentPage === item.key;
          const Icon = item.icon;

          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "group inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium transition-colors",
                isActive
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300",
              )}
            >
              <Icon
                className={cn(
                  "mr-2 h-5 w-5",
                  isActive
                    ? "text-blue-500 dark:text-blue-400"
                    : "text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300",
                )}
              />
              <div className="flex flex-col">
                <span>{item.label}</span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {item.description}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
