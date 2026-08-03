/**
 * CLI Form Focus Manager
 *
 * Thin wrapper — each field uses Ink's useFocus() directly for Tab navigation.
 * CliFocusManager is kept as a no-op passthrough for backwards compat.
 * useCliFieldFocus delegates to Ink's native useFocus system.
 */

import { useFocus } from "ink";
import type { JSX, ReactNode } from "react";
import React from "react";

import { useFocusScopeRegister, useShouldFocus } from "../ui/dialog";

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

// ─── Arrow Capture ───────────────────────────────────────────────────────────
// The page moves focus between fields on ↑/↓. Some fields need those keys for
// themselves — a number field steps its value — so they claim the arrows while
// focused and the page skips its navigation. Mirrors the overlay lock in
// dialog.tsx: a module-level count, since the claim crosses component trees.

let arrowCaptureCount = 0;

/** True while a focused field is consuming ↑/↓ for its own value. */
export function areArrowsCaptured(): boolean {
  return arrowCaptureCount > 0;
}

/**
 * Claim ↑/↓ for this field while `active`. Released on blur/unmount, so a field
 * that never blurs cannot permanently disable arrow navigation.
 */
export function useCaptureArrows(active: boolean): void {
  React.useEffect(() => {
    if (!active) {
      return;
    }
    arrowCaptureCount += 1;
    return (): void => {
      arrowCaptureCount -= 1;
    };
  }, [active]);
}
