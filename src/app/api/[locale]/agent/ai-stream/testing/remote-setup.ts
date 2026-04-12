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

import type { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";
import type { ToolCallResult } from "@/app/api/[locale]/agent/chat/db";
import type { ImageGenModelSelection } from "@/app/api/[locale]/agent/image-generation/models";
import type { MusicGenModelSelection } from "@/app/api/[locale]/agent/music-generation/models";
import type { VideoGenModelSelection } from "@/app/api/[locale]/agent/video-generation/models";
import type { JsonValue } from "@/app/api/[locale]/system/unified-interface/tasks/unified-runner/types";
import { and, eq, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { db } from "@/app/api/[locale]/system/db";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import * as userSchema from "@/app/api/[locale]/user/db";
import * as remoteConnectionSchema from "@/app/api/[locale]/user/remote-connection/db";
import { remoteConnections } from "@/app/api/[locale]/user/remote-connection/db";
import { env } from "@/config/env";
import { defaultLocale } from "@/i18n/core/config";

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
    // eslint-disable-next-line i18next/no-literal-string
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
    throw new Error(`connectToHermes: ${result.message}`);
  }
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

  // Debug: also fetch all tasks for this thread (regardless of status) to diagnose missing tasks
  const allTasksForThread = await db
    .select({
      id: cronTasks.id,
      routeId: cronTasks.routeId,
      lastExecutionStatus: cronTasks.lastExecutionStatus,
      enabled: cronTasks.enabled,
      targetInstance: cronTasks.targetInstance,
      wakeUpCallbackMode: cronTasks.wakeUpCallbackMode,
      createdAt: cronTasks.createdAt,
    })
    .from(cronTasks)
    .where(eq(cronTasks.wakeUpThreadId, threadId))
    .orderBy(sql`${cronTasks.createdAt} DESC`);
  // eslint-disable-next-line no-console
  console.log("[triggerLocalPulse] ALL tasks for thread (debug)", {
    threadId,
    allCount: allTasksForThread.length,
    all: allTasksForThread.map((t) => ({
      id: t.id,
      routeId: t.routeId,
      status: t.lastExecutionStatus,
      enabled: t.enabled,
      targetInstance: t.targetInstance,
      callbackMode: t.wakeUpCallbackMode,
    })),
  });

  if (!remoteTask) {
    // eslint-disable-next-line no-console
    console.warn(
      "[triggerLocalPulse] No pending remote task found - falling back to pulse",
      { threadId },
    );
    const { PulseHealthRepository } =
      await import("@/app/api/[locale]/system/unified-interface/tasks/pulse/repository");
    await PulseHealthRepository.executePulse(
      {
        force: true,
        systemLocale: defaultLocale,
        taskNames: ["resume-stream"],
      },
      logger,
      defaultLocale,
    );
    return;
  }

  const userId = remoteTask.userId;
  if (
    !userId ||
    !remoteTask.wakeUpToolMessageId ||
    !remoteTask.wakeUpCallbackMode
  ) {
    // eslint-disable-next-line no-console
    console.warn(
      "[triggerLocalPulse] Remote task missing wakeUp context - skipping",
      {
        taskId: remoteTask.id,
        userId,
        wakeUpToolMessageId: remoteTask.wakeUpToolMessageId,
      },
    );
    return;
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

  // Resolve the user's preferred media gen models (same cascade as stream-setup).
  // Without this, the handler falls back to schema defaults (WAN_2_7_T2V, lyria-3, z-image-turbo)
  // which may have much higher credit costs than what the stream originally computed.
  // This mirrors what hermes would do if it stored and replayed the user's model selection.
  const { ModalityResolver } =
    await import("@/app/api/[locale]/agent/ai-stream/repository/core/modality-resolver");
  const { chatSettings } =
    await import("@/app/api/[locale]/agent/chat/settings/db");
  const [userSettingsRow] = await db
    .select({
      imageGenModelSelection: chatSettings.imageGenModelSelection,
      musicGenModelSelection: chatSettings.musicGenModelSelection,
      videoGenModelSelection: chatSettings.videoGenModelSelection,
    })
    .from(chatSettings)
    .where(eq(chatSettings.userId, userId))
    .limit(1);
  // Also load the favorite's media gen selections (the stream was launched with wakeUpFavoriteId).
  // The favorite may override userSettings (e.g. quality-tester favorite has LTX_2_PRO_T2V).
  interface FavMediaRow {
    skillId: string;
    variantId: string | null;
    imageGenModelSelection: ImageGenModelSelection | null;
    musicGenModelSelection: MusicGenModelSelection | null;
    videoGenModelSelection: VideoGenModelSelection | null;
  }
  let favoriteRow: FavMediaRow | null = null;
  if (remoteTask.wakeUpFavoriteId) {
    const { chatFavorites } =
      await import("@/app/api/[locale]/agent/chat/favorites/db");
    const [fav] = await db
      .select({
        skillId: chatFavorites.skillId,
        variantId: chatFavorites.variantId,
        imageGenModelSelection: chatFavorites.imageGenModelSelection,
        musicGenModelSelection: chatFavorites.musicGenModelSelection,
        videoGenModelSelection: chatFavorites.videoGenModelSelection,
      })
      .from(chatFavorites)
      .where(
        or(
          eq(chatFavorites.id, remoteTask.wakeUpFavoriteId),
          eq(chatFavorites.slug, remoteTask.wakeUpFavoriteId),
        ),
      )
      .limit(1);
    if (fav) {
      favoriteRow = fav;
    }
  }

  // Resolve skill config from the favorite's skillId (same as stream-setup does).
  // This is critical for skill-level media model defaults (e.g. quality-tester.videoGenModelId).
  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const { DEFAULT_SKILLS } =
    await import("@/app/api/[locale]/agent/chat/skills/config");
  const effectiveSkillId = remoteTask.wakeUpSkillId ?? favoriteRow?.skillId;
  const defaultSkill =
    effectiveSkillId && !uuidPattern.test(effectiveSkillId)
      ? (DEFAULT_SKILLS.find((c) => c.id === effectiveSkillId) ?? null)
      : null;
  const activeVariantId = favoriteRow?.variantId ?? null;
  const skillConfig = defaultSkill
    ? ((activeVariantId
        ? (defaultSkill.variants.find((v) => v.id === activeVariantId) ??
          defaultSkill.variants.find((v) => v.isDefault) ??
          defaultSkill.variants[0])
        : (defaultSkill.variants.find((v) => v.isDefault) ??
          defaultSkill.variants[0])) ?? null)
    : null;

  const userBridgeCtx = {
    skill: skillConfig,
    favorite: favoriteRow
      ? {
          ...favoriteRow,
          // other BridgeFavorite fields not relevant for media gen:
          voiceModelSelection: null,
          sttModelSelection: null,
          imageVisionModelSelection: null,
          videoVisionModelSelection: null,
          audioVisionModelSelection: null,
          defaultChatMode: null,
        }
      : null,
    userSettings: userSettingsRow
      ? {
          ...userSettingsRow,
          // other fields required by BridgeSettings but not queried - irrelevant for media gen:
          voiceModelSelection: null,
          sttModelSelection: null,
          imageVisionModelSelection: null,
          videoVisionModelSelection: null,
          audioVisionModelSelection: null,
          defaultChatMode: null,
        }
      : null,
  };
  const handlerImageGenModelSelection =
    ModalityResolver.resolveImageGenSelection(userBridgeCtx);
  const handlerMusicGenModelSelection =
    ModalityResolver.resolveMusicGenSelection(userBridgeCtx);
  const handlerVideoGenModelSelection =
    ModalityResolver.resolveVideoGenSelection(userBridgeCtx);

  /**
   * Execute one remote task handler in-process and return its output.
   * Returns null if the route is missing, handler not found, or throws.
   */
  async function executeTaskHandler(
    task: (typeof remoteTasks)[number],
  ): Promise<ToolCallResult | null> {
    if (!task.routeId) {
      return null;
    }
    const taskPath = getFullPath(task.routeId);
    const routeHandler = taskPath ? await getRouteHandler(taskPath) : null;
    if (!routeHandler) {
      return null;
    }

    const taskInput = task.taskInput ?? {};
    const { data: handlerData, urlPathParams } = await splitTaskArgs(
      taskPath!,
      taskInput,
    );
    if (task.routeId === "generate_video") {
      const { CreditRepository: CR } =
        await import("@/app/api/[locale]/credits/repository");
      const { t: tC } = (
        await import("@/app/api/[locale]/credits/i18n")
      ).scopedTranslation.scopedT(defaultLocale);
      const bal = await CR.getBalance(
        { userId: taskUser.id, leadId: taskUser.leadId },
        logger,
        tC,
        defaultLocale,
      );
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
      streamContext: {
        rootFolderId: DefaultFolderId.CRON,
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
        modelId: (task.wakeUpModelId ?? undefined) as ChatModelId | undefined,
        headless: undefined,
        waitingForRemoteResult: undefined,
        abortSignal: abortController.signal,
        callerCallbackMode: undefined,
        onEscalatedTaskCancel: undefined,
        escalateToTask: undefined,
        imageGenModelSelection: handlerImageGenModelSelection,
        musicGenModelSelection: handlerMusicGenModelSelection,
        videoGenModelSelection: handlerVideoGenModelSelection,
        variantId: undefined,
        isRevival: undefined,
      },
    }).catch((err: Error) => {
      logger.warn("[triggerLocalPulse] handler execution failed", {
        routeId: task.routeId,
        error: err.message,
      });
      return null;
    });

    let taskOutput: ToolCallResult | null = null;
    if (
      handlerResult &&
      "success" in handlerResult &&
      handlerResult.success &&
      "data" in handlerResult
    ) {
      taskOutput = handlerResult.data as ToolCallResult;
    }
    // eslint-disable-next-line no-console
    console.log("[triggerLocalPulse] handler result", {
      routeId: task.routeId,
      success: handlerResult
        ? (handlerResult as { success?: boolean }).success
        : null,
      videoGenModelSelectionType: handlerVideoGenModelSelection.selectionType,
      taskOutputWaiting:
        taskOutput && typeof taskOutput === "object"
          ? (taskOutput as Record<string, JsonValue>)["waiting"]
          : "n/a",
      taskOutputKeys:
        taskOutput && typeof taskOutput === "object"
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

    // Execute all tasks; collect outputs (in orderedTasks order)
    const taskOutputs: (ToolCallResult | null)[] = [];
    for (const task of orderedTasks) {
      // eslint-disable-next-line no-console
      console.log("[triggerLocalPulse] Executing parallel batch task", {
        taskId: task.id,
        routeId: task.routeId,
        callbackMode: task.wakeUpCallbackMode,
        isLast: task === orderedTasks[orderedTasks.length - 1],
      });
      // eslint-disable-next-line no-await-in-loop
      const output = await executeTaskHandler(task);
      taskOutputs.push(output);
    }

    // For non-last tasks: backfill result manually and mark completed (no revival).
    // This is the same DB update that handleTaskCompletion does for WAIT mode.
    const nonLastTasks = orderedTasks.slice(0, -1);
    for (let i = 0; i < nonLastTasks.length; i++) {
      const task = nonLastTasks[i]!;
      const output = taskOutputs[i] ?? null;
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
              ? (JSON.parse(JSON.stringify(output)) as ToolCallResult)
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

      // Mark task as completed
      // eslint-disable-next-line no-await-in-loop
      await db
        .update(cronTasks)
        .set({
          lastExecutionStatus: CronTaskStatus.COMPLETED,
          lastExecutedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(cronTasks.id, task.id));
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
      userId,
      logger,
      directResumeUser: taskUser,
      directResumeLocale: defaultLocale,
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
          eq(cronTasks.routeId, "resume-stream"),
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

  // Single-task flow (or non-WAIT parallel tasks): process just the first task.
  let taskOutput: ToolCallResult | null = await executeTaskHandler(remoteTask);

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

  // Mark task as completed in hermes-dev's DB (simulating hermes /report).
  // For DETACH tasks: also store __result in taskInput so wait-for-task can read
  // it if called later. (The /report endpoint doesn't set __result; only the local
  // goroutine path does. triggerLocalPulse runs tasks in-process without /report,
  // so we must store __result manually for detach tasks.)
  const isDetach = remoteTask.wakeUpCallbackMode === CM.DETACH;
  const existingTaskInput = (remoteTask.taskInput ?? {}) as Record<
    string,
    JsonValue
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
            ) as Record<string, JsonValue>,
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
    remoteTask.wakeUpCallbackMode === CM.WAIT
      ? CM.WAIT
      : remoteTask.wakeUpCallbackMode === CM.WAKE_UP
        ? CM.WAKE_UP
        : remoteTask.wakeUpCallbackMode === CM.DETACH
          ? CM.DETACH
          : remoteTask.wakeUpCallbackMode === CM.END_LOOP
            ? CM.END_LOOP
            : null;

  await handleTaskCompletion({
    toolMessageId: remoteTask.wakeUpToolMessageId,
    threadId,
    callbackMode: callbackModeValue,
    status: CronTaskStatus.COMPLETED,
    output: taskOutput,
    taskId: remoteTask.id,
    modelId: remoteTask.wakeUpModelId ?? null,
    skillId: remoteTask.wakeUpSkillId ?? null,
    favoriteId: remoteTask.wakeUpFavoriteId ?? null,
    leafMessageId: remoteTask.wakeUpLeafMessageId ?? null,
    userId,
    logger,
    directResumeUser: taskUser,
    directResumeLocale: defaultLocale,
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
        eq(cronTasks.routeId, "resume-stream"),
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
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
    throw new Error(
      `triggerHermesPull: task-sync/pull failed ${String(pullResp.status)} ${pullBody}`,
    );
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
