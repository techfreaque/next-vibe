/**
 * Speech-to-Text Enums
 */

import { createEnumOptions } from "next-vibe/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./i18n";

/**
 * STT Provider enum
 */
export const {
  enum: SttProvider,
  options: SttProviderOptions,
  Value: SttProviderValue,
} = createEnumOptions(scopedTranslation, {
  OPENAI: "providers.openai",
  ASSEMBLYAI: "providers.assemblyai",
  DEEPGRAM: "providers.deepgram",
  GOOGLE: "providers.google",
  AMAZON: "providers.amazon",
  MICROSOFT: "providers.microsoft",
  IBM: "providers.ibm",
  REV: "providers.rev",
});

/**
 * STT Language enum
 */
export const {
  enum: SttLanguage,
  options: SttLanguageOptions,
  Value: SttLanguageValue,
} = createEnumOptions(scopedTranslation, {
  EN: "languages.en",
  DE: "languages.de",
  PL: "languages.pl",
  ES: "languages.es",
  FR: "languages.fr",
  IT: "languages.it",
});
