import { Text } from "ink";
import TextInput from "ink-text-input";
import type { JSX } from "react";

import { useIsMcp } from "../../../unified-ui/_shared/use-widget-context";
import type { TextareaProps } from "../../web/ui/textarea";
import { useCliFieldFocus } from "../lib/focus-manager";

export type {
  TextareaChangeEvent,
  TextareaClipboardEvent,
  TextareaClipboardTarget,
  TextareaFocusEvent,
  TextareaKeyboardEvent,
  TextareaProps,
  TextareaRefObject,
} from "../../web/ui/textarea";

import { cva } from "class-variance-authority";

export const textareaVariants = cva("");

const BRACKET_OPEN = "\u005B";
const BRACKET_CLOSE = "\u005D";

const NOOP_BOOL = (): boolean => false;

// Build a minimal synthetic event for textarea onChange
function makeChangeEvent(
  name: string | undefined,
  text: string,
): Parameters<NonNullable<TextareaProps["onChange"]>>[0] {
  type Evt = Parameters<NonNullable<TextareaProps["onChange"]>>[0];
  const target = { value: text, name };
  const genericTarget: Evt["currentTarget"] = {
    addEventListener: NOOP as Evt["currentTarget"]["addEventListener"],
    removeEventListener: NOOP as Evt["currentTarget"]["removeEventListener"],
    dispatchEvent: NOOP_BOOL,
    getBoundingClientRect: (): DOMRect =>
      ({
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
      }) as DOMRect,
    value: text,
  };
  return {
    target,
    currentTarget: genericTarget,
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

const NOOP = (): void => undefined;

export function Textarea({
  placeholder,
  value,
  onChange,
  onChangeText,
  onKeyDown,
  disabled,
  name,
}: TextareaProps): JSX.Element | null {
  // Hooks must be called unconditionally
  const isMcp = useIsMcp();
  const isFocused = useCliFieldFocus(name ?? "textarea");

  if (isMcp) {
    return null;
  }

  const displayValue = value ?? "";

  if (disabled) {
    return (
      <Text dimColor>
        {BRACKET_OPEN}
        {displayValue || placeholder || "textarea"}
        {BRACKET_CLOSE}
      </Text>
    );
  }

  // ink-text-input doesn't support multiline; render as single-line input.
  // Wire onSubmit (Enter key in ink-text-input) to fire a synthetic onKeyDown
  // so web-style Enter-to-submit handlers work correctly in CLI.
  // Focus prefix "▸ " survives ANSI stripping so agents can detect focus.
  return (
    <Text>
      {isFocused ? "▸ " : "  "}
      <TextInput
        value={displayValue}
        placeholder={placeholder ?? ""}
        focus={isFocused}
        onChange={(text): void => {
          onChangeText?.(text);
          onChange?.(makeChangeEvent(name, text));
        }}
        onSubmit={(): void => {
          onKeyDown?.({
            key: "Enter",
            code: "Enter",
            shiftKey: false,
            ctrlKey: false,
            altKey: false,
            metaKey: false,
            repeat: false,
            location: 0,
            bubbles: false,
            cancelable: true,
            defaultPrevented: false,
            eventPhase: 0,
            isTrusted: true,
            timeStamp: Date.now(),
            type: "keydown",
            preventDefault: NOOP,
            stopPropagation: NOOP,
          });
        }}
      />
    </Text>
  );
}
