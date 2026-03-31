/**
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * TODO REMOVE THIS ENTIRE FILE once confirmed clean in production.
 *
 * One-time migration: deletes all successful pulse executions that
 * accumulated before we switched to failure-only logging. Runs on every
 * startup but is a cheap no-op once the table is clean.
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 */

/* eslint-disable i18next/no-literal-string */

import "server-only";

import { eq } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { PulseExecutionStatus } from "../enum";
import { pulseExecutions } from "./db";

async function purgeSuccessfulPulseExecutions(
  logger: EndpointLogger,
): Promise<void> {
  const result = await db
    .delete(pulseExecutions)
    .where(eq(pulseExecutions.status, PulseExecutionStatus.SUCCESS))
    .returning({ id: pulseExecutions.id });

  if (result.length > 0) {
    logger.info(
      `[TODO REMOVE] Deleted ${result.length} successful pulse executions (one-time cleanup)`,
    );
  }
}

export async function dev(logger: EndpointLogger): Promise<void> {
  await purgeSuccessfulPulseExecutions(logger);
}

export async function prod(logger: EndpointLogger): Promise<void> {
  await purgeSuccessfulPulseExecutions(logger);
}

export async function test(logger: EndpointLogger): Promise<void> {
  await purgeSuccessfulPulseExecutions(logger);
}

// Run after task seeds (priority 1) but before anything that queries pulse history
export const priority = 10;
