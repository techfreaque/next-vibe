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
