import type { Metadata } from "next";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { ArrowRight } from "next-vibe-ui/ui/icons/ArrowRight";
import { Link } from "next-vibe-ui/ui/link";
import { Separator } from "next-vibe-ui/ui/separator";
import { Span } from "next-vibe-ui/ui/span";
import { H1, H2, H3, Muted, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import { getAvailableSkillCount } from "@/app/api/[locale]/agent/chat/skills/config";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
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
    path: "story/blog/whats-new-april-2026",
    title: t("meta.title"),
    category: t("meta.category"),
    description: t("meta.description"),
    image:
      "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?q=80&w=2070",
    imageAlt: t("meta.imageAlt", { appName }),
    keywords: [t("meta.keywords")],
  });
};

export interface WhatsNewApril2026PageData {
  locale: CountryLanguage;
  skillCount: number;
}

export async function tanstackLoader({
  params,
}: Props): Promise<WhatsNewApril2026PageData> {
  const { locale } = await params;
  return {
    locale,
    skillCount: getAvailableSkillCount([
      UserPermissionRole.PUBLIC,
      UserPermissionRole.CUSTOMER,
    ]),
  };
}

// ── Typed variant tables ──────────────────────────────────────────────────────

type ModelTier = "brilliant" | "kimi" | "uncensored";

const MODEL_TIER: Record<
  ModelTier,
  { ring: string; dot: string; label: string; bg: string }
> = {
  brilliant: {
    ring: "border-amber-300 dark:border-amber-700",
    dot: "bg-amber-400",
    label: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/20",
  },
  kimi: {
    ring: "border-blue-300 dark:border-blue-700",
    dot: "bg-blue-400",
    label: "text-blue-700 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/20",
  },
  uncensored: {
    ring: "border-red-300 dark:border-red-700",
    dot: "bg-red-400",
    label: "text-red-700 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-950/20",
  },
};

function TierCard({
  tier,
  label,
  model,
  body,
}: {
  tier: ModelTier;
  label: string;
  model: string;
  body: string;
}): JSX.Element {
  const s = MODEL_TIER[tier];
  return (
    <Div className={`rounded-xl border p-4 ${s.bg} ${s.ring}`}>
      <Div className="flex items-center gap-2 mb-1">
        <Div className={`h-2 w-2 rounded-full shrink-0 ${s.dot}`} />
        <Span
          className={`text-xs font-bold uppercase tracking-wider ${s.label}`}
        >
          {label}
        </Span>
      </Div>
      <Div className="text-xs text-muted-foreground mb-2 pl-4">{model}</Div>
      <P className="text-sm text-muted-foreground leading-relaxed pl-4">
        {body}
      </P>
    </Div>
  );
}

type ExampleVariant = "med" | "knowledge" | "creative" | "dev";

const EXAMPLE_STYLE: Record<
  ExampleVariant,
  { border: string; dot: string; label: string }
> = {
  med: {
    border: "border-cyan-200 dark:border-cyan-800",
    dot: "bg-cyan-500",
    label: "text-cyan-700 dark:text-cyan-400",
  },
  knowledge: {
    border: "border-amber-200 dark:border-amber-800",
    dot: "bg-amber-500",
    label: "text-amber-700 dark:text-amber-400",
  },
  creative: {
    border: "border-purple-200 dark:border-purple-800",
    dot: "bg-purple-500",
    label: "text-purple-700 dark:text-purple-400",
  },
  dev: {
    border: "border-emerald-200 dark:border-emerald-800",
    dot: "bg-emerald-500",
    label: "text-emerald-700 dark:text-emerald-400",
  },
};

