/**
 * Text-to-Speech Enums
 */

import { createEnumOptions } from "next-vibe/system/unified-interface/shared/field/enum";

/**
 * TTS Provider enum
 */
export const {
  enum: TtsProvider,
  options: TtsProviderOptions,
  Value: TtsProviderValue,
} = createEnumOptions({
  OPENAI: "app.api.agent.textToSpeech.providers.openai",
  GOOGLE: "app.api.agent.textToSpeech.providers.google",
  AMAZON: "app.api.agent.textToSpeech.providers.amazon",
  MICROSOFT: "app.api.agent.textToSpeech.providers.microsoft",
  IBM: "app.api.agent.textToSpeech.providers.ibm",
  LOVOAI: "app.api.agent.textToSpeech.providers.lovoai",
});

/**
 * TTS Voice enum
 */
export const {
  enum: TtsVoice,
  options: TtsVoiceOptions,
  Value: TtsVoiceValue,
} = createEnumOptions({
  MALE: "app.api.agent.textToSpeech.voices.MALE",
  FEMALE: "app.api.agent.textToSpeech.voices.FEMALE",
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
} = createEnumOptions({
  EN: "app.api.agent.textToSpeech.languages.en",
  DE: "app.api.agent.textToSpeech.languages.de",
  PL: "app.api.agent.textToSpeech.languages.pl",
  ES: "app.api.agent.textToSpeech.languages.es",
  FR: "app.api.agent.textToSpeech.languages.fr",
  IT: "app.api.agent.textToSpeech.languages.it",
});
