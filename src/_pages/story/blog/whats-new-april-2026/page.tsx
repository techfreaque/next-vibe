import type { Metadata } from "next";
import { getAvailableSkillCount } from "next-vibe/agent/skills/config";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { Div } from "next-vibe/ui/components/div";
import { Activity } from "next-vibe/ui/components/icons/Activity";
import { Bot } from "next-vibe/ui/components/icons/Bot";
import { Gift } from "next-vibe/ui/components/icons/Gift";
import { Info } from "next-vibe/ui/components/icons/Info";
import { Server } from "next-vibe/ui/components/icons/Server";
import { Sparkles } from "next-vibe/ui/components/icons/Sparkles";
import { Star } from "next-vibe/ui/components/icons/Star";
import { Span } from "next-vibe/ui/components/span";
import { H3, P } from "next-vibe/ui/components/typography";
import type { IconComponent } from "next-vibe/ui/lib/helper";
import type { JSX, ReactNode } from "react";

import { FEEDBACK_REWARD_CREDITS } from "@/credits/constants";
import { configScopedTranslation } from "@/env/i18n";

import {
  ArticleBody,
  ArticleEnd,
  ArticleH3,
  ArticleHeader,
  ArticleList,
  ArticleP,
  ArticleQuote,
  ArticleSection,
} from "../../_shared/article";
import { Callout, Cta, CtaRow } from "../../_shared/marketing";
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

// ── Local building blocks ───────────────────────────────────────────────────

function LabeledCard({
  label,
  meta,
  children,
}: {
  label: string;
  meta?: string;
  children: ReactNode;
}): JSX.Element {
  return (
    <Div className="flex h-full flex-col rounded-xl border border-border bg-card p-5 shadow-xs">
      <Span className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
        {label}
      </Span>
      {meta !== undefined && (
        <Span className="mt-1 font-mono text-xs text-muted-foreground">
          {meta}
        </Span>
      )}
      <P className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {children}
      </P>
    </Div>
  );
}

