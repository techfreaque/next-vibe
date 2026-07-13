"use client";

import type { JSX, ReactNode } from "react";
import { createContext, useContext } from "react";

import type { AgentEnvAvailability } from "./env-availability";

const AgentAvailabilityContext = createContext<AgentEnvAvailability | null>(
  null,
);

export function AgentAvailabilityProvider({
  availability,
  children,
}: {
  availability: AgentEnvAvailability;
  children: ReactNode;
}): JSX.Element {
  return (
    <AgentAvailabilityContext.Provider value={availability}>
      {children}
    </AgentAvailabilityContext.Provider>
  );
}

export function useProviderAvailability(): AgentEnvAvailability {
  const ctx = useContext(AgentAvailabilityContext);
  if (!ctx) {
    // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
    throw new Error(
      "useProviderAvailability must be used within AgentAvailabilityProvider",
    );
  }
  return ctx;
}
