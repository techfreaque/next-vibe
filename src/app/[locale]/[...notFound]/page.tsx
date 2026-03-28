import type { Metadata } from "next";
import type { JSX } from "react";

import { envClient } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";

import { NotFoundBackButton } from "./not-found-client";
import { scopedTranslation } from "./i18n";

interface NotFoundPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface NotFoundPageData {
  locale: CountryLanguage;
}

/**
 * Generate metadata for the 404 page with translations
 */
export async function generateMetadata({
  params,
}: NotFoundPageProps): Promise<Metadata> {
  const { locale } = await params;
  const { t } = scopedTranslation.scopedT(locale);
  return metadataGenerator(locale, {
    path: "not-found",
    title: t("meta.title"),
    category: t("meta.category"),
    description: t("meta.description"),
    image: `${envClient.NEXT_PUBLIC_APP_URL}/images/not-found.jpg`,
    imageAlt: t("meta.imageAlt"),
    keywords: [t("meta.keywords")],
  });
}

export async function tanstackLoader({
  params,
}: NotFoundPageProps): Promise<NotFoundPageData> {
  const { locale } = await params;
  return { locale };
}

export function TanstackPage({ locale }: NotFoundPageData): JSX.Element {
  return <NotFoundBackButton locale={locale} />;
}

/**
 * Custom 404 Not Found page component for language routes
 * Displayed when a user navigates to a non-existent route within a language
 *
 * @returns JSX Element for the 404 page
 */
export default async function NotFound({
  params,
}: NotFoundPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
