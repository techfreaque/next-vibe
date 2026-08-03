/**
 * Execute-tool durable state.
 *
 * pending_call_results — the CROSS-PROCESS handoff for WAIT results. An
 * instance runs multiple processes sharing one DB (dev server, CLI, tests):
 * the tool-execute-result event can land in a process that holds NO in-memory
 * pending call for it (the waiter lives elsewhere, or the requester
 * restarted). The receiving process persists the outcome here; every
 * `awaitPendingCallResult` polls this table as its fallback, so a WAIT
 * resolves no matter which process the result arrived in — and survives a
 * requester restart. Rows are deleted on consumption; stale rows are purged
 * opportunistically on insert.
 */

import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import type { WidgetData } from "../core/utils/json";

export const pendingCallResults = pgTable("pending_call_results", {
  /** The requester's callId — one durable result per call. */
  callId: text("call_id").primaryKey(),
  status: text("status", { enum: ["completed", "failed"] })
    .$type<"completed" | "failed">()
    .notNull(),
  output: jsonb("output").$type<Record<string, WidgetData> | null>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
