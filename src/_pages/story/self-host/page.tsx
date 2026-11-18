import type { Metadata } from "next";
import { getEnvAvailability } from "next-vibe/agent/env-availability";
import { getAvailableChatModelCount } from "next-vibe/agent/models/all-models";
import { coreClientEnv as envClient } from "next-vibe/core/env-client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import type { JWTPublicPayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { Platform } from "next-vibe/platforms/platforms";
import { Div } from "next-vibe/ui/components/div";
import { Activity } from "next-vibe/ui/components/icons/Activity";
import { ArrowDown } from "next-vibe/ui/components/icons/ArrowDown";
import { Bot } from "next-vibe/ui/components/icons/Bot";
import { Check } from "next-vibe/ui/components/icons/Check";
import { Cloud } from "next-vibe/ui/components/icons/Cloud";
import { Cpu } from "next-vibe/ui/components/icons/Cpu";
import { Database } from "next-vibe/ui/components/icons/Database";
import { Github } from "next-vibe/ui/components/icons/Github";
import { Key } from "next-vibe/ui/components/icons/Key";
import { Lock } from "next-vibe/ui/components/icons/Lock";
import { Search } from "next-vibe/ui/components/icons/Search";
import { Server } from "next-vibe/ui/components/icons/Server";
import { Terminal } from "next-vibe/ui/components/icons/Terminal";
import { Span } from "next-vibe/ui/components/span";
import { H3, P } from "next-vibe/ui/components/typography";
import type { IconComponent } from "next-vibe/ui/lib/helper";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import type { JSX } from "react";

import { GITHUB_REPO_URL } from "@/env/constants";
import { configScopedTranslation } from "@/env/i18n";

import { ContactFormSection } from "../_components/contact-form-section";
import { PersonalShowcase } from "../_components/personal-showcase";
import {
  CardLink,
  Cta,
  FeatureCard,
  FeatureGrid,
  PageHero,
  PageSection,
} from "../_shared/marketing";
import { Quickstart } from "../_shared/quickstart/quickstart";
import { scopedTranslation } from "./i18n";

export interface SelfHostPageData {
  locale: CountryLanguage;
  modelCount: number;
  platform: Platform;
}

export async function tanstackLoader({
  params,
}: {
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<SelfHostPageData> {
  const { locale } = await params;
  const modelCount = getAvailableChatModelCount(
    false,
    await getEnvAvailability(),
  );
  return {
    locale,
    modelCount,
    platform: Platform.NEXT_PAGE,
  };
}

export const revalidate = 3600;

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  return metadataGenerator(locale, {
    path: "story/self-host",
    title: t("meta.title", { appName }),
    category: t("meta.category"),
    description: t("meta.description", { appName }),
    image: `${envClient.NEXT_PUBLIC_APP_URL}/images/home-hero.jpg`,
    imageAlt: t("meta.imageAlt", { appName }),
    keywords: [t("meta.keywords", { appName })],
  });
}

const OPENROUTER_KEYS_URL = "https://openrouter.ai/keys";

const INCLUDES = [
  { key: "models", icon: Cpu },
  { key: "memory", icon: Lock },
  { key: "search", icon: Search },
  { key: "thea", icon: Bot },
  { key: "admin", icon: Activity },
  { key: "tools", icon: Terminal },
] as const;

const ACCOUNT_POINTS = ["models", "local", "sync", "paid"] as const;
const STANDALONE_POINTS = ["openrouter", "claude", "more", "billing"] as const;

function PathCard({
  icon: Icon,
  badge,
  title,
  body,
  points,
  footer,
  highlighted = false,
}: {
  icon: IconComponent;
  badge: string;
  title: string;
  body: string;
  points: string[];
  footer: JSX.Element;
  highlighted?: boolean;
}): JSX.Element {
  return (
    <Div
      className={cn(
        "flex h-full min-w-0 flex-col rounded-2xl border bg-card p-6 shadow-xs md:p-8",
        highlighted
          ? "border-primary/40 ring-1 ring-primary/15"
          : "border-border",
      )}
    >
      <Div className="flex items-center justify-between gap-3">
        <Div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </Div>
        <Span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold",
            highlighted
              ? "bg-primary text-primary-foreground"
              : "border border-border text-muted-foreground",
          )}
        >
          {badge}
        </Span>
      </Div>
      <H3 className="mt-5 text-xl font-semibold tracking-tight md:text-2xl">
        {title}
      </H3>
      <P className="mt-2 text-base leading-relaxed text-muted-foreground">
        {body}
      </P>
      <Div className="mt-5 flex flex-col gap-3">
        {points.map((point) => (
          <Div key={point} className="flex gap-3">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <P className="text-sm leading-relaxed text-foreground/90">
              {point}
            </P>
          </Div>
        ))}
      </Div>
      <Div className="mt-auto pt-6">{footer}</Div>
    </Div>
  );
}

