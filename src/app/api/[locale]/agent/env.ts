/**
 * Agent Environment
 */

import "server-only";

import { z } from "zod";

import { defineEnv } from "@/app/api/[locale]/system/unified-interface/shared/env/define-env";

export const { env: agentEnv } = defineEnv({
  OPENROUTER_API_KEY: {
    schema: z.string().min(1),
    example: "your-openrouter-api-key",
    comment: "OpenRouter",
  },
  UNCENSORED_AI_API_KEY: {
    schema: z.string(),
    example: "your-uncensored-ai-api-key",
  },
  FREEDOMGPT_API_KEY: {
    schema: z.string(),
    example: "your_freedomgpt_api_key",
  },
  GAB_AI_API_KEY: { schema: z.string(), example: "your_gab_ai_api_key" },
  EDEN_AI_API_KEY: {
    schema: z.string().min(1),
    example: "your-eden-ai-api-key",
    comment: "Eden AI",
  },
  BRAVE_SEARCH_API_KEY: {
    schema: z.string(),
    example: "your-brave-search-api-key",
  },
});
