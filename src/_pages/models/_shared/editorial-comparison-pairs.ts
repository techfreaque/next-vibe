import { ChatModelId } from "next-vibe/agent/ai-stream/models";

type EditorialModelPair = readonly [ChatModelId, ChatModelId];

/** Claude models, newest and strongest first. The first live one leads. */
export const CLAUDE_COMPARISON_ANCHORS: readonly ChatModelId[] = [
  ChatModelId.CLAUDE_OPUS_5_5,
  ChatModelId.CLAUDE_SONNET_5_5,
  ChatModelId.CLAUDE_FABLE_5_2,
  ChatModelId.CLAUDE_HAIKU_5_5,
  ChatModelId.CLAUDE_OPUS_5,
  ChatModelId.CLAUDE_SONNET_5,
];

export const CLAUDE_COMPARISON_PARTNERS: readonly ChatModelId[] = [
  ChatModelId.KIMI_K3_1_PRO_UNCENSORED,
  ChatModelId.GLM_5_3_UNCENSORED,
  ChatModelId.UNCENSORED_LM_V1_2,
];

export const ROLEPLAY_PAIRS: readonly EditorialModelPair[] = [
  [ChatModelId.UNCENSORED_LM_V1_2, ChatModelId.VENICE_UNCENSORED_ROLEPLAY],
  [ChatModelId.UNCENSORED_LM_V1_2, ChatModelId.DRUMMER_ARTEMIS_31B],
  [
    ChatModelId.UNCENSORED_LM_V1_2,
    ChatModelId.VENICE_DEEPSEEK_V4_1_FLASH_UNCENSORED,
  ],
];

export const ABLITERATED_PAIRS: readonly EditorialModelPair[] = [
  [ChatModelId.GLM_5_3, ChatModelId.GLM_5_3_UNCENSORED],
  [
    ChatModelId.DEEPSEEK_V4_1_FLASH,
    ChatModelId.VENICE_DEEPSEEK_V4_1_FLASH_UNCENSORED,
  ],
  [ChatModelId.KIMI_K3_1_PRO, ChatModelId.KIMI_K3_1_PRO_UNCENSORED],
];

export const BEST_UNCENSORED_PAIRS: readonly EditorialModelPair[] = [
  [
    ChatModelId.GLM_5_3_UNCENSORED,
    ChatModelId.VENICE_DEEPSEEK_V4_1_FLASH_UNCENSORED,
  ],
  [ChatModelId.UNCENSORED_LM_V1_2, ChatModelId.GLM_5_3_UNCENSORED],
  [
    ChatModelId.UNCENSORED_LM_V1_2,
    ChatModelId.VENICE_DEEPSEEK_V4_1_FLASH_UNCENSORED,
  ],
  [ChatModelId.KIMI_K3_1_PRO, ChatModelId.KIMI_K3_1_PRO_UNCENSORED],
  [ChatModelId.GLM_5_3, ChatModelId.GLM_5_3_UNCENSORED],
];

export const CHATGPT_ALTERNATIVE_PAIRS: readonly EditorialModelPair[] = [
  [ChatModelId.UNCENSORED_LM_V1_2, ChatModelId.GPT_6_2_SOL],
  [ChatModelId.UNCENSORED_LM_V1_2, ChatModelId.VENICE_UNCENSORED_ROLEPLAY],
  [ChatModelId.UNCENSORED_LM_V1_2, ChatModelId.GLM_5_3_UNCENSORED],
  [ChatModelId.CLAUDE_SONNET_5_5, ChatModelId.GLM_5_3_UNCENSORED],
  [ChatModelId.GPT_6_2_SOL, ChatModelId.KIMI_K3_1_PRO],
];

export const JAILBREAK_ALTERNATIVE_PAIRS: readonly EditorialModelPair[] = [
  [ChatModelId.GPT_6_2_SOL, ChatModelId.GLM_5_3_UNCENSORED],
  [ChatModelId.GPT_6_2_SOL, ChatModelId.UNCENSORED_LM_V1_2],
  [ChatModelId.GLM_5_3, ChatModelId.GLM_5_3_UNCENSORED],
  [ChatModelId.KIMI_K3_1_PRO, ChatModelId.KIMI_K3_1_PRO_UNCENSORED],
  [
    ChatModelId.DEEPSEEK_V4_1_FLASH,
    ChatModelId.VENICE_DEEPSEEK_V4_1_FLASH_UNCENSORED,
  ],
];

