import { Text } from "ink";
import type { JSX } from "react";

import { useIsMcp } from "../../../unified-ui/_shared/use-widget-context";
import type { CountryData, PhoneFieldProps } from "../../web/ui/phone-field";

export type { CountryData, PhoneFieldProps } from "../../web/ui/phone-field";
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
