export const agingBuckets = [
  "current",
  "days1to30",
  "days31to60",
  "days61to90",
  "over90",
  "undated",
] as const;

export type AgingBucket = (typeof agingBuckets)[number];

export function billAgingBucket(
  dueDate: Date | null,
  agingDay: number,
): AgingBucket {
  if (!dueDate) {
    return "undated";
  }
  const days =
    (agingDay - Date.parse(dueDate.toISOString().slice(0, 10))) / 86_400_000;
  if (days <= 0) {
    return "current";
  }
  if (days <= 30) {
    return "days1to30";
  }
  if (days <= 60) {
    return "days31to60";
  }
  return days <= 90 ? "days61to90" : "over90";
}
