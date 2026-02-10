"use client";

import type { ReactNode } from "react";
import { createContext, useContext } from "react";

interface SelectorOnboardingContextValue {
  isOnboarding: boolean;
  companionCharacterId: string | null;
}

const SelectorOnboardingContext =
  createContext<SelectorOnboardingContextValue | null>(null);

interface SelectorOnboardingProviderProps {
  children: ReactNode;
  isOnboarding?: boolean;
  companionCharacterId?: string | null;
}

export function SelectorOnboardingProvider({
  children,
  isOnboarding = true,
  companionCharacterId = null,
}: SelectorOnboardingProviderProps): React.JSX.Element {
  return (
    <SelectorOnboardingContext.Provider
      value={{ isOnboarding, companionCharacterId }}
    >
      {children}
    </SelectorOnboardingContext.Provider>
  );
}

/**
 * Hook to get onboarding state
 * Returns false if used outside of provider (graceful degradation)
 */
export function useSelectorOnboarding(): boolean {
  const context = useContext(SelectorOnboardingContext);
  // If no provider, return false (not in onboarding mode)
  return context?.isOnboarding ?? false;
}

/**
 * Hook to get full onboarding context including companion character info
 */
export function useSelectorOnboardingContext(): SelectorOnboardingContextValue {
  const context = useContext(SelectorOnboardingContext);
  // If no provider, return defaults
  return (
    context ?? {
      isOnboarding: false,
      companionCharacterId: null,
    }
  );
}
