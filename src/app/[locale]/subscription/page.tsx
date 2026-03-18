import { redirect } from "next-vibe-ui/lib/redirect";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";

interface SubscriptionPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface SubscriptionRootPageData {
  locale: CountryLanguage;
}

export async function tanstackLoader({
  params,
}: SubscriptionPageProps): Promise<SubscriptionRootPageData> {
  const { locale } = await params;
  return { locale };
}

export function TanstackPage({
  locale,
}: SubscriptionRootPageData): JSX.Element {
  redirect(`/${locale}/subscription/overview`);
}

/**
 * Main subscription page - redirects to overview tab
 */
export default async function SubscriptionPage({
  params,
}: SubscriptionPageProps): Promise<never> {
  const { locale } = await params;
  redirect(`/${locale}/subscription/overview`);
}
