import type { Metadata } from "next";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Div } from "next-vibe/ui/components/div";
import { Bot } from "next-vibe/ui/components/icons/Bot";
import { Brain } from "next-vibe/ui/components/icons/Brain";
import { Gift } from "next-vibe/ui/components/icons/Gift";
import { Image as ImageIcon } from "next-vibe/ui/components/icons/Image";
import { Info } from "next-vibe/ui/components/icons/Info";
import { Moon } from "next-vibe/ui/components/icons/Moon";
import { Music } from "next-vibe/ui/components/icons/Music";
import { H3, P } from "next-vibe/ui/components/typography";
import type { IconComponent } from "next-vibe/ui/lib/helper";
import type { JSX, ReactNode } from "react";

import { FEEDBACK_REWARD_CREDITS } from "@/credits/constants";
import { configScopedTranslation } from "@/env/i18n";

import {
  ArticleBody,
  ArticleEnd,
  ArticleHeader,
  ArticleList,
  ArticleP,
  ArticleQuote,
  ArticleSection,
} from "../../_shared/article";
import { Callout, Cta, FeatureCard } from "../../_shared/marketing";
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

// ── Local building blocks ───────────────────────────────────────────────────

function SystemCard({
  icon: Icon,
  title,
  tagline,
  children,
}: {
  icon: IconComponent;
  title: string;
  tagline: string;
  children: ReactNode;
}): JSX.Element {
  return (
    <Div className="flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-xs">
      <Div className="flex items-start gap-4">
        <Div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </Div>
        <Div className="min-w-0">
          <H3 className="text-lg font-semibold leading-snug tracking-tight">
            {title}
          </H3>
          <P className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {tagline}
          </P>
        </Div>
      </Div>
      <Div className="mt-5 flex flex-col gap-3 border-t border-border pt-5 text-[0.9375rem] leading-relaxed text-foreground/90">
        {children}
      </Div>
    </Div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function TanstackPage({ locale }: WhatsNewMay2026PageData): JSX.Element {
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
        date={formatPostDate("whats-new-may-2026", locale)}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
      />

      <ArticleBody>
        <ArticleQuote>{t("hero.quote")}</ArticleQuote>

        <ArticleSection title={t("honest.title")}>
          <ArticleP>{t("honest.p1")}</ArticleP>
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
              t("whatsNew.item6"),
            ]}
          />
          <Callout icon={Info} tone="neutral">
            {t("whatsNew.betaNote")}
          </Callout>
        </ArticleSection>

        <ArticleSection title={t("media.title")}>
          <ArticleP>{t("media.lead")}</ArticleP>
          <Div className="grid gap-4 sm:grid-cols-2">
            <FeatureCard icon={ImageIcon} title={t("media.imageLabel")}>
              {t("media.image")}
            </FeatureCard>
            <FeatureCard icon={Music} title={t("media.musicLabel")}>
              {t("media.music")}
            </FeatureCard>
          </Div>
          <Callout icon={Info} tone="neutral">
            {t("media.note")}
          </Callout>
        </ArticleSection>

        <Div className="flex flex-col gap-4">
          <SystemCard
            icon={Brain}
            title={t("cortex.title")}
            tagline={t("cortex.tagline")}
          >
            <P>{t("cortex.p1")}</P>
            <P>{t("cortex.p2")}</P>
            <P>{t("cortex.p3")}</P>
            <P className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
              {t("cortex.note")}
            </P>
          </SystemCard>
          <Div className="grid gap-4 md:grid-cols-2">
            <SystemCard
              icon={Moon}
              title={t("dreamer.title")}
              tagline={t("dreamer.tagline")}
            >
              <P>{t("dreamer.p1")}</P>
              <P>{t("dreamer.p2")}</P>
              <P>{t("dreamer.p3")}</P>
            </SystemCard>
            <SystemCard
              icon={Bot}
              title={t("autopilot.title")}
              tagline={t("autopilot.tagline")}
            >
              <P>{t("autopilot.p1")}</P>
              <P>{t("autopilot.p2")}</P>
            </SystemCard>
          </Div>
        </Div>

        <ArticleSection title={t("mission.title")}>
          <ArticleP>{t("mission.p1")}</ArticleP>
          <ArticleP>{t("mission.p2")}</ArticleP>
          <ArticleP>{t("mission.p3")}</ArticleP>
          <ArticleP>{t("mission.p4")}</ArticleP>
        </ArticleSection>

        <ArticleSection
          title={t("feedback.title", { credits: FEEDBACK_REWARD_CREDITS })}
        >
          <ArticleP>{t("feedback.p1")}</ArticleP>
          <ArticleP>
            {t("feedback.p2", { credits: FEEDBACK_REWARD_CREDITS })}
          </ArticleP>
          <Callout icon={Gift}>
            <P className="font-semibold">
              {t("feedback.rewardTitle", { credits: FEEDBACK_REWARD_CREDITS })}
            </P>
            <P className="mt-1 text-muted-foreground">
              {t("feedback.rewardBody")}
            </P>
            <Div className="mt-4">
              <Cta
                href={`/${locale}/help`}
                label={t("feedback.cta")}
                variant="secondary"
              />
            </Div>
          </Callout>
        </ArticleSection>

        <ArticleSection title={t("close.title")}>
          <ArticleP>{t("close.p1")}</ArticleP>
          <ArticleP>{t("close.p2")}</ArticleP>
          <ArticleP className="text-muted-foreground italic">
            {t("close.signature")}
          </ArticleP>
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

export default async function WhatsNewMay2026Page({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
