import { Text } from "ink";
import { useIsMcp } from "next-vibe-ui/unified/_shared/use-widget-context";
import type { JSX } from "react";

import type { CountryData, PhoneFieldProps } from "../../web/ui/phone-field";

export type { PhoneFieldProps, CountryData } from "../../web/ui/phone-field";
// COUNTRIES is a large data array only needed for web phone input UI
export const COUNTRIES: CountryData[] = [];

// CLI: show current value as plain text. MCP: return null.
export function PhoneField({
  value,
  placeholder,
}: PhoneFieldProps): JSX.Element | null {
  const isMcp = useIsMcp();

  if (isMcp) {
    return null;
  }

  const display = value ?? placeholder ?? "";
  return <Text dimColor>{display}</Text>;
}
