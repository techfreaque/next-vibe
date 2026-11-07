import type { Metadata } from "next";
import { getMaxToolCountAllPlatforms } from "next-vibe/agent/chat/default-tool-counts";
import { getEnvAvailability } from "next-vibe/agent/env-availability";
import { getAvailableModelCount } from "next-vibe/agent/models/all-models";
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
import { Box } from "next-vibe/ui/components/icons/Box";
import { Cpu } from "next-vibe/ui/components/icons/Cpu";
import { Database } from "next-vibe/ui/components/icons/Database";
import { Github } from "next-vibe/ui/components/icons/Github";
import { Layers } from "next-vibe/ui/components/icons/Layers";
import { Lock } from "next-vibe/ui/components/icons/Lock";
import { RefreshCw } from "next-vibe/ui/components/icons/RefreshCw";
import { Search } from "next-vibe/ui/components/icons/Search";
import { Server } from "next-vibe/ui/components/icons/Server";
import { Terminal } from "next-vibe/ui/components/icons/Terminal";
import { CodeSnippet } from "next-vibe/ui/components/markdown";
import { Span } from "next-vibe/ui/components/span";
import { P } from "next-vibe/ui/components/typography";
import type { JSX } from "react";

import { GITHUB_REPO_URL } from "@/env/constants";
import { configScopedTranslation } from "@/env/i18n";

import { ContactFormSection } from "../_components/contact-form-section";
import { PersonalShowcase } from "../_components/personal-showcase";
import { SelfHostSection } from "../_components/self-host-section";
import {
  Callout,
  Cta,
  FeatureCard,
  FeatureGrid,
  PageHero,
  PageSection,
  Step,
  StepList,
} from "../_shared/marketing";
import { scopedTranslation } from "./i18n";

export interface SelfHostPageData {
  locale: CountryLanguage;
  modelCount: number;
  totalToolCount: number;
  platform: Platform;
}

export async function tanstackLoader({
  params,
}: {
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<SelfHostPageData> {
  const { locale } = await params;
  const modelCount = getAvailableModelCount(false, await getEnvAvailability());
  return {
    locale,
    modelCount,
    totalToolCount: getMaxToolCountAllPlatforms(),
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

const CLONE_SH = `git clone https://github.com/techfreaque/next-vibe
cd next-vibe
bun install`;

const DEV_SH = "vibe dev";

const OPTION_A_SH = `# Claude Code - no API key needed
# Requires Claude subscription + Claude Code CLI
claude login   # sign in once
# Then select any claude-code-* model in the model picker`;

const OPTION_B_SH = `# OpenRouter - 200+ models, pay per use
# Paste your key in Settings → API Keys
# Get yours at openrouter.ai/keys`;

const VPS_DOCKER_SH = `bash scripts/install-docker.sh
vibe build && vibe start
# Point Caddy / nginx at port 3000`;

const K8S_SH = `# Edit k8s/secret.yaml with your env vars
kubectl apply -k k8s/`;

const INCLUDES = [
  { key: "models", icon: Cpu },
  { key: "memory", icon: Lock },
  { key: "search", icon: Search },
  { key: "thea", icon: Bot },
  { key: "admin", icon: Activity },
  { key: "ssh", icon: Terminal },
  { key: "sync", icon: RefreshCw },
  { key: "free", icon: Github },
] as const;

function Shell({
  code,
  filename = "terminal",
}: {
  code: string;
  filename?: string;
}): JSX.Element {
  return (
    <Div className="min-w-0 max-w-full">
      <CodeSnippet
        code={code}
        language="bash"
        filename={filename}
        variant="file"
      />
    </Div>
  );
}

export function TanstackPage({
  locale,
  modelCount,
  totalToolCount,
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

      <PersonalShowcase locale={locale} />

      <PageSection title={t("includes.title")}>
        <FeatureGrid columns={4}>
          {INCLUDES.map(({ key, icon: Icon }) => (
            <Div
              key={key}
              className="flex gap-3 rounded-xl border border-border bg-card p-5 shadow-xs"
            >
              <Div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </Div>
              <P className="text-sm leading-relaxed text-foreground/90">
                {t(`includes.items.${key}`, { appName, modelCount })}
              </P>
            </Div>
          ))}
        </FeatureGrid>
      </PageSection>

      <SelfHostSection locale={locale} totalToolCount={totalToolCount} />

      <PageSection
        id="quickstart"
        tone="muted"
        title={t("quickstart.title")}
        intro={t("quickstart.subtitle")}
      >
        <Div className="max-w-3xl">
          <StepList>
            <Step
              number={1}
              title={t("quickstart.step1.title")}
              description={t("quickstart.step1.description")}
            >
              <Shell code={CLONE_SH} />
            </Step>
            <Step
              number={2}
              title={t("quickstart.step2.title")}
              description={t("quickstart.step2.description")}
            >
              <Shell code={DEV_SH} />
              <Callout icon={Database} tone="neutral" className="mt-4">
                {t("quickstart.step2.noDocker")}
              </Callout>
            </Step>
            <Step
              number={3}
              title={t("quickstart.step3.title")}
              description={t("quickstart.step3.description")}
            />
            <Step number={4} title={t("quickstart.step4.title")}>
              <Div className="flex min-w-0 flex-col gap-4">
                <Div className="min-w-0 rounded-xl border border-primary/30 bg-card p-5">
                  <P className="text-sm font-semibold text-primary">
                    {t("quickstart.step4.optionA.label")}
                  </P>
                  <P className="mt-1 mb-4 text-sm leading-relaxed text-muted-foreground">
                    {t("quickstart.step4.optionA.description")}
                  </P>
                  <Shell code={OPTION_A_SH} />
                </Div>
                <Div className="min-w-0 rounded-xl border border-border bg-card p-5">
                  <P className="text-sm font-semibold">
                    {t("quickstart.step4.optionB.label")}
                  </P>
                  <P className="mt-1 mb-4 text-sm leading-relaxed text-muted-foreground">
                    {t("quickstart.step4.optionB.description")}
                  </P>
                  <Shell code={OPTION_B_SH} />
                </Div>
              </Div>
            </Step>
          </StepList>
        </Div>
      </PageSection>

      <PageSection title={t("vps.title")} intro={t("vps.description")}>
        <FeatureGrid columns={2}>
          <FeatureCard icon={Box} title={t("vps.docker")}>
            <Div className="mt-3">
              <Shell code={VPS_DOCKER_SH} />
            </Div>
          </FeatureCard>
          <FeatureCard icon={Layers} title={t("vps.kubernetes")}>
            {t("vps.kubernetesDescription")}
            <Div className="mt-4">
              <Shell code={K8S_SH} />
            </Div>
          </FeatureCard>
        </FeatureGrid>
        <Callout icon={RefreshCw} tone="neutral" className="mt-6 md:mt-8">
          <Span className="font-semibold text-foreground">
            {t("localSync.title")}
          </Span>{" "}
          <Span className="text-muted-foreground">
            {t("localSync.description")}
          </Span>
        </Callout>
      </PageSection>

      <PageSection
        tone="muted"
        title={t("enterprise.title")}
        intro={t("enterprise.description")}
        centeredHeader
      >
        <Div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-5 shadow-xs md:p-10">
          <ContactFormSection
            locale={locale}
            user={publicUser}
            platform={platform}
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
