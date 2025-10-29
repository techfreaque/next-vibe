/**
 * Custom hook for message editor logic
 * Handles content state, loading state, and action handlers
 */

import { useCallback, useEffect, useRef, useState } from "react";

import { parseError } from "@/app/api/[locale]/v1/core/shared/utils/parse-error";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";

import { TIMING } from "../../lib/config/constants";
import type { ChatMessage } from "../../types";

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
  editorRef: React.RefObject<HTMLDivElement | null>;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;

  // Handlers
  setContent: (content: string) => void;
  handleBranch: () => Promise<void>;
  handleKeyDown: (e: React.KeyboardEvent) => void;
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
  const editorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
      textareaRef.current?.focus();
      // Select all text for easy editing
      textareaRef.current?.select();
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
    (e: React.KeyboardEvent): void => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        void handleBranch();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
      }
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
