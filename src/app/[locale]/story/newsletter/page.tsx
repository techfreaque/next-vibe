import type { Metadata } from "next";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { NewsletterPage } from "@/app/api/[locale]/v1/core/newsletter/subscribe/_components/newsletter-page";

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
    title: t("app.story.newsletter.page.title", {
      appName: t("config.appName"),
    }),
    description: t("app.story.newsletter.page.description"),
    openGraph: {
      title: t("app.story.newsletter.page.title", {
        appName: t("config.appName"),
      }),
      description: t("app.story.newsletter.page.description"),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("app.story.newsletter.page.title", {
        appName: t("config.appName"),
      }),
      description: t("app.story.newsletter.page.description"),
    },
  };
}

export default async function Newsletter({
  params,
}: PageProps): Promise<JSX.Element> {
  const { locale } = await params;

  return <NewsletterPage locale={locale} />;
}
