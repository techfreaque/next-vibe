/* eslint-disable oxlint-plugin-jsx-capitalization/jsx-capitalization */

import "next-vibe/ui/global-css";

import type { Metadata, Viewport } from "next";
import type { AgentEnvAvailability } from "next-vibe/agent/env-availability";
import { getEnvAvailability } from "next-vibe/agent/env-availability";
import {
  getAvailableChatModelCount,
  getAvailableChatProviderCount,
} from "next-vibe/agent/models/all-models";
import { coreEnv } from "next-vibe/core/env";
import { coreClientEnv as envClient } from "next-vibe/core/env-client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { htmlLang } from "next-vibe/core/i18n/core/language-utils";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Body } from "next-vibe/ui/components/body";
import { devanagari, inter } from "next-vibe/ui/components/font";
import { Head } from "next-vibe/ui/components/head";
import { Html } from "next-vibe/ui/components/html";
import { JsonLd, type JsonLdNode } from "next-vibe/ui/components/json-ld";
import { LinkTag } from "next-vibe/ui/components/link-tag";
import { Outlet } from "next-vibe/ui/components/outlet";
import { Script } from "next-vibe/ui/components/script";
import { Scripts } from "next-vibe/ui/components/scripts";
import type { ThemePreference } from "next-vibe/ui/components/theme-provider";
import { cookies } from "next-vibe/ui/lib/headers";
import { notFound } from "next-vibe/ui/lib/not-found";
import type { JSX, ReactNode } from "react";

import { AUTH_TOKEN_COOKIE_NAME } from "@/env/constants";
import { SessionEmailBanner } from "@/user/public/verify-email/session-banner";
import { sessionNoticeRecipient } from "@/user/public/verify-email/session-notice";

import { buildSiteStructuredData } from "./_components/structured-data";
import { scopedTranslation } from "./layout-i18n";
import { RootProviders } from "./layout-shared";
import { rootViewport } from "./layout-viewport";

export const viewport: Viewport = rootViewport;

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
      modelCount: getAvailableChatModelCount(false, await getEnvAvailability()),
    }),
    image: `${envClient.NEXT_PUBLIC_APP_URL.replace(/\/+$/, "")}/og-image.jpg`,
    imageAlt: t("meta.imageAlt"),
    keywords: [t("meta.keywords")],
    // No canonical/hreflang at layout level: a page without its own metadata
    // would inherit the home URL as canonical and be read as a duplicate of
    // it. Every indexable page sets its own via metadataGenerator.
    additionalMetadata: {
      alternates: null,
      robots: null,
      icons: {
        // White lamp on a solid brand-blue tile: visible on light and dark
        // tabs. SVG first, multi-size ICO fallback, opaque apple-touch icon.
        icon: [
          { url: "/favicon.svg", type: "image/svg+xml" },
          { url: "/favicon.ico", sizes: "any" },
        ],
        apple: { url: "/images/apple-icon.png", sizes: "180x180" },
      },
      // Search Console / Bing Webmaster tokens, rendered on every page.
      // Read inline: the client build strips generateMetadata, but a helper
      // function would keep the server-only env import in the client bundle.
      verification: {
        ...(coreEnv.GOOGLE_SITE_VERIFICATION
          ? { google: coreEnv.GOOGLE_SITE_VERIFICATION }
          : {}),
        ...(coreEnv.BING_SITE_VERIFICATION
          ? { other: { "msvalidate.01": coreEnv.BING_SITE_VERIFICATION } }
          : {}),
      },
    },
  });
}

interface RootLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: CountryLanguage }>;
}

interface RootLayoutData {
  locale: CountryLanguage;
  structuredData: JsonLdNode;
  emailNotice: Awaited<ReturnType<typeof sessionNoticeRecipient>>;
  theme: ThemePreference;
  availability: AgentEnvAvailability;
  children?: ReactNode;
}

export async function tanstackLoader({
  params,
}: {
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<Omit<RootLayoutData, "children">> {
  const { locale } = await params;
  // Guard against bots hitting e.g. /favicon.png /chunk.js /sitemap.xml.gz
  // which Next.js routes to [locale]/... when no real static file exists.
  if (!/^[a-z]{2}-[A-Z]+$/.test(locale)) {
    notFound();
  }
  const jar = await cookies();
  const themeCookie = jar.get("theme_v2")?.value;
  const token = jar.get(AUTH_TOKEN_COOKIE_NAME)?.value;
  const emailNotice = token
    ? await sessionNoticeRecipient(token, locale)
    : null;
  const theme: ThemePreference =
    themeCookie === "light" || themeCookie === "system" ? themeCookie : "dark";
  const availability = await getEnvAvailability();
  const structuredData = buildSiteStructuredData({
    locale,
    modelCount: getAvailableChatModelCount(false, availability),
    providerCount: getAvailableChatProviderCount(false, availability),
  });

  return { locale, structuredData, theme, availability, emailNotice };
}

export function TanstackPage({
  locale,
  structuredData,
  emailNotice,
  theme,
  availability,
  children,
}: RootLayoutData): JSX.Element {
  return (
    // "system" can't be resolved on the server: render dark, the head theme
    // script swaps to the OS scheme before first paint.
    <Html
      lang={htmlLang(locale)}
      dir="ltr"
      className={`${theme === "light" ? "light" : "dark"} ${inter.variable} ${devanagari.variable}`.trim()}
      suppressHydrationWarning
    >
      <Head>
        <LinkTag rel="manifest" href={`/api/${locale}/manifest`} />
        {/* Sync cookie → localStorage before next-themes reads it, preventing theme flash */}
        <Script
          id="theme-sync"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var m=document.cookie.match(/(?:^|;\\s*)theme_v2=(light|dark|system)/);if(m)localStorage.setItem('theme_v2',m[1]);}catch(e){}})();`,
          }}
        />
      </Head>
      <Body className={inter.className}>
        <RootProviders
          locale={locale}
          theme={theme}
          availability={availability}
        >
          {emailNotice && (
            <SessionEmailBanner
              key={emailNotice.user.id + emailNotice.email}
              {...emailNotice}
              locale={locale}
            />
          )}
          <Outlet>{children}</Outlet>
        </RootProviders>
        <Scripts />
        <JsonLd id="structured-data" data={structuredData} />
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
