/**
 * Credits Spent By Model - Enums
 * Model family (chat, by model maker) or media / tool bucket of a usage debit.
 */

import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

import { scopedTranslation } from "./i18n";

export const {
  enum: ModelSpendGroup,
  options: ModelSpendGroupOptions,
  Value: ModelSpendGroupValue,
} = createEnumOptions(scopedTranslation, {
  /** Chat models made by Uncensored.ai (Uncensored LM) */
  UNCENSORED_AI: "enums.group.uncensoredAi",
  /** Chat models made by Z.AI (GLM) */
  ZAI: "enums.group.zai",
  /** Chat models made by Moonshot AI (Kimi) */
  MOONSHOT: "enums.group.moonshot",
  /** Chat models made by DeepSeek */
  DEEPSEEK: "enums.group.deepseek",
  /** Chat models made by Venice.ai */
  VENICE: "enums.group.venice",
  /** Chat models made by xAI (Grok) */
  XAI: "enums.group.xai",
  /** Chat models made by Anthropic (Claude) */
  ANTHROPIC: "enums.group.anthropic",
  /** Chat models made by OpenAI (GPT) */
  OPENAI: "enums.group.openai",
  /** Chat models made by Google (Gemini) */
  GOOGLE: "enums.group.google",
  /** Every other chat model maker */
  OTHER_CHAT: "enums.group.otherChat",
  /** Image generation */
  IMAGE: "enums.group.image",
  /** Video generation */
  VIDEO: "enums.group.video",
  /** Music generation */
  MUSIC: "enums.group.music",
  /** Text-to-speech + speech-to-text */
  VOICE: "enums.group.voice",
  /** Web search, URL fetch, memory and other tool charges */
  TOOLS: "enums.group.tools",
  /** Rows with neither a model id nor a feature */
  UNATTRIBUTED: "enums.group.unattributed",
});
