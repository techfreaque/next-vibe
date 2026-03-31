/**
 * Text-to-Speech Enums
 */

import { createEnumOptions } from "next-vibe/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./i18n";

/**
 * TTS Language enum
 */
export const {
  enum: TtsLanguage,
  options: TtsLanguageOptions,
  Value: TtsLanguageValue,
} = createEnumOptions(scopedTranslation, {
  EN: "languages.en",
  DE: "languages.de",
  PL: "languages.pl",
  ES: "languages.es",
  FR: "languages.fr",
  IT: "languages.it",
});
