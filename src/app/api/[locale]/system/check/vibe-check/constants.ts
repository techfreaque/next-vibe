export const VIBE_CHECK_ALIAS = "check" as const;
export const VIBE_CHECK_ALIAS_SHORT = "c" as const;

/**
 * Used by the MCP registry to exclude vibe-check from hot-reload.
 */
export const VIBE_CHECK_TOOL_NAMES: readonly string[] = [
  VIBE_CHECK_ALIAS,
  VIBE_CHECK_ALIAS_SHORT,
] as const;
