/**
 * Refusal Index - pure logic (no DB, no AI): verdict aggregation, trend,
 * pair planning / resume, budget cap and the bounded-concurrency executor.
 * Everything here is unit tested.
 */

import { z } from "zod";

import { RefusalVerdict, type RefusalVerdictValue } from "./enum";

const judgeReplySchema = z.object({
  verdict: z.string(),
  reason: z.string().optional(),
});

export interface VerdictCounts {
  answered: number;
  hedged: number;
  refused: number;
  error: number;
}

export interface VerdictRates extends VerdictCounts {
  /** answered + hedged + refused (errors are excluded from rates). */
  judged: number;
  answeredPct: number;
  hedgedPct: number;
  refusedPct: number;
}

export interface ResultRow {
  modelId: string;
  category: string;
  verdict: typeof RefusalVerdictValue;
}

export interface ModelAggregate extends VerdictRates {
  modelId: string;
  byCategory: Record<string, VerdictRates>;
}

function emptyCounts(): VerdictCounts {
  return { answered: 0, hedged: 0, refused: 0, error: 0 };
}

function bump(
  counts: VerdictCounts,
  verdict: typeof RefusalVerdictValue,
): void {
  if (verdict === RefusalVerdict.ANSWERED) {
    counts.answered += 1;
  } else if (verdict === RefusalVerdict.HEDGED) {
    counts.hedged += 1;
  } else if (verdict === RefusalVerdict.REFUSED) {
    counts.refused += 1;
  } else {
    counts.error += 1;
  }
}

/** One decimal place. */
function pct(part: number, whole: number): number {
  if (whole === 0) {
    return 0;
  }
  return Math.round((part / whole) * 1000) / 10;
}

export function toRates(counts: VerdictCounts): VerdictRates {
  const judged = counts.answered + counts.hedged + counts.refused;
  return {
    ...counts,
    judged,
    answeredPct: pct(counts.answered, judged),
    hedgedPct: pct(counts.hedged, judged),
    refusedPct: pct(counts.refused, judged),
  };
}

/** Aggregate result rows into one entry per model, with a per-category split. */
export function aggregateVerdicts(
  rows: readonly ResultRow[],
): ModelAggregate[] {
  const totals = new Map<string, VerdictCounts>();
  const categories = new Map<string, Map<string, VerdictCounts>>();
  for (const row of rows) {
    let total = totals.get(row.modelId);
    if (total === undefined) {
      total = emptyCounts();
      totals.set(row.modelId, total);
    }
    bump(total, row.verdict);
    let perCategory = categories.get(row.modelId);
    if (perCategory === undefined) {
      perCategory = new Map<string, VerdictCounts>();
      categories.set(row.modelId, perCategory);
    }
    let cat = perCategory.get(row.category);
    if (cat === undefined) {
      cat = emptyCounts();
      perCategory.set(row.category, cat);
    }
    bump(cat, row.verdict);
  }
  const result: ModelAggregate[] = [];
  for (const [modelId, counts] of totals) {
    const byCategory: Record<string, VerdictRates> = {};
    for (const [category, catCounts] of categories.get(modelId) ?? []) {
      byCategory[category] = toRates(catCounts);
    }
    result.push({ modelId, ...toRates(counts), byCategory });
  }
  return result.toSorted((a, b) => a.modelId.localeCompare(b.modelId));
}

/** Refusal-rate change in percentage points vs the previous run. Null when not comparable. */
export function refusalTrend(
  current: VerdictRates,
  previous: VerdictRates | undefined,
): number | null {
  if (previous === undefined || previous.judged === 0 || current.judged === 0) {
    return null;
  }
  return Math.round((current.refusedPct - previous.refusedPct) * 10) / 10;
}

// ── Pair planning / resume ─────────────────────────────────────────────────

export interface Pair {
  modelId: string;
  questionId: string;
}

export function pairKey(pair: Pair): string {
  return `${pair.questionId}::${pair.modelId}`;
}

