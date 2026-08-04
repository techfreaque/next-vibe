/**
 * Central agent-context resolver (server-only) — THE single source of truth for
 * the favorite → skill → NO_SKILL cascade that drives BOTH the resolved chat
 * model AND the three tool sets (pinned / available / denied).
 *
 * Replaces three parallel, inconsistent cascades:
 *   - ExecuteToolGuards.resolveToolPermissions (execute gate)
 *   - resolveToolConfigCascade (ai-stream setup / schema injection)
 *   - resolveToolCascade (help tool)
 *
 * The three tool SETS, and their meaning:
 *   - pinned:    tools placed directly in the model's context (it SEES them).
 *   - available: tools the model can CALL via the execute-tool meta-tool. The
 *                CALLABLE superset is `pinned ∪ available` — a pinned tool is
 *                always callable (it is loaded as a real AI-SDK tool), so it
 *                must also pass the execute-tool permission gate.
 *   - denied:    blocked entirely. Subtractive; the ONLY way to remove a tool.
 *
 * Cascade per field: favorite → (if null) skill → (if only a model was passed,
 * i.e. the NO_SKILL_ID skill) role-based defaults. A skill's `available` list
 * ADDS to the role-default callable set; it never shrinks below it. Removal is
 * via `denied` only. `null` for available/pinned means "no restriction at any
 * level" (headless / cron / MCP) — preserved for regression-safety.
 */

import "server-only";

import type { DefaultFolderId } from "next-vibe/core/execution-context";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { ChatModelId } from "../ai-stream/models";
import { FOLDER_DENIED_TOOL_IDS } from "../chat/config";
import type { ToolConfigItem } from "../chat/settings/definition";
import type { AgentEnvAvailability } from "../env-availability";
import { DEFAULT_SKILLS } from "./config";
import { NO_SKILL_ID } from "./constants";
import type { FavoriteConfig } from "./favorites/db";
import type { CustomSkillConfig, SkillFavoriteContext } from "./resolver";
import { resolveSkillFavoriteContext } from "./resolver";

/** A normalized tool config entry (requiresConfirmation always boolean). */
type NormalizedTools = Array<{
  toolId: string;
  requiresConfirmation: boolean;
}> | null;

export interface ResolveAgentContextParams {
  /** Active favorite id (uuid / slug / "skillSlug__variant"). */
  favoriteId?: string | null;
  /**
   * Pre-loaded favorite — callers that already resolved it (ai-stream setup's
   * loadFavoriteOnce) pass it through so the favorite is queried EXACTLY once.
   * Pass `null` for "resolved, none"; leave undefined to resolve from favoriteId.
   */
  favoriteConfig?: FavoriteConfig | null;
  /** Skill id. Absent / NO_SKILL_ID → the NO_SKILL terminal (role defaults). */
  skillId?: string | null;
  /**
   * Pre-resolved favorite + skill + custom-skill context. Callers that already
   * ran resolveSkillFavoriteContext (ai-stream setup) pass it so NOTHING is
   * re-queried. When omitted the resolver runs it from favoriteId/favoriteConfig.
   */
  skillFavoriteContext?: SkillFavoriteContext;
  user: JwtPayloadType;
  /** Folder the conversation lives in — drives the folder-aware role defaults + folder denies. */
  rootFolderId: DefaultFolderId;
  logger: EndpointLogger;
  /** For symmetry with future model resolution; unused by the tool cascade today. */
  availability?: AgentEnvAvailability;
  locale?: CountryLanguage;
  /** Explicit model passthrough (frontend already resolved it). */
  model?: ChatModelId;
}

export interface ResolvedAgentContext {
  favoriteConfig: FavoriteConfig | null;
  /** Effective skill id (NO_SKILL_ID when none). */
  skill: string;
  /** Tools shown in context. null = use folder-role defaults (agent mode). */
  pinnedTools: NormalizedTools;
  /**
   * The CALLABLE superset (pinned ∪ available) minus nothing — denied is applied
   * separately by the gate. null = no restriction anywhere (all allowed).
   */
  availableTools: NormalizedTools;
  /** Union of skill + favorite + folder denies. Subtractive block. */
  deniedToolIds: Set<string>;
  promptAppend: string | null;
  memoryLimit: number | null;
  /**
   * The PRE-UNION skill base for available — needed by the help tool to
   * "materialize from null" (toggle-off) without the role-default union.
   */
  cascadeBase: NormalizedTools;
  /** The pre-union skill base for pinned. */
  pinnedBase: NormalizedTools;
}

/** Resolve a default OR custom skill's raw tool config (null for NO_SKILL). */
function resolveSkillToolConfig(
  effectiveSkillId: string,
  customSkill: CustomSkillConfig | null,
): {
  availableTools: ToolConfigItem[] | null;
  pinnedTools: ToolConfigItem[] | null;
  deniedTools: ToolConfigItem[] | null;
} {
  if (effectiveSkillId === NO_SKILL_ID) {
    // NO_SKILL declares no tool config → falls through to the role defaults.
    return { availableTools: null, pinnedTools: null, deniedTools: null };
  }
  const defaultSkill = DEFAULT_SKILLS.find((s) => s.id === effectiveSkillId);
  if (defaultSkill) {
    return {
      availableTools: defaultSkill.availableTools ?? null,
      pinnedTools: defaultSkill.pinnedTools ?? null,
      deniedTools: defaultSkill.deniedTools ?? null,
    };
  }
  // Custom skill — config already loaded by resolveSkillFavoriteContext.
  return {
    availableTools: customSkill?.availableTools ?? null,
    pinnedTools: customSkill?.pinnedTools ?? null,
    deniedTools: customSkill?.deniedTools ?? null,
  };
}

