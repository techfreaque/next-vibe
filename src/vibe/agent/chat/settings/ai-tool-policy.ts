import "server-only";

import { eq } from "drizzle-orm";

import { CATEGORY_REGISTRY } from "@/generated/categories/registry";
import { AWAIT_TASK_ALIAS } from "@/vibe/execute-tool/await-task/constants";
import { EXECUTE_TOOL_ALIAS } from "@/vibe/execute-tool/constants";
import { TOOL_HELP_ALIAS } from "@/vibe/help-tool/constants";

import { getPreferredName } from "../../../core/core-utils/path";
import { isAdminToolConfigured } from "../../../core/definition/admin-availability.server";
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

export async function getPersonalAiToolDenies(
  preferences: ToolPreferences,
): Promise<string[]> {
  const { endpointsMeta } = await import("@/generated/endpoints/meta/en");
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
