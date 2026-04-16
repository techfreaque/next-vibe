import TextInput from "ink-text-input";
import { Text } from "ink";
import type { JSX } from "react";

import { useIsMcp } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import type { TextareaProps } from "../../web/ui/textarea";

export type {
  TextareaProps,
  TextareaChangeEvent,
  TextareaFocusEvent,
  TextareaClipboardEvent,
  TextareaKeyboardEvent,
  TextareaRefObject,
  TextareaClipboardTarget,
} from "../../web/ui/textarea";

import { cva } from "class-variance-authority";

export const textareaVariants = cva("");

const BRACKET_OPEN = "\u005B";
const BRACKET_CLOSE = "\u005D";

const NOOP = (): void => undefined;
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

export function Textarea({
  placeholder,
  value,
  onChange,
  onChangeText,
  disabled,
  name,
}: TextareaProps): JSX.Element | null {
  const isMcp = useIsMcp();

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

  // ink-text-input doesn't support multiline; render as single-line input
  return (
    <TextInput
      value={displayValue}
      placeholder={placeholder ?? ""}
      onChange={(text): void => {
        onChangeText?.(text);
        onChange?.(makeChangeEvent(name, text));
      }}
    />
  );
}
