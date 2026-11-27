/**
 * Agent-surface pin resolution: the DB-backed half of the help listing.
 *
 * Reads the caller's chat settings, active favorite and skill cascade to answer
 * "which tools are pinned / allowed", then narrows the listing accordingly and
 * produces the counts the web favorites console renders as filter tabs.
 *
 * Split out of repository.ts because it is the only part of help that needs a
 * database and an agent context. Enumeration proper (meta-filter.ts) and
 * serialization (serialize.ts) stay pure, so a build without favorites, skills or
 * a web console declines this module instead of editing around an inline block.
 *
 * The dynamic imports below are deliberate and stay dynamic: help is reachable on
 * CLI and MCP where the database layer may never be touched, and hoisting them to
 * static imports would pull the DB into every help invocation. Extraction must not
 * change WHEN anything binds.
 */

import "server-only";

import {
  normalizeToolPreferences,
  type ToolPreferences,
} from "../../agent/chat/settings/tool-preferences";
import { getPreferredName } from "../../core/core-utils/path";
import type { EndpointMeta } from "../../core/definition/endpoints-meta";
import { permissionsRegistry } from "../../core/permissions/registry";
import type { JwtPayloadType } from "../../identity/auth/types";
import type { EndpointLogger } from "../../logger/types";
import { Platform } from "../../platforms/platforms";
import type { HelpGetRequestOutput } from "../definition";
import { filterMetaForUser, inSet } from "./meta-filter";

/** Pre-union skill base lists, as resolveAgentContext returns them. */
type ToolBase = Array<{ toolId: string; requiresConfirmation: boolean }>;

export interface AgentPinResolution {
  toolPreferences: ToolPreferences;
  legacyWebPins: string[] | null;
  aiAvailableToolIds?: string[];
  pinnedCount: number | undefined;
  allowedCount: number | undefined;
  webPinnedCount: number | undefined;
  cliAllowedCount: number | undefined;
  mcpPinnedCount: number | undefined;
  mcpAllowedCount: number | undefined;
  /**
   * The cascade base the client materializes from when a favorite has no explicit
   * allowlist. Falls back to the unnarrowed AI set when resolution fails.
   */
  aiMetaForStats: EndpointMeta[];
  cascadeBase: ToolBase | null;
  pinnedBase: ToolBase | null;
  /** Narrowed listing for the active statsFilter, or null to leave it untouched. */
  filteredMeta: EndpointMeta[] | null;
}

