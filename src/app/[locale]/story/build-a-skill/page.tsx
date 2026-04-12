/* eslint-disable oxlint-plugin-i18n/no-literal-string -- code snippet is not user-facing */
import type { Metadata } from "next";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Container } from "next-vibe-ui/ui/container";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowRight } from "next-vibe-ui/ui/icons/ArrowRight";
import { CheckCircle2 } from "next-vibe-ui/ui/icons/CheckCircle2";
import { MessageSquare } from "next-vibe-ui/ui/icons/MessageSquare";
import { Sparkles } from "next-vibe-ui/ui/icons/Sparkles";
import { XCircle } from "next-vibe-ui/ui/icons/XCircle";
import { Link } from "next-vibe-ui/ui/link";
import { CodeBlock } from "next-vibe-ui/ui/markdown";
import { Separator } from "next-vibe-ui/ui/separator";
import { Span } from "next-vibe-ui/ui/span";
import { H1, H2, H3, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

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

  return (
    <Div className="min-h-screen bg-background">
      {/* HERO */}
      <Div className="relative overflow-hidden border-b border-border/40">
        <Div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(139,92,246,0.18) 0%, transparent 70%)",
          }}
        />
        <Container
          size="lg"
          className="relative py-24 md:py-32 text-center flex flex-col items-center"
        >
          <Badge
            variant="outline"
            className="mb-6 border-violet-500/30 bg-violet-500/10 text-violet-400 text-xs uppercase tracking-wider"
          >
            {t("hero.badge")}
          </Badge>
          <H1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-6 max-w-2xl">
            {t("hero.title")}
            <Span className="block text-transparent bg-clip-text bg-linear-to-br from-violet-400 to-purple-300">
              {t("hero.titleLine2")}
            </Span>
          </H1>
          <P className="text-lg text-muted-foreground max-w-lg mb-10 leading-relaxed">
            {t("hero.subtitle")}
          </P>
          <Div className="flex flex-wrap justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="bg-violet-600 hover:bg-violet-500 text-white border-0 font-semibold gap-2"
            >
              <Link href={`/${locale}/skills`}>
                <Sparkles className="h-4 w-4" />
                {t("hero.ctaPrimary")}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2">
              <Link href={`/${locale}/threads`}>
                <MessageSquare className="h-4 w-4" />
                {t("hero.ctaSecondary")}
              </Link>
            </Button>
          </Div>
        </Container>
      </Div>

      <Container size="lg" className="py-20 space-y-20">
        {/* WHAT IS A SKILL */}
        <Div>
          <H2 className="text-3xl font-bold mb-2 text-center">
            {t("what.title")}
          </H2>
          <P className="text-muted-foreground mb-8 max-w-xl text-center mx-auto">
            {t("what.subtitle", { appName })}
          </P>
          <Div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {([0, 1, 2, 3] as const).map((i) => (
              <Card
                key={i}
                className="border-violet-200/40 dark:border-violet-800/20 bg-violet-50/20 dark:bg-violet-950/10"
              >
                <CardContent className="pt-4 pb-4">
                  <Div className="text-[10px] font-bold text-violet-500 dark:text-violet-400 uppercase tracking-widest mb-2">
                    {t(`what.item${i}Label`)}
                  </Div>
                  <P className="text-sm text-muted-foreground leading-snug">
                    {t(`what.item${i}Body`)}
                  </P>
                </CardContent>
              </Card>
            ))}
          </Div>
        </Div>

        <Separator />

        {/* TWO WAYS */}
        <Div>
          <H2 className="text-3xl font-bold mb-2 text-center">
            {t("ways.title")}
          </H2>
          <P className="text-muted-foreground mb-8 text-center">
            {t("ways.subtitle")}
          </P>
          <Div className="grid md:grid-cols-2 gap-4">
            <Card className="border-violet-200/60 dark:border-violet-800/30">
              <CardContent className="pt-5 flex flex-col gap-3">
                <Badge
                  variant="outline"
                  className="w-fit text-[10px] bg-violet-50 text-violet-700 border-violet-300 dark:bg-violet-950/40 dark:text-violet-400 dark:border-violet-700"
                >
                  {t("ways.way1Badge")}
                </Badge>
                <H3 className="font-bold">{t("ways.way1Title")}</H3>
                <P className="text-sm text-muted-foreground leading-relaxed">
                  {t("ways.way1Body")}
                </P>
                <Div className="text-xs text-muted-foreground/60 border-t border-border/40 pt-3">
                  {t("ways.way1Detail")}
                </Div>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="self-start gap-2"
                >
                  <Link href={`/${locale}/skills`}>
                    {t("ways.way1Cta")} <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-emerald-200/60 dark:border-emerald-800/30">
              <CardContent className="pt-5 flex flex-col gap-3">
                <Badge
                  variant="outline"
                  className="w-fit text-[10px] bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-700"
                >
                  {t("ways.way2Badge")}
                </Badge>
                <H3 className="font-bold">{t("ways.way2Title")}</H3>
                <P className="text-sm text-muted-foreground leading-relaxed">
                  {t("ways.way2Body")}
                </P>
                <Div className="text-xs text-muted-foreground/60 border-t border-border/40 pt-3">
                  {t("ways.way2Detail")}
                </Div>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="self-start gap-2"
                >
                  <Link href={`/${locale}/threads`}>
                    {t("ways.way2Cta")} <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </Div>
        </Div>

        <Separator />

        {/* SYSTEM PROMPT */}
        <Div>
          <H2 className="text-3xl font-bold mb-2 text-center">
            {t("prompt.title")}
          </H2>
          <P className="text-muted-foreground mb-8 text-center">
            {t("prompt.subtitle")}
          </P>
          <Div className="grid md:grid-cols-2 gap-4">
            <Div className="space-y-2">
              <Div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <Span className="text-sm font-semibold">{t("prompt.dos")}</Span>
              </Div>
              {([0, 1, 2, 3, 4] as const).map((i) => (
                <Div
                  key={i}
                  className="flex gap-3 rounded-lg border border-emerald-200/50 dark:border-emerald-800/30 bg-emerald-50/30 dark:bg-emerald-950/10 px-3 py-2.5"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  <Div>
                    <Div className="text-xs font-semibold mb-0.5">
                      {t(`prompt.do${i}Title`)}
                    </Div>
                    <Div className="text-xs text-muted-foreground">
                      {t(`prompt.do${i}Body`)}
                    </Div>
                  </Div>
                </Div>
              ))}
            </Div>
            <Div className="space-y-2">
              <Div className="flex items-center gap-2 mb-3">
                <XCircle className="h-4 w-4 text-red-500" />
                <Span className="text-sm font-semibold">
                  {t("prompt.donts")}
                </Span>
              </Div>
              {([0, 1, 2, 3] as const).map((i) => (
                <Div
                  key={i}
                  className="flex gap-3 rounded-lg border border-red-200/50 dark:border-red-800/30 bg-red-50/30 dark:bg-red-950/10 px-3 py-2.5"
                >
                  <XCircle className="h-3.5 w-3.5 text-red-500 mt-0.5 shrink-0" />
                  <Div>
                    <Div className="text-xs font-semibold mb-0.5">
                      {t(`prompt.dont${i}Title`)}
                    </Div>
                    <Div className="text-xs text-muted-foreground">
                      {t(`prompt.dont${i}Body`)}
                    </Div>
                  </Div>
                </Div>
              ))}
            </Div>
          </Div>
        </Div>

        <Separator />

        {/* EXAMPLES */}
        <Div>
          <H2 className="text-3xl font-bold mb-8 text-center">
            {t("examples.title")}
          </H2>
          <Div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {([0, 1, 2, 3, 4, 5] as const).map((i) => (
              <Card key={i} className="hover:bg-muted/30 transition-colors">
                <CardContent className="pt-4 pb-4">
                  <Div className="flex items-start justify-between mb-2">
                    <Div className="font-semibold text-sm">
                      {t(`examples.item${i}Name`)}
                    </Div>
                    <Badge
                      variant="outline"
                      className="text-[10px] shrink-0 ml-2"
                    >
                      {t(`examples.item${i}Category`)}
                    </Badge>
                  </Div>
                  <P className="text-xs text-muted-foreground leading-relaxed">
                    {t(`examples.item${i}Desc`)}
                  </P>
                </CardContent>
              </Card>
            ))}
          </Div>
        </Div>

        <Separator />

        {/* FOR DEVELOPERS */}
        <Div>
          <H2 className="text-3xl font-bold mb-2 text-center">
            {t("dev.title")}
          </H2>
          <P className="text-sm text-muted-foreground mb-6 text-center">
            {t("dev.body")}
          </P>
          <CodeBlock code={SKILL_TS} language="typescript" />
          <Div className="mt-3 text-xs text-violet-700 dark:text-violet-400 rounded-lg border border-violet-200 dark:border-violet-800/40 bg-violet-50 dark:bg-violet-950/20 px-4 py-3">
            {t("dev.note")}
          </Div>
        </Div>
      </Container>

      {/* CTA */}
      <Div className="border-t border-border/40 bg-muted/10">
        <Container size="lg" className="py-20 text-center">
          <H2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
            {t("cta.title")}
          </H2>
          <P className="text-muted-foreground mb-8 max-w-sm mx-auto">
            {t("cta.subtitle")}
          </P>
          <Div className="flex flex-wrap justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="bg-violet-600 hover:bg-violet-500 text-white border-0 font-semibold gap-2"
            >
              <Link href={`/${locale}/skills`}>
                <Sparkles className="h-4 w-4" />
                {t("cta.primary")}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2">
              <Link href={`/${locale}/threads`}>
                <MessageSquare className="h-4 w-4" />
                {t("cta.secondary")}
              </Link>
            </Button>
          </Div>
        </Container>
      </Div>
    </Div>
  );
}

export default async function BuildASkillPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
