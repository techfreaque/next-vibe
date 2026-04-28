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
import { cookies } from "next-vibe-ui/lib/headers";

import { getAvailableModelCount } from "@/app/api/[locale]/agent/models/all-models";
import { configScopedTranslation } from "@/config/i18n";
import { envClient } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";

import { scopedTranslation } from "./layout-i18n";

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
  const { t } = scopedTranslation.scopedT(locale);
  return metadataGenerator(locale, {
    path: "",
    title: t("meta.defaultTitle"),
    category: t("meta.category"),
    description: t("meta.description", {
      modelCount: getAvailableModelCount(false),
    }),
    image: `${envClient.NEXT_PUBLIC_APP_URL}/og-image.jpg`,
    imageAlt: t("meta.imageAlt"),
    keywords: [t("meta.keywords")],
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
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": t("structuredData.organization.types.organization"),
    name: configT("group.name"),
    url: envClient.NEXT_PUBLIC_APP_URL,
    logo: `${envClient.NEXT_PUBLIC_APP_URL}/logo.png`,
    sameAs: [
      configT("social.facebookUrl"),
      configT("social.twitterUrl"),
      configT("social.instagramUrl"),
      configT("social.linkedinUrl"),
    ],
    contactPoint: {
      "@type": t("structuredData.organization.types.contactPoint"),
      telephone: configT("group.contact.telephone"),
      contactType: t("structuredData.organization.contactPoint.contactType"),
      availableLanguage: [
        t("constants.languages.en"),
        t("constants.languages.de"),
        t("constants.languages.pl"),
      ],
    },
  };
  const themeCookie = (await cookies()).get("theme_v2")?.value;
  const theme: "light" | "dark" = themeCookie === "light" ? "light" : "dark";

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
        {/* Sync cookie → localStorage before next-themes reads it, preventing theme flash */}
        <Script
          id="theme-sync"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var m=document.cookie.match(/(?:^|;\\s*)theme_v2=(light|dark)/);if(m)localStorage.setItem('theme_v2',m[1]);}catch(e){}})();`,
          }}
        />
      </Head>
      <Body className={inter.className}>
        <RootProviders locale={locale} theme={theme}>
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
