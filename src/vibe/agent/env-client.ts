/**
 * Agent Client Environment
 *
 * Provider availability flags derived from server API keys.
 * Defaults reflect cloud deployments where keys are always present.
 */

import { defineEnvClient } from "next-vibe/env/define-env-client";
import { z } from "zod";

export const {
  envClient: agentClientEnv,
  schema: agentClientEnvSchema,
  examples: agentClientEnvExamples,
} = defineEnvClient({
  // Agent provider availability flags - set by vibe runtime from server env keys.
  // Defaults to true so cloud deployments (where keys are always present) work
  // without needing explicit NEXT_PUBLIC_AGENT_* vars in .env.
  NEXT_PUBLIC_AGENT_OPEN_ROUTER: {
    schema: z
      .string()
      .optional()
      .transform((v) => v === "true"),
    value: process.env.NEXT_PUBLIC_AGENT_OPEN_ROUTER,
    example: false,
  },
  NEXT_PUBLIC_AGENT_CLAUDE_CODE: {
    schema: z
      .string()
      .optional()
      .default("false")
      .transform((v) => v === "true"),
    value: process.env.NEXT_PUBLIC_AGENT_CLAUDE_CODE,
    example: false,
  },
  NEXT_PUBLIC_AGENT_VOICE: {
    schema: z
      .string()
      .optional()
      .transform((v) => v === "true"),
    value: process.env.NEXT_PUBLIC_AGENT_VOICE,
    example: false,
  },
  NEXT_PUBLIC_AGENT_BRAVE_SEARCH: {
    schema: z
      .string()
      .optional()
      .transform((v) => v === "true"),
    value: process.env.NEXT_PUBLIC_AGENT_BRAVE_SEARCH,
    example: false,
  },
  NEXT_PUBLIC_AGENT_KAGI_SEARCH: {
    schema: z
      .string()
      .optional()
      .transform((v) => v === "true"),
    value: process.env.NEXT_PUBLIC_AGENT_KAGI_SEARCH,
    example: false,
  },
  NEXT_PUBLIC_AGENT_UNCENSORED_AI: {
    schema: z
      .string()
      .optional()
      .transform((v) => v === "true"),
    value: process.env.NEXT_PUBLIC_AGENT_UNCENSORED_AI,
    example: false,
  },
  NEXT_PUBLIC_AGENT_FREEDOM_GPT: {
    schema: z
      .string()
      .optional()
      .transform((v) => v === "true"),
    value: process.env.NEXT_PUBLIC_AGENT_FREEDOM_GPT,
    example: false,
  },
  NEXT_PUBLIC_AGENT_GAB_AI: {
    schema: z
      .string()
      .optional()
      .transform((v) => v === "true"),
    value: process.env.NEXT_PUBLIC_AGENT_GAB_AI,
    example: false,
  },
  NEXT_PUBLIC_AGENT_VENICE_AI: {
    schema: z
      .string()
      .optional()
      .transform((v) => v === "true"),
    value: process.env.NEXT_PUBLIC_AGENT_VENICE_AI,
    example: false,
  },
  NEXT_PUBLIC_AGENT_SCRAPPEY: {
    schema: z
      .string()
      .optional()
      .transform((v) => v === "true"),
    value: process.env.NEXT_PUBLIC_AGENT_SCRAPPEY,
    example: false,
  },
  NEXT_PUBLIC_AGENT_OPEN_AI_IMAGES: {
    schema: z
      .string()
      .optional()
      .transform((v) => v === "true"),
    value: process.env.NEXT_PUBLIC_AGENT_OPEN_AI_IMAGES,
    example: false,
  },
  NEXT_PUBLIC_AGENT_OPEN_AI_STT: {
    schema: z
      .string()
      .optional()
      .transform((v) => v === "true"),
    value: process.env.NEXT_PUBLIC_AGENT_OPEN_AI_STT,
    example: false,
  },
  NEXT_PUBLIC_AGENT_REPLICATE: {
    schema: z
      .string()
      .optional()
      .transform((v) => v === "true"),
    value: process.env.NEXT_PUBLIC_AGENT_REPLICATE,
    example: false,
  },
  NEXT_PUBLIC_AGENT_FAL_AI: {
    schema: z
      .string()
      .optional()
      .transform((v) => v === "true"),
    value: process.env.NEXT_PUBLIC_AGENT_FAL_AI,
    example: false,
  },
  NEXT_PUBLIC_AGENT_MODELS_LAB: {
    schema: z
      .string()
      .optional()
      .transform((v) => v === "true"),
    value: process.env.NEXT_PUBLIC_AGENT_MODELS_LAB,
    example: false,
  },
  NEXT_PUBLIC_AGENT_EDEN_AI_STT: {
    schema: z
      .string()
      .optional()
      .transform((v) => v === "true"),
    value: process.env.NEXT_PUBLIC_AGENT_EDEN_AI_STT,
    example: false,
  },
  NEXT_PUBLIC_AGENT_DEEPGRAM: {
    schema: z
      .string()
      .optional()
      .transform((v) => v === "true"),
    value: process.env.NEXT_PUBLIC_AGENT_DEEPGRAM,
    example: false,
  },
  NEXT_PUBLIC_AGENT_OPEN_AI_TTS: {
    schema: z
      .string()
      .optional()
      .transform((v) => v === "true"),
    value: process.env.NEXT_PUBLIC_AGENT_OPEN_AI_TTS,
    example: false,
  },
  NEXT_PUBLIC_AGENT_EDEN_AI_TTS: {
    schema: z
      .string()
      .optional()
      .transform((v) => v === "true"),
    value: process.env.NEXT_PUBLIC_AGENT_EDEN_AI_TTS,
    example: false,
  },
  NEXT_PUBLIC_AGENT_ELEVENLABS: {
    schema: z
      .string()
      .optional()
      .transform((v) => v === "true"),
    value: process.env.NEXT_PUBLIC_AGENT_ELEVENLABS,
    example: false,
  },
});
