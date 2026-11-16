/**
 * Pulse Task Repository
 * Creates and manages user-owned cron tasks for Dreaming and Autopilot modes.
 * Called from chat settings upsert when user enables/disables these modes.
 */

import "server-only";

import { and, eq, isNull, sql } from "drizzle-orm";
import { DefaultFolderId } from "next-vibe/core/execution-context";
import type { WidgetData } from "next-vibe/core/utils/json";
import { db } from "next-vibe/database";
import { TASK_TIMEOUTS } from "next-vibe/tasks/constants";
import { cronTasks } from "next-vibe/tasks/cron/db";
import { CronTaskPriority, TaskCategory } from "next-vibe/tasks/enum";
import type { IconKey } from "next-vibe/unified-ui/widgets/form-fields/icon-field/icons";

import { AI_RUN_ALIAS } from "../../../ai-stream/run/constants";
import { chatFolders } from "../../db";
import type { ChatSettings } from "../db";
import {
  AUTOPILOT_DEFAULT_SCHEDULE,
  AUTOPILOT_MAX_TURNS,
  DREAM_DEFAULT_SCHEDULE,
  DREAM_MAX_TURNS,
  MAMA_DEFAULT_SCHEDULE,
} from "./constants";

export {
  AUTOPILOT_DEFAULT_SCHEDULE,
  DREAM_DEFAULT_SCHEDULE,
  MAMA_DEFAULT_SCHEDULE,
};

/**
 * Find or create a background subfolder for a pulse task.
 * Returns the UUID of the (possibly newly created) folder.
 * Folders are user-scoped under the BACKGROUND root.
 */
async function ensurePulseSubFolder(
  userId: string,
  name: string,
  icon: IconKey,
  color: string,
): Promise<string | null> {
  const [existing] = await db
    .select({ id: chatFolders.id })
    .from(chatFolders)
    .where(
      and(
        eq(chatFolders.userId, userId),
        eq(chatFolders.rootFolderId, DefaultFolderId.BACKGROUND),
        eq(chatFolders.name, name),
        isNull(chatFolders.parentId),
      ),
    )
    .limit(1);

  if (existing) {
    return existing.id;
  }

  const [created] = await db
    .insert(chatFolders)
    .values({
      userId,
      rootFolderId: DefaultFolderId.BACKGROUND,
      name,
      icon,
      color,
      expanded: true,
      sortOrder: 0,
      pinned: true,
    })
    .returning({ id: chatFolders.id });

  return created?.id ?? null;
}

/** Stable task ID prefix for dreaming tasks */
const DREAM_TASK_PREFIX = "dream-";

/** Stable task ID prefix for autopilot tasks */
const AUTOPILOT_TASK_PREFIX = "autopilot-";

/** Generate a stable, user-scoped task ID for dreaming */
function dreamTaskId(userId: string): string {
  return `${DREAM_TASK_PREFIX}${userId.slice(0, 8)}`;
}

/** Generate a stable, user-scoped task ID for autopilot */
function autopilotTaskId(userId: string): string {
  return `${AUTOPILOT_TASK_PREFIX}${userId.slice(0, 8)}`;
}

/** Existing user-owned pulse task state needed to sync it. */
interface ExistingPulseTask {
  id: string;
  enabled: boolean;
  schedule: string;
}

/**
 * Find an existing user-owned pulse task by display name.
 * Used to reuse the existing task row instead of creating duplicates.
 */
async function findExistingPulseTask(
  userId: string,
  displayName: string,
): Promise<ExistingPulseTask | null> {
  const [existing] = await db
    .select({
      id: cronTasks.id,
      enabled: cronTasks.enabled,
      schedule: cronTasks.schedule,
    })
    .from(cronTasks)
    .where(
      and(
        eq(cronTasks.userId, userId),
        sql`lower(${cronTasks.displayName}) = lower(${displayName})`,
      ),
    )
    .limit(1);
  return existing ?? null;
}

