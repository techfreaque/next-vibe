/**
 * Shared logic for send/retry/branch operations
 * ALL three operations work identically - they create a new user message and stream AI response
 */

import type { ChatModelId } from "../../models";
import { DefaultFolderId } from "../../../../core/execution-context";
import type { ChatMessage } from "../../../chat/db";
import { ChatMessageRole } from "../../../chat/enum";
import { upsertMessage } from "../../../chat/threads/[threadId]/messages/hooks/update-messages";
import { ModelSelectionType } from "../../../skills/enum";
import type { FavoriteConfig } from "../../../skills/favorites/db";
import { DEFAULT_TTS_VOICE_ID } from "../../../text-to-speech/constants";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

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
    ttsAutoplay: boolean;
  };
  /** Active favorite config - sent to server for model/tool/context resolution */
  favoriteConfig: FavoriteConfig | null;
  /** Called immediately after the optimistic user message is added - switches the visible branch */
  setLeafMessageId?: (messageId: string) => void;
  locale: CountryLanguage;
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
    settings,
    favoriteConfig,
    setLeafMessageId,
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
        await import("../../../chat/incognito/storage");
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

    // Incognito threads live only in localStorage - send their current
    // title/description so the server-side thread-rename prompt fragment can
    // see them (server threads read this from their DB row instead).
    let incognitoThreadTitle: string | null = null;
    let incognitoThreadDescription: string | null = null;
    if (currentRootFolderId === DefaultFolderId.INCOGNITO && threadId) {
      const { getIncognitoThread } =
        await import("../../../chat/incognito/storage");
      const incognitoThread = await getIncognitoThread(threadId);
      incognitoThreadTitle = incognitoThread?.title ?? null;
      incognitoThreadDescription = incognitoThread?.description ?? null;
    }

    // Optimistically add user message to store for immediate UI feedback.
    // The server will emit USER MESSAGE_CREATED with the correct parentId/depth,
    // which will update (replace) this optimistic entry in the store.
    if (!hasToolConfirmations) {
      let messageMetadata: ChatMessage["metadata"] = {};
      if (audioInput) {
        messageMetadata = { isTranscribing: true };
      } else if (attachments && attachments.length > 0) {
        if (currentRootFolderId === DefaultFolderId.INCOGNITO) {
          // In incognito mode files are never uploaded to server - convert to base64
          // immediately so the attachment data survives localStorage persistence.
          const { convertFilesToIncognitoAttachments } =
            await import("../../../chat/incognito/file-utils");
          const incognitoAttachments =
            await convertFilesToIncognitoAttachments(attachments);
          messageMetadata = {
            isUploadingAttachments: false,
            attachments: incognitoAttachments,
          };
        } else {
          // Build optimistic attachment previews with local blob URLs so the UI
          // renders file thumbnails immediately, before the server upload completes.
          const optimisticAttachments = attachments.map((file) => ({
            id: crypto.randomUUID(),
            url: URL.createObjectURL(file),
            filename: file.name,
            mimeType: file.type,
            size: file.size,
          }));
          messageMetadata = {
            isUploadingAttachments: true,
            attachments: optimisticAttachments,
          };
        }
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
      // If the server detects the thread is already streaming, the WS event
      // for the user message will carry isQueued: true metadata, and the
      // message-created handler will clean up this optimistic placeholder.
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

    // Voice mode - resolve voice from favoriteConfig cascade, fall back to default
    const voiceSel = favoriteConfig?.voiceModelSelection;
    const resolvedVoice =
      voiceSel?.selectionType === ModelSelectionType.MANUAL &&
      "manualModelId" in voiceSel &&
      voiceSel.manualModelId
        ? voiceSel.manualModelId
        : DEFAULT_TTS_VOICE_ID;
    const effectiveVoiceMode = {
      enabled: settings.ttsAutoplay,
      voice: resolvedVoice,
    };

    // Get user's timezone from browser
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Start AI stream (all model types go through ai-stream, including image/audio)
    // POST is fire-and-forget - WS events handled by useMessagesSubscription
    // If the thread is already streaming, the server auto-queues the message.
    // favoriteConfig carries the full cascade config (models, tools, context).
    // Server uses it directly - no re-query needed.
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
      favoriteConfig,
      toolConfirmations: params.toolConfirmations ?? null,
      messageHistory: messageHistory ?? [],
      incognitoThreadTitle,
      incognitoThreadDescription,
      attachments: attachments && attachments.length > 0 ? attachments : null,
      voiceMode: effectiveVoiceMode,
      audioInput: audioInput ?? { file: null },
      timezone,
      imageSize: params.imageSize,
      imageQuality: params.imageQuality,
      musicDuration: params.musicDuration,
      executionContext: { mode: "local" as const },
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
