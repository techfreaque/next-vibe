/**
 * Vibe Sense - NOT Evaluator Pure Computation
 * Server-only.
 */

import "server-only";

import type { ResponseType } from "next-vibe/core/route/response.schema";
import { success } from "next-vibe/core/route/response.schema";
import type { SignalEvent } from "next-vibe/dataflow/shared/fields";

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
