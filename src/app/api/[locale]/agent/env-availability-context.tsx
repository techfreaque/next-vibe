"use client";

/**
 * EnvAvailabilityContext
 *
 * Provides which AI provider API keys are configured to any client component.
 * Populated once by the server page and shared via React context.
 * Components outside ChatProvider can also read this.
 */

import type { JSX, ReactNode } from "react";
import { createContext, useContext } from "react";

import type { AgentEnvAvailability } from "./env-availability";

/** Fallback: assume everything is available (safe default for non-local-mode or unknown). */
const ALL_AVAILABLE: AgentEnvAvailability = {
  openRouter: true,
  voice: true,
  braveSearch: true,
  kagiSearch: true,
  anySearch: true,
  uncensoredAI: true,
  freedomGPT: true,
  gabAI: true,
  veniceAI: true,
  scrappey: true,
};

const EnvAvailabilityContext =
  createContext<AgentEnvAvailability>(ALL_AVAILABLE);

export function EnvAvailabilityProvider({
  availability,
  children,
}: {
  availability: AgentEnvAvailability;
  children: ReactNode;
}): JSX.Element {
  return (
    <EnvAvailabilityContext.Provider value={availability}>
      {children}
    </EnvAvailabilityContext.Provider>
  );
}

export function useEnvAvailability(): AgentEnvAvailability {
  return useContext(EnvAvailabilityContext);
}
