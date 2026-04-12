"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowRight } from "next-vibe-ui/ui/icons/ArrowRight";
import { Link } from "next-vibe-ui/ui/link";
import { MotionDiv } from "next-vibe-ui/ui/motion";
import { Span } from "next-vibe-ui/ui/span";
import { H2, H3, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import { useInView } from "react-intersection-observer";

import type { CountryLanguage } from "@/i18n/core/config";

import {
  getChainScenarios,
  getChainTotal,
  getCommissionRows,
  getReferralParams,
  scopedTranslation as referralScopedTranslation,
} from "@/app/[locale]/user/(account)/referral/i18n";

interface ReferralShowcaseProps {
  locale: CountryLanguage;
}

export function ReferralShowcase({
  locale,
}: ReferralShowcaseProps): JSX.Element {
  const params = getReferralParams(locale);

  return (
    <Div className="bg-background">
      <NumbersHero locale={locale} params={params} />
      <AudienceCallout locale={locale} params={params} />
      <HowItWorks locale={locale} params={params} />
      <StoryScenarios locale={locale} params={params} />
      <ChainBreakdown locale={locale} params={params} />
      <PayoutSection locale={locale} params={params} />
    </Div>
  );
}

type Params = ReturnType<typeof getReferralParams>;

function NumbersHero({
  locale,
  params,
}: {
  locale: CountryLanguage;
  params: Params;
}): JSX.Element {
  const { t } = referralScopedTranslation.scopedT(locale);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <Div
      ref={ref as never}
      className="py-20 md:py-28 px-6 bg-[#0d0008] text-center"
    >
      <Div className="max-w-3xl mx-auto">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <H2 className="text-4xl md:text-5xl font-black tracking-tighter text-white border-0 mb-4">
            {t("title")}
          </H2>
          <P className="text-white/50 text-lg leading-relaxed m-0">
            {t("description", params)}
          </P>
        </MotionDiv>

        <Div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MotionDiv
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center p-8 rounded-2xl border border-rose-500/20 bg-rose-500/5"
          >
            <Span className="text-7xl font-black text-transparent bg-clip-text bg-linear-to-br from-rose-400 to-pink-400 mb-2 leading-none">
              {params.directPct}
            </Span>
            <Span className="text-rose-300 font-semibold text-sm uppercase tracking-wider mb-1">
              {t("hero.directEarning")}
            </Span>
            <Span className="text-white/40 text-xs">
              {t("hero.directNote")}
            </Span>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center p-8 rounded-2xl border border-orange-500/20 bg-orange-500/5"
          >
            <Span className="text-7xl font-black text-transparent bg-clip-text bg-linear-to-br from-orange-400 to-rose-400 mb-2 leading-none">
              {params.skillPct}
            </Span>
            <Span className="text-orange-300 font-semibold text-sm uppercase tracking-wider mb-1">
              {t("hero.bonusEarning")}
            </Span>
            <Span className="text-white/40 text-xs">{t("hero.bonusNote")}</Span>
          </MotionDiv>
        </Div>
      </Div>
    </Div>
  );
}

function AudienceCallout({
  locale,
  params,
}: {
  locale: CountryLanguage;
  params: Params;
}): JSX.Element {
  const { t } = referralScopedTranslation.scopedT(locale);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <Div
      ref={ref as never}
      className="py-16 md:py-24 px-6 bg-background border-t border-border/30"
    >
      <Div className="max-w-4xl mx-auto">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <H3 className="text-2xl md:text-3xl font-black tracking-tighter text-foreground border-0 mb-0">
            {t("audienceCallout.title")}
          </H3>
        </MotionDiv>

        <Div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MotionDiv
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-8 rounded-2xl border border-rose-500/20 bg-rose-500/5 dark:bg-rose-500/10 flex flex-col gap-4"
          >
            <Span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 px-2 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 w-fit">
              {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string -- decorative emoji */}
              🔗 {t("audienceCallout.newTitle", params)}
            </Span>
            <P className="text-muted-foreground text-base leading-relaxed m-0 flex-1">
              {t("audienceCallout.newBody", params)}
            </P>
            <Button
              asChild
              size="sm"
              className="self-start bg-rose-600 hover:bg-rose-500 text-primary-foreground border-0 font-semibold gap-2"
            >
              <Link href={`/${locale}/user/referral`}>
                {t("audienceCallout.newCta")}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-8 rounded-2xl border border-orange-500/20 bg-orange-500/5 dark:bg-orange-500/10 flex flex-col gap-4"
          >
            <Span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 px-2 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 w-fit">
              {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string -- decorative emoji */}
              ⚡ {t("audienceCallout.proTitle", params)}
            </Span>
            <P className="text-muted-foreground text-base leading-relaxed m-0 flex-1">
              {t("audienceCallout.proBody", params)}
            </P>
            <Button
              asChild
              size="sm"
              variant="outline"
              className="self-start border-orange-500/40 text-orange-600 dark:text-orange-300 hover:bg-orange-500/10 hover:text-orange-700 dark:hover:text-orange-200 font-semibold gap-2"
            >
              <Link href={`/${locale}/story/build-a-skill`}>
                {t("audienceCallout.proCta")}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </MotionDiv>
        </Div>
      </Div>
    </Div>
  );
}

