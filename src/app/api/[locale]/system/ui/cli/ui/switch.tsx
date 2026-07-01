/* eslint-disable oxlint-plugin-i18n/no-literal-string */
import { Text, useFocus, useInput, useStdin } from "ink";
import { isOverlayOpen, useFocusScopeRegister, useShouldFocus } from "./dialog";
import type { SwitchRootProps } from "next-vibe/ui/web/ui/switch";
import { useIsMcp } from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";
import { useRef } from "react";

export type { SwitchRootProps } from "next-vibe/ui/web/ui/switch";

const ON = "ON";
const OFF = "OFF";

let switchIdCounter = 0;

export function Switch({
  checked,
  onCheckedChange,
  disabled,
}: SwitchRootProps): JSX.Element {
  const isMcp = useIsMcp();
  const { isRawModeSupported } = useStdin();
  const idRef = useRef(`switch-${(switchIdCounter++).toString()}`);
  const state = checked ? ON : OFF;

  const shouldFocus = useShouldFocus();
  const { isFocused } = useFocus({
    id: idRef.current,
    autoFocus: false,
    isActive: !disabled && !isMcp && shouldFocus,
  });

  useFocusScopeRegister(idRef.current);

  useInput(
    (input, key) => {
      if (key.return || input === " ") {
        if (!isFocused || isOverlayOpen()) {
          return;
        }
        onCheckedChange?.(!checked);
      }
    },
    { isActive: isRawModeSupported && !isMcp && isFocused && !disabled },
  );

  if (isMcp) {
    return <Text>{state}</Text>;
  }

  const open = isFocused ? "\u00AB" : "[";
  const close = isFocused ? "\u00BB" : "]";

  return (
    <Text
      color={isFocused ? "cyan" : checked ? "green" : "gray"}
      bold
      dimColor={!isFocused}
    >
      {open}
      {state}
      {close}
    </Text>
  );
}
Switch.displayName = "Switch";
