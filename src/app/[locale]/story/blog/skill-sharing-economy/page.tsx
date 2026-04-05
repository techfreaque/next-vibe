import type { Metadata } from "next";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { ArrowRight } from "next-vibe-ui/ui/icons/ArrowRight";
import { Code } from "next-vibe-ui/ui/icons/Code";
import { DollarSign } from "next-vibe-ui/ui/icons/DollarSign";
import { Palette } from "next-vibe-ui/ui/icons/Palette";
import { ShieldOff } from "next-vibe-ui/ui/icons/ShieldOff";
import { Languages } from "next-vibe-ui/ui/icons/Languages";

import { Link } from "next-vibe-ui/ui/link";
import { Separator } from "next-vibe-ui/ui/separator";
import { H1, H2, Muted, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import { agentEnvAvailability } from "@/app/api/[locale]/agent/env-availability";
import { getAvailableModelCount } from "@/app/api/[locale]/agent/models/all-models";
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
    path: "story/blog/skill-sharing-economy",
    title: t("meta.title"),
    category: t("meta.category"),
    description: t("meta.description", { appName }),
    image:
      "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=2070",
    imageAlt: t("meta.imageAlt"),
    keywords: [t("meta.keywords", { appName })],
  });
};

export interface SkillSharingEconomyPageData {
  locale: CountryLanguage;
  modelCount: number;
}

export async function tanstackLoader({
  params,
}: Props): Promise<SkillSharingEconomyPageData> {
  const { locale } = await params;
  return {
    locale,
    modelCount: getAvailableModelCount(agentEnvAvailability, false),
  };
}

function ScenarioCard({
  label,
  spend,
  earn,
}: {
  label: string;
  spend: string;
  earn: string;
}): JSX.Element {
  return (
    <Div className="rounded-xl border p-4 bg-muted/30">
      <Div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
        {label}
      </Div>
      <Div className="text-sm font-medium">{spend}</Div>
      <Div className="text-sm text-violet-600 dark:text-violet-400 font-semibold mt-1">
        {earn}
      </Div>
    </Div>
  );
}

function StepCard({
  number,
  title,
  body,
}: {
  number: number;
  title: string;
  body: string;
}): JSX.Element {
  return (
    <Div className="flex gap-4">
      <Div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-sm font-bold">
        {number}
      </Div>
      <Div>
        <Div className="font-semibold text-sm mb-1">{title}</Div>
        <Div className="text-sm text-muted-foreground">{body}</Div>
      </Div>
    </Div>
  );
}

function ExampleCard({
  icon: IconComponent,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}): JSX.Element {
  return (
    <Div className="rounded-xl border p-4 bg-muted/20">
      <Div className="flex items-center gap-2 mb-2">
        <IconComponent className="h-4 w-4 text-violet-600 dark:text-violet-400" />
        <Div className="font-semibold text-sm">{title}</Div>
      </Div>
      <Div className="text-sm text-muted-foreground">{body}</Div>
    </Div>
  );
}

