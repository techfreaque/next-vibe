import type { Metadata } from "next";

import { configScopedTranslation } from "../../config/i18n";
import type { CountryLanguage } from "./config";
import { Countries, Languages as LanguagesEnum } from "./config";
import type { TranslatedKeyType } from "./scoped-translation";

/**
 * Options for generating metadata with translations
 */
export interface GenerateMetadataOptions {
  path: string;
  title: TranslatedKeyType;
  category: TranslatedKeyType;
  description: TranslatedKeyType;
  image: string;
  imageAlt: TranslatedKeyType;
  keywords: TranslatedKeyType[];
  additionalMetadata?: Partial<Metadata>;
  generateAlternates?: boolean;
  includeOpenGraph?: boolean;
  includeTwitter?: boolean;
  parent?: Metadata;
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

  const {
    path,
    additionalMetadata = {},
    generateAlternates = true,
    includeOpenGraph = true,
    includeTwitter = true,
  } = options;

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
      site: twitterHandle,
      creator: twitterHandle,
      images: [options.image],
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
