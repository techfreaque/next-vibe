/**
 * Tool config normalization (server-only).
 *
 * The favorite → skill → NO_SKILL/role-default cascade now lives ONCE in
 * `resolve-context.ts` (`resolveAgentContext`). This module keeps only the
 * shared `normalizeToolConfig` helper both sides use.
 */

import "server-only";

export type ResolvedAvailableTools = Array<{
  toolId: string;
  requiresConfirmation: boolean;
}> | null;

/** Normalize DB tool config items — ensures requiresConfirmation is always boolean */
export function normalizeToolConfig(
  items:
    | Array<{ toolId: string; requiresConfirmation?: boolean | null }>
    | null
    | undefined,
): Array<{ toolId: string; requiresConfirmation: boolean }> | null {
  if (!items) {
    return null;
  }
  return items.map((item) => ({
    toolId: item.toolId,
    requiresConfirmation: item.requiresConfirmation ?? false,
  }));
}

/**
 * Resolve the effective availableTools for a skill.
 * Does NOT include the favorite layer — call resolveToolCascade for the full cascade.
 *
 * Returns null if the skill has no tool restriction (all tools allowed).
 */
export async function resolveSkillAvailableTools(
  skillId: string | null | undefined,
): Promise<ResolvedAvailableTools> {
  if (!skillId) {
    return null;
  }

  const defaultSkill = DEFAULT_SKILLS.find((s) => s.id === skillId);
  if (defaultSkill) {
    return normalizeToolConfig(defaultSkill.availableTools ?? null);
  }

  const skillIdCondition = isUuid(skillId)
    ? eq(customSkills.id, skillId)
    : eq(customSkills.slug, skillId);

  const [row] = await db
    .select({ availableTools: customSkills.availableTools })
    .from(customSkills)
    .where(skillIdCondition)
    .limit(1);

  return normalizeToolConfig(row?.availableTools ?? null);
}

/**
 * Resolve the effective pinnedTools for a skill.
 * Returns null if the skill has no pinned tool restriction (use role defaults).
 */
export async function resolveSkillPinnedTools(
  skillId: string | null | undefined,
): Promise<ResolvedAvailableTools> {
  if (!skillId) {
    return null;
  }

  const defaultSkill = DEFAULT_SKILLS.find((s) => s.id === skillId);
  if (defaultSkill) {
    return normalizeToolConfig(defaultSkill.pinnedTools ?? null);
  }

  const skillIdCondition = isUuid(skillId)
    ? eq(customSkills.id, skillId)
    : eq(customSkills.slug, skillId);

  const [row] = await db
    .select({ pinnedTools: customSkills.pinnedTools })
    .from(customSkills)
    .where(skillIdCondition)
    .limit(1);

  return normalizeToolConfig(row?.pinnedTools ?? null);
}

export interface ToolCascadeInput {
  /** From active favorite — null = not set / inherit from skill */
  favoriteAvailableTools: ToolConfigItem[] | null | undefined;
  /** From active favorite — null = not set / inherit from skill */
  favoritePinnedTools: ToolConfigItem[] | null | undefined;
  /** Skill ID from the active favorite */
  skillId: string | null | undefined;
}

/**
 * Resolve the effective availableTools and pinnedTools using the full cascade:
 *   1. favorite field (if not null)
 *   2. skill field (if favorite is null)
 *   3. null = all tools allowed / use role defaults
 *
 * Also returns cascade bases separately — used by the help tool when
 * materializing an explicit list from null (e.g. toggle-off).
 */
export async function resolveToolCascade(input: ToolCascadeInput): Promise<{
  /** Effective availableTools (null = all allowed) */
  availableTools: ResolvedAvailableTools;
  /** The cascade base for availableTools: skill's list, or null = all AI tools. */
  cascadeBase: ResolvedAvailableTools;
  /** Effective pinnedTools (null = use role defaults) */
  pinnedTools: ResolvedAvailableTools;
  /** The cascade base for pinnedTools: skill's list, or null = use role defaults. */
  pinnedBase: ResolvedAvailableTools;
}> {
  const [skillAllowed, skillPinned] = await Promise.all([
    resolveSkillAvailableTools(input.skillId),
    resolveSkillPinnedTools(input.skillId),
  ]);

  const availableTools =
    input.favoriteAvailableTools !== null &&
    input.favoriteAvailableTools !== undefined
      ? normalizeToolConfig(input.favoriteAvailableTools)
      : skillAllowed;

  const pinnedTools =
    input.favoritePinnedTools !== null &&
    input.favoritePinnedTools !== undefined
      ? normalizeToolConfig(input.favoritePinnedTools)
      : skillPinned;

  return {
    availableTools,
    cascadeBase: skillAllowed,
    pinnedTools,
    pinnedBase: skillPinned,
  };
}
