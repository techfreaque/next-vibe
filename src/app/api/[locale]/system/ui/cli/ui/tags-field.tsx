import { Text } from "ink";
import type { TagOption, TagsFieldProps } from "next-vibe/ui/web/ui/tags-field";
import type { JSX } from "react";

export type { TagOption, TagsFieldProps } from "next-vibe/ui/web/ui/tags-field";

// CLI: show tags as comma-separated list
export function TagsField<TKey extends string>({
  value = [],
  suggestions = [],
  t,
}: TagsFieldProps<TKey>): JSX.Element {
  const getLabel = (tagValue: string): string => {
    const match = suggestions.find((s) => s.value === tagValue);
    return match ? t(match.label) : t(tagValue);
  };

  const display = value.map(getLabel).join(", ");
  return <Text>{display}</Text>;
}
