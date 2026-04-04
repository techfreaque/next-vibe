"use client";

/**
 * EnvAvailability Zustand Store
 *
 * Stores which AI provider API keys are configured.
 * Set once by the server page, readable from any client code (hooks or static methods).
 */

import { useEffect } from "react";
import { create } from "zustand";

import type { AgentEnvAvailability } from "./env-availability";

/** Fallback: assume everything is available (safe default for non-local-mode or unknown). */
const ALL_PROVIDERS_AVAILABLE: AgentEnvAvailability = {
  openRouter: true,
  claudeCode: true,
  voice: true,
  braveSearch: true,
  kagiSearch: true,
  anySearch: true,
  uncensoredAI: true,
  freedomGPT: true,
  gabAI: true,
  veniceAI: true,
  scrappey: true,
  openAiImages: true,
  replicate: true,
  falAi: true,
  modelsLab: true,
  unbottled: true,
};

interface EnvAvailabilityState {
  env: AgentEnvAvailability;
  setEnv: (env: AgentEnvAvailability) => void;
}

const useEnvAvailabilityStore = create<EnvAvailabilityState>((set) => ({
  env: ALL_PROVIDERS_AVAILABLE,
  setEnv: (env): void => set({ env }),
}));

/**
 * React hook — use in components.
 */
export function useEnvAvailability(): AgentEnvAvailability {
  return useEnvAvailabilityStore((s) => s.env);
}

/**
 * Get env availability outside React — use in static class methods, route handlers, etc.
 */
export function getEnvAvailability(): AgentEnvAvailability {
  return useEnvAvailabilityStore.getState().env;
}

/**
 * Client component that hydrates the Zustand store.
 * Uses useEffect to avoid setState-during-render React warnings.
 */
export function EnvAvailabilitySetter({
  env,
}: {
  env: AgentEnvAvailability;
}): null {
  useEffect(() => {
    useEnvAvailabilityStore.setState({ env });
  }, [env]);

  return null;
}
