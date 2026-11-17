/**
 * /llms.txt and /llms-full.txt (llmstxt.org): a Markdown map of the public
 * site for AI crawlers and assistants. Every number is read from its source
 * at request time (model registry + env availability, products, free-credit
 * constants, referral config), so the file never drifts from the pages.
 */

import { getEnvAvailability } from "next-vibe/agent/env-availability";
import {
  getAvailableChatModelCount,
  getAvailableChatModelCountsByContentLevel,
  getAvailableChatProviderCount,
} from "next-vibe/agent/models/all-models";
import {
  type CountryLanguage,
  defaultLocale,
} from "next-vibe/core/i18n/core/config";
import { formatCurrency } from "next-vibe/core/i18n/core/localization-utils";

import { buildPublicApiBaseUrl } from "@/api-keys/coding-tools";
import { GITHUB_REPO_URL } from "@/env/constants";
import { configScopedTranslation } from "@/env/i18n";
import {
  FREE_CREDIT_ALLOWANCE,
  FREE_CREDIT_MAX_TOTAL,
  FREE_CREDIT_SIGNED_IN_TOTAL,
} from "@/products/constants";
import { scopedTranslation as productsScopedTranslation } from "@/products/i18n";
import {
  getSubscriptionTiers,
  ProductIds,
  productsRepository,
} from "@/products/platform-products";
import { REFERRAL_CONFIG } from "@/referral/config";

import {
  formatTokenCount,
  listModelFacts,
  type ModelFacts,
  REFERENCE_INPUT_TOKENS,
  REFERENCE_OUTPUT_TOKENS,
} from "../../models/_shared/model-facts";
import { formatNumber, tierName } from "../../models/_shared/model-format";
import { listMediaFacts } from "../../models/_shared/model-media-facts";
import { listBlogPostCards } from "../../story/blog/posts-cards";
import { sitemapLocales } from "../sitemap.xml/build-sitemap";
import { scopedTranslation } from "./i18n";

export type LlmsTxtVariant = "short" | "full";

/** Locale a bare /llms.txt is written in: the generic English site. */
export function defaultLlmsLocale(): CountryLanguage {
  return (
    sitemapLocales().find((locale) => locale.endsWith("-GLOBAL")) ??
    defaultLocale
  );
}

/**
 * `?locale=de-DE` picks another site locale, `?locale=fr` (bare language,
 * any casing) the site locale of that language; anything else is ignored.
 */
export function resolveLlmsLocale(requested: string | null): CountryLanguage {
  const wanted = (requested ?? "").trim().replaceAll("_", "-").toLowerCase();
  if (!wanted) {
    return defaultLlmsLocale();
  }
  const locales = sitemapLocales();
  const exact = locales.find((locale) => locale.toLowerCase() === wanted);
  if (exact) {
    return exact;
  }
  const language = wanted.split("-")[0];
  const sameLanguage = locales.filter(
    (locale) => locale.split("-")[0] === language,
  );
  return (
    sameLanguage.find((locale) => locale.endsWith("-GLOBAL")) ??
    sameLanguage[0] ??
    defaultLlmsLocale()
  );
}

/** "$5.00" -> "$5", "5,00 €" -> "5 €". */
function wholePrice(formatted: string): string {
  return formatted.replace(/[.,]00(?=\D*$)/, "");
}

function link(label: string, url: string, description?: string): string {
  return description === undefined
    ? `- [${label}](${url})`
    : `- [${label}](${url}): ${description}`;
}

