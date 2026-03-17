import "server-only";

import type { SystemPromptServerParams } from "@/app/api/[locale]/agent/ai-stream/repository/system-prompt/types";

import type { SkillData } from "./prompt";

export async function loadSkillData(
  params: SystemPromptServerParams,
): Promise<SkillData> {
  const { skillId, user, logger, locale } = params;

  if (!skillId) {
    return { skillPrompt: "" };
  }

  try {
    const { SkillsRepository } =
      await import("@/app/api/[locale]/agent/chat/skills/repository");
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
