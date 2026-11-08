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
        // Unknown ids come from callers (a model-chosen skillId on a sub-agent
        // run, a favorite pointing at a deleted custom skill) and degrade
        // gracefully to the default persona - warn (could be a stale favorite).
        const logFn =
          result.errorType.errorCode >= 500 ? logger.error : logger.warn;
        logFn.bind(logger)("Skill not found, using default behavior", {
          skillId,
          error: result.message,
          errorCode: result.errorType.errorCode,
          isPublic: user.isPublic,
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
