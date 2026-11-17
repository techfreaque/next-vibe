/**
 * Blog post: one API key for every model, in OpenAI chat completions, OpenAI
 * Responses and Anthropic Messages format, plus the OpenAI-format media
 * endpoints (images, speech, transcription, video, music).
 * /[locale]/story/blog/openai-anthropic-compatible-api
 *
 * Code samples come from the API reference (src/_pages/docs/api/snippets.ts)
 * and the tested coding-tool setups (src/api-keys/coding-tools.ts). Model
 * count, prices, limits and model names are read from their sources; nothing
 * numeric is hardcoded in copy.
 */

import type { Metadata } from "next";
import {
  chatModelDefinitions,
  ChatModelId,
} from "next-vibe/agent/ai-stream/models";
import {
  type AgentEnvAvailability,
  getEnvAvailability,
} from "next-vibe/agent/env-availability";
import {
  getAvailableChatModelCount,
  getAvailableChatProviderCount,
} from "next-vibe/agent/models/all-models";
import { coreClientEnv as envClient } from "next-vibe/core/env-client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Div } from "next-vibe/ui/components/div";
import { AlertTriangle } from "next-vibe/ui/components/icons/AlertTriangle";
import { BookOpen } from "next-vibe/ui/components/icons/BookOpen";
import { EyeOff } from "next-vibe/ui/components/icons/EyeOff";
import { Key } from "next-vibe/ui/components/icons/Key";
import { Scale } from "next-vibe/ui/components/icons/Scale";
import { Wallet } from "next-vibe/ui/components/icons/Wallet";
import { JsonLd } from "next-vibe/ui/components/json-ld";
import { Link } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import { P } from "next-vibe/ui/components/typography";
import type { JSX } from "react";

import { buildFaqStructuredData } from "@/_pages/_components/faq-structured-data";
import { buildDocsSnippets } from "@/_pages/docs/api/snippets";
import { toModelSlug } from "@/_pages/models/_shared/model-facts";
import { listMediaFacts } from "@/_pages/models/_shared/model-media-facts";
import { API_UNLOCK_PATH, getApiAccessPrices } from "@/api-keys/access";
import {
  buildCodingToolSnippets,
  buildPublicApiBaseUrl,
  CODING_TOOL_MODEL,
  type CodingToolSetup,
} from "@/api-keys/coding-tools";
import { API_KEY_DEFAULT_RATE_LIMIT_PER_MINUTE } from "@/api-keys/constants";
import { scopedTranslation as apiKeysScopedTranslation } from "@/api-keys/i18n";
import { configScopedTranslation } from "@/env/i18n";
import { ProductIds, productsRepository } from "@/products/platform-products";
import { V1_MAX_OUTPUT_TOKENS } from "@/v1/shared/constants";

import {
  ArticleBody,
  ArticleCode,
  ArticleEnd,
  ArticleH3,
  ArticleHeader,
  ArticleLead,
  ArticleList,
  ArticleP,
  ArticleSection,
  InlineCode,
} from "../../_shared/article";
import { Callout, CardLink, Cta } from "../../_shared/marketing";
import { scopedTranslation } from "./i18n";

export const revalidate = 3600;

const SLUG = "openai-anthropic-compatible-api";

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
  const availability = await getEnvAvailability();
  const modelCount = getAvailableChatModelCount(false, availability);
  const mediaModelCount = countMediaModels(availability);
  return metadataGenerator(locale, {
    path: `story/blog/${SLUG}`,
    title: t("meta.title", { appName, modelCount }),
    category: t("meta.category"),
    description: t("meta.description", {
      appName,
      modelCount,
      mediaModelCount,
    }),
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2070",
    imageAlt: t("meta.imageAlt", { appName }),
    keywords: [t("meta.keywords", { appName })],
  });
};

/** Current (non-legacy) image, video, music, speech and transcription models. */
function countMediaModels(availability: AgentEnvAvailability): number {
  return listMediaFacts(availability).filter((model) => !model.isLegacy).length;
}

type PickGroup = "frontier" | "cheap" | "uncensored";