export async function buildLlmsTxt(
  locale: CountryLanguage,
  variant: LlmsTxtVariant,
): Promise<string> {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const { t: productT } = productsScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  const base = configT("websiteUrl").replace(/\/+$/, "");
  const page = (path: string, pageLocale: CountryLanguage = locale): string =>
    `${base}/${pageLocale}${path}`;

  const availability = await getEnvAvailability();
  const modelCount = getAvailableChatModelCount(false, availability);
  const providerCount = getAvailableChatProviderCount(false, availability);
  const tiers = getAvailableChatModelCountsByContentLevel(false, availability);
  const mediaModels = listMediaFacts(availability).filter(
    (model) => !model.isLegacy,
  );

  const products = productsRepository.getProducts(locale);
  const subscription = products[ProductIds.SUBSCRIPTION];
  const pack = products[ProductIds.CREDIT_PACK];
  const yearly = productsRepository.getProduct(
    ProductIds.SUBSCRIPTION,
    locale,
    "year",
  );
  const price = (amount: number, currency: typeof pack.currency): string =>
    wholePrice(formatCurrency(amount, currency, locale));

  const [enLocale, deLocale, plLocale, frLocale] = [
    defaultLlmsLocale(),
    sitemapLocales().find((l) => l.startsWith("de-")) ?? locale,
    sitemapLocales().find((l) => l.startsWith("pl-")) ?? locale,
    sitemapLocales().find((l) => l.startsWith("fr-")) ?? locale,
  ];

  const facts = [
    t("facts.models", {
      modelCount,
      providerCount,
      mainstream: tiers.mainstream,
      open: tiers.open,
      uncensored: tiers.uncensored,
      mediaCount: mediaModels.length,
    }),
    t("facts.free", {
      guest: FREE_CREDIT_ALLOWANCE.guest,
      signedIn: FREE_CREDIT_SIGNED_IN_TOTAL,
      max: FREE_CREDIT_MAX_TOTAL,
    }),
    t("facts.paid", {
      plans: getSubscriptionTiers(locale)
        .map((tier) =>
          t("facts.planItem", {
            name: productT(tier.name),
            price: tier.priceLabel,
            credits: tier.creditsLabel,
          }),
        )
        .join(", "),
      subYearPrice: price(yearly.price, yearly.currency),
      packPrice: price(pack.price, pack.currency),
      packCredits: pack.credits,
    }),
    t("facts.credit", {
      creditValue: formatCurrency(
        pack.price / pack.credits,
        pack.currency,
        locale,
      ),
    }),
    t("facts.api", {
      apiBaseUrl: buildPublicApiBaseUrl(base, locale),
      subPrice: price(subscription.price, subscription.currency),
    }),
    t("facts.uncensored"),
    t("facts.openSource", { repoUrl: GITHUB_REPO_URL }),
    t("facts.referral", {
      direct: Math.round(REFERRAL_CONFIG.DIRECT_PERCENTAGE * 100),
      upline: Math.round(REFERRAL_CONFIG.UPLINE_PERCENTAGE * 100),
      levels: REFERRAL_CONFIG.MAX_UPLINE_LEVELS,
      minPayout: wholePrice(
        formatCurrency(REFERRAL_CONFIG.MIN_PAYOUT_CENTS / 100, "USD", locale),
      ),
    }),
    t("facts.languages", {
      en: page("/story", enLocale),
      de: page("/story", deLocale),
      pl: page("/story", plLocale),
      fr: page("/story", frLocale),
    }),
  ];

  const pages = [
    link(t("pages.models"), page("/models"), t("pages.modelsDesc")),
    link(
      t("pages.pricing"),
      page("/subscription/overview"),
      t("pages.pricingDesc"),
    ),
    link(t("pages.api"), page("/docs/api"), t("pages.apiDesc")),
    link(t("pages.blog"), page("/story/blog"), t("pages.blogDesc")),
    link(t("pages.partners"), page("/story/partners"), t("pages.partnersDesc")),
    link(t("pages.earn"), page("/story/earn"), t("pages.earnDesc")),
    link(
      t("pages.selfHost"),
      page("/story/self-host"),
      t("pages.selfHostDesc"),
    ),
    link(
      t("pages.framework"),
      page("/story/framework"),
      t("pages.frameworkDesc", { appName }),
    ),
    link(
      t("pages.refusalIndex"),
      page("/story/refusal-index"),
      t("pages.refusalIndexDesc"),
    ),
    link(t("pages.skills"), page("/skills"), t("pages.skillsDesc")),
    link(t("pages.help"), page("/help"), t("pages.helpDesc")),
  ];

  const posts = listBlogPostCards(locale).map((card) =>
    link(card.title, page(card.path), card.excerpt),
  );

  const localeQuery = locale === defaultLlmsLocale() ? "" : `?locale=${locale}`;
  const optional = [
    ...(variant === "short"
      ? [
          link(
            t("optional.full"),
            `${base}/llms-full.txt${localeQuery}`,
            t("optional.fullDesc"),
          ),
        ]
      : []),
    link(
      t("optional.sitemap"),
      `${base}/sitemap.xml`,
      t("optional.sitemapDesc"),
    ),
    link(t("optional.about"), page("/story/about-us")),
    link(t("optional.privacy"), page("/story/privacy-policy")),
    link(t("optional.terms"), page("/story/terms-of-service")),
    link(t("optional.imprint"), page("/story/imprint")),
  ];

  const sections: string[] = [
    `# ${appName}`,
    `> ${t("summary", { appName, modelCount, providerCount })}`,
    t("intro"),
    `## ${t("facts.heading")}`,
    facts.map((fact) => `- ${fact}`).join("\n"),
    `## ${t("pages.heading")}`,
    pages.join("\n"),
    `## ${t("blog.heading")}`,
    posts.join("\n"),
  ];

  if (variant === "full") {
    const chatLink = (model: ModelFacts): string =>
      link(
        model.name.trim(),
        page(`/models/${model.slug}`),
        t("full.chatLine", {
          lab: model.labName,
          tier: tierName(model.content, locale),
          context: formatTokenCount(model.contextWindow),
          credits: formatNumber(model.creditsPerMessage, locale),
        }),
      );
    const allChat = listModelFacts(availability);
    const currentChat = allChat.filter((model) => !model.isLegacy);
    const legacyChat = allChat.filter((model) => model.isLegacy);
    const media = mediaModels.map((model) =>
      link(
        model.name.trim(),
        page(`/models/${model.slug}`),
        t("full.mediaLine", {
          lab: model.labName,
          type: t(`full.mediaTypes.${model.type}`),
        }),
      ),
    );
    sections.push(
      `## ${t("full.chatHeading")}`,
      t("full.chatIntro", {
        inputTokens: formatTokenCount(REFERENCE_INPUT_TOKENS),
        outputTokens: formatTokenCount(REFERENCE_OUTPUT_TOKENS),
      }),
      currentChat.map(chatLink).join("\n"),
      `### ${t("full.legacyHeading")}`,
      legacyChat
        .map((model) =>
          model.successor === null
            ? chatLink(model)
            : `${chatLink(model)}; ${t("full.legacySuccessor", { successor: model.successor.name.trim() })}`,
        )
        .join("\n"),
      `## ${t("full.mediaHeading")}`,
      media.join("\n"),
    );
  }

  sections.push(`## ${t("optional.heading")}`, optional.join("\n"));
  return `${sections.join("\n\n")}\n`;
}

/** Shared GET body for both root routes. */
export async function llmsTxtResponse(
  request: Request,
  variant: LlmsTxtVariant,
): Promise<Response> {
  const locale = resolveLlmsLocale(
    new URL(request.url).searchParams.get("locale"),
  );
  return new Response(await buildLlmsTxt(locale, variant), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
