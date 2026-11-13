/**
 * Blocked-attempt log for the anti-farming admin report and alerts.
 * Never fails the caller: a logging error is logged and swallowed.
 */

import "server-only";

import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { type AntiFarmingEventKind, antiFarmingEvents } from "./db";

export async function recordAntiFarmingEvent(
  event: {
    kind: AntiFarmingEventKind;
    subnet?: string | null;
    emailDomain?: string | null;
  },
  logger: EndpointLogger,
): Promise<void> {
  try {
    await db.insert(antiFarmingEvents).values({
      kind: event.kind,
      subnet: event.subnet ?? null,
      emailDomain: event.emailDomain ?? null,
    });
  } catch (error) {
    logger.error("Failed to record anti-farming event", parseError(error), {
      kind: event.kind,
    });
  }
}
