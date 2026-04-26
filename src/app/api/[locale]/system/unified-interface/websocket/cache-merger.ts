/**
 * Structural-Sharing Deep Merge
 *
 * Merges a DeepPartial patch into an existing value:
 * - Returns the SAME reference when nothing changed (structural sharing).
 * - Objects: recursively merges keys. Only creates a new object when a key value changes.
 * - Arrays of objects with an `id` field: merges by id. Items not in the patch are kept.
 * - Arrays without `id`: replaced wholesale.
 * - Primitives: replaced when changed, same reference when equal.
 *
 * Used by useEndpointSubscription to apply server-emitted partials into
 * the React Query cache without unnecessary re-renders.
 */

import type { WidgetData } from "../shared/types/json";
import type { DeepPartial } from "./structured-events";

interface WithId {
  id: string | number;
}

function hasId(item: WidgetData): item is WithId & WidgetData {
  return (
    typeof item === "object" &&
    item !== null &&
    !Array.isArray(item) &&
    "id" in item &&
    (typeof (item as Record<string, WidgetData>)["id"] === "string" ||
      typeof (item as Record<string, WidgetData>)["id"] === "number")
  );
}

/**
 * Merge a partial array into an existing array.
 * If items have an `id` field, merge by id (upsert).
 * Otherwise replace the whole array.
 */
function mergeArray(
  existing: WidgetData[],
  partial: WidgetData[],
): WidgetData[] {
  if (partial.length === 0) {
    return existing;
  }

  // Check if items have id - use first partial item as probe
  const firstPartial = partial[0];
  if (!firstPartial || !hasId(firstPartial)) {
    // No id field - replace wholesale
    return partial;
  }

  // Id-based merge: build map of existing items by id
  const existingById = new Map<string | number, WidgetData>();
  for (const item of existing) {
    if (hasId(item)) {
      existingById.set(item.id, item);
    }
  }

  // Start with a copy of existing, then apply updates
  const result = [...existing];
  let changed = false;

  for (const patchItem of partial) {
    if (!hasId(patchItem)) {
      continue;
    }
    const id = patchItem.id;
    const existingItem = existingById.get(id);

    if (existingItem !== undefined) {
      // Merge into existing item
      const merged = applyPartialToCache(existingItem, patchItem);
      if (merged !== existingItem) {
        const idx = result.findIndex((item) => hasId(item) && item.id === id);
        if (idx !== -1) {
          result[idx] = merged;
          changed = true;
        }
      }
    } else {
      // New item - append
      result.push(patchItem);
      changed = true;
    }
  }

  return changed ? result : existing;
}

/**
 * Recursively merge `partial` into `existing` with structural sharing.
 * Returns the same reference if nothing changed.
 */
export function applyPartialToCache(
  existing: WidgetData,
  partial: WidgetData,
): WidgetData {
  // Null / undefined passthrough
  if (partial === null || partial === undefined) {
    return existing;
  }

  // Primitives - replace if changed
  if (typeof partial !== "object") {
    return partial === existing ? existing : partial;
  }

  // Arrays
  if (Array.isArray(partial)) {
    if (!Array.isArray(existing)) {
      return partial;
    }
    const merged = mergeArray(existing, partial);
    return merged === existing ? existing : merged;
  }

  // Object merge - existing must also be an object (non-array)
  if (
    typeof existing !== "object" ||
    existing === null ||
    Array.isArray(existing)
  ) {
    return partial;
  }

  const existingObj = existing as Record<string, WidgetData>;
  const partialObj = partial as Record<string, WidgetData>;

  let changed = false;
  const result: Record<string, WidgetData> = { ...existingObj };

  for (const key of Object.keys(partialObj)) {
    const existingVal = existingObj[key] ?? null;
    const partialVal = partialObj[key];

    if (partialVal === undefined) {
      continue;
    }

    const merged = applyPartialToCache(existingVal, partialVal);

    if (merged !== existingVal) {
      result[key] = merged;
      changed = true;
    }
  }

  return changed ? result : existing;
}

/**
 * Apply a DeepPartial patch to a typed cache value.
 * Bridges the typed DeepPartial world to the WidgetData merger.
 */
