import type { Metadata } from "next";
import { Badge } from "next-vibe-ui/ui/badge";
import { Card, CardContent, CardHeader } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowRight } from "next-vibe-ui/ui/icons/ArrowRight";
import { BookOpen } from "next-vibe-ui/ui/icons/BookOpen";
import { Clock } from "next-vibe-ui/ui/icons/Clock";
import { Link } from "next-vibe-ui/ui/link";
import { Separator } from "next-vibe-ui/ui/separator";
import { Span } from "next-vibe-ui/ui/span";
import { H1, H2, H3, P } from "next-vibe-ui/ui/typography";
import type { JSX, ReactNode } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";

import { scopedTranslation } from "./i18n";

export const revalidate = 3600;

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { locale } = await params;
  const { t } = scopedTranslation.scopedT(locale);
  return metadataGenerator(locale, {
    path: "story/blog",
    title: t("page.meta.title"),
    category: t("page.meta.category"),
    description: t("page.meta.description"),
    image:
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2070",
    imageAlt: t("page.meta.imageAlt"),
    keywords: [t("page.meta.keywords")],
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

interface BlogPost {
  slug: string;
  titleKey: string;
  categoryKey: string;
  excerptKey: string;
  readTimeKey: string;
  accentColor: string;
  borderColor: string;
  bgGradient: string;
  badgeColor: string;
  icon: string;
}

export function ReadTimeBadge({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <Span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
      <Clock className="h-3 w-3" />
      {children}
    </Span>
  );
}

export function CategoryBadge({
  label,
  className,
}: {
  label: string;
  className: string;
}): JSX.Element {
  return (
    <Badge
      variant="outline"
      className={`text-xs font-medium px-2 py-0.5 transition-colors ${className}`}
    >
      {label}
    </Badge>
  );
}

export function TanstackPage({ locale }: BlogIndexPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);

  const VIBE_CHECK_SNIPPET = `$ vibe check src/
  ✓ 847 files checked
  ✗ 3 errors found

  src/api/chat/repo.ts:42
    no-explicit-any: Unexpected any.
    Avoid \`any\` - fix the type.

  src/api/chat/repo.ts:67
    no-throw: Use fail() not throw.`;

  const GRAPH_ASCII = `  nodes: [price, rsi, ema]
  ┌─────┐   ┌─────┐
  │price│──▶│ rsi │
  └─────┘   └──┬──┘
               │ signal
            ┌──▼──┐
            │alert│
            └─────┘`;

  const BLOG_POSTS: BlogPost[] = [
    {
      slug: "referral-for-beginners",
      titleKey: "posts.referralBeginners.title",
      categoryKey: "posts.referralBeginners.category",
      excerptKey: "posts.referralBeginners.excerpt",
      readTimeKey: "posts.referralBeginners.readTime",
      accentColor: "text-emerald-400",
      borderColor: "border-emerald-500/40",
      bgGradient:
        "bg-linear-to-br from-emerald-950/70 via-slate-900 to-slate-950 dark:from-emerald-950/50",
      badgeColor:
        "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20",
      icon: "🌱",
    },
    {
      slug: "referral-for-affiliate-pros",
      titleKey: "posts.referralAffiliatePros.title",
      categoryKey: "posts.referralAffiliatePros.category",
      excerptKey: "posts.referralAffiliatePros.excerpt",
      readTimeKey: "posts.referralAffiliatePros.readTime",
      accentColor: "text-violet-400",
      borderColor: "border-violet-500/40",
      bgGradient:
        "bg-linear-to-br from-violet-950/70 via-slate-900 to-slate-950 dark:from-violet-950/50",
      badgeColor:
        "bg-violet-500/10 text-violet-400 border-violet-500/30 hover:bg-violet-500/20",
      icon: "📊",
    },
    {
      slug: "referral-for-developers",
      titleKey: "posts.referralDevelopers.title",
      categoryKey: "posts.referralDevelopers.category",
      excerptKey: "posts.referralDevelopers.excerpt",
      readTimeKey: "posts.referralDevelopers.readTime",
      accentColor: "text-cyan-400",
      borderColor: "border-cyan-500/40",
      bgGradient:
        "bg-linear-to-br from-cyan-950/70 via-slate-900 to-slate-950 dark:from-cyan-950/50",
      badgeColor:
        "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/20",
      icon: "🛠️",
    },
    {
      slug: "one-codebase-13-platforms",
      titleKey: "posts.oneCodebase.title",
      categoryKey: "posts.oneCodebase.category",
      excerptKey: "posts.oneCodebase.excerpt",
      readTimeKey: "posts.oneCodebase.readTime",
      accentColor: "text-cyan-400",
      borderColor: "border-cyan-500/40",
      bgGradient:
        "bg-linear-to-br from-cyan-950/80 via-slate-900 to-slate-950 dark:from-cyan-950/60 dark:via-slate-900 dark:to-slate-950",
      badgeColor:
        "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/20",
      icon: "🏗️",
    },
    {
      slug: "type-checker-made-ai-stop-lying",
      titleKey: "posts.typeChecker.title",
      categoryKey: "posts.typeChecker.category",
      excerptKey: "posts.typeChecker.excerpt",
      readTimeKey: "posts.typeChecker.readTime",
      accentColor: "text-violet-400",
      borderColor: "border-violet-500/40",
      bgGradient:
        "bg-linear-to-br from-violet-950/70 via-slate-900 to-slate-950 dark:from-violet-950/50",
      badgeColor:
        "bg-violet-500/10 text-violet-400 border-violet-500/30 hover:bg-violet-500/20",
      icon: "🛡️",
    },
    {
      slug: "dead-trading-bot-to-monitoring-engine",
      titleKey: "posts.tradingBot.title",
      categoryKey: "posts.tradingBot.category",
      excerptKey: "posts.tradingBot.excerpt",
      readTimeKey: "posts.tradingBot.readTime",
      accentColor: "text-emerald-400",
      borderColor: "border-emerald-500/40",
      bgGradient:
        "bg-linear-to-br from-emerald-950/70 via-slate-900 to-slate-950 dark:from-emerald-950/50",
      badgeColor:
        "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20",
      icon: "📈",
    },
    {
      slug: "i-got-fired",
      titleKey: "posts.fired.title",
      categoryKey: "posts.fired.category",
      excerptKey: "posts.fired.excerpt",
      readTimeKey: "posts.fired.readTime",
      accentColor: "text-orange-400",
      borderColor: "border-orange-500/40",
      bgGradient:
        "bg-linear-to-br from-orange-950/70 via-slate-900 to-slate-950 dark:from-orange-950/50",
      badgeColor:
        "bg-orange-500/10 text-orange-400 border-orange-500/30 hover:bg-orange-500/20",
      icon: "💼",
    },
    {
      slug: "hackernews",
      titleKey: "posts.hackernews.title",
      categoryKey: "posts.hackernews.category",
      excerptKey: "posts.hackernews.excerpt",
      readTimeKey: "posts.hackernews.readTime",
      accentColor: "text-orange-500",
      borderColor: "border-orange-600/40",
      bgGradient:
        "bg-linear-to-br from-orange-950/60 via-stone-900 to-stone-950 dark:from-orange-950/40",
      badgeColor:
        "bg-orange-600/10 text-orange-500 border-orange-600/30 hover:bg-orange-600/20",
      icon: "🔶",
    },
  ];

  const [featured, ...rest] = BLOG_POSTS;
  const gridPosts = rest.slice(0, 3);
  const morePosts = rest.slice(3);

  return (
    <Div className="min-h-screen bg-slate-950">
      {/* Hero header */}
      <Div className="relative overflow-hidden border-b border-slate-800">
        <Div className="absolute inset-0 bg-linear-to-b from-cyan-950/30 via-slate-950 to-slate-950" />
        <Div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,219,255,0.5),rgba(255,255,255,0))]" />
        <Div className="container relative mx-auto px-4 pt-20 pb-16">
          <Div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-1.5 text-xs font-medium text-cyan-400 mb-6">
            <BookOpen className="h-3.5 w-3.5" />
            {t("labels.allPosts")}
          </Div>
          <H1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">
            {t("page.title")}
          </H1>
          <P className="text-lg md:text-xl text-slate-400 max-w-2xl">
            {t("page.subtitle")}
          </P>
        </Div>
      </Div>

      <Div className="container mx-auto px-4 py-16 space-y-16">
        {/* Featured post - full width hero card */}
        {featured !== undefined && (
          <Div>
            <Div className="flex items-center gap-2 mb-6">
              <Span className="text-xs font-semibold uppercase tracking-widest text-cyan-500">
                {t("labels.featured")}
              </Span>
              <Separator className="flex-1 bg-slate-800" />
            </Div>

            <Link
              href={`/${locale}/story/blog/${featured.slug}`}
              className="block group"
            >
              <Card
                className={`relative overflow-hidden border-2 ${featured.borderColor} ${featured.bgGradient} transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-0.5`}
              >
                {/* Mac-style title bar */}
                <Div className="flex items-center gap-2 px-6 py-3 border-b border-cyan-800/30 bg-black/20">
                  <Div className="flex gap-1.5">
                    <Div className="w-3 h-3 rounded-full bg-red-500/70" />
                    <Div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                    <Div className="w-3 h-3 rounded-full bg-green-500/70" />
                  </Div>
                  <Span className="text-xs font-mono text-slate-400 ml-2">
                    {t("ui.featuredFileBar")}
                  </Span>
                </Div>

                <CardHeader className="pt-8 pb-4 px-8">
                  <Div className="flex flex-wrap items-center gap-3 mb-4">
                    <Span className="text-3xl">{featured.icon}</Span>
                    <CategoryBadge
                      label={t(featured.categoryKey as Parameters<typeof t>[0])}
                      className={featured.badgeColor}
                    />
                    <ReadTimeBadge>
                      {t(featured.readTimeKey as Parameters<typeof t>[0])}
                    </ReadTimeBadge>
                  </Div>
                  <H2
                    className={`text-2xl md:text-4xl font-bold text-white leading-tight group-hover:${featured.accentColor} transition-colors`}
                  >
                    {t(featured.titleKey as Parameters<typeof t>[0])}
                  </H2>
                </CardHeader>

                <CardContent className="px-8 pb-8">
                  <P className="text-slate-300 text-lg leading-relaxed max-w-3xl mb-6">
                    {t(featured.excerptKey as Parameters<typeof t>[0])}
                  </P>

                  {/* Inline code preview */}
                  <Div className="font-mono text-xs text-emerald-400/80 bg-black/40 border border-slate-700/50 rounded-lg px-4 py-3 max-w-xl mb-6 whitespace-pre leading-relaxed">
                    {`createEndpoint({\n  path: ["chat", "threads"],\n  // → web form, CLI command,\n  // → MCP tool, native screen,\n  // → cron job - automatically\n})`}
                  </Div>

                  <Span
                    className={`inline-flex items-center gap-2 text-sm font-medium ${featured.accentColor} group-hover:gap-3 transition-all`}
                  >
                    {t("labels.readMore")}
                    <ArrowRight className="h-4 w-4" />
                  </Span>
                </CardContent>
              </Card>
            </Link>
          </Div>
        )}

        {/* 3-column grid for posts 2–4 */}
        <Div>
          <Div className="flex items-center gap-2 mb-6">
            <Separator className="flex-1 bg-slate-800" />
          </Div>

          <Div className="grid md:grid-cols-3 gap-6">
            {/* TypeScript post - with vibe check code snippet */}
            {gridPosts[0] !== undefined && (
              <Link
                href={`/${locale}/story/blog/${gridPosts[0].slug}`}
                className="block group"
              >
                <Card
                  className={`h-full relative overflow-hidden border ${gridPosts[0].borderColor} ${gridPosts[0].bgGradient} transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1`}
                >
                  <CardHeader className="pb-3">
                    <Div className="flex items-center gap-2 mb-3">
                      <Span className="text-2xl">{gridPosts[0].icon}</Span>
                      <CategoryBadge
                        label={t(
                          gridPosts[0].categoryKey as Parameters<typeof t>[0],
                        )}
                        className={gridPosts[0].badgeColor}
                      />
                    </Div>
                    <H3 className="text-lg font-bold text-white leading-snug group-hover:text-violet-400 transition-colors">
                      {t(gridPosts[0].titleKey as Parameters<typeof t>[0])}
                    </H3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <P className="text-sm text-slate-400 leading-relaxed">
                      {t(gridPosts[0].excerptKey as Parameters<typeof t>[0])}
                    </P>
                    {/* vibe check snippet */}
                    <Div className="font-mono text-[10px] leading-relaxed text-slate-300/80 bg-black/50 border border-slate-700/40 rounded-md px-3 py-2.5 whitespace-pre overflow-hidden">
                      {VIBE_CHECK_SNIPPET}
                    </Div>
                    <Div className="flex items-center justify-between pt-1">
                      <ReadTimeBadge>
                        {t(gridPosts[0].readTimeKey as Parameters<typeof t>[0])}
                      </ReadTimeBadge>
                      <Span className="inline-flex items-center gap-1 text-xs font-medium text-violet-400 group-hover:gap-2 transition-all">
                        {t("labels.readMore")}
                        <ArrowRight className="h-3 w-3" />
                      </Span>
                    </Div>
                  </CardContent>
                </Card>
              </Link>
            )}

            {/* Trading bot post - with ASCII graph */}
            {gridPosts[1] !== undefined && (
              <Link
                href={`/${locale}/story/blog/${gridPosts[1].slug}`}
                className="block group"
              >
                <Card
                  className={`h-full relative overflow-hidden border ${gridPosts[1].borderColor} ${gridPosts[1].bgGradient} transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1`}
                >
                  <CardHeader className="pb-3">
                    <Div className="flex items-center gap-2 mb-3">
                      <Span className="text-2xl">{gridPosts[1].icon}</Span>
                      <CategoryBadge
                        label={t(
                          gridPosts[1].categoryKey as Parameters<typeof t>[0],
                        )}
                        className={gridPosts[1].badgeColor}
                      />
                    </Div>
                    <H3 className="text-lg font-bold text-white leading-snug group-hover:text-emerald-400 transition-colors">
                      {t(gridPosts[1].titleKey as Parameters<typeof t>[0])}
                    </H3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <P className="text-sm text-slate-400 leading-relaxed">
                      {t(gridPosts[1].excerptKey as Parameters<typeof t>[0])}
                    </P>
                    {/* ASCII graph accent */}
                    <Div className="font-mono text-[10px] leading-relaxed text-emerald-400/70 bg-black/50 border border-emerald-900/40 rounded-md px-3 py-2.5 whitespace-pre overflow-hidden">
                      {GRAPH_ASCII}
                    </Div>
                    <Div className="flex items-center justify-between pt-1">
                      <ReadTimeBadge>
                        {t(gridPosts[1].readTimeKey as Parameters<typeof t>[0])}
                      </ReadTimeBadge>
                      <Span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 group-hover:gap-2 transition-all">
                        {t("labels.readMore")}
                        <ArrowRight className="h-3 w-3" />
                      </Span>
                    </Div>
                  </CardContent>
                </Card>
              </Link>
            )}

            {/* "I got fired" post */}
            {gridPosts[2] !== undefined && (
              <Link
                href={`/${locale}/story/blog/${gridPosts[2].slug}`}
                className="block group"
              >
                <Card
                  className={`h-full relative overflow-hidden border ${gridPosts[2].borderColor} ${gridPosts[2].bgGradient} transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1`}
                >
                  <CardHeader className="pb-3">
                    <Div className="flex items-center gap-2 mb-3">
                      <Span className="text-2xl">{gridPosts[2].icon}</Span>
                      <CategoryBadge
                        label={t(
                          gridPosts[2].categoryKey as Parameters<typeof t>[0],
                        )}
                        className={gridPosts[2].badgeColor}
                      />
                    </Div>
                    <H3 className="text-lg font-bold text-white leading-snug group-hover:text-orange-400 transition-colors">
                      {t(gridPosts[2].titleKey as Parameters<typeof t>[0])}
                    </H3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <P className="text-sm text-slate-400 leading-relaxed">
                      {t(gridPosts[2].excerptKey as Parameters<typeof t>[0])}
                    </P>
                    {/* Widget embed snippet */}
                    <Div className="font-mono text-[10px] leading-relaxed text-orange-400/70 bg-black/50 border border-orange-900/40 rounded-md px-3 py-2.5 whitespace-pre overflow-hidden">
                      {`<script src="vibe.js"></script>\n<vibe-widget\n  endpoint="/api/chat"\n  theme="dark"\n/>`}
                    </Div>
                    <Div className="flex items-center justify-between pt-1">
                      <ReadTimeBadge>
                        {t(gridPosts[2].readTimeKey as Parameters<typeof t>[0])}
                      </ReadTimeBadge>
                      <Span className="inline-flex items-center gap-1 text-xs font-medium text-orange-400 group-hover:gap-2 transition-all">
                        {t("labels.readMore")}
                        <ArrowRight className="h-3 w-3" />
                      </Span>
                    </Div>
                  </CardContent>
                </Card>
              </Link>
            )}
          </Div>
        </Div>

        {/* Additional posts grid */}
        {morePosts.length > 0 && (
          <Div>
            <Separator className="bg-slate-800 mb-8" />
            <Div className="grid md:grid-cols-3 gap-6">
              {morePosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/${locale}/story/blog/${post.slug}`}
                  className="block group"
                >
                  <Card
                    className={`h-full relative overflow-hidden border ${post.borderColor} ${post.bgGradient} transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
                  >
                    <CardHeader className="pb-3">
                      <Div className="flex items-center gap-2 mb-3">
                        <Span className="text-2xl">{post.icon}</Span>
                        <CategoryBadge
                          label={t(post.categoryKey as Parameters<typeof t>[0])}
                          className={post.badgeColor}
                        />
                      </Div>
                      <H3 className="text-lg font-bold text-white leading-snug group-hover:text-slate-300 transition-colors">
                        {t(post.titleKey as Parameters<typeof t>[0])}
                      </H3>
                    </CardHeader>
                    <CardContent>
                      <P className="text-sm text-slate-400 leading-relaxed mb-4">
                        {t(post.excerptKey as Parameters<typeof t>[0])}
                      </P>
                      <Div className="flex items-center justify-between">
                        <ReadTimeBadge>
                          {t(post.readTimeKey as Parameters<typeof t>[0])}
                        </ReadTimeBadge>
                        <Span
                          className={`inline-flex items-center gap-1 text-xs font-medium ${post.accentColor} group-hover:gap-2 transition-all`}
                        >
                          {t("labels.readMore")}
                          <ArrowRight className="h-3 w-3" />
                        </Span>
                      </Div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </Div>
          </Div>
        )}
      </Div>
    </Div>
  );
}

export default async function BlogIndexPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
