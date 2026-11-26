/**
 * Display-time labels for template accounts.
 *
 * Template accounts are stored with the jurisdiction's official name (the
 * Slovak name for the SK template). Viewers in other locales see a translated
 * label as long as the stored name was not renamed by the company.
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { getLanguageFromLocale } from "next-vibe/core/i18n/core/language-utils";

import { type CoaTemplatesTranslationKey, scopedTranslation } from "./i18n";
import { translations as enTranslations } from "./i18n/en";
import { skNodes } from "./sk";

/** Language whose label equals the stored official name, per template country. */
const TEMPLATE_LANGUAGE = { SK: "sk" } as const;

const skOfficialNames = new Map(skNodes.map((node) => [node.code, node.name]));

const skLabelKeys = new Set<string>(
  Object.keys(enTranslations.sk).map((key) => `sk.${key}`),
);

function isTemplateLabelKey(key: string): key is CoaTemplatesTranslationKey {
  return skLabelKeys.has(key);
}

/** Official template name for an account code, if the code is a template account. */
export function templateOfficialName(
  country: string | null | undefined,
  code: string,
): string | undefined {
  return country?.trim().toUpperCase() === "SK"
    ? skOfficialNames.get(code)
    : undefined;
}

/**
 * Localized label for a template account. Returns the stored name when the
 * account is not a template account, was renamed, or the viewer reads the
 * template's own language.
 */
export function templateAccountLabel(
  country: string | null | undefined,
  code: string,
  storedName: string,
  locale: CountryLanguage,
): string {
  const official = templateOfficialName(country, code);
  if (official === undefined || official !== storedName) {
    return storedName;
  }
  if (getLanguageFromLocale(locale) === TEMPLATE_LANGUAGE.SK) {
    return storedName;
  }
  const key = `sk.a${code.replace(".", "_")}`;
  if (!isTemplateLabelKey(key)) {
    return storedName;
  }
  return scopedTranslation.scopedT(locale).t(key);
}
