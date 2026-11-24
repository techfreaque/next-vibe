import type { Metadata } from "next";
import { getEnvAvailability } from "next-vibe/agent/env-availability";
import { getAvailableChatModelCount } from "next-vibe/agent/models/all-models";
import { coreClientEnv as envClient } from "next-vibe/core/env-client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { hreflangFor } from "next-vibe/core/i18n/core/seo-locales";
import { Platform } from "next-vibe/platforms/platforms";
import { Div } from "next-vibe/ui/components/div";
import { AlertTriangle } from "next-vibe/ui/components/icons/AlertTriangle";
import { ArrowRight } from "next-vibe/ui/components/icons/ArrowRight";
import { BookOpen } from "next-vibe/ui/components/icons/BookOpen";
import { Check } from "next-vibe/ui/components/icons/Check";
import { CreditCard } from "next-vibe/ui/components/icons/CreditCard";
import { Key } from "next-vibe/ui/components/icons/Key";
import { Wrench } from "next-vibe/ui/components/icons/Wrench";
import { X } from "next-vibe/ui/components/icons/X";
import { JsonLd } from "next-vibe/ui/components/json-ld";
import { ExternalLink, Link } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import { H1, H2, P } from "next-vibe/ui/components/typography";
import type { JSX } from "react";

import { API_UNLOCK_PATH, getApiAccessPrices } from "@/api-keys/access";
import {
  buildCodingToolSnippets,
  buildPublicApiBaseUrl,
  CODING_TOOL_EXAMPLE_MODELS,
  CODING_TOOL_IDS,
  CODING_TOOL_MODEL,
} from "@/api-keys/coding-tools";
import {
  API_KEY_DEFAULT_RATE_LIMIT_PER_MINUTE,
  API_KEY_MAX_ACTIVE,
  API_KEYS_PAGE_PATH,
} from "@/api-keys/constants";
import { scopedTranslation as apiKeysScopedTranslation } from "@/api-keys/i18n";
import { configScopedTranslation } from "@/env/i18n";
import {
  V1_MAX_AUDIO_BYTES,
  V1_MAX_IMAGES_PER_CALL,
  V1_MAX_OUTPUT_TOKENS,
  V1_MAX_SPEECH_CHARACTERS,
} from "@/v1/shared/constants";

import {
  buildBreadcrumbList,
  defaultImage,
  organizationNode,
  pageUrl,
  websiteId,
} from "../../_components/structured-data";
import {
  BreadcrumbTrail,
  buildBreadcrumbTrail,
} from "../../story/_shared/breadcrumbs";
import { Callout, Cta } from "../../story/_shared/marketing";
import { GuideCardGrid } from "../../story/blog/guide-links";
import type { BlogPostSlug } from "../../story/blog/posts-meta";
import { type CodeTab, CodeTabs, CopyButton } from "./_components/code-tabs";
import {
  autoCode,
  Bullets,
  DocSection,
  DocTable,
  Prose,
  renderRich,
  ResponseExample,
  SubBlock,
} from "./_components/doc-blocks";
import { DocsMobileToc, DocsToc, type TocGroup } from "./_components/docs-toc";
import { PanelTabs } from "./_components/panel-tabs";
import { scopedTranslation } from "./i18n";
import { buildDocsSnippets } from "./snippets";

export interface ApiDocsPageData {
  locale: CountryLanguage;
  modelCount: number;
  baseUrl: string;
  platform: Platform;
}

