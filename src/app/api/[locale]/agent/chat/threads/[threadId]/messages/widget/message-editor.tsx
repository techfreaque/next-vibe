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
import { useCallback, useState } from "react";

import { CallModeIndicator } from "@/app/api/[locale]/agent/ai-stream/stream/hooks/call-mode-indicator";
import { FileUploadButton } from "@/app/api/[locale]/agent/ai-stream/stream/hooks/file-upload-button";
import { RecordingInputArea } from "@/app/api/[locale]/agent/ai-stream/stream/hooks/recording-input-area";
import { useVoiceRecording } from "@/app/api/[locale]/agent/ai-stream/stream/hooks/use-voice-recording";
import { Selector } from "@/app/api/[locale]/agent/ai-stream/stream/widget/selector";
import { ToolsButton } from "@/app/api/[locale]/agent/ai-stream/stream/widget/tools-button";
import type { ChatMessage } from "@/app/api/[locale]/agent/chat/db";
import { useChatBootContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import { useChatSettings } from "@/app/api/[locale]/agent/chat/settings/hooks";
import { ChatSettingsRepositoryClient } from "@/app/api/[locale]/agent/chat/settings/repository-client";
import { getModelById } from "@/app/api/[locale]/agent/models/models";
import { useCredits } from "@/app/api/[locale]/credits/hooks";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { useMessageEditor } from "../hooks/use-message-editor";
import { scopedTranslation } from "../i18n";

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
  const { initialCredits, initialSettingsData } = useChatBootContext();
  const creditsHook = useCredits(user, logger, initialCredits);
  const noopDeduct = useCallback(
    // No-op fallback when credits hook is unavailable
    () => undefined as void,
    [],
  );
  const deductCredits = creditsHook?.deductCredits ?? noopDeduct;

  // Get settings directly (no context dependency for model/character)
  const { settings, setTTSAutoplay } = useChatSettings(
    user,
    logger,
    initialSettingsData,
  );
  const defaults = ChatSettingsRepositoryClient.getDefaults();
  const selectedModel = settings?.selectedModel ?? defaults.selectedModel;
  const selectedCharacter =
    settings?.selectedCharacter ?? defaults.selectedCharacter;
  const ttsAutoplay = settings?.ttsAutoplay ?? defaults.ttsAutoplay;

  const { t } = scopedTranslation.scopedT(locale);

  // Local state for selector popover to avoid conflict with chat input selector
  const [selectorOpen, setSelectorOpen] = useState(false);

  // Check if current model supports tools
  const currentModel = getModelById(selectedModel);
  const modelSupportsTools = currentModel?.supportsTools ?? false;

  // Message editor logic
  const editor = useMessageEditor({
    message,
    onBranch,
    onCancel,
    logger,
  });

  // Voice recording state
  const voice = useVoiceRecording({
    user,
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
    <Div ref={editor.editorRef} className="w-full relative z-10 bg-background">
      <Form
        onSubmit={editor.handleBranch}
        className={cn(
          "@container",
          "p-2 @sm:p-3 @md:p-4",
          "border border-border rounded-lg shadow-lg",
          "w-full",
          ttsAutoplay
            ? "bg-green-100/70 dark:bg-green-950/70 border-green-300 dark:border-green-800"
            : "",
        )}
      >
        {/* Call mode indicator */}
        <CallModeIndicator show={ttsAutoplay} locale={locale} />

        {/* Recording modal */}
        <RecordingInputArea
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
          <Div className="relative mb-2 @sm:mb-3">
            <Textarea
              ref={editor.textareaRef}
              value={editor.content}
              onChange={(e): void => editor.setContent(e.target.value)}
              onKeyDown={editor.handleKeyDown}
              placeholder=""
              disabled={editor.isLoading}
              className="px-0 text-base pl-3"
              variant="ghost"
              rows={3}
            />

            {/* Hint text */}
            {!editor.content && (
              <Div className="absolute pl-3 top-2 left-0 pointer-events-none text-sm text-muted-foreground hidden @sm:block">
                {t("widget.input.keyboardShortcuts.press")}{" "}
                <Kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">
                  {t("widget.input.keyboardShortcuts.enter")}
                </Kbd>{" "}
                {t("widget.messageEditor.hint.branch")},{" "}
                <Kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">
                  {t("widget.input.keyboardShortcuts.shiftEnter")}
                </Kbd>{" "}
                {t("widget.input.keyboardShortcuts.forNewLine")}
              </Div>
            )}
          </Div>
        )}

        {/* Controls */}
        <Div className="flex flex-row items-center gap-1 @sm:gap-1.5 @md:gap-2 flex-nowrap">
          {/* Left: Selector + Tools + File Upload */}
          <Div className="flex flex-row items-center gap-0.5 @sm:gap-1 @md:gap-1.5 flex-1 min-w-0">
            <Selector
              characterId={selectedCharacter}
              modelId={selectedModel}
              locale={locale}
              buttonClassName="px-1.5 @sm:px-2 @md:px-3 min-h-8 h-8 @sm:min-h-9 @sm:h-9"
              open={selectorOpen}
              onOpenChange={setSelectorOpen}
            />

            {modelSupportsTools && (
              <ToolsButton disabled={editor.isLoading} locale={locale} />
            )}

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
          </Div>

          {/* Right: Call Mode + Mic + Branch/Cancel */}
          <Div className="flex flex-row items-center gap-0.5 shrink-0">
            {/* Call mode toggle */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    variant={ttsAutoplay ? "default" : "ghost"}
                    onClick={() => setTTSAutoplay(!ttsAutoplay)}
                    className={cn(
                      "h-8 w-8 @sm:h-9 @sm:w-9",
                      ttsAutoplay &&
                        "bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-500",
                    )}
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {ttsAutoplay
                    ? t("widget.voiceMode.callModeDescription")
                    : t("widget.voiceMode.callMode")}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

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
                      className="h-8 w-8 @sm:h-9 @sm:w-9"
                    >
                      <Mic className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {t("widget.voiceMode.tapToRecord")}
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
              className="h-8 w-8 @sm:h-9 @sm:w-9 shrink-0"
              title={t("widget.messageEditor.titles.branch")}
            >
              <GitBranch className="h-3.5 w-3.5 @sm:h-4 @sm:w-4" />
            </Button>

            {/* Cancel button */}
            <Button
              type="button"
              onClick={editor.handleCancel}
              disabled={editor.isLoading}
              size="icon"
              variant="destructive"
              className="h-8 w-8 @sm:h-9 @sm:w-9 shrink-0"
              title={t("widget.messageEditor.titles.cancel")}
            >
              <X className="h-3.5 w-3.5 @sm:h-4 @sm:w-4" />
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
