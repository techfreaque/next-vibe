import type { Metadata } from "next";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Div } from "next-vibe/ui/components/div";
import { ArrowRight } from "next-vibe/ui/components/icons/ArrowRight";
import { BookOpen } from "next-vibe/ui/components/icons/BookOpen";
import { Calendar } from "next-vibe/ui/components/icons/Calendar";
import { Clock } from "next-vibe/ui/components/icons/Clock";
import { Mail } from "next-vibe/ui/components/icons/Mail";
import { Link } from "next-vibe/ui/components/link";
import { Section } from "next-vibe/ui/components/section";
import { Span } from "next-vibe/ui/components/span";
import { H2, H3, P } from "next-vibe/ui/components/typography";
import type { JSX } from "react";

import { FEEDBACK_REWARD_CREDITS } from "@/credits/constants";
import { configScopedTranslation } from "@/env/i18n";

import { CONTAINER, Cta, CtaBand, PageHero } from "../_shared/marketing";
import { scopedTranslation } from "./i18n";
import { type BlogPostSlug, formatPostDate } from "./posts-meta";

export const revalidate = 3600;

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
    image:
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2070",
    imageAlt: t("page.meta.imageAlt", { appName }),
    keywords: [t("page.meta.keywords", { appName })],
  });
};

export interface BlogIndexPageData {
  locale: CountryLanguage;
}

export async function tanstackLoader({
  params,
}: Props): Promise<BlogIndexPageData> {
  const { locale } = await params;
  return { locale };
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

export function TanstackPage({ locale }: BlogIndexPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  const credits = FEEDBACK_REWARD_CREDITS;

  const post = (
    slug: BlogPostSlug,
    content: Omit<BlogCardData, "href" | "date">,
  ): BlogCardData => ({
    href: `/${locale}/story/blog/${slug}`,
    date: formatPostDate(slug, locale),
    ...content,
  });

  // Newest first; product updates lead, deep dives and referral guides follow.
  const posts: BlogCardData[] = [
    post("unbottled-api-in-coding-tools", {
      title: t("posts.codingTools.title"),
      category: t("posts.codingTools.category"),
      excerpt: t("posts.codingTools.excerpt"),
      readTime: t("posts.codingTools.readTime"),
    }),
    post("uncensored-models-what-each-is-good-at", {
      title: t("posts.uncensoredGuide.title"),
      category: t("posts.uncensoredGuide.category"),
      excerpt: t("posts.uncensoredGuide.excerpt"),
      readTime: t("posts.uncensoredGuide.readTime"),
    }),
    post("model-refresh-uncensored-providers", {
      title: t("posts.modelRefresh.title"),
      category: t("posts.modelRefresh.category"),
      excerpt: t("posts.modelRefresh.excerpt"),
      readTime: t("posts.modelRefresh.readTime"),
    }),
    post("whats-new-november-2026", {
      title: t("posts.whatsNewNovember2026.title"),
      category: t("posts.whatsNewNovember2026.category"),
      excerpt: t("posts.whatsNewNovember2026.excerpt"),
      readTime: t("posts.whatsNewNovember2026.readTime"),
    }),
    post("hermes-thea-two-way-remote", {
      title: t("posts.hermesThea.title"),
      category: t("posts.hermesThea.category"),
      excerpt: t("posts.hermesThea.excerpt"),
      readTime: t("posts.hermesThea.readTime"),
    }),
    post("interactive-coding-agent", {
      title: t("posts.codingAgent.title"),
      category: t("posts.codingAgent.category"),
      excerpt: t("posts.codingAgent.excerpt"),
      readTime: t("posts.codingAgent.readTime"),
    }),
    post("e2e-tests-found-real-bugs", {
      title: t("posts.e2eTests.title"),
      category: t("posts.e2eTests.category"),
      excerpt: t("posts.e2eTests.excerpt"),
      readTime: t("posts.e2eTests.readTime"),
    }),
    post("whats-new-may-2026", {
      title: t("posts.whatsNewMay2026.title"),
      category: t("posts.whatsNewMay2026.category"),
      excerpt: t("posts.whatsNewMay2026.excerpt", { credits }),
      readTime: t("posts.whatsNewMay2026.readTime"),
    }),
    post("whats-new-april-2026", {
      title: t("posts.whatsNewApril2026.title"),
      category: t("posts.whatsNewApril2026.category"),
      excerpt: t("posts.whatsNewApril2026.excerpt"),
      readTime: t("posts.whatsNewApril2026.readTime"),
    }),
    post("one-endpoint-every-surface", {
      title: t("posts.oneEndpoint.title"),
      category: t("posts.oneEndpoint.category"),
      excerpt: t("posts.oneEndpoint.excerpt"),
      readTime: t("posts.oneEndpoint.readTime"),
    }),
    post("skill-sharing-economy", {
      title: t("posts.skillSharingEconomy.title"),
      category: t("posts.skillSharingEconomy.category"),
      excerpt: t("posts.skillSharingEconomy.excerpt"),
      readTime: t("posts.skillSharingEconomy.readTime"),
    }),
    post("one-codebase-13-platforms", {
      title: t("posts.oneCodebase.title"),
      category: t("posts.oneCodebase.category"),
      excerpt: t("posts.oneCodebase.excerpt"),
      readTime: t("posts.oneCodebase.readTime"),
    }),
    post("type-checker-made-ai-stop-lying", {
      title: t("posts.typeChecker.title"),
      category: t("posts.typeChecker.category"),
      excerpt: t("posts.typeChecker.excerpt"),
      readTime: t("posts.typeChecker.readTime"),
    }),
    post("dead-trading-bot-to-monitoring-engine", {
      title: t("posts.tradingBot.title"),
      category: t("posts.tradingBot.category"),
      excerpt: t("posts.tradingBot.excerpt"),
      readTime: t("posts.tradingBot.readTime"),
    }),
    post("referral-for-beginners", {
      title: t("posts.referralBeginners.title"),
      category: t("posts.referralBeginners.category"),
      excerpt: t("posts.referralBeginners.excerpt"),
      readTime: t("posts.referralBeginners.readTime"),
    }),
    post("referral-for-developers", {
      title: t("posts.referralDevelopers.title"),
      category: t("posts.referralDevelopers.category"),
      excerpt: t("posts.referralDevelopers.excerpt"),
      readTime: t("posts.referralDevelopers.readTime"),
    }),
    post("referral-for-affiliate-pros", {
      title: t("posts.referralAffiliatePros.title"),
      category: t("posts.referralAffiliatePros.category"),
      excerpt: t("posts.referralAffiliatePros.excerpt"),
      readTime: t("posts.referralAffiliatePros.readTime"),
    }),
    {
      href: `/${locale}/story/earn`,
      date: undefined,
      title: t("posts.referralLanding.title"),
      category: t("posts.referralLanding.category"),
      excerpt: t("posts.referralLanding.excerpt"),
      readTime: t("posts.referralLanding.readTime"),
    },
  ];

  const [featured, ...rest] = posts;
  const readMore = t("labels.readMore");

  return (
    <Div className="min-h-screen bg-background">
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
          <Div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {rest.map((item) => (
              <PostCard key={item.href} post={item} readMore={readMore} />
            ))}
          </Div>
        </Div>
      </Section>

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
    </Div>
  );
}

export default async function BlogIndexPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
