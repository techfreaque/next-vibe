/** VAT return periods: "2026-10" (month) or "2026-Q4" (quarter). */

export const VAT_PERIOD_PATTERN = /^(\d{4})-(0[1-9]|1[0-2]|Q[1-4])$/;

export interface VatPeriod {
  start: Date;
  /** Exclusive end. */
  end: Date;
  kv: { year: number; month?: number; quarter?: number };
}

export function parseVatPeriod(value: string): VatPeriod | null {
  const match = VAT_PERIOD_PATTERN.exec(value);
  if (!match?.[1] || !match[2]) {
    return null;
  }
  const year = Number(match[1]);
  if (match[2].startsWith("Q")) {
    const quarter = Number(match[2].slice(1));
    return {
      start: new Date(Date.UTC(year, (quarter - 1) * 3, 1)),
      end: new Date(Date.UTC(year, quarter * 3, 1)),
      kv: { year, quarter },
    };
  }
  const month = Number(match[2]);
  return {
    start: new Date(Date.UTC(year, month - 1, 1)),
    end: new Date(Date.UTC(year, month, 1)),
    kv: { year, month },
  };
}

/** Previous calendar month, the usual period to file on the 25th. */
export function defaultVatPeriod(today: Date): string {
  const previous = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - 1, 1),
  );
  return `${previous.getUTCFullYear()}-${String(previous.getUTCMonth() + 1).padStart(2, "0")}`;
}

/** Recent months and quarters for the period picker, newest first. */
export function recentVatPeriods(today: Date, months = 15): string[] {
  const periods: string[] = [];
  for (let offset = 0; offset < months; offset += 1) {
    const day = new Date(
      Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - offset, 1),
    );
    periods.push(
      `${day.getUTCFullYear()}-${String(day.getUTCMonth() + 1).padStart(2, "0")}`,
    );
    if (day.getUTCMonth() % 3 === 2 || offset === 0) {
      const quarter = Math.floor(day.getUTCMonth() / 3) + 1;
      const key = `${day.getUTCFullYear()}-Q${quarter}`;
      if (!periods.includes(key)) {
        periods.push(key);
      }
    }
  }
  return periods;
}
