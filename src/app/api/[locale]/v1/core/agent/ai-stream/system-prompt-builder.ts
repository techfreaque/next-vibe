/**
 * System Prompt Builder
 * Constructs complete system prompts from persona and formatting instructions
 */

import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";

import { getPersonaById } from "@/app/api/[locale]/v1/core/agent/chat/personas/repository";
import { formattingInstructions } from "./system-prompt";

/**
 * Build complete system prompt from persona ID
 *
 * Priority order:
 * 1. Persona systemPrompt (if persona ID provided)
 * 2. Empty string (default behavior - formatting instructions only)
 *
 * Formatting instructions are ALWAYS appended to the final system prompt
 *
 * @param personaId - Optional persona ID (can be default persona ID or custom persona UUID)
 * @param userId - Optional user ID (required for custom personas)
 * @param logger - Logger instance
 * @returns Complete system prompt with formatting instructions
 */
export async function buildSystemPrompt(params: {
  personaId: string | null | undefined;
  userId: string | undefined;
  logger: EndpointLogger;
}): Promise<string> {
  const { personaId, userId, logger } = params;

  logger.debug("Building system prompt", {
    hasPersonaId: !!personaId,
    hasUserId: !!userId,
  });

  // Priority 1: Persona system prompt
  if (personaId) {
    try {
      const persona = await getPersonaById(personaId, userId);

      if (!persona) {
        logger.warn("Persona not found, using default", { personaId });
        // Fall through to default (empty string)
      } else {
        logger.debug("Using persona system prompt", {
          personaId: persona.id,
          personaName: persona.name,
          hasSystemPrompt: !!persona.systemPrompt,
        });

        if (persona.systemPrompt && persona.systemPrompt.trim()) {
          return buildFinalSystemPrompt(persona.systemPrompt, logger);
        }

        // Persona exists but has empty system prompt (e.g., "default" persona)
        logger.debug("Persona has empty system prompt, using default behavior");
      }
    } catch (error) {
      logger.error("Failed to load persona, using default", {
        personaId,
        error: error instanceof Error ? error.message : String(error),
      });
      // Fall through to default (empty string)
    }
  }

  // Priority 2: Default (empty string with only formatting instructions)
  logger.debug("Using default system prompt (formatting instructions only)");
  return buildFinalSystemPrompt("", logger);
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

