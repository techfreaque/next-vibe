/**
 * Legacy → successor resolution.
 *
 * Pure catalogue tests (no DB, no provider calls): stored selections that name a
 * legacy model must transparently resolve to its successor, legacy models must
 * stay hidden from browse/auto-picks but remain resolvable by id.
 */

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import type {
  JwtPayloadType,
  JwtPrivatePayloadType,
} from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";
import { describe, expect, it } from "vitest";

import { DEFAULT_SKILLS } from "@/generated/skills";

import type { AgentEnvAvailability } from "../env-availability";
import { ModelUtility } from "../models/enum";
import { ApiProvider } from "../models/models";
import { ModelsListRepository } from "../models/list/repository";
import { getBestChatModelForFavorite } from "../skills/favorites/[id]/definition";
import { IntelligenceLevel, ModelSelectionType } from "../skills/enum";
import {
  chatModelDefinitions,
  ChatModelId,
  chatModelOptionsPool,
  chatModelSuccessors,
  filterChatModels,
  filterRoleModelsWithSuccessor,
  getBestChatModel,
  getChatModelById,
  getChatModelForUser,
  isLegacyChatModel,
  resolveChatModelForUser,
  resolveChatModelSuccessor,
} from "./models";
import { getBestVideoVisionModel } from "./vision-models";
import { VideoVisionModelId } from "./vision-models.generated";

const LEAD_ID = "00000000-0000-4000-8000-000000000001";

const publicUser: JwtPayloadType = {
  isPublic: true,
  leadId: LEAD_ID,
  roles: [UserPermissionRole.PUBLIC],
};

const adminUser: JwtPrivatePayloadType = {
  isPublic: false,
  id: "00000000-0000-4000-8000-000000000002",
  leadId: LEAD_ID,
  roles: [UserPermissionRole.ADMIN],
};

const noProviders: AgentEnvAvailability = {
  openRouter: false,
  claudeCode: false,
  voice: false,
  braveSearch: false,
  kagiSearch: false,
  anySearch: false,
  uncensoredAI: false,
  freedomGPT: false,
  gabAI: false,
  veniceAI: false,
  nanoGPT: false,
  scrappey: false,
  openAiImages: false,
  openAiStt: false,
  replicate: false,
  falAi: false,
  modelsLab: false,
  edenAiStt: false,
  deepgram: false,
  openAiTts: false,
  edenAiTts: false,
  elevenlabs: false,
  unbottledSystem: false,
  unbottledForce: false,
};

const openRouterOnly: AgentEnvAvailability = {
  ...noProviders,
  openRouter: true,
};

const allChatIds = Object.values(ChatModelId);

describe("chat model successor map", () => {
  it("maps only legacy models, and only to current models", () => {
    for (const legacyId of allChatIds) {
      const successor = chatModelSuccessors[legacyId];
      if (!successor) {
        continue;
      }
      expect(isLegacyChatModel(legacyId), `${legacyId} must be LEGACY`).toBe(
        true,
      );
      const finalId = resolveChatModelSuccessor(legacyId);
      expect(finalId).not.toBe(legacyId);
      expect(
        isLegacyChatModel(finalId),
        `${legacyId} → ${finalId} must be current`,
      ).toBe(false);
      expect(chatModelDefinitions[finalId]).toBeDefined();
    }
  });

  it("every legacy model has a successor", () => {
    for (const id of allChatIds) {
      if (isLegacyChatModel(id)) {
        expect(chatModelSuccessors[id], `${id} is LEGACY without successor`).toBeDefined();
      }
    }
  });

  it("leaves current models and successor-less legacy models unchanged", () => {
    expect(resolveChatModelSuccessor(ChatModelId.CLAUDE_OPUS_5_5)).toBe(
      ChatModelId.CLAUDE_OPUS_5_5,
    );
    expect(resolveChatModelSuccessor(ChatModelId.DEEPSEEK_V4_PRO)).toBe(
      ChatModelId.DEEPSEEK_V4_PRO,
    );
    expect(isLegacyChatModel(ChatModelId.DEEPSEEK_V4_PRO)).toBe(false);
  });

  it("resolves superseded flagships to the new generation", () => {
    expect(resolveChatModelSuccessor(ChatModelId.CLAUDE_OPUS_4_7)).toBe(
      ChatModelId.CLAUDE_OPUS_5_5,
    );
    expect(resolveChatModelSuccessor(ChatModelId.CLAUDE_HAIKU_4_5)).toBe(
      ChatModelId.CLAUDE_HAIKU_5_5,
    );
    expect(resolveChatModelSuccessor(ChatModelId.GPT_5_6_TERRA)).toBe(
      ChatModelId.GPT_6_1_TERRA,
    );
    expect(
      resolveChatModelSuccessor(
        ChatModelId.GEMINI_3_1_PRO_PREVIEW_CUSTOM_TOOLS,
      ),
    ).toBe(ChatModelId.GEMINI_4_ARGON);
    expect(resolveChatModelSuccessor(ChatModelId.GROK_4_6)).toBe(
      ChatModelId.GROK_4_7,
    );
  });
});

