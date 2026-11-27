import "server-only";

import { eq } from "drizzle-orm";

import { CATEGORY_REGISTRY } from "@/generated/categories/registry";
import { AWAIT_TASK_ALIAS } from "@/vibe/execute-tool/await-task/constants";
import { EXECUTE_TOOL_ALIAS } from "@/vibe/execute-tool/constants";
import { TOOL_HELP_ALIAS } from "@/vibe/help-tool/constants";

import { getPreferredName } from "../../../core/core-utils/path";
import { isAdminToolConfigured } from "../../../core/definition/admin-availability.server";
import type { EndpointMeta } from "../../../core/definition/endpoints-meta";
import { db } from "../../../database";
import type { JwtPayloadType } from "../../../identity/auth/types";
import { THREAD_RENAME_ALIAS } from "../threads/rename/constants";
import { chatSettings } from "./db";
import {
  isAiToolEnabled,
  normalizeToolPreferences,
  type ToolPreferences,
} from "./tool-preferences";

const defaults = new Map(
  CATEGORY_REGISTRY.map(({ key, navigation }) => [key, navigation]),
);
const runtimeTools = new Set<string>([
  EXECUTE_TOOL_ALIAS,
  TOOL_HELP_ALIAS,
  THREAD_RENAME_ALIAS,
  AWAIT_TASK_ALIAS,
]);

export async function readToolPreferences(
  user: JwtPayloadType,
): Promise<ToolPreferences> {
  if (user.isPublic) {
    return {};
  }
  const [settings] = await db
    .select({ toolPreferences: chatSettings.toolPreferences })
    .from(chatSettings)
    .where(eq(chatSettings.userId, user.id))
    .limit(1);
  return normalizeToolPreferences(settings?.toolPreferences);
}

/**
 * The tool catalog this policy reads: the ~1 MB generated meta module, loaded
 * ONCE per process and reduced to the entries with an AI default or admin
 * availability rule. Evaluating that module inside a chat request stalled the
 * event loop ~400 ms (prod 2026-11-27, 3 watchdog rows naming
 * getPersonalAiToolDenies). Server start is meant to call {@link prewarmAiToolPolicy}
 * off the request path; a request that still comes first shares the same
 * promise instead of loading it again.
 */
let policyCatalog: Promise<EndpointMeta[]> | null = null;

function loadPolicyCatalog(): Promise<EndpointMeta[]> {
  policyCatalog ??= import("@/generated/endpoints/meta/en").then(
    ({ endpointsMeta }) => endpointsMeta,
    (error: Error) => {
      // Let the next call try again instead of caching the failure.
      policyCatalog = null;
      return Promise.reject(error);
    },
  );
  return policyCatalog;
}

/** Load the tool catalog ahead of the first chat request (server start). */
export async function prewarmAiToolPolicy(): Promise<void> {
  await loadPolicyCatalog();
}

export async function getPersonalAiToolDenies(
  preferences: ToolPreferences,
): Promise<string[]> {
  const endpointsMeta = await loadPolicyCatalog();
  const denied = new Set(
    Object.entries(preferences.aiEnabled ?? {})
      .filter(([, enabled]) => !enabled)
      .map(([id]) => getPreferredName(id)),
  );
  for (const tool of endpointsMeta) {
    if (
      !isAdminToolConfigured(tool) ||
      !isAiToolEnabled(tool, defaults.get(tool.category), preferences)
    ) {
      denied.add(getPreferredName(tool.toolName));
    }
  }
  return [...denied].filter((id) => !runtimeTools.has(id));
}
