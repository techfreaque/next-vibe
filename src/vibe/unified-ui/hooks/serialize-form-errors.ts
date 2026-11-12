/**
 * Safe react-hook-form error serialization.
 *
 * `JSON.stringify(errors)` on a FieldErrors tree throws "Converting circular
 * structure to JSON": every leaf carries `ref` (the registered DOM input /
 * React fiber). That throw happened INSIDE the invalid-submit handler, so the
 * validation log line and the user-facing error were both lost.
 *
 * This walks the tree and keeps only what is useful and safe: the dotted
 * field path, the rule type and the message. Refs and values are dropped
 * (values may be an email or a secret). Never throws.
 */

import type { FieldErrors, FieldValues } from "react-hook-form";

export interface SerializedFieldError {
  /** Dotted path: "email", "address.city", "items.2.name", "items.root" */
  field: string;
  /** Validation rule: "required", "too_small", "invalid_type", ... */
  type: string;
  message: string;
}

/** Keys of a FieldError leaf that are metadata, never child fields. */
const LEAF_META_KEYS = new Set(["type", "message", "ref", "types"]);

/** Hard stop for pathological trees (huge arrays of rows). */
const MAX_ERRORS = 200;
const MAX_DEPTH = 12;

/**
 * Structural view of one FieldErrors node. FieldErrors values are typed
 * per-form; the walker only ever reads these members, guarded at runtime.
 */
interface ErrorTreeNode {
  type?: string | number | null;
  message?: string | null;
  [key: string]: ErrorTreeNode | string | number | boolean | null | undefined;
}

function isNode(
  value: ErrorTreeNode | string | number | boolean | null | undefined,
): value is ErrorTreeNode {
  return typeof value === "object" && value !== null;
}

function walk(
  node: ErrorTreeNode,
  path: string,
  depth: number,
  out: SerializedFieldError[],
  seen: WeakSet<ErrorTreeNode>,
): void {
  if (out.length >= MAX_ERRORS || depth > MAX_DEPTH || seen.has(node)) {
    return;
  }
  seen.add(node);

  const type = node.type;
  if (
    path.length > 0 &&
    (typeof type === "string" || typeof type === "number")
  ) {
    out.push({
      field: path,
      type: String(type),
      message: typeof node.message === "string" ? node.message : "",
    });
  }

  for (const key of Object.keys(node)) {
    if (LEAF_META_KEYS.has(key)) {
      continue;
    }
    // ref is skipped above; anything else that is not a plain object/array is
    // not an error node (and DOM nodes never appear outside `ref`).
    const child = node[key];
    if (isNode(child)) {
      walk(
        child,
        path.length > 0 ? `${path}.${key}` : key,
        depth + 1,
        out,
        seen,
      );
    }
  }
}

type JsonReplacerValue =
  | ErrorTreeNode
  | string
  | number
  | boolean
  | null
  | undefined;

/**
 * Ref-free, cycle-free JSON of the raw tree. `ref` keys are dropped before
 * descent, so DOM nodes / fibers are never visited; the WeakSet catches any
 * other cycle. Never throws (a replacer-level failure yields "{}").
 */
function stripRefs<TFieldValues extends FieldValues>(
  errors: FieldErrors<TFieldValues>,
): string {
  const seen = new WeakSet<ErrorTreeNode>();
  try {
    return JSON.stringify(
      errors,
      (key: string, value: JsonReplacerValue): JsonReplacerValue => {
        if (key === "ref") {
          return undefined;
        }
        if (isNode(value)) {
          if (seen.has(value)) {
            return undefined;
          }
          seen.add(value);
        }
        return value;
      },
    );
  } catch {
    return "{}";
  }
}

/** Flatten a FieldErrors tree to `{field, type, message}` rows. Never throws. */
export function flattenFormErrors<TFieldValues extends FieldValues>(
  errors: FieldErrors<TFieldValues>,
): SerializedFieldError[] {
  const out: SerializedFieldError[] = [];
  try {
    // Re-parsed into the structural node shape the walker reads
    const root: ErrorTreeNode = JSON.parse(stripRefs(errors));
    walk(root, "", 0, out, new WeakSet());
  } catch {
    // Unparseable (cannot happen for stripRefs output) - return what we have
  }
  return out;
}

/**
 * JSON string of the flattened errors - drop-in replacement for the old
 * `JSON.stringify(errors)`. Never throws.
 */
export function serializeFormErrors<TFieldValues extends FieldValues>(
  errors: FieldErrors<TFieldValues>,
): string {
  try {
    return JSON.stringify(flattenFormErrors(errors));
  } catch {
    return "[]";
  }
}

/** Human-readable "field: type - message; ..." for log rows and toasts. */
export function describeFormErrors<TFieldValues extends FieldValues>(
  errors: FieldErrors<TFieldValues>,
  maxLength = 1000,
): string {
  return flattenFormErrors(errors)
    .map((e) => `${e.field}: ${e.type} - ${e.message}`)
    .join("; ")
    .slice(0, maxLength);
}
