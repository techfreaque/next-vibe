/**
 * Task Watchdog Seeds
 * Default budget caps. Inserted once; admin edits are never overwritten.
 */

/* eslint-disable i18next/no-literal-string */

import "server-only";

import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { TASK_WATCHDOG_CONFIG } from "./config";
import { taskBudgetCaps } from "./db";
import { BudgetScope } from "./enum";

async function seedDefaultCaps(logger: EndpointLogger): Promise<void> {
  const { budgetDefaults, wildcardKey, globalKey } = TASK_WATCHDOG_CONFIG;
  const inserted = await db
    .insert(taskBudgetCaps)
    .values([
      {
        scope: BudgetScope.TASK,
        key: wildcardKey,
        maxCredits: budgetDefaults.perTaskCredits,
        note: "Default for every task run without its own cap",
      },
      {
        scope: BudgetScope.DAY,
        key: globalKey,
        maxCredits: budgetDefaults.perDayCredits,
        note: "Hard ceiling for all unattended runs per UTC day",
      },
      {
        scope: BudgetScope.GOAL,
        key: wildcardKey,
        maxCredits: budgetDefaults.perGoalCredits,
        note: "Default per goal group (goal:<name> tag) per UTC day",
      },
    ])
    .onConflictDoNothing()
    .returning({ id: taskBudgetCaps.id });
  if (inserted.length > 0) {
    logger.debug(`Seeded ${inserted.length} default task budget caps`);
  }
}

export async function dev(logger: EndpointLogger): Promise<void> {
  await seedDefaultCaps(logger);
}

export async function prod(logger: EndpointLogger): Promise<void> {
  await seedDefaultCaps(logger);
}

export async function test(logger: EndpointLogger): Promise<void> {
  await seedDefaultCaps(logger);
}

export const priority = 5;
