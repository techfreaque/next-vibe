import type { Metadata } from "next";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Div } from "next-vibe/ui/components/div";
import { CheckCircle2 } from "next-vibe/ui/components/icons/CheckCircle2";
import { Info } from "next-vibe/ui/components/icons/Info";
import { MessageSquare } from "next-vibe/ui/components/icons/MessageSquare";
import { Sparkles } from "next-vibe/ui/components/icons/Sparkles";
import { XCircle } from "next-vibe/ui/components/icons/XCircle";
import { CodeSnippet } from "next-vibe/ui/components/markdown";
import { Span } from "next-vibe/ui/components/span";
import { P } from "next-vibe/ui/components/typography";
import type { JSX } from "react";

import { configScopedTranslation } from "@/env/i18n";

import {
  Callout,
  CardLink,
  Cta,
  CtaBand,
  FeatureCard,
  FeatureGrid,
  PageHero,
  PageSection,
} from "../_shared/marketing";
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
    path: "story/build-a-skill",
    title: t("meta.title"),
    category: t("meta.category"),
    description: t("meta.description", { appName }),
    image:
      "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=2070",
    imageAlt: t("meta.imageAlt", { appName }),
    keywords: [t("meta.keywords", { appName })],
  });
};

export interface BuildASkillPageData {
  locale: CountryLanguage;
}

export async function tanstackLoader({
  params,
}: Props): Promise<BuildASkillPageData> {
  const { locale } = await params;
  return { locale };
}

const SKILL_TS = `export const mySkill: Skill = {
  id: "my-skill",
  name: "My Skill",
  systemPrompt: \`You are [Name], [role].
[3–5 personality traits]
[What you know deeply / what you defer on]\`,
  availableTools: [tool("brave-search")],
  pinnedTools:    [tool("brave-search")],
  variants: [{
    id: "default", isDefault: true,
    modelSelection: {
      selectionType: ModelSelectionType.FILTERS,
      intelligenceRange: { min: IntelligenceLevel.SMART, max: IntelligenceLevel.BRILLIANT },
      contentRange: { min: ContentLevel.MAINSTREAM, max: ContentLevel.MAINSTREAM },
    },
  }],
};`;

export function TanstackPage({ locale }: BuildASkillPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");

  const ways = [
    {
      icon: Sparkles,
      badge: t("ways.way1Badge"),
      title: t("ways.way1Title"),
      body: t("ways.way1Body"),
      detail: t("ways.way1Detail"),
      cta: t("ways.way1Cta"),
      href: `/${locale}/skills`,
    },
    {
      icon: MessageSquare,
      badge: t("ways.way2Badge"),
      title: t("ways.way2Title"),
      body: t("ways.way2Body"),
      detail: t("ways.way2Detail"),
      cta: t("ways.way2Cta"),
      href: `/${locale}/threads`,
    },
  ];

  return (
    <Div className="min-h-screen bg-background">
      <PageHero
        centered
        eyebrow={t("hero.badge")}
        eyebrowIcon={Sparkles}
        title={
          <>
            {t("hero.title")}{" "}
            <Span className="text-primary">{t("hero.titleLine2")}</Span>
          </>
        }
        subtitle={t("hero.subtitle")}
        actions={
          <>
            <Cta href={`/${locale}/skills`} label={t("hero.ctaPrimary")} />
            <Cta
              href={`/${locale}/threads`}
              label={t("hero.ctaSecondary")}
              icon={MessageSquare}
              variant="secondary"
            />
          </>
        }
      />

      {/* What is a skill */}
      <PageSection
        title={t("what.title")}
        intro={t("what.subtitle", { appName })}
      >
        <FeatureGrid columns={4}>
          {([0, 1, 2, 3] as const).map((i) => (
            <FeatureCard
              key={i}
              label={`0${i + 1}`}
              title={t(`what.item${i}Label`)}
            >
              {t(`what.item${i}Body`)}
            </FeatureCard>
          ))}
        </FeatureGrid>
      </PageSection>

      {/* Two ways */}
      <PageSection
        tone="muted"
        title={t("ways.title")}
        intro={t("ways.subtitle")}
      >
        <FeatureGrid columns={2}>
          {ways.map((way) => (
            <FeatureCard
              key={way.href}
              icon={way.icon}
              label={way.badge}
              title={way.title}
              footer={<CardLink href={way.href} label={way.cta} />}
            >
              <P className="leading-relaxed">{way.body}</P>
              <P className="mt-4 border-t border-border pt-4 text-xs">
                {way.detail}
              </P>
            </FeatureCard>
          ))}
        </FeatureGrid>
      </PageSection>

      {/* System prompt do / don't */}
      <PageSection title={t("prompt.title")} intro={t("prompt.subtitle")}>
        <Div className="grid gap-6 md:grid-cols-2">
          <Div className="rounded-xl border border-border bg-card p-6 shadow-xs">
            <Div className="mb-5 flex items-center gap-2 font-semibold">
              <CheckCircle2 className="h-5 w-5 text-success" />
              {t("prompt.dos")}
            </Div>
            <Div className="flex flex-col divide-y divide-border">
              {([0, 1, 2, 3, 4] as const).map((i) => (
                <Div key={i} className="py-3 first:pt-0 last:pb-0">
                  <P className="text-sm font-semibold">
                    {t(`prompt.do${i}Title`)}
                  </P>
                  <P className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                    {t(`prompt.do${i}Body`)}
                  </P>
                </Div>
              ))}
            </Div>
          </Div>
          <Div className="rounded-xl border border-border bg-card p-6 shadow-xs">
            <Div className="mb-5 flex items-center gap-2 font-semibold">
              <XCircle className="h-5 w-5 text-destructive" />
              {t("prompt.donts")}
            </Div>
            <Div className="flex flex-col divide-y divide-border">
              {([0, 1, 2, 3] as const).map((i) => (
                <Div key={i} className="py-3 first:pt-0 last:pb-0">
                  <P className="text-sm font-semibold">
                    {t(`prompt.dont${i}Title`)}
                  </P>
                  <P className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                    {t(`prompt.dont${i}Body`)}
                  </P>
                </Div>
              ))}
            </Div>
          </Div>
        </Div>
      </PageSection>

      {/* Examples */}
      <PageSection tone="muted" title={t("examples.title")}>
        <FeatureGrid columns={3}>
          {([0, 1, 2, 3, 4, 5] as const).map((i) => (
            <FeatureCard
              key={i}
              label={t(`examples.item${i}Category`)}
              title={t(`examples.item${i}Name`)}
            >
              {t(`examples.item${i}Desc`)}
            </FeatureCard>
          ))}
        </FeatureGrid>
      </PageSection>

      {/* For developers */}
      <PageSection title={t("dev.title")} intro={t("dev.body")}>
        <Div className="max-w-3xl">
          <Div className="min-w-0 max-w-full">
            <CodeSnippet
              code={SKILL_TS}
              language="typescript"
              filename="skill.ts"
              variant="file"
            />
          </Div>
          <Callout icon={Info} className="mt-4">
            {t("dev.note")}
          </Callout>
        </Div>
      </PageSection>

      <CtaBand
        title={t("cta.title")}
        subtitle={t("cta.subtitle")}
        actions={
          <>
            <Cta href={`/${locale}/skills`} label={t("cta.primary")} />
            <Cta
              href={`/${locale}/threads`}
              label={t("cta.secondary")}
              icon={MessageSquare}
              variant="secondary"
            />
          </>
        }
      />
    </Div>
  );
}

export default async function BuildASkillPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
