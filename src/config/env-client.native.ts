/* eslint-disable i18next/no-literal-string */
import Constants from "expo-constants";
import { Environment } from "next-vibe/shared/utils/env-util";

import { DEFAULT_PROJECT_URL } from "@/config/constants";
import type { EnvClient } from "@/config/env-client";

// React Native global type
declare const __DEV__: boolean;

// Platform detection for React Native (exported separately)
const isServer = false;
const isReactNative = true;
const isBrowser = false;

export const requireEnvs = true;

export const platform = {
  isServer,
  isReactNative,
  isBrowser,
};

// Get dev server IP from Expo config
const devServerIp = Constants.expoConfig?.hostUri?.split(":")[0] ?? "localhost";

/**
 * React Native client environment
 */
export const envClient: EnvClient = {
  NODE_ENV: __DEV__ ? Environment.DEVELOPMENT : Environment.PRODUCTION,
  NEXT_PUBLIC_APP_URL: `http://${devServerIp}:3000`,
  NEXT_PUBLIC_TEST_SERVER_URL: `http://${devServerIp}:3000`,
  NEXT_PUBLIC_DEBUG_PRODUCTION: false,
  NEXT_PUBLIC_LOCAL_MODE: false,
  NEXT_PUBLIC_PROJECT_URL: DEFAULT_PROJECT_URL,
  NEXT_PUBLIC_VIBE_IS_CLOUD: false,
  // Native assumes all providers available - keys are configured server-side
  NEXT_PUBLIC_AGENT_OPEN_ROUTER: true,
  NEXT_PUBLIC_AGENT_CLAUDE_CODE: false,
  NEXT_PUBLIC_AGENT_VOICE: true,
  NEXT_PUBLIC_AGENT_BRAVE_SEARCH: true,
  NEXT_PUBLIC_AGENT_KAGI_SEARCH: true,
  NEXT_PUBLIC_AGENT_UNCENSORED_AI: true,
  NEXT_PUBLIC_AGENT_FREEDOM_GPT: true,
  NEXT_PUBLIC_AGENT_GAB_AI: true,
  NEXT_PUBLIC_AGENT_VENICE_AI: true,
  NEXT_PUBLIC_AGENT_SCRAPPEY: true,
  NEXT_PUBLIC_AGENT_OPEN_AI_IMAGES: true,
  NEXT_PUBLIC_AGENT_OPEN_AI_STT: true,
  NEXT_PUBLIC_AGENT_REPLICATE: true,
  NEXT_PUBLIC_AGENT_FAL_AI: true,
  NEXT_PUBLIC_AGENT_MODELS_LAB: true,
  NEXT_PUBLIC_AGENT_UNBOTTLED: true,
  NEXT_PUBLIC_AGENT_EDEN_AI_STT: true,
  NEXT_PUBLIC_AGENT_DEEPGRAM: true,
  NEXT_PUBLIC_AGENT_OPEN_AI_TTS: true,
  NEXT_PUBLIC_AGENT_EDEN_AI_TTS: true,
  NEXT_PUBLIC_AGENT_ELEVENLABS: true,
};
