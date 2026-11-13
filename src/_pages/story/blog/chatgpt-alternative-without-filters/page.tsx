/**
 * Blog post: a ChatGPT alternative without filters, honestly explained.
 * /[locale]/story/blog/chatgpt-alternative-without-filters
 *
 * Model names, ids and slugs come from the registry. Model counts come from
 * env availability (site-wide source of truth), prices and free credits from
 * the products catalog. Nothing numeric is hardcoded in copy.
 */

import type { Metadata } from "next";
import {
  ChatModelId,
  chatModelDefinitions,
} from "next-vibe/agent/ai-stream/models";
import { getEnvAvailability } from "next-vibe/agent/env-availability";
import {
  getAvailableChatModelCount,
  getAvailableChatModelCountsByContentLevel,
  type ModelCountsByContentLevel,
} from "next-vibe/agent/models/all-models";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { formatCurrency } from "next-vibe/core/i18n/core/localization-utils";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Div } from "next-vibe/ui/components/div";
import { AlertTriangle } from "next-vibe/ui/components/icons/AlertTriangle";
import { EyeOff } from "next-vibe/ui/components/icons/EyeOff";
import { MessageSquare } from "next-vibe/ui/components/icons/MessageSquare";
import { Scale } from "next-vibe/ui/components/icons/Scale";
import { Wallet } from "next-vibe/ui/components/icons/Wallet";
import { Link } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import type { JSX } from "react";

import { toModelSlug } from "@/_pages/models/_shared/model-facts";
import { configScopedTranslation } from "@/env/i18n";
import {
  FREE_CREDIT_ALLOWANCE,
  FREE_CREDIT_SIGNED_IN_TOTAL,
} from "@/products/constants";
import { ProductIds, productsRepository } from "@/products/platform-products";

import {
  ArticleBody,
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
import { formatPostDate } from "../posts-meta";
import { scopedTranslation } from "./i18n";

export const revalidate = 3600;

const SLUG = "chatgpt-alternative-without-filters";

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
  const modelCount = getAvailableChatModelCount(
    false,
    await getEnvAvailability(),
  );
  return metadataGenerator(locale, {
    path: `story/blog/${SLUG}`,
    title: t("meta.title", { appName }),
    category: t("meta.category"),
    description: t("meta.description", { appName, modelCount }),
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070",
    imageAlt: t("meta.imageAlt", { appName }),
    keywords: [t("meta.keywords", { appName })],
  });
};

type PickGroup =
  | "builtUncensored"
  | "everyday"
  | "open"
  | "unfiltered"
  | "fiction"
  | "cheap";

/**
 * Model picks per job. All public, enabled, non-admin models.
 * Ids, names and page slugs are read from the registry.
 */
const PICKS: readonly { key: PickGroup; models: readonly ChatModelId[] }[] = [
  {
    key: "builtUncensored",
    models: [ChatModelId.UNCENSORED_LM_V1_2],
  },
  {
    key: "everyday",
    models: [
      ChatModelId.CLAUDE_SONNET_5_5,
      ChatModelId.GPT_6_1_SOL,
      ChatModelId.GEMINI_4_ARGON,
    ],
  },
  {
    key: "open",
    models: [
      ChatModelId.KIMI_K3_1_PRO,
      ChatModelId.DEEPSEEK_V4_PRO,
      ChatModelId.GROK_4_7,
      ChatModelId.GLM_5_3,
    ],
  },
  {
    key: "unfiltered",
    models: [
      ChatModelId.GLM_5_3_UNCENSORED,
      ChatModelId.QWEN_3_6_PLUS_UNCENSORED,
    ],
  },
  {
    key: "fiction",
    models: [
      ChatModelId.VENICE_UNCENSORED,
      ChatModelId.VENICE_UNCENSORED_ROLEPLAY,
    ],
  },
  {
    key: "cheap",
    models: [
      ChatModelId.GLM_5_3_FLASH_UNCENSORED,
      ChatModelId.VENICE_DEEPSEEK_V4_1_FLASH_UNCENSORED,
      ChatModelId.GEMMA_4_UNCENSORED,
      ChatModelId.CLAUDE_HAIKU_5_5,
    ],
  },
];

/**
 * Side-by-side pairs worth a look: the built-uncensored model against
 * ChatGPT's model and a refusal-stripped flagship, then a mainstream pick vs
 * its unfiltered rival. Same URL order as the sitemap (FEATURED_COMPARISON_PAIRS).
 */
const COMPARE_PAIRS: readonly (readonly [ChatModelId, ChatModelId])[] = [
  [ChatModelId.UNCENSORED_LM_V1_2, ChatModelId.GPT_6_1_SOL],
  [ChatModelId.UNCENSORED_LM_V1_2, ChatModelId.GLM_5_3_UNCENSORED],
  [ChatModelId.CLAUDE_SONNET_5_5, ChatModelId.GLM_5_3_UNCENSORED],
  [ChatModelId.GPT_6_1_SOL, ChatModelId.KIMI_K3_1_PRO],
];

const FAQ_KEYS: readonly ("free" | "account" | "api" | "openSource")[] = [
  "free",
  "account",
  "api",
  "openSource",
];

export interface ChatgptAlternativePostPageData {
  locale: CountryLanguage;
  modelCount: number;
  tierCounts: ModelCountsByContentLevel;
  subPrice: string;
  subCredits: number;
  packPrice: string;
  packCredits: number;
}

