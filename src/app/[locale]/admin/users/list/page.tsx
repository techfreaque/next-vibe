/**
 * Users List Page
 * Uses form-based filtering pattern similar to leads list
 */

import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { UsersListClient } from "./_components/users-list-client";

export default async function UsersListPage({
  params,
}: {
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<JSX.Element> {
  const { locale } = await params;
  const { t } = simpleT(locale);

  return (
    <div className="space-y-6">
      {/* Page Description */}
      <div>
        <p className="text-gray-600 dark:text-gray-400">
          {t("app.admin.users.list.description")}
        </p>
      </div>

      {/* Client Component handles all interactions */}
      <UsersListClient locale={locale} />
    </div>
  );
}
