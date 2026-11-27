/**
 * "Platforms compared" links on an uncensored model's page: the versus page
 * and alternatives guide of every platform whose API serves this model, plus
 * the comparison hub. Self-contained: labels come from the compare and blog
 * translations, so the block reads the same as everywhere else.
 */

import { apiProviderDisplayNames } from "next-vibe/agent/models/models";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Div } from "next-vibe/ui/components/div";
import type { JSX } from "react";

import { configScopedTranslation } from "@/env/i18n";

import { CardLink, PageSection } from "../../story/_shared/marketing";
import { guideCards } from "../../story/blog/guide-links";
import type { BlogPostSlug } from "../../story/blog/posts-meta";
import {
  COMPARE_HUB_PATH,
  PLATFORMS,
  VERSUS_GUIDES,
  VERSUS_KEYS,
  type VersusKey,
  versusPath,
} from "../../story/compare/_shared/platforms";
import { scopedTranslation as compareScopedTranslation } from "../../story/compare/i18n";
import type { ModelFacts } from "./model-facts";
import { uncensoredKind } from "./model-format";

/** Guide shown when no compared platform serves the model. */
const FALLBACK_GUIDES: readonly BlogPostSlug[] = [
  "uncensored-llm-api",
  "openrouter-alternatives",
];

/** Versus keys whose platform serves this model through its API. */
export function servingVersusKeys(
  facts: Pick<ModelFacts, "providers">,
): VersusKey[] {
  return VERSUS_KEYS.filter((key) => {
    const upstream = PLATFORMS[key].upstream;
    return (
      upstream !== null &&
      facts.providers.includes(apiProviderDisplayNames[upstream])
    );
  });
}

export function ModelCompareLinks({
  locale,
  facts,
}: {
  locale: CountryLanguage;
  facts: ModelFacts;
}): JSX.Element | null {
  if (uncensoredKind(facts) === null) {
    return null;
  }
  const { t } = compareScopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  const versus = servingVersusKeys(facts);
  const slugs = [
    ...new Set(
      versus.length > 0
        ? versus.flatMap((key) => VERSUS_GUIDES[key].slice(0, 1))
        : FALLBACK_GUIDES,
    ),
  ];

  return (
    <PageSection title={t("links.sectionTitle")} tone="muted">
      <Div data-testid="model-compare-links" className="flex flex-col">
        {versus.map((key) => (
          <CardLink
            key={key}
            href={`/${locale}${versusPath(key)}`}
            label={t("links.versus", { appName, name: PLATFORMS[key].name })}
          />
        ))}
        {guideCards(locale, slugs).map((guide) => (
          <CardLink
            key={guide.slug}
            href={`/${locale}${guide.path}`}
            label={guide.title}
          />
        ))}
        <CardLink
          href={`/${locale}${COMPARE_HUB_PATH}`}
          label={t("links.hub")}
        />
      </Div>
    </PageSection>
  );
}
