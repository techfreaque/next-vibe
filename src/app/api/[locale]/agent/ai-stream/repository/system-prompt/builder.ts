/**
 * System Prompt Builder
 *
 * Server-only data-loading layer. Loads all fragment data via the generated
 * combined loader, then assembles the final system prompt strings.
 *
 * All fragment logic lives in each module's system-prompt/prompt.ts + server.ts.
 * Import paths are centralized in generated/prompt-fragments-server.ts - no hardcoding here.
 *
 * Flow:
 *   Step 1 - Load all fragment data in parallel via generated combined loader
 *   Step 2 - Assemble system prompt from leading fragments (sorted by priority)
 *   Step 3 - Build trailing system message and return
 */

import "server-only";

import type { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { loadAllPromptFragments } from "@/app/api/[locale]/system/generated/prompt-fragments-server";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { buildTrailingSystemMessage, generateSystemPrompt } from "./assembler";
import type {
  MediaCapabilitiesParams,
  SystemPromptServerParams,
} from "./types";

export interface SystemPromptResult {
  systemPrompt: string;
  trailingSystemMessage: string;
}

export async function buildSystemPrompt(params: {
  skillId: string | null | undefined;
  user: JwtPayloadType;
  logger: EndpointLogger;
  locale: CountryLanguage;
  rootFolderId: DefaultFolderId;
  subFolderId: string | null;
  callMode: boolean | null | undefined;
  extraInstructions?: string;
  headless?: boolean;
  subAgentDepth: number;
  excludeMemories?: boolean;
  memoryLimit?: number | null;
  mediaCapabilities?: MediaCapabilitiesParams;
  threadId: string | null;
  voiceTranscription?: {
    wasTranscribed: boolean;
    confidence: number | null;
  } | null;
}): Promise<SystemPromptResult> {
  const {
    skillId,
    user,
    logger,
    locale,
    rootFolderId,
    subFolderId,
    callMode,
    extraInstructions,
    headless,
    subAgentDepth,
    excludeMemories,
    memoryLimit,
    mediaCapabilities,
    voiceTranscription,
  } = params;

  const isIncognito = rootFolderId === "incognito";
  const isExposedFolder =
    rootFolderId === "public" || rootFolderId === "shared";

  logger.debug("Building system prompt", {
    hasSkillId: !!skillId,
    hasUserId: !user.isPublic,
    rootFolderId,
    subFolderId,
    callMode,
  });

  const serverParams: SystemPromptServerParams = {
    user,
    logger,
    locale,
    rootFolderId,
    subFolderId,
    skillId,
    isIncognito,
    isExposedFolder,
    excludeMemories,
    headless: headless ?? false,
    subAgentDepth,
    callMode: callMode ?? false,
    extraInstructions: extraInstructions ?? "",
    memoryLimit: memoryLimit ?? null,
    mediaCapabilities,
  };

  const { leading, trailing } = await loadAllPromptFragments(serverParams);

  const systemPrompt = generateSystemPrompt({ leadingFragments: leading });

  const trailingSystemMessage = buildTrailingSystemMessage({
    trailingFragments: trailing.map((x) => x.str),
    voiceTranscription,
  });

  return { systemPrompt, trailingSystemMessage };
}
