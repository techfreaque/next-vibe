export const dynamic = "force-dynamic";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JSX } from "react";

import { subscriptionLoader } from "../shared-loader";
import { OverviewPageClient } from "./page-client";

interface PageProps {
  params: Promise<{ locale: CountryLanguage }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export interface OverviewPageData {
  locale: CountryLanguage;
  user: Awaited<ReturnType<typeof subscriptionLoader>>["user"];
  initialCredits: Awaited<
    ReturnType<typeof subscriptionLoader>
  >["initialCredits"];
}

export async function tanstackLoader({
  params,
  searchParams,
}: PageProps): Promise<OverviewPageData> {
  const { locale } = await params;
  const query = await searchParams;
  const data = await subscriptionLoader({ locale, searchParams: query });
  return data;
}

export function TanstackPage({
  locale,
  user,
  initialCredits,
}: OverviewPageData): JSX.Element {
  return (
    <OverviewPageClient
      locale={locale}
      user={user}
      initialCredits={initialCredits}
    />
  );
}

export default async function OverviewPage({
  params,
  searchParams,
}: PageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params, searchParams });
  return <TanstackPage {...data} />;
}
