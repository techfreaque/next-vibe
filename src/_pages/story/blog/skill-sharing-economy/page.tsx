import type { Metadata } from "next";
import { getEnvAvailability } from "next-vibe/agent/env-availability";
import { getAvailableModelCount } from "next-vibe/agent/models/all-models";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Div } from "next-vibe/ui/components/div";
import { Code } from "next-vibe/ui/components/icons/Code";
import { DollarSign } from "next-vibe/ui/components/icons/DollarSign";
import { Info } from "next-vibe/ui/components/icons/Info";
import { Languages } from "next-vibe/ui/components/icons/Languages";
import { Palette } from "next-vibe/ui/components/icons/Palette";
import { ShieldOff } from "next-vibe/ui/components/icons/ShieldOff";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "next-vibe/ui/components/table";
import type { JSX } from "react";

import { configScopedTranslation } from "@/env/i18n";

import {
  ArticleBody,
  ArticleEnd,
  ArticleH3,
  ArticleHeader,
  ArticleLead,
  ArticleList,
  ArticleP,
  ArticleQuote,
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
    modelCount: getAvailableModelCount(false, await getEnvAvailability()),
  };
}

export function TanstackPage({
  locale,
  modelCount,
}: SkillSharingEconomyPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  const back = { href: `/${locale}/story/blog`, label: t("hero.backToBlog") };

  const buildSteps = [
    {
      title: t("whatAreSkills.build1Title"),
      body: t("whatAreSkills.build1Body"),
    },
    {
      title: t("whatAreSkills.build2Title"),
      body: t("whatAreSkills.build2Body"),
    },
    {
      title: t("whatAreSkills.build3Title"),
      body: t("whatAreSkills.build3Body"),
    },
  ];

  const examples = [
    {
      icon: Code,
      title: t("examples.example1Title"),
      body: t("examples.example1Body"),
    },
    {
      icon: Palette,
      title: t("examples.example2Title"),
      body: t("examples.example2Body"),
    },
    {
      icon: ShieldOff,
      title: t("examples.example3Title"),
      body: t("examples.example3Body"),
    },
    {
      icon: Languages,
      title: t("examples.example4Title"),
      body: t("examples.example4Body"),
    },
  ];

  const mathRows = (["row1", "row2", "row3", "row4"] as const).map((row) => ({
    profile: t(`theMath.${row}Profile`),
    spend: t(`theMath.${row}Spend`),
    earn: t(`theMath.${row}Earn`),
  }));

  const howToSteps = [
    { title: t("howTo.step1Title"), body: t("howTo.step1Body") },
    { title: t("howTo.step2Title"), body: t("howTo.step2Body") },
    { title: t("howTo.step3Title"), body: t("howTo.step3Body") },
    { title: t("howTo.step4Title"), body: t("howTo.step4Body") },
    { title: t("howTo.step5Title"), body: t("howTo.step5Body") },
  ];

  return (
    <Div className="min-h-screen bg-background">
      <ArticleHeader
        back={back}
        category={t("hero.category")}
        readTime={t("hero.readTime")}
        date={formatPostDate("skill-sharing-economy", locale)}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
      />

      <ArticleBody>
        <ArticleQuote>{t("hero.quote")}</ArticleQuote>

        <ArticleSection title={t("whatAreSkills.title", { appName })}>
          <ArticleLead>{t("whatAreSkills.p1")}</ArticleLead>
          <ArticleP>{t("whatAreSkills.p2", { modelCount })}</ArticleP>
          <ArticleP>{t("whatAreSkills.p3")}</ArticleP>
          <ArticleH3>{t("whatAreSkills.buildTitle")}</ArticleH3>
          <StepList>
            {buildSteps.map((step, index) => (
              <Step
                key={step.title}
                number={index + 1}
                title={step.title}
                description={step.body}
              />
            ))}
          </StepList>
        </ArticleSection>

        <ArticleSection title={t("shareLink.title")}>
          <ArticleP>{t("shareLink.p1")}</ArticleP>
          <ArticleList
            items={[t("shareLink.bullet1"), t("shareLink.bullet2")]}
          />
          <ArticleP>{t("shareLink.p2")}</ArticleP>
          <ArticleP>{t("shareLink.p3")}</ArticleP>
          <Div className="overflow-x-auto rounded-xl border border-border bg-muted/60 px-4 py-3 font-mono text-xs text-foreground md:text-sm">
            {t("shareLink.p4", { appName })}
          </Div>
        </ArticleSection>

        <ArticleSection title={t("examples.title")}>
          <ArticleP>{t("examples.p1")}</ArticleP>
          <FeatureGrid columns={2}>
            {examples.map((example) => (
              <FeatureCard
                key={example.title}
                icon={example.icon}
                title={example.title}
              >
                {example.body}
              </FeatureCard>
            ))}
          </FeatureGrid>
        </ArticleSection>

        <ArticleSection title={t("theMath.title")}>
          <ArticleP>{t("theMath.p1")}</ArticleP>
          <Div className="overflow-hidden rounded-xl border border-border bg-card">
            <Table className="min-w-[30rem]">
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="text-xs font-semibold uppercase tracking-wide">
                    {t("theMath.tableHeaderProfile")}
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide">
                    {t("theMath.tableHeaderSpend")}
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-primary">
                    {t("theMath.tableHeaderEarn")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mathRows.map((row) => (
                  <TableRow key={row.profile}>
                    <TableCell className="text-foreground">
                      {row.profile}
                    </TableCell>
                    <TableCell className="text-muted-foreground tabular-nums">
                      {row.spend}
                    </TableCell>
                    <TableCell className="font-semibold text-primary tabular-nums">
                      {row.earn}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Div>
          <ArticleP>{t("theMath.p2")}</ArticleP>
          <ArticleP>{t("theMath.p3")}</ArticleP>
        </ArticleSection>

        <ArticleSection title={t("chain.title")}>
          <ArticleP>{t("chain.p1")}</ArticleP>
          <Div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
            {(["level1", "level2", "level3", "level4"] as const).map((key) => (
              <Div
                key={key}
                className="px-4 py-3 text-sm text-foreground/90 md:px-5"
              >
                {t(`chain.${key}`)}
              </Div>
            ))}
          </Div>
          <Callout tone="neutral" icon={Info}>
            {t("chain.p2")}
          </Callout>
        </ArticleSection>

        <ArticleSection title={t("howTo.title")}>
          <StepList>
            {howToSteps.map((step, index) => (
              <Step
                key={step.title}
                number={index + 1}
                title={step.title}
                description={step.body}
              />
            ))}
          </StepList>
        </ArticleSection>

        <ArticleEnd
          back={back}
          title={t("close.title")}
          subtitle={`${t("close.p1")} ${t("close.p2")}`}
          actions={
            <>
              <Cta href={`/${locale}/threads`} label={t("close.createSkill")} />
              <Cta
                href={`/${locale}/user/referral`}
                label={t("close.referralPage")}
                icon={DollarSign}
                variant="secondary"
              />
            </>
          }
        />
      </ArticleBody>
    </Div>
  );
}

export default async function SkillSharingEconomyPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
