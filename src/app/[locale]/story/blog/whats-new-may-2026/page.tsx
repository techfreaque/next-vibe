import type { Metadata } from "next";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { ArrowRight } from "next-vibe-ui/ui/icons/ArrowRight";
import { Link } from "next-vibe-ui/ui/link";
import { Separator } from "next-vibe-ui/ui/separator";
import { Span } from "next-vibe-ui/ui/span";
import { H1, H2, Muted, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import { FEEDBACK_REWARD_CREDITS } from "@/app/api/[locale]/credits/constants";
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
    path: "story/blog/whats-new-may-2026",
    title: t("meta.title"),
    category: t("meta.category"),
    description: t("meta.description", { credits: FEEDBACK_REWARD_CREDITS }),
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2070",
    imageAlt: t("meta.imageAlt", { appName }),
    keywords: [t("meta.keywords")],
  });
};

export interface WhatsNewMay2026PageData {
  locale: CountryLanguage;
}

export async function tanstackLoader({
  params,
}: Props): Promise<WhatsNewMay2026PageData> {
  const { locale } = await params;
  return { locale };
}

// ── Feature card component ──────────────────────────────────────────────────

type FeatureVariant = "cortex" | "dreamer" | "autopilot";

const FEATURE_STYLE: Record<
  FeatureVariant,
  { header: string; border: string; bg: string; tagline: string }
> = {
  cortex: {
    header: "bg-indigo-700",
    border: "border-indigo-200 dark:border-indigo-800",
    bg: "bg-indigo-50 dark:bg-indigo-950/20",
    tagline: "text-indigo-200",
  },
  dreamer: {
    header: "bg-slate-800",
    border: "border-slate-200 dark:border-slate-700",
    bg: "bg-slate-50 dark:bg-slate-950/20",
    tagline: "text-slate-300",
  },
  autopilot: {
    header: "bg-emerald-700",
    border: "border-emerald-200 dark:border-emerald-800",
    bg: "bg-emerald-50 dark:bg-emerald-950/20",
    tagline: "text-emerald-200",
  },
};

