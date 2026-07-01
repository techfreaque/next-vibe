"use client";

/**
 * ReplyInput Component
 * Full-featured reply input that reuses BaseMessageInput.
 * Used in flat and threaded views when a user clicks "Reply".
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { MessageSquare } from "next-vibe/ui/web/ui/icons/MessageSquare";
import type { JSX } from "react";

import { useReplyEditor } from "../hooks/use-reply-editor";
import { BaseMessageInput } from "./base-message-input";

export interface ReplyInputProps {
  parentMessageId: string;
  onReply: (
    parentMessageId: string,
    content: string,
    attachments: File[],
  ) => Promise<void>;
  onCancel: () => void;
  locale: CountryLanguage;
  logger: EndpointLogger;
  user: JwtPayloadType;
}

export function ReplyInput({
  parentMessageId,
  onReply,
  onCancel,
  locale,
  logger,
  user,
}: ReplyInputProps): JSX.Element {
  const editor = useReplyEditor({
    parentMessageId,
    onReply,
    onCancel,
    logger,
  });

  return (
    <BaseMessageInput
      content={editor.content}
      onContentChange={editor.setContent}
      attachments={editor.attachments}
      onAttachmentsChange={editor.setAttachments}
      onSubmit={editor.handleReply}
      onCancel={editor.handleCancel}
      onSubmitAudio={async () => {
        // Voice reply is future work - log and skip
        logger.warn(
          "ReplyInput",
          "Voice reply is not yet supported, skipping audio submission",
        );
      }}
      submitIcon={MessageSquare}
      submitTitleKey="widget.messageEditor.titles.reply"
      isLoading={editor.isLoading}
      hintKey="widget.messageEditor.hint.reply"
      textareaRef={editor.textareaRef}
      editorRef={editor.editorRef}
      onKeyDown={editor.handleKeyDown}
      locale={locale}
      logger={logger}
      user={user}
    />
  );
}
