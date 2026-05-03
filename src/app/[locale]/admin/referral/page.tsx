export const dynamic = "force-dynamic";

import { redirect } from "next-vibe-ui/lib/redirect";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";

interface AdminReferralPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface AdminReferralPageData {
  locale: CountryLanguage;
}

export async function tanstackLoader({
  params,
}: AdminReferralPageProps): Promise<AdminReferralPageData> {
  const { locale } = await params;
  redirect(`/${locale}/admin/subscriptions/referrals`);
  return { locale };
}

export function TanstackPage(): JSX.Element {
  return null as never;
}

export default async function AdminReferralPage({
  params,
}: AdminReferralPageProps): Promise<JSX.Element> {
  const { locale } = await params;
  redirect(`/${locale}/admin/subscriptions/referrals`);
}
