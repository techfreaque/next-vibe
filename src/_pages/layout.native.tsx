"use custom";

/**
 * React Native Root Layout
 * Platform-specific root layout for Expo/React Native
 * Uses shared providers from layout-shared.tsx
 * Body component already provides SafeAreaView wrapper
 */

import { PortalHost } from "@rn-primitives/portal";
import { Slot, useLocalSearchParams } from "expo-router";
import type { AgentEnvAvailability } from "next-vibe/agent/env-availability";
import { agentClientEnv } from "next-vibe/agent/env-client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Body } from "next-vibe/ui/ui/body";
import type { JSX } from "react";

import { RootProviders } from "./layout-shared";

const nativeAvailability: AgentEnvAvailability = {
  openRouter: agentClientEnv.NEXT_PUBLIC_AGENT_OPEN_ROUTER,
  claudeCode: agentClientEnv.NEXT_PUBLIC_AGENT_CLAUDE_CODE,
  voice: agentClientEnv.NEXT_PUBLIC_AGENT_VOICE,
  braveSearch: agentClientEnv.NEXT_PUBLIC_AGENT_BRAVE_SEARCH,
  kagiSearch: agentClientEnv.NEXT_PUBLIC_AGENT_KAGI_SEARCH,
  anySearch:
    agentClientEnv.NEXT_PUBLIC_AGENT_BRAVE_SEARCH ||
    agentClientEnv.NEXT_PUBLIC_AGENT_KAGI_SEARCH,
  uncensoredAI: agentClientEnv.NEXT_PUBLIC_AGENT_UNCENSORED_AI,
  freedomGPT: agentClientEnv.NEXT_PUBLIC_AGENT_FREEDOM_GPT,
  gabAI: agentClientEnv.NEXT_PUBLIC_AGENT_GAB_AI,
  veniceAI: agentClientEnv.NEXT_PUBLIC_AGENT_VENICE_AI,
  scrappey: agentClientEnv.NEXT_PUBLIC_AGENT_SCRAPPEY,
  openAiImages: agentClientEnv.NEXT_PUBLIC_AGENT_OPEN_AI_IMAGES,
  openAiStt: agentClientEnv.NEXT_PUBLIC_AGENT_OPEN_AI_STT,
  replicate: agentClientEnv.NEXT_PUBLIC_AGENT_REPLICATE,
  falAi: agentClientEnv.NEXT_PUBLIC_AGENT_FAL_AI,
  modelsLab: agentClientEnv.NEXT_PUBLIC_AGENT_MODELS_LAB,
  edenAiStt: agentClientEnv.NEXT_PUBLIC_AGENT_EDEN_AI_STT,
  deepgram: agentClientEnv.NEXT_PUBLIC_AGENT_DEEPGRAM,
  openAiTts: agentClientEnv.NEXT_PUBLIC_AGENT_OPEN_AI_TTS,
  edenAiTts: agentClientEnv.NEXT_PUBLIC_AGENT_EDEN_AI_TTS,
  elevenlabs: agentClientEnv.NEXT_PUBLIC_AGENT_ELEVENLABS,
  unbottledSystem: false,
  unbottledForce: false,
};

export default function RootLayoutNative(): JSX.Element {
  const { locale } = useLocalSearchParams<{ locale: CountryLanguage }>();
  return (
    <Body>
      <RootProviders locale={locale} availability={nativeAvailability}>
        <Slot />
        <PortalHost />
      </RootProviders>
    </Body>
  );
}