export function TanstackPage({
  locale,
  modelCount,
}: SkillSharingEconomyPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");

  return (
    <Div className="min-h-screen bg-background">
      {/* Header bar */}
      <Div className="bg-violet-600 border-b border-violet-700">
        <Div className="container mx-auto px-4 py-3 max-w-4xl">
          <Div className="flex items-center gap-3">
            <Div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center font-bold text-white text-xs">
              {t("hero.icon")}
            </Div>
            <P className="text-white font-semibold text-sm">
              {t("hero.brand", { appName })}
              {t("hero.category")}
            </P>
          </Div>
        </Div>
      </Div>

      {/* Hero */}
      <Div className="bg-violet-50 dark:bg-violet-950/20 border-b border-violet-100 dark:border-violet-900/40">
        <Div className="container mx-auto px-4 py-12 max-w-4xl">
          <Link
            href={`/${locale}/story/blog`}
            className="inline-flex items-center text-sm text-violet-700 dark:text-violet-400 hover:text-violet-900 dark:hover:text-violet-300 mb-8 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("hero.backToBlog")}
          </Link>

          <Div className="flex items-center gap-3 mb-6">
            <Div className="px-3 py-1 bg-violet-600 rounded-full text-white text-xs font-semibold uppercase tracking-wider">
              {t("hero.category")}
            </Div>
            <Muted className="text-xs">{t("hero.readTime")}</Muted>
          </Div>

          <H1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {t("hero.title")}
          </H1>
          <P className="text-xl text-muted-foreground mb-6 max-w-2xl">
            {t("hero.subtitle")}
          </P>
          <Div className="inline-block px-5 py-3 rounded-xl bg-white dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800 text-violet-800 dark:text-violet-200 text-sm italic max-w-xl">
            {t("hero.quote")}
          </Div>
        </Div>
      </Div>

      <Div className="container mx-auto px-4 py-16 max-w-4xl space-y-16">
        {/* What are skills */}
        <Div>
          <H2 className="text-2xl font-bold mb-6">
            {t("whatAreSkills.title", { appName })}
          </H2>
          <P className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t("whatAreSkills.p1")}
          </P>
          <P className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t("whatAreSkills.p2", { modelCount })}
          </P>
          <P className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
            {t("whatAreSkills.p3")}
          </P>

          <Div className="font-semibold text-sm mb-4">
            {t("whatAreSkills.buildTitle")}
          </Div>
          <Div className="space-y-4">
            {(
              [
                {
                  num: 1,
                  title: t("whatAreSkills.build1Title"),
                  body: t("whatAreSkills.build1Body"),
                },
                {
                  num: 2,
                  title: t("whatAreSkills.build2Title"),
                  body: t("whatAreSkills.build2Body"),
                },
                {
                  num: 3,
                  title: t("whatAreSkills.build3Title"),
                  body: t("whatAreSkills.build3Body"),
                },
              ] as const
            ).map(({ num, title, body }) => (
              <Div key={num} className="flex gap-4">
                <Div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-sm font-bold">
                  {num}
                </Div>
                <Div>
                  <Div className="font-semibold text-sm mb-1">{title}</Div>
                  <Div className="text-sm text-muted-foreground leading-relaxed">
                    {body}
                  </Div>
                </Div>
              </Div>
            ))}
          </Div>
        </Div>

        <Separator />

        {/* The share link mechanic */}
        <Div>
          <H2 className="text-2xl font-bold mb-6">{t("shareLink.title")}</H2>
          <P className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t("shareLink.p1")}
          </P>
          <Div className="space-y-2 mb-6 pl-4 border-l-2 border-violet-300 dark:border-violet-700">
            <P className="text-gray-700 dark:text-gray-300 text-sm">
              {t("shareLink.bullet1")}
            </P>
            <P className="text-gray-700 dark:text-gray-300 text-sm">
              {t("shareLink.bullet2")}
            </P>
          </Div>
          <Div className="p-4 rounded-lg bg-muted/50 border font-mono text-xs mb-6 overflow-x-auto">
            {t("shareLink.p2", { appName })}
          </Div>
          <P className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {t("shareLink.p3")}
          </P>
        </Div>

        <Separator />

        {/* Examples */}
        <Div>
          <H2 className="text-2xl font-bold mb-6">{t("examples.title")}</H2>
          <P className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            {t("examples.p1")}
          </P>
          <Div className="grid sm:grid-cols-2 gap-4">
            <ExampleCard
              icon={Code}
              title={t("examples.example1Title")}
              body={t("examples.example1Body")}
            />
            <ExampleCard
              icon={Palette}
              title={t("examples.example2Title")}
              body={t("examples.example2Body")}
            />
            <ExampleCard
              icon={ShieldOff}
              title={t("examples.example3Title")}
              body={t("examples.example3Body")}
            />
            <ExampleCard
              icon={Languages}
              title={t("examples.example4Title")}
              body={t("examples.example4Body")}
            />
          </Div>
        </Div>

        <Separator />

        {/* The math */}
        <Div>
          <H2 className="text-2xl font-bold mb-6">{t("theMath.title")}</H2>
          <P className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            {t("theMath.p1")}
          </P>
          <Div className="grid sm:grid-cols-2 gap-4 mb-6">
            <ScenarioCard
              label={t("theMath.scenario1Label")}
              spend={t("theMath.scenario1Spend")}
              earn={t("theMath.scenario1Earn")}
            />
            <ScenarioCard
              label={t("theMath.scenario2Label")}
              spend={t("theMath.scenario2Spend")}
              earn={t("theMath.scenario2Earn")}
            />
          </Div>
          <P className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t("theMath.p2")}
          </P>
          <P className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {t("theMath.p3")}
          </P>
        </Div>

        <Separator />

        {/* How to */}
        <Div>
          <H2 className="text-2xl font-bold mb-8">{t("howTo.title")}</H2>
          <Div className="space-y-6">
            <StepCard
              number={1}
              title={t("howTo.step1Title")}
              body={t("howTo.step1Body")}
            />
            <StepCard
              number={2}
              title={t("howTo.step2Title")}
              body={t("howTo.step2Body")}
            />
            <StepCard
              number={3}
              title={t("howTo.step3Title")}
              body={t("howTo.step3Body")}
            />
            <StepCard
              number={4}
              title={t("howTo.step4Title")}
              body={t("howTo.step4Body")}
            />
            <StepCard
              number={5}
              title={t("howTo.step5Title")}
              body={t("howTo.step5Body")}
            />
          </Div>
        </Div>

        <Separator />

        {/* Close */}
        <Div>
          <H2 className="text-2xl font-bold mb-6">{t("close.title")}</H2>
          <P className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t("close.p1")}
          </P>
          <P className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
            {t("close.p2")}
          </P>

          <Div className="flex flex-col sm:flex-row gap-3">
            <Button
              asChild
              size="lg"
              className="gap-2 bg-violet-600 hover:bg-violet-700 text-white"
            >
              <Link href={`/${locale}/threads`}>
                {t("close.createSkill")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link href={`/${locale}/user/referral`}>
                <DollarSign className="h-4 w-4" />
                {t("close.referralPage")}
              </Link>
            </Button>
          </Div>
        </Div>

        <Div className="flex justify-start pt-4">
          <Button asChild variant="outline">
            <Link href={`/${locale}/story/blog`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("hero.backToBlog")}
            </Link>
          </Button>
        </Div>
      </Div>
    </Div>
  );
}

export default async function SkillSharingEconomyPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
