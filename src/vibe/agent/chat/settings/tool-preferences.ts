import { z } from "zod";

import { getPreferredName } from "../../../core/core-utils/path";
import type {
  EndpointMeta,
  ToolNavigationDefaults,
} from "../../../core/definition/endpoints-meta";
import type { JwtPayloadType } from "../../../identity/auth/types";

const preferencesMap = z.record(z.string(), z.boolean()).optional();
export const toolPreferencesSchema = z.object({
  webPins: preferencesMap,
  chatPins: preferencesMap,
  webHidden: preferencesMap,
  chatHidden: preferencesMap,
  aiEnabled: preferencesMap,
});

export type ToolPreferences = z.infer<typeof toolPreferencesSchema>;

export const toolPreferencePatchSchema = z.object({
  toolId: z.string().min(1).max(250),
  key: z.enum(["webPins", "chatPins", "webHidden", "chatHidden", "aiEnabled"]),
  value: z.boolean(),
});

export type ToolPreferencePatch = z.infer<typeof toolPreferencePatchSchema>;

export function normalizeToolPreferences(
  preferences: ToolPreferences | null | undefined,
): ToolPreferences {
  return {
    webPins: normalizeToolIds(preferences?.webPins),
    chatPins: normalizeToolIds(preferences?.chatPins),
    webHidden: normalizeToolIds(preferences?.webHidden),
    chatHidden: normalizeToolIds(preferences?.chatHidden),
    aiEnabled: normalizeToolIds(preferences?.aiEnabled),
  };
}

function normalizeToolIds(
  ids: Record<string, boolean> | undefined,
): Record<string, boolean> | undefined {
  return (
    ids &&
    Object.fromEntries(
      Object.entries(ids).map(([id, value]) => [getPreferredName(id), value]),
    )
  );
}

export function withToolPreference(
  preferences: ToolPreferences,
  { key, toolId, value }: ToolPreferencePatch,
): ToolPreferences {
  return {
    ...preferences,
    [key]: { ...preferences[key], [getPreferredName(toolId)]: value },
  };
}

export function mergeWebPins(
  base: readonly string[],
  overrides: ToolPreferences["webPins"],
): string[] {
  const merged = new Set(base.map(getPreferredName));
  for (const [toolId, pinned] of Object.entries(overrides ?? {})) {
    if (pinned) {
      merged.add(toolId);
    } else {
      merged.delete(toolId);
    }
  }
  return [...merged];
}

export function isToolDiscoverable(
  tool: EndpointMeta,
  category: ToolNavigationDefaults | undefined,
  surface: "web" | "chat",
): boolean {
  if (
    surface === "web" &&
    tool.navigation?.web === undefined &&
    tool.admin?.hidden
  ) {
    return false;
  }
  return tool.navigation?.[surface] ?? category?.[surface] ?? true;
}

export function isToolPinnedByDefault(
  tool: EndpointMeta,
  category: ToolNavigationDefaults | undefined,
  surface: "web" | "chat",
  user: JwtPayloadType,
): boolean {
  const roles =
    surface === "web"
      ? (tool.navigation?.defaultWebPinned ??
        tool.defaultWebPinned ??
        category?.defaultWebPinned)
      : (tool.navigation?.defaultChatPinned ??
        category?.defaultChatPinned ??
        tool.defaultAiPinned);
  return (
    roles?.some((role) => user.roles.some((userRole) => userRole === role)) ??
    false
  );
}

export function isAiToolEnabled(
  tool: EndpointMeta,
  category: ToolNavigationDefaults | undefined,
  preferences: ToolPreferences,
): boolean {
  const id = getPreferredName(tool.toolName);
  return (
    preferences.aiEnabled?.[id] ??
    tool.navigation?.aiEnabled ??
    category?.aiEnabled ??
    true
  );
}
