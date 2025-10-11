import type { Metadata } from "next";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { NewsletterPage } from "./_components/newsletter-page";

interface PageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const { t } = simpleT(locale);

  return {
    title: t("newsletter.page.title"),
    description: t("newsletter.page.description"),
    openGraph: {
      title: t("newsletter.page.title"),
      description: t("newsletter.page.description"),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("newsletter.page.title"),
      description: t("newsletter.page.description"),
    },
  };
}

export default async function Newsletter({
  params,
}: PageProps): Promise<JSX.Element> {
  const { locale } = await params;

  return <NewsletterPage locale={locale} />;
}
