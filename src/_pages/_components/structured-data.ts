/**
 * schema.org JSON-LD for the public site. Rendered with <JsonLd> from
 * next-vibe-ui. Every price, count and date comes from its source of truth
 * (products, free-credit constants, model registry, blog registry), never from
 * copy. No ratings or reviews: we have none to show, so none are claimed.
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { getLanguageFromLocale } from "next-vibe/core/i18n/core/language-utils";
import type { JsonLdNode } from "next-vibe/ui/components/json-ld";

import { GITHUB_REPO_URL } from "@/env/constants";
import { configScopedTranslation } from "@/env/i18n";
import {
  FREE_CREDIT_ALLOWANCE,
  FREE_CREDIT_MAX_TOTAL,
  FREE_CREDIT_SIGNED_IN_TOTAL,
} from "@/products/constants";
import { scopedTranslation as productsScopedTranslation } from "@/products/i18n";
import {
  type Product,
  ProductIds,
  productsRepository,
  SUBSCRIPTION_TIER_PRODUCT_IDS,
} from "@/products/platform-products";

import { scopedTranslation } from "../layout-i18n";
import { scopedTranslation as blogScopedTranslation } from "../story/blog/i18n";
import { getBlogPostCard } from "../story/blog/posts-cards";
import { BLOG_POST_DATES, type BlogPostSlug } from "../story/blog/posts-meta";

const SCHEMA_CONTEXT = "https://schema.org";
const IN_STOCK = "https://schema.org/InStock";
const LICENSE_URLS = [
  "https://opensource.org/licenses/MIT",
  "https://www.gnu.org/licenses/gpl-3.0.html",
];
const SITE_LANGUAGES = ["en", "de", "pl", "fr"];

/** Canonical origin, same source as every page's canonical/hreflang tags. */
function siteBase(locale: CountryLanguage): string {
  const { t: configT } = configScopedTranslation.scopedT(locale);
  return configT("websiteUrl").replace(/\/+$/, "");
}

/** Absolute URL of a locale page, e.g. pageUrl("en-US", "/models"). */
export function pageUrl(locale: CountryLanguage, path: string): string {
  return `${siteBase(locale)}/${locale}${path}`;
}

/** @id of the site Organization node, for seller/publisher references. */
export function organizationId(locale: CountryLanguage): string {
  return `${siteBase(locale)}/#organization`;
}

function buildOrganization(locale: CountryLanguage): JsonLdNode {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const base = siteBase(locale);
  return {
    "@type": "Organization",
    "@id": organizationId(locale),
    name: configT("group.name"),
    url: base,
    logo: `${base}/logo.png`,
    email: configT("emails.support"),
    sameAs: [configT("social.twitterUrl"), configT("social.discordInvite")],
    contactPoint: {
      "@type": "ContactPoint",
      email: configT("emails.support"),
      contactType: t("structuredData.organization.contactPoint.contactType"),
      availableLanguage: [
        t("constants.languages.en"),
        t("constants.languages.de"),
        t("constants.languages.pl"),
        t("constants.languages.fr"),
      ],
    },
  };
}

function offer(
  product: Product,
  fields: {
    name: string;
    description: string;
    url: string;
    seller: JsonLdNode;
    billingDuration?: "P1M" | "P1Y";
  },
): JsonLdNode {
  const base: JsonLdNode = {
    "@type": "Offer",
    name: fields.name,
    description: fields.description,
    price: product.price,
    priceCurrency: product.currency,
    url: fields.url,
    availability: IN_STOCK,
    seller: fields.seller,
  };
  if (fields.billingDuration === undefined) {
    return base;
  }
  return {
    ...base,
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: product.price,
      priceCurrency: product.currency,
      billingDuration: fields.billingDuration,
      unitCode: fields.billingDuration === "P1M" ? "MON" : "ANN",
    },
  };
}

/** Free tier, every monthly plan (+ Starter yearly) and the credit pack
 * (a top-up for subscribers), at the locale's real checkout prices. */
export function buildPlanOffers(
  locale: CountryLanguage,
  modelCount: number,
): JsonLdNode[] {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: productT } = productsScopedTranslation.scopedT(locale);
  const products = productsRepository.getProducts(locale);
  const free = products[ProductIds.FREE_TIER];
  const subscription = products[ProductIds.SUBSCRIPTION];
  const pack = products[ProductIds.CREDIT_PACK];
  const yearly = productsRepository.getProduct(
    ProductIds.SUBSCRIPTION,
    locale,
    "year",
  );
  const url = pageUrl(locale, "/subscription/overview");
  const seller = { "@id": organizationId(locale) };
  const higherTiers = SUBSCRIPTION_TIER_PRODUCT_IDS.filter(
    (id) => id !== ProductIds.SUBSCRIPTION,
  ).map((id) => products[id]);
  return [
    offer(free, {
      name: productT(free.name),
      description: t("structuredData.app.freeOffer", {
        guest: FREE_CREDIT_ALLOWANCE.guest,
        signedIn: FREE_CREDIT_SIGNED_IN_TOTAL,
        max: FREE_CREDIT_MAX_TOTAL,
      }),
      url,
      seller,
    }),
    offer(subscription, {
      name: productT(subscription.name),
      description: productT(subscription.description, {
        subCredits: subscription.credits,
        modelCount,
      }),
      url,
      seller,
      billingDuration: "P1M",
    }),
    offer(yearly, {
      name: t("structuredData.app.yearlyName"),
      description: t("structuredData.app.yearlyDescription", {
        subCredits: yearly.credits,
      }),
      url,
      seller,
      billingDuration: "P1Y",
    }),
    ...higherTiers.map((tier) =>
      offer(tier, {
        name: productT(tier.name),
        description: productT(subscription.description, {
          subCredits: tier.credits,
          modelCount,
        }),
        url,
        seller,
        billingDuration: "P1M",
      }),
    ),
    offer(pack, {
      name: productT(pack.name),
      description: productT(pack.description),
      url,
      seller,
    }),
  ];
}