export const DEEPSEEK_PAIRS: readonly EditorialModelPair[] = [
  [
    ChatModelId.DEEPSEEK_V4_1_FLASH,
    ChatModelId.VENICE_DEEPSEEK_V4_1_FLASH_UNCENSORED,
  ],
  [ChatModelId.DEEPSEEK_V4_1_FLASH, ChatModelId.DEEPSEEK_V4_1_FLASH_CSF],
  [
    ChatModelId.VENICE_DEEPSEEK_V4_1_FLASH_UNCENSORED,
    ChatModelId.DEEPSEEK_V4_1_FLASH_CSF,
  ],
  [
    ChatModelId.VENICE_DEEPSEEK_V4_1_FLASH_UNCENSORED,
    ChatModelId.GLM_5_3_UNCENSORED,
  ],
];

export const COMPATIBLE_API_PAIRS: readonly EditorialModelPair[] = [
  [ChatModelId.CLAUDE_SONNET_5_5, ChatModelId.GPT_6_1_SOL],
  [ChatModelId.CLAUDE_SONNET_5_5, ChatModelId.KIMI_K3_1_PRO],
  [ChatModelId.GPT_6_1_SOL, ChatModelId.GEMINI_4_ARGON],
  [ChatModelId.GLM_5_3, ChatModelId.DEEPSEEK_V4_PRO],
];

export const UNBIASED_CHATBOT_PAIRS: readonly EditorialModelPair[] = [
  [ChatModelId.UNCENSORED_LM_V1_2, ChatModelId.GPT_6_2_SOL],
  [ChatModelId.UNCENSORED_LM_V1_2, ChatModelId.CLAUDE_SONNET_5_5],
  [ChatModelId.UNCENSORED_LM_V1_2, ChatModelId.GROK_4_7],
  [ChatModelId.UNCENSORED_LM_V1_2, ChatModelId.GLM_5_3_UNCENSORED],
];

export const WRITING_PAIRS: readonly EditorialModelPair[] = [
  [ChatModelId.UNCENSORED_LM_V1_2, ChatModelId.VENICE_UNCENSORED_ROLEPLAY],
  [ChatModelId.UNCENSORED_LM_V1_2, ChatModelId.DRUMMER_ARTEMIS_31B],
  [ChatModelId.UNCENSORED_LM_V1_2, ChatModelId.GLM_5_3_UNCENSORED],
  [ChatModelId.GLM_5_3, ChatModelId.GLM_5_3_UNCENSORED],
];

export const HOSTED_MODEL_PAIRS: readonly EditorialModelPair[] = [
  [ChatModelId.GLM_5_3_FLASH, ChatModelId.GLM_5_3_FLASH_UNCENSORED],
  [ChatModelId.GLM_5_3, ChatModelId.GLM_5_3_UNCENSORED],
  [
    ChatModelId.DEEPSEEK_V4_1_FLASH,
    ChatModelId.VENICE_DEEPSEEK_V4_1_FLASH_UNCENSORED,
  ],
];

export const UNCENSORED_USE_CASE_PAIRS: readonly EditorialModelPair[] = [
  [ChatModelId.UNCENSORED_LM_V1_2, ChatModelId.VENICE_UNCENSORED_ROLEPLAY],
  [ChatModelId.UNCENSORED_LM_V1_2, ChatModelId.VENICE_UNCENSORED],
  [
    ChatModelId.UNCENSORED_LM_V1_2,
    ChatModelId.VENICE_DEEPSEEK_V4_1_FLASH_UNCENSORED,
  ],
  [ChatModelId.UNCENSORED_LM_V1_2, ChatModelId.GLM_5_3_UNCENSORED],
  [ChatModelId.UNCENSORED_LM_V1_2, ChatModelId.QWEN_3_6_PLUS_UNCENSORED],
  [ChatModelId.UNCENSORED_LM_V1_2, ChatModelId.GPT_6_1_SOL],
];

export const EDITORIAL_COMPARISON_PAIRS: readonly EditorialModelPair[] = [
  ...ROLEPLAY_PAIRS,
  ...ABLITERATED_PAIRS,
  ...BEST_UNCENSORED_PAIRS,
  ...CHATGPT_ALTERNATIVE_PAIRS,
  ...JAILBREAK_ALTERNATIVE_PAIRS,
  ...DEEPSEEK_PAIRS,
  ...COMPATIBLE_API_PAIRS,
  ...UNBIASED_CHATBOT_PAIRS,
  ...WRITING_PAIRS,
  ...HOSTED_MODEL_PAIRS,
  ...UNCENSORED_USE_CASE_PAIRS,
];
