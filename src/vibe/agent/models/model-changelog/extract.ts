/**
 * Model Changelog - pure snapshot extraction + diff.
 *
 * Source of truth is the git history of the model registry files (see
 * ./generator.ts). Each commit's file text is parsed into a snapshot (id,
 * name, content tier, legacy flag, successor, cheapest public price per
 * metric) and consecutive snapshots are diffed into dated events.
 *
 * Text parsing, not module evaluation: historical commits cannot be imported,
 * and the registry files are prettier-formatted with a stable shape
 * (`  [XModelId.KEY]: {` blocks, provider objects, `ContentLevel.X`). No IO
 * here; unit-tested in extract.test.ts.
 */

import type {
  ModelChangelogContent,
  ModelChangelogEvent,
  ModelChangelogModelType,
  ModelChangelogPriceChange,
  ModelChangelogPriceMetric,
} from "./types";

/** One model as it stood at one commit. */
export interface ModelSnapshotEntry {
  id: string;
  type: ModelChangelogModelType;
  name: string;
  content: ModelChangelogContent;
  legacy: boolean;
  /** At least one provider route that is not admin-only. */
  isPublic: boolean;
  /** Cheapest public provider price per metric (provider units). */
  prices: Partial<Record<ModelChangelogPriceMetric, number>>;
}

export interface ModelSnapshot {
  models: Map<string, ModelSnapshotEntry>;
  /** legacy id → successor id */
  successors: Map<string, string>;
}

/** A registry file's text at one commit, tagged with the model type it holds. */
export interface RegistryFileText {
  type: ModelChangelogModelType;
  text: string;
}

/** Price moves below this are rounding noise from the price updater. */
export const PRICE_CHANGE_MIN_PERCENT = 1;

const PRICE_FIELDS: ReadonlyArray<
  readonly [string, ModelChangelogPriceMetric]
> = [
  ["inputTokenCost", "input"],
  ["outputTokenCost", "output"],
  ["creditCostPerImage", "image"],
  ["creditCostPerSecond", "second"],
  ["creditCostPerClip", "clip"],
  ["creditCostPerCharacter", "character"],
  ["creditCost", "fixed"],
];

const CONTENT_BY_KEY: Readonly<Record<string, ModelChangelogContent>> = {
  MAINSTREAM: "mainstream",
  OPEN: "open",
  UNCENSORED: "uncensored",
};

