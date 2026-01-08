/**
 * System Prompt Builder
 * Server-side wrapper that loads character and memories, then delegates to
 * the centralized system-prompt-generator for actual prompt construction
 */

import "server-only";

import { CharactersRepository } from "@/app/api/[locale]/agent/chat/characters/repository";
import type { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { generateMemorySummary } from "@/app/api/[locale]/agent/chat/memories/repository";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import { generateSystemPrompt, getCurrentDateString } from "./generator";

/**
 * Build complete system prompt from character ID
 *
 * This is a server-side function that:
 * 1. Loads character from database using CharactersRepository
 * 2. Loads user memories from database
 * 3. Delegates to generateSystemPrompt for actual prompt construction
 *
 * @param characterId - Optional character ID (can be default character ID or custom character UUID)
 * @param user - User JWT payload (required for custom characters)
 * @param logger - Logger instance
 * @param t - Translation function for appName
 * @param locale - User's locale (language-country)
 * @param rootFolderId - Current root folder context
 * @param subFolderId - Current sub folder context
 * @param callMode - Whether call mode is enabled (short responses for voice)
 * @returns Complete system prompt
 */
export async function buildSystemPrompt(params: {
  characterId: string | null | undefined;
  user: JwtPayloadType;
  logger: EndpointLogger;
  t: TFunction;
  locale: CountryLanguage;
  rootFolderId: DefaultFolderId;
  subFolderId: string | null;
  callMode: boolean | null | undefined;
}): Promise<string> {
  const { characterId, user, logger, t, locale, rootFolderId, subFolderId, callMode } = params;
  const userId = user.id;

  logger.debug("Building system prompt", {
    hasCharacterId: !!characterId,
    hasUserId: !!userId,
    rootFolderId,
    subFolderId,
    callMode,
  });

  let characterPrompt = "";
  let memorySummary = "";

  // Load user memories for persistent context (only for authenticated users)
  if (userId) {
    try {
      memorySummary = await generateMemorySummary({
        userId,
        logger,
      });

      if (memorySummary) {
        logger.info("Loaded user memories into system prompt", {
          userId,
          memorySummaryLength: memorySummary.length,
        });
      }
    } catch (error) {
      logger.error("Failed to load memories", {
        userId,
        error: error instanceof Error ? error.message : String(error),
      });
      // Continue without memories on error
    }
  }

  // Get character system prompt if provided
  if (characterId) {
    try {
      const result = await CharactersRepository.getCharacterById({ id: characterId }, user, logger);

      if (result.success) {
        const character = result.data;
        logger.debug("Using character system prompt", {
          characterId: character.id,
          characterName: character.name,
          hasSystemPrompt: !!character.systemPrompt,
        });

        if (character.systemPrompt && character.systemPrompt.trim()) {
          characterPrompt = character.systemPrompt.trim();
        } else {
          logger.debug("Character has empty system prompt, using default behavior");
        }
      } else {
        logger.warn("Character not found, using default", {
          characterId,
          error: result.message,
        });
      }
    } catch (error) {
      logger.error("Failed to load character, using default", {
        characterId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // Delegate to centralized prompt generator
  const appName = t("config.appName");
  const systemPrompt = generateSystemPrompt({
    appName,
    date: getCurrentDateString(),
    locale,
    rootFolderId,
    subFolderId,
    characterPrompt,
    memorySummary,
    callMode: callMode ?? false,
  });

  logger.debug("Built complete system prompt", {
    systemPromptLength: systemPrompt.length,
    hasCharacterPrompt: !!characterPrompt,
    hasMemories: !!memorySummary,
    callMode: callMode ?? false,
  });

  return systemPrompt;
}
