/**
 * Server-side helpers for the /models page loaders and metadata: alias and
 * unavailable-model redirects, URL resolution and the SEO content each page
 * gets. Kept out of the page.tsx files on purpose: the TanStack client build
 * strips only the exported loader/metadata functions from a page and keeps
 * every import a remaining local helper references, so a redirect helper
 * living in page.tsx would pull the server-only redirect module (and the
 * blog/products registries) into the browser bundle.
 */

import type { AgentEnvAvailability } from "next-vibe/agent/env-availability";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JsonLdNode } from "next-vibe/ui/components/json-ld";
import { permanentRedirect } from "next-vibe/ui/lib/redirect";

import { getBlogPostCard } from "../../story/blog/posts-cards";
import type { BlogPostSlug } from "../../story/blog/posts-meta";
import { scopedTranslation } from "../i18n";
import {
  compareFaq,
  type CompareLink,
  compareReadMore,
  type CompareVerdict,
  compareVerdict,
  moreComparisons,
} from "./model-compare";
import {
  canonicalComparisonPath,
  findPublicModelId,
  getModelFacts,
  type ModelFacts,
  resolveSuccessor,
  suggestComparisons,
} from "./model-facts";
import { mediaUnitText } from "./model-format";
import { findMediaFacts, type MediaModelFacts } from "./model-media-facts";
import {
  bestForContent,
  chatModelBlogSlugs,
  chatModelFaq,
  chatModelLanding,
  chatModelMeta,
  chatPlanPricing,
  findRelatedMediaModels,
  findRelatedModels,
  mediaBestForContent,
  mediaModelBlogSlugs,
  mediaModelFaq,
  mediaModelMeta,
  mediaPlanPricing,
  type ModelLandingKey,
  nearestRows,
} from "./model-seo";
import type { BlogLink, ModelSeoContent } from "./model-seo-sections";
import {
  buildChatModelStructuredData,
  buildCompareStructuredData,
  buildMediaModelStructuredData,
} from "./model-structured-data";

/**
 * Facts for an available chat model. A known model whose providers have no
 * API key configured here 308s to its available successor; without one the
 * caller falls through to the media lookup and then 404s.
 */
export function resolveModelFacts(
  locale: CountryLanguage,
  modelId: string,
  availability: AgentEnvAvailability,
): ModelFacts | null {
  const id = findPublicModelId(modelId);
  if (id === null) {
    return null;
  }
  const facts = getModelFacts(id, availability);
  const target = facts ?? resolveSuccessor(id, availability);
  if (target !== null && target.slug !== modelId) {
    permanentRedirect(`/${locale}/models/${target.slug}`);
  }
  return facts;
}

export function resolveMediaModelFacts(
  locale: CountryLanguage,
  modelId: string,
  availability: AgentEnvAvailability,
): MediaModelFacts | null {
  const facts = findMediaFacts(modelId, availability);
  if (facts !== null && facts.slug !== modelId) {
    permanentRedirect(`/${locale}/models/${facts.slug}`);
  }
  return facts;
}

/** Resolve two distinct, available models and normalize aliases on either side. */
export function resolveComparePair(
  locale: CountryLanguage,
  a: string,
  b: string,
  availability: AgentEnvAvailability,
): { left: ModelFacts; right: ModelFacts } | null {
  const leftId = findPublicModelId(a);
  const rightId = findPublicModelId(b);
  if (leftId === null || rightId === null || leftId === rightId) {
    return null;
  }
  const left = getModelFacts(leftId, availability);
  const right = getModelFacts(rightId, availability);
  if (left === null || right === null) {
    return null;
  }
  if (left.slug !== a || right.slug !== b) {
    permanentRedirect(`/${locale}${canonicalComparisonPath(left, right)}`);
  }
  return { left, right };
}

function blogLinks(
  slugs: readonly BlogPostSlug[],
  locale: CountryLanguage,
): BlogLink[] {
  const links: BlogLink[] = [];
  for (const slug of slugs) {
    const card = getBlogPostCard(slug, locale);
    if (card !== undefined) {
      links.push({ path: card.path, title: card.title, excerpt: card.excerpt });
    }
  }
  return links;
}

