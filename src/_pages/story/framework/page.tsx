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
import { ArrowDown } from "next-vibe/ui/components/icons/ArrowDown";
import { BookOpen } from "next-vibe/ui/components/icons/BookOpen";
import { Bot } from "next-vibe/ui/components/icons/Bot";
import { CheckCircle } from "next-vibe/ui/components/icons/CheckCircle";
import { Clock } from "next-vibe/ui/components/icons/Clock";
import { Code } from "next-vibe/ui/components/icons/Code";
import { Database } from "next-vibe/ui/components/icons/Database";
import { Github } from "next-vibe/ui/components/icons/Github";
import { Globe } from "next-vibe/ui/components/icons/Globe";
import { Key } from "next-vibe/ui/components/icons/Key";
import { Layers } from "next-vibe/ui/components/icons/Layers";
import { Mail } from "next-vibe/ui/components/icons/Mail";
import { Network } from "next-vibe/ui/components/icons/Network";
import { Plug } from "next-vibe/ui/components/icons/Plug";
import { Radio } from "next-vibe/ui/components/icons/Radio";
import { Server } from "next-vibe/ui/components/icons/Server";
import { ShoppingBag } from "next-vibe/ui/components/icons/ShoppingBag";
import { Smartphone } from "next-vibe/ui/components/icons/Smartphone";
import { Sparkles } from "next-vibe/ui/components/icons/Sparkles";
import { Terminal } from "next-vibe/ui/components/icons/Terminal";
import { Wallet } from "next-vibe/ui/components/icons/Wallet";
import { Span } from "next-vibe/ui/components/span";
import { H3, P } from "next-vibe/ui/components/typography";
import type { IconComponent } from "next-vibe/ui/lib/helper";
import type { JSX } from "react";

import { buildPublicApiBaseUrl } from "@/api-keys/coding-tools";
import { API_DOCS_PATH, API_KEYS_PAGE_PATH } from "@/api-keys/constants";
import { GITHUB_REPO_URL, PLATFORM_COUNT } from "@/env/constants";
import { configScopedTranslation } from "@/env/i18n";

import { CodeTabs } from "../../docs/api/_components/code-tabs";
import { buildDocsSnippets } from "../../docs/api/snippets";
import { ContactFormSection } from "../_components/contact-form-section";
import { NextVibeShowcase } from "../_components/nextvibe-showcase";
import {
  Callout,
  CardLink,
  Cta,
  CtaRow,
  FeatureGrid,
  PageHero,
  PageSection,
  StatGrid,
} from "../_shared/marketing";
import { Quickstart } from "../_shared/quickstart/quickstart";
import {
  CONTACT_DEFINITION,
  CONTACT_ROUTE,
  CONTACT_SOURCE_PATH,
  FEATURE_TREE,
  SURFACE_ADD,
  SURFACE_AI,
  SURFACE_CLI,
  SURFACE_CRON,
  SURFACE_MCP,
} from "../_shared/surface-snippets";
import { scopedTranslation } from "./i18n";

export const revalidate = 3600;

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface FrameworkPageData {
  locale: CountryLanguage;
  endpointCount: number;
  modelCount: number;
  apiBaseUrl: string;
  platform: Platform;
}

