import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

import { MessengerComposePageClient } from "./page-client";

export default async function MessengerComposePage({
  params,
}: {
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<JSX.Element> {
  const { locale } = await params;
  const user = await requireAdminUser(
    locale,
    `/${locale}/admin/messenger/inbox`,
  );
  return <MessengerComposePageClient locale={locale} user={user} />;
}
