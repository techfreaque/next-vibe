import type { Metadata } from "next";
import type { JSX } from "react";

import { envClient } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";

import { NotFoundBackButton } from "./not-found-client";

interface NotFoundPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

/**
 * Generate metadata for the 404 page with translations
 */
export async function generateMetadata({
  params,
}: NotFoundPageProps): Promise<Metadata> {
  const { locale } = await params;
  return metadataGenerator(locale, {
    path: "not-found",
    title: "app.meta.notFound.title",
    category: "app.meta.notFound.category",
    description: "app.meta.notFound.description",
    image: `${envClient.NEXT_PUBLIC_APP_URL}/images/not-found.jpg`,
    imageAlt: "app.meta.notFound.imageAlt",
    keywords: ["app.meta.notFound.keywords"],
  });
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
  const { locale } = await params;
  return <NotFoundBackButton locale={locale} />;
}
