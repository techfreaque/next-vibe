/**
 * Shared test-favorite setup for the AI-stream and execute-tool suites.
 *
 * Deterministic favorite setup: delete EVERY quality-tester favorite and
 * recreate fresh — reusing rows risks model-selection drift (sync LWW,
 * earlier runs) silently changing which model records fixtures.
 */

import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { WidgetData } from "next-vibe/core/utils/json";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { createEndpointLogger } from "next-vibe/logger/server";
import { sendTestRequest } from "next-vibe/tooling/check/testing/testing-suite/send-test-request";

import type { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";
import { rootlessStreamContext } from "@/app/api/[locale]/agent/chat/config";
import { getInstanceAvailability } from "@/app/api/[locale]/agent/env-availability";
import type { ImageGenModelId } from "@/app/api/[locale]/agent/image-generation/models";
import { getBestImageGenModel } from "@/app/api/[locale]/agent/image-generation/models";
import type { MusicGenModelId } from "@/app/api/[locale]/agent/music-generation/models";
import { getBestMusicGenModel } from "@/app/api/[locale]/agent/music-generation/models";
import { resolveFavorite } from "@/app/api/[locale]/agent/skills/resolver";

/**
 * A resolved test favorite: its DB id plus the CONCRETE models the stream would
 * pick for it — resolved through the SAME resolvers the stream uses
 * (`resolveFavorite` for chat, `getBestImageGenModel` for image gen). Never a
 * hardcoded model literal: whatever the variant declares, or whatever the user
 * overrode the favorite to at runtime, is what gets asserted.
 */
export interface ResolvedVariantFavorite {
  id: string;
  /** The concrete chat model the favorite resolves to (manual / filters / variant / user override). */
  chatModelId: ChatModelId;
  /** The concrete image-gen model the favorite resolves to, when it configures one. */
  imageGenModelId: ImageGenModelId | null;
  /** The concrete music-gen model the favorite resolves to, when it configures one. */
  musicGenModelId: MusicGenModelId | null;
}

const DEFAULT_LOCALE: CountryLanguage = "en-US" as CountryLanguage;

/**
 * Resolve (or create) the ONE favorite for a skill VARIANT, then resolve the
 * concrete models it points at.
 *
 * Runtime override survives: if the user already has a favorite for this
 * `variantSkillId` (they may have edited its model in the UI), that row is
 * REUSED — never deleted/recreated — so the override is honoured. Only when no
 * favorite exists is a fresh one created from the variant's declared config.
 *
 * The returned `chatModelId` / `imageGenModelId` come from the real resolvers,
 * so assertions compare a message's `model` against what the favorite ACTUALLY
 * resolves to (MANUAL id, AUTO/filters pick, or user override) — not a literal.
 */
export async function ensureVariantFavorite(
  user: JwtPrivatePayloadType,
  variantSkillId: string,
): Promise<ResolvedVariantFavorite> {
  const [favsDef, favoriteCreateDef] = await Promise.all([
    import("@/app/api/[locale]/agent/skills/favorites/definition").then(
      (m) => m.default.GET,
    ),
    import("@/app/api/[locale]/agent/skills/favorites/create/definition").then(
      (m) => m.default.POST,
    ),
  ]);

  // Reuse an existing favorite for this variant (runtime override wins).
  const favsResult = await sendTestRequest({
    streamContext: rootlessStreamContext(),
    endpoint: favsDef,
    data: { pageSize: 500 },
    user,
  });
  const favsList =
    favsResult.success && Array.isArray(favsResult.data?.["favorites"])
      ? (favsResult.data["favorites"] as Record<string, WidgetData>[])
      : [];
  const existing = favsList.find(
    (f) => String(f["skillId"] ?? "") === variantSkillId,
  );
  let favoriteId = existing?.["id"] ? String(existing["id"]) : undefined;

  if (!favoriteId) {
    const created = await sendTestRequest({
      streamContext: rootlessStreamContext(),
      endpoint: favoriteCreateDef,
      data: { skillId: variantSkillId },
      user,
    });
    if (!created.success || !created.data?.["id"]) {
      // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
      throw new Error(
        `ensureVariantFavorite(${variantSkillId}): create failed — ${created.success ? "id missing" : String((created as { message?: string }).message ?? "")}`,
      );
    }
    favoriteId = String(created.data["id"]);
  }

  return resolveVariantFavoriteModels(user, favoriteId);
}

/**
 * Resolve the concrete chat + image-gen models a favorite points at, exactly as
 * the stream would — the single source of truth for model assertions.
 */
export async function resolveVariantFavoriteModels(
  user: JwtPrivatePayloadType,
  favoriteId: string,
): Promise<ResolvedVariantFavorite> {
  const logger = createEndpointLogger(false, DEFAULT_LOCALE);
  const resolved = await resolveFavorite(
    favoriteId,
    user.id,
    user,
    logger,
    DEFAULT_LOCALE,
  );
  if (!resolved) {
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
    throw new Error(
      `resolveVariantFavoriteModels: favorite ${favoriteId} did not resolve to a model`,
    );
  }
  // Media gen models: resolved through the same filters the stream uses.
  const availability = await getInstanceAvailability();
  const imageGenSelection = resolved.favoriteConfig.imageGenModelSelection;
  const imageGenModelId = imageGenSelection
    ? (getBestImageGenModel(imageGenSelection, user, availability)?.id ?? null)
    : null;
  const musicGenSelection = resolved.favoriteConfig.musicGenModelSelection;
  const musicGenModelId = musicGenSelection
    ? (getBestMusicGenModel(musicGenSelection, user, availability)?.id ?? null)
    : null;
  return {
    id: favoriteId,
    chatModelId: resolved.model,
    imageGenModelId,
    musicGenModelId,
  };
}

/**
 * Resolve (or create) the favorite for cases that need the CHAT model to SEE
 * images (T11f I2I + verify). Every chat model can see images — only native
 * image OUTPUT is special (that's the native-image variant) — so seeing images
 * just uses the default budget favorite. Reuse-or-create, never patch.
 */
export async function ensureVisualFavorite(
  user: JwtPrivatePayloadType,
): Promise<string> {
  const { id } = await ensureVariantFavorite(user, "quality-tester__budget");
  return id;
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
    streamContext: rootlessStreamContext(),
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
        streamContext: rootlessStreamContext(),
        endpoint: favoriteDeleteDef,
        urlPathParams: { id: String(fav["id"]) },
        user,
      });
    }
  }
  const createResult = await sendTestRequest({
    streamContext: rootlessStreamContext(),
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