export function applyTypedPartialToCache<T>(
  existing: T,
  partial: DeepPartial<T>,
): T {
  return applyPartialToCache(
    existing as WidgetData,
    partial as WidgetData,
  ) as T;
}

/**
 * Append content delta to a message in the cache.
 *
 * Expects `partial` to contain `{ messages: [{ id, content: delta }] }`.
 * Finds the message by id in `existing.messages` and concatenates the delta
 * onto the existing content string. Returns the same reference if nothing changed.
 *
 * Used for content-delta, reasoning-delta, compacting-delta events.
 */
export function appendDeltaToCache(
  existing: WidgetData,
  partial: WidgetData,
): WidgetData {
  if (
    typeof existing !== "object" ||
    existing === null ||
    Array.isArray(existing)
  ) {
    return existing;
  }
  if (
    typeof partial !== "object" ||
    partial === null ||
    Array.isArray(partial)
  ) {
    return existing;
  }

  const existingObj = existing as Record<string, WidgetData>;
  const partialObj = partial as Record<string, WidgetData>;

  // Find the first message in the partial with an id and content delta
  const partialMessages = partialObj["messages"];
  if (!Array.isArray(partialMessages) || partialMessages.length === 0) {
    return existing;
  }
  const deltaMsg = partialMessages[0];
  if (
    !deltaMsg ||
    typeof deltaMsg !== "object" ||
    Array.isArray(deltaMsg) ||
    !("id" in deltaMsg) ||
    !("content" in deltaMsg)
  ) {
    return existing;
  }
  const deltaMsgObj = deltaMsg as Record<string, WidgetData>;
  const targetId = deltaMsgObj["id"];
  const delta = deltaMsgObj["content"];
  if (
    typeof targetId !== "string" ||
    typeof delta !== "string" ||
    delta === ""
  ) {
    return existing;
  }

  const existingMessages = existingObj["messages"];
  if (!Array.isArray(existingMessages)) {
    return existing;
  }

  let changed = false;
  const newMessages = existingMessages.map((m) => {
    if (
      typeof m !== "object" ||
      m === null ||
      Array.isArray(m) ||
      (m as Record<string, WidgetData>)["id"] !== targetId
    ) {
      return m;
    }
    const mObj = m as Record<string, WidgetData>;
    const existingContent = mObj["content"];
    const newContent =
      typeof existingContent === "string" ? existingContent + delta : delta;
    changed = true;
    return { ...mObj, content: newContent };
  });

  if (!changed) {
    return existing;
  }
  return { ...existingObj, messages: newMessages };
}

/**
 * Remove items from an array in the cache by id.
 *
 * Expects `partial` to contain `{ messages: [{ id }] }` (or whichever array field).
 * Removes all existing items whose id appears in the partial array.
 * Returns the same reference if nothing changed.
 *
 * Used for remove operations (e.g. removing a completed task from backgroundTasks).
 */
export function removeFromCache(
  existing: WidgetData,
  partial: WidgetData,
): WidgetData {
  if (
    typeof existing !== "object" ||
    existing === null ||
    Array.isArray(existing)
  ) {
    return existing;
  }
  if (
    typeof partial !== "object" ||
    partial === null ||
    Array.isArray(partial)
  ) {
    return existing;
  }

  const existingObj = existing as Record<string, WidgetData>;
  const partialObj = partial as Record<string, WidgetData>;

  let changed = false;
  const result: Record<string, WidgetData> = { ...existingObj };

  for (const key of Object.keys(partialObj)) {
    const partialArr = partialObj[key];
    const existingArr = existingObj[key];
    if (!Array.isArray(partialArr) || !Array.isArray(existingArr)) {
      continue;
    }
    // Collect ids to remove
    const idsToRemove = new Set<string | number>();
    for (const item of partialArr) {
      if (hasId(item)) {
        idsToRemove.add(
          (item as Record<string, WidgetData>)["id"] as string | number,
        );
      }
    }
    if (idsToRemove.size === 0) {
      continue;
    }
    const filtered = existingArr.filter(
      (item) => !hasId(item) || !idsToRemove.has(item.id),
    );
    if (filtered.length !== existingArr.length) {
      result[key] = filtered;
      changed = true;
    }
  }

  return changed ? result : existing;
}
