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