/** Cartesian product, question-major so partial runs cover whole questions first. */
export function planPairs(
  modelIds: readonly string[],
  questionIds: readonly string[],
): Pair[] {
  const pairs: Pair[] = [];
  for (const questionId of questionIds) {
    for (const modelId of modelIds) {
      pairs.push({ modelId, questionId });
    }
  }
  return pairs;
}

/**
 * Resume logic: which pairs still need work. A pair is done when it has a
 * non-error result; errored pairs are retried.
 */
export function computePendingPairs(
  planned: readonly Pair[],
  existing: readonly (Pair & { verdict: typeof RefusalVerdictValue })[],
): Pair[] {
  const done = new Set<string>();
  for (const row of existing) {
    if (row.verdict !== RefusalVerdict.ERROR) {
      done.add(pairKey(row));
    }
  }
  return planned.filter((pair) => !done.has(pairKey(pair)));
}

// ── Budget cap ─────────────────────────────────────────────────────────────

export interface BudgetTracker {
  add(cost: number): void;
  spent(): number;
  /** True once the spend has reached the cap. Uncapped trackers never trip. */
  exceeded(): boolean;
  cap: number | null;
}

export function createBudgetTracker(
  cap: number | null,
  alreadySpent = 0,
): BudgetTracker {
  let total = alreadySpent;
  return {
    cap,
    add(cost: number): void {
      total += cost;
    },
    spent(): number {
      return total;
    },
    exceeded(): boolean {
      return cap !== null && total >= cap;
    },
  };
}

// ── Bounded-concurrency executor with clean abort ──────────────────────────

export interface ExecuteOutcome {
  /** Pairs whose worker ran to completion. */
  processed: number;
  /** Pairs never started because the run was stopped. */
  skipped: number;
  stopped: boolean;
}

/**
 * Run `worker` over `pairs` with at most `concurrency` in flight. Before each
 * pair starts, `shouldStop` is consulted; once it returns true no new pair
 * starts and in-flight workers finish (clean abort - nothing is half written).
 */
export async function executePairs(params: {
  pairs: readonly Pair[];
  concurrency: number;
  shouldStop: () => boolean;
  worker: (pair: Pair) => Promise<void>;
}): Promise<ExecuteOutcome> {
  const { pairs, shouldStop, worker } = params;
  const limit = Math.max(1, Math.min(params.concurrency, pairs.length || 1));
  let next = 0;
  let processed = 0;
  let stopped = false;

  async function lane(): Promise<void> {
    while (true) {
      if (shouldStop()) {
        stopped = true;
        return;
      }
      const index = next;
      next += 1;
      const pair = pairs[index];
      if (pair === undefined) {
        return;
      }
      await worker(pair);
      processed += 1;
    }
  }

  await Promise.all(Array.from({ length: limit }, () => lane()));
  return { processed, skipped: pairs.length - processed, stopped };
}

// ── Judge reply parsing ────────────────────────────────────────────────────

/** The plain words the judge is instructed to answer with. */
const JUDGE_WORDS: ReadonlyMap<string, typeof RefusalVerdictValue> = new Map([
  ["answered", RefusalVerdict.ANSWERED],
  ["hedged", RefusalVerdict.HEDGED],
  ["refused", RefusalVerdict.REFUSED],
]);

export interface JudgeReply {
  verdict: typeof RefusalVerdictValue;
  reason: string;
}

/**
 * Extract the judge's JSON verdict from a raw model reply (tolerates code
 * fences and surrounding prose). Null when no valid verdict is found.
 */
export function parseJudgeReply(raw: string): JudgeReply | null {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end <= start) {
    return null;
  }
  const slice = raw.slice(start, end + 1);
  let json: ReturnType<typeof JSON.parse>;
  try {
    json = JSON.parse(slice);
  } catch {
    return null;
  }
  const parsed = judgeReplySchema.safeParse(json);
  if (!parsed.success) {
    return null;
  }
  const normalized = parsed.data.verdict.trim().toLowerCase();
  const reason = (parsed.data.reason ?? "").trim().slice(0, 300);
  const verdict = JUDGE_WORDS.get(normalized);
  return verdict === undefined ? null : { verdict, reason };
}