/**
 * Due-check watermark for a pulse task that is being switched on (or moved
 * to a new schedule while on).
 *
 * The pulse treats a never-run recurring task, or one whose last run is
 * older than its latest scheduled slot, as overdue and fires it on the next
 * tick. For Dreaming/Autopilot that meant "enable" = an immediate billed
 * session at whatever hour the user clicked (prod 2026-11-14: Dreaming
 * switched on at 00:48 Paris ran at once, ~80 credits, instead of at its
 * 2 AM slot). Moving lastExecutedAt to now makes the first run the next
 * scheduled slot. Run now still starts a session on demand.
 */
function pulseEnableWatermark(
  existing: ExistingPulseTask | null,
  enabled: boolean,
  schedule: string,
): Date | undefined {
  if (!enabled) {
    return undefined;
  }
  if (!existing || !existing.enabled || existing.schedule !== schedule) {
    return new Date();
  }
  return undefined;
}

/** Default user message to kick off a dreaming session */
const DREAM_DEFAULT_PROMPT =
  "Run your dreaming session. Reorganize and consolidate the cortex - memories, documents, threads. Leave everything cleaner and more organized.";

/** Default user message to kick off an autopilot session */
const AUTOPILOT_DEFAULT_PROMPT =
  "Run your autopilot session. Pick up where active projects left off - advance next steps, handle queued work, keep things moving.";

/**
 * Ensure the dreaming cron task exists and is in the correct enabled state.
 * Creates if missing, updates schedule/favoriteId if changed, enables/disables as needed.
 */
export async function ensureDreamTask(
  userId: string,
  settings: Partial<
    Pick<
      ChatSettings,
      | "dreamerEnabled"
      | "dreamerFavoriteId"
      | "dreamerSchedule"
      | "dreamerPrompt"
    >
  >,
): Promise<void> {
  const existing = await findExistingPulseTask(userId, "Dreaming");
  const id = existing?.id ?? dreamTaskId(userId);
  const enabled = settings.dreamerEnabled ?? false;
  const schedule = settings.dreamerSchedule ?? DREAM_DEFAULT_SCHEDULE;
  const lastExecutedAt = pulseEnableWatermark(existing, enabled, schedule);
  const favoriteId = settings.dreamerFavoriteId ?? undefined;
  const prompt = settings.dreamerPrompt ?? DREAM_DEFAULT_PROMPT;

  const subFolderId = await ensurePulseSubFolder(
    userId,
    "Dreams",
    "moon",
    "#6366f1",
  );

  const taskInput: Record<string, WidgetData> = {
    favoriteId: favoriteId ?? undefined,
    skill: "thea-dreamer",
    prompt,
    maxTurns: DREAM_MAX_TURNS,
    rootFolderId: DefaultFolderId.BACKGROUND,
    subFolderId,
    appendThreadId: undefined,
    excludeMemories: false,
  };

  await db
    .insert(cronTasks)
    .values({
      id,
      shortId: id,
      routeId: AI_RUN_ALIAS,
      displayName: "Dreaming",
      description:
        "AI reorganizes your cortex while you sleep - consolidates memories, cleans up documents, surfaces what matters.",
      schedule,
      enabled,
      hidden: false,
      category: TaskCategory.SYSTEM,
      priority: CronTaskPriority.LOW,
      timeout: TASK_TIMEOUTS.EXTENDED,
      taskInput,
      userId,
      lastExecutedAt,
    })
    .onConflictDoUpdate({
      target: cronTasks.id,
      set: {
        routeId: AI_RUN_ALIAS,
        enabled,
        schedule,
        taskInput,
        lastExecutedAt,
        updatedAt: new Date(),
      },
    });
}

/**
 * Ensure the autopilot cron task exists and is in the correct enabled state.
 * Creates if missing, updates schedule/favoriteId if changed, enables/disables as needed.
 */
