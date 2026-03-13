import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

import { MessengerAccountEditPageClient } from "./page-client";

export default async function MessengerAccountEditPage({
  params,
}: {
  params: Promise<{ locale: CountryLanguage; id: string }>;
}): Promise<JSX.Element> {
  const { locale, id } = await params;
  const user = await requireAdminUser(
    locale,
    `/${locale}/admin/messenger/accounts`,
  );
  return <MessengerAccountEditPageClient locale={locale} user={user} id={id} />;
}
