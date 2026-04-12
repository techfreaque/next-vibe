import type { SystemPromptFragment } from "@/app/api/[locale]/agent/ai-stream/repository/system-prompt/types";

export interface SkillData {
  skillPrompt: string;
}

export const skillFragment: SystemPromptFragment<SkillData> = {
  id: "skill",
  placement: "leading",
  priority: 600,
  condition: (data) => !!data.skillPrompt?.trim(),
  build: (data) =>
    data.skillPrompt?.trim()
      ? `## Your Role\n\n${data.skillPrompt.trim()}`
      : null,
};
