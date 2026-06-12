/**
 * Journal Entry Balance Validation unit tests
 *
 * Tests the double-entry balance validation logic extracted from
 * chart-of-accounts/journal/create/repository.ts.
 *
 * The repository enforces:
 *   1. At least 2 lines required
 *   2. sum(debit lines) must equal sum(credit lines) within 0.0001 tolerance
 *   3. Negative amounts are never rejected by the balance check itself
 *      (the Zod schema in definition.ts enforces non-negative)
 *
 * These tests verify the logic as a pure function, no DB required.
 */

import { describe, expect, it } from "bun:test";

// ── Pure validation logic extracted from repository ──────────────────────────
// Mirrors CoaJournalCreateRepository.createEntry validation exactly.

type LineType = "DEBIT" | "CREDIT";

interface JournalLine {
  type: LineType;
  amount: number;
}

interface BalanceValidationResult {
  valid: boolean;
  reason?: "insufficient_lines" | "not_balanced";
  totalDebit?: number;
  totalCredit?: number;
  difference?: number;
}

/**
 * Pure function that mirrors the repository balance validation logic.
 * Returns a structured result instead of a ResponseType for testability.
 */
function validateJournalBalance(lines: JournalLine[]): BalanceValidationResult {
  // Rule 1: minimum two lines
  if (lines.length < 2) {
    return { valid: false, reason: "insufficient_lines" };
  }

  // Rule 2: debits must equal credits (within floating-point tolerance 0.0001)
  let totalDebit = 0;
  let totalCredit = 0;
  for (const line of lines) {
    if (line.type === "DEBIT") {
      totalDebit += line.amount;
    } else {
      totalCredit += line.amount;
    }
  }

  const difference = Math.abs(totalDebit - totalCredit);
  if (difference > 0.0001) {
    return {
      valid: false,
      reason: "not_balanced",
      totalDebit,
      totalCredit,
      difference,
    };
  }

  return { valid: true, totalDebit, totalCredit, difference };
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe("Journal Entry Balance Validation", () => {
  // ── Balance checks ───────────────────────────────────────────────────────

  it("balanced entry (debit=credit) passes validation", () => {
    const lines: JournalLine[] = [
      { type: "DEBIT", amount: 1000 },
      { type: "CREDIT", amount: 1000 },
    ];
    const result = validateJournalBalance(lines);

    expect(result.valid).toBe(true);
    expect(result.totalDebit).toBe(1000);
    expect(result.totalCredit).toBe(1000);
    expect(result.difference).toBe(0);
  });

  it("unbalanced entry (debit≠credit) fails validation", () => {
    const lines: JournalLine[] = [
      { type: "DEBIT", amount: 1000 },
      { type: "CREDIT", amount: 900 },
    ];
    const result = validateJournalBalance(lines);

    expect(result.valid).toBe(false);
    expect(result.reason).toBe("not_balanced");
    expect(result.difference).toBe(100);
  });

  it("multi-line balanced entry passes (3 debits, 2 credits summing equal)", () => {
    const lines: JournalLine[] = [
      { type: "DEBIT", amount: 300 },
      { type: "DEBIT", amount: 200 },
      { type: "DEBIT", amount: 100 },
      { type: "CREDIT", amount: 400 },
      { type: "CREDIT", amount: 200 },
    ];
    const result = validateJournalBalance(lines);

    expect(result.valid).toBe(true);
    expect(result.totalDebit).toBe(600);
    expect(result.totalCredit).toBe(600);
  });

  it("all-debit entry (no credits) fails as not_balanced", () => {
    const lines: JournalLine[] = [
      { type: "DEBIT", amount: 100 },
      { type: "DEBIT", amount: 200 },
    ];
    const result = validateJournalBalance(lines);

    expect(result.valid).toBe(false);
    expect(result.reason).toBe("not_balanced");
  });

  // ── Minimum lines ────────────────────────────────────────────────────────

  it("zero lines fails with insufficient_lines", () => {
    const result = validateJournalBalance([]);

    expect(result.valid).toBe(false);
    expect(result.reason).toBe("insufficient_lines");
  });

  it("single line fails with insufficient_lines", () => {
    const result = validateJournalBalance([{ type: "DEBIT", amount: 100 }]);

    expect(result.valid).toBe(false);
    expect(result.reason).toBe("insufficient_lines");
  });

  it("exactly two balanced lines passes (minimum valid entry)", () => {
    const lines: JournalLine[] = [
      { type: "DEBIT", amount: 50 },
      { type: "CREDIT", amount: 50 },
    ];
    const result = validateJournalBalance(lines);

    expect(result.valid).toBe(true);
  });

  // ── Floating-point tolerance (0.0001) ────────────────────────────────────

  it("difference of exactly 0 passes (perfect balance)", () => {
    const lines: JournalLine[] = [
      { type: "DEBIT", amount: 100.0 },
      { type: "CREDIT", amount: 100.0 },
    ];
    const result = validateJournalBalance(lines);

    // difference = 0, well within tolerance
    expect(result.valid).toBe(true);
  });

  it("difference just above tolerance (0.0002) fails", () => {
    const lines: JournalLine[] = [
      { type: "DEBIT", amount: 100.0002 },
      { type: "CREDIT", amount: 100 },
    ];
    const result = validateJournalBalance(lines);

    expect(result.valid).toBe(false);
    expect(result.reason).toBe("not_balanced");
  });

  it("floating-point sum: 0.1+0.2 vs 0.3 passes within tolerance", () => {
    // Classic floating-point trap: 0.1 + 0.2 = 0.30000000000000004 in JS
    // The repository uses tolerance 0.0001 to handle this
    const lines: JournalLine[] = [
      { type: "DEBIT", amount: 0.1 },
      { type: "DEBIT", amount: 0.2 },
      { type: "CREDIT", amount: 0.3 },
    ];
    const result = validateJournalBalance(lines);

    // difference = ~0.000000000000000044 which is well within 0.0001
    expect(result.valid).toBe(true);
  });

  // ── Zero amounts ─────────────────────────────────────────────────────────

  it("zero-amount balanced entry passes (trivially balanced)", () => {
    const lines: JournalLine[] = [
      { type: "DEBIT", amount: 0 },
      { type: "CREDIT", amount: 0 },
    ];
    const result = validateJournalBalance(lines);

    expect(result.valid).toBe(true);
    expect(result.totalDebit).toBe(0);
    expect(result.totalCredit).toBe(0);
  });
});
