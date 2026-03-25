import { redirect } from "next-vibe-ui/lib/redirect";
import type React from "react";

import type { CountryLanguage } from "@/i18n/core/config";

interface EmailCampaignsPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface EmailCampaignsPageData {
  locale: CountryLanguage;
}

export async function tanstackLoader({
  params,
}: EmailCampaignsPageProps): Promise<never> {
  const { locale } = await params;
  redirect(`/${locale}/admin/messenger/campaigns`);
}

// oxlint-disable-next-line no-unused-vars
export function TanstackPage(props: EmailCampaignsPageData): never {
  redirect(`/${props.locale}/admin/messenger/campaigns`);
}

export default async function EmailCampaignsPage({
  params,
}: EmailCampaignsPageProps): Promise<React.JSX.Element> {
  return tanstackLoader({ params }) as never;
}
