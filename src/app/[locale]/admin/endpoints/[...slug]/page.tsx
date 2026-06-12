export const dynamic = "force-dynamic";

import type { JSX } from "react";

import { tanstackLoader as indexLoader } from "../page";
import { EndpointsAdminPageClient } from "../page-client";
import type { EndpointsAdminPageData } from "../page";
import type { CountryLanguage } from "@/i18n/core/config";

interface SlugPageProps {
  params: Promise<{ locale: CountryLanguage; slug: string[] }>;
}

export type EndpointsAdminSlugPageData = EndpointsAdminPageData;

export async function tanstackLoader({
  params,
}: SlugPageProps): Promise<EndpointsAdminSlugPageData> {
  const { locale } = await params;
  return indexLoader({ params: Promise.resolve({ locale }) });
}

export function TanstackPage({
  locale,
  user,
  initialHelpData,
}: EndpointsAdminSlugPageData): JSX.Element {
  return (
    <EndpointsAdminPageClient
      locale={locale}
      user={user}
      initialHelpData={initialHelpData}
    />
  );
}

export default async function EndpointsAdminSlugPage({
  params,
}: SlugPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
