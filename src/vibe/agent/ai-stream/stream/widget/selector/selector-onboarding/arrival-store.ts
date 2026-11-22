"use client";

import { create } from "zustand";

/**
 * Skill a visitor arrived with (`/threads/<folder>/new?skill=<id>`, from the
 * skill landing page "Try it now"). The URL hook (or the onboarding
 * controller, whichever runs first) writes it; the selector setup adds it
 * when it completes, or the controller adds it directly when the visitor is
 * already set up or closes the setup without finishing.
 *
 * `leavingForAuth` is set when a guest follows the sign-up / log-in hint, so
 * leaving the chat for the auth page does not count as dismissing the setup.
 */
interface ArrivalState {
  pendingSkillId: string | null;
  setPendingSkillId: (skillId: string | null) => void;
  leavingForAuth: boolean;
  setLeavingForAuth: (leaving: boolean) => void;
}

export const useArrivalStore = create<ArrivalState>()((set) => ({
  pendingSkillId: null,
  setPendingSkillId: (skillId: string | null): void => {
    set({ pendingSkillId: skillId });
  },
  leavingForAuth: false,
  setLeavingForAuth: (leaving: boolean): void => {
    set({ leavingForAuth: leaving });
  },
}));