export async function tanstackLoader({
  params,
}: {
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<ApiDocsPageData> {
  const { locale } = await params;
  return {
    locale,
    modelCount: getAvailableChatModelCount(false, await getEnvAvailability()),
    baseUrl: buildPublicApiBaseUrl(envClient.NEXT_PUBLIC_APP_URL, locale),
    platform: Platform.NEXT_PAGE,
  };
}

export const revalidate = 3600;

/** Developer guides that go deeper than the reference. */
const API_GUIDES: readonly BlogPostSlug[] = [
  "openai-anthropic-compatible-api",
  "uncensored-llm-api",
  "unbottled-api-in-coding-tools",
  "openrouter-alternatives",
];

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  const modelCount = getAvailableChatModelCount(
    false,
    await getEnvAvailability(),
  );
  return metadataGenerator(locale, {
    path: "docs/api",
    title: t("meta.title", { appName }),
    category: t("meta.category"),
    description: t("meta.description", { appName, modelCount }),
    image: `${envClient.NEXT_PUBLIC_APP_URL}/images/home-hero.jpg`,
    imageAlt: t("meta.imageAlt", { appName }),
    keywords: [t("meta.keywords", { appName })],
  });
}

const PARAM_KEYS = [
  ["model", "model"],
  ["messages", "messages"],
  ["stream", "stream"],
  ["stream_options", "streamOptions"],
  ["max_tokens", "maxTokens"],
  ["temperature", "temperature"],
  ["top_p", "topP"],
  ["stop", "stop"],
  ["n", "n"],
  ["tools", "tools"],
  ["tool_choice", "toolChoice"],
] as const;

const ERROR_ROWS = [
  [401, "missing_api_key", "missingKey"],
  [401, "invalid_api_key", "invalidKey"],
  [402, "paid_plan_required", "paid"],
  [402, "insufficient_credits", "credits"],
  [402, "free_tier_cap_reached", "cap"],
  [404, "model_not_found", "notFound"],
  [
    400,
    "invalid_value / unsupported_parameter / tools_not_supported",
    "invalid",
  ],
  [400, "content_policy_violation", "contentPolicy"],
  [403, "uncensored_consent_required", "consent"],
  [429, "rate_limit_exceeded", "rate"],
  [502, "upstream_error", "upstream"],
  [503, "balance_unavailable", "balance"],
] as const;

const IMAGE_PARAMS = [
  ["model", "string", "model"],
  ["prompt", "string", "prompt"],
  ["n", "integer", "n"],
  ["size", "string", "size"],
  ["aspect_ratio", "string", "aspectRatio"],
  ["quality", "string", "quality"],
  ["response_format", "string", "responseFormat"],
] as const;

const BYTES_PER_MB = 1024 * 1024;

const curl = (code: string): CodeTab => ({
  label: "curl",
  language: "bash",
  code,
});
const python = (code: string): CodeTab => ({
  label: "Python",
  language: "python",
  code,
});
const node = (code: string): CodeTab => ({
  label: "JavaScript",
  language: "javascript",
  code,
});
const json = (label: string, code: string): CodeTab => ({
  label,
  language: "json",
  code,
});
const text = (label: string, code: string): CodeTab => ({
  label,
  language: "text",
  code,
});

/** Numbered quickstart step with a vertical rail. */
function QuickStep({
  n,
  title,
  description,
  last = false,
  children,
}: {
  n: number;
  title: string;
  description: string;
  last?: boolean;
  children: JSX.Element;
}): JSX.Element {
  return (
    <Div className="relative flex gap-4 sm:gap-5">
      <Div className="flex flex-col items-center">
        <Span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-sm">
          {n}
        </Span>
        {!last && <Span className="mt-2 w-px flex-1 bg-border" />}
      </Div>
      <Div
        className={`flex min-w-0 flex-1 flex-col gap-3 ${last ? "" : "pb-10"}`}
      >
        <Div className="flex flex-col gap-1 pt-1">
          <Span className="text-base font-semibold text-foreground">
            {title}
          </Span>
          <P className="m-0 text-[15px] leading-relaxed text-muted-foreground">
            {renderRich(description)}
          </P>
        </Div>
        {children}
      </Div>
    </Div>
  );
}

/** Label + monospace value + copy action, for base URLs. */
function UrlRow({
  label,
  value,
  note,
  copyLabel,
  copiedLabel,
  small = false,
}: {
  label: string;
  value: string;
  note?: string;
  copyLabel: string;
  copiedLabel: string;
  wrapLabel?: string;
  /** Smaller type, for the narrow hero card. */
  small?: boolean;
}): JSX.Element {
  return (
    <Div className="flex min-w-0 flex-col gap-1.5">
      <Span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </Span>
      <Div className="relative min-w-0 rounded-lg border border-border bg-card py-1 pl-3">
        <Span
          className={`block min-w-0 py-1.5 pr-12 font-mono text-foreground sm:pr-24 ${small ? "text-[12px]" : "text-[13px]"}`}
        >
          {/* Each "segment/" is an inline-block: lines break only between
              path segments, and copied text has no invisible characters */}
          {value.split(/(?<=\/)/).map((segment, index) => (
            <Span
              key={`${index}-${segment}`}
              className="inline-block whitespace-nowrap"
            >
              {segment}
            </Span>
          ))}
        </Span>
        <CopyButton
          text={value}
          copyLabel={copyLabel}
          copiedLabel={copiedLabel}
          tone="light"
          compact
          className="absolute top-1 right-1"
        />
      </Div>
      {note !== undefined && (
        <P className="m-0 text-xs leading-relaxed text-muted-foreground">
          {renderRich(note)}
        </P>
      )}
    </Div>
  );
}

export function TanstackPage({
  locale,
  modelCount,
  baseUrl,
}: ApiDocsPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  const crumbs = [{ name: t("hero.badge"), path: "/docs/api" }];
  const { t: toolT } = apiKeysScopedTranslation.scopedT(locale);
  const snippets = buildDocsSnippets(baseUrl);
  const toolSnippets = buildCodingToolSnippets({ baseUrl });
  const prices = getApiAccessPrices(locale);
  const rate = API_KEY_DEFAULT_RATE_LIMIT_PER_MINUTE;
  const keysHref = `/${locale}/${API_KEYS_PAGE_PATH}`;
  const unlockHref = `/${locale}/${API_UNLOCK_PATH}`;
  const copy = {
    copyLabel: t("code.copy"),
    copiedLabel: t("code.copied"),
    wrapLabel: t("code.wrap"),
  };

  const groups: TocGroup[] = [
    {
      label: t("toc.groups.start"),
      items: [
        { id: "quickstart", label: t("nav.quickstart") },
        { id: "access", label: t("nav.access") },
        { id: "auth", label: t("nav.auth") },
      ],
    },
    {
      label: t("toc.groups.chat"),
      items: [
        { id: "chat", label: t("nav.chat") },
        { id: "tools", label: t("nav.tools") },
        { id: "responses", label: t("nav.responses") },
        { id: "messages", label: t("nav.messages") },
      ],
    },
    {
      label: t("toc.groups.media"),
      items: [
        { id: "images", label: t("nav.images") },
        { id: "speech", label: t("nav.speech") },
        { id: "transcriptions", label: t("nav.transcriptions") },
        { id: "videos", label: t("nav.videos") },
        { id: "music", label: t("nav.music") },
        { id: "media-files", label: t("nav.mediaFiles") },
      ],
    },
    {
      label: t("toc.groups.reference"),
      items: [
        { id: "models", label: t("nav.models") },
        { id: "billing", label: t("nav.billing") },
        { id: "errors", label: t("nav.errors") },
      ],
    },
    {
      label: t("toc.groups.integrations"),
      items: [
        { id: "coding-tools", label: t("nav.codingTools") },
        { id: "sdks", label: t("nav.sdks") },
        { id: "guides", label: t("nav.guides") },
      ],
    },
  ];
  const group = (index: number): string => groups[index]?.label ?? "";

  return (
    <Div className="min-h-screen bg-background">
      <JsonLd
        id="api-docs-structured-data"
        data={{
          "@context": "https://schema.org",
          "@graph": [
            buildBreadcrumbList(locale, crumbs),
            {
              "@type": "TechArticle",
              "@id": `${pageUrl(locale, "/docs/api")}#article`,
              headline: `${t("hero.title")} ${t("hero.titleHighlight")}`,
              description: t("meta.description", { appName, modelCount }),
              url: pageUrl(locale, "/docs/api"),
              mainEntityOfPage: pageUrl(locale, "/docs/api"),
              inLanguage: hreflangFor(locale),
              image: defaultImage(locale),
              author: organizationNode(locale),
              publisher: organizationNode(locale),
              isPartOf: { "@id": websiteId(locale) },
            },
          ],
        }}
      />
      {/* ── Header ─────────────────────────────────────────────── */}
      <Div className="border-b border-border bg-gradient-to-b from-primary/[0.06] to-transparent">
        <Div className="mx-auto w-full max-w-6xl px-4 pt-10 pb-10 sm:px-6 md:pt-14 md:pb-12 lg:grid lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-center lg:gap-12">
          <Div className="min-w-0">
            <BreadcrumbTrail
              className="mb-4"
              items={buildBreadcrumbTrail(locale, crumbs)}
            />
            <Span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-xs">
              <BookOpen className="h-3.5 w-3.5 text-primary" />
              {t("hero.badge")}
            </Span>
            <H1 className="mt-5 mb-0 max-w-3xl text-4xl font-semibold tracking-tight text-balance text-foreground md:text-5xl">
              {t("hero.title")}{" "}
              <Span className="text-primary">{t("hero.titleHighlight")}</Span>
            </H1>
            <P className="mt-4 mb-0 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {t("hero.subtitle", { appName })}
            </P>
            <Div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Cta href={keysHref} label={t("hero.ctaKey")} icon={Key} />
              <Cta
                href={unlockHref}
                label={t("hero.ctaPricing")}
                icon={CreditCard}
                variant="secondary"
                arrow={false}
              />
            </Div>
            <Div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {[
                t("hero.facts.models", { modelCount }),
                t("hero.facts.formats"),
                t("hero.facts.streaming"),
                t("hero.facts.rate", { rate }),
              ].map((fact) => (
                <Span key={fact} className="inline-flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  {fact}
                </Span>
              ))}
            </Div>
          </Div>
          <Div className="mt-10 hidden flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm lg:mt-0 lg:flex">
            <UrlRow
              label={t("quickstart.baseUrlLabel")}
              value={toolSnippets.baseUrl}
              small
              {...copy}
            />
            <UrlRow
              label={t("quickstart.anthropicBaseUrlLabel")}
              value={toolSnippets.anthropicBaseUrl}
              small
              {...copy}
            />
            <ExternalLink
              href="#quickstart"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              {t("hero.quickstartLink")}
              <ArrowRight className="h-4 w-4" />
            </ExternalLink>
          </Div>
        </Div>
      </Div>

      {/* ── Body: TOC + content ────────────────────────────────── */}
      <Div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:grid lg:grid-cols-[13.5rem_minmax(0,1fr)] lg:gap-12">
        <Div className="hidden lg:block">
          <Div className="sticky top-16 max-h-[calc(100vh-4rem)] overflow-y-auto py-8 pr-2 [scrollbar-width:none]">
            <DocsToc groups={groups} title={t("toc.title")} />
          </Div>
        </Div>

        <Div className="min-w-0">
          <DocsMobileToc groups={groups} title={t("toc.mobileTitle")} />

          <Div className="pt-8 lg:pt-10">
            {/* ── Quickstart ── */}
            <DocSection
              id="quickstart"
              group={group(0)}
              title={t("quickstart.title")}
              intro={t("quickstart.intro")}
            >
              <Div className="flex flex-col">
                <QuickStep
                  n={1}
                  title={t("quickstart.step1.title")}
                  description={t("quickstart.step1.description")}
                >
                  <Div>
                    <Link
                      href={keysHref}
                      className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                    >
                      <Key className="h-4 w-4" />
                      {t("quickstart.step1.cta")}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Div>
                </QuickStep>
                <QuickStep
                  n={2}
                  title={t("quickstart.step2.title")}
                  description={t("quickstart.step2.description")}
                >
                  <Div className="flex min-w-0 flex-col gap-4">
                    <Div className="grid min-w-0 gap-4 xl:grid-cols-2">
                      <UrlRow
                        label={t("quickstart.baseUrlLabel")}
                        value={toolSnippets.baseUrl}
                        note={t("quickstart.baseUrlNote")}
                        {...copy}
                      />
                      <UrlRow
                        label={t("quickstart.anthropicBaseUrlLabel")}
                        value={toolSnippets.anthropicBaseUrl}
                        note={t("quickstart.anthropicBaseUrlNote")}
                        {...copy}
                      />
                    </Div>
                    <CodeTabs
                      title={t("quickstart.envLabel")}
                      tabs={[
                        {
                          label: "shell",
                          language: "bash",
                          code: snippets.envSetup,
                        },
                      ]}
                      {...copy}
                    />
                  </Div>
                </QuickStep>
                <QuickStep
                  n={3}
                  title={t("quickstart.step3.title")}
                  description={t("quickstart.step3.description")}
                  last
                >
                  <Div className="flex min-w-0 flex-col gap-3">
                    <CodeTabs
                      tabs={[
                        curl(snippets.chat),
                        python(snippets.python),
                        node(snippets.node),
                      ]}
                      {...copy}
                    />
                    <ResponseExample
                      summary={t("code.showResponse")}
                      title="200"
                      tabs={[json("json", snippets.chatResponse)]}
                      {...copy}
                    />
                  </Div>
                </QuickStep>
              </Div>
            </DocSection>

            {/* ── Access and pricing ── */}
            <DocSection
              id="access"
              title={t("access.title")}
              intro={t("access.intro")}
            >
              <Div className="min-w-0 overflow-hidden rounded-xl border border-border bg-card">
                <Div className="grid gap-6 p-5 md:grid-cols-[minmax(0,1fr)_minmax(0,16rem)] md:p-6">
                  <Div className="flex flex-col gap-3">
                    <Span className="text-sm font-semibold text-foreground">
                      {t("access.unlockTitle")}
                    </Span>
                    {[
                      t("access.plan", { subPrice: prices.subPrice }),
                      t("access.grant"),
                    ].map((line) => (
                      <Div key={line} className="flex gap-2.5">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                        <Span className="text-sm leading-relaxed text-foreground/90">
                          {renderRich(line)}
                        </Span>
                      </Div>
                    ))}
                    <Div className="flex gap-2.5">
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      <Span className="text-sm leading-relaxed text-muted-foreground">
                        {renderRich(t("access.never"))}
                      </Span>
                    </Div>
                    <P className="m-0 mt-1 text-sm leading-relaxed text-muted-foreground">
                      {renderRich(
                        t("access.topup", { packPrice: prices.packPrice }),
                      )}
                    </P>
                  </Div>
                  <Div className="flex flex-col gap-2 self-start rounded-lg border border-warning/30 bg-warning/10 p-4">
                    <Span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                      <AlertTriangle className="h-4 w-4 text-warning" />
                      {t("access.withoutTitle")}
                    </Span>
                    <P className="m-0 text-sm leading-relaxed text-muted-foreground">
                      {renderRich(t("access.locked"))}
                    </P>
                  </Div>
                </Div>
                <Div className="flex flex-wrap gap-2 border-t border-border bg-muted/40 px-5 py-4 md:px-6">
                  <Link
                    href={unlockHref}
                    className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    <CreditCard className="h-4 w-4" />
                    {t("access.ctaUnlock")}
                  </Link>
                  <Link
                    href={keysHref}
                    className="inline-flex h-10 items-center gap-2 rounded-md border border-input bg-background px-4 text-sm font-medium text-foreground hover:bg-accent"
                  >
                    <Key className="h-4 w-4" />
                    {t("access.ctaKeys")}
                  </Link>
                </Div>
              </Div>
            </DocSection>

            {/* ── Authentication ── */}
            <DocSection
              id="auth"
              title={t("auth.title")}
              intro={t("auth.intro")}
            >
              <CodeTabs
                tabs={[
                  {
                    label: t("auth.headerTab"),
                    language: "http",
                    code: t("auth.header"),
                  },
                  {
                    label: t("auth.headerAnthropicTab"),
                    language: "http",
                    code: t("auth.headerAnthropic"),
                  },
                ]}
                {...copy}
              />
              <Bullets
                items={[
                  t("auth.points.hash"),
                  t("auth.points.scope"),
                  t("auth.points.limit", { maxKeys: API_KEY_MAX_ACTIVE }),
                  t("auth.points.missing"),
                ]}
              />
            </DocSection>

            {/* ── Chat completions ── */}
            <DocSection
              id="chat"
              group={group(1)}
              title={t("chat.title")}
              endpoints={[{ method: "POST", path: "/v1/chat/completions" }]}
              intro={t("chat.intro")}
            >
              <SubBlock
                title={t("chat.nonStream.title")}
                body={t("chat.nonStream.body")}
              >
                <CodeTabs
                  title={t("code.request")}
                  tabs={[
                    curl(snippets.chat),
                    python(snippets.python),
                    node(snippets.node),
                  ]}
                  {...copy}
                />
                <ResponseExample
                  summary={t("code.showResponse")}
                  title="200"
                  tabs={[json("json", snippets.chatResponse)]}
                  {...copy}
                />
              </SubBlock>
              <SubBlock
                title={t("chat.stream.title")}
                body={t("chat.stream.body")}
              >
                <CodeTabs
                  title={t("code.request")}
                  tabs={[
                    curl(snippets.stream),
                    python(snippets.pythonStream),
                    node(snippets.nodeStream),
                  ]}
                  {...copy}
                />
                <ResponseExample
                  summary={t("code.showStream")}
                  title="200"
                  tabs={[text("text/event-stream", snippets.streamResponse)]}
                  {...copy}
                />
              </SubBlock>
              <SubBlock title={t("chat.paramsTitle")}>
                <DocTable
                  head={[
                    t("chat.paramsColumns.field"),
                    t("chat.paramsColumns.description"),
                  ]}
                  rows={PARAM_KEYS.map(([field, key]) => ({
                    key: field,
                    term: field,
                    text: t(`chat.params.${key}`, {
                      maxTokens: V1_MAX_OUTPUT_TOKENS,
                    }),
                  }))}
                />
              </SubBlock>
            </DocSection>

            {/* ── Tool calling ── */}
            <DocSection
              id="tools"
              title={t("tools.title")}
              intro={t("tools.intro")}
            >
              <SubBlock title={t("tools.flow.title")}>
                <Bullets
                  items={[
                    t("tools.flow.step1"),
                    t("tools.flow.step2"),
                    t("tools.flow.step3"),
                    t("tools.flow.step4"),
                  ]}
                />
              </SubBlock>
              <SubBlock title={t("tools.requestTitle")}>
                <CodeTabs
                  title={t("code.request")}
                  tabs={[
                    curl(snippets.toolsCurl),
                    python(snippets.toolsPython),
                  ]}
                  {...copy}
                />
              </SubBlock>
              <SubBlock title={t("tools.responseTitle")}>
                <CodeTabs
                  title="200"
                  tabs={[json("json", snippets.toolsResponse)]}
                  {...copy}
                />
              </SubBlock>
              <SubBlock title={t("tools.followUpTitle")}>
                <CodeTabs
                  title={t("code.request")}
                  tabs={[curl(snippets.toolsFollowUp)]}
                  {...copy}
                />
              </SubBlock>
              <SubBlock
                title={t("tools.streamingTitle")}
                body={t("tools.streamingBody")}
              />
              <Callout icon={Wrench} tone="neutral">
                <Span className="font-semibold">{t("tools.rules.title")}</Span>
                <Div className="mt-3">
                  <Bullets
                    items={[
                      t("tools.rules.support"),
                      t("tools.rules.choice"),
                      t("tools.rules.names"),
                      t("tools.rules.billing"),
                    ]}
                  />
                </Div>
              </Callout>
            </DocSection>

            {/* ── Responses API ── */}
            <DocSection
              id="responses"
              title={t("responses.title")}
              endpoints={[{ method: "POST", path: "/v1/responses" }]}
              intro={t("responses.intro")}
            >
              <SubBlock
                title={t("responses.request.title")}
                body={t("responses.request.body")}
              >
                <CodeTabs
                  title={t("code.request")}
                  tabs={[
                    curl(snippets.responses),
                    python(snippets.responsesPython),
                    node(snippets.responsesNode),
                  ]}
                  {...copy}
                />
                <ResponseExample
                  summary={t("code.showResponse")}
                  title="200"
                  tabs={[json("json", snippets.responsesResponse)]}
                  {...copy}
                />
              </SubBlock>
              <SubBlock
                title={t("responses.stream.title")}
                body={t("responses.stream.body")}
              >
                <ResponseExample
                  summary={t("code.showStream")}
                  title="200"
                  tabs={[text("text/event-stream", snippets.responsesStream)]}
                  {...copy}
                />
              </SubBlock>
              <Bullets
                items={[
                  t("responses.points.tools"),
                  t("responses.points.reasoning"),
                  t("responses.points.billing"),
                ]}
              />
            </DocSection>

            {/* ── Messages API ── */}
            <DocSection
              id="messages"
              title={t("messages.title")}
              endpoints={[
                { method: "POST", path: "/v1/messages" },
                { method: "POST", path: "/v1/messages/count_tokens" },
              ]}
              intro={t("messages.intro")}
            >
              <SubBlock
                title={t("messages.request.title")}
                body={t("messages.request.body")}
              >
                <CodeTabs
                  title={t("code.request")}
                  tabs={[
                    curl(snippets.messages),
                    python(snippets.messagesPython),
                    node(snippets.messagesNode),
                  ]}
                  {...copy}
                />
                <ResponseExample
                  summary={t("code.showResponse")}
                  title="200"
                  tabs={[json("json", snippets.messagesResponse)]}
                  {...copy}
                />
              </SubBlock>
              <SubBlock
                title={t("messages.stream.title")}
                body={t("messages.stream.body")}
              >
                <ResponseExample
                  summary={t("code.showStream")}
                  title="200"
                  tabs={[text("text/event-stream", snippets.messagesStream)]}
                  {...copy}
                />
              </SubBlock>
              <SubBlock
                title={t("messages.countTokens.title")}
                body={t("messages.countTokens.body")}
              >
                <CodeTabs
                  title={t("code.request")}
                  tabs={[curl(snippets.countTokens)]}
                  {...copy}
                />
                <ResponseExample
                  summary={t("code.showResponse")}
                  title="200"
                  tabs={[json("json", snippets.countTokensResponse)]}
                  {...copy}
                />
              </SubBlock>
              <Bullets
                items={[
                  t("messages.points.auth"),
                  t("messages.points.models"),
                  t("messages.points.tools"),
                  t("messages.points.billing"),
                ]}
              />
            </DocSection>

            {/* ── Images ── */}
            <DocSection
              id="images"
              group={group(2)}
              title={t("images.title")}
              endpoints={[
                { method: "POST", path: "/v1/images/generations" },
                { method: "POST", path: "/v1/images/edits" },
              ]}
              intro={t("images.intro")}
            >
              <SubBlock
                title={t("images.generate.title")}
                body={t("images.generate.body")}
              >
                <DocTable
                  head={[
                    t("chat.paramsColumns.field"),
                    t("chat.paramsColumns.description"),
                  ]}
                  rows={IMAGE_PARAMS.map(([field, type, key]) => ({
                    key: field,
                    term: field,
                    type,
                    text: t(`images.params.${key}`, {
                      maxImages: V1_MAX_IMAGES_PER_CALL,
                    }),
                  }))}
                />
                <CodeTabs
                  title={t("code.request")}
                  tabs={[
                    curl(snippets.images),
                    python(snippets.imagesPython),
                    node(snippets.imagesNode),
                  ]}
                  {...copy}
                />
                <ResponseExample
                  summary={t("code.showResponse")}
                  title="200"
                  tabs={[json("json", snippets.imagesResponse)]}
                  {...copy}
                />
              </SubBlock>
              <SubBlock
                title={t("images.edit.title")}
                body={t("images.edit.body")}
              >
                <CodeTabs
                  title={t("code.request")}
                  tabs={[curl(snippets.imagesEdit)]}
                  {...copy}
                />
              </SubBlock>
              <Bullets
                items={[
                  t("images.points.size"),
                  t("images.points.format"),
                  t("images.points.billing"),
                ]}
              />
            </DocSection>

            {/* ── Speech ── */}
            <DocSection
              id="speech"
              title={t("speech.title")}
              endpoints={[{ method: "POST", path: "/v1/audio/speech" }]}
              intro={t("speech.intro")}
            >
              <CodeTabs
                title={t("code.request")}
                tabs={[
                  curl(snippets.speech),
                  python(snippets.speechPython),
                  node(snippets.speechNode),
                ]}
                {...copy}
              />
              <Bullets
                items={[
                  t("speech.points.voices", {
                    maxChars: V1_MAX_SPEECH_CHARACTERS,
                  }),
                  t("speech.points.formats"),
                  t("speech.points.billing"),
                ]}
              />
            </DocSection>

            {/* ── Transcription ── */}
            <DocSection
              id="transcriptions"
              title={t("transcriptions.title")}
              endpoints={[
                { method: "POST", path: "/v1/audio/transcriptions" },
                { method: "POST", path: "/v1/audio/translations" },
              ]}
              intro={t("transcriptions.intro")}
            >
              <SubBlock
                title={t("transcriptions.transcribe.title")}
                body={t("transcriptions.transcribe.body", {
                  maxMb: V1_MAX_AUDIO_BYTES / BYTES_PER_MB,
                })}
              >
                <CodeTabs
                  title={t("code.request")}
                  tabs={[
                    curl(snippets.transcription),
                    python(snippets.transcriptionPython),
                    node(snippets.transcriptionNode),
                  ]}
                  {...copy}
                />
                <ResponseExample
                  summary={t("code.showResponse")}
                  title="200"
                  tabs={[json("json", snippets.transcriptionResponse)]}
                  {...copy}
                />
              </SubBlock>
              <SubBlock
                title={t("transcriptions.translate.title")}
                body={t("transcriptions.translate.body")}
              >
                <CodeTabs
                  title={t("code.request")}
                  tabs={[curl(snippets.translation)]}
                  {...copy}
                />
              </SubBlock>
              <Bullets items={[t("transcriptions.points.billing")]} />
            </DocSection>

            {/* ── Video ── */}
            <DocSection
              id="videos"
              title={t("videos.title")}
              endpoints={[
                { method: "POST", path: "/v1/videos" },
                { method: "GET", path: "/v1/videos/{id}" },
                { method: "GET", path: "/v1/videos/{id}/content" },
              ]}
              intro={t("videos.intro")}
            >
              <SubBlock
                title={t("videos.create.title")}
                body={t("videos.create.body")}
              >
                <CodeTabs
                  title={t("code.request")}
                  tabs={[curl(snippets.videoCreate)]}
                  {...copy}
                />
                <ResponseExample
                  summary={t("code.showObject")}
                  title="200"
                  tabs={[json("json", snippets.videoObject)]}
                  {...copy}
                />
              </SubBlock>
              <SubBlock
                title={t("videos.poll.title")}
                body={t("videos.poll.body")}
              >
                <CodeTabs
                  title={t("code.request")}
                  tabs={[curl(snippets.videoPoll)]}
                  {...copy}
                />
              </SubBlock>
              <Bullets
                items={[
                  t("videos.points.image"),
                  t("videos.points.billing"),
                  t("videos.points.failed"),
                ]}
              />
            </DocSection>

            {/* ── Music ── */}
            <DocSection
              id="music"
              title={t("music.title")}
              endpoints={[
                { method: "POST", path: "/v1/music" },
                { method: "GET", path: "/v1/music/{id}" },
                { method: "GET", path: "/v1/music/{id}/content" },
              ]}
              intro={t("music.intro")}
            >
              <SubBlock title={t("music.startTitle")}>
                <CodeTabs
                  title={t("code.request")}
                  tabs={[curl(snippets.musicCreate)]}
                  {...copy}
                />
              </SubBlock>
              <SubBlock title={t("music.pollTitle")}>
                <CodeTabs
                  title={t("code.request")}
                  tabs={[curl(snippets.musicPoll)]}
                  {...copy}
                />
              </SubBlock>
              <Bullets
                items={[t("music.points.seconds"), t("music.points.billing")]}
              />
            </DocSection>

            {/* ── Media files ── */}
            <DocSection
              id="media-files"
              title={t("mediaFiles.title")}
              endpoints={[{ method: "GET", path: "/v1/media/{folder}/{file}" }]}
              intro={t("mediaFiles.intro")}
            >
              <CodeTabs
                title={t("code.request")}
                tabs={[curl(snippets.mediaFile)]}
                {...copy}
              />
            </DocSection>

            {/* ── Models ── */}
            <DocSection
              id="models"
              group={group(3)}
              title={t("models.title")}
              endpoints={[{ method: "GET", path: "/v1/models" }]}
              intro={t("models.intro")}
            >
              <CodeTabs
                title={t("code.request")}
                tabs={[curl(snippets.models)]}
                {...copy}
              />
              <ResponseExample
                summary={t("code.showResponse")}
                title="200"
                tabs={[json("json", snippets.modelsResponse)]}
                {...copy}
              />
              <Prose>{t("models.note")}</Prose>
              <SubBlock
                title={t("models.rates.title")}
                body={t("models.rates.unit")}
              >
                <DocTable
                  head={[
                    t("chat.paramsColumns.field"),
                    t("chat.paramsColumns.description"),
                  ]}
                  rows={[
                    ["input", t("models.rates.input")],
                    ["output", t("models.rates.output")],
                    ["cache_read", t("models.rates.read")],
                    ["cache_write", t("models.rates.write")],
                    ["cache_write_1h", t("models.rates.hour")],
                  ].map(([field, description]) => ({
                    key: field,
                    term: `${field}_credits_per_million_tokens`,
                    text: description,
                  }))}
                />
                <Prose>{t("models.rates.tiers")}</Prose>
              </SubBlock>
              <SubBlock
                title={t("models.media.title")}
                body={t("models.media.body")}
              >
                <CodeTabs
                  title={t("models.media.filename")}
                  tabs={[json("json", snippets.mediaModelsResponse)]}
                  {...copy}
                />
                <Bullets
                  items={[
                    t("models.media.points.modality"),
                    t("models.media.points.pricing"),
                    t("models.media.points.anthropic"),
                  ]}
                />
              </SubBlock>
              <Link
                href={`/${locale}/models`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                {t("models.browse")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </DocSection>

            {/* ── Billing ── */}
            <DocSection
              id="billing"
              title={t("billing.title")}
              intro={t("billing.intro")}
            >
              <Bullets
                items={[
                  t("billing.points.price"),
                  t("billing.points.usage"),
                  t("billing.points.preflight"),
                  t("billing.points.real"),
                  t("billing.points.media"),
                  t("billing.points.topup"),
                ]}
              />
              <CodeTabs
                title="402"
                tabs={[text("http", snippets.errorCredits)]}
                {...copy}
              />
            </DocSection>

            {/* ── Errors and rate limits ── */}
            <DocSection
              id="errors"
              title={t("errors.title")}
              intro={t("errors.intro")}
            >
              <SubBlock title={t("errors.shapeTitle")}>
                <CodeTabs
                  tabs={[
                    json(t("errors.shapeOpenAi"), snippets.errorShape),
                    json(
                      t("errors.shapeAnthropic"),
                      snippets.errorShapeAnthropic,
                    ),
                  ]}
                  {...copy}
                />
              </SubBlock>
              <SubBlock title={t("errors.codesTitle")}>
                <DocTable
                  head={[
                    `${t("errors.columns.status")} / ${t("errors.columns.code")}`,
                    t("errors.columns.meaning"),
                  ]}
                  rows={ERROR_ROWS.map(([status, code, key]) => ({
                    key: code,
                    term: code,
                    status,
                    text: t(`errors.rows.${key}`, { rate }),
                  }))}
                />
                <Callout icon={AlertTriangle} tone="neutral">
                  {renderRich(t("errors.streamNote"))}
                </Callout>
              </SubBlock>
              <SubBlock
                id="limits"
                title={t("limits.title")}
                body={t("limits.body", { rate })}
              >
                <CodeTabs
                  title="429"
                  tabs={[text("http", snippets.rateHeaders)]}
                  {...copy}
                />
              </SubBlock>
            </DocSection>

            {/* ── Coding tools ── */}
            <DocSection
              id="coding-tools"
              group={group(4)}
              title={t("codingTools.title")}
              intro={t("codingTools.intro")}
            >
              <PanelTabs
                labels={CODING_TOOL_IDS.map(
                  (id) => toolSnippets.tools[id].name,
                )}
                panels={CODING_TOOL_IDS.map((id) => {
                  const tool = toolSnippets.tools[id];
                  return (
                    <Div key={id} className="flex min-w-0 flex-col gap-4">
                      <Prose>
                        {autoCode(toolT(`codingTools.tools.${id}.hint`))}
                      </Prose>
                      {tool.blocks.map((block) => (
                        <CodeTabs
                          key={`${id}-${block.kind}`}
                          title={toolT(`codingTools.blocks.${block.kind}`)}
                          tabs={[
                            {
                              label: block.filename,
                              language: block.language,
                              code: block.code,
                            },
                          ]}
                          {...copy}
                        />
                      ))}
                      {tool.tested ? (
                        <Span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Check className="h-3.5 w-3.5 text-success" />
                          {toolT("codingTools.tested", {
                            name: tool.name,
                            version: tool.tested.version,
                          })}
                        </Span>
                      ) : undefined}
                    </Div>
                  );
                })}
              />
              <Callout icon={Key} tone="primary">
                <Span className="font-semibold">
                  {toolT("codingTools.anyModel", {
                    model: CODING_TOOL_MODEL,
                    examples: CODING_TOOL_EXAMPLE_MODELS.join(", "),
                  })}
                </Span>{" "}
                {t("codingTools.keyPage")}
              </Callout>
              <Div className="flex flex-col gap-3 sm:flex-row">
                <Cta
                  href={keysHref}
                  label={t("codingTools.keyPageCta")}
                  icon={Key}
                />
                <Cta
                  href={`/${locale}/story/blog/unbottled-api-in-coding-tools`}
                  label={t("codingTools.guide")}
                  icon={BookOpen}
                  variant="secondary"
                />
              </Div>
            </DocSection>

            {/* ── SDK examples ── */}
            <DocSection
              id="sdks"
              title={t("sdks.title")}
              intro={t("sdks.intro")}
            >
              <SubBlock title={t("sdks.chat")}>
                <CodeTabs
                  tabs={[python(snippets.python), node(snippets.node)]}
                  {...copy}
                />
              </SubBlock>
              <SubBlock title={t("sdks.stream")}>
                <CodeTabs
                  tabs={[
                    python(snippets.pythonStream),
                    node(snippets.nodeStream),
                  ]}
                  {...copy}
                />
              </SubBlock>
              <SubBlock title={t("sdks.responses")}>
                <CodeTabs
                  tabs={[
                    python(snippets.responsesPython),
                    node(snippets.responsesNode),
                  ]}
                  {...copy}
                />
              </SubBlock>
              <SubBlock title={t("sdks.anthropic")}>
                <CodeTabs
                  tabs={[
                    python(snippets.messagesPython),
                    node(snippets.messagesNode),
                  ]}
                  {...copy}
                />
              </SubBlock>
              <SubBlock title={t("sdks.images")}>
                <CodeTabs
                  tabs={[
                    python(snippets.imagesPython),
                    node(snippets.imagesNode),
                  ]}
                  {...copy}
                />
              </SubBlock>
              <SubBlock title={t("sdks.speech")}>
                <CodeTabs
                  tabs={[
                    python(snippets.speechPython),
                    node(snippets.speechNode),
                  ]}
                  {...copy}
                />
              </SubBlock>
              <SubBlock title={t("sdks.transcription")}>
                <CodeTabs
                  tabs={[
                    python(snippets.transcriptionPython),
                    node(snippets.transcriptionNode),
                  ]}
                  {...copy}
                />
              </SubBlock>
            </DocSection>

            {/* ── Guides ── */}
            <DocSection
              id="guides"
              title={t("guides.title")}
              intro={t("guides.intro")}
            >
              <GuideCardGrid locale={locale} slugs={API_GUIDES} />
            </DocSection>
          </Div>
        </Div>
      </Div>

      {/* ── Closing CTA ─────────────────────────────────────────── */}
      <Div className="border-t border-border bg-muted/40 py-16 text-center md:py-20">
        <H2 className="mx-auto m-0 max-w-2xl border-0 px-4 text-3xl font-semibold tracking-tight text-balance md:text-4xl">
          {t("cta.title")}
        </H2>
        <P className="mx-auto mt-4 max-w-xl px-4 text-base text-muted-foreground md:text-lg">
          {t("cta.subtitle")}
        </P>
        <Div className="mt-8 flex flex-col items-center justify-center gap-3 px-4 sm:flex-row">
          <Cta href={keysHref} label={t("cta.button")} />
          <Cta
            href={unlockHref}
            label={t("cta.secondary")}
            variant="secondary"
            arrow={false}
          />
        </Div>
      </Div>
    </Div>
  );
}

export default async function ApiDocsPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