describe("MANUAL selections with a legacy model id", () => {
  it("favorite with a legacy manualModelId resolves to the successor", () => {
    const best = getBestChatModelForFavorite(
      {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ChatModelId.CLAUDE_SONNET_5,
      },
      undefined,
      publicUser,
      openRouterOnly,
    );
    expect(best?.id).toBe(ChatModelId.CLAUDE_SONNET_5_5);
  });

  it("skill-variant selection with a legacy manualModelId resolves to the successor", () => {
    const best = getBestChatModelForFavorite(
      null,
      {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ChatModelId.KIMI_K2_6,
      },
      publicUser,
      openRouterOnly,
    );
    expect(best?.id).toBe(ChatModelId.KIMI_K3);
  });

  it("Claude Code serves the successor, not the pinned legacy model", () => {
    // Claude Code pins moved to the 5.5 generation: with only the CLI
    // available, a stored Sonnet 4.6 pick resolves to Sonnet 5.5 via Claude Code.
    const claudeCodeOnly: AgentEnvAvailability = {
      ...noProviders,
      claudeCode: true,
    };
    const best = getBestChatModel(
      {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ChatModelId.CLAUDE_SONNET_4_6,
      },
      adminUser,
      claudeCodeOnly,
    );
    expect(best?.id).toBe(ChatModelId.CLAUDE_SONNET_5_5);
    expect(best?.apiProvider).toBe(ApiProvider.CLAUDE_CODE);
    expect(best?.providerModel).toBe("claude-sonnet-5-5");
    expect(
      resolveChatModelForUser(
        ChatModelId.CLAUDE_SONNET_4_6,
        adminUser,
        claudeCodeOnly,
      ),
    ).toBe(ChatModelId.CLAUDE_SONNET_5_5);
  });

  it("keeps the legacy model when its successor cannot be served", () => {
    // Every real successor is served by a superset of its legacy model's
    // providers, so model the gap with a pool that lacks the successor.
    const pool = chatModelOptionsPool.filter(
      (m) => m.id === ChatModelId.CLAUDE_SONNET_4_6,
    );
    const picked = filterRoleModelsWithSuccessor(
      pool,
      {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ChatModelId.CLAUDE_SONNET_4_6,
      },
      adminUser,
      openRouterOnly,
    );
    expect(picked[0]?.id).toBe(ChatModelId.CLAUDE_SONNET_4_6);
  });

  it("explicit legacy model ids (settings, API callers) resolve to the successor", () => {
    expect(
      resolveChatModelForUser(
        ChatModelId.GPT_5_6_SOL,
        publicUser,
        openRouterOnly,
      ),
    ).toBe(ChatModelId.GPT_6_1_SOL);
    // Legacy Qwen 3.7 Flash now resolves to its successor 3.8 Flash.
    expect(
      resolveChatModelForUser(
        ChatModelId.QWEN_3_7_FLASH,
        publicUser,
        openRouterOnly,
      ),
    ).toBe(ChatModelId.QWEN_3_8_FLASH);
    // Current ids pass straight through.
    expect(
      resolveChatModelForUser(
        ChatModelId.QWEN_3_8_FLASH,
        publicUser,
        openRouterOnly,
      ),
    ).toBe(ChatModelId.QWEN_3_8_FLASH);
  });

  it("vision bridge MANUAL picks resolve to the successor too", () => {
    const best = getBestVideoVisionModel(
      {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: VideoVisionModelId.GEMINI_3_7_FLASH,
      },
      publicUser,
      openRouterOnly,
    );
    expect(best?.id).toBe(VideoVisionModelId.GEMINI_3_8_FLASH);
  });
});

