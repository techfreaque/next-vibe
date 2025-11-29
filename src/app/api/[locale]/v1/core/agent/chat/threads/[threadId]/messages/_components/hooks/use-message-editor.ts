/**
 * Custom hook for message editor logic
 * Handles content state, loading state, and action handlers
 */

import { parseError } from "next-vibe/shared/utils/parse-error";
import { useCallback, useEffect, useRef, useState } from "react";

import type {
  TextareaKeyboardEvent,
  TextareaRefObject,
} from "@/packages/next-vibe-ui/web/ui/textarea";
import type { DivRefObject } from "@/packages/next-vibe-ui/web/ui/div";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { ChatMessage } from "@/app/api/[locale]/v1/core/agent/chat/db";
import { TIMING } from "@/app/[locale]/chat/lib/config/constants";

export type EditorActionType = "branch" | null;

export interface UseMessageEditorOptions {
  message: ChatMessage;
  onBranch: (messageId: string, content: string) => Promise<void>;
  onCancel: () => void;
  logger: EndpointLogger;
}

export interface UseMessageEditorReturn {
  // State
  content: string;
  isLoading: boolean;
  actionType: EditorActionType;

  // Refs
  editorRef: React.RefObject<DivRefObject | null>;
  textareaRef: React.RefObject<TextareaRefObject | null>;

  // Handlers
  setContent: (content: string) => void;
  handleBranch: () => Promise<void>;
  handleKeyDown: (e: TextareaKeyboardEvent) => void;
  handleCancel: () => void;
}

/**
 * Hook for managing message editor state and actions
 */
export function useMessageEditor({
  message,
  onBranch,
  onCancel,
  logger,
}: UseMessageEditorOptions): UseMessageEditorReturn {
  const [content, setContent] = useState(message.content);
  const [isLoading, setIsLoading] = useState(false);
  const [actionType, setActionType] = useState<EditorActionType>(null);
  const editorRef = useRef<DivRefObject>(null);
  const textareaRef = useRef<TextareaRefObject>(null);

  // Initialize content when message changes
  useEffect(() => {
    setContent(message.content);
  }, [message.id, message.content]);

  // Scroll into view and focus when editor mounts
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }

    // Focus textarea after a short delay to ensure it's rendered
    const timeoutId = setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        // Select all text for easy editing
        textareaRef.current.select();
      }
    }, TIMING.MESSAGE_EDITOR_FOCUS_DELAY);

    return (): void => clearTimeout(timeoutId);
  }, []);

  const handleBranch = useCallback(async (): Promise<void> => {
    const trimmedContent = content.trim();
    if (!trimmedContent || isLoading) {
      return;
    }

    setActionType("branch");
    setIsLoading(true);
    try {
      await onBranch(message.id, trimmedContent);
    } catch (error) {
      logger.error("Failed to branch message", parseError(error));
      // Error is logged, no need to throw
    } finally {
      setIsLoading(false);
      setActionType(null);
    }
  }, [content, isLoading, message.id, onBranch, logger]);

  const handleKeyDown = useCallback(
    (e: TextareaKeyboardEvent): void => {
      // Enter without Shift = submit (branch)
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        void handleBranch();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
      }
      // Shift+Enter = new line (default textarea behavior, no need to handle)
    },
    [handleBranch, onCancel],
  );

  const handleCancel = useCallback(() => {
    if (!isLoading) {
      onCancel();
    }
  }, [isLoading, onCancel]);

  return {
    content,
    isLoading,
    actionType,
    editorRef,
    textareaRef,
    setContent,
    handleBranch,
    handleKeyDown,
    handleCancel,
  };
}
