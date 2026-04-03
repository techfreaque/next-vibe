/**
 * Shared logic for send/retry/branch operations
 * ALL three operations work identically - they create a new user message and stream AI response
 */

import { parseError } from "next-vibe/shared/utils";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { getDefaultToolIdsForUser } from "@/app/api/[locale]/agent/chat/constants";
import type { ChatMessage } from "@/app/api/[locale]/agent/chat/db";
import { ChatMessageRole } from "@/app/api/[locale]/agent/chat/enum";
import type { ToolConfigItem } from "@/app/api/[locale]/agent/chat/settings/definition";
import { SkillsRepositoryClient } from "@/app/api/[locale]/agent/chat/skills/repository-client";
import { upsertMessage } from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/hooks/update-messages";
import { DEFAULT_TTS_VOICE_ID } from "@/app/api/[locale]/agent/text-to-speech/constants";
import type { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";
import type {
  ModelProviderEnvAvailability,
  VoiceModelSelection,
} from "@/app/api/[locale]/agent/models/types";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import type { UseAIStreamReturn } from "./use-ai-stream";

export type StartStreamFn = UseAIStreamReturn["startStream"];

export interface CreateMessageParams {
  content: string;
  parentMessageId: string | null; // Caller must determine correct parent based on operation
  threadId: string;
  audioInput?: { file: File };
  attachments?: File[];
  operation: "send" | "retry" | "edit";
  // Optional: for send operation with tool confirmations or explicit params
  messageHistory?: ChatMessage[] | null;
  toolConfirmations?: Array<{
    messageId: string;
    confirmed: boolean;
    updatedArgs?: Record<string, string | number | boolean | null>;
  }>;
  /** Image generation settings (used when selectedModel.modelRole === "image-gen") */
  imageSize?: string;
  imageQuality?: string;
  /** Music generation settings (used when selectedModel.modelRole === "audio-gen") */
  musicDuration?: string;
}

export interface MessageOperationDeps {
  logger: EndpointLogger;
  startStream: StartStreamFn;
  currentRootFolderId: DefaultFolderId;
  currentSubFolderId: string | null;
  user: JwtPayloadType;
  settings: {
    selectedModel: ChatModelId;
    selectedSkill: string;
    availableTools: ToolConfigItem[] | null;
    pinnedTools: ToolConfigItem[] | null;
    ttsAutoplay: boolean;
    voiceModelSelection: VoiceModelSelection | null | undefined;
  };
  /** Called immediately after the optimistic user message is added - switches the visible branch */
  setLeafMessageId?: (messageId: string) => void;
  locale: CountryLanguage;
  env: ModelProviderEnvAvailability;
}

/**
 * Create and send a new user message
 * Used by send, retry, and branch - all work identically
 */
export async function createAndSendUserMessage(
  params: CreateMessageParams,
  deps: MessageOperationDeps,
): Promise<boolean> {
  const {
    logger,
    startStream,
    currentRootFolderId,
    currentSubFolderId,
    user,
    settings,
    setLeafMessageId,
    env,
  } = deps;

  const {
    content,
    parentMessageId,
    threadId,
    audioInput,
    attachments,
    operation,
  } = params;

  logger.debug(`${operation} operation`, {
    hasAudioInput: !!audioInput,
    hasAttachments: !!attachments,
    attachmentCount: attachments?.length || 0,
  });

  try {
    // For tool confirmations, we don't create a new user message
    // We're just confirming existing tool calls
    const hasToolConfirmations =
      params.toolConfirmations && params.toolConfirmations.length > 0;
    const newMessageId = hasToolConfirmations ? null : crypto.randomUUID();

    // Build message history (incognito only - server fetches from DB for server threads)
    // Use provided messageHistory if available (e.g., pre-filtered from send operation)
    let messageHistory: ChatMessage[] | null = params.messageHistory ?? null;
    if (
      !messageHistory &&
      currentRootFolderId === DefaultFolderId.INCOGNITO &&
      parentMessageId
    ) {
      // Load incognito thread messages and walk up parent chain
      const { getMessagesForThread } =
        await import("@/app/api/[locale]/agent/chat/incognito/storage");
      const threadMessages = await getMessagesForThread(threadId);

      // Walk up parent chain to get only messages in this branch
      messageHistory = [];
      const messageMap = new Map(threadMessages.map((m) => [m.id, m]));
      let currentId: string | null = parentMessageId;

      while (currentId) {
        const msg = messageMap.get(currentId);
        if (!msg) {
          break;
        }
        messageHistory.push(msg);
        currentId = msg.parentId;
      }

      // Reverse to get chronological order (oldest first)
      messageHistory.reverse();
    }

    // Optimistically add user message to store for immediate UI feedback.
    // The server will emit USER MESSAGE_CREATED with the correct parentId/depth,
    // which will update (replace) this optimistic entry in the store.
    if (!hasToolConfirmations) {
      let messageMetadata: ChatMessage["metadata"] = {};
      if (audioInput) {
        messageMetadata = { isTranscribing: true };
      } else if (attachments && attachments.length > 0) {
        messageMetadata = { isUploadingAttachments: true };
      }

      const optimisticUserMessage: ChatMessage = {
        id: newMessageId!,
        threadId,
        role: ChatMessageRole.USER,
        content: audioInput ? "" : content,
        parentId: parentMessageId,
        sequenceId: null,
        authorId:
          currentRootFolderId === DefaultFolderId.INCOGNITO
            ? "incognito"
            : null,
        authorName: null,
        isAI: false,
        model: settings.selectedModel,
        skill: settings.selectedSkill,
        errorType: null,
        errorMessage: null,
        errorCode: null,
        metadata: messageMetadata,
        upvotes: 0,
        downvotes: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        searchVector: null,
      };

      upsertMessage(
        threadId,
        currentRootFolderId,
        logger,
        optimisticUserMessage,
      );

      // Immediately switch the visible branch to the new message.
      // The auto-switch in useBranchManagement only fires when parentId === currentLeaf,
      // which doesn't hold for retry/branch (they use the grandparent as parentId).
      setLeafMessageId?.(newMessageId!);

      // Add an optimistic assistant placeholder so the group header + loading
      // indicator appear immediately, before the server emits MESSAGE_CREATED.
      // Tagged with isOptimistic so event-handlers can remove it when the real
      // server message arrives (or on error).
      const optimisticAssistantId = crypto.randomUUID();
      const optimisticAssistantMessage: ChatMessage = {
        id: optimisticAssistantId,
        threadId,
        role: ChatMessageRole.ASSISTANT,
        content: "",
        parentId: newMessageId!,
        sequenceId: null,
        authorId: null,
        authorName: null,
        isAI: true,
        model: settings.selectedModel,
        skill: settings.selectedSkill,
        errorType: null,
        errorMessage: null,
        errorCode: null,
        metadata: { isStreaming: true, isOptimistic: true },
        upvotes: 0,
        downvotes: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        searchVector: null,
      };
      upsertMessage(
        threadId,
        currentRootFolderId,
        logger,
        optimisticAssistantMessage,
      );
    } else {
      logger.debug("Skipping user message creation for tool confirmations", {
        count: params.toolConfirmations?.length ?? 0,
      });
    }

    // Voice mode settings - resolve TTS voice from selection or fall back to default
    const resolvedVoiceModel = settings.voiceModelSelection
      ? SkillsRepositoryClient.getBestTtsModel(
          settings.voiceModelSelection,
          user,
          env,
        )
      : null;
    const effectiveVoiceMode = {
      enabled: settings.ttsAutoplay,
      voice: resolvedVoiceModel?.id ?? DEFAULT_TTS_VOICE_ID,
    };

    // Get user's timezone from browser
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // availableTools = permission layer (null = all tools allowed)
    // pinnedTools = context window layer (tools loaded into AI SDK context window)
    // Both stored in settings in the same format as ai-stream expects
    const availableToolsPayload =
      settings.availableTools?.map((t) => ({
        toolId: t.toolId,
        requiresConfirmation: t.requiresConfirmation ?? false,
      })) ?? null;
    const pinnedToolsPayload = (
      settings.pinnedTools ??
      getDefaultToolIdsForUser(user).map((id) => ({
        toolId: id,
        requiresConfirmation: false,
      }))
    ).map((t) => ({
      toolId: t.toolId,
      requiresConfirmation: t.requiresConfirmation ?? false,
    }));

    // Start AI stream (all model types go through ai-stream, including image/audio)
    // POST is fire-and-forget - WS events handled by useMessagesSubscription
    const streamStarted = await startStream({
      operation,
      rootFolderId: currentRootFolderId,
      subFolderId: currentSubFolderId ?? null,
      threadId: threadId ?? null,
      userMessageId: newMessageId,
      parentMessageId: parentMessageId ?? null,
      content,
      role: ChatMessageRole.USER,
      model: settings.selectedModel,
      skill: settings.selectedSkill ?? null,
      availableTools: availableToolsPayload,
      pinnedTools: pinnedToolsPayload,
      toolConfirmations: params.toolConfirmations ?? null,
      messageHistory: messageHistory ?? [],
      attachments: attachments && attachments.length > 0 ? attachments : null,
      voiceMode: effectiveVoiceMode,
      audioInput: audioInput ?? { file: null },
      timezone,
      imageSize: params.imageSize,
      imageQuality: params.imageQuality,
      musicDuration: params.musicDuration,
    });

    if (!streamStarted) {
      // addErrorMessageToChat (called inside startStream on failure) already
      // reverts the optimistic user message and adds an error message in its place.
      // Nothing to clean up here.
      return false;
    }

    // Input is cleared when the server-emitted USER MESSAGE_CREATED event arrives
    // (handled in event-handlers.ts). This ensures input is only cleared once the
    // message is confirmed persisted (or saved to incognito localStorage).
    return true;
  } catch (error) {
    logger.error(`Failed to ${operation} message`, parseError(error));
    return false;
  }
}