/** Model picks per job. All public text models with tool calling. */
const PICKS: readonly { key: PickGroup; models: readonly ChatModelId[] }[] = [
  {
    key: "frontier",
    models: [
      ChatModelId.CLAUDE_SONNET_5_5,
      ChatModelId.GPT_6_1_SOL,
      ChatModelId.GEMINI_4_ARGON,
      ChatModelId.KIMI_K3_1_PRO,
      ChatModelId.DEEPSEEK_V4_PRO,
    ],
  },
  {
    key: "cheap",
    models: [
      ChatModelId.GLM_5_3,
      ChatModelId.GLM_5_3_FLASH,
      ChatModelId.QWEN_3_8_FLASH,
      ChatModelId.CLAUDE_HAIKU_5_5,
    ],
  },
  {
    key: "uncensored",
    models: [
      ChatModelId.GLM_5_3_UNCENSORED,
      ChatModelId.QWEN_3_6_PLUS_UNCENSORED,
      ChatModelId.UNCENSORED_LM_V1_2,
    ],
  },
];

/** Head-to-heads a developer picking an API model actually asks about. */
const COMPARE_PAIRS: readonly (readonly [ChatModelId, ChatModelId])[] = [
  [ChatModelId.CLAUDE_SONNET_5_5, ChatModelId.GPT_6_1_SOL],
  [ChatModelId.CLAUDE_SONNET_5_5, ChatModelId.KIMI_K3_1_PRO],
  [ChatModelId.GPT_6_1_SOL, ChatModelId.GEMINI_4_ARGON],
  [ChatModelId.GLM_5_3, ChatModelId.DEEPSEEK_V4_PRO],
];

const FAQ_KEYS: readonly (
  | "openrouter"
  | "claudeCode"
  | "sdk"
  | "free"
  | "pricing"
  | "models"
  | "data"
)[] = ["openrouter", "claudeCode", "sdk", "free", "pricing", "models", "data"];

export interface CompatibleApiPostPageData {
  locale: CountryLanguage;
  baseUrl: string;
  modelCount: number;
  mediaModelCount: number;
  providerCount: number;
  subPrice: string;
  subCredits: number;
  packPrice: string;
  packCredits: number;
}

export async function tanstackLoader({
  params,
}: Props): Promise<CompatibleApiPostPageData> {
  const { locale } = await params;
  const availability = await getEnvAvailability();
  const products = productsRepository.getProducts(locale);
  const subscription = products[ProductIds.SUBSCRIPTION];
  const pack = products[ProductIds.CREDIT_PACK];
  return {
    locale,
    baseUrl: buildPublicApiBaseUrl(envClient.NEXT_PUBLIC_APP_URL, locale),
    modelCount: getAvailableChatModelCount(false, availability),
    mediaModelCount: countMediaModels(availability),
    providerCount: getAvailableChatProviderCount(false, availability),
    ...getApiAccessPrices(locale),
    subCredits: subscription.credits,
    packCredits: pack.credits,
  };
}

function ModelPick({
  id,
  locale,
}: {
  id: ChatModelId;
  locale: CountryLanguage;
}): JSX.Element {
  return (
    <Span className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <Link
        href={`/${locale}/models/${toModelSlug(id)}`}
        className="font-medium text-primary underline-offset-4 hover:underline"
      >
        {chatModelDefinitions[id].name}
      </Link>
      <InlineCode>{id}</InlineCode>
    </Span>
  );
}

/** One captioned code block. */
function Sample({
  caption,
  code,
  language,
  filename,
}: {
  caption: string;
  code: string;
  language: string;
  filename: string;
}): JSX.Element {
  return (
    <Div className="flex min-w-0 flex-col gap-2">
      <Span className="text-sm font-semibold text-foreground">{caption}</Span>
      <ArticleCode code={code} language={language} filename={filename} />
    </Div>
  );
}