/**
 * Site-wide graph for the root layout: who runs the site (Organization), the
 * site itself (WebSite) and the product (WebApplication with real offers).
 */
export function buildSiteStructuredData({
  locale,
  modelCount,
  providerCount,
}: {
  locale: CountryLanguage;
  modelCount: number;
  providerCount: number;
}): JsonLdNode {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const base = siteBase(locale);
  const appName = configT("appName");
  const description = t("structuredData.app.description", {
    modelCount,
    providerCount,
  });
  return {
    "@context": SCHEMA_CONTEXT,
    "@graph": [
      buildOrganization(locale),
      {
        "@type": "WebSite",
        "@id": `${base}/#website`,
        name: appName,
        url: base,
        description,
        inLanguage: SITE_LANGUAGES,
        publisher: { "@id": organizationId(locale) },
      },
      {
        "@type": "WebApplication",
        "@id": `${base}/#app`,
        name: appName,
        url: pageUrl(locale, "/story"),
        description,
        applicationCategory: "UtilitiesApplication",
        applicationSubCategory: t("meta.category"),
        operatingSystem: "Web",
        inLanguage: SITE_LANGUAGES,
        isAccessibleForFree: true,
        image: `${base}/og-image.jpg`,
        publisher: { "@id": organizationId(locale) },
        offers: buildPlanOffers(locale, modelCount),
        isBasedOn: {
          "@type": "SoftwareSourceCode",
          codeRepository: GITHUB_REPO_URL,
          programmingLanguage: "TypeScript",
          license: LICENSE_URLS,
        },
      },
    ],
  };
}

/** Pricing page: the plans as one Product with its offers. */
export function buildPricingStructuredData({
  locale,
  modelCount,
}: {
  locale: CountryLanguage;
  modelCount: number;
}): JsonLdNode {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "Product",
    "@id": `${pageUrl(locale, "/subscription/overview")}#product`,
    name: t("structuredData.pricing.name", { appName }),
    description: t("structuredData.pricing.description", { modelCount }),
    url: pageUrl(locale, "/subscription/overview"),
    image: `${siteBase(locale)}/og-image.jpg`,
    brand: { "@type": "Brand", name: appName },
    category: t("meta.category"),
    offers: buildPlanOffers(locale, modelCount),
  };
}

/** BlogPosting + BreadcrumbList for one post (null for an unknown slug). */
export function buildBlogPostStructuredData({
  locale,
  slug,
}: {
  locale: CountryLanguage;
  slug: BlogPostSlug;
}): JsonLdNode | null {
  const card = getBlogPostCard(slug, locale);
  if (card === undefined) {
    return null;
  }
  const { t: blogT } = blogScopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const url = pageUrl(locale, card.path);
  const published = BLOG_POST_DATES[slug];
  return {
    "@context": SCHEMA_CONTEXT,
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: card.title,
        description: card.excerpt,
        articleSection: card.category,
        datePublished: published,
        dateModified: published,
        inLanguage: getLanguageFromLocale(locale),
        url,
        mainEntityOfPage: url,
        author: { "@id": organizationId(locale) },
        publisher: {
          "@type": "Organization",
          "@id": organizationId(locale),
          name: configT("group.name"),
          logo: {
            "@type": "ImageObject",
            url: `${siteBase(locale)}/logo.png`,
          },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: configT("appName"),
            item: pageUrl(locale, "/story"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: blogT("page.title"),
            item: pageUrl(locale, "/story/blog"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: card.title,
            item: url,
          },
        ],
      },
    ],
  };
}

export interface Breadcrumb {
  name: string;
  /** Locale-less path, e.g. "/models". */
  path: string;
}

/**
 * BreadcrumbList for a page under Home ({appName} → /story). `crumbs` lists
 * the levels below Home, the current page last.
 */
export function buildBreadcrumbList(
  locale: CountryLanguage,
  crumbs: readonly Breadcrumb[],
): JsonLdNode {
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const items: Breadcrumb[] = [
    { name: configT("appName"), path: "/story" },
    ...crumbs,
  ];
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: pageUrl(locale, crumb.path),
    })),
  };
}
