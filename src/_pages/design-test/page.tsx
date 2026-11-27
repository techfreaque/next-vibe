import { coreClientEnv as envClient } from "next-vibe/core/env-client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { NOINDEX_FOLLOW_ROBOTS } from "next-vibe/core/i18n/core/metadata";
import { Environment } from "next-vibe/env/env-util";
import { notFound } from "next-vibe/ui/lib/not-found";
import type { JSX } from "react";

import { DesignTestPageLayout } from "./_components/page-layout";

interface DesignTestPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export function generateMetadata(): { robots: typeof NOINDEX_FOLLOW_ROBOTS } {
  return { robots: NOINDEX_FOLLOW_ROBOTS };
}

export interface DesignTestPageData {
  locale: CountryLanguage;
}

export async function tanstackLoader({
  params,
}: DesignTestPageProps): Promise<DesignTestPageData> {
  if (envClient.NODE_ENV === Environment.PRODUCTION) {
    notFound();
  }
  const { locale } = await params;
  return { locale };
}

export function TanstackPage({ locale }: DesignTestPageData): JSX.Element {
  return <DesignTestPageLayout locale={locale} />;
}

export default async function DesignTestPage({
  params,
}: DesignTestPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
