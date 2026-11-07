import type { Metadata } from "next";
import { getEnvAvailability } from "next-vibe/agent/env-availability";
import { getAvailableModelCount } from "next-vibe/agent/models/all-models";
import { getAvailableSkillCount } from "next-vibe/agent/skills/config";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { Div } from "next-vibe/ui/components/div";
import { Compass } from "next-vibe/ui/components/icons/Compass";
import { Github } from "next-vibe/ui/components/icons/Github";
import { Heart } from "next-vibe/ui/components/icons/Heart";
import { Lock } from "next-vibe/ui/components/icons/Lock";
import { Mail } from "next-vibe/ui/components/icons/Mail";
import { MessageSquare } from "next-vibe/ui/components/icons/MessageSquare";
import { Server } from "next-vibe/ui/components/icons/Server";
import { Shield } from "next-vibe/ui/components/icons/Shield";
import { Sliders } from "next-vibe/ui/components/icons/Sliders";
import { Users } from "next-vibe/ui/components/icons/Users";
import { Zap } from "next-vibe/ui/components/icons/Zap";
import type { JSX } from "react";

import { configScopedTranslation } from "@/env/i18n";

import {
  Callout,
  Cta,
  CtaBand,
  FeatureCard,
  FeatureGrid,
  PageHero,
  PageSection,
  StatGrid,
} from "../_shared/marketing";
import { scopedTranslation } from "./i18n";

// Revalidate every hour (ISR)
export const revalidate = 3600;

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

/**
 * Generate metadata for the About Us page with translations
 */
export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { locale } = await params;
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  return metadataGenerator(locale, {
    path: "about-us",
    title: t("meta.title", { appName }),
    category: t("meta.category"),
    description: t("meta.description", { appName }),
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Building_perspective.jpg/1920px-Building_perspective.jpg",
    imageAlt: t("meta.imageAlt", { appName }),
    keywords: [t("meta.keywords", { appName })],
    additionalMetadata: {
      openGraph: {
        title: t("meta.ogTitle", { appName }),
        description: t("meta.ogDescription"),
      },
      twitter: {
        title: t("meta.twitterTitle", { appName }),
        description: t("meta.twitterDescription"),
      },
    },
  });
};

export interface AboutUsPageData {
  locale: CountryLanguage;
  totalModelCount: number;
  skillCount: number;
  toolCount: number;
}

export async function tanstackLoader({
  params,
}: Props): Promise<AboutUsPageData> {
  const { locale } = await params;
  const totalModelCount = getAvailableModelCount(
    false,
    await getEnvAvailability(),
  );
  const { endpointsMeta } = await import("@/generated/endpoints/meta/en");
  return {
    locale,
    totalModelCount,
    skillCount: getAvailableSkillCount([
      UserPermissionRole.PUBLIC,
      UserPermissionRole.CUSTOMER,
    ]),
    toolCount: endpointsMeta.length,
  };
}

const FOUNDED_YEAR = 2024;

export function TanstackPage({
  locale,
  totalModelCount,
  skillCount,
  toolCount,
}: AboutUsPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");

  const principles = [
    {
      icon: Sliders,
      title: t("values.excellence.title"),
      description: t("values.excellence.description"),
    },
    {
      icon: Github,
      title: t("values.innovation.title"),
      description: t("values.innovation.description", { appName }),
    },
    {
      icon: Lock,
      title: t("values.integrity.title"),
      description: t("values.integrity.description"),
    },
    {
      icon: Users,
      title: t("values.collaboration.title"),
      description: t("values.collaboration.description"),
    },
  ];

  const mission = [
    {
      icon: Compass,
      title: t("mission.vision.title"),
      description: t("mission.vision.description"),
    },
    {
      icon: Zap,
      title: t("mission.approach.title"),
      description: t("mission.approach.description"),
    },
    {
      icon: Shield,
      title: t("mission.commitment.title"),
      description: t("mission.commitment.description"),
    },
  ];

  return (
    <Div className="min-h-screen bg-background">
      <PageHero
        eyebrow={t("hero.eyebrow", { appName })}
        eyebrowIcon={Heart}
        title={t("hero.title")}
        subtitle={t("description", { appName, foundedYear: FOUNDED_YEAR })}
        actions={
          <>
            <Cta
              href={`/${locale}/threads`}
              label={t("hero.ctaPrimary")}
              icon={MessageSquare}
            />
            <Cta
              href={`/${locale}/story/blog`}
              label={t("hero.ctaSecondary")}
              variant="secondary"
            />
          </>
        }
      >
        <StatGrid
          items={[
            { value: totalModelCount, label: t("stats.models") },
            { value: skillCount, label: t("stats.skills") },
            { value: `~${toolCount}`, label: t("stats.tools") },
            { value: FOUNDED_YEAR, label: t("stats.founded") },
          ]}
        />
      </PageHero>

      <PageSection
        label={t("mission.subtitle")}
        title={t("mission.title")}
        intro={t("mission.description", { appName })}
      >
        <FeatureGrid columns={3}>
          {mission.map((item) => (
            <FeatureCard key={item.title} icon={item.icon} title={item.title}>
              {item.description}
            </FeatureCard>
          ))}
        </FeatureGrid>
        <Callout icon={Server} className="mt-6 md:mt-8">
          {t("hero.subtitle", {
            modelCount: totalModelCount,
            skillCount,
            toolCount,
            appName,
          })}
        </Callout>
      </PageSection>

      <PageSection
        tone="muted"
        title={t("values.title")}
        intro={t("values.description", { appName })}
      >
        <FeatureGrid columns={4}>
          {principles.map((item) => (
            <FeatureCard key={item.title} icon={item.icon} title={item.title}>
              {item.description}
            </FeatureCard>
          ))}
        </FeatureGrid>
      </PageSection>

      <CtaBand
        title={t("contact.title")}
        subtitle={t("contact.description")}
        actions={
          <>
            <Cta
              href={`/${locale}/help`}
              label={t("contact.cta")}
              icon={Mail}
            />
            <Cta
              href={`/${locale}/story/self-host`}
              label={t("contact.selfHost")}
              variant="secondary"
            />
          </>
        }
      />
    </Div>
  );
}

export default async function AboutUsPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
