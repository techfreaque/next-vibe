import type { Metadata } from "next";

import { configScopedTranslation } from "../../config/i18n";
import { METADATA_CONFIG } from "../../config/metadata";
import type { CountryLanguage } from "./config";
import { Countries, Languages as LanguagesEnum } from "./config";
import type { TranslatedKeyType } from "./scoped-translation";

export interface MetadataConfig {
  baseUrl: string;
  twitterHandle: TranslatedKeyType;
  defaultImage: TranslatedKeyType;
  defaultImageAlt: TranslatedKeyType;

  // Authors and publisher
  authors: { name: TranslatedKeyType }[];
  creator: TranslatedKeyType;
  publisher: TranslatedKeyType;

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
  title: TranslatedKeyType;

  /**
   * Category
   * @required
   */
  category: TranslatedKeyType;

  /**
   * Description
   * @required
   */
  description: TranslatedKeyType;

  /**
   * Default image to use for social sharing
   * @required for social sharing
   */
  image: string;

  /**
   * Image alt text
   * @required for accessibility
   */
  imageAlt: TranslatedKeyType;

  /**
   * Keywords
   * @required for SEO
   */
  keywords: TranslatedKeyType[];

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
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");

  const { path } = options;

  const {
    baseUrl,
    additionalMetadata = {},
    generateAlternates = true,
    includeOpenGraph = true,
    includeTwitter = true,
    authors,
    creator,
    publisher,
    verification,
    formatDetection,
    robots,
  }: GenerateMetadataOptions & MetadataConfig = {
    ...METADATA_CONFIG,
    ...options,
  };

  const canonicalUrl = `${baseUrl}/${locale}${path ? `/${path}` : ""}`;

  const languageAlternates: Record<string, string> = {};
  if (generateAlternates) {
    Object.values(LanguagesEnum).forEach((lang) => {
      Object.values(Countries).forEach((country) => {
        const countryLang = `${lang}-${country}`;
        languageAlternates[countryLang] =
          `${baseUrl}/${countryLang}${path ? `/${path}` : ""}`;
      });
    });
  }

  const metadata: Metadata = {
    title: options.title,
    description: options.description,
    keywords: options.keywords,
    authors,
    creator,
    publisher,
    robots,
    alternates: {
      canonical: canonicalUrl,
      languages: languageAlternates,
    },
    verification,
    category: options.category,
    applicationName: appName,
    formatDetection,
  };

  // Add OpenGraph metadata if enabled
  if (includeOpenGraph) {
    metadata.openGraph = {
      title: options.title,
      description: options.description,
      url: canonicalUrl,
      siteName: appName,
      type: "website",
      locale: locale.replace("-", "_"),
      images: [
        {
          url: options.image,
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
      site: configT("social.twitterHandle"),
      creator: configT("social.twitterHandle"),
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
