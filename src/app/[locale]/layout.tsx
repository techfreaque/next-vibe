import "./globals.css";

import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { env } from "next-vibe/server";
import { ThemeProvider } from "next-vibe-ui/ui/theme-provider";
import { Toaster } from "next-vibe-ui/ui/toaster";
import type { JSX, ReactNode } from "react";

import { TranslationProvider } from "@/i18n/core/client";
import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";
import { simpleT } from "@/i18n/core/shared";

import { ErrorBoundary } from "./_components/error-boundary";
import ErrorFallback from "./_components/error-fallback";
import { LeadTrackingProvider } from "./_components/lead-tracking-provider";

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
    title: "layout.metadata.defaultTitle",
    category: "layout.metadata.category",
    description: "layout.metadata.description",
    image: "https://socialmediaservice.com/og-image.jpg",
    imageAlt: "layout.openGraph.imageAlt",
    keywords: ["meta.home.keywords"],
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
    "@type": t("layout.structuredData.organization.types.organization"),
    "name": t("layout.structuredData.organization.name"),
    "url": "https://socialmediaservice.com",
    "logo": "https://socialmediaservice.com/logo.png",
    "sameAs": [
      "https://facebook.com/socialmediaservice",
      "https://twitter.com/socialmediaservice",
      "https://instagram.com/socialmediaservice",
      "https://linkedin.com/company/socialmediaservice",
    ],
    "contactPoint": {
      "@type": t("layout.structuredData.organization.types.contactPoint"),
      "telephone": t(
        "layout.structuredData.organization.contactPoint.telephone",
      ),
      "contactType": t(
        "layout.structuredData.organization.contactPoint.contactType",
      ),
      "availableLanguage": [
        t("constants.languages.en"),
        t("constants.languages.de"),
        t("constants.languages.pl"),
      ],
    },
  };

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/images/apple-icon.png" />
        <link rel="manifest" href={`/api/${locale}/v1/core/manifest`} />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TranslationProvider currentLocale={locale}>
            <LeadTrackingProvider />
            <ErrorBoundary fallback={<ErrorFallback />} locale={locale}>
              {children}
            </ErrorBoundary>
            <Toaster />
          </TranslationProvider>
        </ThemeProvider>
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        {env.ENABLE_ANALYTICS ? <Analytics /> : null}
      </body>
    </html>
  );
}
