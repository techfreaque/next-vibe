import { Box, Text, useInput } from "ink";
import TextInput from "ink-text-input";
import type { JSX } from "react";
import { useState } from "react";

import { useIsMcp } from "../../../unified-ui/_shared/use-widget-context";
import type {
  TagOption,
  TagsFieldProps,
} from "../../web/components/tags-field";
import { useCliFieldFocus } from "../lib/focus-manager";
import { useCaptureEnter } from "../lib/live-request-values";
import { isOverlayOpen } from "./dialog";

export type {
  TagOption,
  TagsFieldProps,
} from "../../web/components/tags-field";

/**
 * CLI tags field.
 *
 * Focusable and editable, not just a rendered list: type a tag and press Enter
 * to add it, Backspace on an empty draft removes the last one. Without focus
 * participation Tab skipped the field entirely and tags could not be entered at
 * all on the terminal.
 */
export function TagsField<TKey extends string>({
  value = [],
  onChange,
  suggestions = [],
  placeholder,
  maxTags,
  allowCustom = true,
  disabled = false,
  name,
  t,
}: TagsFieldProps<TKey>): JSX.Element {
  const isMcp = useIsMcp();
  const [draft, setDraft] = useState("");
  const isFocused = useCliFieldFocus(name ?? "tags");
  // Enter commits a DRAFT tag, so it only claims the key while something is
  // typed. On an empty draft it falls through and submits the form — otherwise
  // a form whose first field is a tags input could never be submitted by Enter.
  useCaptureEnter(isFocused && !disabled && draft.trim() !== "");

  const getLabel = (tagValue: string): string => {
    const match = suggestions.find(
      (s: TagOption<TKey>) => s.value === tagValue,
    );
    return match ? t(match.label) : t(tagValue);
  };

  const commit = (raw: string): void => {
    const tag = raw.trim();
    setDraft("");
    if (!tag || value.includes(tag)) {
      return;
    }
    if (!allowCustom && !suggestions.some((s) => s.value === tag)) {
      return;
    }
    if (maxTags !== undefined && value.length >= maxTags) {
      return;
    }
    onChange([...value, tag]);
  };

  useInput(
    (input, key) => {
      void input;
      if (isOverlayOpen()) {
        return;
      }
      // Backspace on an empty draft removes the most recent tag — the usual
      // tag-input convention, and the only way to delete one on a terminal.
      if ((key.backspace || key.delete) && draft === "" && value.length > 0) {
        onChange(value.slice(0, -1));
      }
    },
    { isActive: isFocused && !disabled },
  );

  const display = value.map(getLabel).join(", ");

  if (isMcp) {
    return <Text>{display}</Text>;
  }

  if (disabled) {
    return <Text dimColor>{display || "-"}</Text>;
  }

  return (
    <Box>
      {/* "▸ " survives ANSI stripping so agents can detect focus (same as Input). */}
      <Text>{isFocused ? "▸ " : "  "}</Text>
      {display ? <Text>{`${display} `}</Text> : <></>}
      <TextInput
        value={draft}
        focus={isFocused}
        placeholder={placeholder ? t(placeholder) : ""}
        onChange={setDraft}
        onSubmit={commit}
      />
    </Box>
  );
}
