/**
 * schema.org JSON-LD for the public /models pages: a digital Service with
 * per-locale offers and a BreadcrumbList. Prices come from the model registry
 * and the credit pack's checkout price, as on the pricing page.
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JsonLdNode } from "next-vibe/ui/components/json-ld";

import { getCreditUnitPrice } from "@/products/credit-money";

import {
  buildBreadcrumbList,
  organizationId,
  pageUrl,
} from "../../_components/structured-data";
import { scopedTranslation } from "../i18n";
import type { ModelFacts } from "./model-facts";
import { tierPriceText } from "./model-format";
import type { MediaModelFacts } from "./model-media-facts";

const SCHEMA_CONTEXT = "https://schema.org";
const IN_STOCK = "https://schema.org/InStock";
const TOKENS_PER_PRICE_UNIT = 1_000_000;

/** Credits → money in the locale's checkout currency, 6 decimals (per-message prices are tiny). */
function creditsToPrice(credits: number, locale: CountryLanguage): number {
  const { amount } = getCreditUnitPrice(locale);
  return Math.round(credits * amount * 1_000_000) / 1_000_000;
}

function unitPrice(
  locale: CountryLanguage,
  credits: number,
  quantity: number,
  unitText: string,
): JsonLdNode {
  const { currency } = getCreditUnitPrice(locale);
  return {
    "@type": "UnitPriceSpecification",
    price: creditsToPrice(credits, locale),
    priceCurrency: currency,
    referenceQuantity: {
      "@type": "QuantitativeValue",
      value: quantity,
      unitText,
    },
  };
}

function modelOffer(
  locale: CountryLanguage,
  url: string,
  credits: number,
  priceSpecification: JsonLdNode[],
): JsonLdNode {
  const { currency } = getCreditUnitPrice(locale);
  return {
    "@type": "Offer",
    price: creditsToPrice(credits, locale),
    priceCurrency: currency,
    availability: IN_STOCK,
    url,
    seller: { "@id": organizationId(locale) },
    priceSpecification,
  };
}

interface ServiceInput {
  path: string;
  name: string;
  description: string;
  labName: string;
  category: string;
  offer: JsonLdNode | null;
}

function serviceNode(
  locale: CountryLanguage,
  { path, name, description, labName, category, offer }: ServiceInput,
): JsonLdNode {
  const url = pageUrl(locale, path);
  const service: JsonLdNode = {
    "@type": "Service",
    "@id": `${url}#service`,
    name,
    description,
    url,
    brand: { "@type": "Brand", name: labName },
    provider: { "@id": organizationId(locale) },
    serviceType: category,
  };
  return offer === null ? service : { ...service, offers: offer };
}

function modelGraph(locale: CountryLanguage, input: ServiceInput): JsonLdNode {
  const { t } = scopedTranslation.scopedT(locale);
  return {
    "@context": SCHEMA_CONTEXT,
    "@graph": [
      serviceNode(locale, input),
      buildBreadcrumbList(locale, [
        { name: t("breadcrumb.models"), path: "/models" },
        { name: input.name, path: input.path },
      ]),
    ],
  };
}

/** The Service node (with offers) for a chat model, keyed by its model page. */
function chatModelService(
  facts: ModelFacts,
  locale: CountryLanguage,
  description: string,
): JsonLdNode {
  const { t } = scopedTranslation.scopedT(locale);
  const path = `/models/${facts.slug}`;
  const specs: JsonLdNode[] = [
    unitPrice(locale, facts.creditsPerMessage, 1, t("jsonLd.perMessage")),
  ];
  if (facts.tokenPrice !== null) {
    specs.push(
      unitPrice(
        locale,
        facts.tokenPrice.inputCredits,
        TOKENS_PER_PRICE_UNIT,
        t("jsonLd.perInputTokens"),
      ),
      unitPrice(
        locale,
        facts.tokenPrice.outputCredits,
        TOKENS_PER_PRICE_UNIT,
        t("jsonLd.perOutputTokens"),
      ),
    );
    if (facts.tokenPrice.cacheReadCredits !== null) {
      specs.push(
        unitPrice(
          locale,
          facts.tokenPrice.cacheReadCredits,
          TOKENS_PER_PRICE_UNIT,
          t("jsonLd.perCacheReadTokens"),
        ),
      );
    }
    if (facts.tokenPrice.cacheWrite1hCredits !== null) {
      specs.push(
        unitPrice(
          locale,
          facts.tokenPrice.cacheWrite1hCredits,
          TOKENS_PER_PRICE_UNIT,
          t("jsonLd.perCacheWrite1hTokens"),
        ),
      );
    }
    if (facts.tokenPrice.cacheWriteCredits !== null) {
      specs.push(
        unitPrice(
          locale,
          facts.tokenPrice.cacheWriteCredits,
          TOKENS_PER_PRICE_UNIT,
          t("jsonLd.perCacheWriteTokens"),
        ),
      );
    }
  }
  return serviceNode(locale, {
    path,
    name: facts.name,
    description,
    labName: facts.labName,
    category: t("catalog.types.text"),
    offer: {
      ...modelOffer(
        locale,
        pageUrl(locale, path),
        facts.creditsPerMessage,
        specs,
      ),
      ...(facts.pricingTiers.length
        ? { description: tierPriceText(facts, locale, t) }
        : {}),
    },
  });
}

/** Service + BreadcrumbList for a chat model page. */
export function buildChatModelStructuredData(
  facts: ModelFacts,
  locale: CountryLanguage,
  description: string,
): JsonLdNode {
  const { t } = scopedTranslation.scopedT(locale);
  const path = `/models/${facts.slug}`;
  return {
    "@context": SCHEMA_CONTEXT,
    "@graph": [
      chatModelService(facts, locale, description),
      buildBreadcrumbList(locale, [
        { name: t("breadcrumb.models"), path: "/models" },
        { name: facts.name, path },
      ]),
    ],
  };
}

/** Service + BreadcrumbList for an image/video/music/voice model page. */
export function buildMediaModelStructuredData(
  facts: MediaModelFacts,
  locale: CountryLanguage,
  description: string,
  unitText: string | null,
): JsonLdNode {
  const { t } = scopedTranslation.scopedT(locale);
  const path = `/models/${facts.slug}`;
  const offer =
    facts.price === null || unitText === null
      ? null
      : modelOffer(locale, pageUrl(locale, path), facts.price.credits, [
          unitPrice(locale, facts.price.credits, 1, unitText),
        ]);
  return modelGraph(locale, {
    path,
    name: facts.name,
    description,
    labName: facts.labName,
    category: t(`catalog.types.${facts.type}`),
    offer,
  });
}

/**
 * Compare page: one Service per model (same @id as on its model page, so
 * both pages describe the same entity) + BreadcrumbList Home > Models > A vs B.
 */
export function buildCompareStructuredData(
  locale: CountryLanguage,
  name: string,
  path: string,
  models: readonly { facts: ModelFacts; description: string }[],
): JsonLdNode {
  const { t } = scopedTranslation.scopedT(locale);
  return {
    "@context": SCHEMA_CONTEXT,
    "@graph": [
      ...models.map(({ facts, description }) =>
        chatModelService(facts, locale, description),
      ),
      buildBreadcrumbList(locale, [
        { name: t("breadcrumb.models"), path: "/models" },
        { name, path },
      ]),
    ],
  };
}