export async function resolveAgentPins(params: {
  allMeta: EndpointMeta[];
  /** All AI-platform tools for the effective user — computed by the caller so the
   * failure path can still report allAiToolIds. */
  aiMeta: EndpointMeta[];
  webMeta: EndpointMeta[];
  effectiveUser: JwtPayloadType;
  user: JwtPayloadType;
  viewAsRole: HelpGetRequestOutput["viewAsRole"];
  statsFilter: NonNullable<HelpGetRequestOutput["statsFilter"]>;
  isAdmin: boolean;
  chatContext?: Pick<
    HelpGetRequestOutput,
    "chatRootFolderId" | "chatFavoriteId" | "chatSkillId"
  >;
  logger: EndpointLogger;
}): Promise<AgentPinResolution> {
  const {
    allMeta,
    aiMeta,
    webMeta,
    effectiveUser,
    user,
    viewAsRole,
    statsFilter,
    isAdmin,
    chatContext,
    logger,
  } = params;

  // Resolution failure must not blank the listing — fall through with the
  // unfiltered list and no counts, exactly as the inline version did.
  const fallback: AgentPinResolution = {
    toolPreferences: {},
    legacyWebPins: null,
    pinnedCount: undefined,
    allowedCount: undefined,
    webPinnedCount: undefined,
    cliAllowedCount: undefined,
    mcpPinnedCount: undefined,
    mcpAllowedCount: undefined,
    aiMetaForStats: aiMeta,
    cascadeBase: null,
    pinnedBase: null,
    filteredMeta: null,
  };

  if (user.isPublic) {
    return fallback;
  }
  const userId = user.id;

  try {
    const { getDefaultToolIdsForUser, getDefaultWebPinnedIdsForUser } =
      await import("../../agent/chat/constants");

    const { db } = await import("../../database");
    const { chatSettings } = await import("../../agent/chat/settings/db");
    const { DefaultFolderId } =
      await import("next-vibe/core/execution-context");
    const { eq } = await import("drizzle-orm");

    // webPinnedTools: per-user sidebar bookmarks (independent of AI pinnedTools)
    // availableTools: AI-allowed tools from the active favorite
    // pinnedTools: AI-pinned tools (always in context) from the active favorite
    let dbWebPinned: string[] | null = null;
    let dbPinned: Array<{ toolId: string }> | null = null;
    let cascadeBase: ToolBase | null = null;
    let pinnedBase: ToolBase | null = null;

    const [settingsRow] = await db
      .select({
        activeFavoriteId: chatSettings.activeFavoriteId,
        webPinnedTools: chatSettings.webPinnedTools,
        toolPreferences: chatSettings.toolPreferences,
      })
      .from(chatSettings)
      .where(eq(chatSettings.userId, userId))
      .limit(1);

    if (settingsRow) {
      dbWebPinned = settingsRow.webPinnedTools ?? null;
    }

    const toolPreferences = viewAsRole
      ? {}
      : normalizeToolPreferences(settingsRow?.toolPreferences);
    const { resolveAgentContext } =
      await import("../../agent/skills/resolve-context");
    const resolved = await resolveAgentContext({
      favoriteId: viewAsRole
        ? undefined
        : (chatContext?.chatFavoriteId ??
          (chatContext?.chatSkillId
            ? undefined
            : settingsRow?.activeFavoriteId)),
      skillId: viewAsRole ? undefined : chatContext?.chatSkillId,
      user: effectiveUser,
      rootFolderId: chatContext?.chatRootFolderId ?? DefaultFolderId.PRIVATE,
      logger,
      toolPreferences,
    });
    dbPinned = resolved.pinnedTools;
    cascadeBase = resolved.cascadeBase;
    pinnedBase = resolved.pinnedBase;
    const callable = resolved.availableTools?.map(({ toolId }) =>
      getPreferredName(toolId),
    );
    const aiAvailableToolIds = aiMeta
      .map(({ toolName }) => getPreferredName(toolName))
      .filter(
        (id) =>
          !resolved.deniedToolIds.has(id) &&
          (!callable || callable.includes(id)),
      );

    // Web sidebar pinned: from webPinnedTools on settings (null = use defaults)
    const webPinnedIds: Set<string> =
      dbWebPinned !== null && !viewAsRole
        ? new Set(dbWebPinned)
        : new Set(getDefaultWebPinnedIdsForUser(effectiveUser));

    // AI pinned: from favorite's pinnedTools (null = use system defaults)
    const aiPinnedIds: Set<string> =
      dbPinned !== null && !viewAsRole
        ? new Set(dbPinned.map((entry) => entry.toolId))
        : new Set(getDefaultToolIdsForUser(effectiveUser));

    // cascadeBaseIds: the set the client should materialize from when toggling a tool off.
    // = skill's allowed list, or null = full AI platform.
    const cascadeBaseIds: Set<string> | null =
      cascadeBase !== null && !viewAsRole
        ? new Set(
            cascadeBase
              .map((entry) => entry.toolId)
              .filter((id) =>
                aiMeta.some(
                  (m) => m.toolName === id || m.aliases.some((a) => a === id),
                ),
              ),
          )
        : null;

    // AI counts
    const pinnedCount = aiMeta.filter((m) => inSet(m, aiPinnedIds)).length;
    const webPinnedCount = webMeta.filter((m) => inSet(m, webPinnedIds)).length;
    // allowed = all AI-platform tools (platform capability, not user/skill restriction)
    const allowedCount = aiMeta.length;

    // CLI/MCP meta — computed once, reused for both counts and filter application.
    // Admin-only: non-admins never see CLI/MCP-specific breakdowns.
    let cliMetaCached: EndpointMeta[] | null = null;
    let mcpMetaCached: EndpointMeta[] | null = null;
    const getCliMeta = (): EndpointMeta[] => {
      cliMetaCached ??= filterMetaForUser(allMeta, Platform.CLI, effectiveUser);
      return cliMetaCached;
    };
    const getMcpMeta = (): EndpointMeta[] => {
      mcpMetaCached ??= filterMetaForUser(allMeta, Platform.MCP, effectiveUser);
      return mcpMetaCached;
    };

    let cliAllowedCount: number | undefined;
    let mcpPinnedCount: number | undefined;
    let mcpAllowedCount: number | undefined;
    if (isAdmin) {
      const cliMeta = getCliMeta();
      const mcpMeta = getMcpMeta();
      cliAllowedCount = cliMeta.length;
      // MCP: pinned = the discovery list (MCP_VISIBLE opt-in, via the same check the
      // server lists through); allowed = all MCP-callable tools.
      mcpPinnedCount = mcpMeta.filter(
        (m) =>
          permissionsRegistry.checkMcpDiscoveryAccess(m.allowedRoles).allowed,
      ).length;
      mcpAllowedCount = mcpMeta.length;
    }

    // allAiToolIds: the cascade base the client uses when materializing from null.
    const aiMetaForStats =
      cascadeBaseIds !== null
        ? aiMeta.filter((m) => inSet(m, cascadeBaseIds))
        : aiMeta;

    // Apply the active statsFilter to narrow the tool list returned to the client.
    let filteredMeta: EndpointMeta[] | null = null;
    if (statsFilter === "pinned") {
      filteredMeta = aiMeta.filter((m) => inSet(m, aiPinnedIds));
    } else if (statsFilter === "webPinned") {
      filteredMeta = webMeta.filter((m) => inSet(m, webPinnedIds));
    } else if (statsFilter === "web") {
      filteredMeta = webMeta;
    } else if (
      statsFilter === "allowed" ||
      (statsFilter === "all" && !isAdmin)
    ) {
      filteredMeta = aiMeta;
    } else if (statsFilter === "cliAllowed" && isAdmin) {
      filteredMeta = getCliMeta();
    } else if (statsFilter === "mcpPinned" && isAdmin) {
      // Goes through checkMcpDiscoveryAccess rather than testing for the marker
      // directly, so this view cannot drift from what the server actually lists
      // (the marker alone ignores PRODUCTION_OFF / MCP_OFF / CLI_OFF).
      filteredMeta = getMcpMeta().filter(
        (m) =>
          permissionsRegistry.checkMcpDiscoveryAccess(m.allowedRoles).allowed,
      );
    } else if (statsFilter === "mcpAllowed" && isAdmin) {
      filteredMeta = getMcpMeta();
    }

    return {
      toolPreferences,
      legacyWebPins: viewAsRole ? null : dbWebPinned,
      aiAvailableToolIds,
      pinnedCount,
      allowedCount,
      webPinnedCount,
      cliAllowedCount,
      mcpPinnedCount,
      mcpAllowedCount,
      aiMetaForStats,
      cascadeBase,
      pinnedBase,
      filteredMeta,
    };
  } catch (error) {
    logger.warn("Unable to load tool preferences", {
      message: error instanceof Error ? error.message : String(error),
    });
    // Favorite fetch failed - fall through with unfiltered list
    return fallback;
  }
}

/**
 * Public visitors have no settings or favorites, so their pins are the role
 * defaults. Narrows the visitor's web listing to the active pinned view
 * server-side: filtering after pagination would show short or empty pages.
 * "all"/"allowed" leave the listing untouched (null).
 */
export async function narrowPublicPins(
  meta: EndpointMeta[],
  effectiveUser: JwtPayloadType,
  statsFilter: NonNullable<HelpGetRequestOutput["statsFilter"]>,
): Promise<EndpointMeta[] | null> {
  if (statsFilter !== "pinned" && statsFilter !== "webPinned") {
    return null;
  }
  const { getDefaultToolIdsForUser, getDefaultWebPinnedIdsForUser } =
    await import("../../agent/chat/constants");
  const ids = new Set(
    statsFilter === "pinned"
      ? getDefaultToolIdsForUser(effectiveUser)
      : getDefaultWebPinnedIdsForUser(effectiveUser),
  );
  return meta.filter((m) => inSet(m, ids));
}
