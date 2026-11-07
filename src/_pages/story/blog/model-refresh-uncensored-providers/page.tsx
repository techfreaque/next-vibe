import type { Metadata } from "next";
import { getEnvAvailability } from "next-vibe/agent/env-availability";
import {
  ChatModelId,
  chatModelDefinitions,
} from "next-vibe/agent/ai-stream/models";
import {
  imageGenModelDefinitions,
  ImageGenModelId,
} from "next-vibe/agent/image-generation/models";
import {
  getAvailableModelCount,
  getAvailableModelCountsByContentLevel,
  type ModelCountsByContentLevel,
} from "next-vibe/agent/models/all-models";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Div } from "next-vibe/ui/components/div";
import { AlertTriangle } from "next-vibe/ui/components/icons/AlertTriangle";
import { Image } from "next-vibe/ui/components/icons/Image";
import { Layers } from "next-vibe/ui/components/icons/Layers";
import { MessageSquare } from "next-vibe/ui/components/icons/MessageSquare";
import { RefreshCw } from "next-vibe/ui/components/icons/RefreshCw";
import { Server } from "next-vibe/ui/components/icons/Server";
import { Shield } from "next-vibe/ui/components/icons/Shield";
import { Li } from "next-vibe/ui/components/li";
import { Span } from "next-vibe/ui/components/span";
import { H3, P } from "next-vibe/ui/components/typography";
import { Ul } from "next-vibe/ui/components/ul";
import type { IconComponent } from "next-vibe/ui/lib/helper";
import type { JSX } from "react";

import { configScopedTranslation } from "@/env/i18n";

import {
  ArticleBody,
  ArticleCode,
  ArticleEnd,
  ArticleH3,
  ArticleHeader,
  ArticleLead,
  ArticleP,
  ArticleSection,
} from "../../_shared/article";
import {
  Callout,
  Cta,
  FeatureCard,
  FeatureGrid,
} from "../../_shared/marketing";
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
    path: "story/blog/model-refresh-uncensored-providers",
    title: t("meta.title", { appName }),
    category: t("meta.category"),
    description: t("meta.description"),
    image:
      "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?q=80&w=2070",
    imageAlt: t("meta.imageAlt", { appName }),
    keywords: [t("meta.keywords", { appName })],
  });
};

/** Model families shown in the lineup grid - names come from the registry. */
const LINEUP = {
  claude: [
    ChatModelId.CLAUDE_OPUS_5_5,
    ChatModelId.CLAUDE_SONNET_5_5,
    ChatModelId.CLAUDE_HAIKU_5_5,
    ChatModelId.CLAUDE_FABLE_5_1,
  ],
  gpt: [
    ChatModelId.GPT_6_ASTRA,
    ChatModelId.GPT_6_1_SOL,
    ChatModelId.GPT_6_1_TERRA,
    ChatModelId.GPT_6_LUNA,
  ],
  gemini: [ChatModelId.GEMINI_4_ARGON, ChatModelId.GEMINI_3_8_FLASH],
  grok: [ChatModelId.GROK_4_7],
  openModels: [
    ChatModelId.KIMI_K3_1_PRO,
    ChatModelId.KIMI_K3,
    ChatModelId.DEEPSEEK_V4_1_FLASH,
    ChatModelId.GLM_5_3,
    ChatModelId.GLM_5_3_FLASH,
    ChatModelId.MINIMAX_M3,
  ],
} as const;

const VENICE_LINEUP = [
  ChatModelId.VENICE_UNCENSORED_ROLEPLAY,
  ChatModelId.GEMMA_4_UNCENSORED,
  ChatModelId.QWEN_3_6_PLUS_UNCENSORED,
  ChatModelId.GLM_4_7_FLASH_HERETIC,
  ChatModelId.GLM_5_3_ABLITERATED,
  ChatModelId.VENICE_DEEPSEEK_V4_1_FLASH_UNCENSORED,
] as const;

/** Real successor-map entries, shown verbatim in the pros section. */
const SUCCESSOR_EXAMPLES = [
  [ChatModelId.CLAUDE_OPUS_4_6, ChatModelId.CLAUDE_OPUS_5_5],
  [ChatModelId.GPT_5_5, ChatModelId.GPT_6_1_SOL],
  [ChatModelId.GEMINI_3_FLASH, ChatModelId.GEMINI_3_8_FLASH],
  [ChatModelId.GROK_4, ChatModelId.GROK_4_7],
  [ChatModelId.GLM_5_2, ChatModelId.GLM_5_3],
] as const;

