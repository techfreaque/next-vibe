/**
 * Blog post: the unbottled.ai API inside coding tools.
 * /[locale]/story/blog/unbottled-api-in-coding-tools
 *
 * Every snippet comes from src/api-keys/coding-tools.ts (shared with the API
 * key page and /docs/api). "Tested with" lines only render for tools listed in
 * CODING_TOOLS_TESTED there. Base URL comes from the live app URL.
 */

import type { Metadata } from "next";
import {
  chatModelDefinitions,
  ChatModelId,
} from "next-vibe/agent/ai-stream/models";
import { coreClientEnv as envClient } from "next-vibe/core/env-client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Div } from "next-vibe/ui/components/div";
import { AlertTriangle } from "next-vibe/ui/components/icons/AlertTriangle";
import { BookOpen } from "next-vibe/ui/components/icons/BookOpen";
import { Key } from "next-vibe/ui/components/icons/Key";
import { Plug } from "next-vibe/ui/components/icons/Plug";
import { Sparkles } from "next-vibe/ui/components/icons/Sparkles";
import { Span } from "next-vibe/ui/components/span";
import { P } from "next-vibe/ui/components/typography";
import type { JSX } from "react";

import {
  buildCodingToolSnippets,
  buildPublicApiBaseUrl,
  CODING_TOOL_MODEL,
  type CodingToolId,
  type CodingToolSetup,
} from "@/api-keys/coding-tools";
import { scopedTranslation as apiKeysScopedTranslation } from "@/api-keys/i18n";
import { configScopedTranslation } from "@/env/i18n";

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
import { Callout, Cta } from "../../_shared/marketing";
import { formatPostDate } from "../posts-meta";
import { scopedTranslation } from "./i18n";

export const revalidate = 3600;

const SLUG = "unbottled-api-in-coding-tools";

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
    path: `story/blog/${SLUG}`,
    title: t("meta.title", { appName }),
    category: t("meta.category"),
    description: t("meta.description", { appName }),
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070",
    imageAlt: t("meta.imageAlt", { appName }),
    keywords: [t("meta.keywords", { appName })],
  });
};

type PickGroup = "strong" | "cheap" | "uncensored";

/** Model picks per job. All call tools; ids and names read from the registry. */
const PICKS: readonly { key: PickGroup; models: readonly ChatModelId[] }[] = [
  {
    key: "strong",
    models: [
      ChatModelId.CLAUDE_SONNET_5_5,
      ChatModelId.CLAUDE_OPUS_5_5,
      ChatModelId.GPT_6_1_SOL,
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
      ChatModelId.VENICE_DEEPSEEK_V4_1_FLASH_UNCENSORED,
      ChatModelId.QWEN_3_6_PLUS_UNCENSORED,
      ChatModelId.VENICE_UNCENSORED,
    ],
  },
];

export interface CodingToolsPostPageData {
  locale: CountryLanguage;
  baseUrl: string;
}

export async function tanstackLoader({
  params,
}: Props): Promise<CodingToolsPostPageData> {
  const { locale } = await params;
  return {
    locale,
    baseUrl: buildPublicApiBaseUrl(envClient.NEXT_PUBLIC_APP_URL, locale),
  };
}

function ModelPick({ id }: { id: ChatModelId }): JSX.Element {
  return (
    <Span className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <InlineCode>{id}</InlineCode>
      <Span className="text-muted-foreground">
        {chatModelDefinitions[id].name}
      </Span>
    </Span>
  );
}

/** Captioned code blocks for one tool, straight from the shared builder. */
function ToolBlocks({
  tool,
  locale,
}: {
  tool: CodingToolSetup;
  locale: CountryLanguage;
}): JSX.Element {
  const { t: toolT } = apiKeysScopedTranslation.scopedT(locale);
  return (
    <>
      {tool.blocks.map((block) => (
        <Div
          key={`${tool.id}-${block.kind}`}
          className="flex min-w-0 flex-col gap-2"
        >
          <Span className="text-sm font-semibold text-foreground">
            {toolT(`codingTools.blocks.${block.kind}`)}
          </Span>
          <ArticleCode
            code={block.code}
            language={block.language}
            filename={block.filename}
          />
        </Div>
      ))}
    </>
  );
}

/** Tool standfirst plus the "Tested with" line when CODING_TOOLS_TESTED has one. */
function toolIntro(
  intro: string,
  tool: CodingToolSetup,
  locale: CountryLanguage,
): string {
  if (!tool.tested) {
    return intro;
  }
  const { t: toolT } = apiKeysScopedTranslation.scopedT(locale);
  return `${intro} ${toolT("codingTools.tested", {
    name: tool.name,
    version: tool.tested.version,
  })}.`;
}

