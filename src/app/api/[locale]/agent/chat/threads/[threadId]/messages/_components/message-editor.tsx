"use client";

/**
 * Message Editor Component
 * Editor for branching/editing messages with voice support
 */

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Form } from "next-vibe-ui/ui/form/form";
import { GitBranch, Mic, Phone, X } from "next-vibe-ui/ui/icons";
import { Kbd } from "next-vibe-ui/ui/kbd";
import { Textarea } from "next-vibe-ui/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "next-vibe-ui/ui/tooltip";
import type { JSX } from "react";

import type { ChatMessage } from "@/app/api/[locale]/agent/chat/db";
import { useChatContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import type { ModelId } from "@/app/api/[locale]/agent/chat/model-access/models";
import { CallModeIndicator } from "@/app/api/[locale]/agent/chat/threads/_components/chat-input/call-mode-indicator";
import { FileUploadButton } from "@/app/api/[locale]/agent/chat/threads/_components/chat-input/file-upload-button";
import { useVoiceRecording } from "@/app/api/[locale]/agent/chat/threads/_components/chat-input/hooks/use-voice-recording";
import { RecordingModal } from "@/app/api/[locale]/agent/chat/threads/_components/chat-input/recording-modal";
import { Selector } from "@/app/api/[locale]/agent/chat/threads/_components/chat-input/selector";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { useCallMode } from "../../../_components/chat-input/hooks/use-call-mode";
import { useMessageEditor } from "./hooks/use-message-editor";

interface MessageEditorProps {
  message: ChatMessage;
  onBranch: (
    messageId: string,
    content: string,
    audioInput: { file: File } | undefined,
    attachments: File[] | undefined,
  ) => Promise<void>;
  onCancel: () => void;
  onModelChange?: (model: ModelId) => void;
  onCharacterChange?: (character: string) => void;
  locale: CountryLanguage;
  logger: EndpointLogger;
}

export function MessageEditor({
  message,
  onBranch,
  onCancel,
  onModelChange,
  onCharacterChange,
  locale,
  logger,
}: MessageEditorProps): JSX.Element {
  const { selectedModel, selectedCharacter, deductCredits } = useChatContext();
  const { t } = simpleT(locale);

  // Call mode state
  const { isCallMode, toggleCallMode } = useCallMode({
    modelId: selectedModel,
    characterId: selectedCharacter,
  });

  // Message editor logic
  const editor = useMessageEditor({
    message,
    onBranch,
    onCancel,
    logger,
  });

  // Voice recording state
  const voice = useVoiceRecording({
    currentValue: editor.content,
    onValueChange: editor.setContent,
    onSubmitAudio: async (file: File) => {
      await onBranch(
        message.id,
        "",
        { file },
        editor.attachments.length > 0 ? editor.attachments : undefined,
      );
    },
    deductCredits,
    logger,
    locale,
  });

  // UI state
  const showMicButton =
    !voice.isRecording && !voice.isProcessing && !editor.isLoading;
  const showTextarea = !voice.isRecording && !voice.isProcessing;

  return (
    <Div ref={editor.editorRef} className="w-full relative z-10">
      <Form
        onSubmit={editor.handleBranch}
        className={cn(
          "@container",
          "p-4 backdrop-blur",
          "border border-border rounded-lg shadow-lg",
          "w-full",
          isCallMode
            ? "bg-green-100/70 dark:bg-green-950/70 border-green-300 dark:border-green-800"
            : "bg-card",
        )}
      >
        {/* Call mode indicator */}
        <CallModeIndicator show={isCallMode} locale={locale} />

        {/* Recording modal */}
        <RecordingModal
          isRecording={voice.isRecording}
          isPaused={voice.isPaused}
          isProcessing={voice.isProcessing}
          stream={voice.stream}
          hasExistingInput={voice.hasExistingInput}
          onCancel={voice.cancelRecording}
          onTogglePause={voice.togglePause}
          onTranscribeToInput={voice.transcribeToInput}
          onSendVoice={() => void voice.submitAudioDirectly()}
          locale={locale}
        />

        {/* Textarea */}
        {showTextarea && (
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

            {/* Hint text */}
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
        )}

        {/* Controls */}
        <Div className="flex flex-row items-center gap-1 sm:gap-1.5 md:gap-2 flex-nowrap">
          {/* Left: Selector */}
          <Div className="flex flex-row items-center gap-0.5 sm:gap-1 md:gap-1.5 flex-1 min-w-0">
            {(onModelChange || onCharacterChange) && (
              <Selector
                characterId={selectedCharacter}
                modelId={selectedModel}
                onCharacterChange={onCharacterChange ?? ((): void => undefined)}
                onModelChange={onModelChange ?? ((): void => undefined)}
                locale={locale}
                logger={logger}
                buttonClassName="px-1.5 sm:px-2 md:px-3 min-h-8 h-8 sm:min-h-9 sm:h-9"
              />
            )}
          </Div>

          {/* Right: Call Mode + File + Mic + Branch/Cancel */}
          <Div className="flex flex-row items-center gap-1 sm:gap-1.5 md:gap-2 shrink-0">
            {/* Call mode toggle */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    variant={isCallMode ? "default" : "ghost"}
                    onClick={toggleCallMode}
                    className={cn(
                      "h-8 w-8 sm:h-9 sm:w-9",
                      isCallMode &&
                        "bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-500",
                    )}
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isCallMode
                    ? t("app.chat.voiceMode.callModeDescription")
                    : t("app.chat.voiceMode.callMode")}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* File upload button */}
            <FileUploadButton
              locale={locale}
              attachments={editor.attachments}
              onFilesSelected={editor.setAttachments}
              onRemoveFile={(index) =>
                editor.setAttachments((prev) =>
                  // oxlint-disable-next-line no-unused-vars
                  prev.filter((_file, i) => i !== index),
                )
              }
              disabled={editor.isLoading}
            />

            {/* Mic button */}
            {showMicButton && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => void voice.startRecording()}
                      className="h-8 w-8 sm:h-9 sm:w-9"
                    >
                      <Mic className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {t("app.chat.voiceMode.tapToRecord")}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {/* Branch button */}
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

            {/* Cancel button */}
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

        {/* Error display */}
        {voice.error && (
          <Div className="mt-2 px-2 py-1 bg-destructive/10 border border-destructive/20 rounded text-sm text-destructive">
            {voice.error}
          </Div>
        )}
      </Form>
    </Div>
  );
}