type FamilyKey = keyof typeof LINEUP;

const FAMILY_KEYS: readonly FamilyKey[] = [
  "claude",
  "gpt",
  "gemini",
  "grok",
  "openModels",
];

function modelName(id: ChatModelId): string {
  return chatModelDefinitions[id].name;
}

export interface ModelRefreshPageData {
  locale: CountryLanguage;
  modelCount: number;
  counts: ModelCountsByContentLevel;
}

export async function tanstackLoader({
  params,
}: Props): Promise<ModelRefreshPageData> {
  const { locale } = await params;
  const availability = await getEnvAvailability();
  return {
    locale,
    modelCount: getAvailableModelCount(false, availability),
    counts: getAvailableModelCountsByContentLevel(false, availability),
  };
}

function ModelChips({ names }: { names: readonly string[] }): JSX.Element {
  return (
    <Ul className="mt-4 flex flex-wrap gap-2">
      {names.map((name) => (
        <Li
          key={name}
          className="rounded-md border border-border bg-muted px-2 py-1 text-xs font-medium text-foreground"
        >
          {name}
        </Li>
      ))}
    </Ul>
  );
}

function LevelCard({
  title,
  body,
  count,
  tone,
}: {
  title: string;
  body: string;
  count: string;
  tone: "mainstream" | "open" | "uncensored";
}): JSX.Element {
  const dot =
    tone === "mainstream"
      ? "bg-primary"
      : tone === "open"
        ? "bg-warning"
        : "bg-destructive";
  return (
    <Div className="flex min-w-0 flex-col rounded-xl border border-border bg-card p-5">
      <Div className="flex items-center gap-2">
        <Span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
        <H3 className="text-base font-semibold">{title}</H3>
      </Div>
      <P className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {body}
      </P>
      <Span className="mt-3 text-sm font-semibold tabular-nums text-foreground">
        {count}
      </Span>
    </Div>
  );
}

function ProviderBlock({
  icon: Icon,
  title,
  children,
}: {
  icon: IconComponent;
  title: string;
  children: JSX.Element | JSX.Element[];
}): JSX.Element {
  return (
    <Div className="min-w-0 rounded-xl border border-border bg-card p-5 md:p-6">
      <Div className="flex items-center gap-3">
        <Div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </Div>
        <H3 className="text-lg font-semibold tracking-tight">{title}</H3>
      </Div>
      <Div className="mt-3">{children}</Div>
    </Div>
  );
}