/** Drop `// ...` line comments so notes never read as fields. */
function stripLineComments(text: string): string {
  return text.replaceAll(/(^|[^:"'\\])\/\/[^\n]*/g, "$1");
}

/** `export enum XModelId { KEY = "value", ... }` → "XModelId.KEY" → "value". */
function parseEnums(text: string): Map<string, string> {
  const values = new Map<string, string>();
  for (const match of text.matchAll(/export enum (\w+) \{([\s\S]*?)\n\}/g)) {
    const enumName = match[1];
    for (const entry of match[2].matchAll(/(\w+)\s*=\s*"([^"]+)"/g)) {
      values.set(`${enumName}.${entry[1]}`, entry[2]);
    }
  }
  return values;
}

function parsePrices(
  block: string,
): Partial<Record<ModelChangelogPriceMetric, number>> {
  const prices: Partial<Record<ModelChangelogPriceMetric, number>> = {};
  // Provider objects open with `{` + `id: XModelId.KEY,` inside `providers: [`.
  const providerChunks = block.split(/\{\s*\n\s*id:\s*[\w.]+,/).slice(1);
  for (const chunk of providerChunks) {
    const body = chunk.split(/\n\s{4,6}\},?\s*\n/)[0] ?? chunk;
    if (/adminOnly:\s*true/.test(body)) {
      continue;
    }
    for (const [field, metric] of PRICE_FIELDS) {
      const match = new RegExp(
        `\\n {8}${field}:\\s*([0-9]+(?:\\.[0-9]+)?)\\b`,
      ).exec(body);
      if (match === null) {
        continue;
      }
      const value = Number(match[1]);
      const current = prices[metric];
      if (current === undefined || value < current) {
        prices[metric] = value;
      }
    }
  }
  return prices;
}

function hasPublicProvider(block: string): boolean {
  const providerChunks = block.split(/\{\s*\n\s*id:\s*[\w.]+,/).slice(1);
  return providerChunks.some((chunk) => {
    const body = chunk.split(/\n\s{4,6}\},?\s*\n/)[0] ?? chunk;
    return !/adminOnly:\s*true/.test(body);
  });
}

/** Parse one registry file's text into model entries + successor pairs. */
export function parseRegistryFile(
  file: RegistryFileText,
  snapshot: ModelSnapshot,
): void {
  const text = stripLineComments(file.text);
  const enums = parseEnums(text);

  const defsStart = text.search(/export const \w+Definitions\b/);
  if (defsStart !== -1) {
    const defsText = text.slice(defsStart);
    const headerPattern = /^ {2}\[(\w+\.\w+)\]: \{$/gm;
    const headers = [...defsText.matchAll(headerPattern)];
    for (const [index, header] of headers.entries()) {
      const id = enums.get(header[1]);
      if (id === undefined) {
        continue;
      }
      const start = (header.index ?? 0) + header[0].length;
      const nextStart = headers[index + 1]?.index ?? defsText.length;
      const tail = defsText.slice(start, nextStart);
      const end = tail.search(/^ {2}\},?$/m);
      const block = end === -1 ? tail : tail.slice(0, end);
      const name = /\n {4}name:\s*"([^"]+)"/.exec(block)?.[1];
      const contentKey = /\n {4}content:\s*ContentLevel\.(\w+)/.exec(
        block,
      )?.[1];
      const content =
        contentKey === undefined ? undefined : CONTENT_BY_KEY[contentKey];
      if (name === undefined || content === undefined) {
        continue;
      }
      snapshot.models.set(`${file.type}:${id}`, {
        id,
        type: file.type,
        name,
        content,
        legacy: /ModelUtility\.LEGACY\b/.test(block),
        isPublic: hasPublicProvider(block),
        prices: parsePrices(block),
      });
    }
  }

  for (const match of text.matchAll(
    /export const \w+Successors\b[^=]*=\s*\{([\s\S]*?)\n\};/g,
  )) {
    for (const pair of match[1].matchAll(/\[(\w+\.\w+)\]:\s*(\w+\.\w+)/g)) {
      const from = enums.get(pair[1]);
      const to = enums.get(pair[2]);
      if (from !== undefined && to !== undefined) {
        snapshot.successors.set(`${file.type}:${from}`, `${file.type}:${to}`);
      }
    }
  }
}

/** Build a snapshot from every registry file's text at one commit. */
export function buildSnapshot(
  files: readonly RegistryFileText[],
): ModelSnapshot {
  const snapshot: ModelSnapshot = { models: new Map(), successors: new Map() };
  for (const file of files) {
    parseRegistryFile(file, snapshot);
  }
  return snapshot;
}

function percentChange(from: number, to: number): number {
  if (from === 0) {
    return to === 0 ? 0 : 100;
  }
  return ((to - from) / from) * 100;
}

function priceChanges(
  before: ModelSnapshotEntry,
  after: ModelSnapshotEntry,
): ModelChangelogPriceChange[] {
  const changes: ModelChangelogPriceChange[] = [];
  for (const [, metric] of PRICE_FIELDS) {
    const from = before.prices[metric];
    const to = after.prices[metric];
    if (from === undefined || to === undefined) {
      continue;
    }
    if (Math.abs(percentChange(from, to)) >= PRICE_CHANGE_MIN_PERCENT) {
      changes.push({ metric, from, to });
    }
  }
  return changes;
}

function baseEvent(
  entry: ModelSnapshotEntry,
  date: string,
  commit: string,
): Pick<
  ModelChangelogEvent,
  "date" | "commit" | "modelId" | "modelType" | "name" | "content"
