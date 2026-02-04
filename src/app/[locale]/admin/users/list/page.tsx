/**
 * Users List Page
 * Uses form-based filtering pattern similar to leads list
 */

import { Div } from "next-vibe-ui/ui/div";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import { UsersListClient } from "@/app/api/[locale]/users/list/_components/users-list-client";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

export default async function UsersListPage({
  params,
}: {
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<JSX.Element> {
  const { locale } = await params;
  const { t } = simpleT(locale);

  const user = await requireAdminUser(locale, `/${locale}/admin/users/list`);

  return (
    <Div className="flex flex-col gap-6">
      {/* Page Description */}
      <Div>
        <P className="text-gray-600 dark:text-gray-400">
          {t("app.admin.users.list.description")}
        </P>
      </Div>

      {/* Client Component handles all interactions */}
      <UsersListClient locale={locale} user={user} />
    </Div>
  );
}
