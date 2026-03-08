"use client";

/**
 * Message Editor Component
 * Editor for branching/editing messages with voice support.
 * Thin wrapper around BaseMessageInput — keeps useMessageEditor hook for state.
 */

import { GitBranch } from "next-vibe-ui/ui/icons/GitBranch";
import type { JSX } from "react";

import type { ChatMessage } from "@/app/api/[locale]/agent/chat/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { useMessageEditor } from "../hooks/use-message-editor";
import { BaseMessageInput } from "./base-message-input";

interface MessageEditorProps {
  message: ChatMessage;
  onBranch: (
    messageId: string,
    content: string,
    audioInput: { file: File } | undefined,
    attachments: File[] | undefined,
  ) => Promise<void>;
  onCancel: () => void;
  locale: CountryLanguage;
  logger: EndpointLogger;
  user: JwtPayloadType;
}

export function MessageEditor({
  message,
  onBranch,
  onCancel,
  locale,
  logger,
  user,
}: MessageEditorProps): JSX.Element {
  const editor = useMessageEditor({
    message,
    onBranch,
    onCancel,
    logger,
  });

  return (
    <BaseMessageInput
      content={editor.content}
      onContentChange={editor.setContent}
      attachments={editor.attachments}
      onAttachmentsChange={editor.setAttachments}
      onSubmit={editor.handleBranch}
      onCancel={editor.handleCancel}
      onSubmitAudio={async (file: File) => {
        await onBranch(
          message.id,
          "",
          { file },
          editor.attachments.length > 0 ? editor.attachments : undefined,
        );
      }}
      submitIcon={GitBranch}
      submitTitleKey="widget.messageEditor.titles.branch"
      isLoading={editor.isLoading}
      hintKey="widget.messageEditor.hint.branch"
      textareaRef={editor.textareaRef}
      editorRef={editor.editorRef}
      onKeyDown={editor.handleKeyDown}
      locale={locale}
      logger={logger}
      user={user}
    />
  );
}
