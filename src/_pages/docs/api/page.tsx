import type { Metadata } from "next";
import { getEnvAvailability } from "next-vibe/agent/env-availability";
import { getAvailableChatModelCount } from "next-vibe/agent/models/all-models";
import { coreClientEnv as envClient } from "next-vibe/core/env-client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Platform } from "next-vibe/platforms/platforms";
import { Div } from "next-vibe/ui/components/div";
import { AlertTriangle } from "next-vibe/ui/components/icons/AlertTriangle";
import { BookOpen } from "next-vibe/ui/components/icons/BookOpen";
import { CreditCard } from "next-vibe/ui/components/icons/CreditCard";
import { Key } from "next-vibe/ui/components/icons/Key";
import { Wrench } from "next-vibe/ui/components/icons/Wrench";
import { CodeSnippet } from "next-vibe/ui/components/markdown";
import { Span } from "next-vibe/ui/components/span";
import { H3, P } from "next-vibe/ui/components/typography";
import type { JSX, ReactNode } from "react";

import {
  buildCodingToolSnippets,
  buildPublicApiBaseUrl,
  CODING_TOOL_EXAMPLE_MODELS,
  CODING_TOOL_IDS,
  CODING_TOOL_MODEL,
} from "@/api-keys/coding-tools";
import { scopedTranslation as apiKeysScopedTranslation } from "@/api-keys/i18n";
import { configScopedTranslation } from "@/env/i18n";

import {
  Callout,
  Cta,
  PageHero,
  PageSection,
  Step,
  StepList,
} from "../../story/_shared/marketing";
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
  [429, "rate_limit_exceeded", "rate"],
  [502, "upstream_error", "upstream"],
  [503, "balance_unavailable", "balance"],
] as const;

function Code({
  code,
  language = "bash",
  filename,
}: {
  code: string;
  language?: string;
  filename?: string;
}): JSX.Element {
  return (
    <Div className="min-w-0 max-w-full">
      <CodeSnippet
        code={code}
        language={language}
        filename={filename}
        variant="file"
      />
    </Div>
  );
}

function Block({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}): JSX.Element {
  return (
    <Div className="flex min-w-0 flex-col gap-3">
      <H3 className="text-lg font-semibold">{title}</H3>
      {children}
    </Div>
  );
}

function Prose({ children }: { children: ReactNode }): JSX.Element {
  return (
    <P className="max-w-3xl text-base leading-relaxed text-muted-foreground">
      {children}
    </P>
  );
}

function Bullets({ items }: { items: string[] }): JSX.Element {
  return (
    <Div className="flex max-w-3xl flex-col gap-2">
      {items.map((item) => (
        <Div key={item} className="flex gap-3">
          <Span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
          <P className="m-0 text-base leading-relaxed text-foreground/90">
            {item}
          </P>
        </Div>
      ))}
    </Div>
  );
}

