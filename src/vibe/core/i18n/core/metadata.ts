import type { Metadata } from "next";

import { configScopedTranslation } from "@/env/i18n";

import type { CountryLanguage } from "./config";
import type { TranslatedKeyType } from "./scoped-translation";
import {
  canonicalSeoLocale,
  hreflangFor,
  seoLanguageAlternates,
} from "./seo-locales";

/**
 * Robots value for app pages (chat, account, auth): crawlable but never
 * indexed, links followed. These paths are NOT disallowed in robots.txt on
 * purpose: Google can only drop a URL it is allowed to fetch and see this
 * noindex on, otherwise every linked app URL ends up "Indexed, though blocked
 * by robots.txt".
 */
export const NOINDEX_FOLLOW_ROBOTS = {
  index: false,
  follow: true,
  googleBot: { index: false, follow: true },
} as const satisfies Metadata["robots"];

/**
 * Options for generating metadata with translations
 */
interface GenerateMetadataOptions {
  path: string;
  title: TranslatedKeyType;
  category: TranslatedKeyType;
  /** Localized copy or the actual description from user-authored content. */
  description: string;
  /** Absolute 1200x630 share image. Defaults to the site's /og-image.jpg. */
  image?: string;
  imageAlt: TranslatedKeyType;
  keywords: TranslatedKeyType[];
  additionalMetadata?: Partial<Metadata>;
  generateAlternates?: boolean;
  includeOpenGraph?: boolean;
  includeTwitter?: boolean;
  parent?: Metadata;
}

export function canonicalPageUrl(
  locale: CountryLanguage,
  path: string,
): string {
  const { t } = configScopedTranslation.scopedT(locale);
  return `${t("websiteUrl").replace(/\/+$/, "")}/${canonicalSeoLocale(locale)}${path ? `/${path}` : ""}`;
}

export function metadataGenerator(
  locale: CountryLanguage,
  options: GenerateMetadataOptions,
): Metadata {
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  const groupName = configT("group.name");
  const twitterHandle = configT("social.twitterHandle");
  const baseUrl = configT("websiteUrl");
  // The width/height below are only true for 1200x630 images.
  const image = options.image ?? `${baseUrl.replace(/\/+$/, "")}/og-image.jpg`;

  const {
    path,
    additionalMetadata = {},
    generateAlternates = true,
    includeOpenGraph = true,
    includeTwitter = true,
  } = options;

  // Mixed locales (de-US, en-PL, ...) are served but not indexed: their
  // canonical is the language's indexable locale, so search engines see one
  // URL per language/market (same set as the sitemap).
  const canonicalUrl = canonicalPageUrl(locale, path);

  const languageAlternates: Record<string, string> = generateAlternates
    ? seoLanguageAlternates(baseUrl, path)
    : {};

  const metadata: Metadata = {
    title: options.title,
    description: options.description,
    keywords: options.keywords,
    authors: [{ name: groupName }],
    creator: groupName,
    publisher: groupName,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: canonicalUrl,
      languages: languageAlternates,
    },
    category: options.category,
    applicationName: appName,
    formatDetection: {
      telephone: true,
      date: true,
      address: true,
      email: true,
      url: true,
    },
  };

  if (includeOpenGraph) {
    metadata.openGraph = {
      title: options.title,
      description: options.description,
      url: canonicalUrl,
      siteName: appName,
      type: "website",
      locale: hreflangFor(canonicalSeoLocale(locale)).replace("-", "_"),
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: options.imageAlt,
        },
      ],
    };
  }

  if (includeTwitter) {
    metadata.twitter = {
      card: "summary_large_image",
      title: options.title,
      description: options.description,
      site: twitterHandle,
      creator: twitterHandle,
      images: [image],
    };
  }

  return {
    ...metadata,
    ...additionalMetadata,
    openGraph: {
      ...metadata.openGraph,
      ...additionalMetadata.openGraph,
    },
    twitter: {
      ...metadata.twitter,
      ...additionalMetadata.twitter,
    },
  };
}
