/**
 * Custom hook for message editor logic
 * Handles content state, loading state, and action handlers
 */

import { useState, useEffect, useCallback, useRef } from "react";
import type { ChatMessage } from "../../lib/storage/types";

export type EditorActionType = "overwrite" | "branch" | null;

export interface UseMessageEditorOptions {
  message: ChatMessage;
  onSave: (messageId: string, content: string) => Promise<void>;
  onBranch?: (messageId: string, content: string) => Promise<void>;
  onCancel: () => void;
}

export interface UseMessageEditorReturn {
  // State
  content: string;
  isLoading: boolean;
  actionType: EditorActionType;
  
  // Refs
  editorRef: React.RefObject<HTMLDivElement>;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  
  // Handlers
  setContent: (content: string) => void;
  handleOverwrite: () => Promise<void>;
  handleBranch: () => Promise<void>;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  handleCancel: () => void;
}

/**
 * Hook for managing message editor state and actions
 */
export function useMessageEditor({
  message,
  onSave,
  onBranch,
  onCancel,
}: UseMessageEditorOptions): UseMessageEditorReturn {
  const [content, setContent] = useState(message.content);
  const [isLoading, setIsLoading] = useState(false);
  const [actionType, setActionType] = useState<EditorActionType>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize content when message changes
  useEffect(() => {
    setContent(message.content);
  }, [message.id]);

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
    }, 100);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleOverwrite = useCallback(async (): Promise<void> => {
    const trimmedContent = content.trim();
    if (!trimmedContent || isLoading) {
      return;
    }

    setActionType("overwrite");
    setIsLoading(true);
    try {
      await onSave(message.id, trimmedContent);
    } catch (error) {
      console.error("Failed to overwrite message:", error);
      // Don't clear loading state on error so user can retry
      throw error;
    } finally {
      setIsLoading(false);
      setActionType(null);
    }
  }, [content, isLoading, message.id, onSave]);

  const handleBranch = useCallback(async (): Promise<void> => {
    const trimmedContent = content.trim();
    if (!trimmedContent || isLoading || !onBranch) {
      return;
    }

    setActionType("branch");
    setIsLoading(true);
    try {
      await onBranch(message.id, trimmedContent);
    } catch (error) {
      console.error("Failed to branch message:", error);
      throw error;
    } finally {
      setIsLoading(false);
      setActionType(null);
    }
  }, [content, isLoading, message.id, onBranch]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent): void => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      void handleOverwrite();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onCancel();
    }
  }, [handleOverwrite, onCancel]);

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
    handleOverwrite,
    handleBranch,
    handleKeyDown,
    handleCancel,
  };
}

