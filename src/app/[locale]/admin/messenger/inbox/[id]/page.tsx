import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

import { MessengerMessageDetailPageClient } from "./page-client";

export default async function MessengerMessageDetailPage({
  params,
}: {
  params: Promise<{ locale: CountryLanguage; id: string }>;
}): Promise<JSX.Element> {
  const { locale, id } = await params;
  const user = await requireAdminUser(
    locale,
    `/${locale}/admin/messenger/inbox`,
  );
  return (
    <MessengerMessageDetailPageClient locale={locale} user={user} id={id} />
  );
}