export async function tanstackLoader({
  params,
}: Props): Promise<FrameworkPageData> {
  const { locale } = await params;
  const { endpointsMeta } = await import("@/generated/endpoints/meta/en");
  return {
    locale,
    endpointCount: endpointsMeta.length,
    modelCount: getAvailableChatModelCount(false, await getEnvAvailability()),
    apiBaseUrl: buildPublicApiBaseUrl(HOSTED_API_ORIGIN, locale),
    platform: Platform.NEXT_PAGE,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { t } = scopedTranslation.scopedT(locale);
  return metadataGenerator(locale, {
    path: "story/framework",
    title: t("meta.title"),
    category: t("meta.category"),
    description: t("meta.description"),
    image: `${envClient.NEXT_PUBLIC_APP_URL}/images/home-hero.jpg`,
    imageAlt: t("meta.imageAlt"),
    keywords: [t("meta.keywords")],
  });
}

/** The hosted API lives on unbottled.ai, also when this page runs on a self-hosted copy. */
const HOSTED_API_ORIGIN = "https://unbottled.ai";

/** The 7 surfaces beyond the 6 walked through below (13 in total). */
const MORE_SURFACES = [
  "webApi",
  "websocket",
  "electron",
  "adminPanel",
  "vibeFrame",
  "remoteSkill",
  "vibeBoard",
] as const;

const SURFACES = [
  { key: "web", icon: Globe },
  { key: "cli", icon: Terminal },
  { key: "mcp", icon: Plug },
  { key: "ai", icon: Bot },
  { key: "native", icon: Smartphone },
  { key: "cron", icon: Clock },
] as const;

const TYPESCRIPT_RULES = [
  "any",
  "unknown",
  "asX",
  "throwStatements",
  "hardcodedStrings",
  "object",
] as const;

const UNDER_THE_HOOD = [
  { key: "platform", icon: Layers },
  { key: "data", icon: Database },
  { key: "realtime", icon: Radio },
  { key: "remote", icon: Network },
] as const;

/** Domains that ship in this repo, each built on the same pattern. */
const EXAMPLES = [
  { key: "aiPlatform", icon: Sparkles },
  { key: "commerce", icon: ShoppingBag },
  { key: "finance", icon: Wallet },
  { key: "crm", icon: Mail },
] as const;

const MATURITY = ["stable", "beta", "honest"] as const;

/** Compact card: icon inline with the title, so phones stay short. */
function InlineCard({
  icon: Icon,
  label,
  title,
  children,
}: {
  icon: IconComponent;
  label?: string;
  title: string;
  children: string;
}): JSX.Element {
  return (
    <Div className="flex h-full min-w-0 flex-col rounded-xl border border-border bg-card p-4 shadow-xs md:p-6">
      {label !== undefined && (
        <Span className="mb-1.5 hidden text-[11px] font-semibold sm:block uppercase tracking-[0.12em] text-muted-foreground">
          {label}
        </Span>
      )}
      <Div className="flex items-center gap-2.5">
        <Div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="size-4" />
        </Div>
        <H3 className="text-base font-semibold leading-snug tracking-tight md:text-lg">
          {title}
        </H3>
      </Div>
      <P className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {children}
      </P>
    </Div>
  );
}

export function TanstackPage({
  locale,
  endpointCount,
  modelCount,
  apiBaseUrl,
  platform,
}: FrameworkPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  const apiSnippets = buildDocsSnippets(apiBaseUrl);
  const codeLabels = {
    copyLabel: t("code.copy"),
    copiedLabel: t("code.copied"),
    wrapLabel: t("code.wrap"),
  };

  const publicUser: JWTPublicPayloadType = {
    isPublic: true,
    leadId: "00000000-0000-0000-0000-000000000000",
    roles: [UserPermissionRole.PUBLIC],
  };

  return (
    <Div className="min-h-screen bg-background">
      <PageHero
        eyebrow={t("hero.eyebrow")}
        eyebrowIcon={Code}
        title={
          <>
            {t("hero.title")}{" "}
            <Span className="text-primary">{t("hero.titleAccent")}</Span>
          </>
        }
        subtitle={t("hero.subtitle")}
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
      >
        <StatGrid
          items={[
            { value: `${endpointCount}+`, label: t("hero.stat1Label") },
            { value: PLATFORM_COUNT, label: t("hero.stat2Label") },
            { value: "4", label: t("hero.stat3Label") },
            { value: "1", label: t("hero.stat4Label") },
          ]}
        />
      </PageHero>

      {/* One real endpoint */}
      <PageSection
        id="example"
        label={t("example.eyebrow")}
        title={t("example.title")}
        intro={t("example.intro")}
      >
        <Div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-8">
          <Div className="min-w-0">
            <CodeTabs
              {...codeLabels}
              wrapByDefault={false}
              tabs={[
                {
                  label: "definition.ts",
                  language: "typescript",
                  code: CONTACT_DEFINITION,
                },
                {
                  label: "route.ts",
                  language: "typescript",
                  code: CONTACT_ROUTE,
                },
              ]}
            />
            <Div className="mt-2 flex flex-wrap gap-x-6">
              <CardLink
                href={`${GITHUB_REPO_URL}/tree/main/${CONTACT_SOURCE_PATH}`}
                label={t("example.source")}
                external
              />
              <CardLink href="#contact" label={t("example.live")} />
            </Div>
          </Div>
          <Div className="min-w-0 divide-y divide-border rounded-xl border border-border bg-card px-4 shadow-xs sm:px-5">
            <P className="py-4 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              {t("example.becomes")}
            </P>
            {SURFACES.map(({ key, icon: Icon }) => (
              <Div
                key={key}
                className="flex items-start gap-3 py-3.5 sm:gap-4 sm:py-4"
              >
                <Div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </Div>
                <Div className="min-w-0">
                  <H3 className="text-sm font-semibold tracking-tight">
                    {t(`example.surfaces.${key}.title`)}
                  </H3>
                  <P className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {t(`example.surfaces.${key}.body`)}
                  </P>
                </Div>
              </Div>
            ))}
            <Div className="py-4">
              <P className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                {t("example.more")}
              </P>
              <Div className="mt-2.5 flex flex-wrap gap-1.5">
                {MORE_SURFACES.map((key) => (
                  <Span
                    key={key}
                    className="rounded-md border border-border bg-muted/60 px-2 py-0.5 text-xs text-foreground/80"
                  >
                    {t(`example.moreSurfaces.${key}`)}
                  </Span>
                ))}
              </Div>
            </Div>
          </Div>
        </Div>

        <Div className="mt-10 md:mt-12">
          <H3 className="text-xl font-semibold tracking-tight">
            {t("example.callsTitle")}
          </H3>
          <P className="mt-2 mb-5 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            {t("example.callsBody")}
          </P>
          <CodeTabs
            {...codeLabels}
            wrapByDefault={false}
            tabs={[
              { label: t("code.cli"), language: "bash", code: SURFACE_CLI },
              {
                label: t("code.mcp"),
                language: "typescript",
                code: SURFACE_MCP,
              },
              { label: t("code.ai"), language: "typescript", code: SURFACE_AI },
              {
                label: t("code.cron"),
                language: "typescript",
                code: SURFACE_CRON,
              },
            ]}
          />
        </Div>
      </PageSection>

      {/* Quickstart */}
      <PageSection
        id="quickstart"
        tone="muted"
        label={t("quickstart.eyebrow")}
        title={t("quickstart.title")}
        intro={t("quickstart.intro")}
      >
        <Quickstart locale={locale} />
        <CtaRow className="mt-8">
          <Cta
            href={`/${locale}/story/self-host`}
            label={t("quickstart.selfHost")}
            icon={Server}
            variant="secondary"
          />
          <Cta
            href={`${GITHUB_REPO_URL}/blob/main/docs/README.md`}
            label={t("quickstart.docs")}
            icon={BookOpen}
            variant="secondary"
            external
          />
        </CtaRow>
      </PageSection>

      <NextVibeShowcase locale={locale} onStoryPage />

      {/* A feature is a folder */}
      <PageSection
        label={t("pattern.eyebrow")}
        title={t("pattern.title")}
        intro={t("pattern.subtitle")}
      >
        <Div className="grid items-start gap-6 lg:grid-cols-2 lg:gap-8">
          <CodeTabs
            {...codeLabels}
            wrapByDefault={false}
            tabs={[
              { label: "src/contact/", language: "text", code: FEATURE_TREE },
            ]}
          />
          <CodeTabs
            {...codeLabels}
            wrapByDefault={false}
            tabs={[
              {
                label: t("code.terminal"),
                language: "bash",
                code: SURFACE_ADD,
              },
            ]}
          />
        </Div>
        <Callout icon={Layers} className="mt-6 font-medium">
          {t("pattern.deleteLine")}
        </Callout>
      </PageSection>

      {/* Under the hood */}
      <PageSection
        tone="muted"
        label={t("hood.eyebrow")}
        title={t("hood.title")}
        intro={t("hood.intro")}
      >
        <FeatureGrid columns={2}>
          {UNDER_THE_HOOD.map(({ key, icon }) => (
            <InlineCard key={key} icon={icon} title={t(`hood.${key}.title`)}>
              {t(`hood.${key}.body`)}
            </InlineCard>
          ))}
        </FeatureGrid>

        <H3 className="mt-12 text-xl font-semibold tracking-tight md:mt-16">
          {t("typescript.title")}
        </H3>
        <P className="mt-2 mb-6 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          {t("typescript.subtitle")}
        </P>
        <Div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-3">
          {TYPESCRIPT_RULES.map((key) => (
            <Div
              key={key}
              className="min-w-0 rounded-xl border border-border bg-card p-3.5 shadow-xs md:p-5"
            >
              <Span className="inline-block rounded-md border border-destructive/25 bg-destructive/10 px-2 py-0.5 font-mono text-xs font-semibold text-destructive md:text-sm">
                {t(`typescript.patterns.${key}.name`)}
              </Span>
              <P className="mt-2 text-xs leading-relaxed text-muted-foreground md:mt-3 md:text-sm">
                {t(`typescript.patterns.${key}.description`)}
              </P>
            </Div>
          ))}
        </Div>
        <Callout icon={CheckCircle} tone="success" className="mt-6">
          {t("typescript.vibeCheck")}
        </Callout>
      </PageSection>

      {/* Hosted API */}
      <PageSection
        id="api"
        label={t("api.eyebrow")}
        title={t("api.title", { appName })}
        intro={t("api.intro", { appName })}
      >
        <Div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-8">
          <Div className="flex min-w-0 flex-col gap-4">
            <Div className="flex flex-col gap-2">
              {(
                [
                  ["POST", "/v1/chat/completions", "api.endpoints.chat"],
                  ["POST", "/v1/responses", "api.endpoints.responses"],
                  ["POST", "/v1/messages", "api.endpoints.messages"],
                  ["GET", "/v1/models", "api.endpoints.models"],
                ] as const
              ).map(([method, path, labelKey]) => (
                <Div
                  key={path}
                  className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-border bg-card px-3 py-2.5"
                >
                  <Span className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-primary">
                    {method}
                  </Span>
                  <Span className="font-mono text-sm text-foreground">
                    {path}
                  </Span>
                  <Span className="text-sm text-muted-foreground">
                    {t(labelKey)}
                  </Span>
                </Div>
              ))}
            </Div>
            <P className="text-sm leading-relaxed text-muted-foreground md:text-base">
              {t("api.access", { appName, modelCount })}
            </P>
            <CtaRow>
              <Cta
                href={`/${locale}/${API_DOCS_PATH}`}
                label={t("api.docs")}
                icon={BookOpen}
              />
              <Cta
                href={`/${locale}/${API_KEYS_PAGE_PATH}`}
                label={t("api.keys")}
                icon={Key}
                variant="secondary"
              />
            </CtaRow>
          </Div>
          <CodeTabs
            {...codeLabels}
            wrapByDefault={false}
            tabs={[
              { label: "Python", language: "python", code: apiSnippets.python },
              { label: "Node", language: "typescript", code: apiSnippets.node },
              {
                label: t("code.anthropic"),
                language: "bash",
                code: apiSnippets.messages,
              },
            ]}
          />
        </Div>
      </PageSection>

      {/* Built with next-vibe */}
      <PageSection
        tone="muted"
        label={t("examples.eyebrow")}
        title={t("examples.title")}
        intro={t("examples.subtitle", { appName })}
      >
        <FeatureGrid columns={4}>
          {EXAMPLES.map(({ key, icon }) => (
            <InlineCard
              key={key}
              icon={icon}
              label={t(`examples.items.${key}.label`)}
              title={t(`examples.items.${key}.title`, { appName })}
            >
              {t(`examples.items.${key}.body`, { appName, modelCount })}
            </InlineCard>
          ))}
        </FeatureGrid>
      </PageSection>

      {/* Maturity */}
      <PageSection label={t("maturity.eyebrow")} title={t("maturity.title")}>
        <Div className="grid gap-4 md:grid-cols-3 md:gap-6">
          {MATURITY.map((key) => (
            <Div
              key={key}
              className="rounded-xl border border-border bg-card p-5 shadow-xs"
            >
              <H3 className="text-base font-semibold tracking-tight">
                {t(`maturity.${key}.title`)}
              </H3>
              <P className="mt-1.5 text-sm leading-relaxed text-muted-foreground md:text-base">
                {t(`maturity.${key}.body`, { appName })}
              </P>
            </Div>
          ))}
        </Div>
      </PageSection>

      {/* Contact - this form is the endpoint from the top of the page */}
      <PageSection
        id="contact"
        tone="muted"
        label={t("contact.eyebrow")}
        title={t("contact.title")}
        intro={t("contact.description")}
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

export default async function FrameworkPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
