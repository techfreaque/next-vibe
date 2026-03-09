import { redirect } from "next-vibe-ui/lib/redirect";
import type React from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

interface LeadsEmailsPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export default async function LeadsEmailsPage({
  params,
}: LeadsEmailsPageProps): Promise<React.JSX.Element> {
  const { locale } = await params;
  await requireAdminUser(locale, `/${locale}/admin/leads/emails`);
  redirect(`/${locale}/admin/email-campaigns/journeys`);
}
