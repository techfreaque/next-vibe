"use client";

import type { WidgetData } from "next-vibe/core/utils/json";
import type { JSX } from "react";
import { createContext, type ReactNode, useContext } from "react";

/**
 * Picker context — carries the selection callback when a widget is opened in picker mode.
 *
 * Usage in list/lookup widgets:
 *   const onPick = usePickerCallback<{ id: string; title: string }>();
 *   if (onPick) {
 *     onPick({ id: item.id, title: item.title });  // picker mode: return value
 *     navigation.pop();
 *   } else {
 *     navigation.push(...);  // normal mode: drill into detail
 *   }
 *
 * The context is provided by EndpointsPage around each navigation stack layer
 * when that layer carries a pickerCallback in its NavigationStackEntry.
 */
const PickerContext = createContext<((value: WidgetData) => void) | undefined>(
  undefined,
);

/**
 * Hook for list/lookup widgets to detect picker mode and return a selected value.
 * Returns undefined when not in picker mode (normal navigation).
 * TValue is the type of the value returned to the caller — enforced at the call site.
 */
export function usePickerCallback<TValue extends WidgetData>():
  | ((value: TValue) => void)
  | undefined {
  const cb = useContext(PickerContext);
  if (!cb) {
    return undefined;
  }
  // Cast: context carries WidgetData, type safety is enforced at EntityPickerField call site
  return cb as (value: TValue) => void;
}

/**
 * Provider used by EndpointsPage to inject the picker callback into a navigation stack layer.
 */
export function PickerProvider({
  onSelect,
  children,
}: {
  onSelect: ((value: WidgetData) => void) | undefined;
  children: ReactNode;
}): JSX.Element {
  return (
    <PickerContext.Provider value={onSelect}>{children}</PickerContext.Provider>
  );
}
