/**
 * CLI NumberInput — text input that parses integers/floats
 * Also supports +/- keys to increment/decrement
 */
import TextInput from "ink-text-input";
import { Box, Text, useInput } from "ink";
import { useState } from "react";
import type { JSX } from "react";

import { useIsMcp } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import type { NumberInputProps } from "../../web/ui/number-input";

export type { NumberInputProps } from "../../web/ui/number-input";

export function NumberInput({
  value = 0,
  onChange,
  min,
  max,
  step = 1,
  disabled = false,
}: NumberInputProps): JSX.Element | null {
  const isMcp = useIsMcp();
  const [text, setText] = useState(String(value));

  useInput(
    (input, key) => {
      if (disabled) {
        return;
      }
      if (key.upArrow || input === "+") {
        const next =
          max !== undefined ? Math.min(max, value + step) : value + step;
        onChange?.(next);
        setText(String(next));
      }
      if (key.downArrow || input === "-") {
        const next =
          min !== undefined ? Math.max(min, value - step) : value - step;
        onChange?.(next);
        setText(String(next));
      }
    },
    { isActive: !isMcp && !disabled },
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
      <TextInput
        value={text}
        placeholder={String(value)}
        onChange={(t): void => {
          setText(t);
          const num = parseFloat(t);
          if (!isNaN(num)) {
            const clamped =
              min !== undefined && max !== undefined
                ? Math.min(max, Math.max(min, num))
                : num;
            onChange?.(clamped);
          }
        }}
      />
      <Text dimColor>{rangeHint}</Text>
    </Box>
  );
}
