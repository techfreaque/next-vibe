/**
 * Subscriptions Admin Stats Page (Home)
 * Main subscriptions management interface - redirects to stats
 */

export const dynamic = "force-dynamic";

import { redirect } from "next-vibe-ui/lib/redirect";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";

interface AdminSubscriptionsPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export interface AdminSubscriptionsPageData {
  locale: CountryLanguage;
}

export async function tanstackLoader({
  params,
}: AdminSubscriptionsPageProps): Promise<AdminSubscriptionsPageData> {
  const { locale } = await params;
  redirect(`/${locale}/admin/subscriptions/stats`);
  return { locale };
}

export function TanstackPage(): JSX.Element {
  return null as never;
}

export default async function AdminSubscriptionsPage({
  params,
}: AdminSubscriptionsPageProps): Promise<JSX.Element> {
  const { locale } = await params;
  redirect(`/${locale}/admin/subscriptions/stats`);
}
