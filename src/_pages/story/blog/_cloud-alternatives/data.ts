/**
 * Shared facts for the enterprise-cloud alternatives posts (Azure OpenAI,
 * AWS Bedrock) and the uncensored LLM API hub. Every competitor value below
 * was read on CLOUD_CHECKED_DATE at the linked official page. Our own side is
 * never typed here: prices, counts and ids are read live from the registry
 * (./prices) and loadUsFacts.
 */

import { ChatModelId } from "next-vibe/agent/ai-stream/models";

/** Day every competitor fact in this folder was read at its source. */
export const CLOUD_CHECKED_DATE = "2026-11-27";

/** Rows of the "what off really means" table, in display order. */
export const CLOUD_RULE_KEYS = [
  "azure",
  "bedrock",
  "vertex",
  "together",
] as const;
export type CloudRuleKey = (typeof CLOUD_RULE_KEYS)[number];

export const CLOUD_RULE_COLUMNS = [
  "defaults",
  "off",
  "models",
  "weights",
  "rules",
] as const;
export type CloudRuleColumn = (typeof CLOUD_RULE_COLUMNS)[number];

export interface CloudSource {
  label: "filters" | "access" | "policy" | "privacy" | "pricing" | "import";
  url: string;
}

export const CLOUD_RULES: Record<
  CloudRuleKey,
  { name: string; sources: readonly CloudSource[] }
> = {
  azure: {
    name: "Azure OpenAI (Microsoft Foundry)",
    sources: [
      {
        label: "filters",
        url: "https://learn.microsoft.com/en-us/azure/ai-foundry/openai/concepts/content-filter",
      },
      {
        label: "access",
        url: "https://learn.microsoft.com/en-us/azure/ai-foundry/responsible-ai/openai/limited-access",
      },
      {
        label: "policy",
        url: "https://learn.microsoft.com/en-us/legal/ai-code-of-conduct",
      },
      {
        label: "privacy",
        url: "https://learn.microsoft.com/en-us/azure/ai-foundry/responsible-ai/openai/data-privacy",
      },
    ],
  },
  bedrock: {
    name: "AWS Bedrock",
    sources: [
      {
        label: "filters",
        url: "https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html",
      },
      {
        label: "policy",
        url: "https://aws.amazon.com/ai/responsible-ai/policy/",
      },
      {
        label: "privacy",
        url: "https://docs.aws.amazon.com/bedrock/latest/userguide/abuse-detection.html",
      },
      {
        label: "import",
        url: "https://docs.aws.amazon.com/bedrock/latest/userguide/model-customization-import-model.html",
      },
      { label: "pricing", url: "https://aws.amazon.com/bedrock/pricing/" },
    ],
  },
  vertex: {
    name: "Google Vertex AI / Gemini API",
    sources: [
      {
        label: "filters",
        url: "https://docs.cloud.google.com/vertex-ai/generative-ai/docs/multimodal/configure-safety-filters",
      },
      {
        label: "policy",
        url: "https://policies.google.com/terms/generative-ai/use-policy",
      },
      {
        label: "privacy",
        url: "https://docs.cloud.google.com/vertex-ai/generative-ai/docs/data-governance",
      },
      {
        label: "import",
        url: "https://docs.cloud.google.com/vertex-ai/generative-ai/docs/migrate/openai/overview",
      },
    ],
  },
  together: {
    name: "Together AI",
    sources: [
      {
        label: "pricing",
        url: "https://www.together.ai/pricing",
      },
      {
        label: "policy",
        url: "https://www.together.ai/terms-of-service",
      },
      {
        label: "import",
        url: "https://docs.together.ai/docs/custom-models",
      },
      { label: "privacy", url: "https://www.together.ai/privacy" },
    ],
  },
};

/** Alternatives described one by one, in the order the posts list them. */
export const CLOUD_ALTERNATIVE_KEYS = [
  "openRouter",
  "venice",
  "nanoGpt",
  "openUncensored",
  "refuseless",
  "abliterationHosts",
  "togetherFireworks",
  "selfHost",
] as const;
export type CloudAlternativeKey = (typeof CLOUD_ALTERNATIVE_KEYS)[number];

export const CLOUD_ALTERNATIVES: Record<
  CloudAlternativeKey,
  { name: string; sources: readonly string[] }
