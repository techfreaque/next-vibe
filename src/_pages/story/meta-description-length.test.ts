import { describe, expect, test } from "bun:test";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";

import { configScopedTranslation } from "@/env/i18n";

import { scopedTranslation as helpT } from "../help/i18n";
import { scopedTranslation as skillsT } from "../skills/i18n";
import { scopedTranslation as multiModelT } from "./blog/_multi-model/i18n";
import { POST_SLUGS, type Subject } from "./blog/_multi-model/platforms";
import { scopedTranslation as azureT } from "./blog/azure-openai-alternatives/i18n";
import { scopedTranslation as bedrockT } from "./blog/bedrock-alternatives/i18n";
import { scopedTranslation as bestLlmT } from "./blog/best-uncensored-llm/i18n";
import { scopedTranslation as chatgptT } from "./blog/chatgpt-alternative-without-filters/i18n";
import { scopedTranslation as chubT } from "./blog/chub-ai-alternatives/i18n";
import { scopedTranslation as modelRefreshT } from "./blog/model-refresh-uncensored-providers/i18n";
import { scopedTranslation as nanoGptT } from "./blog/nanogpt-alternatives/i18n";
import { scopedTranslation as openRouterT } from "./blog/openrouter-alternatives/i18n";
import { scopedTranslation as sillyTavernT } from "./blog/sillytavern-alternatives/i18n";
import { scopedTranslation as llmApiT } from "./blog/uncensored-llm-api/i18n";
import { scopedTranslation as modelsGuideT } from "./blog/uncensored-models-what-each-is-good-at/i18n";
import { scopedTranslation as veniceT } from "./blog/venice-ai-alternatives/i18n";
import { VERSUS_KEYS } from "./compare/_shared/platforms";
import { scopedTranslation as compareT } from "./compare/i18n";
import { scopedTranslation as refusalT } from "./refusal-index/i18n";

/** Google truncates snippets past ~160 rendered characters. */
const DESC_MAX = 160;

const LOCALES: readonly CountryLanguage[] = [
  "en-US",
  "de-DE",
  "pl-PL",
  "fr-FR",
  "it-IT",
  "es-ES",
  "sk-SK",
  "hi-IN",
];

/** Stand-in for live counts (model totals etc.): three digits, the widest real value. */
const COUNT = 999;

function descriptions(locale: CountryLanguage): Record<string, string> {
  const appName = configScopedTranslation.scopedT(locale).t("appName");
  const stats = { appName, modelCount: COUNT };
  const out: Record<string, string> = {
    help: helpT.scopedT(locale).t("meta.contact.description", stats),
    skills: skillsT.scopedT(locale).t("meta.description", stats),
    refusalIndex: refusalT.scopedT(locale).t("meta.description", stats),
    azure: azureT.scopedT(locale).t("meta.description", stats),
    bedrock: bedrockT.scopedT(locale).t("meta.description", stats),
    bestLlm: bestLlmT.scopedT(locale).t("meta.description", stats),
    chatgpt: chatgptT.scopedT(locale).t("meta.description", stats),
    chub: chubT.scopedT(locale).t("meta.description", stats),
    modelRefresh: modelRefreshT.scopedT(locale).t("meta.description", stats),
    nanoGpt: nanoGptT.scopedT(locale).t("meta.description", stats),
    openRouter: openRouterT.scopedT(locale).t("meta.description", stats),
    sillyTavern: sillyTavernT.scopedT(locale).t("meta.description", stats),
    llmApi: llmApiT.scopedT(locale).t("meta.description", stats),
    modelsGuide: modelsGuideT.scopedT(locale).t("meta.description", stats),
    venice: veniceT.scopedT(locale).t("meta.description", stats),
  };
  const subjects: Subject[] = Object.keys(POST_SLUGS).filter(
    (key): key is Subject => key in POST_SLUGS,
  );
  for (const subject of subjects) {
    out[`multiModel.${subject}`] = multiModelT
      .scopedT(locale)
      .t(`posts.${subject}.description`, stats);
  }
  for (const versus of VERSUS_KEYS) {
    out[`versus.${versus}`] = compareT
      .scopedT(locale)
      .t(`versus.${versus}.meta.description`, stats);
  }
  return out;
}

describe("SEO meta descriptions", () => {
  test.each(LOCALES)("render within %s snippet length", (locale) => {
    const over: string[] = [];
    for (const [page, text] of Object.entries(descriptions(locale))) {
      expect(text).not.toContain("{{");
      const len = [...text].length;
      if (len > DESC_MAX) {
        over.push(`${page} (${len}): ${text}`);
      }
    }
    expect(over).toEqual([]);
  });
});
