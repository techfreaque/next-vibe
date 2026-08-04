/**
 * CLI NumberInput - text input that parses integers/floats
 * Also supports +/- keys to increment/decrement
 */
import { Box, Text, useInput } from "ink";
import TextInput from "ink-text-input";
import type { JSX } from "react";
import { useState } from "react";

import { useIsMcp } from "../../../unified-ui/_shared/use-widget-context";
import type { NumberInputProps } from "../../web/ui/number-input";
import { useCaptureArrows, useCliFieldFocus } from "../lib/focus-manager";

export type { NumberInputProps } from "../../web/ui/number-input";

export function NumberInput({
  value = 0,
  onChange,
  min,
  max,
  step = 1,
  disabled = false,
  name,
}: NumberInputProps): JSX.Element | null {
  const isMcp = useIsMcp();
  const [text, setText] = useState(String(value));
  // Same focus participation as Input — without it every NumberInput on screen
  // is simultaneously active: Tab moves nothing, ink-text-input renders each one
  // focused, and a single arrow key steps EVERY number field at once.
  const isFocused = useCliFieldFocus(name ?? "number");
  // While focused, ↑/↓ step the value instead of moving to the next field.
  useCaptureArrows(isFocused && !disabled);

  // Each bound applies on its own: a field with only `min: 0` must still clamp
  // at 0. Requiring both bounds meant a one-sided range clamped at neither.
  const clamp = (n: number): number => {
    const lower = min !== undefined ? Math.max(min, n) : n;
    return max !== undefined ? Math.min(max, lower) : lower;
  };

  useInput(
    (input, key) => {
      if (disabled) {
        return;
      }
      if (key.upArrow || input === "+") {
        const next = clamp(value + step);
        onChange?.(next);
        setText(String(next));
      }
      if (key.downArrow || input === "-") {
        const next = clamp(value - step);
        onChange?.(next);
        setText(String(next));
      }
    },
    { isActive: isFocused && !disabled },
  );

  if (isMcp) {
    const rangeHint =
      min !== undefined && max !== undefined ? ` (${min}-${max})` : "";
    return (
      <Text>
        {value}
        {rangeHint}
      </Text>
    );
  }

  if (disabled) {
    return <Text dimColor>[{value}]</Text>;
  }

  const rangeHint =
    min !== undefined && max !== undefined ? ` (${min}-${max}, ↑↓)` : " (↑↓)";

  return (
    <Box>
      {/* "▸ " survives ANSI stripping so agents can detect focus (same as Input). */}
      <Text>{isFocused ? "▸ " : "  "}</Text>
      <TextInput
        value={text}
        focus={isFocused}
        placeholder={String(value)}
        onChange={(t): void => {
          setText(t);
          const num = parseFloat(t);
          if (!isNaN(num)) {
            onChange?.(clamp(num));
          }
        }}
      />
      <Text dimColor>{rangeHint}</Text>
    </Box>
  );
}
