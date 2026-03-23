"use client";

/**
 * BaseMessageInput Component
 * Shared UI for message editing/branching and replying.
 * Receives all computed state as props - hooks are self-contained here.
 */

import { Button } from "next-vibe-ui/ui/button";
import type { DivRefObject } from "next-vibe-ui/ui/div";
import { Div } from "next-vibe-ui/ui/div";
import { Form } from "next-vibe-ui/ui/form/form";
import { Mic } from "next-vibe-ui/ui/icons/Mic";
import { Phone } from "next-vibe-ui/ui/icons/Phone";
import { X } from "next-vibe-ui/ui/icons/X";
import { Kbd } from "next-vibe-ui/ui/kbd";
import type {
  TextareaKeyboardEvent,
  TextareaRefObject,
} from "next-vibe-ui/ui/textarea";
import { Textarea } from "next-vibe-ui/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "next-vibe-ui/ui/tooltip";
import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";
import React, { useCallback, useState } from "react";

import { CallModeIndicator } from "@/app/api/[locale]/agent/ai-stream/stream/hooks/call-mode-indicator";
import { FileUploadButton } from "@/app/api/[locale]/agent/ai-stream/stream/hooks/file-upload-button";
import { RecordingInputArea } from "@/app/api/[locale]/agent/ai-stream/stream/hooks/recording-input-area";
import { useVoiceRecording } from "@/app/api/[locale]/agent/ai-stream/stream/hooks/use-voice-recording";
import { Selector } from "@/app/api/[locale]/agent/ai-stream/stream/widget/selector";
import { ToolsButton } from "@/app/api/[locale]/agent/ai-stream/stream/widget/tools-button";
import { useChatBootContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import { useChatSettings } from "@/app/api/[locale]/agent/chat/settings/hooks";
import { ChatSettingsRepositoryClient } from "@/app/api/[locale]/agent/chat/settings/repository-client";
import { getModelById } from "@/app/api/[locale]/agent/models/models";
import { useCredits } from "@/app/api/[locale]/credits/hooks";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation } from "../i18n";

export interface BaseMessageInputProps {
  // Content state
  content: string;
  onContentChange: (value: string) => void;
  attachments: File[];
  onAttachmentsChange: (
    attachments: File[] | ((prev: File[]) => File[]),
  ) => void;
  // Callbacks
  onSubmit: () => Promise<void>;
  onCancel: () => void;
  onSubmitAudio: (file: File) => Promise<void>;
  // Submit button
  submitIcon: React.ComponentType<{ className?: string }>;
  submitTitleKey: string;
  submitDisabled?: boolean;
  // State
  isLoading: boolean;
  // Textarea
  hintKey: string;
  textareaRef: React.RefObject<TextareaRefObject | null>;
  editorRef: React.RefObject<DivRefObject | null>;
  onKeyDown: (e: TextareaKeyboardEvent) => void;
  // Context
  locale: CountryLanguage;
  logger: EndpointLogger;
  user: JwtPayloadType;
}

export function BaseMessageInput({
  content,
  onContentChange,
  attachments,
  onAttachmentsChange,
  onSubmit,
  onCancel,
  onSubmitAudio,
  submitIcon: SubmitIcon,
  submitTitleKey,
  submitDisabled = false,
  isLoading,
  hintKey,
  textareaRef,
  editorRef,
  onKeyDown,
  locale,
  logger,
  user,
}: BaseMessageInputProps): JSX.Element {
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
  const selectedSkill = settings?.selectedSkill ?? defaults.selectedSkill;
  const ttsAutoplay = settings?.ttsAutoplay ?? defaults.ttsAutoplay;

  const { t } = scopedTranslation.scopedT(locale);

  // Local state for selector popover to avoid conflict with chat input selector
  const [selectorOpen, setSelectorOpen] = useState(false);

  // Check if current model supports tools
  const currentModel = getModelById(selectedModel);
  const modelSupportsTools = currentModel?.supportsTools ?? false;

  // Voice recording state
  const voice = useVoiceRecording({
    user,
    currentValue: content,
    onValueChange: onContentChange,
    onSubmitAudio,
    deductCredits,
    logger,
    locale,
  });

  // UI state
  const showMicButton = !voice.isRecording && !voice.isProcessing && !isLoading;
  const showTextarea = !voice.isRecording && !voice.isProcessing;

  return (
    <Div ref={editorRef} className="w-full relative z-10 bg-background">
      <Form
        onSubmit={onSubmit}
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
              ref={textareaRef}
              value={content}
              onChange={(e): void => onContentChange(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder=""
              disabled={isLoading}
              className="px-0 text-base pl-3"
              variant="ghost"
              rows={3}
            />

            {/* Hint text */}
            {!content && (
              <Div className="absolute pl-3 top-2 left-0 pointer-events-none text-sm text-muted-foreground hidden @sm:block">
                {t("widget.input.keyboardShortcuts.press")}{" "}
                <Kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">
                  {t("widget.input.keyboardShortcuts.enter")}
                </Kbd>{" "}
                {t(hintKey as Parameters<typeof t>[0])},{" "}
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
              skillId={selectedSkill}
              modelId={selectedModel}
              locale={locale}
              buttonClassName="px-1.5 @sm:px-2 @md:px-3 min-h-8 h-8 @sm:min-h-9 @sm:h-9"
              open={selectorOpen}
              onOpenChange={setSelectorOpen}
            />

            {modelSupportsTools && (
              <ToolsButton disabled={isLoading} locale={locale} />
            )}

            <FileUploadButton
              locale={locale}
              attachments={attachments}
              onFilesSelected={onAttachmentsChange}
              onRemoveFile={(index) =>
                onAttachmentsChange((prev) =>
                  // oxlint-disable-next-line no-unused-vars
                  prev.filter((_file, i) => i !== index),
                )
              }
              disabled={isLoading}
            />
          </Div>

          {/* Right: Call Mode + Mic + Submit/Cancel */}
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

            {/* Submit button */}
            <Button
              type="submit"
              disabled={!content.trim() || isLoading || submitDisabled}
              size="icon"
              variant="default"
              className="h-8 w-8 @sm:h-9 @sm:w-9 shrink-0"
              title={t(submitTitleKey as Parameters<typeof t>[0])}
            >
              <SubmitIcon className="h-3.5 w-3.5 @sm:h-4 @sm:w-4" />
            </Button>

            {/* Cancel button */}
            <Button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
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
