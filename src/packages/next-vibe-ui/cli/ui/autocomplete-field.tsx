import { Text } from "ink";
import type { JSX } from "react";

import type {
  AutocompleteFieldProps,
  AutocompleteOption,
  AutocompleteOptionBase,
} from "../../web/ui/autocomplete-field";

export type {
  AutocompleteFieldProps,
  AutocompleteOption,
  AutocompleteOptionBase,
} from "../../web/ui/autocomplete-field";
export enum FormFieldCategory {
  OTHER = "other",
}

// CLI: show current value as plain text — no dropdown in terminal
export function AutocompleteField({
  value,
  options,
}: AutocompleteFieldProps): JSX.Element {
  const selected = options.find((opt) => opt.value === value);
  const display = selected ? selected.label : (value ?? "");
  return <Text>{display}</Text>;
}
