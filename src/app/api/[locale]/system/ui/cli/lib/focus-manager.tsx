/**
 * CLI Form Focus Manager
 *
 * Thin wrapper — each field uses Ink's useFocus() directly for Tab navigation.
 * CliFocusManager is kept as a no-op passthrough for backwards compat.
 * useCliFieldFocus delegates to Ink's native useFocus system.
 */

import { useFocus } from "ink";
import {
  useFocusScopeRegister,
  useShouldFocus,
} from "next-vibe/ui/cli/ui/dialog";
import type { JSX, ReactNode } from "react";
import React from "react";

export function CliFocusManager({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return <>{children}</>;
}

/**
 * Each focusable field calls this hook to participate in Ink's Tab focus cycle.
 * Ink's useFocus handles Tab advancement automatically across all registered fields.
 * Returns true when this field has focus (ink-text-input should capture keys).
 */
export function useCliFieldFocus(id: string, autoFocus = false): boolean {
  const shouldFocus = useShouldFocus();
  const { isFocused } = useFocus({ id, autoFocus, isActive: shouldFocus });
  useFocusScopeRegister(id);
  return isFocused;
}
