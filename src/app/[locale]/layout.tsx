/* eslint-disable oxlint-plugin-jsx-capitalization/jsx-capitalization */

import "./globals.css";

import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Html } from "next-vibe-ui/ui/html";
import type { JSX, ReactNode } from "react";

import { env } from "@/config/env";
import { envClient } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";
import { simpleT } from "@/i18n/core/shared";
import { Body } from "@/packages/next-vibe-ui/web/ui/body";

import { RootProviders } from "./layout-shared";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const viewport: Viewport = {
  themeColor: "#0EA5E9",
  width: "device-width",
  initialScale: 1,
};

interface RootLayoutMetaProps {
  params: Promise<{ locale: CountryLanguage }>;
}

/**
 * Generate metadata for the homepage with translations
 */
export async function generateMetadata({
  params,
}: RootLayoutMetaProps): Promise<Metadata> {
  const { locale } = await params;
  return metadataGenerator(locale, {
    path: "",
    title: "app.layout.metadata.defaultTitle",
    category: "app.layout.metadata.category",
    description: "app.layout.metadata.description",
    image: `${envClient.NEXT_PUBLIC_APP_URL}/og-image.jpg`,
    imageAlt: "app.layout.openGraph.imageAlt",
    keywords: ["app.meta.home.keywords"],
  });
}

interface RootLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: CountryLanguage }>;
}

export default async function RootLayoutServer({
  children,
  params,
}: RootLayoutProps): Promise<JSX.Element> {
  const { locale } = await params;
  const { t } = simpleT(locale);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": t("app.layout.structuredData.organization.types.organization"),
    name: t("config.group.name"),
    url: envClient.NEXT_PUBLIC_APP_URL,
    logo: `${envClient.NEXT_PUBLIC_APP_URL}/logo.png`,
    sameAs: [
      t("config.social.facebookUrl"),
      t("config.social.twitterUrl"),
      t("config.social.instagramUrl"),
      t("config.social.linkedinUrl"),
    ],
    contactPoint: {
      "@type": t("app.layout.structuredData.organization.types.contactPoint"),
      telephone: t(
        "app.layout.structuredData.organization.contactPoint.telephone",
      ),
      contactType: t(
        "app.layout.structuredData.organization.contactPoint.contactType",
      ),
      availableLanguage: [
        t("app.constants.languages.en"),
        t("app.constants.languages.de"),
        t("app.constants.languages.pl"),
      ],
    },
  };

  return (
    <Html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/images/apple-icon.png" />
        <link rel="manifest" href={`/api/${locale}/manifest`} />
      </head>
      <Body className={inter.className}>
        <RootProviders locale={locale}>{children}</RootProviders>
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        {env.ENABLE_ANALYTICS && !env.NEXT_PUBLIC_LOCAL_MODE ? (
          <Analytics />
        ) : null}
      </Body>
    </Html>
  );
}
