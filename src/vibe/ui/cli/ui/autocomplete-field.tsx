/* eslint-disable oxlint-plugin-i18n/no-literal-string */
/**
 * CLI AutocompleteField - interactive searchable dropdown
 *
 * Shows current value. When focused, Enter opens a search/select mode:
 * type to filter, ↑↓ to navigate, Enter to select, Esc to cancel.
 * Falls back to plain text display in MCP mode.
 */
import { Box, Text, useFocus, useInput, useStdin } from "ink";
import TextInput from "ink-text-input";
import { useIsMcp } from "../../../unified-ui/_shared/use-widget-context";
import type { JSX } from "react";
import { useMemo, useRef, useState } from "react";

import type {
  AutocompleteFieldProps,
  AutocompleteOption,
  AutocompleteOptionBase,
} from "../../web/ui/autocomplete-field";
import { useFocusScopeRegister, useShouldFocus } from "./dialog";

export type {
  AutocompleteFieldProps,
  AutocompleteOption,
  AutocompleteOptionBase,
} from "../../web/ui/autocomplete-field";

export enum FormFieldCategory {
  OTHER = "other",
}

const ARROW = "\u25B6";
const SPACE = "\u0020";
const CHECK = "\u2713";
const BLANK = "\u0020";
const HINT = "\u2191\u2193 navigate, Enter select, Esc cancel";

export function AutocompleteField({
  value = "",
  onChange,
  options,
  placeholder,
  allowCustom = true,
}: AutocompleteFieldProps): JSX.Element {
  const isMcp = useIsMcp();
  const { isRawModeSupported } = useStdin();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [cursor, setCursor] = useState(0);
  // Stable ID for Ink's focus system
  const idRef = useRef(
    `autocomplete-${Math.random().toString(36).slice(2, 7)}`,
  );
  const shouldFocus = useShouldFocus();
  const { isFocused } = useFocus({
    id: idRef.current,
    autoFocus: false,
    isActive: shouldFocus,
  });
  useFocusScopeRegister(idRef.current);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayValue = selectedOption
    ? selectedOption.label
    : value || (placeholder ?? "");

  // Filter options by search text
  const filtered = useMemo((): AutocompleteOption[] => {
    if (!search) {
      return options;
    }
    const lower = search.toLowerCase();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(lower) ||
        opt.value.toLowerCase().includes(lower) ||
        (opt.description && opt.description.toLowerCase().includes(lower)),
    );
  }, [options, search]);

  useInput(
    (input, key) => {
      if (!open) {
        // Enter opens the picker
        if (key.return || key.downArrow || key.upArrow) {
          setCursor(
            Math.max(
              0,
              options.findIndex((o) => o.value === value),
            ),
          );
          setSearch("");
          setOpen(true);
        }
        return;
      }

      if (key.escape) {
        setOpen(false);
        setSearch("");
        return;
      }

      if (key.upArrow) {
        setCursor((c) => Math.max(0, c - 1));
        return;
      }

      if (key.downArrow) {
        setCursor((c) =>
          Math.min(
            filtered.length - 1 + (allowCustom && search ? 1 : 0),
            c + 1,
          ),
        );
        return;
      }

      if (key.return) {
        // If cursor is on the "use custom" row
        const customRow = allowCustom && search && cursor === filtered.length;
        if (customRow) {
          onChange(search);
        } else {
          const item = filtered[cursor];
          if (item) {
            onChange(item.value);
          }
        }
        setOpen(false);
        setSearch("");
        return;
      }

      // Printable chars go to search — handled by TextInput below
      void input;
    },
    { isActive: isRawModeSupported && !isMcp && (isFocused || open) },
  );

  if (isMcp) {
    return <Text>{displayValue}</Text>;
  }

  if (!open) {
    return (
      <Box>
        <Text color={isFocused ? "cyan" : "gray"}>▶ </Text>
        <Text color={isFocused ? "cyan" : value ? undefined : "gray"}>
          {displayValue}
        </Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      {/* Search input */}
      <Box>
        <Text color="cyan">{"/ "}</Text>
        <TextInput
          value={search}
          onChange={(v) => {
            setSearch(v);
            setCursor(0);
          }}
          placeholder="search..."
          focus={true}
        />
      </Box>

      <Text dimColor>{HINT}</Text>

      {/* Options list */}
      {filtered.map((opt, idx) => {
        const isCursor = idx === cursor;
        const isSelected = opt.value === value;
        return (
          <Box key={opt.value}>
            <Text color={isCursor ? "cyan" : undefined}>
              {isCursor ? ARROW : SPACE}
              {SPACE}
              {isSelected ? CHECK : BLANK}
              {SPACE}
              {opt.label}
            </Text>
            {opt.description && !isCursor && (
              <Text dimColor>{`  ${opt.description}`}</Text>
            )}
          </Box>
        );
      })}

      {/* Custom value row */}
      {allowCustom && search && (
        <Box>
          <Text color={cursor === filtered.length ? "cyan" : undefined}>
            {cursor === filtered.length ? ARROW : SPACE}
            {SPACE}
            {BLANK}
            {SPACE}
            {`Use: "${search}"`}
          </Text>
        </Box>
      )}

      {filtered.length === 0 && !search && <Text dimColor>no options</Text>}
    </Box>
  );
}
