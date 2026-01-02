/**
 * Collapse State Management Hook
 *
 * Manages collapse state for thinking sections and tool calls in message sequences.
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

import { useCallback, useState } from "react";

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
 * Hook return type
 */
interface UseCollapseStateReturn {
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
 * Hook for managing collapse state with user overrides
 */
export function useCollapseState(): UseCollapseStateReturn {
  // Map of user overrides: key -> collapsed state
  const [userOverrides, setUserOverrides] = useState<Map<string, boolean>>(new Map());

  const isCollapsed = useCallback(
    (key: CollapseKey, autoCollapsed: boolean): boolean => {
      const serialized = serializeKey(key);
      const override = userOverrides.get(serialized);

      // If user has overridden, use their preference
      if (override !== undefined) {
        return override;
      }

      // Otherwise use auto-determined state
      return autoCollapsed;
    },
    [userOverrides],
  );

  const toggleCollapse = useCallback((key: CollapseKey, currentState: boolean): void => {
    const serialized = serializeKey(key);
    setUserOverrides((prev) => {
      const next = new Map(prev);
      next.set(serialized, !currentState);
      return next;
    });
  }, []);

  const hasUserOverride = useCallback(
    (key: CollapseKey): boolean => {
      const serialized = serializeKey(key);
      return userOverrides.has(serialized);
    },
    [userOverrides],
  );

  const clearOverride = useCallback((key: CollapseKey): void => {
    const serialized = serializeKey(key);
    setUserOverrides((prev) => {
      const next = new Map(prev);
      next.delete(serialized);
      return next;
    });
  }, []);

  const clearMessageOverrides = useCallback((messageId: string): void => {
    setUserOverrides((prev) => {
      const next = new Map(prev);
      // Remove all keys that start with this messageId
      for (const key of next.keys()) {
        if (key.startsWith(`${messageId}:`)) {
          next.delete(key);
        }
      }
      return next;
    });
  }, []);

  return {
    isCollapsed,
    toggleCollapse,
    hasUserOverride,
    clearOverride,
    clearMessageOverrides,
  };
}

/**
 * Determine if a thinking section should be auto-collapsed
 *
 * @param hasContentAfter - Whether there's content after this thinking section
 * @param isStreaming - Whether the thinking section is still streaming
 * @returns true if should be collapsed, false if should be expanded
 */
export function shouldThinkingBeCollapsed(hasContentAfter: boolean, isStreaming: boolean): boolean {
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
export function shouldToolBeCollapsed(hasContentAfter: boolean, isExecuting: boolean): boolean {
  // While executing: keep expanded so user can see progress
  if (isExecuting) {
    return false;
  }

  // After execution complete:
  // - Collapse if there's content after (reduce noise)
  // - Keep expanded if no content after (user needs to see results)
  return hasContentAfter;
}
