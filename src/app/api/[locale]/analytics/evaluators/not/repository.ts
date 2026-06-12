/**
 * Vibe Sense - NOT Evaluator Pure Computation
 * Server-only.
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import type { SignalEvent } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";

export class NotEvaluatorRepository {
  static computeNot(signal: SignalEvent[]): SignalEvent[] {
    return signal.map((p) => ({ timestamp: p.timestamp, fired: !p.fired }));
  }

  static handle(data: {
    signal: SignalEvent[];
  }): ResponseType<{ result: SignalEvent[] }> {
    const result = NotEvaluatorRepository.computeNot(data.signal);
    return success({ result });
  }
}
