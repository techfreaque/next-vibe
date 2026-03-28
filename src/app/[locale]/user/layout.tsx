import type { Metadata } from "next";
import { Div } from "next-vibe-ui/ui/div";
import { PageLayout } from "next-vibe-ui/ui/page-layout";
import type { JSX, ReactNode } from "react";

import { envClient } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";

import { scopedTranslation as pageT } from "./i18n";

/**
 * Generate metadata for the user pages with translations
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { t } = pageT.scopedT(locale);
  return metadataGenerator(locale, {
    path: "user",
    title: t("meta.profile.title"),
    description: t("meta.profile.description"),
    category: t("meta.profile.category"),
    image: `${envClient.NEXT_PUBLIC_APP_URL}/images/user-hero.jpg`,
    imageAlt: t("meta.profile.imageAlt"),
    keywords: [t("meta.profile.keywords")],
    additionalMetadata: {
      openGraph: {
        title: t("meta.profile.ogTitle"),
        description: t("meta.profile.ogDescription"),
        url: `${envClient.NEXT_PUBLIC_APP_URL}/${locale}/user`,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: t("meta.profile.twitterTitle"),
        description: t("meta.profile.twitterDescription"),
      },
    },
  });
}

export interface UserLayoutData {
  children?: ReactNode;
}

export async function tanstackLoader(): Promise<
  Omit<UserLayoutData, "children">
> {
  return {};
}

export function TanstackPage({ children }: UserLayoutData): JSX.Element {
  return (
    <PageLayout scrollable={true}>
      <Div className="min-h-screen bg-blue-50 bg-linear-to-b from-blue-50 to-white dark:bg-gray-950 dark:from-gray-950 dark:to-gray-900">
        {children}
      </Div>
    </PageLayout>
  );
}

export default function UserLayout({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return <TanstackPage>{children}</TanstackPage>;
}
