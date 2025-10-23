"use client";

import { GitBranch, X } from "lucide-react";
import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";
import React from "react";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { CountryLanguage } from "@/i18n/core/config";
import { getLocaleString } from "@/i18n/core/localization-utils";
import { simpleT } from "@/i18n/core/shared";
import { Button, Textarea } from "next-vibe-ui/ui";

import type { ChatMessage, ModelId } from "../../../types";
import { ModelSelector } from "../../input/model-selector";
import { PersonaSelector } from "../../input/persona-selector";
import { SpeechInputButton } from "../../input/speech-input-button";
import { useMessageEditor } from "../use-message-editor";

interface MessageEditorProps {
  message: ChatMessage;
  selectedModel: ModelId;
  selectedPersona: string;
  onBranch: (messageId: string, content: string) => Promise<void>;
  onCancel: () => void;
  onModelChange?: (model: ModelId) => void;
  onPersonaChange?: (persona: string) => void;
  locale: CountryLanguage;
  logger: EndpointLogger;
}

export function MessageEditor({
  message,
  selectedModel,
  selectedPersona,
  onBranch,
  onCancel,
  onModelChange,
  onPersonaChange,
  locale,
  logger,
}: MessageEditorProps): JSX.Element {
  const speechLang = getLocaleString(locale);
  const { t } = simpleT(locale);

  // Use custom hook for editor logic
  const editor = useMessageEditor({
    message,
    onBranch,
    onCancel,
    logger,
  });

  return (
    <div ref={editor.editorRef} className="w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void editor.handleBranch();
        }}
        className={cn(
          "p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          "border border-border rounded-lg shadow-lg",
          "w-full",
        )}
      >
        {/* Textarea */}
        <div className="relative mb-3">
          <Textarea
            ref={editor.textareaRef}
            value={editor.content}
            onChange={(e): void => editor.setContent(e.target.value)}
            onKeyDown={editor.handleKeyDown}
            placeholder={t("app.chat.messageEditor.placeholder")}
            disabled={editor.isLoading}
            className="px-0"
            variant="ghost"
            rows={3}
          />

          {/* Hint Text - Shows when textarea is empty */}
          {!editor.content && (
            <div className="absolute top-2 left-0 pointer-events-none text-sm text-muted-foreground">
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">
                ⌘/Ctrl+Enter
              </kbd>{" "}
              {t("app.chat.messageEditor.hint.branch")}{" "}
              {/* eslint-disable-next-line i18next/no-literal-string -- Keyboard shortcuts are technical UI elements */}
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Esc</kbd>{" "}
              {t("app.chat.messageEditor.hint.cancel")}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-2">
          {/* Model and Tone Selectors */}
          <div className="flex items-center gap-2 flex-wrap">
            {onModelChange && (
              <ModelSelector
                value={selectedModel}
                onChange={onModelChange}
                locale={locale}
                logger={logger}
              />
            )}
            {onPersonaChange && (
              <PersonaSelector
                value={selectedPersona}
                onChange={onPersonaChange}
                locale={locale}
                logger={logger}
              />
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
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
              lang={speechLang}
              locale={locale}
              logger={logger}
            />

            {/* Branch Button - Now the primary action */}
            <Button
              type="submit"
              disabled={!editor.content.trim() || editor.isLoading}
              size="sm"
              variant="default"
              className="flex-1 sm:flex-none h-9"
              title={t("app.chat.messageEditor.titles.branch")}
            >
              <GitBranch className="h-3.5 w-3.5 mr-2" />
              {editor.isLoading && editor.actionType === "branch"
                ? t("app.chat.messageEditor.buttons.branching")
                : t("app.chat.messageEditor.buttons.branch")}
            </Button>

            {/* Cancel Button */}
            <Button
              type="button"
              onClick={editor.handleCancel}
              disabled={editor.isLoading}
              size="sm"
              variant="ghost"
              className="flex-shrink-0 h-9"
              title={t("app.chat.messageEditor.titles.cancel")}
            >
              <X className="h-3.5 w-3.5 mr-2" />
              {t("app.chat.messageEditor.buttons.cancel")}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