/** The one-command block of a tested coding tool, with its "Tested with" line. */
function ToolCommand({
  tool,
  locale,
}: {
  tool: CodingToolSetup;
  locale: CountryLanguage;
}): JSX.Element | null {
  const { t: toolT } = apiKeysScopedTranslation.scopedT(locale);
  const block = tool.blocks.find((b) => b.kind === "oneCommand");
  if (!block || !tool.tested) {
    return null;
  }
  return (
    <Div className="flex min-w-0 flex-col gap-2">
      <ArticleH3>{tool.name}</ArticleH3>
      <Sample
        caption={`${toolT("codingTools.blocks.oneCommand")} (${toolT(
          "codingTools.tested",
          { name: tool.name, version: tool.tested.version },
        )})`}
        code={block.code}
        language={block.language}
        filename={block.filename}
      />
    </Div>
  );
}

export function TanstackPage({
  locale,
  baseUrl,
  modelCount,
  mediaModelCount,
  providerCount,
  subPrice,
  subCredits,
  packPrice,
  packCredits,
}: CompatibleApiPostPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  const back = { href: `/${locale}/story/blog`, label: t("hero.backToBlog") };
  const docs = buildDocsSnippets(baseUrl);
  const tools = buildCodingToolSnippets({ baseUrl });
  const limits = {
    rateLimit: API_KEY_DEFAULT_RATE_LIMIT_PER_MINUTE,
    maxTokens: V1_MAX_OUTPUT_TOKENS,
  };
  const prices = { subPrice, subCredits, packPrice, packCredits };

  return (
    <Div className="min-h-screen bg-background">
      <ArticleHeader
        back={back}
        category={t("hero.category")}
        readTime={t("hero.readTime")}
        post={{ slug: SLUG, locale }}
        title={t("hero.title", { modelCount })}
        subtitle={t("hero.subtitle", { appName, mediaModelCount })}
      />

      <ArticleBody>
        <Div className="flex flex-col gap-5">
          <ArticleLead>{t("intro.lead")}</ArticleLead>
          <ArticleP>
            {t("intro.p2", { appName, modelCount, providerCount })}
          </ArticleP>
          <Callout icon={Key} tone="warning">
            {t("intro.access", prices)}{" "}
            <Link
              href={`/${locale}/${API_UNLOCK_PATH}`}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              {t("intro.accessLink")}
            </Link>
          </Callout>
        </Div>

        <ArticleSection
          id="endpoints"
          title={t("endpoints.title")}
          intro={t("endpoints.intro")}
        >
          <ArticleList
            items={[
              t("endpoints.chat"),
              t("endpoints.responses"),
              t("endpoints.messages"),
              t("endpoints.countTokens"),
              t("endpoints.models"),
              t("endpoints.media", { mediaModelCount }),
            ]}
          />
          <ArticleP>{t("endpoints.auth")}</ArticleP>
          <Callout icon={Key} tone="neutral">
            <Span className="font-semibold">
              {t("endpoints.baseUrlLabel")}:
            </Span>{" "}
            <Span className="font-mono text-sm [overflow-wrap:anywhere]">
              {tools.baseUrl}
            </Span>
            <P className="mt-2 mb-0 text-sm text-muted-foreground">
              {t("endpoints.baseUrlNote")}
            </P>
            <P className="mt-4 mb-0">
              <Span className="font-semibold">
                {t("endpoints.anthropicBaseUrlLabel")}:
              </Span>{" "}
              <Span className="font-mono text-sm [overflow-wrap:anywhere]">
                {tools.anthropicBaseUrl}
              </Span>
            </P>
            <P className="mt-2 mb-0 text-sm text-muted-foreground">
              {t("endpoints.anthropicBaseUrlNote")}
            </P>
          </Callout>
        </ArticleSection>

        <ArticleSection
          id="code"
          title={t("samples.title")}
          intro={t("samples.intro")}
        >
          <ArticleH3>{t("samples.curl.title")}</ArticleH3>
          <ArticleP>{t("samples.curl.body")}</ArticleP>
          <Sample
            caption={t("samples.curl.caption")}
            code={docs.chat}
            language="bash"
            filename="terminal"
          />

          <ArticleH3>{t("samples.openai.title")}</ArticleH3>
          <ArticleP>{t("samples.openai.body")}</ArticleP>
          <Sample
            caption={t("samples.openai.caption")}
            code={docs.python}
            language="python"
            filename="chat.py"
          />
          <ArticleP>{t("samples.openai.responses")}</ArticleP>
          <Sample
            caption={t("samples.openai.responsesCaption")}
            code={docs.responsesPython}
            language="python"
            filename="responses.py"
          />

          <ArticleH3>{t("samples.anthropic.title")}</ArticleH3>
          <ArticleP>{t("samples.anthropic.body")}</ArticleP>
          <Sample
            caption={t("samples.anthropic.caption")}
            code={docs.messagesPython}
            language="python"
            filename="messages.py"
          />
          <ArticleP>{t("samples.anthropic.countTokens")}</ArticleP>
          <Sample
            caption={t("samples.anthropic.countTokensCaption")}
            code={docs.countTokens}
            language="bash"
            filename="terminal"
          />

          <ArticleH3>{t("samples.models.title")}</ArticleH3>
          <ArticleP>{t("samples.models.body")}</ArticleP>
          <Sample
            caption={t("samples.models.caption")}
            code={docs.models}
            language="bash"
            filename="terminal"
          />

          <ArticleH3>{t("samples.media.title")}</ArticleH3>
          <ArticleP>{t("samples.media.body")}</ArticleP>
          <Sample
            caption={t("samples.media.imageCaption")}
            code={docs.images}
            language="bash"
            filename="terminal"
          />
          <ArticleP>{t("samples.media.async")}</ArticleP>
          <Sample
            caption={t("samples.media.videoCaption")}
            code={docs.videoCreate}
            language="bash"
            filename="terminal"
          />
          <Sample
            caption={t("samples.media.pollCaption")}
            code={docs.videoPoll}
            language="bash"
            filename="terminal"
          />
        </ArticleSection>

        <ArticleSection
          id="model-ids"
          title={t("ids.title")}
          intro={t("ids.intro")}
        >
          <ArticleList
            items={[
              t("ids.ours"),
              t("ids.vendor"),
              t("ids.prefix"),
              t("ids.claudeFallback"),
            ]}
          />
        </ArticleSection>

        <ArticleSection
          id="coding-tools"
          title={t("tools.title")}
          intro={t("tools.intro")}
        >
          <ArticleP>{t("tools.p1", { model: CODING_TOOL_MODEL })}</ArticleP>
          <ToolCommand tool={tools.tools.claudeCode} locale={locale} />
          <ArticleP>{t("tools.claudeCode")}</ArticleP>
          <ToolCommand tool={tools.tools.codex} locale={locale} />
          <ArticleP>{t("tools.codex")}</ArticleP>
          <ArticleP>{t("tools.others")}</ArticleP>
          <CardLink
            href={`/${locale}/story/blog/unbottled-api-in-coding-tools`}
            label={t("tools.guideLink")}
          />
        </ArticleSection>

        <ArticleSection
          id="models"
          title={t("picks.title")}
          intro={t("picks.intro")}
        >
          {PICKS.map((group) => (
            <Div key={group.key} className="flex flex-col gap-3">
              <ArticleH3>{t(`picks.${group.key}.title`)}</ArticleH3>
              <ArticleP>{t(`picks.${group.key}.body`)}</ArticleP>
              <ArticleList
                items={group.models.map((id) => (
                  <ModelPick key={id} id={id} locale={locale} />
                ))}
              />
            </Div>
          ))}
          <ArticleP>{t("picks.compare")}</ArticleP>
          <Div className="flex flex-col">
            {COMPARE_PAIRS.map(([a, b]) => (
              <CardLink
                key={`${a}-${b}`}
                href={`/${locale}/models/compare/${toModelSlug(a)}/${toModelSlug(b)}`}
                label={t("picks.compareLink", {
                  a: chatModelDefinitions[a].name,
                  b: chatModelDefinitions[b].name,
                })}
              />
            ))}
            <CardLink
              href={`/${locale}/models`}
              label={t("picks.allModels", { modelCount })}
            />
          </Div>
        </ArticleSection>

        <ArticleSection
          id="billing"
          title={t("billing.title")}
          intro={t("billing.intro")}
        >
          <ArticleList
            items={[
              t("billing.price"),
              t("billing.reported"),
              t("billing.preflight"),
              t("billing.abort"),
              t("billing.chat"),
              t("billing.media"),
              t("billing.paid"),
            ]}
          />
          <ArticleList
            items={[t("billing.sub", prices), t("billing.pack", prices)]}
          />
          <CardLink
            href={`/${locale}/subscription`}
            label={t("billing.link")}
          />
        </ArticleSection>

        <ArticleSection
          id="compare"
          title={t("versus.title")}
          intro={t("versus.intro")}
        >
          <ArticleH3>{t("versus.direct.title")}</ArticleH3>
          <ArticleP>{t("versus.direct.body")}</ArticleP>
          <ArticleH3>{t("versus.router.title")}</ArticleH3>
          <ArticleP>{t("versus.router.body")}</ArticleP>
          <ArticleH3>{t("versus.here.title", { appName })}</ArticleH3>
          <ArticleP>{t("versus.here.body", { appName })}</ArticleP>
          <Callout icon={Scale} tone="neutral">
            {t("versus.verdict")}
          </Callout>
        </ArticleSection>

        <ArticleSection
          id="limits"
          title={t("limits.title")}
          intro={t("limits.intro")}
        >
          <ArticleList
            items={[
              t("limits.stateless"),
              t("limits.maxTokens", limits),
              t("limits.rateLimit", limits),
              t("limits.countTokens"),
              t("limits.tools"),
              t("limits.consent"),
            ]}
          />
          <Callout icon={AlertTriangle} tone="warning">
            {t("limits.localeUrl")}
          </Callout>
        </ArticleSection>

        <ArticleSection
          id="privacy"
          title={t("privacy.title")}
          intro={t("privacy.intro")}
        >
          <ArticleList
            items={[
              t("privacy.noStore"),
              t("privacy.upstream"),
              t("privacy.incognito"),
            ]}
          />
          <Callout icon={EyeOff} tone="neutral">
            {t("privacy.selfHost", { appName })}{" "}
            <Link
              href={`/${locale}/story/self-host`}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              {t("privacy.selfHostLink")}
            </Link>
          </Callout>
        </ArticleSection>

        <ArticleSection id="faq" title={t("faq.title")}>
          <JsonLd
            id="faq-structured-data"
            data={buildFaqStructuredData(
              FAQ_KEYS.map((key) => ({
                question: t(`faq.${key}.q`, { appName }),
                answer: t(`faq.${key}.a`, {
                  appName,
                  modelCount,
                  mediaModelCount,
                  ...prices,
                }),
              })),
            )}
          />
          {FAQ_KEYS.map((key) => (
            <Div key={key} className="flex flex-col gap-2">
              <ArticleH3>{t(`faq.${key}.q`, { appName })}</ArticleH3>
              <ArticleP>
                {t(`faq.${key}.a`, {
                  appName,
                  modelCount,
                  mediaModelCount,
                  ...prices,
                })}
              </ArticleP>
            </Div>
          ))}
          <Div className="flex flex-col">
            <CardLink href={`/${locale}/docs/api`} label={t("faq.docsLink")} />
            <CardLink
              href={`/${locale}/subscription`}
              label={t("faq.pricingLink")}
            />
          </Div>
        </ArticleSection>

        <Callout icon={Wallet} tone="primary">
          <Span>{t("partners.body", { appName })}</Span>{" "}
          <Link
            href={`/${locale}/story/partners`}
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            {t("partners.link")}
          </Link>
        </Callout>

        <ArticleEnd
          back={back}
          title={t("cta.title")}
          subtitle={t("cta.subtitle")}
          actions={
            <>
              <Cta
                href={`/${locale}/tools/api-keys`}
                label={t("cta.key")}
                icon={Key}
              />
              <Cta
                href={`/${locale}/docs/api`}
                label={t("cta.docs")}
                icon={BookOpen}
                variant="secondary"
              />
            </>
          }
        />
      </ArticleBody>
    </Div>
  );
}

export default async function CompatibleApiPostPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
