/**
 * Guide cards for topic hubs and the "Related guides" block at the end of a
 * post. Titles and excerpts come from the blog card registry, hub copy from
 * the hub pages' own translations, so every link reads the same everywhere.
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Div } from "next-vibe/ui/components/div";
import { ArrowRight } from "next-vibe/ui/components/icons/ArrowRight";
import { Link } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import { H2, H3, P } from "next-vibe/ui/components/typography";
import type { JSX } from "react";

import { scopedTranslation as abliteratedScopedTranslation } from "../abliterated-ai-chat/i18n";
import { scopedTranslation as uncensoredScopedTranslation } from "../uncensored-ai/i18n";
import { scopedTranslation } from "./i18n";
import { type BlogPostCard, getBlogPostCard } from "./posts-cards";
import type { BlogPostSlug } from "./posts-meta";
import { relatedGuides, TOPIC_HUB_PATHS, type TopicHub } from "./topics";

/** Cards for the given posts, in the given order (unknown slugs skipped). */
export function guideCards(
  locale: CountryLanguage,
  slugs: readonly BlogPostSlug[],
): BlogPostCard[] {
  return slugs.flatMap((slug) => {
    const card = getBlogPostCard(slug, locale);
    return card === undefined ? [] : [card];
  });
}

function hubCopy(
  hub: TopicHub,
  locale: CountryLanguage,
): { title: string; description: string } {
  if (hub === "abliterated") {
    const { t } = abliteratedScopedTranslation.scopedT(locale);
    return { title: t("title"), description: t("description") };
  }
  const { t } = uncensoredScopedTranslation.scopedT(locale);
  return { title: t("title"), description: t("description") };
}

function GuideCard({
  href,
  eyebrow,
  title,
  excerpt,
}: {
  href: string;
  eyebrow: string;
  title: string;
  excerpt: string;
}): JSX.Element {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-xl border border-border bg-card p-5 shadow-xs transition-colors hover:border-primary/40"
    >
      <Span className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
        {eyebrow}
      </Span>
      <H3 className="mt-2 text-base font-semibold leading-snug tracking-tight text-balance">
        {title}
      </H3>
      <P className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {excerpt}
      </P>
      <Span className="mt-auto pt-3 text-primary">
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Span>
    </Link>
  );
}

/** Grid of guide cards (hub pages). */
export function GuideCardGrid({
  locale,
  slugs,
}: {
  locale: CountryLanguage;
  slugs: readonly BlogPostSlug[];
}): JSX.Element {
  return (
    <Div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {guideCards(locale, slugs).map((card) => (
        <GuideCard
          key={card.slug}
          href={`/${locale}${card.path}`}
          eyebrow={card.category}
          title={card.title}
          excerpt={card.excerpt}
        />
      ))}
    </Div>
  );
}

/** Hub + sibling guides for the end of a post. */
export function RelatedGuides({
  locale,
  slug,
}: {
  locale: CountryLanguage;
  slug: BlogPostSlug;
}): JSX.Element | null {
  const { t } = scopedTranslation.scopedT(locale);
  const { hub, related } = relatedGuides(slug);
  const cards = guideCards(locale, related);
  if (hub === null && cards.length === 0) {
    return null;
  }
  const hubText = hub === null ? null : hubCopy(hub, locale);
  return (
    <Div className="flex flex-col gap-5">
      <H2 className="border-none pb-0 text-xl font-semibold tracking-tight md:text-2xl">
        {t("labels.relatedGuides")}
      </H2>
      <Div className="grid gap-4 sm:grid-cols-2">
        {hub !== null && hubText !== null && (
          <GuideCard
            href={`/${locale}${TOPIC_HUB_PATHS[hub]}`}
            eyebrow={t("labels.startHere")}
            title={hubText.title}
            excerpt={hubText.description}
          />
        )}
        {cards.map((card) => (
          <GuideCard
            key={card.slug}
            href={`/${locale}${card.path}`}
            eyebrow={card.category}
            title={card.title}
            excerpt={card.excerpt}
          />
        ))}
      </Div>
    </Div>
  );
}
