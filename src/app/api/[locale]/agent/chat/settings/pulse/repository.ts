/**
 * Pulse Task Repository
 * Creates and manages user-owned cron tasks for Dreaming and Autopilot modes.
 * Called from chat settings upsert when user enables/disables these modes.
 */

import "server-only";

import { and, eq, isNull } from "drizzle-orm";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { chatFolders } from "@/app/api/[locale]/agent/chat/db";
import { db } from "@/app/api/[locale]/system/db";
import { cronTasks } from "@/app/api/[locale]/system/unified-interface/tasks/cron/db";
import {
  CronTaskPriority,
  TaskCategory,
} from "@/app/api/[locale]/system/unified-interface/tasks/enum";
import { TASK_TIMEOUTS } from "@/app/api/[locale]/system/unified-interface/tasks/constants";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";

import type { IconKey } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";

import type { ChatSettings } from "../db";
import {
  DREAM_DEFAULT_SCHEDULE,
  AUTOPILOT_DEFAULT_SCHEDULE,
  MAMA_DEFAULT_SCHEDULE,
} from "./constants";

export {
  DREAM_DEFAULT_SCHEDULE,
  AUTOPILOT_DEFAULT_SCHEDULE,
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

/** Default user message to kick off a dreaming session */
const DREAM_DEFAULT_PROMPT =
  "Run your dreaming session. Reorganize and consolidate the cortex — memories, documents, threads. Leave everything cleaner and more organized.";

/** Default user message to kick off an autopilot session */
const AUTOPILOT_DEFAULT_PROMPT =
  "Run your autopilot session. Pick up where active projects left off — advance next steps, handle queued work, keep things moving.";

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
  const id = dreamTaskId(userId);
  const enabled = settings.dreamerEnabled ?? false;
  const schedule = settings.dreamerSchedule ?? DREAM_DEFAULT_SCHEDULE;
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
    maxTurns: 10,
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
      routeId: "agent.ai-stream.run",
      displayName: "Dreaming",
      description:
        "AI reorganizes your cortex while you sleep — consolidates memories, cleans up documents, surfaces what matters.",
      schedule,
      enabled,
      hidden: false,
      category: TaskCategory.SYSTEM,
      priority: CronTaskPriority.LOW,
      timeout: TASK_TIMEOUTS.EXTENDED,
      taskInput,
      userId,
    })
    .onConflictDoUpdate({
      target: cronTasks.id,
      set: {
        enabled,
        schedule,
        taskInput,
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
  const id = autopilotTaskId(userId);
  const enabled = settings.autopilotEnabled ?? false;
  const schedule = settings.autopilotSchedule ?? AUTOPILOT_DEFAULT_SCHEDULE;
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
    maxTurns: 12,
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
      routeId: "agent.ai-stream.run",
      displayName: "Autopilot",
      description:
        "AI works your queue while you're away — advances projects, handles next steps, picks up where you left off.",
      schedule,
      enabled,
      hidden: false,
      category: TaskCategory.SYSTEM,
      priority: CronTaskPriority.LOW,
      timeout: TASK_TIMEOUTS.EXTENDED,
      taskInput,
      userId,
    })
    .onConflictDoUpdate({
      target: cronTasks.id,
      set: {
        enabled,
        schedule,
        taskInput,
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
 * This is a global system task (userId = null) — shared across all admins.
 * Last-write-wins: whichever admin saves settings controls the shared task.
 * userId is the admin who triggered the settings save — used to scope the mama folder.
 */
export async function ensureMamaTask(
  userId: string,
  settings: Partial<
    Pick<ChatSettings, "mamaEnabled" | "mamaSchedule" | "mamaPrompt">
  >,
): Promise<void> {
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
      id: MAMA_TASK_ID,
      shortId: MAMA_TASK_ID,
      routeId: "agent.ai-stream.run",
      displayName: "Mama Heartbeat",
      description:
        "Thea monitors the production instance — checks health, advances features, handles marketing, sends news.",
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
        enabled,
        schedule,
        taskInput,
        updatedAt: new Date(),
      },
    });
}

/**
 * Disable a pulse task by ID. Used when user toggles off — keeps task row for re-enable later.
 */
export async function disablePulseTask(
  taskId: string,
  userId: string,
): Promise<void> {
  await db
    .update(cronTasks)
    .set({ enabled: false, updatedAt: new Date() })
    .where(and(eq(cronTasks.id, taskId), eq(cronTasks.userId, userId)));
}
