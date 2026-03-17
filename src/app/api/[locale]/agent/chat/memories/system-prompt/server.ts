import "server-only";

import type { Memory } from "@/app/api/[locale]/agent/chat/memories/db";
import type { SystemPromptServerParams } from "@/app/api/[locale]/agent/ai-stream/repository/system-prompt/types";

import type { MemoriesData } from "./prompt";

export async function loadMemoriesData(
  params: SystemPromptServerParams,
): Promise<MemoriesData> {
  const {
    user,
    logger,
    rootFolderId,
    excludeMemories,
    isIncognito,
    memoryLimit,
  } = params;
  const userId = user.isPublic ? undefined : user.id;

  if (excludeMemories || isIncognito || !userId) {
    return { memories: [], memoryLimit: memoryLimit ?? null };
  }

  try {
    const { MemoriesRepository } =
      await import("@/app/api/[locale]/agent/chat/memories/repository");

    const [memoriesList, sizeCheck] = await Promise.all([
      MemoriesRepository.getMemoriesList({
        userId,
        logger,
        rootFolderId,
      }),
      MemoriesRepository.checkSelfManageNeeded({
        userId,
        logger,
        rootFolderId,
      }),
    ]);

    if (memoriesList.length > 0) {
      await MemoriesRepository.updateMemoryAccess({ userId, logger });
    }

    logger.debug("Loaded memories for system prompt", {
      userId,
      memoryCount: memoriesList.length,
      totalTokens: sizeCheck.totalTokens,
      nearLimit: sizeCheck.nearLimit,
    });

    // Map memoryNumber → id to match MemoriesList type
    return {
      memories: memoriesList.map((m: Memory) => ({ ...m, id: m.memoryNumber })),
      memoryLimit: memoryLimit ?? null,
      nearLimit: sizeCheck.nearLimit,
      totalTokens: sizeCheck.totalTokens,
    };
  } catch (error) {
    logger.error("Failed to load memories for system prompt", {
      userId,
      error: error instanceof Error ? error.message : String(error),
    });
    return { memories: [], memoryLimit: memoryLimit ?? null };
  }
}
