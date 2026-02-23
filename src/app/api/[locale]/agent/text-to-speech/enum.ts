/**
 * Text-to-Speech Enums
 */

import { createEnumOptions } from "next-vibe/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./i18n";

/**
 * TTS Provider enum
 */
export const {
  enum: TtsProvider,
  options: TtsProviderOptions,
  Value: TtsProviderValue,
} = createEnumOptions(scopedTranslation, {
  OPENAI: "providers.openai",
  GOOGLE: "providers.google",
  AMAZON: "providers.amazon",
  MICROSOFT: "providers.microsoft",
  IBM: "providers.ibm",
  LOVOAI: "providers.lovoai",
});

/**
 * TTS Voice enum
 */
export const {
  enum: TtsVoice,
  options: TtsVoiceOptions,
  Value: TtsVoiceValue,
} = createEnumOptions(scopedTranslation, {
  MALE: "voices.MALE",
  FEMALE: "voices.FEMALE",
});

/**
 * Database enum array for Drizzle
 */
export const TtsVoiceDB = [TtsVoice.MALE, TtsVoice.FEMALE] as const;

/**
 * Default voice
 */
export const DEFAULT_TTS_VOICE = TtsVoice.FEMALE;

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