function Row({
  cells,
  header = false,
}: {
  cells: Array<{ text: string; mono?: boolean }>;
  header?: boolean;
}): JSX.Element {
  return (
    <Div
      className={
        header
          ? "grid grid-cols-[minmax(0,9rem)_minmax(0,1fr)] gap-4 bg-muted/60 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)]"
          : "grid grid-cols-[minmax(0,9rem)_minmax(0,1fr)] gap-4 px-4 py-3 text-sm sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)]"
      }
    >
      {cells.map((cell) => (
        <Span
          key={cell.text}
          className={
            cell.mono
              ? "min-w-0 break-words font-mono text-xs text-foreground"
              : "min-w-0 break-words leading-relaxed text-muted-foreground"
          }
        >
          {cell.text}
        </Span>
      ))}
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
  const { t: toolT } = apiKeysScopedTranslation.scopedT(locale);
  const snippets = buildDocsSnippets(baseUrl);
  const toolSnippets = buildCodingToolSnippets({ baseUrl });

  return (
    <Div className="min-h-screen bg-background">
      <PageHero
        eyebrow={t("hero.badge")}
        eyebrowIcon={BookOpen}
        title={
          <>
            {t("hero.title")}{" "}
            <Span className="text-primary">{t("hero.titleHighlight")}</Span>
          </>
        }
        subtitle={t("hero.subtitle", { appName, modelCount })}
        actions={
          <>
            <Cta
              href={`/${locale}/tools/api-keys`}
              label={t("hero.ctaKey")}
              icon={Key}
            />
            <Cta
              href={`/${locale}/subscription`}
              label={t("hero.ctaPricing")}
              icon={CreditCard}
              variant="secondary"
              arrow={false}
            />
          </>
        }
      />

      <PageSection
        id="quickstart"
        label={t("nav.quickstart")}
        title={t("quickstart.title")}
        intro={t("quickstart.intro")}
      >
        <Div className="max-w-3xl">
          <StepList>
            <Step
              number={1}
              title={t("quickstart.step1.title")}
              description={t("quickstart.step1.description")}
            >
              <Callout icon={Key} tone="neutral">
                <Span className="font-semibold">
                  {t("quickstart.baseUrlLabel")}:
                </Span>{" "}
                <Span className="font-mono text-sm [overflow-wrap:anywhere]">
                  {toolSnippets.baseUrl}
                </Span>
                <P className="mt-2 mb-0 text-sm text-muted-foreground">
                  {t("quickstart.baseUrlNote")}
                </P>
                <P className="mt-3 mb-0">
                  <Span className="font-semibold">
                    {t("quickstart.anthropicBaseUrlLabel")}:
                  </Span>{" "}
                  <Span className="font-mono text-sm [overflow-wrap:anywhere]">
                    {toolSnippets.anthropicBaseUrl}
                  </Span>
                </P>
                <P className="mt-2 mb-0 text-sm text-muted-foreground">
                  {t("quickstart.anthropicBaseUrlNote")}
                </P>
              </Callout>
            </Step>
            <Step
              number={2}
              title={t("quickstart.step2.title")}
              description={t("quickstart.step2.description")}
            >
              <Code code={snippets.chat} filename="curl" />
            </Step>
            <Step
              number={3}
              title={t("quickstart.step3.title")}
              description={t("quickstart.step3.description")}
            >
              <Div className="flex min-w-0 flex-col gap-4">
                <Code
                  code={snippets.python}
                  language="python"
                  filename={t("quickstart.step3.python")}
                />
                <Code
                  code={snippets.node}
                  language="javascript"
                  filename={t("quickstart.step3.node")}
                />
              </Div>
            </Step>
          </StepList>
        </Div>
        <Callout icon={CreditCard} tone="warning" className="mt-8 max-w-3xl">
          <Span className="font-semibold">{t("access.title")}. </Span>
          {t("access.body")}
        </Callout>
      </PageSection>

      <PageSection
        id="auth"
        tone="muted"
        label={t("nav.auth")}
        title={t("auth.title")}
        intro={t("auth.intro")}
      >
        <Div className="flex flex-col gap-6">
          <Code code={t("auth.header")} filename="header" />
          <Code code={t("auth.headerAnthropic")} filename="header" />
          <Bullets
            items={[
              t("auth.points.hash"),
              t("auth.points.scope"),
              t("auth.points.limit"),
              t("auth.points.missing"),
            ]}
          />
        </Div>
      </PageSection>

      <PageSection
        id="models"
        label={t("nav.models")}
        title={t("models.title")}
        intro={t("models.intro")}
      >
        <Div className="flex flex-col gap-6">
          <Code code={snippets.models} filename="request" />
          <Code code={snippets.modelsResponse} language="json" filename="200" />
          <Prose>{t("models.note")}</Prose>
        </Div>
      </PageSection>

      <PageSection
        id="chat"
        tone="muted"
        label={t("nav.chat")}
        title={t("chat.title")}
        intro={t("chat.intro")}
      >
        <Div className="flex flex-col gap-10">
          <Block title={t("chat.nonStream.title")}>
            <Prose>{t("chat.nonStream.body")}</Prose>
            <Code code={snippets.chat} filename="request" />
            <Code code={snippets.chatResponse} language="json" filename="200" />
          </Block>
          <Block title={t("chat.stream.title")}>
            <Prose>{t("chat.stream.body")}</Prose>
            <Code code={snippets.stream} filename="request" />
            <Code
              code={snippets.streamResponse}
              language="text"
              filename="200"
            />
            <Code
              code={snippets.pythonStream}
              language="python"
              filename={t("quickstart.step3.python")}
            />
            <Code
              code={snippets.nodeStream}
              language="javascript"
              filename={t("quickstart.step3.node")}
            />
          </Block>
          <Block title={t("chat.paramsTitle")}>
            <Div className="overflow-hidden rounded-xl border border-border bg-card">
              <Row
                header
                cells={[
                  { text: t("chat.paramsColumns.field") },
                  { text: t("chat.paramsColumns.description") },
                ]}
              />
              <Div className="divide-y divide-border">
                {PARAM_KEYS.map(([field, key]) => (
                  <Row
                    key={field}
                    cells={[
                      { text: field, mono: true },
                      { text: t(`chat.params.${key}`) },
                    ]}
                  />
                ))}
              </Div>
            </Div>
          </Block>
        </Div>
      </PageSection>

      <PageSection
        id="tools"
        label={t("nav.tools")}
        title={t("tools.title")}
        intro={t("tools.intro")}
      >
        <Div className="flex flex-col gap-10">
          <Block title={t("tools.flow.title")}>
            <Bullets
              items={[
                t("tools.flow.step1"),
                t("tools.flow.step2"),
                t("tools.flow.step3"),
                t("tools.flow.step4"),
              ]}
            />
          </Block>
          <Block title={t("tools.requestTitle")}>
            <Code code={snippets.toolsCurl} filename="request" />
          </Block>
          <Block title={t("tools.responseTitle")}>
            <Code
              code={snippets.toolsResponse}
              language="json"
              filename="200"
            />
          </Block>
          <Block title={t("tools.followUpTitle")}>
            <Code code={snippets.toolsFollowUp} filename="request" />
          </Block>
          <Block title={t("tools.sdkTitle")}>
            <Code
              code={snippets.toolsPython}
              language="python"
              filename={t("quickstart.step3.python")}
            />
          </Block>
          <Block title={t("tools.streamingTitle")}>
            <Prose>{t("tools.streamingBody")}</Prose>
          </Block>
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
        </Div>
      </PageSection>

      <PageSection
        id="responses"
        tone="muted"
        label={t("nav.responses")}
        title={t("responses.title")}
        intro={t("responses.intro")}
      >
        <Div className="flex flex-col gap-10">
          <Block title={t("responses.request.title")}>
            <Prose>{t("responses.request.body")}</Prose>
            <Code code={snippets.responses} filename="request" />
            <Code
              code={snippets.responsesResponse}
              language="json"
              filename="200"
            />
          </Block>
          <Block title={t("responses.stream.title")}>
            <Prose>{t("responses.stream.body")}</Prose>
            <Code
              code={snippets.responsesStream}
              language="text"
              filename="200"
            />
          </Block>
          <Block title={t("responses.sdkTitle")}>
            <Code
              code={snippets.responsesPython}
              language="python"
              filename={t("quickstart.step3.python")}
            />
          </Block>
          <Bullets
            items={[
              t("responses.points.tools"),
              t("responses.points.reasoning"),
              t("responses.points.billing"),
            ]}
          />
        </Div>
      </PageSection>

      <PageSection
        id="messages"
        label={t("nav.messages")}
        title={t("messages.title")}
        intro={t("messages.intro")}
      >
        <Div className="flex flex-col gap-10">
          <Block title={t("messages.request.title")}>
            <Prose>{t("messages.request.body")}</Prose>
            <Code code={snippets.messages} filename="request" />
            <Code
              code={snippets.messagesResponse}
              language="json"
              filename="200"
            />
          </Block>
          <Block title={t("messages.stream.title")}>
            <Prose>{t("messages.stream.body")}</Prose>
            <Code
              code={snippets.messagesStream}
              language="text"
              filename="200"
            />
          </Block>
          <Block title={t("messages.sdkTitle")}>
            <Code
              code={snippets.messagesPython}
              language="python"
              filename={t("quickstart.step3.python")}
            />
          </Block>
          <Block title={t("messages.countTokens.title")}>
            <Prose>{t("messages.countTokens.body")}</Prose>
            <Code code={snippets.countTokens} filename="request" />
            <Code
              code={snippets.countTokensResponse}
              language="json"
              filename="200"
            />
          </Block>
          <Bullets
            items={[
              t("messages.points.auth"),
              t("messages.points.models"),
              t("messages.points.tools"),
              t("messages.points.billing"),
            ]}
          />
        </Div>
      </PageSection>

      <PageSection
        id="billing"
        tone="muted"
        label={t("nav.billing")}
        title={t("billing.title")}
        intro={t("billing.intro")}
      >
        <Div className="flex flex-col gap-6">
          <Bullets
            items={[
              t("billing.points.price"),
              t("billing.points.usage"),
              t("billing.points.preflight"),
              t("billing.points.real"),
              t("billing.points.topup"),
            ]}
          />
          <Code code={snippets.errorCredits} language="text" filename="402" />
        </Div>
      </PageSection>

      <PageSection
        id="limits"
        label={t("nav.limits")}
        title={t("limits.title")}
        intro={t("limits.body")}
      >
        <Code code={snippets.rateHeaders} language="text" filename="429" />
      </PageSection>

      <PageSection
        id="errors"
        tone="muted"
        label={t("nav.errors")}
        title={t("errors.title")}
        intro={t("errors.intro")}
      >
        <Div className="flex flex-col gap-6">
          <Code code={snippets.errorShape} language="json" filename="error" />
          <Code
            code={snippets.errorShapeAnthropic}
            language="json"
            filename="/v1/messages"
          />
          <Div className="overflow-hidden rounded-xl border border-border bg-card">
            <Row
              header
              cells={[
                {
                  text: `${t("errors.columns.status")} / ${t("errors.columns.code")}`,
                },
                { text: t("errors.columns.meaning") },
              ]}
            />
            <Div className="divide-y divide-border">
              {ERROR_ROWS.map(([status, code, key]) => (
                <Row
                  key={code}
                  cells={[
                    { text: `${status} ${code}`, mono: true },
                    { text: t(`errors.rows.${key}`) },
                  ]}
                />
              ))}
            </Div>
          </Div>
          <Callout icon={AlertTriangle} tone="neutral">
            {t("errors.streamNote")}
          </Callout>
        </Div>
      </PageSection>

      <PageSection
        id="coding-tools"
        label={t("nav.codingTools")}
        title={t("codingTools.title")}
        intro={t("codingTools.intro")}
      >
        <Div className="flex flex-col gap-10">
          {CODING_TOOL_IDS.map((id) => {
            const tool = toolSnippets.tools[id];
            return (
              <Block key={id} title={tool.name}>
                <Prose>{toolT(`codingTools.tools.${id}.hint`)}</Prose>
                {tool.blocks.map((block) => (
                  <Div
                    key={`${id}-${block.kind}`}
                    className="flex min-w-0 flex-col gap-2"
                  >
                    <Span className="text-sm font-semibold text-foreground">
                      {toolT(`codingTools.blocks.${block.kind}`)}
                    </Span>
                    <Code
                      code={block.code}
                      language={block.language}
                      filename={block.filename}
                    />
                  </Div>
                ))}
                {tool.tested ? (
                  <P className="m-0 text-sm text-muted-foreground">
                    {toolT("codingTools.tested", {
                      name: tool.name,
                      version: tool.tested.version,
                    })}
                  </P>
                ) : undefined}
              </Block>
            );
          })}
          <Callout icon={Key} tone="neutral">
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
              href={`/${locale}/tools/api-keys`}
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
        </Div>
      </PageSection>

      <Div className="border-t border-border bg-muted/40 py-16 text-center md:py-24">
        <H3 className="mx-auto max-w-2xl px-4 text-3xl font-semibold tracking-tight text-balance md:text-4xl">
          {t("cta.title")}
        </H3>
        <P className="mx-auto mt-4 max-w-xl px-4 text-base text-muted-foreground md:text-lg">
          {t("cta.subtitle")}
        </P>
        <Div className="mt-8 flex flex-col items-center justify-center gap-3 px-4 sm:flex-row">
          <Cta href={`/${locale}/tools/api-keys`} label={t("cta.button")} />
          <Cta
            href={`/${locale}/subscription`}
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
