import { redirect } from "next/navigation";
import type { CountryLanguage } from "@/i18n/core/config";

interface SubscriptionPageProps {
  params: Promise<{ locale: CountryLanguage }>;
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
