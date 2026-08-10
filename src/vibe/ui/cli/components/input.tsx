import { Text } from "ink";
import TextInput from "ink-text-input";
import type { JSX } from "react";

import { useIsMcp } from "../../../unified-ui/_shared/use-widget-context";
import type { InputProps } from "../../web/ui/input";
import { useCliFieldFocus } from "../lib/focus-manager";

export type {
  InferValueType,
  InputChangeEvent,
  InputEventTarget,
  InputFocusEvent,
  InputGenericTarget,
  InputKeyboardEvent,
  InputMouseEvent,
  InputProps,
  InputRefObject,
} from "../../web/ui/input";

const BRACKET_OPEN = "\u005B";
const BRACKET_CLOSE = "\u005D";

const NOOP = (): void => undefined;
const NOOP_BOOL = (): boolean => false;
const EMPTY_RECT = (): Record<string, number> => ({
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  width: 0,
  height: 0,
  x: 0,
  y: 0,
});

// Build a minimal synthetic event so web-style onChange handlers work in CLI.
// Cast via unknown - the CLI never inspects the event shape, only reads .target.value.
function makeChangeEvent(
  name: string | undefined,
  text: string,
  // oxlint-disable-next-line typescript/no-explicit-any
): any {
  return {
    target: { value: text, name },
    currentTarget: {
      value: text,
      addEventListener: NOOP,
      removeEventListener: NOOP,
      dispatchEvent: NOOP_BOOL,
      getBoundingClientRect: EMPTY_RECT,
    },
    preventDefault: NOOP,
    stopPropagation: NOOP,
    bubbles: false,
    cancelable: false,
    defaultPrevented: false,
    eventPhase: 0,
    isTrusted: true,
    timeStamp: Date.now(),
    type: "change",
  };
}

export function Input<
  T extends
    | "text"
    | "email"
    | "tel"
    | "url"
    | "password"
    | "number"
    | "date"
    | "datetime-local"
    | "color"
    | "time"
    | "file"
    | "hidden"
    | undefined = undefined,
>({
  placeholder,
  value,
  onChange,
  onChangeText,
  disabled,
  name,
  type,
}: InputProps<T>): JSX.Element | null {
  // Hooks must be called unconditionally
  const isMcp = useIsMcp();
  const isFocused = useCliFieldFocus(name ?? "input");

  if (isMcp) {
    return null;
  }

  const displayValue = value !== undefined ? String(value) : "";
  const isMask = type === "password";

  if (disabled) {
    return (
      <Text dimColor>
        {BRACKET_OPEN}
        {displayValue || placeholder || "input"}
        {BRACKET_CLOSE}
      </Text>
    );
  }

  // Focus prefix "▸ " survives ANSI stripping so agents can detect focus.
  return (
    <Text>
      {isFocused ? "▸ " : "  "}
      <TextInput
        value={displayValue}
        placeholder={placeholder ?? ""}
        focus={isFocused}
        mask={isMask ? "*" : undefined}
        onChange={(text): void => {
          onChangeText?.(text);
          onChange?.(makeChangeEvent(name, text));
        }}
      />
    </Text>
  );
}
