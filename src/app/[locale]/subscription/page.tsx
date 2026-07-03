export const dynamic = "force-dynamic";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { redirect } from "next-vibe/ui/lib/redirect";
import type { JSX } from "react";

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
  redirect(`/${locale}/subscription/overview`);
}

export function TanstackPage(): JSX.Element {
  return null as never;
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
