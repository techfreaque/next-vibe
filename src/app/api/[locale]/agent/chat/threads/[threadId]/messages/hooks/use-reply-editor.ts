/**
 * Custom hook for reply editor logic
 * Similar to useMessageEditor but starts empty and uses parentMessageId as draft key
 */

import { parseError } from "next-vibe/shared/utils/parse-error";
import type { DivRefObject } from "next-vibe-ui/ui/div";
import type {
  TextareaKeyboardEvent,
  TextareaRefObject,
} from "next-vibe-ui/ui/textarea";
import { useCallback, useEffect, useRef, useState } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

export interface UseReplyEditorOptions {
  parentMessageId: string;
  onReply: (
    parentMessageId: string,
    content: string,
    attachments: File[],
  ) => Promise<void>;
  onCancel: () => void;
  logger: EndpointLogger;
}

export interface UseReplyEditorReturn {
  // State
  content: string;
  attachments: File[];
  isLoading: boolean;

  // Refs
  editorRef: React.RefObject<DivRefObject | null>;
  textareaRef: React.RefObject<TextareaRefObject | null>;

  // Handlers
  setContent: (content: string) => void;
  setAttachments: (attachments: File[] | ((prev: File[]) => File[])) => void;
  handleReply: () => Promise<void>;
  handleKeyDown: (e: TextareaKeyboardEvent) => void;
  handleCancel: () => void;
}

/** Delay for reply editor focus (ms) */
const REPLY_EDITOR_FOCUS_DELAY = 100;

/**
 * Hook for managing reply editor state and actions
 */
export function useReplyEditor({
  parentMessageId,
  onReply,
  onCancel,
  logger,
}: UseReplyEditorOptions): UseReplyEditorReturn {
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const editorRef = useRef<DivRefObject>(null);
  const textareaRef = useRef<TextareaRefObject>(null);

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
      }
    }, REPLY_EDITOR_FOCUS_DELAY);

    return (): void => clearTimeout(timeoutId);
  }, []);

  const handleReply = useCallback(async (): Promise<void> => {
    const trimmedContent = content.trim();
    if (!trimmedContent || isLoading) {
      return;
    }

    setIsLoading(true);
    try {
      await onReply(parentMessageId, trimmedContent, attachments);
      setContent("");
      setAttachments([]);
    } catch (error) {
      logger.error("Failed to send reply", parseError(error));
    } finally {
      setIsLoading(false);
    }
  }, [content, attachments, isLoading, parentMessageId, onReply, logger]);

  const handleKeyDown = useCallback(
    (e: TextareaKeyboardEvent): void => {
      // Enter without Shift = submit (reply)
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        void handleReply();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
      }
      // Shift+Enter = new line (default textarea behavior, no need to handle)
    },
    [handleReply, onCancel],
  );

  const handleCancel = useCallback(() => {
    if (!isLoading) {
      onCancel();
    }
  }, [isLoading, onCancel]);

  return {
    content,
    attachments,
    isLoading,
    editorRef,
    textareaRef,
    setContent,
    setAttachments,
    handleReply,
    handleKeyDown,
    handleCancel,
  };
}
