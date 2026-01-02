/**
 * Send Message Operation
 * Handles sending new messages in both incognito and server modes
 */

import { parseError } from "next-vibe/shared/utils";

import { getLastMessageInBranch } from "@/app/[locale]/chat/lib/utils/thread-builder";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { DEFAULT_TTS_VOICE } from "../../../../../../text-to-speech/enum";
import type { UseAIStreamReturn } from "../../../../../../ai-stream/hooks/use-ai-stream";
import { DefaultFolderId } from "../../../../../config";
import { createCreditUpdateCallback } from "../../../../../credit-updater";
import type { ChatMessage } from "../../../../../db";
import { ChatMessageRole } from "../../../../../enum";
import { useChatStore } from "../../../../../hooks/store";
import type { ModelId } from "../../../../../model-access/models";
import { useVoiceModeStore } from "../../../../../voice-mode/store";
import { getCallModeKey } from "../../../../../voice-mode/types";

import { REQUIRE_TOOL_CONFIRMATION } from "./answer-as-ai";

export interface SendMessageParams {
  content: string;
  threadId?: string;
  parentId?: string;
  toolConfirmation?: {
    messageId: string;
    confirmed: boolean;
    updatedArgs?: Record<string, string | number | boolean | null>;
  };
  audioInput?: { file: File };
  attachments: File[];
}

export interface SendMessageDeps {
  logger: EndpointLogger;
  aiStream: UseAIStreamReturn;
  activeThreadId: string | null;
  currentRootFolderId: DefaultFolderId;
  currentSubFolderId: string | null;
  chatStore: {
    messages: Record<string, ChatMessage>;
    threads: Record<string, { rootFolderId: DefaultFolderId }>;
    setLoading: (loading: boolean) => void;
    getThreadMessages: (threadId: string) => ChatMessage[];
    getBranchIndices: (threadId: string) => Record<string, number>;
  };
  settings: {
    selectedModel: ModelId;
    selectedCharacter: string;
    temperature: number;
    maxTokens: number;
    enabledToolIds: string[];
  };
  setInput: (input: string) => void;
  setAttachments: (attachments: File[] | ((prev: File[]) => File[])) => void;
  deductCredits: (creditCost: number, feature: string) => void;
}

