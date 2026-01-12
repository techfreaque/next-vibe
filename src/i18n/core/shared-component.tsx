import type { ReactNode } from "react";

import type { CountryLanguage } from "./config";
import { _simpleT } from "./shared";
import type { TranslationKey, TranslationValue } from "./static-types";
import { renderTranslation } from "./translation-utils";

interface SimpleTranslationProps<K extends TranslationKey> {
  lang: CountryLanguage;
  i18nKey: K;
  values?: TranslationValue<K> extends string
    ? Record<string, string | number>
    : never;
}

/**
 * Server-side translation component
 * Use this for translations in server components
 */
export default function SimpleT<K extends TranslationKey>({
  lang,
  i18nKey,
  values,
}: SimpleTranslationProps<K>): ReactNode {
  // Use simpleT directly which already uses the shared utility
  const translatedValue = _simpleT(lang, i18nKey, values);

  // Use the shared rendering logic
  return renderTranslation(translatedValue, i18nKey);
}