export function TanstackPage({
  locale,
  baseUrl,
}: CodingToolsPostPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  const snippets = buildCodingToolSnippets({ baseUrl });
  const tools = snippets.tools;
  const back = { href: `/${locale}/story/blog`, label: t("hero.backToBlog") };
  const wireLabel = (id: CodingToolId): string => t(`wire.${tools[id].wire}`);

  return (
    <Div className="min-h-screen bg-background">
      <ArticleHeader
        back={back}
        category={t("hero.category")}
        readTime={t("hero.readTime")}
        date={formatPostDate(SLUG, locale)}
        title={t("hero.title")}
        subtitle={t("hero.subtitle", { appName })}
      />

      <ArticleBody>
        <Div className="flex flex-col gap-5">
          <ArticleLead>{t("intro.lead")}</ArticleLead>
          <ArticleP>{t("intro.p2", { appName })}</ArticleP>
        </Div>

        <ArticleSection title={t("why.title")}>
          <ArticleList
            items={[
              t("why.oneKey"),
              t("why.uncensored"),
              t("why.switch"),
              t("why.billing"),
            ]}
          />
        </ArticleSection>

        <ArticleSection title={t("setup.title")} intro={t("setup.intro")}>
          <ArticleP>{t("setup.p1")}</ArticleP>
          <Callout icon={Key} tone="neutral">
            <Span className="font-semibold">{t("setup.baseUrlLabel")}:</Span>{" "}
            <Span className="font-mono text-sm [overflow-wrap:anywhere]">
              {snippets.baseUrl}
            </Span>
            <P className="mt-2 mb-0 text-sm text-muted-foreground">
              {t("setup.baseUrlNote")}
            </P>
            <P className="mt-4 mb-0">
              <Span className="font-semibold">
                {t("setup.anthropicBaseUrlLabel")}:
              </Span>{" "}
              <Span className="font-mono text-sm [overflow-wrap:anywhere]">
                {snippets.anthropicBaseUrl}
              </Span>
            </P>
            <P className="mt-2 mb-0 text-sm text-muted-foreground">
              {t("setup.anthropicBaseUrlNote")}
            </P>
          </Callout>
          <ToolBlocks tool={tools.curl} locale={locale} />
          <ArticleP>{t("setup.p2")}</ArticleP>
          <Callout icon={Sparkles} tone="neutral">
            {t("setup.shortcut")}
          </Callout>
        </ArticleSection>

        <ArticleSection title={t("compat.title")} intro={t("compat.intro")}>
          <ArticleList
            items={[
              t("compat.codex"),
              t("compat.claudeCode"),
              t("compat.chat"),
            ]}
          />
          <ArticleP>{t("compat.other")}</ArticleP>
          <ToolBlocks tool={tools.openaiCompatible} locale={locale} />
        </ArticleSection>

        <ArticleSection
          id="codex"
          label={wireLabel("codex")}
          title={tools.codex.name}
          intro={toolIntro(t("codex.intro"), tools.codex, locale)}
        >
          <ArticleP>{t("codex.p1")}</ArticleP>
          <ToolBlocks tool={tools.codex} locale={locale} />
          <ArticleP>{t("codex.p2")}</ArticleP>
        </ArticleSection>

        <ArticleSection
          id="claude-code"
          label={wireLabel("claudeCode")}
          title={tools.claudeCode.name}
          intro={toolIntro(t("claudeCode.intro"), tools.claudeCode, locale)}
        >
          <ArticleP>{t("claudeCode.p1")}</ArticleP>
          <ToolBlocks tool={tools.claudeCode} locale={locale} />
          <ArticleP>{t("claudeCode.p2")}</ArticleP>
          <ArticleP>{t("claudeCode.p3")}</ArticleP>
        </ArticleSection>

        <ArticleSection
          id="opencode"
          label={wireLabel("opencode")}
          title={tools.opencode.name}
          intro={toolIntro(t("opencode.intro"), tools.opencode, locale)}
        >
          <ArticleP>{t("opencode.p1")}</ArticleP>
          <ToolBlocks tool={tools.opencode} locale={locale} />
          <Callout icon={AlertTriangle} tone="warning">
            {t("opencode.gotcha")}
          </Callout>
        </ArticleSection>

        <ArticleSection
          id="continue"
          label={wireLabel("continue")}
          title={tools.continue.name}
          intro={toolIntro(t("continue.intro"), tools.continue, locale)}
        >
          <ToolBlocks tool={tools.continue} locale={locale} />
          <ArticleP>{t("continue.p1")}</ArticleP>
        </ArticleSection>

        <ArticleSection
          id="aider"
          label={wireLabel("aider")}
          title={tools.aider.name}
          intro={toolIntro(t("aider.intro"), tools.aider, locale)}
        >
          <ArticleP>{t("aider.p1")}</ArticleP>
          <ToolBlocks tool={tools.aider} locale={locale} />
        </ArticleSection>

        <ArticleSection
          id="cline"
          label={wireLabel("cline")}
          title={tools.cline.name}
          intro={toolIntro(t("cline.intro"), tools.cline, locale)}
        >
          <ArticleP>{t("cline.p1")}</ArticleP>
          <ToolBlocks tool={tools.cline} locale={locale} />
        </ArticleSection>

        <ArticleSection title={t("models.title")} intro={t("models.intro")}>
          {PICKS.map((group) => (
            <Div key={group.key} className="flex flex-col gap-3">
              <ArticleH3>{t(`models.${group.key}.title`)}</ArticleH3>
              <ArticleP>{t(`models.${group.key}.body`)}</ArticleP>
              <ArticleList
                items={group.models.map((id) => (
                  <ModelPick key={id} id={id} />
                ))}
              />
            </Div>
          ))}
          <Callout icon={Plug} tone="neutral">
            {t("models.listNote")}
          </Callout>
        </ArticleSection>

        <ArticleSection title={t("gotchas.title")} intro={t("gotchas.intro")}>
          <ArticleList
            items={[
              t("gotchas.localeUrl"),
              t("gotchas.anthropicUrl"),
              t("gotchas.modelId", { model: CODING_TOOL_MODEL }),
              t("gotchas.paid"),
              t("gotchas.tools"),
              t("gotchas.rateLimit"),
            ]}
          />
        </ArticleSection>

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

export default async function CodingToolsPostPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
