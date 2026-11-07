import type { Metadata } from "next";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Div } from "next-vibe/ui/components/div";
import { Info } from "next-vibe/ui/components/icons/Info";
import { MessageSquare } from "next-vibe/ui/components/icons/MessageSquare";
import { Quote } from "next-vibe/ui/components/icons/Quote";
import { TrendingUp } from "next-vibe/ui/components/icons/TrendingUp";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "next-vibe/ui/components/table";
import { P } from "next-vibe/ui/components/typography";
import type { JSX } from "react";

import { configScopedTranslation } from "@/env/i18n";

import {
  ArticleBody,
  ArticleEnd,
  ArticleHeader,
  ArticleLead,
  ArticleP,
  ArticleSection,
} from "../../_shared/article";
import { Callout, Cta } from "../../_shared/marketing";
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
  return metadataGenerator(locale, {
    path: "story/blog/referral-for-developers",
    title: t("meta.title"),
    category: t("meta.category"),
    description: t("meta.description"),
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070",
    imageAlt: t("meta.imageAlt"),
    keywords: [t("meta.keywords")],
  });
};

export interface ReferralDevelopersPageData {
  locale: CountryLanguage;
}

export async function tanstackLoader({
  params,
}: Props): Promise<ReferralDevelopersPageData> {
  const { locale } = await params;
  return { locale };
}

function ChainList({
  items,
}: {
  items: ReadonlyArray<{ key: string; label: string; total: boolean }>;
}): JSX.Element {
  return (
    <Div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
      {items.map((item) => (
        <Div
          key={item.key}
          className={
            item.total
              ? "bg-primary/5 px-4 py-3 text-sm font-semibold text-primary md:px-5"
              : "px-4 py-3 text-sm text-foreground/90 md:px-5"
          }
        >
          {item.label}
        </Div>
      ))}
    </Div>
  );
}

export function TanstackPage({
  locale,
}: ReferralDevelopersPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  const back = { href: `/${locale}/story/blog`, label: t("hero.backToBlog") };

  const examples = [
    t("useCase.examples.0", { appName }),
    t("useCase.examples.1", { appName }),
    t("useCase.examples.2", { appName }),
    t("useCase.examples.3", { appName }),
  ];

  const mathRows = ([0, 1, 2, 3] as const).map((i) => ({
    profile: t(`math.rows.${i}.profile`),
    spend: t(`math.rows.${i}.spend`),
    direct: t(`math.rows.${i}.direct`),
    skill: t(`math.rows.${i}.skill`),
  }));

  const chainKeys = [
    "level0",
    "level1",
    "level2",
    "level3",
    "level4",
    "total",
  ] as const;

  return (
    <Div className="min-h-screen bg-background">
      <ArticleHeader
        back={back}
        category={t("hero.category")}
        readTime={t("hero.readTime")}
        date={formatPostDate("referral-for-developers", locale)}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
      />

      <ArticleBody>
        <ArticleSection title={t("useCase.title")}>
          <ArticleLead>{t("useCase.p1")}</ArticleLead>
          <ArticleP>{t("useCase.p2", { appName })}</ArticleP>
          <Div className="flex flex-col gap-3">
            {examples.map((example) => (
              <Div
                key={example}
                className="flex gap-3 rounded-xl border border-border bg-card p-4"
              >
                <Quote className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <P className="text-sm leading-relaxed text-foreground/90 md:text-base">
                  {example}
                </P>
              </Div>
            ))}
          </Div>
        </ArticleSection>

        <ArticleSection title={t("skillAngle.title")}>
          <ArticleP>{t("skillAngle.p1")}</ArticleP>
          <ArticleP>{t("skillAngle.p2")}</ArticleP>
          <ArticleP>{t("skillAngle.p3")}</ArticleP>
        </ArticleSection>

        <ArticleSection title={t("math.title")} intro={t("math.subtitle")}>
          <Div className="overflow-hidden rounded-xl border border-border bg-card">
            <Table className="min-w-[34rem]">
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="text-xs font-semibold uppercase tracking-wide">
                    {t("math.tableHeaderProfile")}
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide">
                    {t("math.tableHeaderSpend")}
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide">
                    {t("math.tableHeaderDirect")}
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-primary">
                    {t("math.tableHeaderSkill")}
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
                    <TableCell className="text-foreground tabular-nums">
                      {row.direct}
                    </TableCell>
                    <TableCell className="font-semibold text-primary tabular-nums">
                      {row.skill}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Div>
          <Callout tone="neutral" icon={Info}>
            {t("math.note", { appName })}
          </Callout>
          <Callout tone="success" icon={TrendingUp}>
            {t("math.growthNote", { appName })}
          </Callout>
        </ArticleSection>

        <ArticleSection title={t("chain.title")}>
          <ArticleP>{t("chain.p1")}</ArticleP>
          <ChainList
            items={chainKeys.map((key) => ({
              key,
              label: t(`chain.${key}`),
              total: key === "total",
            }))}
          />
          <ArticleP>{t("chain.p2")}</ArticleP>
        </ArticleSection>

        <ArticleSection title={t("crypto.title")}>
          <ArticleP>{t("crypto.p1")}</ArticleP>
          <ArticleP>{t("crypto.p2", { appName })}</ArticleP>
        </ArticleSection>

        <ArticleEnd
          back={back}
          title={t("close.title")}
          subtitle={`${t("close.p1")} ${t("close.p2")}`}
          actions={
            <>
              <Cta
                href={`/${locale}/user/referral`}
                label={t("close.createCode")}
              />
              <Cta
                href={configT("social.discordInvite")}
                label={t("close.joinDiscord")}
                icon={MessageSquare}
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

export default async function ReferralDevelopersPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
