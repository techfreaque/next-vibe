/**
 * selectFavorite model resolution.
 *
 * The stream runs `settings.selectedModel`; the active favorite is context.
 * A selection without a model kept the previous selectedModel, so the active
 * mode and the model that answered diverged (prod 2026-11-14: "Uncensored"
 * active, Gemini 4 Argon answered). The variant's own model fills the gap.
 */

import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { describe, expect, it } from "vitest";

import { ChatModelId } from "../../ai-stream/models";
import type { AgentEnvAvailability } from "../../env-availability";
import { ChatSettingsRepositoryClient } from "./repository-client";

const user: JwtPrivatePayloadType = {
  isPublic: false,
  id: "00000000-0000-4000-8000-000000000003",
  leadId: "00000000-0000-4000-8000-000000000001",
  roles: [UserPermissionRole.CUSTOMER],
};

const allProviders: AgentEnvAvailability = {
  openRouter: true,
  claudeCode: false,
  voice: true,
  braveSearch: true,
  kagiSearch: false,
  anySearch: true,
  uncensoredAI: true,
  freedomGPT: true,
  gabAI: true,
  veniceAI: true,
  nanoGPT: true,
  scrappey: false,
  openAiImages: true,
  openAiStt: true,
  replicate: true,
  falAi: true,
  modelsLab: true,
  edenAiStt: true,
  deepgram: true,
  openAiTts: true,
  edenAiTts: true,
  elevenlabs: true,
  unbottledSystem: false,
  unbottledForce: false,
};

describe("ChatSettingsRepositoryClient.resolveVariantModelId", () => {
  it("resolves the Uncensored and All-Seeing variants to their own models", () => {
    expect(
      ChatSettingsRepositoryClient.resolveVariantModelId({
        favoriteId: "thea-uncensored",
        skillId: "thea__uncensored",
        user,
        availability: allProviders,
      }),
    ).toBe(ChatModelId.UNCENSORED_LM_V1_2);
    expect(
      ChatSettingsRepositoryClient.resolveVariantModelId({
        favoriteId: "thea-vision",
        skillId: "thea__vision",
        user,
        availability: allProviders,
      }),
    ).toBe(ChatModelId.GEMINI_4_ARGON);
  });

  it("reads the variant from a composite favorite id when skillId has none", () => {
    expect(
      ChatSettingsRepositoryClient.resolveVariantModelId({
        favoriteId: "hermes__uncensored",
        skillId: "hermes",
        user,
        availability: allProviders,
      }),
    ).toBe(ChatModelId.UNCENSORED_LM_V1_2);
  });

  it("never guesses a variant from a plain skill id or a custom skill", () => {
    expect(
      ChatSettingsRepositoryClient.resolveVariantModelId({
        favoriteId: "thea-uncensored",
        skillId: "thea",
        user,
        availability: allProviders,
      }),
    ).toBeNull();
    expect(
      ChatSettingsRepositoryClient.resolveVariantModelId({
        favoriteId: "my-skill__fast",
        skillId: null,
        user,
        availability: allProviders,
      }),
    ).toBeNull();
  });
});