/** Union two tool lists by toolId (first-seen requiresConfirmation wins). */
function unionTools(
  a: NormalizedTools,
  b: NormalizedTools,
): Array<{ toolId: string; requiresConfirmation: boolean }> {
  const out = new Map<
    string,
    { toolId: string; requiresConfirmation: boolean }
  >();
  for (const item of a ?? []) {
    out.set(item.toolId, item);
  }
  for (const item of b ?? []) {
    if (!out.has(item.toolId)) {
      out.set(item.toolId, item);
    }
  }
  return [...out.values()];
}

/**
 * Resolve the full agent context for a turn: favorite/skill identity + the three
 * tool sets, driven by ONE favorite → skill → NO_SKILL cascade. Model resolution
 * folds in here in a later step; today callers keep their existing model path.
 */
export async function resolveAgentContext(
  params: ResolveAgentContextParams,
): Promise<ResolvedAgentContext> {
  const {
    favoriteId,
    favoriteConfig,
    skillId,
    skillFavoriteContext,
    user,
    rootFolderId,
    logger,
  } = params;

  // ONE favorite + custom-skill resolution — reuse the caller's when provided so
  // NOTHING is re-queried; otherwise resolve it once here.
  const ctx =
    skillFavoriteContext ??
    (await resolveSkillFavoriteContext({
      favoriteId,
      skillId,
      userId: user.isPublic ? undefined : user.id,
      favorite: favoriteConfig,
    }));

  const effectiveSkillId = ctx.favorite?.skillId ?? skillId ?? NO_SKILL_ID;
  const skillCfg = resolveSkillToolConfig(effectiveSkillId, ctx.customSkill);

  // ── denied = union(skill, favorite, folder) ──────────────────────────────
  const deniedToolIds = new Set<string>();
  for (const t of skillCfg.deniedTools ?? []) {
    deniedToolIds.add(t.toolId);
  }
  for (const t of ctx.favorite?.deniedTools ?? []) {
    deniedToolIds.add(t.toolId);
  }
  for (const toolId of FOLDER_DENIED_TOOL_IDS[rootFolderId] ?? []) {
    deniedToolIds.add(toolId);
  }

  // ── Cascade bases: favorite field wins, else skill field (pre-union) ──────
  const pinnedBase =
    ctx.favorite?.pinnedTools !== null &&
    ctx.favorite?.pinnedTools !== undefined
      ? ctx.favorite.pinnedTools
      : skillCfg.pinnedTools;
  const cascadeBase =
    ctx.favorite?.availableTools !== null &&
    ctx.favorite?.availableTools !== undefined
      ? ctx.favorite.availableTools
      : skillCfg.availableTools;

  // The CALLABLE set is restricted ONLY when a skill/favorite explicitly sets an
  // `availableTools` list (cascadeBase). PINNING alone never shrinks it — pins
  // are for STEERING (what the model sees in context), not a call-gate. So a
  // skill that only pins a few tools still leaves every role-allowed tool
  // callable via execute-tool (e.g. `rename-thread` housekeeping). When nothing
  // sets availableTools, keep null → "all allowed for the role".
  const pinnedTools: NormalizedTools = pinnedBase;

  let availableTools: NormalizedTools = null;
  if (cascadeBase !== null) {
    // An explicit availableTools list is the TRUTH: it IS the callable set (the
    // user/skill deliberately restricted it). Only PINNED tools are added on top
    // — a pinned tool is loaded as a real AI-SDK tool so it must also be callable
    // (a pin counts as allowed). Role defaults are NOT unioned in: that would
    // re-expose everything the restriction removed AND clobber the per-tool
    // requiresConfirmation flags the list carries. `null` (no restriction at any
    // level) still means "all allowed for the role".
    availableTools = unionTools(cascadeBase, pinnedBase);
  }

  const promptAppend = ctx.favorite?.promptAppend ?? null;
  const memoryLimit =
    ctx.favorite?.memoryLimit ?? ctx.customSkill?.memoryLimit ?? null;

  logger.debug("[resolveAgentContext] resolved", {
    skill: effectiveSkillId,
    favoriteId: ctx.favorite?.id ?? null,
    pinned: pinnedTools?.length ?? null,
    available: availableTools?.length ?? null,
    denied: deniedToolIds.size,
  });

  return {
    favoriteConfig: ctx.favorite,
    skill: effectiveSkillId,
    pinnedTools,
    availableTools,
    deniedToolIds,
    promptAppend,
    memoryLimit,
    cascadeBase,
    pinnedBase,
  };
}
