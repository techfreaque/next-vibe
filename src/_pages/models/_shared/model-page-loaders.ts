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
  findPublicModelId,
  getModelFacts,
  type ModelFacts,
  resolveSuccessor,
} from "./model-facts";
import { mediaUnitText } from "./model-format";
import { findMediaFacts, type MediaModelFacts } from "./model-media-facts";
import {
  bestForContent,
  chatModelBlogSlugs,
  chatModelFaq,
  chatModelMeta,
  findRelatedMediaModels,
  findRelatedModels,
  mediaBestForContent,
  mediaModelBlogSlugs,
  mediaModelFaq,
  mediaModelMeta,
} from "./model-seo";
import type { BlogLink, ModelSeoContent } from "./model-seo-sections";
import {
  buildChatModelStructuredData,
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
    permanentRedirect(`/${locale}/models/compare/${left.slug}/${right.slug}`);
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
  return {
    seo: {
      bestFor: bestForContent(facts, locale),
      related: findRelatedModels(facts, availability),
      faq: chatModelFaq(facts, locale),
      blog: blogLinks(chatModelBlogSlugs(facts), locale),
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