> = {
  openRouter: {
    name: "OpenRouter",
    sources: [
      "https://openrouter.ai/docs/faq",
      "https://openrouter.ai/api/v1/models",
    ],
  },
  venice: {
    name: "Venice",
    sources: [
      "https://docs.venice.ai/overview/pricing",
      "https://venice.ai/legal/tos",
    ],
  },
  nanoGpt: {
    name: "NanoGPT",
    sources: ["https://nano-gpt.com/pricing", "https://nano-gpt.com/terms"],
  },
  openUncensored: {
    name: "OpenUncensored",
    sources: [
      "https://openuncensored.com/models",
      "https://openuncensored.com/privacy",
    ],
  },
  refuseless: {
    name: "Refuseless",
    sources: [
      "https://docs.refuseless.com",
      "https://api.refuseless.com/v1/models",
    ],
  },
  abliterationHosts: {
    name: "NEAR AI Cloud, abliteration.ai",
    sources: [
      "https://near.ai/uncensored-llm-api",
      "https://abliteration.ai/data-handling",
    ],
  },
  togetherFireworks: {
    name: "Together AI, Fireworks AI",
    sources: [
      "https://www.together.ai/terms-of-service",
      "https://fireworks.ai/terms-of-service",
    ],
  },
  selfHost: {
    name: "Ollama, LM Studio, vLLM",
    sources: [
      "https://docs.ollama.com/api/openai-compatibility",
      "https://lmstudio.ai/docs/developer/openai-compat",
    ],
  },
};

/** One competitor offer for a model we also serve. USD per 1M tokens. */
export interface PriceOffer {
  provider: string;
  input: number;
  output: number;
  url: string;
}

/** Models we serve that competitors also sell, with their list prices. */
export const PRICE_GROUPS: readonly {
  model: ChatModelId;
  offers: readonly PriceOffer[];
}[] = [
  {
    model: ChatModelId.GLM_5_3_FLASH_UNCENSORED,
    offers: [
      {
        provider: "OpenUncensored",
        input: 0.12,
        output: 0.5,
        url: "https://openuncensored.com/models",
      },
      {
        provider: "Refuseless",
        input: 0.12,
        output: 0.5,
        url: "https://api.refuseless.com/v1/models",
      },
      {
        provider: "Venice",
        input: 0.165,
        output: 0.55,
        url: "https://api.venice.ai/api/v1/models",
      },
      {
        provider: "NanoGPT",
        input: 0.2,
        output: 0.8,
        url: "https://nano-gpt.com/api/v1/models?detailed=true",
      },
    ],
  },
  {
    model: ChatModelId.VENICE_DEEPSEEK_V4_1_FLASH_UNCENSORED,
    offers: [
      {
        provider: "OpenUncensored",
        input: 0.12,
        output: 0.45,
        url: "https://openuncensored.com/models",
      },
      {
        provider: "Refuseless",
        input: 0.12,
        output: 0.45,
        url: "https://api.refuseless.com/v1/models",
      },
      {
        provider: "NEAR AI Cloud",
        input: 0.3,
        output: 1.2,
        url: "https://cloud-api.near.ai/v1/models",
      },
      {
        provider: "Venice",
        input: 0.33,
        output: 1.32,
        url: "https://api.venice.ai/api/v1/models",
      },
      {
        provider: "NanoGPT",
        input: 0.33,
        output: 1.32,
        url: "https://nano-gpt.com/api/v1/models?detailed=true",
      },
    ],
  },
  {
    model: ChatModelId.GLM_5_3_UNCENSORED,
    offers: [
      {
        provider: "OpenUncensored",
        input: 0.39,
        output: 1.32,
        url: "https://openuncensored.com/models",
      },
      {
        provider: "Refuseless",
        input: 1,
        output: 2,
        url: "https://api.refuseless.com/v1/models",
      },
      {
        provider: "NanoGPT",
        input: 1.25,
        output: 2.25,
        url: "https://nano-gpt.com/api/v1/models?detailed=true",
      },
    ],
  },
  {
    model: ChatModelId.VENICE_UNCENSORED,
    offers: [
      {
        provider: "Venice",
        input: 0.2,
        output: 0.9,
        url: "https://docs.venice.ai/overview/pricing",
      },
      {
        provider: "OpenRouter",
        input: 0.2,
        output: 0.9,
        url: "https://openrouter.ai/api/v1/models",
      },
      {
        provider: "OpenUncensored",
        input: 0.2,
        output: 0.9,
        url: "https://openuncensored.com/models",
      },
    ],
  },
];