export async function sendMessage(
  params: SendMessageParams,
  deps: SendMessageDeps,
  onThreadCreated?: (
    threadId: string,
    rootFolderId: DefaultFolderId,
    subFolderId: string | null,
  ) => void,
): Promise<void> {
  const {
    logger,
    aiStream,
    activeThreadId,
    currentRootFolderId,
    currentSubFolderId,
    chatStore,
    settings,
    setInput,
    setAttachments,
    deductCredits,
  } = deps;
  const { content } = params;

  logger.debug("Send message operation", {
    content: content.slice(0, 50),
    activeThreadId,
    currentRootFolderId,
  });

  chatStore.setLoading(true);

  try {
    // Determine thread ID to use
    let threadIdToUse: string | null;
    if (params.toolConfirmation) {
      threadIdToUse = params.threadId ?? null;
    } else {
      threadIdToUse = activeThreadId === "new" ? null : activeThreadId;
    }

    if (threadIdToUse && currentRootFolderId !== "incognito") {
      const threadExists = chatStore.threads[threadIdToUse];
      if (!threadExists) {
        threadIdToUse = null;
      }
    }

    let parentMessageId: string | null = null;
    let messageHistory: ChatMessage[] | null | undefined;

    // Load messages and determine parent
    if (threadIdToUse) {
      let threadMessages: ChatMessage[];
      if (currentRootFolderId === DefaultFolderId.INCOGNITO) {
        const { getMessagesForThread } = await import(
          "../../../../../incognito/storage"
        );
        threadMessages = await getMessagesForThread(threadIdToUse);
      } else {
        threadMessages = chatStore.getThreadMessages(threadIdToUse);
      }

      if (params.toolConfirmation && params.parentId) {
        parentMessageId = params.parentId;
      } else if (threadMessages.length > 0) {
        const branchIndices = chatStore.getBranchIndices(threadIdToUse);
        const lastMessage = getLastMessageInBranch(
          threadMessages,
          branchIndices,
        );

        if (lastMessage) {
          parentMessageId = lastMessage.id;
        } else {
          const fallbackMessage = threadMessages[threadMessages.length - 1];
          parentMessageId = fallbackMessage.id;
        }
      }

      messageHistory =
        currentRootFolderId === DefaultFolderId.INCOGNITO
          ? threadMessages
          : null;
    }

    const userMessageId = crypto.randomUUID();
    let createdThreadIdForNewThread: string | null = null;

    // Ensure thread ID (create for new threads)
    if (!threadIdToUse) {
      createdThreadIdForNewThread = crypto.randomUUID();

      if (currentRootFolderId === DefaultFolderId.INCOGNITO) {
        const { createIncognitoThread } = await import(
          "../../../../../incognito/storage"
        );
        const newThread = await createIncognitoThread(
          content.slice(0, 50) || "New Chat",
          currentRootFolderId,
          currentSubFolderId,
          createdThreadIdForNewThread,
        );
        useChatStore.getState().addThread(newThread);
      }
    }

    const finalThreadId = threadIdToUse || createdThreadIdForNewThread;

    if (!finalThreadId) {
      logger.error("No thread ID available");
      return;
    }

    // Navigate immediately BEFORE API call
    if (onThreadCreated) {
      onThreadCreated(finalThreadId, currentRootFolderId, currentSubFolderId);
    }

    // Create user message immediately (BEFORE API call)
    const parentDepth = parentMessageId
      ? (messageHistory?.find((m) => m.id === parentMessageId)?.depth ?? 0)
      : 0;

    const createdUserMessage: ChatMessage = {
      id: userMessageId,
      threadId: finalThreadId,
      role: ChatMessageRole.USER,
      content: params.audioInput ? "" : content,
      parentId: parentMessageId,
      depth: parentDepth + 1,
      sequenceId: null,
      authorId:
        currentRootFolderId === DefaultFolderId.INCOGNITO ? "incognito" : null,
      authorName: null,
      authorAvatar: null,
      authorColor: null,
      isAI: false,
      model: settings.selectedModel,
      character: settings.selectedCharacter,
      errorType: null,
      errorMessage: null,
      errorCode: null,
      edited: false,
      originalId: null,
      tokens: null,
      metadata: params.audioInput
        ? { isTranscribing: true }
        : params.attachments.length > 0
          ? {}
          : {},
      upvotes: 0,
      downvotes: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      searchVector: null,
    };

    // Add message to UI immediately
    useChatStore.getState().addMessage(createdUserMessage);

    // Save to localStorage (incognito only)
    if (currentRootFolderId === DefaultFolderId.INCOGNITO) {
      const { saveMessageWithAttachments } = await import(
        "../../../../../incognito/storage"
      );
      await saveMessageWithAttachments(createdUserMessage, params.attachments);
    }

    // Voice mode settings
    const voiceModeSettings = useVoiceModeStore.getState().settings;
    const callModeKey = getCallModeKey(
      settings.selectedModel,
      settings.selectedCharacter ?? "default",
    );
    const isCallModeEnabled =
      voiceModeSettings.callModeByConfig?.[callModeKey] ?? false;

    const effectiveVoiceMode = isCallModeEnabled
      ? {
          enabled: true,
          voice: DEFAULT_TTS_VOICE,
        }
      : null;

    // Start AI stream
    await aiStream.startStream(
      {
        operation: "send" as const,
        rootFolderId: currentRootFolderId,
        subFolderId: currentSubFolderId ?? null,
        threadId: finalThreadId,
        userMessageId,
        parentMessageId: parentMessageId ?? null,
        content,
        role: ChatMessageRole.USER,
        model: settings.selectedModel,
        character: settings.selectedCharacter ?? null,
        temperature: settings.temperature,
        maxTokens: settings.maxTokens,
        tools:
          settings.enabledToolIds?.map((toolId) => ({
            toolId,
            requiresConfirmation: REQUIRE_TOOL_CONFIRMATION,
          })) ?? null,
        toolConfirmation: params.toolConfirmation ?? null,
        messageHistory: messageHistory ?? null,
        attachments: params.attachments.length > 0 ? params.attachments : null,
        voiceMode: effectiveVoiceMode,
        audioInput: params.audioInput ?? { file: null },
      },
      {
        onContentDone: createCreditUpdateCallback(
          settings.selectedModel,
          deductCredits,
        ),
      },
    );

    // Clear input on success
    const { useAIStreamStore } = await import(
      "../../../../../../ai-stream/hooks/store"
    );
    const streamError = useAIStreamStore.getState().error;
    if (!streamError) {
      setInput("");
      setAttachments([]);
    }
  } catch (error) {
    logger.error("Failed to send message", parseError(error));
  } finally {
    chatStore.setLoading(false);
  }
}
