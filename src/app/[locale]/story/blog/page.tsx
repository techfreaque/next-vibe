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

import { configScopedTranslation } from "@/config/i18n";
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

interface BlogPost {
  slug: string;
  titleKey: string;
  categoryKey: string;
  excerptKey: string;
  readTimeKey: string;
  emoji: string;
  accentColor: string;
  accentBg: string;
  accentBorder: string;
  badgeColor: string;
}

function ReadTimeBadge({ children }: { children: ReactNode }): JSX.Element {
  return (
    <Span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
      <Clock className="h-3 w-3" />
      {children}
    </Span>
  );
}

function CategoryBadge({
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
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");

  // Posts ordered to mix technical and referral content
  const ALL_POSTS: BlogPost[] = [
    {
      slug: "whats-new-april-2026",
      titleKey: "posts.whatsNewApril2026.title",
      categoryKey: "posts.whatsNewApril2026.category",
      excerptKey: "posts.whatsNewApril2026.excerpt",
      readTimeKey: "posts.whatsNewApril2026.readTime",
      emoji: "🧭",
      accentColor: "text-purple-600 dark:text-purple-400",
      accentBg: "bg-purple-50 dark:bg-purple-950/30",
      accentBorder: "border-purple-200 dark:border-purple-800/50",
      badgeColor:
        "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800/50",
    },
    {
      slug: "one-codebase-13-platforms",
      titleKey: "posts.oneCodebase.title",
      categoryKey: "posts.oneCodebase.category",
      excerptKey: "posts.oneCodebase.excerpt",
      readTimeKey: "posts.oneCodebase.readTime",
      emoji: "🧬",
      accentColor: "text-cyan-500 dark:text-cyan-400",
      accentBg: "bg-cyan-50 dark:bg-cyan-950/30",
      accentBorder: "border-cyan-200 dark:border-cyan-800/50",
      badgeColor:
        "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-400 dark:border-cyan-800/50",
    },
    {
      slug: "skill-sharing-economy",
      titleKey: "posts.skillSharingEconomy.title",
      categoryKey: "posts.skillSharingEconomy.category",
      excerptKey: "posts.skillSharingEconomy.excerpt",
      readTimeKey: "posts.skillSharingEconomy.readTime",
      emoji: "💡",
      accentColor: "text-amber-600 dark:text-amber-400",
      accentBg: "bg-amber-50 dark:bg-amber-950/30",
      accentBorder: "border-amber-200 dark:border-amber-800/50",
      badgeColor:
        "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/50",
    },
    {
      slug: "type-checker-made-ai-stop-lying",
      titleKey: "posts.typeChecker.title",
      categoryKey: "posts.typeChecker.category",
      excerptKey: "posts.typeChecker.excerpt",
      readTimeKey: "posts.typeChecker.readTime",
      emoji: "🛡",
      accentColor: "text-violet-600 dark:text-violet-400",
      accentBg: "bg-violet-50 dark:bg-violet-950/30",
      accentBorder: "border-violet-200 dark:border-violet-800/50",
      badgeColor:
        "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-400 dark:border-violet-800/50",
    },
    {
      slug: "referral-for-beginners",
      titleKey: "posts.referralBeginners.title",
      categoryKey: "posts.referralBeginners.category",
      excerptKey: "posts.referralBeginners.excerpt",
      readTimeKey: "posts.referralBeginners.readTime",
      emoji: "🌱",
      accentColor: "text-emerald-600 dark:text-emerald-400",
      accentBg: "bg-emerald-50 dark:bg-emerald-950/30",
      accentBorder: "border-emerald-200 dark:border-emerald-800/50",
      badgeColor:
        "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/50",
    },
    {
      slug: "dead-trading-bot-to-monitoring-engine",
      titleKey: "posts.tradingBot.title",
      categoryKey: "posts.tradingBot.category",
      excerptKey: "posts.tradingBot.excerpt",
      readTimeKey: "posts.tradingBot.readTime",
      emoji: "📊",
      accentColor: "text-emerald-600 dark:text-emerald-400",
      accentBg: "bg-emerald-50 dark:bg-emerald-950/30",
      accentBorder: "border-emerald-200 dark:border-emerald-800/50",
      badgeColor:
        "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/50",
    },
    {
      slug: "referral-for-developers",
      titleKey: "posts.referralDevelopers.title",
      categoryKey: "posts.referralDevelopers.category",
      excerptKey: "posts.referralDevelopers.excerpt",
      readTimeKey: "posts.referralDevelopers.readTime",
      emoji: "🔗",
      accentColor: "text-cyan-600 dark:text-cyan-400",
      accentBg: "bg-cyan-50 dark:bg-cyan-950/30",
      accentBorder: "border-cyan-200 dark:border-cyan-800/50",
      badgeColor:
        "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-400 dark:border-cyan-800/50",
    },
    {
      slug: "i-got-fired",
      titleKey: "posts.fired.title",
      categoryKey: "posts.fired.category",
      excerptKey: "posts.fired.excerpt",
      readTimeKey: "posts.fired.readTime",
      emoji: "🔥",
      accentColor: "text-orange-600 dark:text-orange-400",
      accentBg: "bg-orange-50 dark:bg-orange-950/30",
      accentBorder: "border-orange-200 dark:border-orange-800/50",
      badgeColor:
        "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-800/50",
    },
    {
      slug: "referral-for-affiliate-pros",
      titleKey: "posts.referralAffiliatePros.title",
      categoryKey: "posts.referralAffiliatePros.category",
      excerptKey: "posts.referralAffiliatePros.excerpt",
      readTimeKey: "posts.referralAffiliatePros.readTime",
      emoji: "📈",
      accentColor: "text-violet-600 dark:text-violet-400",
      accentBg: "bg-violet-50 dark:bg-violet-950/30",
      accentBorder: "border-violet-200 dark:border-violet-800/50",
      badgeColor:
        "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-400 dark:border-violet-800/50",
    },
    {
      slug: "one-endpoint-every-surface",
      titleKey: "posts.oneEndpoint.title",
      categoryKey: "posts.oneEndpoint.category",
      excerptKey: "posts.oneEndpoint.excerpt",
      readTimeKey: "posts.oneEndpoint.readTime",
      emoji: "🔗",
      accentColor: "text-blue-600 dark:text-blue-400",
      accentBg: "bg-blue-50 dark:bg-blue-950/30",
      accentBorder: "border-blue-200 dark:border-blue-800/50",
      badgeColor:
        "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/50",
    },
  ];

  const [featured, ...rest] = ALL_POSTS;

  return (
    <Div className="min-h-screen bg-background">
      {/* Hero header */}
      <Div className="relative overflow-hidden border-b">
        <Div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-background" />
        <Div className="container relative mx-auto px-4 pt-20 pb-16">
          <Div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium text-muted-foreground mb-6">
            <BookOpen className="h-3.5 w-3.5" />
            {t("labels.allPosts")}
          </Div>
          <H1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            {t("page.title")}
          </H1>
          <P className="text-lg md:text-xl text-muted-foreground max-w-2xl">
            {t("page.subtitle", { appName })}
          </P>
        </Div>
      </Div>

      <Div className="container mx-auto px-4 py-16 space-y-16">
        {/* Featured post */}
        {featured !== undefined && (
          <Div>
            <Div className="flex items-center gap-2 mb-6">
              <Span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {t("labels.featured")}
              </Span>
              <Separator className="flex-1" />
            </Div>

            <Link
              href={`/${locale}/story/blog/${featured.slug}`}
              className="block group"
            >
              <Card
                className={`relative overflow-hidden border-2 ${featured.accentBorder} transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5`}
              >
                <Div className="md:grid md:grid-cols-5 md:gap-0">
                  <Div className="md:col-span-3">
                    <CardHeader className="pt-8 pb-4 px-8">
                      <Div className="flex flex-wrap items-center gap-3 mb-4">
                        <CategoryBadge
                          label={t(
                            featured.categoryKey as Parameters<typeof t>[0],
                          )}
                          className={featured.badgeColor}
                        />
                        <ReadTimeBadge>
                          {t(featured.readTimeKey as Parameters<typeof t>[0])}
                        </ReadTimeBadge>
                      </Div>
                      <H2 className="text-2xl md:text-3xl font-bold leading-tight">
                        {t(featured.titleKey as Parameters<typeof t>[0])}
                      </H2>
                    </CardHeader>

                    <CardContent className="px-8 pb-8">
                      <P className="text-muted-foreground text-base leading-relaxed mb-6">
                        {t(featured.excerptKey as Parameters<typeof t>[0])}
                      </P>
                      <Span
                        className={`inline-flex items-center gap-2 text-sm font-medium ${featured.accentColor} group-hover:gap-3 transition-all`}
                      >
                        {t("labels.readMore")}
                        <ArrowRight className="h-4 w-4" />
                      </Span>
                    </CardContent>
                  </Div>

                  {/* Accent panel instead of code block */}
                  <Div
                    className={`hidden md:flex md:col-span-2 items-center justify-center ${featured.accentBg} border-l ${featured.accentBorder}`}
                  >
                    <Span className="text-7xl">{featured.emoji}</Span>
                  </Div>
                </Div>
              </Card>
            </Link>
          </Div>
        )}

        {/* All remaining posts - 2-column grid, mixed */}
        <Div className="grid md:grid-cols-2 gap-6">
          {rest.map((post) => (
            <Link
              key={post.slug}
              href={`/${locale}/story/blog/${post.slug}`}
              className="block group"
            >
              <Card
                className={`h-full relative overflow-hidden border ${post.accentBorder} transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
              >
                {/* Top accent stripe */}
                <Div
                  className={`h-1.5 ${post.accentBg} border-b ${post.accentBorder}`}
                />
                <CardHeader className="pb-3">
                  <Div className="flex items-center gap-3 mb-3">
                    <Span className="text-2xl">{post.emoji}</Span>
                    <Div className="flex items-center gap-2">
                      <CategoryBadge
                        label={t(post.categoryKey as Parameters<typeof t>[0])}
                        className={post.badgeColor}
                      />
                      <ReadTimeBadge>
                        {t(post.readTimeKey as Parameters<typeof t>[0])}
                      </ReadTimeBadge>
                    </Div>
                  </Div>
                  <H3 className="text-lg font-bold leading-snug">
                    {t(post.titleKey as Parameters<typeof t>[0])}
                  </H3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <P className="text-sm text-muted-foreground leading-relaxed">
                    {t(post.excerptKey as Parameters<typeof t>[0])}
                  </P>
                  <Div className="flex items-center justify-end pt-1">
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
    </Div>
  );
}

export default async function BlogIndexPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
