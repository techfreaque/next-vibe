import type { Metadata } from "next";
import { getEnvAvailability } from "next-vibe/agent/env-availability";
import { getAvailableModelCount } from "next-vibe/agent/models/all-models";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Div } from "next-vibe/ui/components/div";
import { MessageSquare } from "next-vibe/ui/components/icons/MessageSquare";
import { TrendingUp } from "next-vibe/ui/components/icons/TrendingUp";
import { Users } from "next-vibe/ui/components/icons/Users";
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
    path: "story/blog/referral-for-affiliate-pros",
    title: t("meta.title"),
    category: t("meta.category"),
    description: t("meta.description"),
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070",
    imageAlt: t("meta.imageAlt"),
    keywords: [t("meta.keywords")],
  });
};

export interface ReferralAffiliateProsPageData {
  locale: CountryLanguage;
  modelCount: number;
}

export async function tanstackLoader({
  params,
}: Props): Promise<ReferralAffiliateProsPageData> {
  const { locale } = await params;
  return {
    locale,
    modelCount: getAvailableModelCount(false, await getEnvAvailability()),
  };
}

export function TanstackPage({
  locale,
  modelCount,
}: ReferralAffiliateProsPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  const back = { href: `/${locale}/story/blog`, label: t("hero.backToBlog") };

  const commissionRows = [
    {
      profile: t("recurringMath.row1Profile"),
      spend: t("recurringMath.row1Spend"),
      earn: t("recurringMath.row1Earn"),
      highlight: false,
    },
    {
      profile: t("recurringMath.row2Profile"),
      spend: t("recurringMath.row2Spend"),
      earn: t("recurringMath.row2Earn"),
      highlight: false,
    },
    {
      profile: t("recurringMath.row3Profile"),
      spend: t("recurringMath.row3Spend"),
      earn: t("recurringMath.row3Earn"),
      highlight: true,
    },
    {
      profile: t("recurringMath.row4Profile"),
      spend: t("recurringMath.row4Spend"),
      earn: t("recurringMath.row4Earn"),
      highlight: true,
    },
  ];

  const audience = [
    {
      title: t("audience.group1Title"),
      body: t("audience.group1Body"),
    },
    {
      title: t("audience.group2Title"),
      body: t("audience.group2Body"),
    },
    {
      title: t("audience.group3Title"),
      body: t("audience.group3Body"),
    },
    {
      title: t("audience.group4Title"),
      body: t("audience.group4Body", { modelCount }),
    },
  ];

  const angles = [
    {
      title: t("promotion.angle1Title"),
      body: t("promotion.angle1Body", { appName }),
    },
    {
      title: t("promotion.angle2Title"),
      body: t("promotion.angle2Body"),
    },
    {
      title: t("promotion.angle3Title"),
      body: t("promotion.angle3Body"),
    },
    {
      title: t("promotion.angle4Title"),
      body: t("promotion.angle4Body", { appName }),
    },
  ];

  return (
    <Div className="min-h-screen bg-background">
      <ArticleHeader
        back={back}
        category={t("hero.category")}
        readTime={t("hero.readTime")}
        date={formatPostDate("referral-for-affiliate-pros", locale)}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
      />

      <ArticleBody>
        <ArticleSection title={t("recurringMath.title")}>
          <ArticleLead>{t("recurringMath.p1", { appName })}</ArticleLead>
          <ArticleP>{t("recurringMath.p2", { appName })}</ArticleP>
          <FeatureGrid columns={2}>
            <FeatureCard title={t("recurringMath.powerUserTitle")}>
              {t("recurringMath.powerUserBody")}
            </FeatureCard>
            <FeatureCard title={t("recurringMath.floorTitle")}>
              {t("recurringMath.floorBody", { appName })}
            </FeatureCard>
          </FeatureGrid>
          <Div className="overflow-hidden rounded-xl border border-border bg-card">
            <Table className="min-w-[30rem]">
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="text-xs font-semibold uppercase tracking-wide">
                    {t("recurringMath.tableHeaderProfile")}
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide">
                    {t("recurringMath.tableHeaderSpend")}
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide">
                    {t("recurringMath.tableHeaderYouEarn")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {commissionRows.map((row) => (
                  <TableRow
                    key={row.profile}
                    className={
                      row.highlight
                        ? "bg-primary/5 hover:bg-primary/10"
                        : undefined
                    }
                  >
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
        </ArticleSection>

        <ArticleSection title={t("structure.title")}>
          <ArticleList ordered items={[t("structure.p1"), t("structure.p2")]} />
          <Callout tone="warning" icon={TrendingUp}>
            {t("structure.p3")}
          </Callout>
          <ArticleP className="text-muted-foreground">
            {t("structure.p4")}
          </ArticleP>
        </ArticleSection>

        <ArticleSection
          title={t("audience.title")}
          intro={t("audience.intro", { appName, modelCount })}
        >
          <FeatureGrid columns={2}>
            {audience.map((group) => (
              <FeatureCard key={group.title} icon={Users} title={group.title}>
                {group.body}
              </FeatureCard>
            ))}
          </FeatureGrid>
        </ArticleSection>

        <ArticleSection title={t("promotion.title")}>
          <Div className="flex flex-col gap-3">
            {angles.map((angle, index) => (
              <FeatureCard
                key={angle.title}
                label={String(index + 1).padStart(2, "0")}
                title={angle.title}
              >
                {angle.body}
              </FeatureCard>
            ))}
          </Div>
        </ArticleSection>

        <ArticleSection title={t("payouts.title")}>
          <ArticleP>{t("payouts.p1")}</ArticleP>
          <ArticleP>{t("payouts.p2")}</ArticleP>
          <ArticleP>{t("payouts.p3")}</ArticleP>
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

export default async function ReferralAffiliateProsPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
