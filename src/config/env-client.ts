/**
 * Core Client Environment
 */

import { Environment } from "next-vibe/shared/utils/env-util";
import { z } from "zod";

import { defineEnvClient } from "@/app/api/[locale]/system/unified-interface/shared/env/define-env-client";
import { DEFAULT_PROJECT_URL } from "@/config/constants";

const isServer = typeof window === "undefined";
const isBrowser = !isServer && typeof document !== "undefined";

export const platform = { isServer, isReactNative: false, isBrowser };

export const {
  envClient,
  schema: envClientSchema,
  examples: envClientExamples,
} = defineEnvClient({
  NODE_ENV: {
    schema: z.enum(Environment).default(Environment.DEVELOPMENT),
    value: process.env.NODE_ENV,
    example: "development",
  },
  NEXT_PUBLIC_APP_URL: {
    schema: z
      .string()
      .url()
      .default("http://localhost:3000")
      .transform((s) =>
        isBrowser ? window.location.origin : s.replace(/\/$/, ""),
      ),
    value: process.env.NEXT_PUBLIC_APP_URL,
    example: "http://localhost:3000",
  },

  NEXT_PUBLIC_PROJECT_URL: {
    schema: z.string().url().default(DEFAULT_PROJECT_URL),
    value: process.env.NEXT_PUBLIC_PROJECT_URL,
    example: DEFAULT_PROJECT_URL,
    comment: `Project URL - defaults to ${DEFAULT_PROJECT_URL}. Override to use your own domain.`,
    commented: true,
  },
  NEXT_PUBLIC_LOCAL_MODE: {
    schema: z
      .string()
      .optional()
      .default("false")
      .transform((v) => v === "true"),
    value: process.env.NEXT_PUBLIC_LOCAL_MODE,
    example: "false",
  },

  NEXT_PUBLIC_TEST_SERVER_URL: {
    schema: z.string().optional(),
    value: process.env.NEXT_PUBLIC_TEST_SERVER_URL,
    example: "http://localhost:4000",
  },
  NEXT_PUBLIC_DEBUG_PRODUCTION: {
    schema: z
      .string()
      .optional()
      .default("false")
      .transform((v) => v === "true"),
    value: process.env.NEXT_PUBLIC_DEBUG_PRODUCTION,
    example: "false",
  },
  NEXT_PUBLIC_VIBE_IS_CLOUD: {
    schema: z
      .string()
      .optional()
      .default("false")
      .transform((v) => v === "true"),
    value: process.env.NEXT_PUBLIC_VIBE_IS_CLOUD,
    example: "false",
  },

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
  NEXT_PUBLIC_AGENT_UNBOTTLED: {
    schema: z
      .string()
      .optional()

      .transform((v) => v === "true"),
    value: process.env.NEXT_PUBLIC_AGENT_UNBOTTLED,
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
export type EnvClient = typeof envClient;