export async function ensureAutopilotTask(
  userId: string,
  settings: Partial<
    Pick<
      ChatSettings,
      | "autopilotEnabled"
      | "autopilotFavoriteId"
      | "autopilotSchedule"
      | "autopilotPrompt"
    >
  >,
): Promise<void> {
  const existing = await findExistingPulseTask(userId, "Autopilot");
  const id = existing?.id ?? autopilotTaskId(userId);
  const enabled = settings.autopilotEnabled ?? false;
  const schedule = settings.autopilotSchedule ?? AUTOPILOT_DEFAULT_SCHEDULE;
  const lastExecutedAt = pulseEnableWatermark(existing, enabled, schedule);
  const favoriteId = settings.autopilotFavoriteId ?? undefined;
  const prompt = settings.autopilotPrompt ?? AUTOPILOT_DEFAULT_PROMPT;

  const subFolderId = await ensurePulseSubFolder(
    userId,
    "Autopilot",
    "zap",
    "#f59e0b",
  );

  const taskInput: Record<string, WidgetData> = {
    favoriteId: favoriteId ?? undefined,
    skill: "hermes-autopilot",
    prompt,
    maxTurns: AUTOPILOT_MAX_TURNS,
    rootFolderId: DefaultFolderId.BACKGROUND,
    subFolderId,
    appendThreadId: undefined,
    excludeMemories: false,
  };

  await db
    .insert(cronTasks)
    .values({
      id,
      shortId: id,
      routeId: AI_RUN_ALIAS,
      displayName: "Autopilot",
      description:
        "AI works your queue while you're away - advances projects, handles next steps, picks up where you left off.",
      schedule,
      enabled,
      hidden: false,
      category: TaskCategory.SYSTEM,
      priority: CronTaskPriority.LOW,
      timeout: TASK_TIMEOUTS.EXTENDED,
      taskInput,
      userId,
      lastExecutedAt,
    })
    .onConflictDoUpdate({
      target: cronTasks.id,
      set: {
        routeId: AI_RUN_ALIAS,
        enabled,
        schedule,
        taskInput,
        lastExecutedAt,
        updatedAt: new Date(),
      },
    });
}

/** Stable task ID for the global mama heartbeat (shared across all admins, userId = null) */
const MAMA_TASK_ID = "thea-mama";

/** Default prompt for mama sessions */
const MAMA_DEFAULT_PROMPT =
  "Run your mama session. Check platform health, review error logs, advance any pending feature work, and draft any needed announcements. Leave a summary in /documents/mama/log/.";

/**
 * Ensure the mama heartbeat cron task exists and is in the correct enabled state.
 * This is a global system task (userId = null) - shared across all admins.
 * Last-write-wins: whichever admin saves settings controls the shared task.
 * userId is the admin who triggered the settings save - used to scope the mama folder.
 */
export async function ensureMamaTask(
  userId: string,
  settings: Partial<
    Pick<ChatSettings, "mamaEnabled" | "mamaSchedule" | "mamaPrompt">
  >,
): Promise<void> {
  // Mama is a global system task (userId=null) - find by displayName with null userId
  const [existingMama] = await db
    .select({ id: cronTasks.id })
    .from(cronTasks)
    .where(
      and(
        isNull(cronTasks.userId),
        sql`lower(${cronTasks.displayName}) = lower('Mama Heartbeat')`,
      ),
    )
    .limit(1);
  const mamaId = existingMama?.id ?? MAMA_TASK_ID;
  const enabled = settings.mamaEnabled ?? false;
  const schedule = settings.mamaSchedule ?? MAMA_DEFAULT_SCHEDULE;
  const prompt = settings.mamaPrompt ?? MAMA_DEFAULT_PROMPT;

  const subFolderId = await ensurePulseSubFolder(
    userId,
    "Mama",
    "heart",
    "#ec4899",
  );

  const taskInput: Record<string, WidgetData> = {
    skill: "thea-mama",
    prompt,
    maxTurns: 15,
    rootFolderId: DefaultFolderId.BACKGROUND,
    subFolderId,
    appendThreadId: undefined,
    excludeMemories: false,
  };

  await db
    .insert(cronTasks)
    .values({
      id: mamaId,
      shortId: mamaId,
      routeId: AI_RUN_ALIAS,
      displayName: "Mama Heartbeat",
      description:
        "Thea monitors the production instance - checks health, advances features, handles marketing, sends news.",
      schedule,
      enabled,
      hidden: false,
      category: TaskCategory.SYSTEM,
      priority: CronTaskPriority.LOW,
      timeout: TASK_TIMEOUTS.EXTENDED,
      taskInput,
      userId: null,
    })
    .onConflictDoUpdate({
      target: cronTasks.id,
      set: {
        routeId: AI_RUN_ALIAS,
        enabled,
        schedule,
        taskInput,
        updatedAt: new Date(),
      },
    });
}
