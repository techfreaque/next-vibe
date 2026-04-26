/**
 * CLI DatePicker - text input accepting YYYY-MM-DD format
 */
import TextInput from "ink-text-input";
import { Box, Text } from "ink";
import { useState } from "react";
import type { JSX } from "react";

import { useIsMcp } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import type { DatePickerProps } from "../../web/ui/date-picker";

export type { DatePickerProps } from "../../web/ui/date-picker";

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

function parseDate(str: string): Date | undefined {
  if (!str || str.length < 8) {
    return undefined;
  }
  const d = new Date(str);
  return isNaN(d.getTime()) ? undefined : d;
}

export function DatePicker({
  value,
  onChange,
  placeholder,
  disabled,
}: DatePickerProps): JSX.Element | null {
  const isMcp = useIsMcp();
  const [text, setText] = useState(formatDate(value));

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
        value={text}
        placeholder={placeholder ?? DATE_FORMAT}
        onChange={(t): void => {
          setText(t);
          onChange(parseDate(t));
        }}
      />
    </Box>
  );
}
