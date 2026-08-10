import { Text, useInput } from "ink";
import type { JSX } from "react";

import { useIsMcp } from "../../../unified-ui/_shared/use-widget-context";
import type { CheckboxRootProps } from "../../web/components/checkbox";
import { useCliFieldFocus } from "../lib/focus-manager";
import { isOverlayOpen } from "./dialog";

export type {
  CheckboxIndicatorProps,
  CheckboxRootProps,
} from "../../web/components/checkbox";

const CHECKED_CLI = "\u2713";
const UNCHECKED_CLI = "\u25A1";
const BRACKET_OPEN = "\u005B";
const BRACKET_CLOSE = "\u005D";
// Focused brackets - guillemets read as "active" without extra columns.
const GUILLEMET_OPEN = "«";
const GUILLEMET_CLOSE = "»";
const SPACE = "\u0020";
const CHECKED_MCP = "checked";
const UNCHECKED_MCP = "unchecked";
const COLON = "\u003A";

export function Checkbox({
  checked,
  children,
  onCheckedChange,
  disabled = false,
  name,
  id,
}: CheckboxRootProps): JSX.Element {
  const isMcp = useIsMcp();
  // Focus + Space/Enter toggle, mirroring switch.tsx. Without this a checkbox
  // was display-only: Tab skipped it and there was no way to toggle it at all.
  const focusId = id ?? name ?? "checkbox";
  const isFocused = useCliFieldFocus(focusId);

  useInput(
    (input, key) => {
      if (key.return || input === " ") {
        if (!isFocused || isOverlayOpen()) {
          return;
        }
        onCheckedChange?.(!checked);
      }
    },
    { isActive: isFocused && !disabled },
  );

  if (isMcp) {
    const state = checked ? CHECKED_MCP : UNCHECKED_MCP;
    return (
      <Text>
        {state}
        {COLON}
        {SPACE}
        {children}
      </Text>
    );
  }

  const icon = checked ? CHECKED_CLI : UNCHECKED_CLI;
  // Focus swaps the brackets rather than adding a prefix — same convention as
  // switch.tsx. A "▸ " marker would indent the control relative to every other
  // field and shift it sideways as focus moves.
  const open = isFocused ? GUILLEMET_OPEN : BRACKET_OPEN;
  const close = isFocused ? GUILLEMET_CLOSE : BRACKET_CLOSE;

  return (
    <Text
      color={isFocused ? "cyan" : checked ? "green" : undefined}
      dimColor={!isFocused && !checked}
    >
      {open}
      {icon}
      {close}
      {SPACE}
      {children}
    </Text>
  );
}
Checkbox.displayName = "Checkbox";

export function CheckboxIndicator({
  children,
}: {
  children?: React.ReactNode;
}): JSX.Element | null {
  void children;
  return null;
}
CheckboxIndicator.displayName = "CheckboxIndicator";
