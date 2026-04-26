"use client";

import { useMemo } from "react";

import type { SystemPromptClientParams } from "@/app/api/[locale]/agent/ai-stream/repository/system-prompt/types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";

import listDefinition from "../list/definition";
import treeDefinition from "../tree/definition";

import type { CortexData, CortexMemory } from "./prompt";

/**
 * Client-side Cortex data hook for system prompt.
 * Fetches workspace tree + memory listing from server for the prompt fragment debug panel.
 */
export function useCortexData(params: SystemPromptClientParams): CortexData {
  const { enabled, user, logger } = params;
  const shouldFetch = enabled && !user.isPublic;

  const treeOptions = useMemo(
    () => ({
      read: {
        queryOptions: {
          enabled: shouldFetch,
          refetchOnWindowFocus: false,
          staleTime: 60_000,
        },
      },
    }),
    [shouldFetch],
  );

  const memoriesOptions = useMemo(
    () => ({
      read: {
        initialState: { path: "/memories" },
        queryOptions: {
          enabled: shouldFetch,
          refetchOnWindowFocus: false,
          staleTime: 60_000,
        },
      },
    }),
    [shouldFetch],
  );

  const treeEndpoint = useEndpoint(treeDefinition, treeOptions, logger, user);
  const memoriesEndpoint = useEndpoint(
    listDefinition,
    memoriesOptions,
    logger,
    user,
  );

  return useMemo((): CortexData => {
    if (!shouldFetch) {
      return emptyData;
    }

    const treeResponse = treeEndpoint.read?.response;
    const memoriesResponse = memoriesEndpoint.read?.response;

    // Parse tree response for workspace overview
    const compactTree = treeResponse?.success
      ? (treeResponse.data?.tree ?? "")
      : "";
    const documentCount = treeResponse?.success
      ? (treeResponse.data?.totalFiles ?? 0)
      : 0;

    // Parse memory entries from listing
    const memories: CortexMemory[] = [];
    let activeCount = 0;
    let archivedCount = 0;

    if (memoriesResponse?.success && memoriesResponse.data?.entries) {
      for (const entry of memoriesResponse.data.entries) {
        if (entry.nodeType === "dir") {
          continue;
        }
        // All files in /memories/ are active for client count purposes
        // (server applies archived filtering from frontmatter)
        activeCount++;
        memories.push({
          path: entry.entryPath,
          content: entry.name,
          priority: 0,
          tags: [],
          createdAt: entry.updatedAt ?? new Date().toISOString(),
        });
      }
    }

    return {
      compactTree,
      documentCount,
      threadCounts: {},
      totalThreads: 0,
      activeMemories: activeCount,
      archivedMemories: archivedCount,
      skillCount: 0,
      taskCount: 0,
      uploadCount: 0,
      searchCount: 0,
      memories,
      trimmedDirs: [],
      skillNames: [],
      dirPurposes: {},
    };
  }, [
    shouldFetch,
    treeEndpoint.read?.response,
    memoriesEndpoint.read?.response,
  ]);
}

const emptyData: CortexData = {
  compactTree: "",
  documentCount: 0,
  threadCounts: {},
  totalThreads: 0,
  activeMemories: 0,
  archivedMemories: 0,
  skillCount: 0,
  taskCount: 0,
  uploadCount: 0,
  searchCount: 0,
  memories: [],
  trimmedDirs: [],
  skillNames: [],
  dirPurposes: {},
};
