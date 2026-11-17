export const dynamic = "force-dynamic";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { permanentRedirect } from "next-vibe/ui/lib/redirect";

interface PricingPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

/**
 * /[locale]/pricing - old URL Google still sends visitors to.
 * 308 to the public pricing page so the link equity lands there.
 */
export async function tanstackLoader({
  params,
}: PricingPageProps): Promise<never> {
  const { locale } = await params;
  permanentRedirect(`/${locale}/subscription/overview`);
}

export function TanstackPage(): never {
  return null as never;
}

export default async function PricingPage({
  params,
}: PricingPageProps): Promise<never> {
  return tanstackLoader({ params });
}
