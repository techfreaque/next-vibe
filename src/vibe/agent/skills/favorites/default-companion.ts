/**
 * Default Companion
 *
 * Every favorites set must hold at least one companion (COMPANION_SKILLS:
 * Thea, Hermes). A user who adds a non-companion skill first (e.g. 4chan from
 * its public skill page) skips onboarding, so the default companion is added
 * alongside it: every variant of Thea, the same set onboarding seeds.
 *
 * Client-safe (no DB): shared by the server create path and the localStorage
 * repository for guests.
 */

import { COMPANION_SKILLS, type SkillVariant } from "../config";

export const DEFAULT_COMPANION_SKILL_ID = "thea" as const;

const COMPANION_SKILL_IDS: ReadonlySet<string> = new Set(
  COMPANION_SKILLS.map((skill) => skill.id),
);

/** True when `skillId` (plain, not merged with a variant) is a companion. */
export function isCompanionSkillId(skillId: string): boolean {
  return COMPANION_SKILL_IDS.has(skillId);
}

/** Every companion skill id (plain). */
export function getCompanionSkillIds(): string[] {
  return [...COMPANION_SKILL_IDS];
}

/** The default companion's variants, in onboarding order. */
export function getDefaultCompanionVariants(): readonly SkillVariant[] {
  return (
    COMPANION_SKILLS.find((skill) => skill.id === DEFAULT_COMPANION_SKILL_ID)
      ?.variants ?? []
  );
}