function ExampleCard({
  title,
  body,
  variant,
}: {
  title: string;
  body: string;
  variant: ExampleVariant;
}): JSX.Element {
  const s = EXAMPLE_STYLE[variant];
  return (
    <Div className={`rounded-xl border p-4 bg-background ${s.border}`}>
      <Div className="flex items-center gap-2 mb-2">
        <Div className={`h-2 w-2 rounded-full shrink-0 ${s.dot}`} />
        <Div
          className={`text-xs font-bold uppercase tracking-wider ${s.label}`}
        >
          {title}
        </Div>
      </Div>
      <P className="text-sm text-muted-foreground leading-relaxed">{body}</P>
    </Div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function TanstackPage({
  locale,
  skillCount,
}: WhatsNewApril2026PageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");

  return (
    <Div className="min-h-screen bg-background">
      {/* Top bar */}
      <Div className="bg-purple-700 border-b border-purple-800">
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
      <Div className="bg-gradient-to-b from-purple-50 to-background dark:from-purple-950/20 dark:to-background border-b border-purple-100 dark:border-purple-900/30">
        <Div className="container mx-auto px-4 pt-8 pb-12 max-w-3xl">
          <Link
            href={`/${locale}/story/blog`}
            className="inline-flex items-center text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 mb-8 transition-colors"
          >
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            {t("hero.backToBlog")}
          </Link>
          <Div className="flex items-center gap-2 mb-5">
            <Div className="px-2.5 py-0.5 bg-purple-700 rounded-full text-white text-xs font-semibold uppercase tracking-wider">
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
          <Div className="px-5 py-4 rounded-xl bg-white dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200 text-sm italic max-w-xl">
            {t("hero.quote")}
          </Div>
        </Div>
      </Div>

      <Div className="container mx-auto px-4 py-12 max-w-3xl space-y-14">
        {/* ── Honest ── plain prose, no chrome */}
        <Div>
          <H2 className="text-xl font-bold mb-4">{t("honest.title")}</H2>
          <P className="text-muted-foreground leading-relaxed mb-3">
            {t("honest.p1", { appName })}
          </P>
          <P className="text-muted-foreground leading-relaxed">
            {t("honest.p2")}
          </P>
        </Div>

        <Separator />

        {/* ── What changed ── compact checklist */}
        <Div>
          <Div className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 mb-4">
            {t("whatsNew.label")}
          </Div>
          <Div className="space-y-2.5">
            {(
              [
                { key: "whatsNew.item1", dot: "bg-purple-500" },
                { key: "whatsNew.item2", dot: "bg-blue-500" },
                { key: "whatsNew.item3", dot: "bg-blue-400" },
                { key: "whatsNew.item4", dot: "bg-slate-400" },
                { key: "whatsNew.item5", dot: "bg-emerald-500" },
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
          <Div className="mt-6 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 px-4 py-3 text-sm text-blue-800 dark:text-blue-200">
            {t("whatsNew.betaNote")}
          </Div>
        </Div>

        <Separator />

        {/* ── Multimodal ── progressive reveal: lead → how → examples → note */}
        <Div>
          <H2 className="text-xl font-bold mb-3">{t("multimodal.title")}</H2>
          <P className="text-muted-foreground leading-relaxed mb-4">
            {t("multimodal.lead")}
          </P>
          <P className="text-muted-foreground leading-relaxed mb-6">
            {t("multimodal.how", { appName })}
          </P>

          {/* Two concrete examples side by side */}
          <Div className="grid sm:grid-cols-2 gap-3 mb-6">
            <Div className="rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 px-4 py-4">
              <Div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                {t("multimodal.visionLabel")}
              </Div>
              <P className="text-sm text-muted-foreground leading-relaxed">
                {t("multimodal.vision")}
              </P>
            </Div>
            <Div className="rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 px-4 py-4">
              <Div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                {t("multimodal.localLabel")}
              </Div>
              <P className="text-sm text-muted-foreground leading-relaxed">
                {t("multimodal.local")}
              </P>
            </Div>
          </Div>

          <Div className="rounded-lg bg-muted/40 border px-4 py-3 text-sm text-muted-foreground">
            {t("multimodal.note")}
          </Div>
        </Div>

        <Separator />

        {/* ── Companions ── two cards side by side, dark headers with personality */}
        <Div>
          <H2 className="text-xl font-bold mb-1">{t("companions.title")}</H2>
          <P className="text-muted-foreground text-sm mb-6">
            {t("companions.subtitle")}
          </P>

          <Div className="grid sm:grid-cols-2 gap-4 mb-5">
            {/* Thea */}
            <Div className="rounded-xl border border-purple-200 dark:border-purple-800 overflow-hidden">
              <Div className="bg-purple-700 px-5 py-4">
                <Div className="font-bold text-white">
                  {t("companions.theaName")}
                </Div>
                <Div className="text-purple-200 text-xs mt-0.5">
                  {t("companions.theaTagline")}
                </Div>
              </Div>
              <Div className="px-5 py-4">
                <P className="text-sm text-muted-foreground leading-relaxed">
                  {t("companions.theaBody")}
                </P>
              </Div>
            </Div>

            {/* Hermes */}
            <Div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <Div className="bg-slate-800 px-5 py-4">
                <Div className="font-bold text-white">
                  {t("companions.hermesName")}
                </Div>
                <Div className="text-slate-300 text-xs mt-0.5">
                  {t("companions.hermesTagline")}
                </Div>
              </Div>
              <Div className="px-5 py-4">
                <P className="text-sm text-muted-foreground leading-relaxed">
                  {t("companions.hermesBody")}
                </P>
              </Div>
            </Div>
          </Div>

          {/* Variants inline */}
          <Div className="rounded-lg bg-muted/40 border px-4 py-3 text-sm text-muted-foreground mb-3">
            <Span className="font-semibold text-foreground">
              {t("companions.variantsLabel")} —{" "}
            </Span>
            {t("companions.variantsBody")}
          </Div>
          <Div className="rounded-lg bg-muted/40 border px-4 py-3 text-sm text-muted-foreground">
            <Span className="font-semibold text-foreground">
              {t("companions.tipLabel")}
            </Span>
            {t("companions.resetTip")}
          </Div>
        </Div>

        <Separator />

        {/* ── Model tiers ── three cards, color coded */}
        <Div>
          <H2 className="text-xl font-bold mb-2">{t("modelTiers.title")}</H2>
          <P className="text-muted-foreground text-sm mb-6">
            {t("modelTiers.intro")}
          </P>

          <Div className="grid sm:grid-cols-3 gap-3 mb-4">
            <TierCard
              tier="brilliant"
              label={t("modelTiers.brilliantLabel")}
              model={t("modelTiers.brilliantModel")}
              body={t("modelTiers.brilliantBody")}
            />
            <TierCard
              tier="kimi"
              label={t("modelTiers.kimiLabel")}
              model={t("modelTiers.kimiModel")}
              body={t("modelTiers.kimiBody")}
            />
            <TierCard
              tier="uncensored"
              label={t("modelTiers.uncensoredLabel")}
              model={t("modelTiers.uncensoredModel")}
              body={t("modelTiers.uncensoredBody")}
            />
          </Div>
          <Div className="rounded-lg bg-muted/40 border px-4 py-3 text-sm text-muted-foreground">
            {t("modelTiers.note")}
          </Div>
        </Div>

        <Separator />

        {/* ── Skills ── prose, no fake list */}
        <Div>
          <H2 className="text-xl font-bold mb-4">
            {t("skills.title", { skillCount })}
          </H2>
          <P className="text-muted-foreground leading-relaxed mb-4">
            {t("skills.p1")}
          </P>
          <P className="text-muted-foreground leading-relaxed mb-4">
            {t("skills.p2")}
          </P>
          <P className="text-muted-foreground leading-relaxed">
            {t("skills.p3")}
          </P>
        </Div>

        <Separator />

        {/* ── Skill economy ── pitch section */}
        <Div>
          <H2 className="text-xl font-bold mb-4">{t("skillEconomy.title")}</H2>
          <P className="text-muted-foreground leading-relaxed mb-3">
            {t("skillEconomy.p1")}
          </P>
          <P className="text-muted-foreground leading-relaxed mb-8">
            {t("skillEconomy.p2")}
          </P>

          <H3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
            {t("skillEconomy.examplesLabel")}
          </H3>
          <Div className="grid sm:grid-cols-2 gap-3 mb-6">
            <ExampleCard
              title={t("skillEconomy.example1Title")}
              body={t("skillEconomy.example1Body")}
              variant="med"
            />
            <ExampleCard
              title={t("skillEconomy.example2Title")}
              body={t("skillEconomy.example2Body")}
              variant="knowledge"
            />
            <ExampleCard
              title={t("skillEconomy.example3Title")}
              body={t("skillEconomy.example3Body")}
              variant="creative"
            />
            <ExampleCard
              title={t("skillEconomy.example4Title")}
              body={t("skillEconomy.example4Body")}
              variant="dev"
            />
          </Div>

          <Div className="rounded-lg bg-muted/40 border px-4 py-3 text-sm text-muted-foreground mb-6">
            {t("skillEconomy.note")}
          </Div>

          <Div className="flex flex-col sm:flex-row gap-3">
            <Button
              asChild
              size="lg"
              className="gap-2 bg-purple-700 hover:bg-purple-800 text-white"
            >
              <Link href={`/${locale}/skills`}>
                {t("skillEconomy.cta")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={`/${locale}/user/referral`}>
                {t("skillEconomy.ctaReferral")}
              </Link>
            </Button>
          </Div>
        </Div>

        <Separator />

        {/* ── Roadmap ── brief */}
        <Div>
          <H2 className="text-xl font-bold mb-4">{t("roadmap.title")}</H2>
          <P className="text-muted-foreground leading-relaxed mb-3">
            {t("roadmap.p1", { appName })}
          </P>
          <P className="text-muted-foreground leading-relaxed">
            {t("roadmap.p2")}
          </P>
        </Div>

        <Separator />

        {/* ── Mission ── conviction statement + Hermes quote */}
        <Div>
          <H2 className="text-xl font-bold mb-4">{t("mission.title")}</H2>
          <P className="text-muted-foreground leading-relaxed mb-3">
            {t("mission.p1")}
          </P>
          <P className="text-muted-foreground leading-relaxed mb-6">
            {t("mission.p2")}
          </P>
          <Div className="px-5 py-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm italic">
            {t("mission.hermesQuote")}
          </Div>
        </Div>

        <Separator />

        {/* ── Feedback ── CTA */}
        <Div>
          <H2 className="text-xl font-bold mb-4">{t("feedback.title")}</H2>
          <P className="text-muted-foreground leading-relaxed mb-3">
            {t("feedback.p1", { appName })}
          </P>
          <P className="text-muted-foreground leading-relaxed mb-6">
            {t("feedback.p2")}
          </P>

          <Div className="rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 px-5 py-4 mb-4">
            <Div className="font-semibold text-purple-900 dark:text-purple-200 text-sm mb-1">
              {t("feedback.rewardTitle")}
            </Div>
            <P className="text-sm text-purple-800 dark:text-purple-300 leading-relaxed">
              {t("feedback.rewardBody")}
            </P>
          </Div>

          <Div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
            {t("feedback.payingNote")}
          </Div>
        </Div>

        <Separator />

        {/* ── Close ── */}
        <Div>
          <H2 className="text-xl font-bold mb-4">{t("close.title")}</H2>
          <P className="text-muted-foreground leading-relaxed mb-3">
            {t("close.p1")}
          </P>
          <P className="text-muted-foreground leading-relaxed mb-8">
            {t("close.p2")}
          </P>
          <Div className="flex flex-col sm:flex-row gap-3">
            <Button
              asChild
              size="lg"
              className="gap-2 bg-purple-700 hover:bg-purple-800 text-white"
            >
              <Link href={`/${locale}/chat`}>
                {t("close.cta", { appName })}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link href="mailto:feedback@unbottled.ai">
                {t("close.ctaFeedback")}
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

export default async function WhatsNewApril2026Page({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