function CompanionCard({
  icon: Icon,
  name,
  tagline,
  body,
}: {
  icon: IconComponent;
  name: string;
  tagline: string;
  body: string;
}): JSX.Element {
  return (
    <Div className="flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-xs">
      <Div className="flex items-center gap-3">
        <Div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </Div>
        <Div className="min-w-0">
          <H3 className="text-lg font-semibold leading-tight tracking-tight">
            {name}
          </H3>
          <P className="text-sm leading-snug text-muted-foreground">
            {tagline}
          </P>
        </Div>
      </Div>
      <P className="mt-4 text-[0.9375rem] leading-relaxed text-foreground/90">
        {body}
      </P>
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
  const back = { href: `/${locale}/story/blog`, label: t("hero.backToBlog") };

  return (
    <Div className="min-h-screen bg-background">
      <ArticleHeader
        back={back}
        category={t("hero.category")}
        readTime={t("hero.readTime")}
        date={formatPostDate("whats-new-april-2026", locale)}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
      />

      <ArticleBody>
        <ArticleQuote>{t("hero.quote")}</ArticleQuote>

        <ArticleSection title={t("honest.title")}>
          <ArticleP>{t("honest.p1", { appName })}</ArticleP>
          <ArticleP>{t("honest.p2")}</ArticleP>
        </ArticleSection>

        <ArticleSection label={t("whatsNew.label")}>
          <ArticleList
            items={[
              t("whatsNew.item1"),
              t("whatsNew.item2"),
              t("whatsNew.item3"),
              t("whatsNew.item4"),
              t("whatsNew.item5"),
            ]}
          />
          <Callout icon={Info} tone="neutral">
            {t("whatsNew.betaNote")}
          </Callout>
        </ArticleSection>

        <ArticleSection title={t("multimodal.title")}>
          <ArticleP>{t("multimodal.lead")}</ArticleP>
          <ArticleP>{t("multimodal.how", { appName })}</ArticleP>
          <Div className="grid gap-4 sm:grid-cols-2">
            <LabeledCard label={t("multimodal.visionLabel")}>
              {t("multimodal.vision")}
            </LabeledCard>
            <LabeledCard label={t("multimodal.localLabel")}>
              {t("multimodal.local", { appName })}
            </LabeledCard>
          </Div>
          <Callout icon={Info} tone="neutral">
            {t("multimodal.note")}
          </Callout>
        </ArticleSection>

        <ArticleSection title={t("monitoring.title")}>
          <ArticleP>{t("monitoring.p1")}</ArticleP>
          <ArticleP>{t("monitoring.p2")}</ArticleP>
          <Callout icon={Activity} tone="success">
            {t("monitoring.note", { appName })}
          </Callout>
        </ArticleSection>

        <ArticleSection
          title={t("companions.title")}
          intro={t("companions.subtitle")}
        >
          <Div className="grid gap-4 sm:grid-cols-2">
            <CompanionCard
              icon={Sparkles}
              name={t("companions.theaName")}
              tagline={t("companions.theaTagline")}
              body={t("companions.theaBody")}
            />
            <CompanionCard
              icon={Bot}
              name={t("companions.hermesName")}
              tagline={t("companions.hermesTagline")}
              body={t("companions.hermesBody")}
            />
          </Div>
          <Callout tone="neutral">
            <Span className="font-semibold">
              {t("companions.variantsLabel")} —{" "}
            </Span>
            {t("companions.variantsBody")}
          </Callout>
          <Callout tone="neutral">
            <Span className="font-semibold">{t("companions.tipLabel")}</Span>
            {t("companions.resetTip")}
          </Callout>
        </ArticleSection>

        <ArticleSection
          title={t("modelTiers.title")}
          intro={t("modelTiers.intro")}
        >
          <Div className="grid gap-4 md:grid-cols-3">
            <LabeledCard
              label={t("modelTiers.brilliantLabel")}
              meta={t("modelTiers.brilliantModel")}
            >
              {t("modelTiers.brilliantBody")}
            </LabeledCard>
            <LabeledCard
              label={t("modelTiers.kimiLabel")}
              meta={t("modelTiers.kimiModel")}
            >
              {t("modelTiers.kimiBody")}
            </LabeledCard>
            <LabeledCard
              label={t("modelTiers.uncensoredLabel")}
              meta={t("modelTiers.uncensoredModel")}
            >
              {t("modelTiers.uncensoredBody")}
            </LabeledCard>
          </Div>
          <Callout icon={Info} tone="neutral">
            {t("modelTiers.note")}
          </Callout>
        </ArticleSection>

        <ArticleSection title={t("skills.title", { skillCount })}>
          <ArticleP>{t("skills.p1")}</ArticleP>
          <ArticleP>{t("skills.p2")}</ArticleP>
          <ArticleP>{t("skills.p3")}</ArticleP>
        </ArticleSection>

        <ArticleSection title={t("skillEconomy.title")}>
          <ArticleP>{t("skillEconomy.p1")}</ArticleP>
          <ArticleP>{t("skillEconomy.p2")}</ArticleP>
          <ArticleH3>{t("skillEconomy.examplesLabel")}</ArticleH3>
          <Div className="grid gap-4 sm:grid-cols-2">
            <LabeledCard label={t("skillEconomy.example1Title")}>
              {t("skillEconomy.example1Body")}
            </LabeledCard>
            <LabeledCard label={t("skillEconomy.example2Title")}>
              {t("skillEconomy.example2Body")}
            </LabeledCard>
            <LabeledCard label={t("skillEconomy.example3Title")}>
              {t("skillEconomy.example3Body")}
            </LabeledCard>
            <LabeledCard label={t("skillEconomy.example4Title")}>
              {t("skillEconomy.example4Body")}
            </LabeledCard>
          </Div>
          <Callout icon={Info} tone="neutral">
            {t("skillEconomy.note")}
          </Callout>
          <CtaRow>
            <Cta href={`/${locale}/skills`} label={t("skillEconomy.cta")} />
            <Cta
              href={`/${locale}/user/referral`}
              label={t("skillEconomy.ctaReferral")}
              variant="secondary"
            />
          </CtaRow>
        </ArticleSection>

        <ArticleSection title={t("selfHost.title")}>
          <ArticleP>{t("selfHost.p1", { appName })}</ArticleP>
          <ArticleP>{t("selfHost.p2", { appName })}</ArticleP>
          <Callout icon={Server} tone="neutral">
            {t("selfHost.note")}
          </Callout>
        </ArticleSection>

        <ArticleSection title={t("roadmap.title")}>
          <ArticleP>{t("roadmap.p1", { appName })}</ArticleP>
          <ArticleP>{t("roadmap.p2")}</ArticleP>
        </ArticleSection>

        <ArticleSection title={t("mission.title")}>
          <ArticleP>{t("mission.p1")}</ArticleP>
          <ArticleP>{t("mission.p2")}</ArticleP>
          <ArticleQuote>{t("mission.hermesQuote")}</ArticleQuote>
        </ArticleSection>

        <ArticleSection title={t("feedback.title")}>
          <ArticleP>{t("feedback.p1", { appName })}</ArticleP>
          <ArticleP>{t("feedback.p2")}</ArticleP>
          <Callout icon={Gift}>
            <P className="font-semibold">
              {t("feedback.rewardTitle", { credits: FEEDBACK_REWARD_CREDITS })}
            </P>
            <P className="mt-1 text-muted-foreground">
              {t("feedback.rewardBody", { credits: FEEDBACK_REWARD_CREDITS })}
            </P>
            <Div className="mt-4">
              <Cta
                href={`/${locale}/help`}
                label={t("feedback.cta")}
                variant="secondary"
              />
            </Div>
          </Callout>
          <Callout icon={Star} tone="warning">
            {t("feedback.payingNote")}
          </Callout>
        </ArticleSection>

        <ArticleSection title={t("close.title")}>
          <ArticleP>{t("close.p1")}</ArticleP>
          <ArticleP>{t("close.p2")}</ArticleP>
        </ArticleSection>

        <ArticleEnd
          back={back}
          title={t("cta.title")}
          subtitle={t("cta.subtitle")}
          actions={
            <>
              <Cta
                href={`/${locale}/threads`}
                label={t("close.cta", { appName })}
              />
              <Cta
                href={`/${locale}/help`}
                label={t("feedback.cta")}
                variant="secondary"
              />
            </>
          }
        />
      </ArticleBody>
    </Div>
  );
}

export default async function WhatsNewApril2026Page({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