describe("automatic picks never land on legacy models", () => {
  it("FILTERS selections exclude legacy models while current ones qualify", () => {
    const models = filterChatModels(
      {
        selectionType: ModelSelectionType.FILTERS,
        intelligenceRange: {
          min: IntelligenceLevel.BRILLIANT,
          max: IntelligenceLevel.BRILLIANT,
        },
      },
      publicUser,
      openRouterOnly,
    );
    expect(models.length).toBeGreaterThan(0);
    expect(
      models.filter((m) => m.utilities.includes(ModelUtility.LEGACY)),
    ).toEqual([]);
  });

  it("default skills and variants pin no superseded model", () => {
    for (const skill of DEFAULT_SKILLS) {
      for (const variant of skill.variants) {
        const sel = variant.modelSelection;
        if (sel?.selectionType !== ModelSelectionType.MANUAL) {
          continue;
        }
        expect(
          chatModelSuccessors[sel.manualModelId],
          `${skill.id}/${variant.id} pins superseded ${sel.manualModelId}`,
        ).toBeUndefined();
      }
    }
  });
});

describe("model browser", () => {
  it("lists new models and hides legacy ones", async () => {
    const result = await ModelsListRepository.getModels(
      { modelType: "text" },
      publicUser,
      createEndpointLogger(false, defaultLocale),
      defaultLocale,
    );
    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }
    const names = new Set(result.data.models.map((m) => m.name));
    for (const id of [
      ChatModelId.CLAUDE_OPUS_5_5,
      ChatModelId.GPT_6_1_SOL,
      ChatModelId.GEMINI_4_ARGON,
      ChatModelId.GROK_4_7,
      ChatModelId.VENICE_DEEPSEEK_V4_1_FLASH_UNCENSORED,
      ChatModelId.GLM_5_3_UNCENSORED,
    ]) {
      expect(names.has(chatModelDefinitions[id].name), id).toBe(true);
    }
    for (const id of [
      ChatModelId.CLAUDE_OPUS_5,
      ChatModelId.GPT_5_6_SOL,
      ChatModelId.GROK_4_6,
    ]) {
      expect(names.has(chatModelDefinitions[id].name), id).toBe(false);
    }
  });
});

describe("per-user provider resolution", () => {
  const customerUser: JwtPrivatePayloadType = {
    isPublic: false,
    id: "00000000-0000-4000-8000-000000000003",
    leadId: LEAD_ID,
    roles: [UserPermissionRole.CUSTOMER],
  };
  const openRouterAndClaudeCode: AgentEnvAvailability = {
    ...openRouterOnly,
    claudeCode: true,
  };

  it("never makes an admin-only provider the primary option when a public one exists", () => {
    // Regression: Claude Code is priced like OpenRouter for the Claude 5.x
    // models, so a price-only sort made it the primary option and every
    // non-admin Sonnet request was rejected as FORBIDDEN.
    for (const id of allChatIds) {
      const hasPublicProvider = chatModelDefinitions[id].providers.some(
        (provider) => provider.adminOnly !== true,
      );
      if (hasPublicProvider) {
        expect(getChatModelById(id).adminOnly, id).not.toBe(true);
      }
    }
  });

  it("serves Sonnet 5.5 to non-admins through OpenRouter", () => {
    for (const user of [customerUser, publicUser]) {
      const option = getChatModelForUser(
        ChatModelId.CLAUDE_SONNET_5_5,
        user,
        openRouterAndClaudeCode,
      );
      expect(option.apiProvider).toBe(ApiProvider.OPENROUTER);
      expect(option.adminOnly).not.toBe(true);
    }
  });

  it("gives admins Claude Code only when it is enabled on the instance", () => {
    expect(
      getChatModelForUser(
        ChatModelId.CLAUDE_SONNET_5_5,
        adminUser,
        openRouterAndClaudeCode,
      ).apiProvider,
    ).toBe(ApiProvider.CLAUDE_CODE);
    expect(
      getChatModelForUser(
        ChatModelId.CLAUDE_SONNET_5_5,
        adminUser,
        openRouterOnly,
      ).apiProvider,
    ).toBe(ApiProvider.OPENROUTER);
  });
});
