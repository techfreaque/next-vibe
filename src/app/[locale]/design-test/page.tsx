import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";

import { DesignTestPageLayout } from "./_components/page-layout";

interface DesignTestPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export default async function DesignTestPage({
  params,
}: DesignTestPageProps): Promise<JSX.Element> {
  const { locale } = await params;
  return <DesignTestPageLayout locale={locale} />;
}