export function TanstackPage({
  locale,
  modelCount,
  platform,
}: SelfHostPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");

  const publicUser: JWTPublicPayloadType = {
    isPublic: true,
    leadId: "00000000-0000-0000-0000-000000000000",
    roles: [UserPermissionRole.PUBLIC],
  };

  return (
    <Div className="min-h-screen bg-background">
      <PageHero
        eyebrow={t("hero.badge")}
        eyebrowIcon={Server}
        title={
          <>
            {t("hero.title")}{" "}
            <Span className="text-primary">{t("hero.titleHighlight")}</Span>
          </>
        }
        subtitle={t("hero.subtitle", { appName })}
        actions={
          <>
            <Cta
              href="#quickstart"
              label={t("hero.ctaQuickstart")}
              icon={ArrowDown}
              arrow={false}
            />
            <Cta
              href={GITHUB_REPO_URL}
              label={t("hero.ctaGithub")}
              icon={Github}
              variant="secondary"
              external
            />
          </>
        }
      />

      <PageSection
        id="quickstart"
        tone="muted"
        label={t("quickstart.eyebrow")}
        title={t("quickstart.title")}
        intro={t("quickstart.intro")}
      >
        <Quickstart locale={locale} />
      </PageSection>

      <PageSection
        id="ai"
        label={t("paths.eyebrow")}
        title={t("paths.title")}
        intro={t("paths.intro")}
      >
        <Div className="grid gap-6 lg:grid-cols-2">
          <PathCard
            highlighted
            icon={Cloud}
            badge={t("paths.account.badge")}
            title={t("paths.account.title", { appName })}
            body={t("paths.account.body", { appName })}
            points={ACCOUNT_POINTS.map((key) =>
              t(`paths.account.points.${key}`, { appName, modelCount }),
            )}
            footer={
              <CardLink
                href={`/${locale}/user/signup`}
                label={t("paths.account.cta", { appName })}
              />
            }
          />
          <PathCard
            icon={Key}
            badge={t("paths.standalone.badge")}
            title={t("paths.standalone.title")}
            body={t("paths.standalone.body", { appName })}
            points={STANDALONE_POINTS.map((key) =>
              t(`paths.standalone.points.${key}`, { appName }),
            )}
            footer={
              <CardLink
                href={OPENROUTER_KEYS_URL}
                label={t("paths.standalone.cta")}
                external
              />
            }
          />
        </Div>
      </PageSection>

      <PersonalShowcase locale={locale} onStoryPage />

      <PageSection
        tone="muted"
        label={t("own.eyebrow")}
        title={t("own.title")}
        intro={t("own.subtitle")}
      >
        <FeatureGrid columns={3}>
          <FeatureCard icon={Database} title={t("own.cards.data.title")}>
            {t("own.cards.data.body")}
          </FeatureCard>
          <FeatureCard icon={Lock} title={t("own.cards.filter.title")}>
            {t("own.cards.filter.body")}
          </FeatureCard>
          <FeatureCard icon={Cpu} title={t("own.cards.keys.title")}>
            {t("own.cards.keys.body", { appName })}
          </FeatureCard>
        </FeatureGrid>

        <Div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-xs md:mt-8 md:p-8">
          <H3 className="text-xl font-semibold tracking-tight">
            {t("includes.title")}
          </H3>
          <P className="mt-1 text-sm leading-relaxed text-muted-foreground md:text-base">
            {t("includes.intro", { appName })}
          </P>
          <Div className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {INCLUDES.map(({ key, icon: Icon }) => (
              <Div key={key} className="flex items-start gap-3">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <P className="text-sm leading-relaxed text-foreground/90">
                  {t(`includes.items.${key}`, { appName, modelCount })}
                </P>
              </Div>
            ))}
          </Div>
        </Div>
      </PageSection>

      <Div className="border-b border-border">
        <Div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-2 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <P className="text-base text-foreground">
            <Span className="font-semibold">{t("developers.title")}</Span>{" "}
            <Span className="text-muted-foreground">
              {t("developers.body")}
            </Span>
          </P>
          <Div className="shrink-0 whitespace-nowrap">
            <CardLink
              href={`/${locale}/story/framework`}
              label={t("developers.cta")}
            />
          </Div>
        </Div>
      </Div>

      <PageSection
        title={t("help.title")}
        intro={t("help.description")}
        centeredHeader
      >
        <Div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-5 shadow-xs md:p-8">
          <ContactFormSection
            locale={locale}
            user={publicUser}
            platform={platform}
            embedded
          />
        </Div>
      </PageSection>
    </Div>
  );
}

export default async function SelfHostPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
