import "server-only";

import type { SystemPromptFragment } from "../ai-stream/system-prompt/types";

// ─── Fragment ──────────────────────────────────────────────────────────────────

export const skillFragment: SystemPromptFragment = {
  id: "skill",
  placement: "leading",
  priority: 600,
  build: async (params) => {
    const { skillId, user, logger, locale } = params;

    if (!skillId) {
      return null;
    }

    try {
      const { SkillsRepository } = await import("./repository");
      const result = await SkillsRepository.getSkillById(
        { id: skillId },
        user,
        logger,
        locale,
      );

      if (!result.success) {
        logger.warn("Skill not found, using default behavior", {
          skillId,
          error: result.message,
        });
        return null;
      }

      const prompt = result.data.systemPrompt?.trim();
      if (!prompt) {
        return null;
      }
      return `## Your Role\n\n${prompt}`;
    } catch (error) {
      logger.error("Failed to load skill for system prompt", {
        skillId,
        error: error instanceof Error ? error.message : String(error),
      });
      return null;
    }
  },
};
