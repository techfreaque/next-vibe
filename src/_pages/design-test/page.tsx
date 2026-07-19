import { coreClientEnv as envClient } from "next-vibe/core/env-client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Environment } from "next-vibe/env/env-util";
import type { JSX } from "react";

import { DesignTestPageLayout } from "./_components/page-layout";

interface DesignTestPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface DesignTestPageData {
  locale: CountryLanguage;
}

export async function tanstackLoader({
  params,
}: DesignTestPageProps): Promise<DesignTestPageData> {
  const { locale } = await params;
  return { locale };
}

export function TanstackPage({ locale }: DesignTestPageData): JSX.Element {
  if (envClient.NODE_ENV === Environment.PRODUCTION) {
    return <></>;
  }
  return <DesignTestPageLayout locale={locale} />;
}

export default async function DesignTestPage({
  params,
}: DesignTestPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
