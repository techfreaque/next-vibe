/**
 * Text-to-Speech Enums
 */

import { createEnumOptions } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/enum-helpers";

/**
 * TTS Provider enum
 */
export const {
  enum: TtsProvider,
  options: ttsProviderOptions,
  Value: TtsProviderValue,
} = createEnumOptions({
  OPENAI: "app.api.v1.core.agent.textToSpeech.providers.openai",
  GOOGLE: "app.api.v1.core.agent.textToSpeech.providers.google",
  AMAZON: "app.api.v1.core.agent.textToSpeech.providers.amazon",
  MICROSOFT: "app.api.v1.core.agent.textToSpeech.providers.microsoft",
  IBM: "app.api.v1.core.agent.textToSpeech.providers.ibm",
  LOVOAI: "app.api.v1.core.agent.textToSpeech.providers.lovoai",
});

/**
 * TTS Voice enum
 */
export const {
  enum: TtsVoice,
  options: ttsVoiceOptions,
  Value: TtsVoiceValue,
} = createEnumOptions({
  MALE: "app.api.v1.core.agent.textToSpeech.voices.MALE",
  FEMALE: "app.api.v1.core.agent.textToSpeech.voices.FEMALE",
});

/**
 * TTS Language enum
 */
export const {
  enum: TtsLanguage,
  options: ttsLanguageOptions,
  Value: TtsLanguageValue,
} = createEnumOptions({
  EN: "app.api.v1.core.agent.textToSpeech.languages.en",
  DE: "app.api.v1.core.agent.textToSpeech.languages.de",
  PL: "app.api.v1.core.agent.textToSpeech.languages.pl",
  ES: "app.api.v1.core.agent.textToSpeech.languages.es",
  FR: "app.api.v1.core.agent.textToSpeech.languages.fr",
  IT: "app.api.v1.core.agent.textToSpeech.languages.it",
});
