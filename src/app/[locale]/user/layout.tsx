import type { Metadata } from "next";
import { Div } from "next-vibe-ui/ui/div";
import { PageLayout } from "next-vibe-ui/ui/page-layout";
import type { JSX, ReactNode } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";
import { translations } from "@/config/i18n/en";

/**
 * Generate metadata for the user pages with translations
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return metadataGenerator(locale, {
    path: "user",
    title: "app.user.meta.profile.title",
    description: "app.user.meta.profile.description",
    category: "app.user.meta.profile.category",
    image: `${translations.websiteUrl}/images/user-hero.jpg`,
    imageAlt: "app.user.meta.profile.imageAlt",
    keywords: ["app.user.meta.profile.keywords"],
    additionalMetadata: {
      openGraph: {
        title: "app.user.meta.profile.ogTitle",
        description: "app.user.meta.profile.ogDescription",
        url: `${translations.websiteUrl}/${locale}/user`,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "app.user.meta.profile.twitterTitle",
        description: "app.user.meta.profile.twitterDescription",
      },
    },
  });
}

export default function UserLayout({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <PageLayout scrollable={true}>
      <Div className="min-h-screen bg-blue-50 bg-gradient-to-b from-blue-50 to-white dark:bg-gray-950 dark:from-gray-950 dark:to-gray-900">
        {children}
      </Div>
    </PageLayout>
  );
}
