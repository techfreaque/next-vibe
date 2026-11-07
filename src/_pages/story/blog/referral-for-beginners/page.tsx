import type { Metadata } from "next";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Div } from "next-vibe/ui/components/div";
import { Lightbulb } from "next-vibe/ui/components/icons/Lightbulb";
import { MessageSquare } from "next-vibe/ui/components/icons/MessageSquare";
import { RefreshCw } from "next-vibe/ui/components/icons/RefreshCw";
import { Link } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
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
  ArticleQuote,
  ArticleSection,
} from "../../_shared/article";
import { Callout, Cta, Step, StepList } from "../../_shared/marketing";
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
    path: "story/blog/referral-for-beginners",
    title: t("meta.title"),
    category: t("meta.category"),
    description: t("meta.description", { appName }),
    image:
      "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=2071",
    imageAlt: t("meta.imageAlt"),
    keywords: [t("meta.keywords")],
  });
};

export interface ReferralBeginnersPageData {
  locale: CountryLanguage;
}

export async function tanstackLoader({
  params,
}: Props): Promise<ReferralBeginnersPageData> {
  const { locale } = await params;
  return { locale };
}

function EarnTable({
  headers,
  rows,
}: {
  headers: readonly [string, string, string];
  rows: ReadonlyArray<{
    cells: readonly [string, string, string];
    highlight?: boolean;
  }>;
}): JSX.Element {
  return (
    <Div className="overflow-hidden rounded-xl border border-border bg-card">
      <Table className="min-w-[30rem]">
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            {headers.map((header) => (
              <TableHead
                key={header}
                className="text-xs font-semibold uppercase tracking-wide"
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.cells[0]}
              className={
                row.highlight === true
                  ? "bg-primary/5 font-semibold hover:bg-primary/10"
                  : undefined
              }
            >
              <TableCell className="text-muted-foreground">
                {row.cells[0]}
              </TableCell>
              <TableCell className="text-foreground">{row.cells[1]}</TableCell>
              <TableCell
                className={
                  row.highlight === true
                    ? "font-semibold text-primary"
                    : "text-muted-foreground"
                }
              >
                {row.cells[2]}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Div>
  );
}

export function TanstackPage({
  locale,
}: ReferralBeginnersPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  const back = { href: `/${locale}/story/blog`, label: t("hero.backToBlog") };
  const referralHref = `/${locale}/user/referral`;

  return (
    <Div className="min-h-screen bg-background">
      <ArticleHeader
        back={back}
        category={t("hero.category")}
        readTime={t("hero.readTime")}
        date={formatPostDate("referral-for-beginners", locale)}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
      />

      <ArticleBody>
        <ArticleQuote>{t("hero.quote")}</ArticleQuote>

        <ArticleSection title={t("intro.title")}>
          <ArticleLead>{t("intro.p1", { appName })}</ArticleLead>
          <ArticleP>{t("intro.p2", { appName })}</ArticleP>
        </ArticleSection>

        <ArticleSection title={t("different.title")}>
          <ArticleP>{t("different.p1", { appName })}</ArticleP>
          <EarnTable
            headers={[
              t("different.tableHeaderType"),
              t("different.tableHeaderYouEarn"),
              t("different.tableHeaderWhen"),
            ]}
            rows={[
              {
                cells: [
                  t("different.row1Type"),
                  t("different.row1Earn"),
                  t("different.row1When"),
                ],
              },
              {
                cells: [
                  t("different.row2Type"),
                  t("different.row2Earn"),
                  t("different.row2When"),
                ],
              },
              {
                cells: [
                  t("different.row3Type", { appName }),
                  t("different.row3Earn"),
                  t("different.row3When"),
                ],
                highlight: true,
              },
            ]}
          />
          <ArticleP>{t("different.p2")}</ArticleP>
        </ArticleSection>

        <ArticleSection title={t("multilevel.title")}>
          <ArticleP>{t("multilevel.p1")}</ArticleP>
          <Callout icon={RefreshCw}>
            {t("multilevel.explanation", { appName })}
          </Callout>
          <ArticleP>{t("multilevel.p2", { appName })}</ArticleP>
          <ArticleP>{t("multilevel.p3")}</ArticleP>
        </ArticleSection>

        <ArticleSection title={t("expectations.title")}>
          <ArticleP>{t("expectations.p1")}</ArticleP>
          <Div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                label: t("expectations.scenario1Label"),
                spend: t("expectations.scenario1Spend"),
                earn: t("expectations.scenario1Earn"),
              },
              {
                label: t("expectations.scenario2Label"),
                spend: t("expectations.scenario2Spend"),
                earn: t("expectations.scenario2Earn"),
              },
            ].map((scenario) => (
              <Div
                key={scenario.label}
                className="rounded-xl border border-border bg-card p-5"
              >
                <Span className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {scenario.label}
                </Span>
                <P className="mt-2 text-sm text-foreground">{scenario.spend}</P>
                <P className="mt-1 text-base font-semibold text-primary">
                  {scenario.earn}
                </P>
              </Div>
            ))}
          </Div>
          <Callout tone="warning" icon={Lightbulb}>
            {t("expectations.note")}
          </Callout>
          <ArticleP>{t("expectations.example")}</ArticleP>
        </ArticleSection>

        <ArticleSection title={t("firststeps.title")}>
          <StepList>
            <Step
              number={1}
              title={t("firststeps.step1Title")}
              description={t("firststeps.step1Body")}
            />
            <Step
              number={2}
              title={t("firststeps.step2Title")}
              description={
                <>
                  <Link
                    href={referralHref}
                    className="font-medium text-primary underline underline-offset-4"
                  >
                    {t("firststeps.step2Link")}
                  </Link>
                  {t("firststeps.step2Suffix")}
                </>
              }
            />
            <Step
              number={3}
              title={t("firststeps.step3Title")}
              description={t("firststeps.step3Body")}
            />
            <Step
              number={4}
              title={t("firststeps.step4Title")}
              description={t("firststeps.step4Body")}
            />
          </StepList>
        </ArticleSection>

        <ArticleEnd
          back={back}
          title={t("close.title")}
          subtitle={`${t("close.p1")} ${t("close.p2")}`}
          actions={
            <>
              <Cta href={referralHref} label={t("close.createCode")} />
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

export default async function ReferralBeginnersPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
