import { redirect } from "next-vibe-ui/lib/redirect";
import type React from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

interface LeadsEmailPreviewPageProps {
  params: Promise<{
    locale: CountryLanguage;
    journeyVariant: string;
    stage: string;
  }>;
}

export default async function LeadsEmailPreviewPage({
  params,
}: LeadsEmailPreviewPageProps): Promise<React.JSX.Element> {
  const { locale, journeyVariant, stage } = await params;
  await requireAdminUser(
    locale,
    `/${locale}/admin/leads/emails/${journeyVariant}/${stage}`,
  );
  redirect(
    `/${locale}/admin/email-campaigns/journeys/${journeyVariant}/${stage}`,
  );
}
