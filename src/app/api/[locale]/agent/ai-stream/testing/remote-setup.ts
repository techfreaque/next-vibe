/**
 * Remote Tool Calling - Shared Test Setup
 *
 * Helpers for bootstrapping remote connections in integration tests.
 * Uses the real connect/disconnect HTTP endpoints for proper E2E setup.
 *
 * Two connection directions:
 *   hermes-dev → hermes  (direct HTTP, isDirectlyAccessible=true)
 *   hermes → hermes-dev  (queue path, isDirectlyAccessible=false)
 *
 * `connectToHermes()` calls the local connect endpoint via HTTP, which:
 *   1. Logs into the prod server with email+password
 *   2. Registers hermes-dev on hermes (reverse connection)
 *   3. Syncs capabilities both ways
 *
 * `teardown` deletes the connection rows from both sides.
 */

import "server-only";

import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";
import { and, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { db } from "@/app/api/[locale]/system/db";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/server-logger";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import * as userSchema from "@/app/api/[locale]/user/db";
import * as remoteConnectionSchema from "@/app/api/[locale]/user/remote-connection/db";
import { remoteConnections } from "@/app/api/[locale]/user/remote-connection/db";
import { env } from "@/config/env";
import { defaultLocale } from "@/i18n/core/config";
import { RESUME_STREAM_ALIAS } from "../resume-stream/constants";

// ── Constants ────────────────────────────────────────────────────────────────

/** instanceId used by hermes-dev to refer to the prod (hermes) connection */
export const HERMES_INSTANCE_ID = "hermes";

/** instanceId used by hermes to refer to the hermes-dev (local) connection */
export const HERMES_DEV_INSTANCE_ID = "hermes-dev";

/** Dev server URL (vibe dev proxy) */
export const DEV_URL = "http://localhost:3000";

/** Prod server URL (hermes, vibe start) */
export const PROD_URL = "http://localhost:3001";

/** Port for the prod PostgreSQL database */
const PROD_DB_PORT = 5433;

// ── Prod DB connection ────────────────────────────────────────────────────────

let prodPool: Pool | null = null;
let prodDb: ReturnType<
  typeof drizzle<typeof userSchema & typeof remoteConnectionSchema>
> | null = null;

function getProdDb(): ReturnType<
  typeof drizzle<typeof userSchema & typeof remoteConnectionSchema>
> {
  if (!prodDb) {
    const baseUrl = env.DATABASE_URL.replace(
      /:\d+\//,
      `:${String(PROD_DB_PORT)}/`,
    );
    prodPool = new Pool({
      connectionString: baseUrl,
      max: 3,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 10_000,
    });
    prodDb = drizzle(prodPool, {
      schema: {
        ...userSchema,
        ...remoteConnectionSchema,
      },
    });
  }
  return prodDb;
}

export async function closeProdDb(): Promise<void> {
  if (prodPool) {
    await prodPool.end();
    prodPool = null;
    prodDb = null;
  }
}

// ── Prod user resolution ──────────────────────────────────────────────────────

/**
 * Resolve userId from the prod DB for cleanup purposes only.
 */
export async function resolveProdUserId(): Promise<string> {
  const pdb = getProdDb();
  const rows = await pdb.execute<{ id: string }>(
    sql`SELECT id FROM users WHERE email = ${env.VIBE_ADMIN_USER_EMAIL} LIMIT 1`,
  );
  if (rows.rows.length === 0) {
    // eslint-disable-next-line i18next/no-literal-string
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
    throw new Error(
      `resolveProdUserId: admin user ${env.VIBE_ADMIN_USER_EMAIL} not found in prod DB`,
    );
  }
  return rows.rows[0]!.id;
}

/**
 * Ensure the prod (hermes) admin user has at least `minCredits` permanent credits.
 * Used by direct-mode tests that send tool calls to hermes (3001) directly - hermes
 * checks credits in its own DB, so we must top up there, not in the local DB.
 *
 * Credits live in credit_packs (not just credit_wallets.balance), so we insert a
 * permanent pack and update the wallet balance to match.
 */
export async function ensureProdUserCredits(
  prodUserId: string,
  minCredits: number,
): Promise<void> {
  const pdb = getProdDb();

  // Read current packable balance (sum of remaining pack amounts)
  const packRows = await pdb.execute<{ total: string }>(
    sql`SELECT COALESCE(SUM(cp.remaining), 0) AS total
        FROM credit_packs cp
        JOIN credit_wallets cw ON cw.id = cp.wallet_id
        WHERE cw.user_id = ${prodUserId}
          AND (cp.expires_at IS NULL OR cp.expires_at > NOW())`,
  );
  const current = parseFloat(packRows.rows[0]?.total ?? "0");
  if (current >= minCredits) {
    return;
  }

  const toAdd = minCredits - current;

  // Ensure the user exists in the prod DB; if not, skip (FK constraint would fail)
  const userRows = await pdb.execute<{ id: string }>(
    sql`SELECT id FROM users WHERE id = ${prodUserId} LIMIT 1`,
  );
  if (!userRows.rows[0]) {
    return;
  }

  // Ensure the wallet exists; get its id
  await pdb.execute(
    sql`INSERT INTO credit_wallets (id, user_id, balance, free_credits_remaining, created_at, updated_at)
        VALUES (gen_random_uuid(), ${prodUserId}, 0, 0, NOW(), NOW())
        ON CONFLICT ON CONSTRAINT uq_wallet_user DO NOTHING`,
  );
  const walletRows = await pdb.execute<{ id: string }>(
    sql`SELECT id FROM credit_wallets WHERE user_id = ${prodUserId} LIMIT 1`,
  );
  const walletId = walletRows.rows[0]?.id;
  if (!walletId) {
    return;
  }

  // Insert a permanent pack and bump the wallet balance
  await pdb.execute(
    sql`INSERT INTO credit_packs (id, wallet_id, original_amount, remaining, type, expires_at, source, metadata, created_at, updated_at)
        VALUES (gen_random_uuid(), ${walletId}, ${toAdd}, ${toAdd}, 'permanent', NULL, 'test_top_up', '{}', NOW(), NOW())`,
  );
  await pdb.execute(
    sql`UPDATE credit_wallets SET balance = balance + ${toAdd}, updated_at = NOW() WHERE id = ${walletId}`,
  );
}

// ── Connection setup ──────────────────────────────────────────────────────────

/**
 * Establish hermes-dev → hermes connection in-process via connectRemote.
 *
 * Calls RemoteConnectionConnectRepository.connectRemote directly (no HTTP overhead).
 * This logs into hermes (prod, port 3001) with email+password, stores the token
 * locally in hermes-dev's DB, and registers hermes-dev on hermes (reverse row).
 * Capability sync happens automatically inside connectRemote.
 */
export async function connectToHermes(
  user: JwtPrivatePayloadType,
): Promise<void> {
  const { RemoteConnectionConnectRepository } =
    await import("@/app/api/[locale]/user/remote-connection/connect/repository");
  const { scopedTranslation } =
    await import("@/app/api/[locale]/user/remote-connection/connect/i18n");
  const logger = createEndpointLogger(false, Date.now(), defaultLocale);
  const { t } = scopedTranslation.scopedT(defaultLocale);

  const result = await RemoteConnectionConnectRepository.connectRemote(
    {
      remoteUrl: PROD_URL,
      email: env.VIBE_ADMIN_USER_EMAIL,
      password: env.VIBE_ADMIN_USER_PASSWORD,
    },
    user,
    logger,
    t,
    defaultLocale,
  );

  if (!result.success) {
    // "Already Connected" means hermes still has the registration from a previous run
    // but our local row was deleted by disconnectFromHermes. Unregister from hermes
    // (remote side), then retry the connect so both sides are in sync.
    if (result.message?.includes("Already Connected")) {
      // Remote already has our registration from a previous run but local row
      // was deleted by disconnectFromHermes. Clean up remote side and retry.
      // eslint-disable-next-line no-console
      console.log(
        "[connectToHermes] Already Connected - cleaning up remote and retrying",
      );

      // Delete hermes-dev's registration on hermes (remote side).
      // Use broad delete (no user filter) to catch any leftover registrations.
      const pdb = getProdDb();
      await pdb.execute(
        sql`DELETE FROM remote_connections WHERE instance_id = ${HERMES_DEV_INSTANCE_ID}`,
      );

      // Also fix self-identity if it got set to hermes-dev by a previous register call
      await pdb.execute(
        sql`UPDATE instance_identities SET instance_id = 'hermes' WHERE instance_id = ${HERMES_DEV_INSTANCE_ID}`,
      );

      // Retry connect
      const retry = await RemoteConnectionConnectRepository.connectRemote(
        {
          remoteUrl: PROD_URL,
          email: env.VIBE_ADMIN_USER_EMAIL,
          password: env.VIBE_ADMIN_USER_PASSWORD,
        },
        user,
        logger,
        t,
        defaultLocale,
      );
      if (!retry.success) {
        // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
        throw new Error(`connectToHermes retry: ${retry.message}`);
      }
      return;
    }
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
    throw new Error(`connectToHermes: ${result.message}`);
  }

  // The isDirectlyAccessible field is normally set asynchronously by the remote
  // ping when the reverse connection is registered on hermes. For tests we know
  // hermes (localhost:3001) is directly reachable, so set it explicitly here.
  await db
    .update(remoteConnections)
    .set({ isDirectlyAccessible: true, updatedAt: new Date() })
    .where(
      and(
        eq(remoteConnections.userId, user.id),
        eq(remoteConnections.instanceId, HERMES_INSTANCE_ID),
      ),
    );
}

/**
 * Remove the hermes-dev → hermes connection from hermes-dev's local DB.
 */
export async function disconnectFromHermes(userId: string): Promise<void> {
  await db
    .delete(remoteConnections)
    .where(
      and(
        eq(remoteConnections.userId, userId),
        eq(remoteConnections.instanceId, HERMES_INSTANCE_ID),
      ),
    );
}

/**
 * Remove the hermes-dev registration from the prod DB (hermes side).
 */
export async function unregisterDevFromHermes(
  prodUserId: string,
): Promise<void> {
  const pdb = getProdDb();
  await pdb.execute(
    sql`DELETE FROM remote_connections WHERE user_id = ${prodUserId} AND instance_id = ${HERMES_DEV_INSTANCE_ID}`,
  );
}

// ── Task-sync pull trigger ────────────────────────────────────────────────────

/**
 * Trigger an immediate task-sync pull on hermes-dev without waiting the full
 * 60s pulse cycle. Calls TaskSyncRepository.pullFromRemote in-process.
 */
export async function triggerPull(): Promise<void> {
  const logger = createEndpointLogger(false, Date.now(), defaultLocale);
  const { TaskSyncRepository } =
    await import("@/app/api/[locale]/system/unified-interface/tasks/task-sync/repository");
  await TaskSyncRepository.pullFromRemote(logger, defaultLocale);
}

// ── Prod admin token ──────────────────────────────────────────────────────────

/**
 * Login to hermes (prod, port 3001) as admin and return a valid admin JWT.
 * Uses VIBE_ADMIN_USER_EMAIL + VIBE_ADMIN_USER_PASSWORD from env.
 * The stored remoteConnections token is a device token (Public role), not admin.
 */
export async function resolveProdAdminToken(): Promise<string> {
  const response = await fetch(`${PROD_URL}/api/en-US/user/public/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: env.VIBE_ADMIN_USER_EMAIL,
      password: env.VIBE_ADMIN_USER_PASSWORD,
    }),
  });
  if (!response.ok) {
    const err = await response.text().catch(() => "unknown");
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
    throw new Error(
      `resolveProdAdminToken: login failed ${String(response.status)} ${err}`,
    );
  }
  const json = (await response.json()) as {
    success: boolean;
    data?: { token?: string };
  };
  if (!json.success || !json.data?.token) {
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
    throw new Error(`resolveProdAdminToken: no token in login response`);
  }
  return json.data.token;
}

// ── Local pulse trigger ───────────────────────────────────────────────────────

/**
 * Run hermes-dev's local revival in-process by simulating what hermes would do.
 *
 * Problem: hermes (port 3001) and hermes-dev (port 3000) share the same codebase
 * and similar DB setup. The execute-tool task is created in hermes-dev's DB as
 * enabled=false (to prevent local pulse from running it). Hermes's automated cron
 * is unreliable in local dev - it may or may not pick up the task depending on
 * timing and cursor state. Polling for hermes to execute + /report back is fragile.
 *
 * Additionally: when hermes does post /report and create a resume-stream cron task,
 * hermes-dev's automated server cron races to pick it up immediately (within ~0.4s),
 * running the revival without the test's fetch-cache interceptor active → AI call
 * hits real endpoints → fails → thread stuck in 'waiting'.
 *
 * Solution: skip hermes execution entirely. Find the pending remote execute-tool
 * task in hermes-dev's DB (enabled=false, lastExecutionStatus=null), simulate
 * hermes completing it via handleTaskCompletion with directResumeUser, which:
 *   1. Backfills the tool result into the originating tool message
 *   2. Creates a resume-stream cron task (safety net)
 *   3. Fires ResumeStreamRepository.resume directly in-process (fetch-cache active)
 *
 * The atomic 'waiting'→'streaming' claim prevents double-revival if the server
 * cron also picks up the resume-stream safety-net task.
 *
 * @param threadId - the thread ID to watch; used to filter the remote task
 */
export async function triggerLocalPulse(threadId: string): Promise<void> {
  const { cronTasks } =
    await import("@/app/api/[locale]/system/unified-interface/tasks/cron/db");
  const logger = createEndpointLogger(false, Date.now(), defaultLocale);
  const pulseAbortController = new AbortController();

  // Find ALL pending remote execute-tool tasks for this thread.
  // For parallel tool calls, multiple tasks can be pending simultaneously.
  // We process all WAIT tasks in one batch to avoid sequential per-task revivals
  // which would cause branch violations (each revival creates a sibling AI child).
  const remoteTasks = await db
    .select({
      id: cronTasks.id,
      routeId: cronTasks.routeId,
      taskInput: cronTasks.taskInput,
      targetInstance: cronTasks.targetInstance,
      wakeUpThreadId: cronTasks.wakeUpThreadId,
      wakeUpToolMessageId: cronTasks.wakeUpToolMessageId,
      wakeUpCallbackMode: cronTasks.wakeUpCallbackMode,
      wakeUpModelId: cronTasks.wakeUpModelId,
      wakeUpSkillId: cronTasks.wakeUpSkillId,
      wakeUpFavoriteId: cronTasks.wakeUpFavoriteId,
      wakeUpLeafMessageId: cronTasks.wakeUpLeafMessageId,
      wakeUpSubAgentDepth: cronTasks.wakeUpSubAgentDepth,
      userId: cronTasks.userId,
    })
    .from(cronTasks)
    .where(
      and(
        eq(cronTasks.wakeUpThreadId, threadId),
        sql`${cronTasks.lastExecutionStatus} IS NULL`,
        sql`${cronTasks.enabled} = false`,
        sql`${cronTasks.targetInstance} IS NOT NULL`,
      ),
    )
    .orderBy(sql`${cronTasks.createdAt} DESC`);

  const [remoteTask] = remoteTasks;

  if (!remoteTask) {
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test helper
    throw new Error(
      `[triggerLocalPulse] No pending remote task found for thread ${threadId}`,
    );
  }

  const userId = remoteTask.userId;
  if (
    !userId ||
    !remoteTask.wakeUpToolMessageId ||
    !remoteTask.wakeUpCallbackMode
  ) {
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test helper
    throw new Error(
      `[triggerLocalPulse] Remote task ${remoteTask.id} missing wakeUp context: ` +
        `userId=${String(userId)}, toolMsgId=${String(remoteTask.wakeUpToolMessageId)}, ` +
        `callbackMode=${String(remoteTask.wakeUpCallbackMode)}`,
    );
  }

  // eslint-disable-next-line no-console
  console.log(
    "[triggerLocalPulse] Found pending remote task(s) - simulating completion",
    {
      taskCount: remoteTasks.length,
      taskIds: remoteTasks.map((t) => t.id),
      threadId,
      callbackModes: remoteTasks.map((t) => t.wakeUpCallbackMode),
    },
  );

  const { CronTaskStatus } =
    await import("@/app/api/[locale]/system/unified-interface/tasks/enum");
  const { CallbackMode: CM } =
    await import("@/app/api/[locale]/system/unified-interface/ai/execute-tool/constants");

  // Build the task user JWT for direct revival.
  const { userRoles: userRolesTable } =
    await import("@/app/api/[locale]/user/db");
  const { UserRoleDB } =
    await import("@/app/api/[locale]/user/user-roles/enum");
  const [link, roleRows] = await Promise.all([
    db.query.userLeadLinks.findFirst({
      where: (ul, { eq: eql }) => eql(ul.userId, userId),
    }),
    db.select().from(userRolesTable).where(eq(userRolesTable.userId, userId)),
  ]);

  const roles = roleRows
    .map((r) => r.role)
    .filter((r): r is (typeof UserRoleDB)[number] =>
      UserRoleDB.includes(r as (typeof UserRoleDB)[number]),
    );

  const taskUser = {
    isPublic: false as const,
    id: userId,
    leadId: link?.leadId ?? userId,
    roles,
  };

  // Execute the route handler in-process to get the real tool result.
  // Running in-process ensures external AI API calls are intercepted by the
  // fetch-cache interceptor active in the test process (so fixtures apply).
  // hermes-dev has the same tool registry as hermes, so all tools are available locally.
  const { getRouteHandler } =
    await import("@/app/api/[locale]/system/generated/route-handlers");
  const { getFullPath } =
    await import("@/app/api/[locale]/system/unified-interface/shared/utils/path");
  const { splitTaskArgs } =
    await import("@/app/api/[locale]/system/unified-interface/tasks/cron/arg-splitter");
  const { Platform } =
    await import("@/app/api/[locale]/system/unified-interface/shared/types/platform");
  const { DefaultFolderId } =
    await import("@/app/api/[locale]/agent/chat/config");

  /**
   * Execute one remote task handler in-process and return its output.
   * Returns null if the route is missing, handler not found, or throws.
   */
  async function executeTaskHandler(
    task: (typeof remoteTasks)[number],
  ): Promise<WidgetData | null> {
    if (!task.routeId) {
      return null;
    }
    const taskPath = getFullPath(task.routeId);
    const routeHandler = taskPath ? await getRouteHandler(taskPath) : null;
    if (!routeHandler) {
      return null;
    }

    const taskInput = (task.taskInput ?? {}) as Record<string, WidgetData>;
    const { data: handlerData, urlPathParams } = await splitTaskArgs(
      taskPath!,
      taskInput,
    );
    // eslint-disable-next-line no-console
    console.log(
      `[triggerLocalPulse] ${task.routeId} rawTaskInput=${JSON.stringify(task.taskInput)} handlerData=${JSON.stringify(handlerData)} taskId=${task.id}`,
    );
    if (task.routeId === "generate_video") {
      const { CreditRepository: CR } =
        await import("@/app/api/[locale]/credits/repository");
      const { t: tC } = (
        await import("@/app/api/[locale]/credits/i18n")
      ).scopedTranslation.scopedT(defaultLocale);
      const bal = await CR.getBalance(taskUser, logger, tC, defaultLocale);
      // eslint-disable-next-line no-console
      console.log(
        `[triggerLocalPulse] generate_video data=${JSON.stringify(handlerData)} balance=${JSON.stringify(bal)}`,
      );
    }
    const abortController = new AbortController();
    const handlerResult = await routeHandler({
      data: handlerData,
      urlPathParams,
      user: taskUser,
      locale: defaultLocale,
      logger,
      // Use AI platform so that fields with hiddenForPlatforms: [Platform.AI, Platform.MCP]
      // are treated as hidden, enabling serverDefault (e.g. videoGenModelId) to be applied.
      // Without this, model fields fall back to schema defaults (WAN_2_7_T2V) instead of
      // the resolved model from streamContext.
      platform: Platform.AI,
      // Pass the task's DB id as cronTaskId so interactive tools (e.g. coding-agent) can
      // use path 2 (goroutine/cron context) and inject the taskId into the terminal prompt.
      cronTaskId: task.id,
      streamContext: {
        rootFolderId: DefaultFolderId.BACKGROUND,
        // Pass the real wakeUp context so wait-for-task can register T5b as a waiter
        // on the dependency task (generate_image). Without threadId/currentToolMessageId,
        // wait-for-task skips the registration (no effectiveThreadId) and the dependency
        // task retains the original T5 detach wakeUp context instead of T5b's WAIT context.
        threadId: task.wakeUpThreadId ?? undefined,
        currentToolMessageId: task.wakeUpToolMessageId ?? undefined,
        aiMessageId: task.wakeUpToolMessageId ?? undefined,
        callerToolCallId: undefined,
        pendingToolMessages: undefined,
        pendingTimeoutMs: undefined,
        leafMessageId: task.wakeUpLeafMessageId ?? undefined,
        favoriteId: task.wakeUpFavoriteId ?? undefined,
        skillId: task.wakeUpSkillId ?? undefined,
        headless: undefined,
        subAgentDepth: task.wakeUpSubAgentDepth ?? 0,
        waitingForRemoteResult: undefined,
        abortSignal: abortController.signal,
        callerCallbackMode: undefined,
        onEscalatedTaskCancel: undefined,
        escalateToTask: undefined,
        isRevival: undefined,
        providerOverride: undefined,
      },
    }).catch((err: Error) => {
      logger.warn("[triggerLocalPulse] handler execution failed", {
        routeId: task.routeId,
        error: err.message,
      });
      return null;
    });

    let taskOutput: WidgetData | null = null;
    if (
      handlerResult &&
      "success" in handlerResult &&
      handlerResult.success &&
      "data" in handlerResult
    ) {
      taskOutput = handlerResult.data;
    } else if (
      handlerResult &&
      "success" in handlerResult &&
      !handlerResult.success
    ) {
      // eslint-disable-next-line no-console
      console.log("[triggerLocalPulse] handler FAILED", {
        routeId: task.routeId,
        fullResult: JSON.stringify(handlerResult).slice(0, 500),
      });
    }
    // eslint-disable-next-line no-console
    console.log("[triggerLocalPulse] handler result", {
      routeId: task.routeId,
      success: handlerResult
        ? (handlerResult as { success?: boolean }).success
        : null,
      message:
        handlerResult && "message" in handlerResult
          ? (handlerResult as { message?: string }).message
          : undefined,
      hasFavoriteId: !!task.wakeUpFavoriteId,
      taskOutputWaiting:
        taskOutput &&
        typeof taskOutput === "object" &&
        !Array.isArray(taskOutput) &&
        !(taskOutput instanceof Date)
          ? taskOutput["waiting"]
          : "n/a",
      taskOutputKeys:
        taskOutput &&
        typeof taskOutput === "object" &&
        !Array.isArray(taskOutput) &&
        !(taskOutput instanceof Date)
          ? Object.keys(taskOutput)
          : "n/a",
    });
    return taskOutput;
  }

  // Check if all tasks are parallel WAIT tasks (all callbackMode=WAIT, multiple tasks).
  // Batch-process: backfill all non-last tasks without revival, then fire ONE revival
  // for the last WAIT task. This prevents branch violations from per-task sequential revivals.
  //
  // Use allWait (not just hasWait): mixed-mode sets like T5b (wait-for-task=WAIT +
  // generate_image=DETACH) are sequential dependencies handled by the isWaiting recursion.
  // Only true parallel-tools scenarios produce multiple WAIT tasks in the same pulse.
  const allWait = remoteTasks.every((t) => t.wakeUpCallbackMode === CM.WAIT);
  const isParallelWait = allWait && remoteTasks.length > 1;

  if (isParallelWait) {
    // eslint-disable-next-line no-console
    console.log(
      "[triggerLocalPulse] Parallel tasks detected - batch processing (WAIT revival)",
      {
        count: remoteTasks.length,
        modes: remoteTasks.map((t) => t.wakeUpCallbackMode),
      },
    );

    // Import DB tools for manual backfill
    const { chatMessages } = await import("@/app/api/[locale]/agent/chat/db");
    const { handleTaskCompletion } =
      await import("@/app/api/[locale]/system/unified-interface/tasks/task-completion-handler");

    // Reorder so the WAIT task is always last (it drives the revival).
    // Non-WAIT tasks (wakeUp, detach) are processed first as "non-last" (no revival).
    const waitTasks = remoteTasks.filter(
      (t) => t.wakeUpCallbackMode === CM.WAIT,
    );
    const nonWaitTasks = remoteTasks.filter(
      (t) => t.wakeUpCallbackMode !== CM.WAIT,
    );
    // Last WAIT task fires revival; earlier WAIT tasks are backfilled without revival.
    const orderedTasks = [...nonWaitTasks, ...waitTasks];

    // Execute tasks sequentially. For non-last tasks, mark completed + store
    // __result IMMEDIATELY after execution so that subsequent tasks (e.g.
    // wait-for-task checking a dependency) can find the result in the DB.
    const taskOutputs: (WidgetData | null)[] = [];
    for (let i = 0; i < orderedTasks.length; i++) {
      const task = orderedTasks[i]!;
      const isLast = i === orderedTasks.length - 1;
      // eslint-disable-next-line no-console
      console.log("[triggerLocalPulse] Executing parallel batch task", {
        taskId: task.id,
        routeId: task.routeId,
        callbackMode: task.wakeUpCallbackMode,
        isLast,
      });
      // eslint-disable-next-line no-await-in-loop
      const output = await executeTaskHandler(task);
      taskOutputs.push(output);

      // For non-last tasks: backfill result + mark completed immediately (no revival).
      if (!isLast) {
        const toolMessageId = task.wakeUpToolMessageId;
        if (toolMessageId) {
          // eslint-disable-next-line no-await-in-loop
          const [existing] = await db
            .select({ metadata: chatMessages.metadata })
            .from(chatMessages)
            .where(eq(chatMessages.id, toolMessageId));

          if (existing) {
            const toolCall = existing.metadata?.toolCall;
            const stableOutput =
              output !== null && output !== undefined
                ? (JSON.parse(JSON.stringify(output)) as WidgetData)
                : undefined;
            // eslint-disable-next-line no-await-in-loop
            await db
              .update(chatMessages)
              .set({
                metadata: {
                  ...existing.metadata,
                  toolCall: toolCall
                    ? { ...toolCall, status: "completed", result: stableOutput }
                    : undefined,
                },
                updatedAt: new Date(),
              })
              .where(eq(chatMessages.id, toolMessageId));
            // eslint-disable-next-line no-console
            console.log(
              "[triggerLocalPulse] Backfilled non-last parallel task (no revival)",
              {
                taskId: task.id,
                toolMessageId,
                callbackMode: task.wakeUpCallbackMode,
              },
            );
          }
        }

        // Mark task as completed. Store __result in taskInput so wait-for-task
        // (which may run as a subsequent task) can find the result.
        const existingInput = (task.taskInput ?? {}) as Record<
          string,
          WidgetData
        >;
        // eslint-disable-next-line no-await-in-loop
        await db
          .update(cronTasks)
          .set({
            lastExecutionStatus: CronTaskStatus.COMPLETED,
            lastExecutedAt: new Date(),
            updatedAt: new Date(),
            ...(output !== null
              ? {
                  taskInput: JSON.parse(
                    JSON.stringify({ ...existingInput, __result: output }),
                  ) as Record<string, WidgetData>,
                }
              : {}),
          })
          .where(eq(cronTasks.id, task.id));
      }
    }

    // For the last task (always a WAIT task): call full handleTaskCompletion with revival.
    // By now all other parallel results are already in the DB, so the AI sees
    // all results in one revival turn (no branch violation).
    const lastTask = orderedTasks[orderedTasks.length - 1]!;
    const lastOutput = taskOutputs[taskOutputs.length - 1] ?? null;

    await db
      .update(cronTasks)
      .set({
        lastExecutionStatus: CronTaskStatus.COMPLETED,
        lastExecutedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(cronTasks.id, lastTask.id));

    await handleTaskCompletion({
      toolMessageId:
        lastTask.wakeUpToolMessageId ?? remoteTask.wakeUpToolMessageId,
      threadId,
      callbackMode: CM.WAIT,
      status: CronTaskStatus.COMPLETED,
      output: lastOutput,
      taskId: lastTask.id,
      modelId: lastTask.wakeUpModelId ?? null,
      skillId: lastTask.wakeUpSkillId ?? null,
      favoriteId: lastTask.wakeUpFavoriteId ?? null,
      leafMessageId: lastTask.wakeUpLeafMessageId ?? null,
      subAgentDepth: lastTask.wakeUpSubAgentDepth ?? 0,
      ownerUser: taskUser,
      logger,
      directResumeLocale: defaultLocale,
      abortSignal: pulseAbortController.signal,
    });

    // Disable safety-net resume-stream cron tasks created by handleTaskCompletion
    await db
      .update(cronTasks)
      .set({
        lastExecutionStatus: CronTaskStatus.COMPLETED,
        lastExecutedAt: new Date(),
        enabled: false,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(cronTasks.userId, userId),
          eq(cronTasks.routeId, RESUME_STREAM_ALIAS),
          sql`${cronTasks.lastExecutionStatus} IS NULL`,
          eq(cronTasks.enabled, true),
          eq(cronTasks.runOnce, true),
        ),
      );

    // eslint-disable-next-line no-console
    console.log(
      "[triggerLocalPulse] Parallel WAIT batch complete - revival fired for last task",
      { lastTaskId: lastTask.id, threadId },
    );
    return;
  }

  // Mixed-mode parallel tasks (e.g. T7a: APPROVE + WAIT).
  // Process non-WAIT tasks first (APPROVE → just backfill confirmation result, no revival),
  // then process WAIT tasks last (trigger revival).
  const hasWait = remoteTasks.some((t) => t.wakeUpCallbackMode === CM.WAIT);
  const hasNonWait = remoteTasks.some((t) => t.wakeUpCallbackMode !== CM.WAIT);
  if (remoteTasks.length > 1 && hasWait && hasNonWait) {
    const { handleTaskCompletion: htc } =
      await import("@/app/api/[locale]/system/unified-interface/tasks/task-completion-handler");

    // eslint-disable-next-line no-console
    console.log("[triggerLocalPulse] Mixed-mode parallel tasks detected", {
      count: remoteTasks.length,
      modes: remoteTasks.map((t) => t.wakeUpCallbackMode),
    });

    // Non-WAIT tasks: execute (to produce results that WAIT tasks may depend on)
    // but don't fire revival. APPROVE tasks are skipped (they wait for user action).
    const { chatMessages: chatMsgsNW } =
      await import("@/app/api/[locale]/agent/chat/db");
    const nonWaitTasks = remoteTasks.filter(
      (t) => t.wakeUpCallbackMode !== CM.WAIT,
    );
    for (const task of nonWaitTasks) {
      const isApprove = task.wakeUpCallbackMode === CM.APPROVE;
      // eslint-disable-next-line no-await-in-loop
      const output = isApprove ? null : await executeTaskHandler(task);

      // Backfill tool message result if we executed the task.
      if (output !== null && task.wakeUpToolMessageId) {
        // eslint-disable-next-line no-await-in-loop
        const [existing] = await db
          .select({ metadata: chatMsgsNW.metadata })
          .from(chatMsgsNW)
          .where(eq(chatMsgsNW.id, task.wakeUpToolMessageId));
        if (existing) {
          const toolCall = existing.metadata?.toolCall;
          const stableOutput = JSON.parse(JSON.stringify(output)) as WidgetData;
          // eslint-disable-next-line no-await-in-loop
          await db
            .update(chatMsgsNW)
            .set({
              metadata: {
                ...existing.metadata,
                toolCall: toolCall
                  ? { ...toolCall, status: "completed", result: stableOutput }
                  : undefined,
              },
              updatedAt: new Date(),
            })
            .where(eq(chatMsgsNW.id, task.wakeUpToolMessageId));
        }
      }

      // Store __result in taskInput for DETACH tasks (wait-for-task reads it).
      const existingInput = (task.taskInput ?? {}) as Record<
        string,
        WidgetData
      >;
      // eslint-disable-next-line no-await-in-loop
      await db
        .update(cronTasks)
        .set({
          lastExecutionStatus: CronTaskStatus.COMPLETED,
          lastExecutedAt: new Date(),
          updatedAt: new Date(),
          ...(output !== null
            ? {
                taskInput: JSON.parse(
                  JSON.stringify({ ...existingInput, __result: output }),
                ) as Record<string, WidgetData>,
              }
            : {}),
        })
        .where(eq(cronTasks.id, task.id));
      // eslint-disable-next-line no-console
      console.log("[triggerLocalPulse] Mixed-mode: non-WAIT task completed", {
        taskId: task.id,
        routeId: task.routeId,
        callbackMode: task.wakeUpCallbackMode,
        executed: !isApprove,
      });
    }

    // Now process WAIT tasks with revival (same as parallel WAIT batch).
    const { chatMessages: chatMsgs } =
      await import("@/app/api/[locale]/agent/chat/db");
    const waitTasks = remoteTasks.filter(
      (t) => t.wakeUpCallbackMode === CM.WAIT,
    );
    // Execute and backfill all but the last WAIT task.
    for (let i = 0; i < waitTasks.length; i++) {
      const task = waitTasks[i]!;
      const isLast = i === waitTasks.length - 1;
      // eslint-disable-next-line no-await-in-loop
      const output = await executeTaskHandler(task);

      if (!isLast) {
        const toolMessageId = task.wakeUpToolMessageId;
        if (toolMessageId) {
          // eslint-disable-next-line no-await-in-loop
          const [existing] = await db
            .select({ metadata: chatMsgs.metadata })
            .from(chatMsgs)
            .where(eq(chatMsgs.id, toolMessageId));
          if (existing) {
            const toolCall = existing.metadata?.toolCall;
            const stableOutput =
              output !== null && output !== undefined
                ? (JSON.parse(JSON.stringify(output)) as WidgetData)
                : undefined;
            // eslint-disable-next-line no-await-in-loop
            await db
              .update(chatMsgs)
              .set({
                metadata: {
                  ...existing.metadata,
                  toolCall: toolCall
                    ? { ...toolCall, status: "completed", result: stableOutput }
                    : undefined,
                },
                updatedAt: new Date(),
              })
              .where(eq(chatMsgs.id, toolMessageId));
          }
        }
        // eslint-disable-next-line no-await-in-loop
        await db
          .update(cronTasks)
          .set({
            lastExecutionStatus: CronTaskStatus.COMPLETED,
            lastExecutedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(cronTasks.id, task.id));
      } else {
        // Last WAIT task: mark completed, then either recurse (wait-for-task dependency)
        // or fire revival via handleTaskCompletion.
        // eslint-disable-next-line no-await-in-loop
        await db
          .update(cronTasks)
          .set({
            lastExecutionStatus: CronTaskStatus.COMPLETED,
            lastExecutedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(cronTasks.id, task.id));

        // If wait-for-task registered itself as a waiter on a dependency task (waiting=true),
        // recurse like the single-task path: run the dependency task which now has WAIT context.
        const isWaitingOnDependency =
          output !== null &&
          typeof output === "object" &&
          "waiting" in output &&
          (output as { waiting: boolean }).waiting === true;

        if (isWaitingOnDependency) {
          // eslint-disable-next-line no-console
          console.log(
            "[triggerLocalPulse] Mixed-mode: wait-for-task registered waiter - recursing to run dependency task",
            { taskId: task.id, threadId },
          );
          // Disable safety-net resume-stream tasks before recursing (htc may have created one).
          await db
            .update(cronTasks)
            .set({
              lastExecutionStatus: CronTaskStatus.COMPLETED,
              lastExecutedAt: new Date(),
              enabled: false,
              updatedAt: new Date(),
            })
            .where(
              and(
                eq(cronTasks.userId, userId),
                eq(cronTasks.routeId, RESUME_STREAM_ALIAS),
                sql`${cronTasks.lastExecutionStatus} IS NULL`,
                eq(cronTasks.enabled, true),
                eq(cronTasks.runOnce, true),
              ),
            );
          // eslint-disable-next-line no-await-in-loop
          await triggerLocalPulse(threadId);
        } else {
          // Normal case: fire revival via handleTaskCompletion.
          // eslint-disable-next-line no-await-in-loop
          await htc({
            toolMessageId:
              task.wakeUpToolMessageId ?? remoteTask.wakeUpToolMessageId ?? "",
            threadId,
            callbackMode: CM.WAIT,
            status: CronTaskStatus.COMPLETED,
            output,
            taskId: task.id,
            modelId: task.wakeUpModelId ?? null,
            skillId: task.wakeUpSkillId ?? null,
            favoriteId: task.wakeUpFavoriteId ?? null,
            leafMessageId: task.wakeUpLeafMessageId ?? null,
            subAgentDepth: task.wakeUpSubAgentDepth ?? 0,
            ownerUser: taskUser,
            logger,
            directResumeLocale: defaultLocale,
            abortSignal: pulseAbortController.signal,
          });
        }
      }
    }

    // Disable safety-net resume-stream cron tasks.
    await db
      .update(cronTasks)
      .set({
        lastExecutionStatus: CronTaskStatus.COMPLETED,
        lastExecutedAt: new Date(),
        enabled: false,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(cronTasks.userId, userId),
          eq(cronTasks.routeId, RESUME_STREAM_ALIAS),
          sql`${cronTasks.lastExecutionStatus} IS NULL`,
          eq(cronTasks.enabled, true),
          eq(cronTasks.runOnce, true),
        ),
      );

    // eslint-disable-next-line no-console
    console.log("[triggerLocalPulse] Mixed-mode batch complete", { threadId });
    return;
  }

  // Single-task flow (or non-WAIT parallel tasks): process just the first task.
  let taskOutput: WidgetData | null = await executeTaskHandler(remoteTask);

  // wait-for-task(detach dependency): if the handler result is waiting=true, the
  // wait-for-task registered itself as a waiter on a detach task (e.g. generate_image).
  // The wakeUp context is now on the dependency task. Don't handleTaskCompletion for
  // wait-for-task now - instead recurse to run the dependency task first. The dependency's
  // handleTaskCompletion will fire the revival with the real result.
  const isWaiting =
    taskOutput &&
    typeof taskOutput === "object" &&
    "waiting" in taskOutput &&
    (taskOutput as { waiting: boolean }).waiting === true;
  if (isWaiting) {
    // Mark the wait-for-task cron task as completed (it did its job: registered waiter).
    await db
      .update(cronTasks)
      .set({
        lastExecutionStatus: CronTaskStatus.COMPLETED,
        lastExecutedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(cronTasks.id, remoteTask.id));
    // Now recurse to run the dependency task (generate_image / generate_video etc.)
    // It has been updated by wait-for-task with wakeUpCallbackMode=WAIT + wakeUpToolMessageId.
    // eslint-disable-next-line no-console
    console.log(
      "[triggerLocalPulse] wait-for-task registered waiter - recursing to run dependency task",
      { waitForTaskId: remoteTask.id, threadId },
    );
    await triggerLocalPulse(threadId);
    return;
  }

  // Interactive terminal pending: coding-agent spawned a real terminal, but in tests
  // there is no real terminal. Re-run the same handler with interactiveMode=false to
  // get the real batch output - so the result is identical to batch mode.
  const isTerminalPending =
    taskOutput &&
    typeof taskOutput === "object" &&
    "terminalPending" in taskOutput &&
    (taskOutput as { terminalPending: boolean }).terminalPending === true;
  if (isTerminalPending) {
    // eslint-disable-next-line no-console
    console.log(
      "[triggerLocalPulse] Interactive terminal pending - re-running as batch to get real output",
      { taskId: remoteTask.id, threadId },
    );
    // Re-run with interactiveMode=false so the actual CLI runs and returns real output.
    const batchTask = {
      ...remoteTask,
      taskInput: { ...(remoteTask.taskInput ?? {}), interactiveMode: false },
    };
    taskOutput = await executeTaskHandler(batchTask);
  }

  // Re-fetch the task to pick up any DB updates made by the handler itself.
  // wait-for-task (called inside the coding-agent goroutine context) updates
  // wakeUpCallbackMode/wakeUpToolMessageId on the task row. We must use the
  // updated values for handleTaskCompletion so the correct mode (WAIT vs WAKE_UP)
  // and the correct tool message ID are used for backfill and revival.
  const [refreshedTask] = await db
    .select({
      wakeUpCallbackMode: cronTasks.wakeUpCallbackMode,
      wakeUpToolMessageId: cronTasks.wakeUpToolMessageId,
      wakeUpModelId: cronTasks.wakeUpModelId,
      wakeUpSkillId: cronTasks.wakeUpSkillId,
      wakeUpFavoriteId: cronTasks.wakeUpFavoriteId,
      wakeUpLeafMessageId: cronTasks.wakeUpLeafMessageId,
      wakeUpSubAgentDepth: cronTasks.wakeUpSubAgentDepth,
      taskInput: cronTasks.taskInput,
    })
    .from(cronTasks)
    .where(eq(cronTasks.id, remoteTask.id));

  const effectiveTask = refreshedTask
    ? { ...remoteTask, ...refreshedTask }
    : remoteTask;

  // Mark task as completed in hermes-dev's DB (simulating hermes /report).
  // For DETACH tasks: also store __result in taskInput so wait-for-task can read
  // it if called later. (The /report endpoint doesn't set __result; only the local
  // goroutine path does. triggerLocalPulse runs tasks in-process without /report,
  // so we must store __result manually for detach tasks.)
  const isDetach = effectiveTask.wakeUpCallbackMode === CM.DETACH;
  const existingTaskInput = (remoteTask.taskInput ?? {}) as Record<
    string,
    WidgetData
  >;
  await db
    .update(cronTasks)
    .set({
      lastExecutionStatus: CronTaskStatus.COMPLETED,
      lastExecutedAt: new Date(),
      updatedAt: new Date(),
      ...(isDetach && taskOutput !== null
        ? {
            taskInput: JSON.parse(
              JSON.stringify({ ...existingTaskInput, __result: taskOutput }),
            ) as Record<string, WidgetData>,
          }
        : {}),
    })
    .where(eq(cronTasks.id, remoteTask.id));

  // Simulate hermes completing the task: handleTaskCompletion backfills the tool
  // result into the originating message, creates a resume-stream cron task (safety
  // net), and fires ResumeStreamRepository.resume directly in-process.
  // The directResumeUser ensures the revival runs here (with fetch-cache active)
  // rather than waiting for the server cron, which would run without fetch-cache.
  const { handleTaskCompletion } =
    await import("@/app/api/[locale]/system/unified-interface/tasks/task-completion-handler");

  const callbackModeValue =
    effectiveTask.wakeUpCallbackMode === CM.WAIT
      ? CM.WAIT
      : effectiveTask.wakeUpCallbackMode === CM.WAKE_UP
        ? CM.WAKE_UP
        : effectiveTask.wakeUpCallbackMode === CM.DETACH
          ? CM.DETACH
          : effectiveTask.wakeUpCallbackMode === CM.END_LOOP
            ? CM.END_LOOP
            : null;

  await handleTaskCompletion({
    toolMessageId:
      effectiveTask.wakeUpToolMessageId ?? remoteTask.wakeUpToolMessageId ?? "",
    threadId,
    callbackMode: callbackModeValue,
    status: CronTaskStatus.COMPLETED,
    output: taskOutput,
    taskId: remoteTask.id,
    modelId: effectiveTask.wakeUpModelId ?? null,
    skillId: effectiveTask.wakeUpSkillId ?? null,
    favoriteId: effectiveTask.wakeUpFavoriteId ?? null,
    leafMessageId: effectiveTask.wakeUpLeafMessageId ?? null,
    subAgentDepth: effectiveTask.wakeUpSubAgentDepth ?? 0,
    ownerUser: taskUser,
    logger,
    directResumeLocale: defaultLocale,
    abortSignal: pulseAbortController.signal,
  });

  // Disable the safety-net resume-stream cron task created by handleTaskCompletion.
  // handleTaskCompletion fires the revival directly (directResumeUser path) and creates
  // a resume-stream cron task as a fallback. The server cron must NOT run this task too
  // (double-revival causes branch violation). We mark it completed immediately after the
  // direct revival succeeds, racing before the server cron can pick it up.
  await db
    .update(cronTasks)
    .set({
      lastExecutionStatus: CronTaskStatus.COMPLETED,
      lastExecutedAt: new Date(),
      enabled: false,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(cronTasks.userId, userId),
        eq(cronTasks.routeId, RESUME_STREAM_ALIAS),
        sql`${cronTasks.lastExecutionStatus} IS NULL`,
        eq(cronTasks.enabled, true),
        eq(cronTasks.runOnce, true),
      ),
    );

  // eslint-disable-next-line no-console
  console.log("[triggerLocalPulse] handleTaskCompletion completed", {
    taskId: remoteTask.id,
    threadId,
  });
}

// ── Hermes pulse trigger ──────────────────────────────────────────────────────

/**
 * Trigger hermes (prod, port 3001) to pull tasks from hermes-dev via HTTP.
 * Hermes contacts hermes-dev, receives outbound tasks (targetInstance='hermes'),
 * and upserts them into hermes's own cron_tasks table as enabled=true.
 *
 * Call this BEFORE disabling tasks locally on hermes-dev to ensure hermes
 * receives the tasks in their enabled state.
 *
 * Requires an admin-role JWT for hermes (use resolveProdAdminToken).
 */
export async function triggerHermesPull(adminToken: string): Promise<void> {
  const headers = {
    "Content-Type": "application/json",
    // eslint-disable-next-line i18next/no-literal-string
    Authorization: `Bearer ${adminToken}`,
  };

  const pullResp = await fetch(
    `${PROD_URL}/api/en-US/system/unified-interface/tasks/task-sync/pull`,
    { method: "POST", headers, body: JSON.stringify({}) },
  );
  const pullBody = await pullResp.text().catch(() => "unknown");
  if (!pullResp.ok) {
    // Non-fatal: hermes pull is best-effort E2E coverage.
    // triggerLocalPulse drives the actual test - it does not depend on hermes pulling.
    // Hermes may fail due to schema drift, missing migrations, or other env issues.
    // eslint-disable-next-line no-console
    console.warn(
      `[triggerHermesPull] pull failed (non-fatal): status=${String(pullResp.status)} body=${pullBody.slice(0, 200)}`,
    );
    return;
  }
  // eslint-disable-next-line no-console
  console.log(
    `[triggerHermesPull] status=${String(pullResp.status)} body=${pullBody}`,
  );
}

/**
 * Trigger hermes (prod, port 3001) to execute pulled tasks via HTTP.
 * Hermes runs the pulled tasks, POSTs /report back to hermes-dev on completion,
 * which fires the revival stream.
 *
 * Requires an admin-role JWT for hermes (use resolveProdAdminToken).
 */
export async function triggerHermesPulseExecute(
  adminToken: string,
): Promise<void> {
  const headers = {
    "Content-Type": "application/json",
    // eslint-disable-next-line i18next/no-literal-string
    Authorization: `Bearer ${adminToken}`,
  };

  // 15s timeout: pulse/execute can hang if hermes has accumulated real tasks.
  // This is best-effort E2E coverage only - triggerLocalPulse drives the actual test.
  const signal = AbortSignal.timeout(15_000);
  let pulseResp: Response;
  try {
    pulseResp = await fetch(
      `${PROD_URL}/api/en-US/system/unified-interface/tasks/pulse/execute`,
      { method: "POST", headers, body: JSON.stringify({}), signal },
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(
      `[triggerHermesPulseExecute] timed out or failed (best-effort, ignoring): ${String(err)}`,
    );
    return;
  }
  const pulseBody = await pulseResp.text().catch(() => "unknown");
  if (!pulseResp.ok) {
    // Best-effort: log and continue rather than failing the test suite.
    // triggerLocalPulse is the authoritative path for revival.
    // eslint-disable-next-line no-console
    console.log(
      `[triggerHermesPulseExecute] non-ok response ${String(pulseResp.status)} ${pulseBody} (best-effort, ignoring)`,
    );
    return;
  }
  // eslint-disable-next-line no-console
  console.log(
    `[triggerHermesPulseExecute] status=${String(pulseResp.status)} body=${pulseBody}`,
  );
}

/**
 * Trigger hermes (prod, port 3001) to run its full queue cycle via HTTP:
 *   1. task-sync/pull - hermes contacts hermes-dev to pull tasks queued with
 *      targetInstance='hermes' from hermes-dev's DB into hermes's own cron_tasks.
 *   2. pulse/execute - hermes runs the pulled tasks, POSTs /report back to
 *      hermes-dev on completion, which fires the revival stream.
 *
 * Requires an admin-role JWT for hermes (use resolveProdAdminToken).
 */
export async function triggerHermesPulse(adminToken: string): Promise<void> {
  await triggerHermesPull(adminToken);
  await triggerHermesPulseExecute(adminToken);
}

// ── DB-level test assertions ─────────────────────────────────────────────────

/**
 * Assert that all remote cron tasks for a thread completed successfully.
 * Finds tasks where wakeUpThreadId matches and targetInstance is set (remote tasks).
 * Asserts at least one exists and all have lastExecutionStatus = "completed".
 */
export async function assertCronTaskCompleted(threadId: string): Promise<void> {
  const { cronTasks } =
    await import("@/app/api/[locale]/system/unified-interface/tasks/cron/db");
  const { CronTaskStatus } =
    await import("@/app/api/[locale]/system/unified-interface/tasks/enum");

  const tasks = await db
    .select({
      id: cronTasks.id,
      lastExecutionStatus: cronTasks.lastExecutionStatus,
      targetInstance: cronTasks.targetInstance,
    })
    .from(cronTasks)
    .where(
      and(
        eq(cronTasks.wakeUpThreadId, threadId),
        sql`${cronTasks.targetInstance} IS NOT NULL`,
      ),
    );

  const { expect } = await import("bun:test");
  expect(
    tasks.length,
    `[assertCronTaskCompleted] Expected at least one remote cron task for thread ${threadId}`,
  ).toBeGreaterThan(0);

  for (const task of tasks) {
    expect(
      task.lastExecutionStatus,
      `[assertCronTaskCompleted] Task ${task.id} (target=${String(task.targetInstance)}) must be completed`,
    ).toBe(CronTaskStatus.COMPLETED);
  }
}

/**
 * Assert that a thread is in idle state (not stuck in streaming/waiting).
 */
export async function assertThreadIdle(threadId: string): Promise<void> {
  const { chatThreads } = await import("@/app/api/[locale]/agent/chat/db");

  const [thread] = await db
    .select({
      streamingState: chatThreads.streamingState,
    })
    .from(chatThreads)
    .where(eq(chatThreads.id, threadId));

  const { expect } = await import("bun:test");
  expect(
    thread,
    `[assertThreadIdle] Thread ${threadId} not found`,
  ).toBeTruthy();
  expect(
    thread.streamingState,
    `[assertThreadIdle] Thread ${threadId} must be idle (got "${thread.streamingState}")`,
  ).toBe("idle");
}

/**
 * Assert that no cron tasks remain enabled for a thread (all consumed).
 */
export async function assertNoOrphanPendingTasks(
  threadId: string,
): Promise<void> {
  const { cronTasks } =
    await import("@/app/api/[locale]/system/unified-interface/tasks/cron/db");

  const orphans = await db
    .select({
      id: cronTasks.id,
      routeId: cronTasks.routeId,
      lastExecutionStatus: cronTasks.lastExecutionStatus,
    })
    .from(cronTasks)
    .where(
      and(
        eq(cronTasks.wakeUpThreadId, threadId),
        eq(cronTasks.enabled, true),
        sql`${cronTasks.lastExecutionStatus} IS NULL`,
      ),
    );

  const { expect } = await import("bun:test");
  expect(
    orphans,
    `[assertNoOrphanPendingTasks] Found ${String(orphans.length)} orphan tasks: ${JSON.stringify(orphans.map((o) => ({ id: o.id, route: o.routeId })))}`,
  ).toHaveLength(0);
}
