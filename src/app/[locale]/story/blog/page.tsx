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
  snippet: string;
  snippetColor: string;
  snippetBorder: string;
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

  const ALL_POSTS: BlogPost[] = [
    {
      slug: "one-codebase-13-platforms",
      titleKey: "posts.oneCodebase.title",
      categoryKey: "posts.oneCodebase.category",
      excerptKey: "posts.oneCodebase.excerpt",
      readTimeKey: "posts.oneCodebase.readTime",
      accentColor: "text-cyan-400",
      borderColor: "border-cyan-500/40",
      bgGradient: "bg-linear-to-br from-cyan-950/80 via-slate-900 to-slate-950",
      badgeColor:
        "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/20",
      snippet: `createEndpoint({ path: ["chat", "threads"] })
  ↓ web form      ↓ CLI command
  ↓ MCP tool      ↓ native screen
  ↓ cron job      ↓ AI tool schema
  ↓ WebSocket     ↓ admin panel
  ↓ agent skill   ↓ Vibe Sense node
  ↓ VibeFrame widget  ↓ Electron
  → 13 platforms. zero extra code.`,
      snippetColor: "text-cyan-300/80",
      snippetBorder: "border-cyan-900/40",
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
        "bg-linear-to-br from-violet-950/70 via-slate-900 to-slate-950",
      badgeColor:
        "bg-violet-500/10 text-violet-400 border-violet-500/30 hover:bg-violet-500/20",
      snippet: `$ vibe check src/
  ✓ 847 files checked
  ✗ 3 errors

  repo.ts:42  no-explicit-any
    → Unexpected any. Fix the type.

  repo.ts:67  no-throw
    → Use fail() not throw.`,
      snippetColor: "text-slate-300/80",
      snippetBorder: "border-slate-700/40",
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
        "bg-linear-to-br from-emerald-950/70 via-slate-900 to-slate-950",
      badgeColor:
        "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20",
      snippet: `DataSource → Indicator → Evaluator → Action

  [leads/created] ──▶ [ema_7d]
  [leads/converted] ─▶ [conversion_rate]
                           │
                      [drop > 20%?]
                           │
                      [alert: Slack]`,
      snippetColor: "text-emerald-400/70",
      snippetBorder: "border-emerald-900/40",
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
        "bg-linear-to-br from-orange-950/70 via-slate-900 to-slate-950",
      badgeColor:
        "bg-orange-500/10 text-orange-400 border-orange-500/30 hover:bg-orange-500/20",
      snippet: `<script src="https://vibe.js/embed.js"></script>
<vibe-widget
  endpoint="https://unbottled.ai/api/chat"
  trigger="scroll"
  display="slide-in"
  theme="dark"
/>`,
      snippetColor: "text-orange-400/70",
      snippetBorder: "border-orange-900/40",
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
        "bg-linear-to-br from-orange-950/60 via-stone-900 to-stone-950",
      badgeColor:
        "bg-orange-600/10 text-orange-500 border-orange-600/30 hover:bg-orange-600/20",
      snippet: `Show HN: next-vibe - one endpoint, every surface

  Got tired of writing the same logic 5 times.
  One definition.ts → web form, CLI, MCP tool,
  mobile screen, cron job. Automatically.

  TypeScript rules enforced by the framework.
  Zero any. Zero throw. Zero hardcoded strings.`,
      snippetColor: "text-orange-400/70",
      snippetBorder: "border-orange-900/30",
    },
    // - referral posts mixed in —
    {
      slug: "referral-for-developers",
      titleKey: "posts.referralDevelopers.title",
      categoryKey: "posts.referralDevelopers.category",
      excerptKey: "posts.referralDevelopers.excerpt",
      readTimeKey: "posts.referralDevelopers.readTime",
      accentColor: "text-cyan-400",
      borderColor: "border-cyan-500/40",
      bgGradient: "bg-linear-to-br from-cyan-950/70 via-slate-900 to-slate-950",
      badgeColor:
        "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/20",
      snippet: `## Built with next-vibe

  This project uses [unbottled.ai](https://unbottled.ai)
  for AI features. 50+ models, uncensored options,
  privacy-first. <!-- ref: your-code-here -->

  Payout: BTC · USDC · Credits. Min: $40.`,
      snippetColor: "text-cyan-400/70",
      snippetBorder: "border-cyan-900/40",
    },
    {
      slug: "referral-for-beginners",
      titleKey: "posts.referralBeginners.title",
      categoryKey: "posts.referralBeginners.category",
      excerptKey: "posts.referralBeginners.excerpt",
      readTimeKey: "posts.referralBeginners.readTime",
      accentColor: "text-emerald-400",
      borderColor: "border-emerald-500/40",
      bgGradient:
        "bg-linear-to-br from-emerald-950/70 via-slate-900 to-slate-950",
      badgeColor:
        "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20",
      snippet: `You → friend signs up → $0.80–$8/mo recurring
         └→ their friend → $0.40–$4/mo
               └→ their friend → also yours

  No one-time payouts. Every month, forever.`,
      snippetColor: "text-emerald-400/70",
      snippetBorder: "border-emerald-900/40",
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
        "bg-linear-to-br from-violet-950/70 via-slate-900 to-slate-950",
      badgeColor:
        "bg-violet-500/10 text-violet-400 border-violet-500/30 hover:bg-violet-500/20",
      snippet: `1 casual user   ($8/mo)  → you earn $0.80/mo
  1 developer     ($200/mo)→ you earn $20/mo
  1 power user    ($500/mo)→ you earn $50/mo

  Platform adds features → users spend more
  → your old referrals pay you more. Forever.`,
      snippetColor: "text-violet-400/70",
      snippetBorder: "border-violet-900/40",
    },
  ];

  const [featured, ...rest] = ALL_POSTS;

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
        {/* Featured post */}
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

                <Div className="md:grid md:grid-cols-2 md:gap-0">
                  <Div>
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
                      <H2
                        className={`text-2xl md:text-3xl font-bold text-white leading-tight group-hover:${featured.accentColor} transition-colors`}
                      >
                        {t(featured.titleKey as Parameters<typeof t>[0])}
                      </H2>
                    </CardHeader>

                    <CardContent className="px-8 pb-8">
                      <P className="text-slate-300 text-base leading-relaxed mb-6">
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

                  {/* Code preview panel */}
                  <Div className="hidden md:flex items-center justify-center px-8 py-8 border-l border-cyan-800/20">
                    <Div
                      className={`font-mono text-xs leading-relaxed ${featured.snippetColor} bg-black/40 border ${featured.snippetBorder} rounded-lg px-5 py-4 w-full whitespace-pre`}
                    >
                      {featured.snippet}
                    </Div>
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
                className={`h-full relative overflow-hidden border ${post.borderColor} ${post.bgGradient} transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
              >
                <CardHeader className="pb-3">
                  <Div className="flex items-center gap-2 mb-3">
                    <CategoryBadge
                      label={t(post.categoryKey as Parameters<typeof t>[0])}
                      className={post.badgeColor}
                    />
                    <ReadTimeBadge>
                      {t(post.readTimeKey as Parameters<typeof t>[0])}
                    </ReadTimeBadge>
                  </Div>
                  <H3
                    className={`text-lg font-bold text-white leading-snug group-hover:${post.accentColor} transition-colors`}
                  >
                    {t(post.titleKey as Parameters<typeof t>[0])}
                  </H3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <P className="text-sm text-slate-400 leading-relaxed">
                    {t(post.excerptKey as Parameters<typeof t>[0])}
                  </P>
                  <Div
                    className={`font-mono text-[10px] leading-relaxed ${post.snippetColor} bg-black/50 border ${post.snippetBorder} rounded-md px-3 py-2.5 whitespace-pre overflow-hidden`}
                  >
                    {post.snippet}
                  </Div>
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
