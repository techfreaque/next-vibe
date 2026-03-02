/**
 * Collapse State Management Store (Zustand)
 *
 * Manages collapse state for thinking sections and tool calls in message sequences.
 * Shared across all view modes (linear, flat, threaded) via a global Zustand store.
 *
 * **Behavior**:
 * - Thinking sections: Expanded while streaming, auto-collapse when content follows (unless user overrode)
 * - Tool calls: Collapsed when content follows, expanded when no content follows (unless user overrode)
 * - User overrides are always respected and never changed automatically
 *
 * **Architecture**:
 * - Tracks user overrides separately from auto-determined states
 * - Uses message ID + section type + index as unique key
 * - Provides helpers to determine default state based on sequence position
 */

import { create } from "zustand";

/**
 * Collapse state key for a specific section
 */
interface CollapseKey {
  messageId: string;
  sectionType: "thinking" | "tool";
  sectionIndex: number;
}

/**
 * Serialize collapse key to string for Map storage
 */
function serializeKey(key: CollapseKey): string {
  return `${key.messageId}:${key.sectionType}:${key.sectionIndex}`;
}

/**
 * Store state and actions
 */
export interface CollapseStateStore {
  /** Map of user overrides: serialized key -> collapsed state */
  userOverrides: Map<string, boolean>;

  /**
   * Check if a section is collapsed
   * Returns the user override if set, otherwise returns the auto-determined state
   */
  isCollapsed: (key: CollapseKey, autoCollapsed: boolean) => boolean;

  /**
   * Toggle collapse state for a section
   * This marks it as user-overridden
   */
  toggleCollapse: (key: CollapseKey, currentState: boolean) => void;

  /**
   * Check if user has overridden the collapse state for a section
   */
  hasUserOverride: (key: CollapseKey) => boolean;

  /**
   * Clear user override for a section (revert to auto-determined state)
   */
  clearOverride: (key: CollapseKey) => void;

  /**
   * Clear all user overrides for a message
   */
  clearMessageOverrides: (messageId: string) => void;
}

/**
 * Global Zustand store for collapse state — shared across all view modes.
 * Replaces the previous useState-based useCollapseState() hook.
 */
export const useCollapseState = create<CollapseStateStore>((set, get) => ({
  userOverrides: new Map(),

  isCollapsed: (key: CollapseKey, autoCollapsed: boolean): boolean => {
    const serialized = serializeKey(key);
    const override = get().userOverrides.get(serialized);

    // If user has overridden, use their preference
    if (override !== undefined) {
      return override;
    }

    // Otherwise use auto-determined state
    return autoCollapsed;
  },

  toggleCollapse: (key: CollapseKey, currentState: boolean): void => {
    const serialized = serializeKey(key);
    set((state) => {
      const next = new Map(state.userOverrides);
      next.set(serialized, !currentState);
      return { userOverrides: next };
    });
  },

  hasUserOverride: (key: CollapseKey): boolean => {
    const serialized = serializeKey(key);
    return get().userOverrides.has(serialized);
  },

  clearOverride: (key: CollapseKey): void => {
    const serialized = serializeKey(key);
    set((state) => {
      const next = new Map(state.userOverrides);
      next.delete(serialized);
      return { userOverrides: next };
    });
  },

  clearMessageOverrides: (messageId: string): void => {
    set((state) => {
      const next = new Map(state.userOverrides);
      for (const key of next.keys()) {
        if (key.startsWith(`${messageId}:`)) {
          next.delete(key);
        }
      }
      return { userOverrides: next };
    });
  },
}));

/**
 * Determine if a thinking section should be auto-collapsed
 *
 * @param hasContentAfter - Whether there's content after this thinking section
 * @param isStreaming - Whether the thinking section is still streaming
 * @returns true if should be collapsed, false if should be expanded
 */
export function shouldThinkingBeCollapsed(
  hasContentAfter: boolean,
  isStreaming: boolean,
): boolean {
  // While streaming: keep expanded so user can see progress
  if (isStreaming) {
    return false;
  }

  // After streaming complete:
  // - Collapse if there's content after (reduce noise)
  // - Keep expanded if no content after (user needs to see what happened)
  return hasContentAfter;
}

/**
 * Determine if a tool call should be auto-collapsed
 *
 * @param hasContentAfter - Whether there's content after this tool call
 * @param isExecuting - Whether the tool is still executing
 * @returns true if should be collapsed, false if should be expanded
 */
export function shouldToolBeCollapsed(
  hasContentAfter: boolean,
  isExecuting: boolean,
): boolean {
  // While executing: keep expanded so user can see progress
  if (isExecuting) {
    return false;
  }

  // After execution complete:
  // - Collapse if there's content after (reduce noise)
  // - Keep expanded if no content after (user needs to see results)
  return hasContentAfter;
}
