"use client";

import { useMemo } from "react";

import type { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { useAllPromptFragments } from "@/app/api/[locale]/system/generated/prompt-fragments-client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { buildTrailingSystemMessage, generateSystemPrompt } from "./assembler";

export interface DebugSystemPromptParts {
  /** Leading system prompt - sent as the static `system` param to the AI (cacheable). */
  systemPrompt: string;
  /** Trailing system message - injected as a system message in the messages array, before the context line. Empty when nothing to inject. */
  trailingSystemMessage: string;
  /** Upcoming assistant context line - always the last message in the array. */
  contextLine: string;
}

/**
 * Hook for debug view that handles all data fetching and system prompt generation.
 * Uses generated useAllPromptFragments - zero hardcoded fragment imports.
 * Adding a new fragment only requires running the generator; no changes here.
 */
export function useDebugSystemPrompt(params: {
  locale: CountryLanguage;
  rootFolderId: DefaultFolderId;
  subFolderId?: string | null;
  skillId?: string | null;
  selectedModel?: string;
  user: JwtPayloadType;
  logger: EndpointLogger;
  /** ttsAutoplay from settings - caller must pass this to avoid a second useChatSettings instance */
  callMode: boolean;
}): DebugSystemPromptParts {
  const {
    locale,
    rootFolderId,
    subFolderId,
    skillId,
    selectedModel,
    user,
    logger,
    callMode,
  } = params;

  const isIncognito = rootFolderId === "incognito";
  const isExposedFolder =
    rootFolderId === "public" || rootFolderId === "shared";
  const enabled = !isIncognito;
  const enabledPrivate = enabled && !isExposedFolder;

  const { leading, trailing } = useAllPromptFragments({
    user,
    logger,
    locale,
    enabled,
    enabledPrivate,
    skillId,
    rootFolderId,
    subFolderId,
    callMode,
    subAgentDepth: 0,
  });

  return useMemo(() => {
    const systemPrompt = generateSystemPrompt({ leadingFragments: leading });

    const trailingSystemMessage = buildTrailingSystemMessage({
      trailingFragments: trailing.map((x) => x.str),
    });

    const contextLine = `[Context: ID:<msg-id> | Model:${selectedModel ?? "<model>"} | Skill:${skillId ?? "<none>"} | Posted:<timestamp>]`;
    return { systemPrompt, trailingSystemMessage, contextLine };
  }, [leading, trailing, selectedModel, skillId]);
}
