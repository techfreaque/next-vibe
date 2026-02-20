import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

import { MessagingAccountEditPageClient } from "./page-client";

export default async function MessagingAccountEditPage({
  params,
}: {
  params: Promise<{ locale: CountryLanguage; id: string }>;
}): Promise<JSX.Element> {
  const { locale, id } = await params;
  const user = await requireAdminUser(
    locale,
    `/${locale}/admin/emails/messaging/accounts/${id}/edit`,
  );
  return (
    <MessagingAccountEditPageClient
      locale={locale}
      user={user}
      accountId={id}
    />
  );
}