const LANDING_PATHS: Record<ModelLandingKey, string> = {
  uncensored: "/story/uncensored-ai",
  abliterated: "/story/abliterated-ai-chat",
};

/** The landing page for an uncensored model's kind, as a read-more card. */
function landingLink(
  key: ModelLandingKey | null,
  locale: CountryLanguage,
): BlogLink[] {
  if (key === null) {
    return [];
  }
  const { t } = scopedTranslation.scopedT(locale);
  return [
    {
      path: LANDING_PATHS[key],
      title: t(`readMore.landings.${key}.title`),
      excerpt: t(`readMore.landings.${key}.excerpt`),
    },
  ];
}

export interface ModelPageSeo {
  seo: ModelSeoContent;
  /** Service + BreadcrumbList JSON-LD. */
  structuredData: JsonLdNode;
}

export function buildChatModelPageSeo(
  facts: ModelFacts,
  locale: CountryLanguage,
  availability: AgentEnvAvailability,
): ModelPageSeo {
  const related = findRelatedModels(facts, availability);
  const nearest = suggestComparisons(facts, availability).flatMap((ref) => {
    const other = getModelFacts(ref.id, availability);
    return other === null ? [] : [other];
  });
  return {
    seo: {
      bestFor: bestForContent(facts, locale),
      plans: chatPlanPricing(facts, locale),
      nearest: nearestRows(facts, nearest, locale),
      related,
      faq: chatModelFaq(facts, locale, related, nearest),
      blog: [
        ...landingLink(chatModelLanding(facts), locale),
        ...blogLinks(chatModelBlogSlugs(facts), locale),
      ],
    },
    structuredData: buildChatModelStructuredData(
      facts,
      locale,
      chatModelMeta(facts, locale).description,
    ),
  };
}

export function buildMediaModelPageSeo(
  facts: MediaModelFacts,
  locale: CountryLanguage,
  availability: AgentEnvAvailability,
): ModelPageSeo {
  const { t } = scopedTranslation.scopedT(locale);
  return {
    seo: {
      bestFor: mediaBestForContent(facts, locale),
      plans: mediaPlanPricing(facts, locale),
      nearest: [],
      related: findRelatedMediaModels(facts, availability),
      faq: mediaModelFaq(facts, locale),
      blog: blogLinks(mediaModelBlogSlugs(facts), locale),
    },
    structuredData: buildMediaModelStructuredData(
      facts,
      locale,
      mediaModelMeta(facts, locale).description,
      facts.price === null ? null : mediaUnitText(facts.price, t),
    ),
  };
}

export interface ComparePageSeo {
  verdict: CompareVerdict;
  /** Other comparisons of the left / right model (canonical URLs). */
  moreLeft: CompareLink[];
  moreRight: CompareLink[];
  /** FAQ + read-more cards, rendered by ModelSeoSections. */
  seo: ModelSeoContent;
  /** Service per model + BreadcrumbList JSON-LD. */
  structuredData: JsonLdNode;
}

export function buildComparePageSeo(
  left: ModelFacts,
  right: ModelFacts,
  locale: CountryLanguage,
  availability: AgentEnvAvailability,
): ComparePageSeo {
  const { t } = scopedTranslation.scopedT(locale);
  const readMore = compareReadMore(left, right);
  return {
    verdict: compareVerdict(left, right, locale),
    moreLeft: moreComparisons(left, right, availability),
    moreRight: moreComparisons(right, left, availability),
    seo: {
      bestFor: null,
      plans: null,
      nearest: [],
      related: [],
      faq: compareFaq(left, right, locale),
      blog: [
        ...readMore.landings.flatMap((key) => landingLink(key, locale)),
        ...blogLinks(readMore.posts, locale),
      ],
    },
    structuredData: buildCompareStructuredData(
      locale,
      t("compare.title", { a: left.name, b: right.name }),
      canonicalComparisonPath(left, right),
      [left, right].map((facts) => ({
        facts,
        description: chatModelMeta(facts, locale).description,
      })),
    ),
  };
}
