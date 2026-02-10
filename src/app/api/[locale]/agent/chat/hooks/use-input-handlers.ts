/**
 * Input Handlers Hook
 * Handles input submission, keyboard events, model changes, and prompt filling
 */

import { useRouter } from "next-vibe-ui/hooks";
import { useCallback } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TextareaKeyboardEvent } from "@/packages/next-vibe-ui/web/ui/textarea";

import { clearDraft } from "./use-input-autosave";

// Utility functions
const isValidInput = (input: string): boolean => input.trim().length > 0;
const isSubmitKeyPress = (e: TextareaKeyboardEvent): boolean =>
  e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey;

interface UseInputHandlersProps {
  input: string;
  attachments: File[];
  isLoading: boolean;
  sendMessage: (
    params: {
      content: string;
      threadId?: string;
      parentId?: string;
      toolConfirmations?: Array<{
        messageId: string;
        confirmed: boolean;
        updatedArgs?: Record<string, string | number | boolean | null>;
      }>;
      /** Audio input for voice-to-voice mode */
      audioInput?: { file: File };
      /** File attachments */
      attachments: File[];
    },
    onNewThread?: (
      threadId: string,
      rootFolderId: string,
      subFolderId: string | null,
    ) => void,
  ) => Promise<void>;
  setInput: (input: string) => void;
  locale: CountryLanguage;
  logger: EndpointLogger;
  draftKey: string;
}

interface UseInputHandlersReturn {
  submitMessage: () => Promise<void>;
  /** Submit with explicit content - bypasses async state issues */
  submitWithContent: (content: string) => Promise<void>;
  /** Submit with audio file - for voice-to-voice mode (server transcribes) */
  submitWithAudio: (audioFile: File) => Promise<void>;
  handleSubmit: () => Promise<void>;
  handleKeyDown: (e: TextareaKeyboardEvent) => void;
  handleScreenshot: () => Promise<void>;
}

export function useInputHandlers({
  input,
  attachments,
  isLoading,
  sendMessage,
  setInput,
  locale,
  logger,
  draftKey,
}: UseInputHandlersProps): UseInputHandlersReturn {
  const router = useRouter();

  const submitMessage = useCallback(async () => {
    logger.debug("Chat", "submitMessage called", {
      hasInput: Boolean(input),
      isValidInput: isValidInput(input),
      isLoading,
      attachmentsCount: attachments?.length || 0,
    });

    if (isValidInput(input) && !isLoading) {
      logger.debug("Chat", "submitMessage calling sendMessage");
      await sendMessage(
        { content: input, attachments },
        (threadId, rootFolderId, subFolderId) => {
          // Navigate to the newly created thread
          logger.debug("Chat", "Navigating to newly created thread", {
            threadId,
            rootFolderId,
            subFolderId,
          });
          // Build URL with proper subfolder path if present
          const url = subFolderId
            ? `/${locale}/threads/${rootFolderId}/${subFolderId}/${threadId}`
            : `/${locale}/threads/${rootFolderId}/${threadId}`;

          // CRITICAL: Use history.replaceState for SYNCHRONOUS navigation
          // router.push/replace are async and won't update activeThreadId before messages are created
          window.history.replaceState(null, "", url);
          // Still call router for Next.js state management
          router.replace(url);
        },
      );
      // Clear the draft after successful send
      logger.debug("Chat", "submitMessage completed, clearing draft");
      await clearDraft(draftKey, logger);
      logger.debug("Chat", "Draft cleared");
    } else {
      logger.debug("Chat", "submitMessage blocked");
    }
  }, [
    input,
    attachments,
    isLoading,
    sendMessage,
    logger,
    locale,
    router,
    draftKey,
  ]);

  /**
   * Submit with explicit content - bypasses async state issues
   * Used for voice input direct submit where we need to send immediately
   */
  const submitWithContent = useCallback(
    async (content: string) => {
      logger.debug("Chat", "submitWithContent called", {
        contentLength: content.length,
        isLoading,
        attachmentsCount: attachments?.length || 0,
      });

      if (isValidInput(content) && !isLoading) {
        logger.debug("Chat", "submitWithContent calling sendMessage");
        // Also update the input state for UI consistency
        setInput(content);
        await sendMessage(
          { content, attachments },
          (threadId, rootFolderId, subFolderId) => {
            logger.debug("Chat", "Navigating to newly created thread", {
              threadId,
              rootFolderId,
              subFolderId,
            });
            const url = subFolderId
              ? `/${locale}/threads/${rootFolderId}/${subFolderId}/${threadId}`
              : `/${locale}/threads/${rootFolderId}/${threadId}`;
            router.push(url);
          },
        );
        await clearDraft(draftKey, logger);
        // Clear input after send
        setInput("");
      } else {
        logger.debug("Chat", "submitWithContent blocked", { isLoading });
      }
    },
    [
      isLoading,
      attachments,
      sendMessage,
      setInput,
      logger,
      locale,
      router,
      draftKey,
    ],
  );

  /**
   * Submit with audio file - for voice-to-voice mode
   * Server will transcribe audio and respond with TTS
   */
  const submitWithAudio = useCallback(
    async (audioFile: File) => {
      logger.debug("Chat", "submitWithAudio called", {
        fileSize: audioFile.size,
        fileType: audioFile.type,
        isLoading,
      });

      if (isLoading) {
        logger.debug("Chat", "submitWithAudio blocked - isLoading");
        return;
      }

      logger.debug("Chat", "submitWithAudio calling sendMessage with audio");
      await sendMessage(
        {
          content: "", // Server will use transcribed audio as content
          audioInput: { file: audioFile },
          attachments,
        },
        (threadId, rootFolderId, subFolderId) => {
          logger.debug("Chat", "Navigating to newly created thread", {
            threadId,
            rootFolderId,
            subFolderId,
          });
          // Build URL with proper subfolder path if present (same as text flow)
          const url = subFolderId
            ? `/${locale}/threads/${rootFolderId}/${subFolderId}/${threadId}`
            : `/${locale}/threads/${rootFolderId}/${threadId}`;
          router.push(url);
        },
      );
      await clearDraft(draftKey, logger);
    },
    [isLoading, attachments, sendMessage, logger, locale, router, draftKey],
  );

  const handleKeyDown = useCallback(
    (e: TextareaKeyboardEvent) => {
      if (isSubmitKeyPress(e)) {
        e.preventDefault();
        void submitMessage();
      }
    },
    [submitMessage],
  );

  const handleScreenshot = useCallback(() => {
    // Screenshot functionality to be implemented
    logger.info("Screenshot requested");
    return Promise.resolve();
  }, [logger]);

  return {
    submitMessage,
    submitWithContent,
    submitWithAudio,
    handleSubmit: submitMessage,
    handleKeyDown,
    handleScreenshot,
  };
}
