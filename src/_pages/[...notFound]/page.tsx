import type { Metadata } from "next";
import { coreClientEnv as envClient } from "next-vibe/core/env-client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { notFound } from "next-vibe/ui/lib/not-found";
import type { JSX } from "react";

import { scopedTranslation } from "./i18n";
import { NotFoundBackButton } from "./not-found-client";

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
    generateAlternates: false,
    additionalMetadata: { robots: { index: false, follow: false } },
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
 * Next.js catch-all: unmatched routes must answer HTTP 404 (not 200).
 * notFound() renders src/_pages/not-found.tsx with a real 404 status.
 * The TanStack path sets the status in its generated route (TanstackPage).
 */
export default function NotFound(): never {
  return notFound();
}
