import type { Metadata } from "next";
import type { JSX, ReactNode } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";

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
    title: "meta.profile.title",
    description: "meta.profile.description",
    category: "meta.profile.category",
    image: "https://socialmediaservice.com/images/user-hero.jpg",
    imageAlt: "meta.profile.imageAlt",
    keywords: ["meta.profile.keywords"],
    additionalMetadata: {
      openGraph: {
        title: "meta.profile.ogTitle",
        description: "meta.profile.ogDescription",
        url: `https://socialmediaservice.com/${locale}/user`,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "meta.profile.twitterTitle",
        description: "meta.profile.twitterDescription",
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
    <div className="min-h-screen bg-blue-50 bg-gradient-to-b from-blue-50 to-white dark:bg-gray-950 dark:from-gray-950 dark:to-gray-900">
      {children}
    </div>
  );
}
