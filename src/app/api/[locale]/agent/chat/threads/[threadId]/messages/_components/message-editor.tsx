"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Form } from "next-vibe-ui/ui/form/form";
import { GitBranch, X } from "next-vibe-ui/ui/icons";
import { Kbd } from "next-vibe-ui/ui/kbd";
import { Textarea } from "next-vibe-ui/ui/textarea";
import type { JSX } from "react";
import React from "react";

import type { ChatMessage } from "@/app/api/[locale]/agent/chat/db";
import { useChatContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import type { ModelId } from "@/app/api/[locale]/agent/chat/model-access/models";
import { PersonaSelector } from "@/app/api/[locale]/agent/chat/personas/_components/persona-selector";
import { ModelSelector } from "@/app/api/[locale]/agent/chat/threads/_components/chat-input/model-selector";
import { SpeechInputButton } from "@/app/api/[locale]/agent/chat/threads/_components/chat-input/speech-input-button";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { useMessageEditor } from "./hooks/use-message-editor";

interface MessageEditorProps {
  message: ChatMessage;
  onBranch: (messageId: string, content: string) => Promise<void>;
  onCancel: () => void;
  onModelChange?: (model: ModelId) => void;
  onPersonaChange?: (persona: string) => void;
  locale: CountryLanguage;
  logger: EndpointLogger;
}

export function MessageEditor({
  message,
  onBranch,
  onCancel,
  onModelChange,
  onPersonaChange,
  locale,
  logger,
}: MessageEditorProps): JSX.Element {
  // Get props from context instead of prop drilling
  const { selectedModel, selectedPersona } = useChatContext();

  const { t } = simpleT(locale);

  // Use custom hook for editor logic
  const editor = useMessageEditor({
    message,
    onBranch,
    onCancel,
    logger,
  });

  return (
    <Div ref={editor.editorRef} className="w-full">
      <Form
        onSubmit={editor.handleBranch}
        className={cn(
          "p-4 bg-card backdrop-blur",
          "border border-border rounded-lg shadow-lg",
          "w-full",
        )}
      >
        {/* Textarea */}
        <Div className="relative mb-3">
          <Textarea
            ref={editor.textareaRef}
            value={editor.content}
            onChange={(e): void => editor.setContent(e.target.value)}
            onKeyDown={editor.handleKeyDown}
            placeholder=""
            disabled={editor.isLoading}
            className="px-0 text-base"
            variant="ghost"
            rows={3}
          />

          {/* Hint Text - Shows when textarea is empty - Hidden on mobile */}
          {!editor.content && (
            <Div className="absolute top-2 left-0 pointer-events-none text-sm text-muted-foreground hidden sm:block">
              {t("app.chat.input.keyboardShortcuts.press")}{" "}
              <Kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">
                {t("app.chat.input.keyboardShortcuts.enter")}
              </Kbd>{" "}
              {t("app.chat.messageEditor.hint.branch")},{" "}
              <Kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">
                {t("app.chat.input.keyboardShortcuts.shiftEnter")}
              </Kbd>{" "}
              {t("app.chat.input.keyboardShortcuts.forNewLine")}
            </Div>
          )}
        </Div>

        {/* Controls - ALL IN ONE LINE */}
        <Div className="flex flex-row items-center gap-1 sm:gap-1.5 md:gap-2 flex-nowrap">
          {/* Left side: Model & Persona Selectors */}
          <Div className="flex flex-row items-center gap-0.5 sm:gap-1 md:gap-1.5 flex-1 min-w-0">
            {onModelChange && (
              <ModelSelector
                value={selectedModel}
                onChange={onModelChange}
                locale={locale}
                logger={logger}
                buttonClassName="px-1.5 sm:px-2 md:px-3 min-h-8 h-8 sm:min-h-9 sm:h-9"
                showTextAt="sm"
              />
            )}
            {onPersonaChange && (
              <PersonaSelector
                value={selectedPersona}
                onChange={onPersonaChange}
                locale={locale}
                logger={logger}
                buttonClassName="px-1.5 sm:px-2 md:px-3 min-h-8 h-8 sm:min-h-9 sm:h-9"
                showTextAt="md"
              />
            )}
          </Div>

          {/* Right side: Speech Input & Branch/Cancel Buttons */}
          <Div className="flex flex-row items-center gap-1 sm:gap-1.5 md:gap-2 shrink-0">
            {/* Speech Input Button */}
            <SpeechInputButton
              onTranscript={(text): void => {
                // Append transcript to existing content
                const newContent = editor.content
                  ? `${editor.content} ${text}`.trim()
                  : text;
                editor.setContent(newContent);
              }}
              disabled={editor.isLoading}
              locale={locale}
              logger={logger}
            />

            {/* Branch Button - Now the primary action */}
            <Button
              type="submit"
              disabled={!editor.content.trim() || editor.isLoading}
              size="icon"
              variant="default"
              className="h-8 w-8 sm:h-9 sm:w-9 shrink-0"
              title={t("app.chat.messageEditor.titles.branch")}
            >
              <GitBranch className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>

            {/* Cancel Button */}
            <Button
              type="button"
              onClick={editor.handleCancel}
              disabled={editor.isLoading}
              size="icon"
              variant="destructive"
              className="h-8 w-8 sm:h-9 sm:w-9 shrink-0"
              title={t("app.chat.messageEditor.titles.cancel")}
            >
              <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          </Div>
        </Div>
      </Form>
    </Div>
  );
}
