/**
 * CLI DatePicker - text input accepting YYYY-MM-DD format
 */
import { Box, Text } from "ink";
import TextInput from "ink-text-input";
import type { JSX } from "react";
import { useState } from "react";

import { useIsMcp } from "../../../unified-ui/_shared/use-widget-context";
import { parseFormDate } from "../../../unified-ui/widgets/form-fields/_shared/date-value";
import type { DatePickerProps } from "../../web/components/date-picker";

export type { DatePickerProps } from "../../web/components/date-picker";

const DATE_FORMAT = "YYYY-MM-DD";

function formatDate(date: Date | undefined): string {
  if (!date) {
    return "";
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function DatePicker({
  value,
  onChange,
  placeholder,
  disabled,
}: DatePickerProps): JSX.Element | null {
  const isMcp = useIsMcp();
  const [draft, setDraft] = useState<string>();

  if (isMcp) {
    return <Text>{formatDate(value) || placeholder || DATE_FORMAT}</Text>;
  }

  if (disabled) {
    return (
      <Text dimColor>[{formatDate(value) || placeholder || DATE_FORMAT}]</Text>
    );
  }

  return (
    <Box>
      <TextInput
        value={draft ?? formatDate(value)}
        placeholder={placeholder ?? DATE_FORMAT}
        onChange={(t): void => {
          setDraft(t);
          const parsed = parseFormDate(t);
          if (parsed || !t) {
            onChange(parsed);
          }
        }}
      />
    </Box>
  );
}
