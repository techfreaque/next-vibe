"use client";

import { useMemo } from "react";

import type { SystemPromptClientParams } from "@/app/api/[locale]/agent/ai-stream/repository/system-prompt/types";
import { useChatBootContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import { useSkill } from "@/app/api/[locale]/agent/skills/[id]/hooks";

import type { SkillData } from "./prompt";

export function useSkillData(params: SystemPromptClientParams): SkillData {
  const { skillId, user, logger } = params;
  const { initialSkillData } = useChatBootContext();
  const skillInitialData =
    skillId && initialSkillData ? initialSkillData : null;
  const skillEndpoint = useSkill(skillId ?? "", user, logger, skillInitialData);

  const skillPrompt = useMemo(() => {
    if (!skillId) {
      return "";
    }
    const response = skillEndpoint.read?.response;
    if (!response?.success) {
      return "";
    }
    return response.data.systemPrompt?.trim() ?? "";
  }, [skillId, skillEndpoint.read?.response]);

  return { skillPrompt };
}
