import type { Metadata } from "next";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Div } from "next-vibe/ui/components/div";
import { Bug } from "next-vibe/ui/components/icons/Bug";
import { Film } from "next-vibe/ui/components/icons/Film";
import { ThumbsDown } from "next-vibe/ui/components/icons/ThumbsDown";
import { ThumbsUp } from "next-vibe/ui/components/icons/ThumbsUp";
import { Video } from "next-vibe/ui/components/icons/Video";
import { ExternalLink, Link } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import { P } from "next-vibe/ui/components/typography";
import type { JSX } from "react";

import { configScopedTranslation } from "@/env/i18n";

import {
  ArticleBody,
  ArticleEnd,
  ArticleHeader,
  ArticleLead,
  ArticleList,
  ArticleP,
  ArticleQuote,
  ArticleSection,
} from "../../_shared/article";
import { Callout, Cta, Step, StepList } from "../../_shared/marketing";
import { scopedTranslation } from "./i18n";

export const revalidate = 3600;

const SLUG = "ai-ops-agent-tudo-sobre-ia";

/** The published review (public, editorial citation: a followed link). */
const REVIEW_URL = "https://tudosobreia.com.br/teste-unbottled-ai/";

const LINK_CLASS =
  "font-medium text-primary underline underline-offset-4 hover:no-underline";

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
    path: `story/blog/${SLUG}`,
    title: t("meta.title"),
    category: t("meta.category"),
    description: t("meta.description"),
    imageAlt: t("meta.imageAlt", { appName }),
    keywords: [t("meta.keywords", { appName })],
  });
};

export interface TudoSobreIaPageData {
  locale: CountryLanguage;
}

export async function tanstackLoader({
  params,
}: Props): Promise<TudoSobreIaPageData> {
  const { locale } = await params;
  return { locale };
}

/** Timeline of 25 November 2026, from the ops log (UTC). */
const TIMELINE = [
  { key: "report", time: "12:31" },
  { key: "fix", time: "12:55" },
  { key: "reply", time: "12:55" },
  { key: "live", time: "13:26" },
  { key: "verified", time: "13:39" },
  { key: "review", time: "17:32" },
] as const;

const LIKE_KEYS = ["panel", "price", "text", "support"] as const;
const FLAG_KEYS = [
  "transcription",
  "history",
  "commercial",
  "privacy",
  "music",
] as const;

function ReviewLink({ label }: { label: string }): JSX.Element {
  return (
    <ExternalLink
      href={REVIEW_URL}
      target="_blank"
      rel="noopener"
      className={LINK_CLASS}
    >
      {label}
    </ExternalLink>
  );
}

export function TanstackPage({ locale }: TudoSobreIaPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const back = { href: `/${locale}/story/blog`, label: t("hero.backToBlog") };
  const post = { slug: SLUG, locale } as const;

  return (
    <Div className="min-h-screen bg-background">
      <ArticleHeader
        back={back}
        category={t("hero.category")}
        readTime={t("hero.readTime")}
        post={post}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
      />

      <ArticleBody>
        <Div className="flex flex-col gap-5">
          <ArticleLead>{t("intro.lead")}</ArticleLead>
          <ArticleP>
            {t("intro.reviewBefore")}{" "}
            <ReviewLink label={t("intro.reviewLink")} />
            {t("intro.reviewAfter")}
          </ArticleP>
          <ArticleP>{t("intro.p2")}</ArticleP>
        </Div>

        <ArticleSection title={t("deal.title")}>
          <ArticleP>{t("deal.p1")}</ArticleP>
          <ArticleP>{t("deal.p2")}</ArticleP>
          <ArticleP>{t("deal.p3")}</ArticleP>
        </ArticleSection>

        <ArticleSection title={t("bug.title")}>
          <ArticleP>{t("bug.p1")}</ArticleP>
          <ArticleP>{t("bug.p2")}</ArticleP>
          <Callout icon={Bug} tone="warning">
            {t("bug.callout")}
          </Callout>
        </ArticleSection>

        <ArticleSection title={t("timeline.title")} intro={t("timeline.intro")}>
          <StepList>
            {TIMELINE.map((step, index) => (
              <Step
                key={step.key}
                number={index + 1}
                title={
                  <>
                    <Span className="mr-2 font-mono text-sm font-medium text-primary tabular-nums">
                      {t("timeline.utc", { time: step.time })}
                    </Span>
                    {t(`timeline.${step.key}.title`)}
                  </>
                }
                description={t(`timeline.${step.key}.body`)}
              />
            ))}
          </StepList>
        </ArticleSection>

        <ArticleSection title={t("review.title")}>
          <ArticleQuote cite={t("review.cite")}>
            {t("review.quote")}
          </ArticleQuote>
          <ArticleP>{t("review.p1")}</ArticleP>
          <Div className="grid gap-4 md:grid-cols-2">
            <Div className="rounded-xl border border-border bg-card p-5">
              <P className="flex items-center gap-2 font-semibold">
                <ThumbsUp className="h-4 w-4 text-primary" />
                {t("review.likesTitle")}
              </P>
              <Div className="mt-3">
                <ArticleList
                  items={LIKE_KEYS.map((key) => t(`review.likes.${key}`))}
                />
              </Div>
            </Div>
            <Div className="rounded-xl border border-border bg-card p-5">
              <P className="flex items-center gap-2 font-semibold">
                <ThumbsDown className="h-4 w-4 text-muted-foreground" />
                {t("review.flagsTitle")}
              </P>
              <Div className="mt-3">
                <ArticleList
                  items={FLAG_KEYS.map((key) => t(`review.flags.${key}`))}
                />
              </Div>
            </Div>
          </Div>
          <ArticleP>{t("review.fixes")}</ArticleP>
          <Callout icon={Film} tone="primary">
            {t("review.readBefore")} <ReviewLink label={t("review.readLink")} />
            {t("review.readAfter")}
          </Callout>
        </ArticleSection>

        <ArticleSection title={t("lesson.title")}>
          <ArticleP>{t("lesson.p1")}</ArticleP>
          <ArticleP>{t("lesson.p2")}</ArticleP>
          <ArticleP>
            {t("lesson.p3")}{" "}
            <Link href={`/${locale}/story/partners`} className={LINK_CLASS}>
              {t("lesson.partnersLink")}
            </Link>
          </ArticleP>
          <ArticleP>{t("lesson.p4")}</ArticleP>
        </ArticleSection>

        <ArticleEnd
          post={post}
          back={back}
          title={t("cta.title")}
          subtitle={t("cta.subtitle")}
          actions={
            <>
              <Cta
                href={`/${locale}/create/video`}
                label={t("cta.video")}
                icon={Video}
              />
              <Cta
                href={`/${locale}/create`}
                label={t("cta.studio")}
                variant="secondary"
              />
            </>
          }
        />
      </ArticleBody>
    </Div>
  );
}

export default async function TudoSobreIaPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
