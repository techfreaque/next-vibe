/**
 * Cortex Tool Aliases
 */
export const CORTEX_LIST_ALIAS = "cortex-list";
export const CORTEX_READ_ALIAS = "cortex-read";
export const CORTEX_WRITE_ALIAS = "cortex-write";
export const CORTEX_EDIT_ALIAS = "cortex-edit";
export const CORTEX_MKDIR_ALIAS = "cortex-mkdir";
export const CORTEX_MOVE_ALIAS = "cortex-move";
export const CORTEX_DELETE_ALIAS = "cortex-delete";
export const CORTEX_TREE_ALIAS = "cortex-tree";
export const CORTEX_SEARCH_ALIAS = "cortex-search";

/**
 * Folder-type icon mapping for dynamicIcon on cortex endpoint definitions.
 * Maps mount path prefixes to their specific IconKey.
 */
export const CORTEX_FOLDER_ICONS = {
  memories: "brain",
  documents: "file-text",
  threads: "message-square",
  skills: "zap",
  tasks: "square-check",
} as const;

/**
 * Resolve the icon for a cortex path based on its mount prefix.
 * Used by dynamicIcon on cortex definitions.
 * Returns undefined for unknown paths (falls back to definition's static icon).
 */
export function resolveCortexIcon(
  path: string | undefined,
): (typeof CORTEX_FOLDER_ICONS)[keyof typeof CORTEX_FOLDER_ICONS] | undefined {
  if (!path) {
    return undefined;
  }
  const segment = path.replace(/^\//, "").split("/")[0];
  if (segment && segment in CORTEX_FOLDER_ICONS) {
    return CORTEX_FOLDER_ICONS[segment as keyof typeof CORTEX_FOLDER_ICONS];
  }
  return undefined;
}
