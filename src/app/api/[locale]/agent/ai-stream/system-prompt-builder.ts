/**
 * System Prompt Builder
 * Constructs complete system prompts from persona and formatting instructions
 */

import "server-only";

import type { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { generateMemorySummary } from "@/app/api/[locale]/agent/chat/memories/repository";
import { getPersonaById } from "@/app/api/[locale]/agent/chat/personas/repository";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import { formattingInstructions } from "./system-prompt";
import {
  generateSystemPrompt,
  getCurrentDateString,
  getModelCount,
} from "./system-prompt-generator";

/**
 * Build complete system prompt from persona ID
 *
 * Priority order:
 * 1. Platform introduction (unbottled.ai, model count, freedom of speech)
 * 2. User locale and language requirements
 * 3. User memories (persistent facts about the user)
 * 4. Persona systemPrompt (if persona ID provided)
 * 5. Formatting instructions
 *
 * @param personaId - Optional persona ID (can be default persona ID or custom persona UUID)
 * @param userId - Optional user ID (required for custom personas and memories)
 * @param logger - Logger instance
 * @param t - Translation function for appName
 * @param locale - User's locale (language-country)
 * @param rootFolderId - Current root folder context
 * @param subFolderId - Current sub folder context
 * @returns Complete system prompt with formatting instructions
 */
export async function buildSystemPrompt(params: {
  personaId: string | null | undefined;
  userId: string | undefined;
  logger: EndpointLogger;
  t: TFunction;
  locale: CountryLanguage;
  rootFolderId?: DefaultFolderId;
  subFolderId?: string | null;
}): Promise<string> {
  const { personaId, userId, logger, t, locale, rootFolderId, subFolderId } =
    params;

  logger.debug("Building system prompt", {
    hasPersonaId: !!personaId,
    hasUserId: !!userId,
    rootFolderId,
    subFolderId,
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

      if (!persona) {
        logger.warn("Persona not found, using default", { personaId });
      } else {
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
      }
    } catch (error) {
      logger.error("Failed to load persona, using default", {
        personaId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // Generate platform introduction with context
  const appName = t("config.appName");
  const platformPrompt = generateSystemPrompt({
    appName,
    date: getCurrentDateString(),
    modelCount: getModelCount(),
    locale,
    rootFolderId,
    subFolderId,
    personaPrompt,
  });

  // Build final prompt with memories and formatting instructions
  return buildFinalSystemPrompt(platformPrompt, memorySummary, logger);
}

/**
 * Build final system prompt by combining base prompt, memories, and formatting instructions
 *
 * @param basePrompt - Base system prompt (from persona or custom)
 * @param memorySummary - User/lead memories summary
 * @param logger - Logger instance
 * @returns Complete system prompt with memories and formatting instructions appended
 */
function buildFinalSystemPrompt(
  basePrompt: string,
  memorySummary: string,
  logger: EndpointLogger,
): string {
  const trimmedBase = basePrompt.trim();
  const trimmedMemories = memorySummary.trim();
  const formattingSection = buildFormattingSection();

  // Build sections
  const sections: string[] = [];

  // Add base prompt
  if (trimmedBase) {
    sections.push(trimmedBase);
  }

  // Add memory summary if available
  if (trimmedMemories) {
    sections.push(trimmedMemories);
  }

  // Add formatting instructions
  sections.push(formattingSection);

  // If no base prompt and no memories, return only formatting instructions
  if (sections.length === 1) {
    logger.debug("Building system prompt with formatting instructions only");
    return formattingSection;
  }

  // Combine all sections
  const finalPrompt = sections.join("\n\n");

  logger.debug("Built complete system prompt", {
    basePromptLength: trimmedBase.length,
    memorySummaryLength: trimmedMemories.length,
    finalPromptLength: finalPrompt.length,
    hasMemories: !!trimmedMemories,
    hasFormattingInstructions: true,
  });

  return finalPrompt;
}

/**
 * Build formatting instructions section
 *
 * @returns Formatted string with all formatting instructions
 */
function buildFormattingSection(): string {
  return `# Formatting Instructions

${formattingInstructions.map((instruction) => `- ${instruction}`).join("\n")}`;
}
