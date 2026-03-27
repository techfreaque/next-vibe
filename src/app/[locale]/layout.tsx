/* eslint-disable oxlint-plugin-jsx-capitalization/jsx-capitalization */

import "next-vibe-ui/global-css";

import type { Metadata, Viewport } from "next";
import { Body } from "next-vibe-ui/ui/body";
import { inter } from "next-vibe-ui/ui/font";
import { Head } from "next-vibe-ui/ui/head";
import { Html } from "next-vibe-ui/ui/html";
import { Outlet } from "next-vibe-ui/ui/outlet";
import { Script } from "next-vibe-ui/ui/script";
import { Scripts } from "next-vibe-ui/ui/scripts";
import type { JSX, ReactNode } from "react";

import { getCookie } from "@tanstack/react-start/server";

import { envClient } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";
import { simpleT } from "@/i18n/core/shared";

import { RootProviders } from "./layout-shared";

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

interface StructuredDataOrganization {
  "@context": string;
  "@type": string;
  name: string;
  url: string;
  logo: string;
  sameAs: string[];
  contactPoint: {
    "@type": string;
    telephone: string;
    contactType: string;
    availableLanguage: string[];
  };
}

interface RootLayoutData {
  locale: CountryLanguage;
  structuredData: StructuredDataOrganization;
  theme: "light" | "dark";
  children?: ReactNode;
}

export async function tanstackLoader({
  params,
}: {
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<Omit<RootLayoutData, "children">> {
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
  const themeCookie = getCookie("theme");
  const theme: "light" | "dark" = themeCookie === "dark" ? "dark" : "light";

  return { locale, structuredData, theme };
}

export function TanstackPage({
  locale,
  structuredData,
  theme,
  children,
}: RootLayoutData): JSX.Element {
  return (
    <Html lang={locale} className={theme} suppressHydrationWarning>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href={`/api/${locale}/manifest`} />
      </Head>
      <Body className={inter.className}>
        <RootProviders locale={locale}>
          <Outlet>{children}</Outlet>
        </RootProviders>
        <Scripts />
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </Body>
    </Html>
  );
}

export default async function RootLayoutServer({
  children,
  params,
}: RootLayoutProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data}>{children}</TanstackPage>;
}
