/**
 * Input Handlers Hook
 * Handles input submission, keyboard events, model changes, and prompt filling
 */

import type { TextareaKeyboardEvent } from "next-vibe-ui/ui/textarea";
import { useCallback, useMemo } from "react";

import type { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { useChatNavigationStore } from "@/app/api/[locale]/agent/chat/hooks/use-chat-navigation-store";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { clearDraft } from "../hooks/use-input-autosave";

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
      rootFolderId: DefaultFolderId,
      subFolderId: string | null,
    ) => void,
  ) => Promise<{ success: boolean; createdThreadId: string | null }>;
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
  const setNavigation = useChatNavigationStore((s) => s.setNavigation);
  const setLeafMessageId = useChatNavigationStore((s) => s.setLeafMessageId);
  const navActiveThreadId = useChatNavigationStore((s) => s.activeThreadId);
  const navRootFolderId = useChatNavigationStore((s) => s.currentRootFolderId);
  const navSubFolderId = useChatNavigationStore((s) => s.currentSubFolderId);

  const submitMessage = useCallback(async () => {
    logger.debug("Chat", "submitMessage called", {
      hasInput: Boolean(input),
      isValidInput: isValidInput(input),
      isLoading,
      attachmentsCount: attachments?.length || 0,
    });

    if (isValidInput(input) && !isLoading) {
      logger.debug("Chat", "submitMessage calling sendMessage");

      // Snapshot navigation state before sending — needed to revert on failure
      // These closure values are captured at render time (pre-navigation state).
      const preNavSnapshot = {
        activeThreadId: navActiveThreadId,
        currentRootFolderId: navRootFolderId,
        currentSubFolderId: navSubFolderId,
      };

      const result = await sendMessage(
        { content: input, attachments },
        (threadId, rootFolderId, subFolderId) => {
          // Navigate to the newly created thread
          logger.debug("Chat", "Navigating to newly created thread", {
            threadId,
            rootFolderId,
            subFolderId,
          });

          // Update navigation store immediately for instant reactivity
          setNavigation({
            activeThreadId: threadId,
            currentRootFolderId: rootFolderId,
            currentSubFolderId: subFolderId,
          });

          // New thread — clear ?message= since it starts fresh (no branch to track)
          setLeafMessageId(null);

          // Build URL with proper subfolder path if present (no ?message= for new threads)
          const url = subFolderId
            ? `/${locale}/threads/${rootFolderId}/${subFolderId}/${threadId}`
            : `/${locale}/threads/${rootFolderId}/${threadId}`;

          // Synchronous URL update — Zustand store is source of truth
          window.history.replaceState(null, "", url);
        },
      );

      // If the stream failed and a new thread was optimistically created, revert navigation store
      if (!result.success && result.createdThreadId) {
        setNavigation(preNavSnapshot);
        logger.warn(
          "Chat",
          "Stream failed — reverted navigation store to pre-send state",
        );
      }

      // Clear the draft after successful send
      if (result.success) {
        logger.debug("Chat", "submitMessage completed, clearing draft");
        await clearDraft(draftKey, logger);
        logger.debug("Chat", "Draft cleared");
      }
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
    draftKey,
    setNavigation,
    setLeafMessageId,
    navActiveThreadId,
    navRootFolderId,
    navSubFolderId,
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

        const preNavSnapshot = {
          activeThreadId: navActiveThreadId,
          currentRootFolderId: navRootFolderId,
          currentSubFolderId: navSubFolderId,
        };

        const result = await sendMessage(
          { content, attachments },
          (threadId, rootFolderId, subFolderId) => {
            logger.debug("Chat", "Navigating to newly created thread", {
              threadId,
              rootFolderId,
              subFolderId,
            });
            // Update store immediately
            setNavigation({
              activeThreadId: threadId,
              currentRootFolderId: rootFolderId,
              currentSubFolderId: subFolderId,
            });
            // New thread — clear ?message= since it starts fresh
            setLeafMessageId(null);
            const url = subFolderId
              ? `/${locale}/threads/${rootFolderId}/${subFolderId}/${threadId}`
              : `/${locale}/threads/${rootFolderId}/${threadId}`;
            window.history.pushState(null, "", url);
          },
        );

        if (!result.success && result.createdThreadId) {
          setNavigation(preNavSnapshot);
        }

        if (result.success) {
          await clearDraft(draftKey, logger);
          // Clear input after send
          setInput("");
        }
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
      draftKey,
      setNavigation,
      setLeafMessageId,
      navActiveThreadId,
      navRootFolderId,
      navSubFolderId,
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

      const preNavSnapshot = {
        activeThreadId: navActiveThreadId,
        currentRootFolderId: navRootFolderId,
        currentSubFolderId: navSubFolderId,
      };

      const result = await sendMessage(
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
          // Update store immediately
          setNavigation({
            activeThreadId: threadId,
            currentRootFolderId: rootFolderId,
            currentSubFolderId: subFolderId,
          });
          // New thread — clear ?message= since it starts fresh
          setLeafMessageId(null);
          // Build URL with proper subfolder path if present (same as text flow)
          const url = subFolderId
            ? `/${locale}/threads/${rootFolderId}/${subFolderId}/${threadId}`
            : `/${locale}/threads/${rootFolderId}/${threadId}`;
          window.history.pushState(null, "", url);
        },
      );

      if (!result.success && result.createdThreadId) {
        setNavigation(preNavSnapshot);
      }
      if (result.success) {
        await clearDraft(draftKey, logger);
      }
    },
    [
      isLoading,
      attachments,
      sendMessage,
      logger,
      locale,
      draftKey,
      setNavigation,
      setLeafMessageId,
      navActiveThreadId,
      navRootFolderId,
      navSubFolderId,
    ],
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

  return useMemo(
    () => ({
      submitMessage,
      submitWithContent,
      submitWithAudio,
      handleSubmit: submitMessage,
      handleKeyDown,
      handleScreenshot,
    }),
    [
      submitMessage,
      submitWithContent,
      submitWithAudio,
      handleKeyDown,
      handleScreenshot,
    ],
  );
}
