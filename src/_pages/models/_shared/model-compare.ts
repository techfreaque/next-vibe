/**
 * Registry-derived content for the public compare pages
 * (/models/compare/<a>/<b>): "pick A if / pick B if" verdicts, the visible
 * FAQ, more comparisons for each model and related posts.
 *
 * Pure + static + server-safe, like model-seo.ts. Every sentence comes from
 * registry fields (price, context, tier, uncensored method, intelligence,
 * strengths, inputs, outputs, tools, legacy state). A difference only becomes
 * a verdict reason when the data shows it; two models that look the same on
 * paper get no invented edge (see CompareVerdict.similar).
 */

import type { AgentEnvAvailability } from "next-vibe/agent/env-availability";
import { ModelUtility } from "next-vibe/agent/models/enum";
import { CHAT_MESSAGE_PRICE_REFERENCE } from "next-vibe/agent/models/models";
import {
  ContentLevel,
  type ContentLevelValue,
  IntelligenceLevel,
  type IntelligenceLevelValue,
} from "next-vibe/agent/skills/enum";
import { scopedTranslation as skillsScopedTranslation } from "next-vibe/agent/skills/i18n";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";

import { configScopedTranslation } from "@/env/i18n";

import type { FaqItem } from "../../_components/faq-structured-data";
import type { BlogPostSlug } from "../../story/blog/posts-meta";
import { scopedTranslation } from "../i18n";
import {
  canonicalComparisonPath,
  type ModelFacts,
  type ModelRef,
  suggestComparisons,
} from "./model-facts";
import {
  formatMoney,
  formatNumber,
  isApiCallable,
  modalityList,
  strengthList,
  tierName,
  uncensoredKind,
} from "./model-format";
import {
  apiAnswer,
  chatModelBlogSlugs,
  chatModelLanding,
  type ModelLandingKey,
  uncensoredAnswer,
} from "./model-seo";

type ModelsT = ReturnType<typeof scopedTranslation.scopedT>["t"];

/** Ratios under this read as "about the same". */
export const SAME_RATIO = 1.1;
/** Reasons shown per side; the strongest come first. */
const MAX_REASONS = 5;
/** Other comparisons listed per model. */
const MORE_COMPARISONS = 3;
/** Read-more cards on a compare page. */
const MAX_BLOG_LINKS = 3;

const INTELLIGENCE_RANK: Record<typeof IntelligenceLevelValue, number> = {
  [IntelligenceLevel.QUICK]: 0,
  [IntelligenceLevel.SMART]: 1,
  [IntelligenceLevel.BRILLIANT]: 2,
};

/** Fewer filters = higher. */
const FREEDOM_RANK: Record<typeof ContentLevelValue, number> = {
  [ContentLevel.MAINSTREAM]: 0,
  [ContentLevel.OPEN]: 1,
  [ContentLevel.UNCENSORED]: 2,
};

/** Strengths that can tip a pick (speed has its own reason). */
const PICK_STRENGTHS = [
  ModelUtility.CODING,
  ModelUtility.REASONING,
  ModelUtility.ANALYSIS,
  ModelUtility.CREATIVE,
  ModelUtility.ROLEPLAY,
  ModelUtility.ROLEPLAY_DARK,
] as const;

/** high / low, or +Infinity when the low side is free (or both are 0). */
export function priceRatio(a: number, b: number): number {
  const low = Math.min(a, b);
  const high = Math.max(a, b);
  if (high <= 0) {
    return 1;
  }
  return low <= 0 ? Number.POSITIVE_INFINITY : high / low;
}

function oneDecimal(value: number, locale: CountryLanguage): string {
  return formatNumber(Math.round(value * 10) / 10, locale);
}

function onlyIn<T>(mine: readonly T[], theirs: readonly T[]): T[] {
  return mine.filter((item) => !theirs.includes(item));
}

// ─── Verdict ─────────────────────────────────────────────────────────────────

export interface CompareVerdict {
  /** One-line headline facts for the hero (price, context, tier). */
  headline: string[];
  /** "Pick <left> if…" reasons. */
  left: string[];
  /** "Pick <right> if…" reasons. */
  right: string[];
  /** Neither side has a fact-based edge: render one honest note, no lists. */
  similar: boolean;
}