function HowItWorks({
  locale,
  params,
}: {
  locale: CountryLanguage;
  params: Params;
}): JSX.Element {
  const { t } = referralScopedTranslation.scopedT(locale);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const steps = [
    {
      num: "01",
      title: t("howItWorks.step1Title"),
      body: t("howItWorks.step1Body", params),
      color: "text-rose-400",
      border: "border-rose-500/20",
    },
    {
      num: "02",
      title: t("howItWorks.step2Title"),
      body: t("howItWorks.step2Body", params),
      color: "text-orange-400",
      border: "border-orange-500/20",
    },
    {
      num: "03",
      title: t("howItWorks.step3Title"),
      body: t("howItWorks.step3Body", params),
      color: "text-pink-400",
      border: "border-pink-500/20",
    },
  ];

  return (
    <Div
      ref={ref as never}
      className="py-16 md:py-24 px-6 bg-[#0d0008] border-t border-border/30"
    >
      <Div className="max-w-4xl mx-auto">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <H3 className="text-2xl md:text-3xl font-black tracking-tighter text-white border-0 mb-0">
            {t("howItWorks.title")}
          </H3>
        </MotionDiv>

        <Div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <MotionDiv
              key={step.num}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`p-6 rounded-2xl border ${step.border} bg-white/[0.02]`}
            >
              <Span className={`text-4xl font-black ${step.color} block mb-3`}>
                {step.num}
              </Span>
              <Span className="text-white font-bold text-sm block mb-2">
                {step.title}
              </Span>
              <Span className="text-white/50 text-sm leading-relaxed">
                {step.body}
              </Span>
            </MotionDiv>
          ))}
        </Div>
      </Div>
    </Div>
  );
}

const LEVEL_DESCS = [
  "story.level1Desc",
  "story.level2Desc",
  "story.level3Desc",
  "story.level4Desc",
  "story.level5Desc",
  "story.level6Desc",
] as const;

function StoryScenarios({
  locale,
  params,
}: {
  locale: CountryLanguage;
  params: Params;
}): JSX.Element {
  const { t } = referralScopedTranslation.scopedT(locale);
  const scenarios = getChainScenarios(locale);
  const total = getChainTotal(locale);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <Div
      ref={ref as never}
      className="py-16 md:py-24 px-6 bg-background border-t border-border/30"
    >
      <Div className="max-w-2xl mx-auto">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <H3 className="text-2xl md:text-3xl font-black tracking-tighter text-foreground border-0 mb-2">
            {t("story.title")}
          </H3>
          <P className="text-muted-foreground text-sm m-0">
            {t("story.subtitle")}
          </P>
        </MotionDiv>

        <Div className="flex flex-col gap-2">
          {scenarios.map((s, i) => (
            <MotionDiv
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-xl p-4 bg-card border border-border/50"
            >
              <Div className="flex items-center justify-between mb-2">
                <Div>
                  <Span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60 block mb-0.5">
                    {t("story.levelLabel", { n: String(s.levelCount) })}
                  </Span>
                  <Span className="text-xs text-muted-foreground">
                    {t(LEVEL_DESCS[i] ?? "story.level6Desc", params)}
                  </Span>
                </Div>
                <Div className="text-right shrink-0 ml-4">
                  <Span
                    className={`text-lg font-black block ${i === scenarios.length - 1 ? "text-transparent bg-clip-text bg-linear-to-br from-rose-500 to-pink-500 dark:from-rose-400 dark:to-pink-400" : "text-foreground/70"}`}
                  >
                    {s.earning}
                  </Span>
                  <Span className="text-xs text-emerald-600 dark:text-emerald-400/70">
                    {t("story.addedLabel", { amount: s.addedEarning })}
                  </Span>
                </Div>
              </Div>
              <Div className="h-1 rounded-full bg-muted overflow-hidden">
                <MotionDiv
                  className="h-full rounded-full bg-gradient-to-r from-rose-500/60 to-pink-400/60"
                  initial={{ width: 0 }}
                  animate={
                    inView ? { width: `${s.totalBarPct}%` } : { width: 0 }
                  }
                  transition={{
                    duration: 0.6,
                    delay: 0.3 + i * 0.08,
                    ease: "easeOut",
                  }}
                />
              </Div>
            </MotionDiv>
          ))}

          {/* Total */}
          <MotionDiv
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: scenarios.length * 0.08 + 0.1 }}
            className="rounded-xl p-4 bg-rose-500/10 dark:bg-rose-500/10 border border-rose-500/30 flex items-center justify-between mt-1"
          >
            <Span className="text-sm font-bold text-rose-700 dark:text-rose-200 uppercase tracking-wider">
              {t("story.totalLabel")}
            </Span>
            <Span className="text-2xl font-black text-transparent bg-clip-text bg-linear-to-br from-rose-600 to-pink-600 dark:from-rose-400 dark:to-pink-300">
              {total}
            </Span>
          </MotionDiv>
        </Div>
      </Div>
    </Div>
  );
}

