/**
 * schema.org JSON-LD for the public site. Rendered with <JsonLd> from
 * next-vibe-ui. Every price, count and date comes from its source of truth
 * (products, free-credit constants, model registry, blog registry), never from
 * copy. No ratings or reviews: we have none to show, so none are claimed.
 * That is also why the product is a Service, not a SoftwareApplication /
 * WebApplication: Google's Software App rich result requires aggregateRating
 * or review, so an app node without them is reported as an invalid item.
 */

import {
  type CountryLanguage,
  LanguagesArr,
} from "next-vibe/core/i18n/core/config";
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
import { type BreadcrumbEntry, withHomeBreadcrumb } from "./breadcrumbs";

const SCHEMA_CONTEXT = "https://schema.org";
const IN_STOCK = "https://schema.org/InStock";
const LICENSE_URLS = [
  "https://opensource.org/licenses/MIT",
  "https://www.gnu.org/licenses/gpl-3.0.html",
];
const SITE_LANGUAGES = [...LanguagesArr];

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

/** @id of the site WebSite node (root layout graph), for isPartOf references. */
export function websiteId(locale: CountryLanguage): string {
  return `${siteBase(locale)}/#website`;
}

/** Default share image (public/og-image.jpg), real size 1200x630. */
export function defaultImage(locale: CountryLanguage): JsonLdNode {
  return {
    "@type": "ImageObject",
    url: `${siteBase(locale)}/og-image.jpg`,
    width: 1200,
    height: 630,
  };
}

/**
 * Self-contained Organization node for author/publisher fields. Google's
 * Article validator wants author.name and publisher.name inline; the shared
 * @id keeps it the same entity as the site graph's Organization.
 */
export function organizationNode(locale: CountryLanguage): JsonLdNode {
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const base = siteBase(locale);
  return {
    "@type": "Organization",
    "@id": organizationId(locale),
    name: configT("group.name"),
    url: base,
    logo: {
      "@type": "ImageObject",
      url: `${base}/logo.png`,
      width: 512,
      height: 512,
    },
  };
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
    logo: {
      "@type": "ImageObject",
      url: `${base}/logo.png`,
      width: 512,
      height: 512,
    },
    email: configT("emails.support"),
    sameAs: [
      configT("social.twitterUrl"),
      configT("social.discordInvite"),
      GITHUB_REPO_URL,
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: configT("emails.support"),
      contactType: t("structuredData.organization.contactPoint.contactType"),
      availableLanguage: LanguagesArr.map((language) =>
        configT(`languages.${language}`),
      ),
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
 * site itself (WebSite), the product (Service with real offers) and the open
 * source code it runs on (SoftwareSourceCode).
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
        "@type": "Service",
        "@id": `${base}/#app`,
        name: appName,
        url: pageUrl(locale, "/story"),
        description,
        serviceType: t("meta.category"),
        availableLanguage: SITE_LANGUAGES,
        image: defaultImage(locale),
        provider: { "@id": organizationId(locale) },
        offers: buildPlanOffers(locale, modelCount),
      },
      {
        "@type": "SoftwareSourceCode",
        "@id": `${base}/#source`,
        name: appName,
        codeRepository: GITHUB_REPO_URL,
        programmingLanguage: "TypeScript",
        license: LICENSE_URLS,
        author: { "@id": organizationId(locale) },
      },
    ],
  };
}

/** Pricing page: digital service plans and credit offers. */
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
  const url = pageUrl(locale, "/subscription/overview");
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "Service",
    "@id": `${url}#service`,
    name: t("structuredData.pricing.name", { appName }),
    description: t("structuredData.pricing.description", { modelCount }),
    url,
    image: defaultImage(locale),
    provider: { "@id": organizationId(locale) },
    serviceType: t("meta.category"),
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
  const url = pageUrl(locale, card.path);
  const author = organizationNode(locale);
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
        image: defaultImage(locale),
        author,
        publisher: author,
        isPartOf: { "@id": websiteId(locale) },
      },
      buildBreadcrumbList(
        locale,
        blogPostBreadcrumbs(locale, { name: card.title, path: card.path }),
      ),
    ],
  };
}

/** The shared section and leaf shown in a blog post's trails. */
export function blogPostBreadcrumbs(
  locale: CountryLanguage,
  post: BreadcrumbEntry,
): BreadcrumbEntry[] {
  const { t } = blogScopedTranslation.scopedT(locale);
  return [{ name: t("page.title"), path: "/story/blog" }, post];
}

/** Ordered public links shown by a directory or index page. */
export function buildItemList(
  locale: CountryLanguage,
  entries: readonly BreadcrumbEntry[],
): JsonLdNode {
  return {
    "@type": "ItemList",
    itemListElement: entries.map(({ name, path }, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      url: pageUrl(locale, path),
    })),
  };
}

/** `crumbs` lists the levels below the locale root, with the current page last. */
export function buildBreadcrumbList(
  locale: CountryLanguage,
  crumbs: readonly BreadcrumbEntry[],
): JsonLdNode {
  return {
    "@type": "BreadcrumbList",
    itemListElement: withHomeBreadcrumb(locale, crumbs).map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: pageUrl(locale, crumb.path),
    })),
  };
}
