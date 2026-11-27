/**
 * Input-key audit for execute-tool.
 *
 * A target endpoint's request schema is a stripping `z.object`: argument names
 * it does not declare vanish before validation, so a caller that misnames its
 * arguments (`email` for `targetUserId`, `credits` for `amount`) sees only
 * "targetUserId: expected string, received undefined" and never learns WHY
 * (prod 2026-11-26: credits/admin-add with receivedKeys ""). This module names
 * the keys that would be dropped next to the keys the endpoint expects.
 *
 * Key NAMES only: values never reach a log or an error message.
 */

import "server-only";

import { z } from "zod";

import type { CreateApiEndpointAny } from "../../core/definition/endpoint-base";
import type { WidgetData } from "../../core/utils/json";

export interface InputKeyAudit {
  /** Keys the caller sent that neither schema declares (sorted). */
  unknownKeys: string[];
  /** Keys the endpoint declares: request body + URL path params (sorted). */
  expectedKeys: string[];
  /** Keys the caller sent that the endpoint declares. */
  knownKeyCount: number;
}

function declaredKeys(schema: z.ZodType): string[] | null {
  return schema instanceof z.ZodObject ? Object.keys(schema.shape) : null;
}

/**
 * Compare the caller's argument names with the endpoint's declared fields.
 * Returns null when nothing would be dropped, or when the request schema is
 * not a plain object (unions, records): those do not strip by name, so there
 * is nothing to report.
 */
export function auditInputKeys(params: {
  definition: Pick<
    CreateApiEndpointAny,
    "requestSchema" | "requestUrlPathParamsSchema"
  >;
  data: Record<string, WidgetData>;
  urlPathParams: Record<string, WidgetData>;
}): InputKeyAudit | null {
  const requestKeys = declaredKeys(params.definition.requestSchema);
  if (requestKeys === null) {
    return null;
  }
  // An endpoint without path params builds a non-object placeholder there.
  const urlKeys =
    declaredKeys(params.definition.requestUrlPathParamsSchema) ?? [];
  const expected = new Set([...requestKeys, ...urlKeys]);
  const sent = new Set([
    ...Object.keys(params.data),
    ...Object.keys(params.urlPathParams),
  ]);
  const unknownKeys = [...sent].filter((key) => !expected.has(key)).toSorted();
  if (unknownKeys.length === 0) {
    return null;
  }
  return {
    unknownKeys,
    expectedKeys: [...expected].toSorted(),
    knownKeyCount: sent.size - unknownKeys.length,
  };
}

/**
 * True when not one argument the caller sent reaches the endpoint: every name
 * is unknown and the endpoint does take arguments. Running the call would
 * execute it with defaults only, which is never what the caller meant. A
 * no-argument endpoint is exempt (some MCP clients send a dummy key to tools
 * without parameters).
 */
export function isEveryKeyUnknown(audit: InputKeyAudit): boolean {
  return audit.knownKeyCount === 0 && audit.expectedKeys.length > 0;
}
