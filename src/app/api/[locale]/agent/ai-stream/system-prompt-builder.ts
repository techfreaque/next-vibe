/**
 * System Prompt Builder
 * Server-side wrapper that loads persona and memories, then delegates to
 * the centralized system-prompt-generator for actual prompt construction
 */

import "server-only";

import type { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { generateMemorySummary } from "@/app/api/[locale]/agent/chat/memories/repository";
import { getPersonaById } from "@/app/api/[locale]/agent/chat/personas/repository";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import {
  generateSystemPrompt,
  getCurrentDateString,
  getModelCount,
} from "./system-prompt-generator";

/**
 * Build complete system prompt from persona ID
 *
 * This is a server-side function that:
 * 1. Loads persona from database
 * 2. Loads user memories from database
 * 3. Delegates to generateSystemPrompt for actual prompt construction
 *
 * @param personaId - Optional persona ID (can be default persona ID or custom persona UUID)
 * @param userId - Optional user ID (required for custom personas and memories)
 * @param logger - Logger instance
 * @param t - Translation function for appName
 * @param locale - User's locale (language-country)
 * @param rootFolderId - Current root folder context
 * @param subFolderId - Current sub folder context
 * @param callMode - Whether call mode is enabled (short responses for voice)
 * @returns Complete system prompt
 */
export async function buildSystemPrompt(params: {
  personaId: string | null | undefined;
  userId: string | undefined;
  logger: EndpointLogger;
  t: TFunction;
  locale: CountryLanguage;
  rootFolderId: DefaultFolderId;
  subFolderId: string | null;
  callMode: boolean | null | undefined;
}): Promise<string> {
  const {
    personaId,
    userId,
    logger,
    t,
    locale,
    rootFolderId,
    subFolderId,
    callMode,
  } = params;

  logger.debug("Building system prompt", {
    hasPersonaId: !!personaId,
    hasUserId: !!userId,
    rootFolderId,
    subFolderId,
    callMode,
  });

  let personaPrompt = "";
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

  // Get persona system prompt if provided
  if (personaId) {
    try {
      const persona = await getPersonaById(personaId, userId);

      if (persona) {
        logger.debug("Using persona system prompt", {
          personaId: persona.id,
          personaName: persona.name,
          hasSystemPrompt: !!persona.systemPrompt,
        });

        if (persona.systemPrompt && persona.systemPrompt.trim()) {
          personaPrompt = persona.systemPrompt.trim();
        } else {
          logger.debug(
            "Persona has empty system prompt, using default behavior",
          );
        }
      } else {
        logger.warn("Persona not found, using default", { personaId });
      }
    } catch (error) {
      logger.error("Failed to load persona, using default", {
        personaId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // Delegate to centralized prompt generator
  const appName = t("config.appName");
  const systemPrompt = generateSystemPrompt({
    appName,
    date: getCurrentDateString(),
    modelCount: getModelCount(),
    locale,
    rootFolderId,
    subFolderId,
    personaPrompt,
    memorySummary,
    callMode: callMode ?? false,
  });

  logger.debug("Built complete system prompt", {
    systemPromptLength: systemPrompt.length,
    hasPersonaPrompt: !!personaPrompt,
    hasMemories: !!memorySummary,
    callMode: callMode ?? false,
  });

  return systemPrompt;
}