function ChainBreakdown({
  locale,
}: {
  locale: CountryLanguage;
  params: Params;
}): JSX.Element {
  const { t } = referralScopedTranslation.scopedT(locale);
  const rows = getCommissionRows(locale);
  const total = getChainTotal(locale);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <Div
      ref={ref as never}
      className="py-16 md:py-24 px-6 bg-[#0d0008] border-t border-border/30"
    >
      <Div className="max-w-2xl mx-auto">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <H3 className="text-2xl md:text-3xl font-black tracking-tighter text-white border-0 mb-2">
            {t("commissionTable.chainTitle")}
          </H3>
          <P className="text-white/40 text-sm m-0">
            {t("commissionTable.chainSubtitle")}
          </P>
        </MotionDiv>

        <Div className="flex flex-col gap-3">
          {rows.map((row, i) => (
            <MotionDiv
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className={`rounded-xl p-4 ${i === 0 ? "bg-rose-500/10 border border-rose-500/20" : "bg-white/[0.03] border border-white/5"}`}
            >
              <Div className="flex items-center justify-between mb-2">
                <Span
                  className={`text-sm font-semibold ${i === 0 ? "text-rose-200" : "text-white/60"}`}
                >
                  {i === 0 ? t("commissionTable.youLabel") : row.who}
                </Span>
                <Div className="flex items-baseline gap-2">
                  <Span
                    className={`text-xl font-black ${i === 0 ? "text-rose-300" : "text-white/50"}`}
                  >
                    {row.tenPersonEarning}
                  </Span>
                  <Span
                    className={`text-xs ${i === 0 ? "text-rose-400/60" : "text-white/25"}`}
                  >
                    {t("commissionTable.perMonth")}
                  </Span>
                  <Span
                    className={`text-xs font-mono ml-1 ${i === 0 ? "text-rose-400/80" : "text-white/30"}`}
                  >
                    {row.pct}
                  </Span>
                </Div>
              </Div>
              <Div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <MotionDiv
                  className={`h-full rounded-full ${i === 0 ? "bg-gradient-to-r from-rose-500 to-pink-400" : "bg-white/20"}`}
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${row.barPct}%` } : { width: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.2 + i * 0.07,
                    ease: "easeOut",
                  }}
                />
              </Div>
              {i === 0 && (
                <Span className="text-xs text-rose-400/50 mt-1.5 block">
                  {t("commissionTable.alwaysYours")}
                </Span>
              )}
            </MotionDiv>
          ))}

          {/* Total row */}
          <MotionDiv
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: rows.length * 0.07 + 0.2 }}
            className="rounded-xl p-4 bg-rose-500/10 border border-rose-500/30 flex items-center justify-between mt-1"
          >
            <Span className="text-sm font-bold text-rose-200 uppercase tracking-wider">
              {t("story.totalLabel")}
            </Span>
            <Span className="text-2xl font-black text-transparent bg-clip-text bg-linear-to-br from-rose-400 to-pink-300">
              {total}
            </Span>
          </MotionDiv>
        </Div>
      </Div>
    </Div>
  );
}

function PayoutSection({
  locale,
  params,
}: {
  locale: CountryLanguage;
  params: Params;
}): JSX.Element {
  const { t } = referralScopedTranslation.scopedT(locale);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <Div
      ref={ref as never}
      className="py-16 md:py-20 px-6 bg-background border-t border-border/30"
    >
      <Div className="max-w-3xl mx-auto">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <H3 className="text-2xl md:text-3xl font-black tracking-tighter text-foreground border-0 mb-2">
            {t("payout.title")}
          </H3>
          <P className="text-muted-foreground text-sm m-0">
            {t("payout.description")}
          </P>
        </MotionDiv>

        <Div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MotionDiv
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-6 rounded-2xl border border-border bg-card flex flex-col gap-2"
          >
            <Span className="text-foreground font-bold">
              {t("payout.useAsCredits")}
            </Span>
            <Span className="text-muted-foreground text-sm leading-relaxed">
              {t("payout.useAsCreditsDesc")}
            </Span>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-6 rounded-2xl border border-border bg-card flex flex-col gap-2"
          >
            <Span className="text-foreground font-bold">
              {t("payout.cryptoPayout")}
            </Span>
            <Span className="text-muted-foreground text-sm leading-relaxed">
              {t("payout.cryptoPayoutDesc")}
            </Span>
            <Span className="text-muted-foreground/60 text-xs mt-1">
              {t("payout.minimumNote", params)}
            </Span>
          </MotionDiv>
        </Div>
      </Div>
    </Div>
  );
}
