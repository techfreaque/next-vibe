import type { JSX } from "react";

import { Environment } from "@/app/api/[locale]/shared/utils";
import { envClient } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";

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
