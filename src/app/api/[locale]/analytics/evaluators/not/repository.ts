/**
 * Vibe Sense — NOT Evaluator Pure Computation
 * Server-only.
 */

import "server-only";

import type { SignalEvent } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";

export function computeNot(signal: SignalEvent[]): SignalEvent[] {
  return signal.map((p) => ({ timestamp: p.timestamp, fired: !p.fired }));
}
