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
  OPENAI: "app.api.v1.core.agent.speechToText.providers.openai",
  ASSEMBLYAI: "app.api.v1.core.agent.speechToText.providers.assemblyai",
  DEEPGRAM: "app.api.v1.core.agent.speechToText.providers.deepgram",
  GOOGLE: "app.api.v1.core.agent.speechToText.providers.google",
  AMAZON: "app.api.v1.core.agent.speechToText.providers.amazon",
  MICROSOFT: "app.api.v1.core.agent.speechToText.providers.microsoft",
  IBM: "app.api.v1.core.agent.speechToText.providers.ibm",
  REV: "app.api.v1.core.agent.speechToText.providers.rev",
});

/**
 * STT Language enum
 */
export const {
  enum: SttLanguage,
  options: SttLanguageOptions,
  Value: SttLanguageValue,
} = createEnumOptions({
  EN: "app.api.v1.core.agent.speechToText.languages.en",
  DE: "app.api.v1.core.agent.speechToText.languages.de",
  PL: "app.api.v1.core.agent.speechToText.languages.pl",
  ES: "app.api.v1.core.agent.speechToText.languages.es",
  FR: "app.api.v1.core.agent.speechToText.languages.fr",
  IT: "app.api.v1.core.agent.speechToText.languages.it",
});
