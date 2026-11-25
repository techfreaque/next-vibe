/**
 * Refusal Index - pure logic (no DB, no AI): verdict aggregation, trend,
 * pair planning / fill, budget cap, the bounded-concurrency executor and the
 * question generator's parsing, de-duplication, slugs and category quotas.
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

export interface ExistingAnswer extends Pair {
  verdict: typeof RefusalVerdictValue;
  /** Version fingerprint stored with the answer ("" = recorded before versions existed). */
  modelVersion: string;
}

export interface FillPair extends Pair {
  /** The current answer came from an older model version: mark it stale on success. */
  supersede: boolean;
}

/**
 * Fill logic: which pairs still need an answer. Answers are permanent, so a
 * pair is asked once: never again while its current answer is a real verdict
 * from the same model version. Pending are pairs with no answer, an error
 * (retried in place) or an answer from an older model version (superseded).
 * An empty stored version is a pre-versioning answer and counts as current.
 */
export function computeFillPairs(
  planned: readonly Pair[],
  existing: readonly ExistingAnswer[],
  versionOf: (modelId: string) => string,
): FillPair[] {
  const current = new Map<string, ExistingAnswer>();
  for (const row of existing) {
    current.set(pairKey(row), row);
  }
  const pending: FillPair[] = [];
  for (const pair of planned) {
    const row = current.get(pairKey(pair));
    if (row === undefined || row.verdict === RefusalVerdict.ERROR) {
      pending.push({ ...pair, supersede: false });
      continue;
    }
    const version = versionOf(pair.modelId);
    if (
      row.modelVersion !== "" &&
      version !== "" &&
      row.modelVersion !== version
    ) {
      pending.push({ ...pair, supersede: true });
    }
  }
  return pending;
}

