import type { CategoryDefinitionSerialized } from "./category-types";

export function localizedLabel(
  labels: Record<string, string>,
  locale: string,
): string | undefined {
  const language = `${locale.split("-")[0]}-`;
  return (
    labels[locale] ??
    Object.entries(labels).find(([key]) => key.startsWith(language))?.[1]
  );
}

/** Display label of a catalog category in the viewer's locale; unknown (remote) keys show as-is. */
export function categoryLabel(
  key: string,
  locale: string,
  metadata?: Pick<CategoryDefinitionSerialized, "label" | "labels">,
): string {
  return metadata
    ? (localizedLabel(metadata.labels, locale) ?? metadata.label)
    : key;
}
