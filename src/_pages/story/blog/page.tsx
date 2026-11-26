import type { Metadata } from "next";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { AuthRepository } from "next-vibe/identity/auth/repository";
import { UserRole } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";
import { Platform } from "next-vibe/platforms/platforms";
import { Div } from "next-vibe/ui/components/div";
import { ArrowRight } from "next-vibe/ui/components/icons/ArrowRight";
import { BookOpen } from "next-vibe/ui/components/icons/BookOpen";
import { Calendar } from "next-vibe/ui/components/icons/Calendar";
import { Clock } from "next-vibe/ui/components/icons/Clock";
import { Mail } from "next-vibe/ui/components/icons/Mail";
import { JsonLd } from "next-vibe/ui/components/json-ld";
import { Link } from "next-vibe/ui/components/link";
import { Section } from "next-vibe/ui/components/section";
import { Span } from "next-vibe/ui/components/span";
import { H2, H3, P } from "next-vibe/ui/components/typography";
import type { JSX } from "react";

import { configScopedTranslation } from "@/env/i18n";
import { NewsletterStatusRepository } from "@/newsletter/status/repository";

import {
  buildBreadcrumbList,
  buildItemList,
} from "../../_components/structured-data";
import { CONTAINER, Cta, CtaBand, PageHero } from "../_shared/marketing";
import { formatCompareDate } from "../compare/_shared/compare-data";
import {
  COMPARE_CHECKED_DATE,
  COMPARE_HUB_PATH,
} from "../compare/_shared/platforms";
import { scopedTranslation as compareScopedTranslation } from "../compare/i18n";
import { scopedTranslation } from "./i18n";
import { type BlogPostCard, listBlogPostCards } from "./posts-cards";
import { BLOG_TOPICS, POST_TOPICS } from "./topics";

// Per-visitor newsletter CTA (the story layout is force-dynamic anyway)
export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { locale } = await params;
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  return metadataGenerator(locale, {
    path: "story/blog",
    title: t("page.meta.title", { appName }),
    category: t("page.meta.category"),
    description: t("page.meta.description", { appName }),
    imageAlt: t("page.meta.imageAlt", { appName }),
    keywords: [t("page.meta.keywords", { appName })],
  });
};

export interface BlogIndexPageData {
  locale: CountryLanguage;
  /** Visitor is on the newsletter list (confirmed or pending): no signup CTA */
  onNewsletterList: boolean;
}

export async function tanstackLoader({
  params,
}: Props): Promise<BlogIndexPageData> {
  const { locale } = await params;
  const logger = createEndpointLogger(false, locale);
  const user = await AuthRepository.getAuthMinimalUser(
    [UserRole.PUBLIC, UserRole.CUSTOMER],
    { platform: Platform.NEXT_PAGE, locale },
    logger,
  );
  const newsletterStatus = await NewsletterStatusRepository.getOwnStatusSafe(
    user,
    logger,
  );
  return {
    locale,
    onNewsletterList: newsletterStatus?.subscribed === true,
  };
}

interface BlogCardData {
  href: string;
  title: string;
  category: string;
  excerpt: string;
  readTime: string;
  date: string | undefined;
}

function PostMeta({ post }: { post: BlogCardData }): JSX.Element {
  return (
    <Div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
      <Span className="rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 font-semibold text-primary">
        {post.category}
      </Span>
      {post.date !== undefined && (
        <Span className="inline-flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {post.date}
        </Span>
      )}
      <Span className="inline-flex items-center gap-1">
        <Clock className="h-3 w-3" />
        {post.readTime}
      </Span>
    </Div>
  );
}

function FeaturedPostCard({
  post,
  readMore,
}: {
  post: BlogCardData;
  readMore: string;
}): JSX.Element {
  return (
    <Link
      href={post.href}
      className="group block rounded-2xl border border-border bg-card p-6 shadow-xs transition-colors hover:border-primary/40 md:p-10"
    >
      <PostMeta post={post} />
      <H2 className="mt-4 max-w-3xl border-none pb-0 text-2xl font-semibold tracking-tight text-balance md:text-4xl">
        {post.title}
      </H2>
      <P className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
        {post.excerpt}
      </P>
      <Span className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary">
        {readMore}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Span>
    </Link>
  );
}

function PostCard({
  post,
  readMore,
}: {
  post: BlogCardData;
  readMore: string;
}): JSX.Element {
  return (
    <Link
      href={post.href}
      className="group flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-xs transition-colors hover:border-primary/40"
    >
      <PostMeta post={post} />
      <H3 className="mt-4 text-lg font-semibold leading-snug tracking-tight text-balance">
        {post.title}
      </H3>
      <P className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {post.excerpt}
      </P>
      <Span className="mt-auto inline-flex min-h-11 items-center gap-1.5 pt-4 text-sm font-medium text-primary">
        {readMore}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Span>
    </Link>
  );
}