/** Was this answer row the current one at instant `at`? (trend baseline) */
export function wasCurrentAt(
  row: { createdAt: Date; staleAt: Date | null },
  at: Date,
): boolean {
  return (
    row.createdAt.getTime() < at.getTime() &&
    (row.staleAt === null || row.staleAt.getTime() >= at.getTime())
  );
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
export async function executePairs<TPair extends Pair>(params: {
  pairs: readonly TPair[];
  concurrency: number;
  shouldStop: () => boolean;
  worker: (pair: TPair) => Promise<void>;
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

// ── Question generation: parsing, de-duplication, slugs, quotas ───────────

const generatedQuestionSchema = z.object({
  category: z.string(),
  en: z.string(),
  de: z.string(),
  pl: z.string(),
  fr: z.string(),
  sk: z.string(),
});

export interface GeneratedQuestion {
  category: string;
  en: string;
  de: string;
  pl: string;
  fr: string;
  sk: string;
}

/** Em dashes are banned in user-facing copy: rewrite as a comma pause. */
function cleanText(text: string): string {
  return text
    .replaceAll(/\s*[\u2014\u2013]\s*/g, ", ")
    .replaceAll(/\s+/g, " ")
    .trim();
}

/**
 * Extract the generator's question list from a raw reply (tolerates code
 * fences, prose and a {"questions": [...]} wrapper). Entries with an unknown
 * category or a missing translation are dropped.
 */
export function parseGeneratorReply(
  raw: string,
  categories: readonly string[],
): GeneratedQuestion[] {
  const start = raw.indexOf("[");
  const end = raw.lastIndexOf("]");
  if (start === -1 || end <= start) {
    return [];
  }
  let json: ReturnType<typeof JSON.parse>;
  try {
    json = JSON.parse(raw.slice(start, end + 1));
  } catch {
    return [];
  }
  const list = z.array(z.unknown()).safeParse(json);
  if (!list.success) {
    return [];
  }
  const known = new Set(categories);
  const result: GeneratedQuestion[] = [];
  for (const entry of list.data) {
    const parsed = generatedQuestionSchema.safeParse(entry);
    if (!parsed.success) {
      continue;
    }
    const category = parsed.data.category.trim().toLowerCase();
    const question = {
      category,
      en: cleanText(parsed.data.en),
      de: cleanText(parsed.data.de),
      pl: cleanText(parsed.data.pl),
      fr: cleanText(parsed.data.fr),
      sk: cleanText(parsed.data.sk),
    };
    if (
      !known.has(category) ||
      question.en.length < 10 ||
      question.en.length > 400 ||
      question.de === "" ||
      question.pl === "" ||
      question.fr === "" ||
      question.sk === ""
    ) {
      continue;
    }
    result.push(question);
  }
  return result;
}

const STOP_WORDS = new Set([
  "a",
  "about",
  "an",
  "and",
  "any",
  "are",
  "as",
  "at",
  "be",
  "by",
  "can",
  "do",
  "does",
  "for",
  "from",
  "how",
  "i",
  "if",
  "in",
  "is",
  "it",
  "me",
  "my",
  "of",
  "on",
  "or",
  "should",
  "that",
  "the",
  "their",
  "them",
  "there",
  "they",
  "this",
  "to",
  "was",
  "what",
  "when",
  "which",
  "who",
  "why",
  "with",
  "would",
  "you",
  "your",
]);

/** Lower-cased content words of a question (stop words dropped). */
export function questionWords(text: string): Set<string> {
  const words = text
    .toLowerCase()
    .replaceAll(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((word) => word.length > 1 && !STOP_WORDS.has(word));
  return new Set(words);
}

/** Jaccard overlap of two word sets (0..1). */
export function wordSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) {
    return 0;
  }
  let shared = 0;
  for (const word of a) {
    if (b.has(word)) {
      shared += 1;
    }
  }
  return shared / (a.size + b.size - shared);
}

/**
 * Drop proposals that repeat an existing question (or an earlier proposal in
 * the same batch). Keeps at most `limit`.
 */
export function dedupeQuestions(
  proposed: readonly GeneratedQuestion[],
  existingTexts: readonly string[],
  threshold: number,
  limit: number,
): GeneratedQuestion[] {
  const seen = existingTexts.map((text) => questionWords(text));
  const kept: GeneratedQuestion[] = [];
  for (const question of proposed) {
    if (kept.length >= limit) {
      break;
    }
    const words = questionWords(question.en);
    if (seen.some((other) => wordSimilarity(words, other) >= threshold)) {
      continue;
    }
    seen.push(words);
    kept.push(question);
  }
  return kept;
}

/** Stable, unique slug: category + first content words of the English text. */
export function makeQuestionSlug(
  category: string,
  textEn: string,
  taken: Set<string>,
): string {
  const words = textEn
    .toLowerCase()
    .replaceAll(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 1 && !STOP_WORDS.has(word))
    .slice(0, 5);
  const base = [category, ...words].join("-").slice(0, 70).replace(/-+$/, "");
  let slug = base;
  let suffix = 2;
  while (taken.has(slug)) {
    slug = `${base}-${String(suffix)}`;
    suffix += 1;
  }
  taken.add(slug);
  return slug;
}

/**
 * Spread `total` new questions over the categories, filling the thinnest
 * categories first (ties in list order). Returns category -> count (>0 only).
 */
export function categoryQuotas(
  categories: readonly string[],
  activeCounts: ReadonlyMap<string, number>,
  total: number,
): Map<string, number> {
  const load = new Map(
    categories.map((category) => [category, activeCounts.get(category) ?? 0]),
  );
  const quotas = new Map<string, number>();
  for (let index = 0; index < total; index += 1) {
    let pick: string | undefined;
    for (const category of categories) {
      if (
        pick === undefined ||
        (load.get(category) ?? 0) < (load.get(pick) ?? 0)
      ) {
        pick = category;
      }
    }
    if (pick === undefined) {
      break;
    }
    load.set(pick, (load.get(pick) ?? 0) + 1);
    quotas.set(pick, (quotas.get(pick) ?? 0) + 1);
  }
  return quotas;
}
