export function formatExecutionDate(value: Date | string): string {
  const isoDate = typeof value === "string" ? value : value.toISOString();
  return isoDate.slice(0, 19).replace("T", " ");
}
