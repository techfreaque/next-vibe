/**
 * Media-gen requestDefaults must use the SAME model selection the stream
 * resolved in setup (and advertised in the system prompt), not re-query the
 * favorite from the DB. The chat client sends its live favorite config with
 * the request; when that favorite is not (yet) a DB row - an unsaved edit, a
 * skill-variant card - the DB re-query found nothing and fell back to the
 * skill/platform default, so a different image model answered than the one
 * the user picked (creator report 2026-11-16).
 */

import { describe, expect, it } from "bun:test";
import { makeHeadlessContext } from "next-vibe/core/execution-context";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { Platform } from "next-vibe/platforms/platforms";

import { ImageGenModelId } from "../image-generation/models";
import { DEFAULT_MUSIC_GEN_MODEL_SELECTION } from "../music-generation/constants";
import { ModelSelectionType } from "../skills/enum";
import { DEFAULT_VIDEO_GEN_MODEL_SELECTION } from "../video-generation/constants";

function streamContext(): ReturnType<typeof makeHeadlessContext> {
  return {
    ...makeHeadlessContext(undefined, undefined, "UTC"),
    // A favorite id the DB does not know (client-side favorite config).
    favoriteId: crypto.randomUUID(),
    skillId: "default",
    resolvedMediaSelections: {
      imageGenModelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ImageGenModelId.Z_IMAGE_TURBO,
      },
      musicGenModelSelection: DEFAULT_MUSIC_GEN_MODEL_SELECTION,
      videoGenModelSelection: DEFAULT_VIDEO_GEN_MODEL_SELECTION,
    },
  };
}

const user: JwtPrivatePayloadType = {
  isPublic: false,
  id: crypto.randomUUID(),
  leadId: crypto.randomUUID(),
  roles: [UserPermissionRole.CUSTOMER],
};

describe("media requestDefaults follow the stream's resolved selection", () => {
  it("image: the AI omits model -> the user's selected model generates", async () => {
    const { ImageGenerationRepository } =
      await import("../image-generation/repository");
    const defaults = await ImageGenerationRepository.getRequestDefaults(
      { user, toolExecutionContext: streamContext(), platform: Platform.AI },
      undefined,
    );
    expect(defaults.model).toBe(ImageGenModelId.Z_IMAGE_TURBO);
  });

  it("image: an explicit known model from the AI is still honoured", async () => {
    const { ImageGenerationRepository } =
      await import("../image-generation/repository");
    const defaults = await ImageGenerationRepository.getRequestDefaults(
      { user, toolExecutionContext: streamContext(), platform: Platform.AI },
      ImageGenModelId.CHROMA,
    );
    expect(defaults).toEqual({});
  });
});
