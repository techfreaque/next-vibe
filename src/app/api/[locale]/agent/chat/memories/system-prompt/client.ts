"use client";

import { useMemo } from "react";

import { useMemories } from "@/app/api/[locale]/agent/chat/memories/hooks/hooks";
import type { SystemPromptClientParams } from "@/app/api/[locale]/agent/ai-stream/repository/system-prompt/types";

import type { MemoriesData } from "./prompt";

export function useMemoriesData(
  params: SystemPromptClientParams,
): MemoriesData {
  const { enabled, user, logger } = params;

  const shouldFetch = enabled && !user.isPublic;
  const memoriesEndpoint = useMemories({ enabled: shouldFetch }, user, logger);

  const memories = useMemo(() => {
    if (!shouldFetch || !memoriesEndpoint.read?.response?.success) {
      return [];
    }
    return memoriesEndpoint.read.response.data?.memories ?? [];
  }, [shouldFetch, memoriesEndpoint.read?.response]);

  return { memories, memoryLimit: null };
}
