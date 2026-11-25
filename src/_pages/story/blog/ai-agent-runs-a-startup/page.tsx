import type { Metadata } from "next";
import { theaSkill } from "next-vibe/agent/skills/default-skills/thea/skill";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Div } from "next-vibe/ui/components/div";
import { Github } from "next-vibe/ui/components/icons/Github";
import { MessageCircle } from "next-vibe/ui/components/icons/MessageCircle";
import { Shield } from "next-vibe/ui/components/icons/Shield";
import { User } from "next-vibe/ui/components/icons/User";
import { Wallet } from "next-vibe/ui/components/icons/Wallet";
import { ExternalLink, Link } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import { H3, P } from "next-vibe/ui/components/typography";
import type { JSX } from "react";

import { GITHUB_REPO_URL } from "@/env/constants";
import { configScopedTranslation } from "@/env/i18n";

import {
  ArticleBody,
  ArticleEnd,
  ArticleHeader,
  ArticleLead,
  ArticleList,
  ArticleP,
  ArticleSection,
} from "../../_shared/article";
import {
  Callout,
  Cta,
  FeatureCard,
  FeatureGrid,
} from "../../_shared/marketing";
import { scopedTranslation } from "./i18n";

export const revalidate = 3600;

const SLUG = "ai-agent-runs-a-startup";

/** The Tudo Sobre IA review this post tells the story of (live 25 Nov 2026). */
const REVIEW_URL = "https://tudosobreia.com.br/teste-unbottled-ai/";

const LINK_CLASS =
  "font-medium text-primary underline-offset-4 hover:underline";

const DAY_KEYS = ["inbox", "outreach", "errors", "deploys", "report"] as const;

const LINE_KEYS = [
  "money",
  "honest",
  "optOut",
  "captcha",
  "private",
  "dashes",
] as const;

const MISTAKE_KEYS = ["noise", "deploy", "commit", "timing"] as const;

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

export interface AiAgentRunsAStartupPageData {
  locale: CountryLanguage;
}

export async function tanstackLoader({
  params,
}: Props): Promise<AiAgentRunsAStartupPageData> {
  const { locale } = await params;
  return { locale };
}

function MistakeCard({
  number,
  title,
  body,
}: {
  number: number;
  title: string;
  body: string;
}): JSX.Element {
  return (
    <Div className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3 rounded-xl border border-border bg-card p-5">
      <Span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary tabular-nums">
        {number}
      </Span>
      <Div className="flex min-w-0 flex-col gap-2">
        <H3 className="text-base font-semibold text-foreground md:text-lg">
          {title}
        </H3>
        <P className="text-[0.975rem] leading-relaxed text-muted-foreground md:text-base">
          {body}
        </P>
      </Div>
    </Div>
  );
}

export function TanstackPage({
  locale,
}: AiAgentRunsAStartupPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const back = { href: `/${locale}/story/blog`, label: t("hero.backToBlog") };

  return (
    <Div className="min-h-screen bg-background">
      <ArticleHeader
        back={back}
        category={t("hero.category")}
        readTime={t("hero.readTime")}
        post={{ slug: SLUG, locale }}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
      />

      <ArticleBody>
        <Div className="flex flex-col gap-5">
          <ArticleLead>{t("intro.p1")}</ArticleLead>
          <ArticleP>{t("intro.p2")}</ArticleP>
        </Div>

        <ArticleSection title={t("day.title")} intro={t("day.intro")}>
          <ArticleList items={DAY_KEYS.map((key) => t(`day.items.${key}`))} />
        </ArticleSection>

        <ArticleSection title={t("split.title")} intro={t("split.intro")}>
          <FeatureGrid columns={2}>
            <FeatureCard
              icon={User}
              label={t("split.mine.label")}
              title={t("split.mine.title")}
            >
              {t("split.mine.body")}
            </FeatureCard>
            <FeatureCard
              icon={Shield}
              label={t("split.his.label")}
              title={t("split.his.title")}
            >
              {t("split.his.body")}
            </FeatureCard>
          </FeatureGrid>
          <Callout icon={Wallet}>{t("split.money")}</Callout>
        </ArticleSection>

        <ArticleSection title={t("team.title")} intro={t("team.intro")}>
          <ArticleP>{t("team.p1")}</ArticleP>
          <ArticleP>{t("team.p2")}</ArticleP>
          <ArticleP>{t("team.p3")}</ArticleP>
        </ArticleSection>

        <ArticleSection title={t("lines.title")} intro={t("lines.intro")}>
          <ArticleList
            items={LINE_KEYS.map((key) => t(`lines.items.${key}`))}
          />
        </ArticleSection>

        <ArticleSection title={t("mistakes.title")} intro={t("mistakes.intro")}>
          <Div className="flex flex-col gap-3">
            {MISTAKE_KEYS.map((key, index) => (
              <MistakeCard
                key={key}
                number={index + 1}
                title={t(`mistakes.${key}.title`)}
                body={t(`mistakes.${key}.body`)}
              />
            ))}
          </Div>
        </ArticleSection>

        <ArticleSection title={t("review.title")}>
          <ArticleP>{t("review.p1")}</ArticleP>
          <ArticleP>{t("review.p2")}</ArticleP>
          <ArticleP>{t("review.p3")}</ArticleP>
          <ArticleP>
            {t("review.p4")}{" "}
            <ExternalLink
              href={REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={LINK_CLASS}
            >
              {t("review.linkLabel")}
            </ExternalLink>
          </ArticleP>
        </ArticleSection>

        <ArticleSection title={t("renderer.title")}>
          <ArticleP>{t("renderer.p1")}</ArticleP>
          <ArticleP>{t("renderer.p2")}</ArticleP>
        </ArticleSection>

        <ArticleSection title={t("users.title")}>
          <ArticleP>{t("users.p1")}</ArticleP>
          <ArticleP>{t("users.p2")}</ArticleP>
        </ArticleSection>

        <Div className="flex flex-col gap-4 border-l-2 border-primary pl-5 md:pl-6">
          <ArticleP>
            {t("signoff.line")}{" "}
            <Link href={`/${locale}/help`} className={LINK_CLASS}>
              {t("signoff.helpLink")}
            </Link>
          </ArticleP>
          <Div className="flex flex-col">
            <Span className="text-2xl font-semibold tracking-tight text-foreground">
              {t("signoff.name")}
            </Span>
            <Span className="text-sm text-muted-foreground">
              {t("signoff.role")}
            </Span>
          </Div>
          <ArticleP className="text-muted-foreground italic">
            {t("signoff.sleep")}
          </ArticleP>
        </Div>

        <ArticleEnd
          post={{ slug: SLUG, locale }}
          back={back}
          title={t("cta.title")}
          subtitle={t("cta.subtitle")}
          actions={
            <>
              <Cta
                href={`/${locale}/skill/${theaSkill.id}`}
                label={t("cta.chat")}
                icon={MessageCircle}
              />
              <Cta
                href={GITHUB_REPO_URL}
                label={t("cta.github")}
                icon={Github}
                variant="secondary"
                external
              />
            </>
          }
        />
      </ArticleBody>
    </Div>
  );
}

export default async function AiAgentRunsAStartupPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
