/**
 * Fiscal receipt queue runner: retries PENDING and OFFLINE receipts through
 * their provider adapter and flags receipts past their send deadline.
 *
 * Follow-up: register a cron task that calls processFiscalQueue().
 */

import "server-only";

import { and, asc, eq, inArray, type SQL } from "drizzle-orm";
import { db } from "next-vibe/database";

import type { FiscalAdapterResolver } from "./adapter";
import { posFiscalProviders, posFiscalReceipts } from "./db";
import { FiscalReceiptStatus } from "./enum";
import { processFiscalReceipts } from "./queue-state";
import { getFiscalAdapter } from "./registry";

export async function processFiscalQueue(
  companyId?: string,
  options?: {
    resolveAdapter?: FiscalAdapterResolver;
    now?: Date;
    limit?: number;
  },
): Promise<{ processed: number; registered: number; overdue: number }> {
  const now = options?.now ?? new Date();
  const filters: SQL[] = [
    inArray(posFiscalReceipts.status, [
      FiscalReceiptStatus.PENDING,
      FiscalReceiptStatus.OFFLINE,
    ]),
  ];
  if (companyId) {
    filters.push(eq(posFiscalReceipts.companyId, companyId));
  }
  const rows = await db
    .select({
      id: posFiscalReceipts.id,
      adapter: posFiscalProviders.adapter,
      status: posFiscalReceipts.status,
      payload: posFiscalReceipts.payload,
      attempts: posFiscalReceipts.attempts,
      pkp: posFiscalReceipts.pkp,
      okp: posFiscalReceipts.okp,
      sendDeadline: posFiscalReceipts.sendDeadline,
      deadlineMissedAt: posFiscalReceipts.deadlineMissedAt,
    })
    .from(posFiscalReceipts)
    .innerJoin(
      posFiscalProviders,
      eq(posFiscalProviders.id, posFiscalReceipts.providerId),
    )
    .where(and(...filters))
    .orderBy(asc(posFiscalReceipts.issuedAt))
    .limit(options?.limit ?? 200);

  const patches = await processFiscalReceipts(
    rows,
    options?.resolveAdapter ?? getFiscalAdapter,
    now,
  );
  let registered = 0;
  let overdue = 0;
  for (const { id, patch } of patches) {
    if (patch.status === FiscalReceiptStatus.REGISTERED) {
      registered += 1;
    } else if (patch.deadlineMissedAt) {
      overdue += 1;
    }
    await db
      .update(posFiscalReceipts)
      .set(patch)
      .where(eq(posFiscalReceipts.id, id));
  }
  return { processed: patches.length, registered, overdue };
}
