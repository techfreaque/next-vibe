"use client";

/**
 * ReplyInput Component
 * Full-featured reply input that reuses BaseMessageInput.
 * Used in flat and threaded views when a user clicks "Reply".
 */

import { MessageSquare } from "next-vibe-ui/ui/icons/MessageSquare";
import type { JSX } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

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
        // Voice reply is future work — log and skip
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
