import type { Metadata } from "next";
import { coreClientEnv as envClient } from "next-vibe/core/env-client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Div } from "next-vibe/ui/components/div";
import { Monitor } from "next-vibe/ui/components/icons/Monitor";
import { Server } from "next-vibe/ui/components/icons/Server";
import { Shield } from "next-vibe/ui/components/icons/Shield";
import { Terminal } from "next-vibe/ui/components/icons/Terminal";
import { P } from "next-vibe/ui/components/typography";
import type { JSX } from "react";

import { configScopedTranslation } from "@/env/i18n";

import {
  ArticleBody,
  ArticleCode,
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
  Step,
  StepList,
} from "../../_shared/marketing";
import { formatPostDate } from "../posts-meta";
import { scopedTranslation } from "./i18n";

export const revalidate = 3600;

/** Shipped with commit 4a24358341 (30 Oct 2026); post published 6 Nov 2026. */
// Mirrors providers/claude-code/repository.ts → injectTaskContext
const TASK_CONTEXT_SNIPPET = `[TASK CONTEXT] When the work is complete, call MCP tool "complete-task"
on MCP server "<your-instance>" with taskId="<task-id>"
and response={"output":"<full result text>"} - pass the complete result.`;

const CLI_SNIPPET = `# batch (default): runs headless, returns the output
vibe coding-agent "Fix the failing login test and run the suite"

# interactive: opens a terminal window, reports back when done
vibe coding-agent "Refactor the billing module" --interactiveMode=true`;

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
    path: "story/blog/interactive-coding-agent",
    title: t("meta.title", { appName }),
    category: t("meta.category"),
    description: t("meta.description"),
    image: `${envClient.NEXT_PUBLIC_APP_URL}/images/home-hero.jpg`,
    imageAlt: t("meta.imageAlt"),
    keywords: [t("meta.keywords", { appName })],
  });
};

export interface InteractiveCodingAgentPageData {
  locale: CountryLanguage;
}

export async function tanstackLoader({
  params,
}: Props): Promise<InteractiveCodingAgentPageData> {
  const { locale } = await params;
  return { locale };
}

export function TanstackPage({
  locale,
}: InteractiveCodingAgentPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const back = { href: `/${locale}/story/blog`, label: t("hero.backToBlog") };

  return (
    <Div className="min-h-screen bg-background">
      <ArticleHeader
        back={back}
        category={t("hero.category")}
        readTime={t("hero.readTime")}
        date={formatPostDate("interactive-coding-agent", locale)}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
      />

      <ArticleBody>
        <Div className="flex flex-col gap-5">
          <ArticleLead>{t("intro.p1")}</ArticleLead>
          <ArticleP>{t("intro.p2")}</ArticleP>
        </Div>

        <ArticleSection title={t("modes.title")} intro={t("modes.intro")}>
          <FeatureGrid columns={2}>
            <FeatureCard
              icon={Server}
              label={t("modes.batch.label")}
              title={t("modes.batch.title")}
            >
              {t("modes.batch.body")}
            </FeatureCard>
            <FeatureCard
              icon={Monitor}
              label={t("modes.interactive.label")}
              title={t("modes.interactive.title")}
              className="border-primary/30"
            >
              {t("modes.interactive.body")}
            </FeatureCard>
          </FeatureGrid>
        </ArticleSection>

        <ArticleSection title={t("handBack.title")} intro={t("handBack.intro")}>
          <Div className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <StepList>
              <Step
                number={1}
                title={t("handBack.step1Title")}
                description={t("handBack.step1Body")}
              />
              <Step
                number={2}
                title={t("handBack.step2Title")}
                description={t("handBack.step2Body")}
              />
              <Step
                number={3}
                title={t("handBack.step3Title")}
                description={t("handBack.step3Body")}
              />
              <Step
                number={4}
                title={t("handBack.step4Title")}
                description={t("handBack.step4Body")}
              />
              <Step
                number={5}
                title={t("handBack.step5Title")}
                description={t("handBack.step5Body")}
              />
            </StepList>
          </Div>
          <P className="text-sm font-medium text-foreground">
            {t("handBack.codeCaption")}
          </P>
          <ArticleCode
            code={TASK_CONTEXT_SNIPPET}
            language="text"
            filename="prompt"
          />
        </ArticleSection>

        <ArticleSection title={t("whatsNew.title")} intro={t("whatsNew.intro")}>
          <ArticleList
            items={[
              t("whatsNew.item1"),
              t("whatsNew.item2"),
              t("whatsNew.item3"),
              t("whatsNew.item4"),
              t("whatsNew.item5"),
            ]}
          />
        </ArticleSection>

        <ArticleSection title={t("tryIt.title")}>
          <Callout icon={Shield} tone="warning">
            {t("tryIt.p1")}
          </Callout>
          <ArticleP>{t("tryIt.p2")}</ArticleP>
          <ArticleCode code={CLI_SNIPPET} language="bash" filename="terminal" />
        </ArticleSection>

        <ArticleEnd
          back={back}
          title={t("cta.title")}
          subtitle={t("cta.subtitle")}
          actions={
            <>
              <Cta
                href={`/${locale}/story/self-host`}
                label={t("cta.selfHost")}
                icon={Terminal}
              />
              <Cta
                href={`/${locale}/story/framework`}
                label={t("cta.framework")}
                variant="secondary"
              />
            </>
          }
        />
      </ArticleBody>
    </Div>
  );
}

export default async function InteractiveCodingAgentPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
