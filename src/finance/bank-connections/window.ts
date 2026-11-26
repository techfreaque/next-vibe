import { z } from "zod";

import type { BankFeedWindow } from "./adapter";

const day = z.iso.date();
const DAY_MS = 86_400_000;

/** Revisit seven booking days to catch delayed settlement details and corrected downloads. */
export function nextBankWindow(
  startDay: string,
  through: string | undefined,
  today: string,
): BankFeedWindow | null {
  if (
    !day.safeParse(startDay).success ||
    !day.safeParse(today).success ||
    (through && !day.safeParse(through).success) ||
    today < startDay
  ) {
    return null;
  }
  const throughTime = through ? Date.parse(`${through}T00:00:00Z`) : undefined;
  const first = Date.parse(`${startDay}T00:00:00Z`);
  const from = Math.max(
    first,
    throughTime === undefined ? first : throughTime - 6 * DAY_MS,
  );
  const end = Math.min(Date.parse(`${today}T00:00:00Z`), from + 29 * DAY_MS);
  if (end < from) {
    return null;
  }
  return {
    from: new Date(from).toISOString().slice(0, 10),
    to: new Date(end).toISOString().slice(0, 10),
  };
}
