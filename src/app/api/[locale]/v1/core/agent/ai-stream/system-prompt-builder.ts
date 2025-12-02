/**
 * System Prompt Builder
 * Constructs complete system prompts from persona and formatting instructions
 */

import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { TFunction } from "@/i18n/core/static-types";
import type { DefaultFolderId } from "@/app/api/[locale]/v1/core/agent/chat/config";
import type { CountryLanguage } from "@/i18n/core/config";

import { getPersonaById } from "@/app/api/[locale]/v1/core/agent/chat/personas/repository";
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
 * 3. Persona systemPrompt (if persona ID provided)
 * 4. Formatting instructions
 *
 * @param personaId - Optional persona ID (can be default persona ID or custom persona UUID)
 * @param userId - Optional user ID (required for custom personas)
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

  // Build final prompt with formatting instructions
  return buildFinalSystemPrompt(platformPrompt, logger);
}

/**
 * Build final system prompt by combining base prompt with formatting instructions
 *
 * @param basePrompt - Base system prompt (from persona or custom)
 * @param logger - Logger instance
 * @returns Complete system prompt with formatting instructions appended
 */
function buildFinalSystemPrompt(
  basePrompt: string,
  logger: EndpointLogger,
): string {
  const trimmedBase = basePrompt.trim();
  const formattingSection = buildFormattingSection();

  // If base prompt is empty, return only formatting instructions
  if (!trimmedBase) {
    logger.debug("Building system prompt with formatting instructions only");
    return formattingSection;
  }

  // Combine base prompt with formatting instructions
  const finalPrompt = `${trimmedBase}

${formattingSection}`;

  logger.debug("Built complete system prompt", {
    basePromptLength: trimmedBase.length,
    finalPromptLength: finalPrompt.length,
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