function headlineLines(
  left: ModelFacts,
  right: ModelFacts,
  locale: CountryLanguage,
  t: ModelsT,
): string[] {
  const lines: string[] = [];
  const price = priceRatio(left.creditsPerMessage, right.creditsPerMessage);
  if (price < SAME_RATIO) {
    lines.push(t("compare.samePrice"));
  } else {
    const cheaper =
      left.creditsPerMessage < right.creditsPerMessage ? left : right;
    lines.push(
      Number.isFinite(price)
        ? t("compare.cheaper", {
            model: cheaper.name,
            times: oneDecimal(price, locale),
          })
        : t("compare.cheaperFree", { model: cheaper.name }),
    );
  }
  const context = priceRatio(left.contextWindow, right.contextWindow);
  if (context < SAME_RATIO) {
    lines.push(t("compare.sameContext"));
  } else {
    const bigger = left.contextWindow > right.contextWindow ? left : right;
    lines.push(
      t("compare.biggerContext", {
        model: bigger.name,
        times: oneDecimal(context, locale),
      }),
    );
  }
  if (left.content !== right.content) {
    const freer =
      FREEDOM_RANK[left.content] > FREEDOM_RANK[right.content] ? left : right;
    const other = freer === left ? right : left;
    lines.push(
      t("compare.tierLine", {
        model: freer.name,
        tier: tierName(freer.content, locale),
        other: other.name,
        otherTier: tierName(other.content, locale),
      }),
    );
  }
  return lines;
}

function isFast(facts: ModelFacts): boolean {
  return facts.strengths.some((strength) => strength === ModelUtility.FAST);
}

/** Why someone would pick `self` over `other`, strongest reason first. */
function pickReasons(
  self: ModelFacts,
  other: ModelFacts,
  locale: CountryLanguage,
  t: ModelsT,
): string[] {
  const { t: skillsT } = skillsScopedTranslation.scopedT(locale);
  const reasons: string[] = [];

  const price = priceRatio(self.creditsPerMessage, other.creditsPerMessage);
  if (price >= SAME_RATIO && self.creditsPerMessage < other.creditsPerMessage) {
    reasons.push(
      Number.isFinite(price)
        ? t("compare.pick.cheaper", {
            money: formatMoney(self.creditsPerMessage, locale),
            otherMoney: formatMoney(other.creditsPerMessage, locale),
            times: oneDecimal(price, locale),
          })
        : t("compare.pick.free"),
    );
  }

  const context = priceRatio(self.contextWindow, other.contextWindow);
  if (context >= SAME_RATIO && self.contextWindow > other.contextWindow) {
    reasons.push(
      t("compare.pick.context", {
        tokens: formatNumber(self.contextWindow, locale),
        pages: formatNumber(self.contextPages, locale),
        otherTokens: formatNumber(other.contextWindow, locale),
      }),
    );
  }

  const selfKind = uncensoredKind(self);
  const otherKind = uncensoredKind(other);
  if (FREEDOM_RANK[self.content] > FREEDOM_RANK[other.content]) {
    reasons.push(
      t("compare.pick.lessFiltered", {
        tier: tierName(self.content, locale),
        otherTier: tierName(other.content, locale),
      }),
    );
  } else if (
    self.content === ContentLevel.MAINSTREAM &&
    other.content !== ContentLevel.MAINSTREAM
  ) {
    reasons.push(t("compare.pick.mainstream", { lab: self.labName }));
  }
  if (selfKind !== null && selfKind !== "unlisted" && selfKind !== otherKind) {
    reasons.push(t(`compare.pick.kind.${selfKind}`));
  }

  const selfRank = INTELLIGENCE_RANK[self.intelligence];
  const otherRank = INTELLIGENCE_RANK[other.intelligence];
  if (selfRank > otherRank) {
    reasons.push(
      t("compare.pick.smarter", {
        level: skillsT(self.intelligence),
        otherLevel: skillsT(other.intelligence),
      }),
    );
  }

  if (isFast(self) && !isFast(other)) {
    reasons.push(t("compare.pick.fast"));
  }

  const strengths = PICK_STRENGTHS.filter(
    (utility) =>
      self.strengths.some((strength) => strength === utility) &&
      !other.strengths.some((strength) => strength === utility),
  );
  if (strengths.length > 0) {
    reasons.push(
      t("compare.pick.strengths", {
        list: strengthList({ ...self, strengths: [...strengths] }, t),
        other: other.name,
      }),
    );
  }

  const inputs = onlyIn(self.inputs, other.inputs);
  if (inputs.length > 0) {
    reasons.push(
      t("compare.pick.inputs", {
        list: modalityList(inputs, t),
        other: other.name,
      }),
    );
  }
  if (self.outputs.includes("image") && !other.outputs.includes("image")) {
    reasons.push(t("compare.pick.imageOutput"));
  }
  if (self.supportsTools && !other.supportsTools) {
    reasons.push(t("compare.pick.tools", { other: other.name }));
  }
  if (!self.isLegacy && other.isLegacy) {
    reasons.push(t("compare.pick.current", { other: other.name }));
  }
  return reasons.slice(0, MAX_REASONS);
}

