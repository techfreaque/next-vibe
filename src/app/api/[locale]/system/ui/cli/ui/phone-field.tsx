import { Text } from "ink";
import type {
  CountryData,
  PhoneFieldProps,
} from "next-vibe/ui/web/ui/phone-field";
import { useIsMcp } from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";

export type {
  CountryData,
  PhoneFieldProps,
} from "next-vibe/ui/web/ui/phone-field";
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
