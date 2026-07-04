/**
 * Shared test-favorite setup for the AI-stream and execute-tool suites.
 *
 * Deterministic favorite setup: delete EVERY quality-tester favorite and
 * recreate fresh — reusing rows risks model-selection drift (sync LWW,
 * earlier runs) silently changing which model records fixtures.
 */

import "server-only";

import type { WidgetData } from "next-vibe/core/utils/json";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { sendTestRequest } from "next-vibe/tooling/check/testing/testing-suite/send-test-request";

/**
 * Resolve (or create) a quality-tester__visual favorite — GEMINI_3_5_FLASH,
 * image-capable. Used by cases that need the CHAT model to SEE images
 * (T11f I2I + verify); the budget variant (deepseek-v4-flash) is text-only.
 */
export async function ensureVisualFavorite(
  user: JwtPrivatePayloadType,
): Promise<string> {
  const [favsDef, favoriteCreateDef] = await Promise.all([
    import("@/app/api/[locale]/agent/skills/favorites/definition").then(
      (m) => m.default.GET,
    ),
    import("@/app/api/[locale]/agent/skills/favorites/create/definition").then(
      (m) => m.default.POST,
    ),
  ]);
  const favsResult = await sendTestRequest({
    endpoint: favsDef,
    data: { pageSize: 500 },
    user,
  });
  const favsList =
    favsResult.success && Array.isArray(favsResult.data?.["favorites"])
      ? (favsResult.data["favorites"] as Record<string, WidgetData>[])
      : [];
  const existing = favsList.find(
    (f) => String(f["skillId"] ?? "") === "quality-tester__visual",
  );
  if (existing?.["id"]) {
    return String(existing["id"]);
  }
  const created = await sendTestRequest({
    endpoint: favoriteCreateDef,
    data: { skillId: "quality-tester__visual" },
    user,
  });
  if (!created.success || !created.data?.["id"]) {
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
    throw new Error("ensureVisualFavorite: create failed");
  }
  return String(created.data["id"]);
}

/**
 * Delete all existing quality-tester favorites for `user`, then create a fresh
 * quality-tester__budget favorite and return its id.
 */
export async function createQualityTesterFavorite(
  user: JwtPrivatePayloadType,
): Promise<string> {
  const [favsDef, favoriteCreateDef, favoriteDeleteDef] = await Promise.all([
    import("@/app/api/[locale]/agent/skills/favorites/definition").then(
      (m) => m.default.GET,
    ),
    import("@/app/api/[locale]/agent/skills/favorites/create/definition").then(
      (m) => m.default.POST,
    ),
    import("@/app/api/[locale]/agent/skills/favorites/[id]/definition").then(
      (m) => m.default.DELETE,
    ),
  ]);
  const favsResult = await sendTestRequest({
    endpoint: favsDef,
    data: { pageSize: 500 },
    user,
  });
  const favsList =
    favsResult.success && Array.isArray(favsResult.data?.["favorites"])
      ? (favsResult.data["favorites"] as Record<string, WidgetData>[])
      : [];
  for (const fav of favsList) {
    if (String(fav["skillId"] ?? "").startsWith("quality-tester")) {
      await sendTestRequest({
        endpoint: favoriteDeleteDef,
        urlPathParams: { id: String(fav["id"]) },
        user,
      });
    }
  }
  const createResult = await sendTestRequest({
    endpoint: favoriteCreateDef,
    data: { skillId: "quality-tester__budget" },
    user,
  });
  if (!createResult.success || !createResult.data?.["id"]) {
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
    throw new Error(
      `createQualityTesterFavorite: failed — ${createResult.success ? "id missing" : String((createResult as { message?: string }).message ?? "")}`,
    );
  }
  return String(createResult.data["id"]);
}