export async function tanstackLoader({
  params,
}: Props): Promise<ChatgptAlternativePostPageData> {
  const { locale } = await params;
  const availability = await getEnvAvailability();
  const products = productsRepository.getProducts(locale);
  const subscription = products[ProductIds.SUBSCRIPTION];
  const pack = products[ProductIds.CREDIT_PACK];
  return {
    locale,
    modelCount: getAvailableChatModelCount(false, availability),
    tierCounts: getAvailableChatModelCountsByContentLevel(false, availability),
    subPrice: formatCurrency(subscription.price, subscription.currency, locale),
    subCredits: subscription.credits,
    packPrice: formatCurrency(pack.price, pack.currency, locale),
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

export function TanstackPage({
  locale,
  modelCount,
  tierCounts,
  subPrice,
  subCredits,
  packPrice,
  packCredits,
}: ChatgptAlternativePostPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  const back = { href: `/${locale}/story/blog`, label: t("hero.backToBlog") };
  const prices = {
    guestCredits: FREE_CREDIT_ALLOWANCE.guest,
    freeCredits: FREE_CREDIT_SIGNED_IN_TOTAL,
    subPrice,
    subCredits,
    packPrice,
    packCredits,
  };

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
          <ArticleP>{t("intro.p2", { appName, modelCount })}</ArticleP>
        </Div>

        <ArticleSection title={t("exists.title")}>
          <ArticleP>{t("exists.p1")}</ArticleP>
          <ArticleP>{t("exists.p2", { appName })}</ArticleP>
        </ArticleSection>

        <ArticleSection title={t("tiers.title")} intro={t("tiers.intro")}>
          <ArticleList
            items={[
              t("tiers.mainstream", { count: tierCounts.mainstream }),
              t("tiers.open", { count: tierCounts.open }),
              t("tiers.uncensored", { count: tierCounts.uncensored }),
            ]}
          />
          <Callout icon={AlertTriangle} tone="warning">
            {t("tiers.vendorRefusals", { appName })}
          </Callout>
          <ArticleP>{t("tiers.twoKinds")}</ArticleP>
          <CardLink href={`/${locale}/models`} label={t("tiers.modelsLink")} />
        </ArticleSection>

        <ArticleSection title={t("switch.title")} intro={t("switch.intro")}>
          <ArticleP>{t("switch.p1")}</ArticleP>
          <ArticleP>{t("switch.p2")}</ArticleP>
          <Callout icon={Scale} tone="neutral">
            {t("switch.caveat")}
          </Callout>
        </ArticleSection>

        <ArticleSection title={t("picks.title")} intro={t("picks.intro")}>
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
              href={`/${locale}/story/blog/uncensored-models-what-each-is-good-at`}
              label={t("picks.guideLink")}
            />
          </Div>
        </ArticleSection>

        <ArticleSection title={t("privacy.title")} intro={t("privacy.intro")}>
          <ArticleList
            items={[
              t("privacy.incognito"),
              t("privacy.transit"),
              t("privacy.memory"),
              t("privacy.private"),
            ]}
          />
          <Callout icon={EyeOff} tone="neutral">
            {t("privacy.callout")}
          </Callout>
        </ArticleSection>

        <ArticleSection title={t("pricing.title")} intro={t("pricing.intro")}>
          <ArticleList
            items={[
              t("pricing.free", prices),
              t("pricing.sub", prices),
              t("pricing.pack", prices),
              t("pricing.oneBalance"),
              t("pricing.metered"),
            ]}
          />
          <CardLink
            href={`/${locale}/subscription`}
            label={t("pricing.link")}
          />
        </ArticleSection>

        <ArticleSection
          title={t("chatgptBetter.title")}
          intro={t("chatgptBetter.intro")}
        >
          <ArticleList
            items={[
              t("chatgptBetter.oneVendor"),
              t("chatgptBetter.flatRate"),
              t("chatgptBetter.firstFeatures"),
              t("chatgptBetter.wantFilter"),
            ]}
          />
        </ArticleSection>

        <ArticleSection title={t("limits.title")} intro={t("limits.intro")}>
          <ArticleList
            items={[
              t("limits.smaller"),
              t("limits.tools"),
              t("limits.vendor"),
              t("limits.responsibility"),
            ]}
          />
        </ArticleSection>

        <ArticleSection title={t("faq.title")}>
          {FAQ_KEYS.map((key) => (
            <Div key={key} className="flex flex-col gap-2">
              <ArticleH3>{t(`faq.${key}.q`, { appName })}</ArticleH3>
              <ArticleP>{t(`faq.${key}.a`, { ...prices, appName })}</ArticleP>
            </Div>
          ))}
          <Div className="flex flex-col">
            <CardLink
              href={`/${locale}/story/blog/unbottled-api-in-coding-tools`}
              label={t("faq.apiLink")}
            />
            <CardLink
              href={`/${locale}/story/self-host`}
              label={t("faq.selfHostLink")}
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
          subtitle={t("cta.subtitle", prices)}
          actions={
            <>
              <Cta
                href={`/${locale}/threads/incognito`}
                label={t("cta.chat")}
                icon={MessageSquare}
              />
              <Cta
                href={`/${locale}/models`}
                label={t("cta.models")}
                icon={Scale}
                variant="secondary"
              />
            </>
          }
        />
      </ArticleBody>
    </Div>
  );
}

export default async function ChatgptAlternativePostPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