function FeatureCard({
  variant,
  title,
  tagline,
  children,
}: {
  variant: FeatureVariant;
  title: string;
  tagline: string;
  children: React.ReactNode;
}): JSX.Element {
  const s = FEATURE_STYLE[variant];
  return (
    <Div className={`rounded-xl border overflow-hidden ${s.border}`}>
      <Div className={`px-5 py-4 ${s.header}`}>
        <Div className="font-bold text-white">{title}</Div>
        <Div className={`text-xs mt-0.5 ${s.tagline}`}>{tagline}</Div>
      </Div>
      <Div className={`px-5 py-4 space-y-3 ${s.bg}`}>{children}</Div>
    </Div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function TanstackPage({ locale }: WhatsNewMay2026PageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");

  return (
    <Div className="min-h-screen bg-background">
      {/* Top bar */}
      <Div className="bg-indigo-700 border-b border-indigo-800">
        <Div className="container mx-auto px-4 py-3 max-w-3xl flex items-center gap-3">
          <Div className="w-5 h-5 bg-white/20 rounded flex items-center justify-center text-white text-xs">
            {t("hero.icon")}
          </Div>
          <P className="text-white font-semibold text-sm">
            {t("hero.brand", { appName })}
            {t("hero.category")}
          </P>
        </Div>
      </Div>

      {/* Hero */}
      <Div className="bg-gradient-to-b from-indigo-50 to-background dark:from-indigo-950/20 dark:to-background border-b border-indigo-100 dark:border-indigo-900/30">
        <Div className="container mx-auto px-4 pt-8 pb-12 max-w-3xl">
          <Link
            href={`/${locale}/story/blog`}
            className="inline-flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mb-8 transition-colors"
          >
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            {t("hero.backToBlog")}
          </Link>
          <Div className="flex items-center gap-2 mb-5">
            <Div className="px-2.5 py-0.5 bg-indigo-700 rounded-full text-white text-xs font-semibold uppercase tracking-wider">
              {t("hero.category")}
            </Div>
            <Muted className="text-xs">{t("hero.readTime")}</Muted>
          </Div>
          <H1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            {t("hero.title")}
          </H1>
          <P className="text-lg text-muted-foreground mb-8 max-w-2xl">
            {t("hero.subtitle")}
          </P>
          <Div className="px-5 py-4 rounded-xl bg-white dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 text-sm italic max-w-xl">
            {t("hero.quote")}
          </Div>
        </Div>
      </Div>

      <Div className="container mx-auto px-4 py-12 max-w-3xl space-y-14">
        {/* ── Honest ── */}
        <Div>
          <H2 className="text-xl font-bold mb-4">{t("honest.title")}</H2>
          <P className="text-muted-foreground leading-relaxed mb-3">
            {t("honest.p1")}
          </P>
          <P className="text-muted-foreground leading-relaxed">
            {t("honest.p2")}
          </P>
        </Div>

        <Separator />

        {/* ── What changed ── */}
        <Div>
          <Div className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-4">
            {t("whatsNew.label")}
          </Div>
          <Div className="space-y-2.5 mb-6">
            {(
              [
                { key: "whatsNew.item1", dot: "bg-indigo-500" },
                { key: "whatsNew.item2", dot: "bg-slate-500" },
                { key: "whatsNew.item3", dot: "bg-emerald-500" },
                { key: "whatsNew.item4", dot: "bg-purple-500" },
                { key: "whatsNew.item5", dot: "bg-blue-400" },
                { key: "whatsNew.item6", dot: "bg-amber-500" },
              ] as const
            ).map(({ key, dot }) => (
              <Div key={key} className="flex items-baseline gap-3">
                <Div
                  className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${dot}`}
                />
                <Span className="text-sm text-foreground">{t(key)}</Span>
              </Div>
            ))}
          </Div>
          <Div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 px-4 py-3 text-sm text-blue-800 dark:text-blue-200">
            {t("whatsNew.betaNote")}
          </Div>
        </Div>

        <Separator />

        {/* ── Media Generation ── */}
        <Div>
          <H2 className="text-xl font-bold mb-3">{t("media.title")}</H2>
          <P className="text-muted-foreground leading-relaxed mb-6">
            {t("media.lead")}
          </P>
          <Div className="grid sm:grid-cols-2 gap-3 mb-5">
            <Div className="rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 px-4 py-4">
              <Div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                {t("media.imageLabel")}
              </Div>
              <P className="text-sm text-muted-foreground leading-relaxed">
                {t("media.image")}
              </P>
            </Div>
            <Div className="rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 px-4 py-4">
              <Div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                {t("media.musicLabel")}
              </Div>
              <P className="text-sm text-muted-foreground leading-relaxed">
                {t("media.music")}
              </P>
            </Div>
          </Div>
          <Div className="rounded-lg bg-muted/40 border px-4 py-3 text-sm text-muted-foreground">
            {t("media.note")}
          </Div>
        </Div>

        <Separator />

        {/* ── Three Feature Cards: Cortex, Dreamer, Autopilot ── */}
        <Div className="space-y-6">
          {/* Cortex */}
          <FeatureCard
            variant="cortex"
            title={t("cortex.title")}
            tagline={t("cortex.tagline")}
          >
            <P className="text-sm text-muted-foreground leading-relaxed">
              {t("cortex.p1")}
            </P>
            <P className="text-sm text-muted-foreground leading-relaxed">
              {t("cortex.p2")}
            </P>
            <P className="text-sm text-muted-foreground leading-relaxed">
              {t("cortex.p3")}
            </P>
            <Div className="rounded-lg bg-muted/40 border px-3 py-2 text-xs text-muted-foreground">
              {t("cortex.note")}
            </Div>
          </FeatureCard>

          {/* Dreamer + Autopilot side by side on larger screens */}
          <Div className="grid sm:grid-cols-2 gap-4">
            <FeatureCard
              variant="dreamer"
              title={t("dreamer.title")}
              tagline={t("dreamer.tagline")}
            >
              <P className="text-sm text-muted-foreground leading-relaxed">
                {t("dreamer.p1")}
              </P>
              <P className="text-sm text-muted-foreground leading-relaxed">
                {t("dreamer.p2")}
              </P>
              <P className="text-sm text-muted-foreground leading-relaxed">
                {t("dreamer.p3")}
              </P>
            </FeatureCard>

            <FeatureCard
              variant="autopilot"
              title={t("autopilot.title")}
              tagline={t("autopilot.tagline")}
            >
              <P className="text-sm text-muted-foreground leading-relaxed">
                {t("autopilot.p1")}
              </P>
              <P className="text-sm text-muted-foreground leading-relaxed">
                {t("autopilot.p2")}
              </P>
            </FeatureCard>
          </Div>
        </Div>

        <Separator />

        {/* ── Mission ── */}
        <Div>
          <H2 className="text-xl font-bold mb-4">{t("mission.title")}</H2>
          <P className="text-muted-foreground leading-relaxed mb-3">
            {t("mission.p1")}
          </P>
          <P className="text-muted-foreground leading-relaxed mb-3">
            {t("mission.p2")}
          </P>
          <P className="text-muted-foreground leading-relaxed mb-3">
            {t("mission.p3")}
          </P>
          <P className="text-muted-foreground leading-relaxed">
            {t("mission.p4")}
          </P>
        </Div>

        <Separator />

        {/* ── Feedback ── */}
        <Div>
          <H2 className="text-xl font-bold mb-4">
            {t("feedback.title", { credits: FEEDBACK_REWARD_CREDITS })}
          </H2>
          <P className="text-muted-foreground leading-relaxed mb-3">
            {t("feedback.p1")}
          </P>
          <P className="text-muted-foreground leading-relaxed mb-6">
            {t("feedback.p2", { credits: FEEDBACK_REWARD_CREDITS })}
          </P>
          <Div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 px-5 py-4 mb-4">
            <Div className="font-semibold text-indigo-900 dark:text-indigo-200 text-sm mb-1">
              {t("feedback.rewardTitle", { credits: FEEDBACK_REWARD_CREDITS })}
            </Div>
            <P className="text-sm text-indigo-800 dark:text-indigo-300 leading-relaxed mb-4">
              {t("feedback.rewardBody")}
            </P>
            <Button
              asChild
              size="sm"
              className="bg-indigo-700 hover:bg-indigo-800 text-white"
            >
              <Link href={`/${locale}/help`}>{t("feedback.cta")}</Link>
            </Button>
          </Div>
        </Div>

        <Separator />

        {/* ── Close ── */}
        <Div>
          <H2 className="text-xl font-bold mb-4">{t("close.title")}</H2>
          <P className="text-muted-foreground leading-relaxed mb-3">
            {t("close.p1")}
          </P>
          <P className="text-muted-foreground leading-relaxed mb-3">
            {t("close.p2")}
          </P>
          <P className="text-muted-foreground text-sm italic mb-8">
            {t("close.signature")}
          </P>
          <Div className="flex flex-col sm:flex-row gap-3">
            <Button
              asChild
              size="lg"
              className="gap-2 bg-indigo-700 hover:bg-indigo-800 text-white"
            >
              <Link href={`/${locale}/threads`}>
                {t("close.cta", { appName })}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </Div>
        </Div>

        <Div className="pt-2">
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

export default async function WhatsNewMay2026Page({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
