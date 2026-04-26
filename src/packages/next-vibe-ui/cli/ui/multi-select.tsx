/**
 * CLI MultiSelect - keyboard navigation with space-to-toggle
 * Arrow keys to navigate, Space to toggle selection, Enter to confirm
 */
import { Box, Text, useInput } from "ink";
import { useState } from "react";
import type { JSX } from "react";

import { useIsMcp } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import type {
  MultiSelectProps,
  MultiSelectOption,
} from "../../web/ui/multi-select";

export type {
  MultiSelectProps,
  MultiSelectOption,
} from "../../web/ui/multi-select";

const CHECKED = "\u2713";
const UNCHECKED = "\u25A1";
const ARROW = "\u25B6";
const SPACE = "\u0020";
// Terminal-only hint string - not user-facing i18n content
const HINT_NAV =
  "\u2191\u2193 navigate, Space toggle, Enter confirm, Esc close";
const OPEN_HINT = " \u21B5 to open";

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder,
  disabled,
  maxSelections,
}: MultiSelectProps): JSX.Element {
  const isMcp = useIsMcp();
  const [cursor, setCursor] = useState(0);
  const [open, setOpen] = useState(false);

  const enabledOptions = options.filter((o) => !o.disabled);

  useInput(
    (input, key) => {
      if (disabled) {
        return;
      }

      if (!open) {
        if (key.return || input === " ") {
          setOpen(true);
        }
        return;
      }

      if (key.escape) {
        setOpen(false);
        return;
      }

      if (key.upArrow) {
        setCursor((c) => Math.max(0, c - 1));
        return;
      }

      if (key.downArrow) {
        setCursor((c) => Math.min(enabledOptions.length - 1, c + 1));
        return;
      }

      if (input === " " || key.return) {
        const option = enabledOptions[cursor];
        if (!option) {
          return;
        }
        const isSelected = value.includes(option.value);
        if (isSelected) {
          onChange(value.filter((v) => v !== option.value));
        } else if (!maxSelections || value.length < maxSelections) {
          onChange([...value, option.value]);
        }
        if (key.return) {
          setOpen(false);
        }
      }
    },
    { isActive: !disabled },
  );

  if (isMcp) {
    const labels = value
      .map((v) => options.find((o) => o.value === v)?.label ?? v)
      .join(", ");
    return <Text>{labels || placeholder || "none selected"}</Text>;
  }

  const selectedLabels = value
    .map((v) => options.find((o) => o.value === v)?.label ?? v)
    .join(", ");

  if (!open) {
    return (
      <Text dimColor={disabled}>
        [{selectedLabels || placeholder || "select options"}]{OPEN_HINT}
      </Text>
    );
  }

  return (
    <Box flexDirection="column">
      <Text dimColor>{HINT_NAV}</Text>
      {enabledOptions.map((option, index) => {
        const isSelected = value.includes(option.value);
        const isCursor = index === cursor;
        const icon = isSelected ? CHECKED : UNCHECKED;
        return (
          <Box key={option.value}>
            <Text color={isCursor ? "cyan" : undefined}>
              {isCursor ? ARROW : SPACE}
              {SPACE}
              {icon}
              {SPACE}
              {option.label}
            </Text>
          </Box>
        );
      })}
    </Box>
  );
}
