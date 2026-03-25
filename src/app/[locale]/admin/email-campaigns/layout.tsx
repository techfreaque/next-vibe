import { redirect } from "next-vibe-ui/lib/redirect";

import type { CountryLanguage } from "@/i18n/core/config";

interface EmailCampaignsLayoutProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export default async function EmailCampaignsLayout({
  params,
}: EmailCampaignsLayoutProps): Promise<never> {
  const { locale } = await params;
  redirect(`/${locale}/admin/messenger/campaigns`);
}