> {
  return {
    date,
    commit,
    modelId: entry.id,
    modelType: entry.type,
    name: entry.name,
    content: entry.content,
  };
}

/** Diff two consecutive snapshots into the events that commit introduced. */
export function diffSnapshots(
  before: ModelSnapshot,
  after: ModelSnapshot,
  date: string,
  commit: string,
): ModelChangelogEvent[] {
  const events: ModelChangelogEvent[] = [];
  for (const [key, next] of after.models) {
    const prev = before.models.get(key);
    const wasPublic = prev?.isPublic === true;
    if (!next.isPublic) {
      if (wasPublic && prev !== undefined && !prev.legacy) {
        events.push({ ...baseEvent(prev, date, commit), type: "removed" });
      }
      continue;
    }
    if (prev === undefined || !wasPublic) {
      if (!next.legacy) {
        events.push({ ...baseEvent(next, date, commit), type: "added" });
      }
      continue;
    }
    if (!prev.legacy && next.legacy) {
      const successorKey = after.successors.get(key);
      const successor =
        successorKey === undefined ? undefined : after.models.get(successorKey);
      events.push({
        ...baseEvent(next, date, commit),
        type: "legacy",
        ...(successor === undefined
          ? {}
          : { successorId: successor.id, successorName: successor.name }),
      });
      continue;
    }
    if (prev.legacy && !next.legacy) {
      events.push({ ...baseEvent(next, date, commit), type: "restored" });
    }
    if (prev.content !== next.content) {
      events.push({
        ...baseEvent(next, date, commit),
        type: "tier",
        fromContent: prev.content,
      });
    }
    if (!next.legacy) {
      const changes = priceChanges(prev, next);
      if (changes.length > 0) {
        events.push({
          ...baseEvent(next, date, commit),
          type: "repriced",
          priceChanges: changes,
        });
      }
    }
  }
  for (const [key, prev] of before.models) {
    if (prev.isPublic && !prev.legacy && !after.models.has(key)) {
      events.push({ ...baseEvent(prev, date, commit), type: "removed" });
    }
  }
  return events;
}

/**
 * Collapse same-day repricings of one model into a single event (first `from`
 * to last `to`), drop moves that net out, and sort newest first.
 */
export function finalizeEvents(
  events: readonly ModelChangelogEvent[],
): ModelChangelogEvent[] {
  const result: ModelChangelogEvent[] = [];
  const repricedByDay = new Map<string, ModelChangelogEvent>();
  for (const event of events) {
    if (event.type !== "repriced" || event.priceChanges === undefined) {
      result.push(event);
      continue;
    }
    const key = `${event.date}|${event.modelType}:${event.modelId}`;
    const existing = repricedByDay.get(key);
    if (existing?.priceChanges === undefined) {
      const copy: ModelChangelogEvent = {
        ...event,
        priceChanges: [...event.priceChanges],
      };
      repricedByDay.set(key, copy);
      result.push(copy);
      continue;
    }
    const merged = [...existing.priceChanges];
    for (const change of event.priceChanges) {
      const index = merged.findIndex((m) => m.metric === change.metric);
      if (index === -1) {
        merged.push(change);
      } else {
        merged[index] = { ...merged[index], to: change.to };
      }
    }
    existing.priceChanges = merged;
    existing.commit = event.commit;
  }
  return result
    .map((event) =>
      event.priceChanges === undefined
        ? event
        : {
            ...event,
            priceChanges: event.priceChanges.filter(
              (c) =>
                Math.abs(percentChange(c.from, c.to)) >=
                PRICE_CHANGE_MIN_PERCENT,
            ),
          },
    )
    .filter(
      (event) =>
        event.type !== "repriced" || (event.priceChanges?.length ?? 0) > 0,
    )
    .map((event, order) => ({ event, order }))
    .toSorted((a, b) =>
      a.event.date === b.event.date
        ? b.order - a.order
        : b.event.date.localeCompare(a.event.date),
    )
    .map(({ event }) => event);
}