export function compareVerdict(
  left: ModelFacts,
  right: ModelFacts,
  locale: CountryLanguage,
): CompareVerdict {
  const { t } = scopedTranslation.scopedT(locale);
  const leftReasons = pickReasons(left, right, locale, t);
  const rightReasons = pickReasons(right, left, locale, t);
  return {
    headline: headlineLines(left, right, locale, t),
    left: leftReasons,
    right: rightReasons,
    similar: leftReasons.length === 0 && rightReasons.length === 0,
  };
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

/**
 * One sentence per model, or a single sentence naming both when the facts
 * behind it are identical (no near-duplicate lines on look-alike pairs).
 * `render` must take the model name only from its `name` argument.
 */
function perModel(
  left: ModelFacts,
  right: ModelFacts,
  t: ModelsT,
  render: (facts: ModelFacts, name: string) => string,
): string[] {
  const probe = "\u0000";
  if (render(left, probe) === render(right, probe)) {
    return [render(left, t("compare.both", { a: left.name, b: right.name }))];
  }
  return [render(left, left.name), render(right, right.name)];
}

function priceRates(
  facts: ModelFacts,
  name: string,
  locale: CountryLanguage,
  t: ModelsT,
): string {
  if (facts.creditsPerMessage <= 0) {
    return t("faq.price.aFree", { model: name });
  }
  return facts.tokenPrice === null
    ? t("compareFaq.cheaper.fixed", {
        model: name,
        provider: facts.priceProvider,
      })
    : t("compareFaq.cheaper.rates", {
        model: name,
        provider: facts.priceProvider,
        input: formatMoney(facts.tokenPrice.inputCredits, locale),
        output: formatMoney(facts.tokenPrice.outputCredits, locale),
      });
}

function cheaperAnswer(
  left: ModelFacts,
  right: ModelFacts,
  locale: CountryLanguage,
  t: ModelsT,
): string {
  const price = priceRatio(left.creditsPerMessage, right.creditsPerMessage);
  const cheap =
    left.creditsPerMessage <= right.creditsPerMessage ? left : right;
  const dear = cheap === left ? right : left;
  const vars = {
    a: left.name,
    b: right.name,
    creditsA: formatNumber(left.creditsPerMessage, locale),
    moneyA: formatMoney(left.creditsPerMessage, locale),
    creditsB: formatNumber(right.creditsPerMessage, locale),
    moneyB: formatMoney(right.creditsPerMessage, locale),
    cheap: cheap.name,
    dear: dear.name,
    cheapCredits: formatNumber(cheap.creditsPerMessage, locale),
    cheapMoney: formatMoney(cheap.creditsPerMessage, locale),
    dearCredits: formatNumber(dear.creditsPerMessage, locale),
    dearMoney: formatMoney(dear.creditsPerMessage, locale),
    times: Number.isFinite(price) ? oneDecimal(price, locale) : "",
  };
  const lead =
    price < SAME_RATIO
      ? t("compareFaq.cheaper.same", vars)
      : Number.isFinite(price)
        ? t("compareFaq.cheaper.diff", vars)
        : t("compareFaq.cheaper.diffFree", vars);
  const usesTokens = left.tokenPrice !== null || right.tokenPrice !== null;
  const reference = usesTokens
    ? t("compareFaq.cheaper.reference", {
        input: formatNumber(CHAT_MESSAGE_PRICE_REFERENCE.inputTokens, locale),
        output: formatNumber(CHAT_MESSAGE_PRICE_REFERENCE.outputTokens, locale),
      })
    : "";
  return [
    lead,
    reference,
    ...perModel(left, right, t, (facts, name) =>
      priceRates(facts, name, locale, t),
    ),
    t("compareFaq.cheaper.credit", { value: formatMoney(1, locale) }),
  ]
    .filter((part) => part.length > 0)
    .join(" ");
}

function contextAnswer(
  left: ModelFacts,
  right: ModelFacts,
  locale: CountryLanguage,
  t: ModelsT,
): string {
  const ratio = priceRatio(left.contextWindow, right.contextWindow);
  const big = left.contextWindow >= right.contextWindow ? left : right;
  const small = big === left ? right : left;
  const vars = {
    big: big.name,
    small: small.name,
    bigTokens: formatNumber(big.contextWindow, locale),
    bigPages: formatNumber(big.contextPages, locale),
    smallTokens: formatNumber(small.contextWindow, locale),
    smallPages: formatNumber(small.contextPages, locale),
    times: oneDecimal(ratio, locale),
  };
  if (left.contextWindow === right.contextWindow) {
    return t("compareFaq.context.equal", vars);
  }
  return ratio < SAME_RATIO
    ? t("compareFaq.context.same", vars)
    : t("compareFaq.context.diff", vars);
}

function smarterAnswer(
  left: ModelFacts,
  right: ModelFacts,
  locale: CountryLanguage,
  t: ModelsT,
): string {
  const { t: skillsT } = skillsScopedTranslation.scopedT(locale);
  const leftRank = INTELLIGENCE_RANK[left.intelligence];
  const rightRank = INTELLIGENCE_RANK[right.intelligence];
  const higher = leftRank >= rightRank ? left : right;
  const lower = higher === left ? right : left;
  const lead =
    leftRank === rightRank
      ? t("compareFaq.smarter.same", {
          level: skillsT(left.intelligence),
        })
      : t("compareFaq.smarter.diff", {
          model: higher.name,
          level: skillsT(higher.intelligence),
          other: lower.name,
          otherLevel: skillsT(lower.intelligence),
        });
  const leftList = strengthList(left, t);
  const rightList = strengthList(right, t);
  const known =
    leftList === rightList
      ? [
          leftList.length > 0
            ? t("compareFaq.smarter.knownBoth", { list: leftList })
            : "",
        ]
      : [left, right].map((facts) => {
          const list = strengthList(facts, t);
          return list.length > 0
            ? t("compareFaq.smarter.known", { model: facts.name, list })
            : "";
        });
  return [lead, ...known, t("compareFaq.smarter.source")]
    .filter((part) => part.length > 0)
    .join(" ");
}

function ioLine(facts: ModelFacts, name: string, t: ModelsT): string {
  return t("compareFaq.inputs.line", {
    model: name,
    inputs: modalityList(facts.inputs, t),
    outputs: modalityList(facts.outputs, t),
    tools: facts.supportsTools
      ? t("compareFaq.inputs.toolsYes")
      : t("compareFaq.inputs.toolsNo"),
  });
}

function compareApiAnswer(
  left: ModelFacts,
  right: ModelFacts,
  locale: CountryLanguage,
  t: ModelsT,
): string {
  const { t: configT } = configScopedTranslation.scopedT(locale);
  if (isApiCallable(left) && isApiCallable(right)) {
    return t("compareFaq.api.both", {
      a: left.name,
      b: right.name,
      idA: left.id,
      idB: right.id,
      appName: configT("appName"),
    });
  }
  return [left, right]
    .map((facts) =>
      isApiCallable(facts)
        ? t("compareFaq.api.one", { model: facts.name, id: facts.id })
        : `${facts.name}: ${apiAnswer(facts, locale)}`,
    )
    .join(" ");
}

/** Visible FAQ for a compare page; the FAQPage JSON-LD uses the same items. */
export function compareFaq(
  left: ModelFacts,
  right: ModelFacts,
  locale: CountryLanguage,
): FaqItem[] {
  const { t } = scopedTranslation.scopedT(locale);
  const pair = { a: left.name, b: right.name };
  const items: FaqItem[] = [
    {
      question: t("compareFaq.cheaper.q", pair),
      answer: cheaperAnswer(left, right, locale, t),
    },
    {
      question: t("compareFaq.context.q", pair),
      answer: contextAnswer(left, right, locale, t),
    },
    {
      question: t("faq.uncensored.q", { model: left.name }),
      answer: uncensoredAnswer(left, locale),
    },
    {
      question: t("faq.uncensored.q", { model: right.name }),
      answer: uncensoredAnswer(right, locale),
    },
    {
      question: t("compareFaq.smarter.q", pair),
      answer: smarterAnswer(left, right, locale, t),
    },
    {
      question: t("compareFaq.inputs.q", pair),
      answer: perModel(left, right, t, (facts, name) =>
        ioLine(facts, name, t),
      ).join(" "),
    },
    {
      question: t("compareFaq.api.q", pair),
      answer: compareApiAnswer(left, right, locale, t),
    },
  ];
  if (!left.isLegacy && !right.isLegacy) {
    const consent =
      left.content === ContentLevel.UNCENSORED ||
      right.content === ContentLevel.UNCENSORED
        ? ` ${t("faq.uncensored.consent")}`
        : "";
    items.push({
      question: t("compareFaq.try.q", pair),
      answer: `${t("compareFaq.try.a", pair)}${consent}`,
    });
  }
  return items;
}

// ─── More comparisons ────────────────────────────────────────────────────────

export interface CompareLink {
  /** Locale-less canonical path, e.g. "/models/compare/<a>/<b>". */
  path: string;
  /** Names in canonical order, so the link text matches the target title. */
  a: string;
  b: string;
}

/** Other comparisons of `facts` (sitemap picks first), never `exclude`. */
export function moreComparisons(
  facts: ModelFacts,
  exclude: ModelFacts,
  availability: AgentEnvAvailability,
): CompareLink[] {
  const self: ModelRef = { id: facts.id, slug: facts.slug, name: facts.name };
  return suggestComparisons(facts, availability, MORE_COMPARISONS + 1)
    .filter((other) => other.id !== exclude.id)
    .slice(0, MORE_COMPARISONS)
    .map((other) => {
      const path = canonicalComparisonPath(self, other);
      const selfFirst = path === `/models/compare/${self.slug}/${other.slug}`;
      return {
        path,
        a: selfFirst ? self.name : other.name,
        b: selfFirst ? other.name : self.name,
      };
    });
}

// ─── Read more ───────────────────────────────────────────────────────────────

export interface CompareReadMore {
  landings: ModelLandingKey[];
  posts: BlogPostSlug[];
}

/**
 * Landing pages for the uncensored kinds on the page, then the posts both
 * model pages would link, alternating sides, deduped, MAX_BLOG_LINKS total.
 */
export function compareReadMore(
  left: ModelFacts,
  right: ModelFacts,
): CompareReadMore {
  const landings = [
    ...new Set(
      [chatModelLanding(left), chatModelLanding(right)].filter(
        (key): key is ModelLandingKey => key !== null,
      ),
    ),
  ];
  const leftPosts = chatModelBlogSlugs(left);
  const rightPosts = chatModelBlogSlugs(right);
  const posts: BlogPostSlug[] = [];
  for (let index = 0; index < MAX_BLOG_LINKS; index++) {
    for (const slug of [leftPosts[index], rightPosts[index]]) {
      if (slug !== undefined && !posts.includes(slug)) {
        posts.push(slug);
      }
    }
  }
  const postSlots = Math.max(0, MAX_BLOG_LINKS - landings.length);
  return {
    landings: landings.slice(0, MAX_BLOG_LINKS),
    posts: posts.slice(0, postSlots),
  };
}
