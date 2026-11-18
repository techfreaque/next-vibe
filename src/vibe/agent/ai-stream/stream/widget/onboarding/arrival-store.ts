"use client";

import { create } from "zustand";

/**
 * Skill a visitor arrived with (`/threads/<folder>/new?skill=<id>`, from the
 * skill landing page "Try it now"). The URL hook writes it once, the
 * onboarding controller consumes it: adds the skill, makes it active and,
 * when the visitor has no companion yet, asks for one.
 */
interface ArrivalState {
  pendingSkillId: string | null;
  setPendingSkillId: (skillId: string | null) => void;
}

export const useArrivalStore = create<ArrivalState>()((set) => ({
  pendingSkillId: null,
  setPendingSkillId: (skillId: string | null): void => {
    set({ pendingSkillId: skillId });
  },
}));
