import type { Metadata } from "next";
import { coreClientEnv as envClient } from "next-vibe/core/env-client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Div } from "next-vibe/ui/components/div";
import { BookOpen } from "next-vibe/ui/components/icons/BookOpen";
import { Coins } from "next-vibe/ui/components/icons/Coins";
import { Info } from "next-vibe/ui/components/icons/Info";
import { Link2 } from "next-vibe/ui/components/icons/Link2";
import { Sparkles } from "next-vibe/ui/components/icons/Sparkles";
import { TrendingUp } from "next-vibe/ui/components/icons/TrendingUp";
import { Wallet } from "next-vibe/ui/components/icons/Wallet";
import { Span } from "next-vibe/ui/components/span";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import type { JSX } from "react";

import { scopedTranslation as referralScopedTranslation } from "@/_pages/user/(account)/referral/i18n";
import {
  buildCommissionRows,
  getReferralParams,
} from "@/_pages/user/(account)/referral/i18n/utils";
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
  StatGrid,
  Step,
  StepList,
} from "../_shared/marketing";
import { scopedTranslation } from "./i18n";

export const revalidate = 3600;

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  const referral = getReferralParams(locale);
  return metadataGenerator(locale, {
    path: "story/earn",
    title: t("meta.title", { appName }),
    category: t("meta.category"),
    description: t("meta.description", { appName, ...referral }),
    image: `${envClient.NEXT_PUBLIC_APP_URL}/images/home-hero.jpg`,
    imageAlt: t("meta.imageAlt", { appName }),
    keywords: [t("meta.keywords", { appName })],
  });
}

export interface EarnPageData {
  locale: CountryLanguage;
}

export async function tanstackLoader({ params }: Props): Promise<EarnPageData> {
  const { locale } = await params;
  return { locale };
}

export function TanstackPage({ locale }: EarnPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  // Every number below derives from REFERRAL_CONFIG - never hardcode a percentage.
  const referral = getReferralParams(locale);
  const { t: rt } = referralScopedTranslation.scopedT(locale);
  const referralHref = `/${locale}/user/referral`;
  const rows = buildCommissionRows(locale, rt);

  return (
    <Div className="min-h-screen bg-background">
      <PageHero
        eyebrow={t("hero.eyebrow")}
        eyebrowIcon={TrendingUp}
        title={t("hero.title")}
        subtitle={t("hero.subtitle", referral)}
        actions={
          <>
            <Cta href={referralHref} label={t("hero.ctaPrimary")} />
            <Cta
              href={`/${locale}/story/build-a-skill`}
              label={t("hero.ctaSecondary")}
              icon={Sparkles}
              variant="secondary"
            />
          </>
        }
      >
        <StatGrid
          items={[
            { value: referral.directPct, label: t("facts.direct") },
            { value: referral.skillBonusPct, label: t("facts.skill") },
            { value: referral.minPayout, label: t("facts.payout") },
            {
              value: t("facts.hoursValue", referral),
              label: t("facts.hours"),
            },
          ]}
        />
      </PageHero>

      <PageSection
        label={t("start.label")}
        title={t("start.title")}
        intro={t("start.intro")}
      >
        <Div className="max-w-3xl">
          <StepList>
            <Step
              number={1}
              title={t("start.step1.title")}
              description={t("start.step1.body")}
            />
            <Step
              number={2}
              title={t("start.step2.title")}
              description={t("start.step2.body")}
            />
            <Step
              number={3}
              title={t("start.step3.title")}
              description={t("start.step3.body", referral)}
            />
          </StepList>
        </Div>
      </PageSection>

      {/* Two ways in */}
      <PageSection tone="muted" title={rt("audienceCallout.title")}>
        <FeatureGrid columns={2}>
          <FeatureCard
            icon={Link2}
            title={rt("audienceCallout.newTitle", referral)}
            footer={
              <CardLink
                href={referralHref}
                label={rt("audienceCallout.newCta")}
              />
            }
          >
            {rt("audienceCallout.newBody", referral)}
          </FeatureCard>
          <FeatureCard
            icon={Sparkles}
            title={rt("audienceCallout.proTitle", referral)}
            footer={
              <CardLink
                href={`/${locale}/story/build-a-skill`}
                label={rt("audienceCallout.proCta")}
              />
            }
          >
            {rt("audienceCallout.proBody", referral)}
          </FeatureCard>
        </FeatureGrid>
      </PageSection>

      {/* Where every payment goes */}
      <PageSection
        label={t("split.label")}
        title={t("split.title")}
        intro={rt("commissionTable.chainSubtitle")}
      >
        <Div className="max-w-3xl overflow-hidden rounded-xl border border-border bg-card shadow-xs">
          <Div className="grid grid-cols-[minmax(0,1fr)_4.5rem_6.5rem] gap-3 border-b border-border bg-muted/50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground md:px-6">
            <Span>{rt("commissionTable.colLevel")}</Span>
            <Span className="text-right">{rt("commissionTable.colCut")}</Span>
            <Span className="text-right">{t("split.perUser", referral)}</Span>
          </Div>
          {rows.map((row, index) => (
            <Div
              key={row.who}
              className={cn(
                "grid grid-cols-[minmax(0,1fr)_4.5rem_6.5rem] items-center gap-3 border-b border-border px-4 py-3.5 text-sm last:border-b-0 md:px-6",
                index === 0 && "bg-primary/5",
              )}
            >
              <Div className="min-w-0">
                <Span
                  className={cn(
                    "block",
                    index === 0
                      ? "font-semibold text-foreground"
                      : "text-foreground/85",
                  )}
                >
                  {row.who}
                </Span>
                <Div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <Div style={{ width: `${row.barPct}%`, height: "100%" }}>
                    <Div
                      className={cn(
                        "h-full rounded-full",
                        index === 0 ? "bg-primary" : "bg-primary/40",
                      )}
                    />
                  </Div>
                </Div>
              </Div>
              <Span
                className={cn(
                  "text-right font-semibold tabular-nums",
                  index === 0 ? "text-primary" : "text-foreground",
                )}
              >
                {row.pct}
              </Span>
              <Span className="text-right text-muted-foreground tabular-nums">
                {row.example}
              </Span>
            </Div>
          ))}
        </Div>
        <Callout icon={Info} tone="neutral" className="mt-6 max-w-3xl">
          {rt("commissionTable.tableNote", referral)}
        </Callout>
      </PageSection>

      {/* Payout */}
      <PageSection
        tone="muted"
        title={rt("payout.title")}
        intro={rt("payout.description")}
      >
        <FeatureGrid columns={2}>
          <FeatureCard icon={Coins} title={rt("payout.useAsCredits")}>
            {rt("payout.useAsCreditsDesc")}
          </FeatureCard>
          <FeatureCard icon={Wallet} title={rt("payout.cryptoPayout")}>
            {rt("payout.cryptoPayoutDesc")}
            <Span className="mt-2 block text-xs">
              {rt("payout.minimumNote", referral)}
            </Span>
          </FeatureCard>
        </FeatureGrid>
      </PageSection>

      <CtaBand
        title={t("cta.title")}
        subtitle={t("cta.subtitle", referral)}
        actions={
          <>
            <Cta href={referralHref} label={t("cta.primary")} />
            <Cta
              href={`/${locale}/story/blog/referral-for-beginners`}
              label={t("cta.secondary")}
              icon={BookOpen}
              variant="secondary"
            />
            <Cta
              href={`/${locale}/story/partners`}
              label={t("cta.partners")}
              icon={Link2}
              variant="secondary"
            />
          </>
        }
      />
    </Div>
  );
}

export default async function EarnPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
