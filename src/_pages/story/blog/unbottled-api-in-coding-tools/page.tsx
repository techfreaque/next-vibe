/**
 * Blog post: the unbottled.ai API inside coding tools.
 * /[locale]/story/blog/unbottled-api-in-coding-tools
 *
 * Every config was run end to end on 2026-11-12 (versions in snippets.ts).
 * Base URL comes from the live app URL, model ids and names from the registry.
 */

import type { Metadata } from "next";
import {
  ChatModelId,
  chatModelDefinitions,
} from "next-vibe/agent/ai-stream/models";
import { coreClientEnv as envClient } from "next-vibe/core/env-client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Div } from "next-vibe/ui/components/div";
import { AlertTriangle } from "next-vibe/ui/components/icons/AlertTriangle";
import { BookOpen } from "next-vibe/ui/components/icons/BookOpen";
import { Key } from "next-vibe/ui/components/icons/Key";
import { Plug } from "next-vibe/ui/components/icons/Plug";
import { Span } from "next-vibe/ui/components/span";
import { P } from "next-vibe/ui/components/typography";
import type { JSX } from "react";

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
import { buildCodingToolSnippets } from "./snippets";

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
      ChatModelId.DEEPSEEK_V4_1_FLASH,
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
    baseUrl: `${envClient.NEXT_PUBLIC_APP_URL}/api/${locale}/v1`,
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

export function TanstackPage({
  locale,
  baseUrl,
}: CodingToolsPostPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  const snippets = buildCodingToolSnippets(baseUrl);
  const back = { href: `/${locale}/story/blog`, label: t("hero.backToBlog") };

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
              {baseUrl}
            </Span>
            <P className="mt-2 mb-0 text-sm text-muted-foreground">
              {t("setup.baseUrlNote")}
            </P>
          </Callout>
          <ArticleCode
            code={snippets.key}
            language="bash"
            filename="terminal"
          />
          <ArticleP>{t("setup.p2")}</ArticleP>
        </ArticleSection>

        <ArticleSection title={t("compat.title")} intro={t("compat.intro")}>
          <ArticleList
            items={[
              t("compat.opencode"),
              t("compat.continue"),
              t("compat.codex"),
              t("compat.claudeCode"),
            ]}
          />
          <ArticleP>{t("compat.other")}</ArticleP>
        </ArticleSection>

        <ArticleSection
          id="opencode"
          label={t("opencode.label")}
          title={t("opencode.title")}
          intro={t("opencode.intro")}
        >
          <ArticleP>{t("opencode.p1")}</ArticleP>
          <ArticleCode
            code={snippets.opencode}
            language="json"
            filename="opencode.json"
          />
          <ArticleP>{t("opencode.p2")}</ArticleP>
          <ArticleCode
            code={snippets.opencodeRun}
            language="bash"
            filename="terminal"
          />
          <Callout icon={AlertTriangle} tone="warning">
            {t("opencode.gotcha")}
          </Callout>
        </ArticleSection>

        <ArticleSection
          id="continue"
          label={t("continue.label")}
          title={t("continue.title")}
          intro={t("continue.intro")}
        >
          <ArticleCode
            code={snippets.continueConfig}
            language="yaml"
            filename="config.yaml"
          />
          <ArticleP>{t("continue.p1")}</ArticleP>
          <ArticleCode
            code={snippets.continueRun}
            language="bash"
            filename="terminal"
          />
        </ArticleSection>

        <ArticleSection
          id="bridge"
          label={t("bridge.label")}
          title={t("bridge.title")}
          intro={t("bridge.intro")}
        >
          <ArticleP>{t("bridge.p1", { appName })}</ArticleP>
          <ArticleCode
            code={snippets.litellmConfig}
            language="yaml"
            filename="litellm.yaml"
          />
          <ArticleCode
            code={snippets.litellmRun}
            language="bash"
            filename="terminal"
          />
          <Callout icon={AlertTriangle} tone="warning">
            {t("bridge.gotcha")}
          </Callout>
        </ArticleSection>

        <ArticleSection
          id="codex"
          label={t("codex.label")}
          title={t("codex.title")}
          intro={t("codex.intro")}
        >
          <ArticleP>{t("codex.p1")}</ArticleP>
          <ArticleCode
            code={snippets.codex}
            language="toml"
            filename="~/.codex/config.toml"
          />
          <ArticleCode
            code={snippets.codexRun}
            language="bash"
            filename="terminal"
          />
          <ArticleP>{t("codex.p2")}</ArticleP>
        </ArticleSection>

        <ArticleSection
          id="claude-code"
          label={t("claudeCode.label")}
          title={t("claudeCode.title")}
          intro={t("claudeCode.intro")}
        >
          <ArticleP>{t("claudeCode.p1")}</ArticleP>
          <ArticleCode
            code={snippets.claudeCode}
            language="bash"
            filename="terminal"
          />
          <ArticleP>{t("claudeCode.p2", { appName })}</ArticleP>
          <Callout icon={AlertTriangle} tone="warning">
            {t("claudeCode.caveat")}
          </Callout>
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
              t("gotchas.modelId"),
              t("gotchas.paid"),
              t("gotchas.tools"),
              t("gotchas.bridgeKey", { appName }),
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
