import type { JSX } from "react";

import { Environment } from "@/app/api/[locale]/shared/utils";
import { envClient } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";

import { DesignTestPageLayout } from "./_components/page-layout";

interface DesignTestPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export default async function DesignTestPage({
  params,
}: DesignTestPageProps): Promise<JSX.Element> {
  const { locale } = await params;
  if (envClient.NODE_ENV === Environment.PRODUCTION) {
    return <></>;
  }
  return <DesignTestPageLayout locale={locale} />;
}
