export const dynamic = "force-dynamic";

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

export function TanstackPage(): never {
  return null as never;
}

export default async function EmailCampaignsPage({
  params,
}: EmailCampaignsPageProps): Promise<React.JSX.Element> {
  return tanstackLoader({ params }) as never;
}
