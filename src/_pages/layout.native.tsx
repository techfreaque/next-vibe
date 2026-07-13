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
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Body } from "next-vibe/ui/ui/body";
import type { JSX } from "react";

import { envClient } from "@/env/env-client";

import { RootProviders } from "./layout-shared";

const nativeAvailability: AgentEnvAvailability = {
  openRouter: envClient.NEXT_PUBLIC_AGENT_OPEN_ROUTER,
  claudeCode: envClient.NEXT_PUBLIC_AGENT_CLAUDE_CODE,
  voice: envClient.NEXT_PUBLIC_AGENT_VOICE,
  braveSearch: envClient.NEXT_PUBLIC_AGENT_BRAVE_SEARCH,
  kagiSearch: envClient.NEXT_PUBLIC_AGENT_KAGI_SEARCH,
  anySearch:
    envClient.NEXT_PUBLIC_AGENT_BRAVE_SEARCH ||
    envClient.NEXT_PUBLIC_AGENT_KAGI_SEARCH,
  uncensoredAI: envClient.NEXT_PUBLIC_AGENT_UNCENSORED_AI,
  freedomGPT: envClient.NEXT_PUBLIC_AGENT_FREEDOM_GPT,
  gabAI: envClient.NEXT_PUBLIC_AGENT_GAB_AI,
  veniceAI: envClient.NEXT_PUBLIC_AGENT_VENICE_AI,
  scrappey: envClient.NEXT_PUBLIC_AGENT_SCRAPPEY,
  openAiImages: envClient.NEXT_PUBLIC_AGENT_OPEN_AI_IMAGES,
  openAiStt: envClient.NEXT_PUBLIC_AGENT_OPEN_AI_STT,
  replicate: envClient.NEXT_PUBLIC_AGENT_REPLICATE,
  falAi: envClient.NEXT_PUBLIC_AGENT_FAL_AI,
  modelsLab: envClient.NEXT_PUBLIC_AGENT_MODELS_LAB,
  edenAiStt: envClient.NEXT_PUBLIC_AGENT_EDEN_AI_STT,
  deepgram: envClient.NEXT_PUBLIC_AGENT_DEEPGRAM,
  openAiTts: envClient.NEXT_PUBLIC_AGENT_OPEN_AI_TTS,
  edenAiTts: envClient.NEXT_PUBLIC_AGENT_EDEN_AI_TTS,
  elevenlabs: envClient.NEXT_PUBLIC_AGENT_ELEVENLABS,
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