export function TanstackPage({
  locale,
  onNewsletterList,
}: BlogIndexPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");

  const { t: compareT } = compareScopedTranslation.scopedT(locale);
  const postCards = listBlogPostCards(locale);
  const toCardData = (card: BlogPostCard): BlogCardData => ({
    href: `/${locale}${card.path}`,
    date: card.date,
    title: card.title,
    category: card.category,
    excerpt: card.excerpt,
    readTime: card.readTime,
  });
  const [newest, ...older] = postCards;
  const featured = newest === undefined ? undefined : toCardData(newest);
  // The platform comparison is a standing page, not a dated post: it leads
  // the uncensored section. The referral landing closes the referral one.
  const compareCard: BlogCardData = {
    href: `/${locale}${COMPARE_HUB_PATH}`,
    date: formatCompareDate(COMPARE_CHECKED_DATE, locale),
    title: compareT("links.hub"),
    category: compareT("common.category"),
    excerpt: compareT("links.hubDesc"),
    readTime: compareT("hub.hero.readTime"),
  };
  const earnCard: BlogCardData = {
    href: `/${locale}/story/earn`,
    date: undefined,
    title: t("posts.referralLanding.title"),
    category: t("posts.referralLanding.category"),
    excerpt: t("posts.referralLanding.excerpt"),
    readTime: t("posts.referralLanding.readTime"),
  };
  // Newest first inside each topic; the featured post is not repeated.
  const sections = BLOG_TOPICS.map((topic) => {
    const posts = older
      .filter((card) => POST_TOPICS[card.slug] === topic)
      .map(toCardData);
    return {
      topic,
      posts:
        topic === "uncensored"
          ? [compareCard, ...posts]
          : topic === "referral"
            ? [...posts, earnCard]
            : posts,
    };
  }).filter((section) => section.posts.length > 0);

  const readMore = t("labels.readMore");

  return (
    <Div className="min-h-screen bg-background">
      <JsonLd
        id="blog-index-structured-data"
        data={{
          "@context": "https://schema.org",
          "@graph": [
            buildBreadcrumbList(locale, [
              { name: t("page.title"), path: "/story/blog" },
            ]),
            buildItemList(
              locale,
              postCards.map(({ title, path }) => ({ name: title, path })),
            ),
          ],
        }}
      />
      <PageHero
        eyebrow={t("labels.allPosts")}
        eyebrowIcon={BookOpen}
        title={t("page.title")}
        subtitle={t("page.subtitle", { appName })}
      />

      <Section className="py-12 md:py-20">
        <Div className={CONTAINER}>
          {featured !== undefined && (
            <Div className="mb-12 md:mb-16">
              <Span className="mb-4 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {t("labels.featured")}
              </Span>
              <FeaturedPostCard post={featured} readMore={readMore} />
            </Div>
          )}
          <Div className="flex flex-col gap-14 md:gap-20">
            {sections.map(({ topic, posts }) => (
              <Section key={topic} id={topic} className="scroll-mt-20">
                <H2 className="border-none pb-0 text-2xl font-semibold tracking-tight md:text-3xl">
                  {t(`topics.${topic}.title`)}
                </H2>
                <P className="mt-2 max-w-2xl text-base leading-relaxed text-muted-foreground">
                  {t(`topics.${topic}.intro`)}
                </P>
                <Div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
                  {posts.map((item) => (
                    <PostCard key={item.href} post={item} readMore={readMore} />
                  ))}
                </Div>
              </Section>
            ))}
          </Div>
        </Div>
      </Section>

      {onNewsletterList ? (
        <CtaBand
          title={t("cta.subscribedTitle")}
          subtitle={t("cta.subscribedSubtitle")}
          actions={
            <Cta
              href={`/${locale}/story/framework`}
              label={t("cta.framework")}
            />
          }
        />
      ) : (
        <CtaBand
          title={t("cta.title")}
          subtitle={t("cta.subtitle")}
          actions={
            <>
              <Cta
                href={`/${locale}/story/newsletter`}
                label={t("cta.newsletter")}
                icon={Mail}
              />
              <Cta
                href={`/${locale}/story/framework`}
                label={t("cta.framework")}
                variant="secondary"
              />
            </>
          }
        />
      )}
    </Div>
  );
}

export default async function BlogIndexPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
