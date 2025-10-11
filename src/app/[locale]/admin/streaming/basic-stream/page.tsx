/**
 * Basic Stream Admin Page
 * Admin interface for basic streaming functionality
 */

import type React from "react";

import { requireAdminUser } from "@/app/api/[locale]/v1/core/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { BasicStreamClient } from "./_components/basic-stream-client";

interface BasicStreamAdminPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export default async function BasicStreamAdminPage({
  params,
}: BasicStreamAdminPageProps): Promise<React.JSX.Element> {
  const { locale } = await params;
  const { t } = simpleT(locale);

  // Require admin authentication
  await requireAdminUser(locale, `/${locale}/admin/streaming/basic-stream`);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t("streamingApi.basicStream.admin.title")}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t("streamingApi.basicStream.admin.description")}
        </p>
      </div>

      {/* Client Component handles all interactions */}
      <BasicStreamClient locale={locale} />
    </div>
  );
}
