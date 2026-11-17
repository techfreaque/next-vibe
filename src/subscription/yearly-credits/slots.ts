/**
 * Monthly credit slots of a yearly subscription period (Max, 2026-11-17):
 * a yearly plan grants its monthly credits every month. Slot 0 is the grant
 * the yearly invoice makes (checkout / renewal); slots 1..11 are granted by
 * the daily yearly-credits task, each expiring when its month ends.
 *
 * Pure, client-safe.
 */

export interface MonthSlot {
  index: number;
  start: Date;
  end: Date;
}

/** Add calendar months in UTC, clamping to the last day of short months. */
export function addUtcMonths(date: Date, months: number): Date {
  const result = new Date(date.getTime());
  const day = result.getUTCDate();
  result.setUTCDate(1);
  result.setUTCMonth(result.getUTCMonth() + months);
  const lastDay = new Date(
    Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0),
  ).getUTCDate();
  result.setUTCDate(Math.min(day, lastDay));
  return result;
}

/** All monthly slots of a period, the last one ending at the period end. */
export function monthSlots(periodStart: Date, periodEnd: Date): MonthSlot[] {
  const slots: MonthSlot[] = [];
  for (let index = 0; index < 24; index++) {
    const start = addUtcMonths(periodStart, index);
    if (start.getTime() >= periodEnd.getTime()) {
      break;
    }
    const nextStart = addUtcMonths(periodStart, index + 1);
    const end =
      nextStart.getTime() < periodEnd.getTime() ? nextStart : periodEnd;
    slots.push({ index, start, end });
  }
  return slots;
}

/** The slot containing `now`, or null outside the period. */
export function currentMonthSlot(
  periodStart: Date,
  periodEnd: Date,
  now: Date,
): MonthSlot | null {
  return (
    monthSlots(periodStart, periodEnd).find(
      (slot) =>
        slot.start.getTime() <= now.getTime() &&
        now.getTime() < slot.end.getTime(),
    ) ?? null
  );
}

/**
 * Expiry of the credits an invoice grants for a period: a monthly period's
 * credits last the period, a yearly period's first grant lasts its first month
 * (the following months are granted month by month).
 */
export function periodGrantExpiry(
  isYearly: boolean,
  periodStart: Date,
  periodEnd: Date,
): Date {
  if (!isYearly) {
    return periodEnd;
  }
  const firstSlot = monthSlots(periodStart, periodEnd)[0];
  return firstSlot ? firstSlot.end : periodEnd;
}

/** Idempotency key of one monthly grant of a yearly subscription. */
export function yearlyMonthGrantKey(
  subscriptionKey: string,
  slotStart: Date,
): string {
  return `yearly-month:${subscriptionKey}:${slotStart.getTime()}`;
}

/** Idempotency key of the one-time backfill for missed yearly months. */
export function yearlyBackfillKey(
  subscriptionKey: string,
  periodStart: Date,
): string {
  return `yearly-backfill:${subscriptionKey}:${periodStart.getTime()}`;
}
