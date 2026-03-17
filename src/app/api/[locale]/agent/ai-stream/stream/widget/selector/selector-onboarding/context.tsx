"use client";

import type { ReactNode } from "react";
import { createContext, useContext } from "react";

interface SelectorOnboardingContextValue {
  isOnboarding: boolean;
  companionSkillId: string | null;
}

const SelectorOnboardingContext =
  createContext<SelectorOnboardingContextValue | null>(null);

interface SelectorOnboardingProviderProps {
  children: ReactNode;
  isOnboarding?: boolean;
  companionSkillId?: string | null;
}

export function SelectorOnboardingProvider({
  children,
  isOnboarding = true,
  companionSkillId = null,
}: SelectorOnboardingProviderProps): React.JSX.Element {
  return (
    <SelectorOnboardingContext.Provider
      value={{ isOnboarding, companionSkillId }}
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
 * Hook to get full onboarding context including companion skill info
 */
export function useSelectorOnboardingContext(): SelectorOnboardingContextValue {
  const context = useContext(SelectorOnboardingContext);
  // If no provider, return defaults
  return (
    context ?? {
      isOnboarding: false,
      companionSkillId: null,
    }
  );
}
