import "server-only";

import type {
  SystemPromptFragment,
  SystemPromptServerParams,
} from "@/app/api/[locale]/agent/ai-stream/system-prompt/types";

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface SkillData {
  skillPrompt: string;
}

// ─── Fragment ──────────────────────────────────────────────────────────────────

export const skillFragment: SystemPromptFragment<SkillData> = {
  id: "skill",
  placement: "leading",
  priority: 600,
  build: (data) => {
    if (!data.skillPrompt?.trim()) {
      return null;
    }
    return `## Your Role\n\n${data.skillPrompt.trim()}`;
  },
};

// ─── Server Loader ─────────────────────────────────────────────────────────────

export async function loadSkillData(
  params: SystemPromptServerParams,
): Promise<SkillData> {
  const { skillId, user, logger, locale } = params;

  if (!skillId) {
    return { skillPrompt: "" };
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
      return { skillPrompt: "" };
    }

    const prompt = result.data.systemPrompt;
    return { skillPrompt: prompt?.trim() ?? "" };
  } catch (error) {
    logger.error("Failed to load skill for system prompt", {
      skillId,
      error: error instanceof Error ? error.message : String(error),
    });
    return { skillPrompt: "" };
  }
}
