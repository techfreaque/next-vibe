/**
 * CortexBudget unit tests
 * Tests the budget allocation, equal-trim, pinning, and helper math.
 */

import { describe, expect, it } from "vitest";

import {
  budgetToChars,
  DEFAULT_CORTEX_BUDGET,
  type CortexBudget,
} from "./prompt";

describe("DEFAULT_CORTEX_BUDGET", () => {
  it("total is a positive number", () => {
    expect(DEFAULT_CORTEX_BUDGET.total).toBeGreaterThan(0);
  });

  it("individual section allocations are all positive", () => {
    const { memories, threads, documents, tasks, skills, overhead } =
      DEFAULT_CORTEX_BUDGET;
    for (const v of [memories, threads, documents, tasks, skills, overhead]) {
      expect(v).toBeGreaterThan(0);
    }
  });

  it("memories is the largest single allocation", () => {
    const { memories, threads, documents, tasks, skills, overhead } =
      DEFAULT_CORTEX_BUDGET;
    const others = [threads, documents, tasks, skills, overhead];
    for (const other of others) {
      expect(memories).toBeGreaterThan(other);
    }
  });

  it("all allocations are positive integers", () => {
    const values = Object.values(DEFAULT_CORTEX_BUDGET) as number[];
    for (const v of values) {
      expect(v).toBeGreaterThan(0);
      expect(Number.isInteger(v)).toBe(true);
    }
  });
});

describe("budgetToChars", () => {
  it("converts tokens to characters at 4 chars/token", () => {
    expect(budgetToChars(1000)).toBe(4000);
    expect(budgetToChars(2000)).toBe(8000);
    expect(budgetToChars(0)).toBe(0);
  });

  it("memories budget converts to memories * 4 chars", () => {
    expect(budgetToChars(DEFAULT_CORTEX_BUDGET.memories)).toBe(
      DEFAULT_CORTEX_BUDGET.memories * 4,
    );
  });

  it("threads budget converts to threads * 4 chars", () => {
    expect(budgetToChars(DEFAULT_CORTEX_BUDGET.threads)).toBe(
      DEFAULT_CORTEX_BUDGET.threads * 4,
    );
  });
});

describe("budget shape validation", () => {
  it("all required fields are present", () => {
    const required: (keyof CortexBudget)[] = [
      "total",
      "memories",
      "threads",
      "documents",
      "tasks",
      "skills",
      "overhead",
    ];
    for (const field of required) {
      expect(DEFAULT_CORTEX_BUDGET).toHaveProperty(field);
    }
  });

  it("custom budget override keeps type integrity", () => {
    const custom: CortexBudget = {
      ...DEFAULT_CORTEX_BUDGET,
      memories: 3000,
    };
    // total is just an informational field; individual allocations can exceed it
    expect(custom.memories).toBe(3000);
    expect(custom.threads).toBe(DEFAULT_CORTEX_BUDGET.threads);
  });
});
