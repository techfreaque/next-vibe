/**
 * AI Stream Admin Page
 * Admin interface for AI-powered streaming chat functionality
 */

import type React from "react";

import { requireAdminUser } from "@/app/api/[locale]/v1/core/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { AiStreamClient } from "./_components/ai-stream-client";

interface AiStreamAdminPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export default async function AiStreamAdminPage({
  params,
}: AiStreamAdminPageProps): Promise<React.JSX.Element> {
  const { locale } = await params;
  const { t } = simpleT(locale);

  // Require admin authentication
  await requireAdminUser(locale, `/${locale}/admin/streaming/ai-stream`);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t("streamingApi.aiStream.admin.title")}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t("streamingApi.aiStream.admin.description")}
        </p>
      </div>

      {/* Client Component handles all interactions */}
      <AiStreamClient locale={locale} />
    </div>
  );
}
