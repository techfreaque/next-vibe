import type { Metadata } from "next";
import { coreClientEnv as envClient } from "next-vibe/core/env-client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Div } from "next-vibe/ui/components/div";
import { Cloud } from "next-vibe/ui/components/icons/Cloud";
import { Github } from "next-vibe/ui/components/icons/Github";
import { Key } from "next-vibe/ui/components/icons/Key";
import { Monitor } from "next-vibe/ui/components/icons/Monitor";
import { Server } from "next-vibe/ui/components/icons/Server";
import { Span } from "next-vibe/ui/components/span";
import { P } from "next-vibe/ui/components/typography";
import type { JSX } from "react";

import { GITHUB_REPO_URL } from "@/env/constants";
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
const RELAY_MARKER_SNIPPET = `// relay/constants.ts
export const RELAY_RECEIVER_NO_PROVIDER_KEY =
  "[relay-receiver-no-provider-key]";

// receiver: no provider key on this node? fail fast, let the caller run it
if (ctx.mode === "relay" && data.model) {
  const missingKey = getMissingProviderKeyMessage(getChatModelById(data.model));
  if (missingKey !== null) {
    return fail({ /* ...marker + reason... */ });
  }
}`;

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
    path: "story/blog/hermes-thea-two-way-remote",
    title: t("meta.title", { appName }),
    category: t("meta.category"),
    description: t("meta.description"),
    image: `${envClient.NEXT_PUBLIC_APP_URL}/images/home-hero.jpg`,
    imageAlt: t("meta.imageAlt"),
    keywords: [t("meta.keywords", { appName })],
  });
};

export interface HermesTheaPageData {
  locale: CountryLanguage;
}

export async function tanstackLoader({
  params,
}: Props): Promise<HermesTheaPageData> {
  const { locale } = await params;
  return { locale };
}

function ScenarioRow({
  label,
  body,
  highlight,
}: {
  label: string;
  body: string;
  highlight: boolean;
}): JSX.Element {
  return (
    <Div
      className={
        highlight
          ? "grid gap-1 rounded-xl border border-primary/30 bg-primary/5 p-4 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-4"
          : "grid gap-1 rounded-xl border border-border bg-card p-4 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-4"
      }
    >
      <Span className="text-sm font-semibold text-foreground">{label}</Span>
      <Span className="text-sm leading-relaxed text-muted-foreground">
        {body}
      </Span>
    </Div>
  );
}

export function TanstackPage({ locale }: HermesTheaPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const back = { href: `/${locale}/story/blog`, label: t("hero.backToBlog") };

  return (
    <Div className="min-h-screen bg-background">
      <ArticleHeader
        back={back}
        category={t("hero.category")}
        readTime={t("hero.readTime")}
        date={formatPostDate("hermes-thea-two-way-remote", locale)}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
      />

      <ArticleBody>
        <Div className="flex flex-col gap-5">
          <ArticleLead>{t("intro.p1")}</ArticleLead>
          <ArticleP>{t("intro.p2")}</ArticleP>
        </Div>

        <ArticleSection title={t("who.title")} intro={t("who.intro")}>
          <FeatureGrid columns={2}>
            <FeatureCard
              icon={Monitor}
              label={t("who.hermes.label")}
              title={t("who.hermes.title")}
            >
              {t("who.hermes.body")}
            </FeatureCard>
            <FeatureCard
              icon={Cloud}
              label={t("who.thea.label")}
              title={t("who.thea.title")}
            >
              {t("who.thea.body")}
            </FeatureCard>
          </FeatureGrid>
          <ArticleP>{t("who.note")}</ArticleP>
        </ArticleSection>

        <ArticleSection title={t("twoWay.title")} intro={t("twoWay.intro")}>
          <ArticleP>{t("twoWay.p1")}</ArticleP>
          <Div className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <P className="mb-6 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {t("twoWay.stepsTitle")}
            </P>
            <StepList>
              <Step
                number={1}
                title={t("twoWay.step1Title")}
                description={t("twoWay.step1Body")}
              />
              <Step
                number={2}
                title={t("twoWay.step2Title")}
                description={t("twoWay.step2Body")}
              />
              <Step
                number={3}
                title={t("twoWay.step3Title")}
                description={t("twoWay.step3Body")}
              />
              <Step
                number={4}
                title={t("twoWay.step4Title")}
                description={t("twoWay.step4Body")}
              />
              <Step
                number={5}
                title={t("twoWay.step5Title")}
                description={t("twoWay.step5Body")}
              />
            </StepList>
          </Div>
        </ArticleSection>

        <ArticleSection title={t("keyless.title")} intro={t("keyless.intro")}>
          <ArticleP>{t("keyless.p1")}</ArticleP>
          <ArticleP>{t("keyless.p2")}</ArticleP>
          <Div className="flex flex-col gap-3">
            <P className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {t("keyless.scenarioTitle")}
            </P>
            <ScenarioRow
              label={t("keyless.scenario1Label")}
              body={t("keyless.scenario1Body")}
              highlight={false}
            />
            <ScenarioRow
              label={t("keyless.scenario2Label")}
              body={t("keyless.scenario2Body")}
              highlight
            />
            <ScenarioRow
              label={t("keyless.scenario3Label")}
              body={t("keyless.scenario3Body")}
              highlight={false}
            />
          </Div>
          <Callout icon={Key}>
            <Span className="font-semibold">{t("keyless.calloutTitle")}</Span>{" "}
            <Span className="text-muted-foreground">
              {t("keyless.calloutBody")}
            </Span>
          </Callout>
        </ArticleSection>

        <ArticleSection
          title={t("underTheHood.title")}
          intro={t("underTheHood.intro")}
        >
          <ArticleP>{t("underTheHood.transport")}</ArticleP>
          <ArticleP>{t("underTheHood.reconnect")}</ArticleP>
          <ArticleP className="font-medium text-foreground">
            {t("underTheHood.codeCaption")}
          </ArticleP>
          <ArticleCode
            code={RELAY_MARKER_SNIPPET}
            language="typescript"
            filename="relay/receiver.ts"
          />
          <ArticleP className="font-semibold text-foreground">
            {t("underTheHood.fixesTitle")}
          </ArticleP>
          <ArticleList
            items={[
              t("underTheHood.fix1"),
              t("underTheHood.fix2"),
              t("underTheHood.fix3"),
              t("underTheHood.fix4"),
            ]}
          />
        </ArticleSection>

        <ArticleSection title={t("tryIt.title")}>
          <Callout icon={Server} tone="neutral">
            {t("tryIt.p1")}
          </Callout>
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
                icon={Server}
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

export default async function HermesTheaPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
