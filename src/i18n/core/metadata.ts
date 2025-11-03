import type { Metadata } from "next";

import { METADATA_CONFIG } from "../../config/metadata";
import type { CountryLanguage } from "./config";
import { Countries, Languages as LanguagesEnum } from "./config";
import { simpleT } from "./shared";
import type { TranslationKey } from "./static-types";

export interface MetadataConfig {
  baseUrl: string;
  twitterHandle: TranslationKey;
  defaultImage: TranslationKey;
  defaultImageAlt: TranslationKey;

  // Authors and publisher
  authors: { name: TranslationKey }[];
  creator: TranslationKey;
  publisher: TranslationKey;

  // Verification
  verification: {
    google: string;
    yandex: string;
    yahoo: string;
    other: {
      me: string[];
    };
  };

  // Format detection
  formatDetection: {
    telephone: boolean;
    date: boolean;
    address: boolean;
    email: boolean;
    url: boolean;
  };

  // Robots
  robots: {
    index?: boolean;
    follow?: boolean;
    googleBot?: {
      index?: boolean;
      follow?: boolean;
      "max-image-preview"?: "none" | "standard" | "large";
      "max-snippet"?: number;
    };
  };
}

/**
 * Options for generating metadata with translations
 */
export interface GenerateMetadataOptions {
  /**
   * The path of the current page (without leading slash)
   * @example "about-us"
   * @required
   */
  path: string;

  /**
   * Title translation key
   * @required
   */
  title: TranslationKey;

  /**
   * Category translation key
   * @required
   */
  category: TranslationKey;

  /**
   * Description translation key
   * @required
   */
  description: TranslationKey;

  /**
   * Default image to use if translation is not found
   * @required for social sharing
   */
  image: string;

  /**
   * Image alt text translation key
   * @required for accessibility
   */
  imageAlt: TranslationKey;

  /**
   * Keywords translation keys
   * @required for SEO
   */
  keywords: TranslationKey[];

  /**
   * Additional metadata to merge with the generated metadata
   */
  additionalMetadata?: Partial<Metadata>;

  /**
   * Whether to generate language alternates
   * @default true
   */
  generateAlternates?: boolean;

  /**
   * Whether to include OpenGraph metadata
   * @default true
   */
  includeOpenGraph?: boolean;

  /**
   * Whether to include Twitter metadata
   * @default true
   */
  includeTwitter?: boolean;

  /**
   * Parent metadata to extend
   */
  parent?: Metadata;
}

/**
 * Generate metadata for a page with translations
 *
 * @param locale The current locale
 * @param options Options for generating metadata
 * @returns Metadata object
 */
export function metadataGenerator(
  locale: CountryLanguage,
  options: GenerateMetadataOptions,
): Metadata {
  // Create translation function
  const { t } = simpleT(locale);

  // Extract path from options
  const { path } = options;

  // Set defaults by merging METADATA_CONFIG with options
  const {
    baseUrl,
    additionalMetadata = {},
    generateAlternates = true,
    includeOpenGraph = true,
    includeTwitter = true,
    category,
    twitterHandle,
    authors,
    creator,
    publisher,
    verification,
    formatDetection,
    robots,
    ...otherOptions
  }: GenerateMetadataOptions & MetadataConfig = {
    ...METADATA_CONFIG,
    ...options,
  };

  // Build canonical URL

  const canonicalUrl = `${baseUrl}/${locale}${path ? `/${path}` : ""}`;

  // Generate language alternates if enabled
  const languageAlternates: Record<string, string> = {};

  if (generateAlternates) {
    // Combining Languages and Countries to generate all valid combinations
    Object.values(LanguagesEnum).forEach((lang) => {
      Object.values(Countries).forEach((country) => {
        const countryLang = `${lang}-${country}`;
        languageAlternates[countryLang] =
          `${baseUrl}/${countryLang}${path ? `/${path}` : ""}`;
      });
    });
  }
  const appName = t("config.appName");

  // Get translated values using the provided translation keys
  const translatedTitle = t(options.title, { appName });
  const translatedDescription = t(options.description, { appName });
  const translatedKeywords = options.keywords.map((key) => t(key, { appName }));
  const translatedImageAlt = t(options.imageAlt, { appName });

  // Build metadata object
  const metadata: Metadata = {
    ...otherOptions,
    // Basic metadata
    title: translatedTitle,
    description: translatedDescription,

    // SEO metadata
    keywords: translatedKeywords,

    // Authors and publisher
    authors,
    creator,
    publisher,

    // Robots
    robots,

    // Alternates
    alternates: {
      canonical: canonicalUrl,
      languages: languageAlternates,
    },

    // Verification
    verification,

    // Category
    category: t(category),
    // Application name
    applicationName: appName,

    // Format detection
    formatDetection,
  };

  // Add OpenGraph metadata if enabled
  if (includeOpenGraph) {
    metadata.openGraph = {
      title: translatedTitle,
      description: translatedDescription,
      url: canonicalUrl,
      siteName: appName,
      type: "website",
      locale: locale.replace("-", "_"),
      images: [
        {
          url: options.image,
          width: 1200,
          height: 630,
          alt: translatedImageAlt,
        },
      ],
    };
  }

  // Add Twitter metadata if enabled
  if (includeTwitter) {
    metadata.twitter = {
      card: "summary_large_image",
      title: translatedTitle,
      description: translatedDescription,
      site: twitterHandle,
      creator: twitterHandle,
      images: [options.image],
    };
  }

  // Merge with additional metadata
  return {
    ...metadata,
    ...additionalMetadata,
    // Merge nested objects
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