export function TanstackPage({
  locale,
  modelCount,
  counts,
}: ModelRefreshPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const back = { href: `/${locale}/story/blog`, label: t("hero.backToBlog") };

  const familyMeta: Record<FamilyKey, { title: string; note: string }> = {
    claude: { title: t("lineup.claude"), note: t("lineup.claudeNote") },
    gpt: { title: t("lineup.gpt"), note: t("lineup.gptNote") },
    gemini: { title: t("lineup.gemini"), note: t("lineup.geminiNote") },
    grok: { title: t("lineup.grok"), note: t("lineup.grokNote") },
    openModels: {
      title: t("lineup.openModels"),
      note: t("lineup.openModelsNote"),
    },
  };

  const abliterated = modelName(ChatModelId.GLM_5_3_ABLITERATED);
  const successorCode = SUCCESSOR_EXAMPLES.map(
    ([from, to]) => `${modelName(from)}  →  ${modelName(to)}`,
  ).join("\n");

  return (
    <Div className="min-h-screen bg-background">
      <ArticleHeader
        back={back}
        category={t("hero.category")}
        readTime={t("hero.readTime")}
        date={formatPostDate("model-refresh-uncensored-providers", locale)}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
      />

      <ArticleBody>
        <Div className="flex flex-col gap-5">
          <ArticleLead>
            {t("intro.lead", {
              modelCount,
              uncensoredCount: counts.uncensored,
            })}
          </ArticleLead>
          <ArticleP>{t("intro.p2")}</ArticleP>
        </Div>

        <ArticleSection title={t("filter.title")} intro={t("filter.intro")}>
          <ArticleP>{t("filter.p1")}</ArticleP>
          <Div className="grid gap-3 sm:grid-cols-3">
            <LevelCard
              tone="mainstream"
              title={t("filter.mainstream")}
              body={t("filter.mainstreamBody")}
              count={t("filter.countLabel", { count: counts.mainstream })}
            />
            <LevelCard
              tone="open"
              title={t("filter.open")}
              body={t("filter.openBody")}
              count={t("filter.countLabel", { count: counts.open })}
            />
            <LevelCard
              tone="uncensored"
              title={t("filter.uncensored")}
              body={t("filter.uncensoredBody")}
              count={t("filter.countLabel", { count: counts.uncensored })}
            />
          </Div>
          <ArticleP>{t("filter.p2")}</ArticleP>
        </ArticleSection>

        <ArticleSection title={t("lineup.title")} intro={t("lineup.intro")}>
          <FeatureGrid columns={2}>
            {FAMILY_KEYS.map((key) => (
              <FeatureCard
                key={key}
                icon={Layers}
                title={familyMeta[key].title}
              >
                {familyMeta[key].note}
                <ModelChips names={LINEUP[key].map(modelName)} />
              </FeatureCard>
            ))}
          </FeatureGrid>
        </ArticleSection>

        <ArticleSection
          title={t("uncensored.title")}
          intro={t("uncensored.intro")}
        >
          <ProviderBlock icon={Shield} title={t("uncensored.veniceTitle")}>
            <P className="text-sm leading-relaxed text-muted-foreground md:text-base">
              {t("uncensored.veniceBody", {
                veniceModel: modelName(ChatModelId.VENICE_UNCENSORED),
              })}
            </P>
            <ModelChips names={VENICE_LINEUP.map(modelName)} />
          </ProviderBlock>
          <ProviderBlock icon={Server} title={t("uncensored.nanoTitle")}>
            <P className="text-sm leading-relaxed text-muted-foreground md:text-base">
              {t("uncensored.nanoBody", {
                glm: modelName(ChatModelId.GLM_5_3_UNCENSORED),
                glmFlash: modelName(ChatModelId.GLM_5_3_FLASH_UNCENSORED),
                deepseek: modelName(
                  ChatModelId.VENICE_DEEPSEEK_V4_1_FLASH_UNCENSORED,
                ),
                abliterated,
                deepseekAbliterated: modelName(
                  ChatModelId.DEEPSEEK_V4_1_FLASH_ABLITERATED,
                ),
                mimoAbliterated: modelName(
                  ChatModelId.MIMO_V2_6_FLASH_ABLITERATED,
                ),
              })}
            </P>
          </ProviderBlock>
          <ProviderBlock icon={Image} title={t("uncensored.imagesTitle")}>
            <P className="text-sm leading-relaxed text-muted-foreground md:text-base">
              {t("uncensored.imagesBody", {
                lustify:
                  imageGenModelDefinitions[ImageGenModelId.LUSTIFY_V8].name,
                chroma: imageGenModelDefinitions[ImageGenModelId.CHROMA].name,
              })}
            </P>
          </ProviderBlock>
          <Callout icon={AlertTriangle} tone="warning">
            {t("uncensored.warning", { abliterated })}
          </Callout>
        </ArticleSection>

        <ArticleSection
          title={t("underTheHood.title")}
          intro={t("underTheHood.intro")}
        >
          <ArticleH3>{t("underTheHood.successorsTitle")}</ArticleH3>
          <ArticleP>{t("underTheHood.successorsBody")}</ArticleP>
          <ArticleCode
            code={successorCode}
            language="text"
            filename="chatModelSuccessors"
          />
          <ArticleH3>{t("underTheHood.pricesTitle")}</ArticleH3>
          <ArticleP>{t("underTheHood.pricesBody")}</ArticleP>
          <ArticleH3>{t("underTheHood.toolsTitle")}</ArticleH3>
          <ArticleP>{t("underTheHood.toolsBody")}</ArticleP>
        </ArticleSection>

        <ArticleEnd
          back={back}
          title={t("cta.title")}
          subtitle={t("cta.subtitle")}
          actions={
            <>
              <Cta
                href={`/${locale}/threads`}
                label={t("cta.chat")}
                icon={MessageSquare}
              />
              <Cta
                href={`/${locale}/tools/models`}
                label={t("cta.models")}
                icon={RefreshCw}
                variant="secondary"
              />
            </>
          }
        />
      </ArticleBody>
    </Div>
  );
}

export default async function ModelRefreshPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
