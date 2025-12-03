/**
 * Speech-to-Text Enums
 */

import { createEnumOptions } from "next-vibe/system/unified-interface/shared/field/enum";

/**
 * STT Provider enum
 */
export const {
  enum: SttProvider,
  options: SttProviderOptions,
  Value: SttProviderValue,
} = createEnumOptions({
  OPENAI: "app.api.agent.speechToText.providers.openai",
  ASSEMBLYAI: "app.api.agent.speechToText.providers.assemblyai",
  DEEPGRAM: "app.api.agent.speechToText.providers.deepgram",
  GOOGLE: "app.api.agent.speechToText.providers.google",
  AMAZON: "app.api.agent.speechToText.providers.amazon",
  MICROSOFT: "app.api.agent.speechToText.providers.microsoft",
  IBM: "app.api.agent.speechToText.providers.ibm",
  REV: "app.api.agent.speechToText.providers.rev",
});

/**
 * STT Language enum
 */
export const {
  enum: SttLanguage,
  options: SttLanguageOptions,
  Value: SttLanguageValue,
} = createEnumOptions({
  EN: "app.api.agent.speechToText.languages.en",
  DE: "app.api.agent.speechToText.languages.de",
  PL: "app.api.agent.speechToText.languages.pl",
  ES: "app.api.agent.speechToText.languages.es",
  FR: "app.api.agent.speechToText.languages.fr",
  IT: "app.api.agent.speechToText.languages.it",
});
