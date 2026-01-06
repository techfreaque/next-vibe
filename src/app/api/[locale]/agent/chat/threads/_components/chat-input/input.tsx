"use client";

/**
 * Chat Input Component
 * Main input area for sending messages with voice support
 */

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Form } from "next-vibe-ui/ui/form/form";
import { Mic, Phone, Send, Square } from "next-vibe-ui/ui/icons";
import { Kbd } from "next-vibe-ui/ui/kbd";
import { Textarea } from "next-vibe-ui/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "next-vibe-ui/ui/tooltip";
import type { JSX } from "react";

import { TOUR_DATA_ATTRS } from "@/app/api/[locale]/agent/chat/_components/welcome-tour/tour-config";
import { useChatContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import { useChatPermissions } from "@/app/api/[locale]/agent/chat/hooks/use-chat-permissions";
import { useVoiceRuntimeState } from "@/app/api/[locale]/agent/chat/voice-mode/store";
import { getModelById } from "@/app/api/[locale]/agent/models/models";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { CallModeIndicator } from "./call-mode-indicator";
import { FileUploadButton } from "./file-upload-button";
import { useCallMode } from "./hooks/use-call-mode";
import { useVoiceRecording } from "./hooks/use-voice-recording";
import { RecordingModal } from "./recording-modal";
import { SearchToggle } from "./search-toggle";
import { Selector } from "./selector";
import { ToolsButton } from "./tools-button";

interface ChatInputProps {
  locale: CountryLanguage;
  logger: EndpointLogger;
  user: JwtPayloadType;
  className?: string;
}

export function ChatInput({ locale, logger, user, className }: ChatInputProps): JSX.Element {
  const chat = useChatContext();
  const {
    input,
    setInput,
    attachments,
    setAttachments,
    handleSubmit,
    submitWithContent,
    submitWithAudio,
    handleKeyDown,
    isLoading,
    stopGeneration,
    inputRef,
    selectedCharacter,
    selectedModel,
    handleModelChange,
    setSelectedCharacter,
    deductCredits,
  } = chat;

  const { canPost, noPermissionReason } = useChatPermissions(chat, locale);
  const { t } = simpleT(locale);
  const voiceRuntime = useVoiceRuntimeState();

  const currentModel = getModelById(selectedModel);
  const modelSupportsTools = currentModel?.supportsTools ?? false;
  const isInputDisabled = isLoading || !canPost;

  // Show stop button when streaming OR when TTS is playing
  const showStopButton = isLoading || voiceRuntime.isSpeaking;

  // Call mode state
  const { isCallMode, toggleCallMode } = useCallMode({
    modelId: selectedModel,
    characterId: selectedCharacter,
  });

  // Voice recording state
  const voice = useVoiceRecording({
    currentValue: input,
    onValueChange: setInput,
    onSubmitText: submitWithContent,
    onSubmitAudio: submitWithAudio,
    deductCredits,
    logger,
    locale,
  });

  // UI state
  const showMicButton = !voice.isRecording && !voice.isProcessing && !showStopButton;
  const showTextarea = !voice.isRecording && !voice.isProcessing;

  return (
    <Form
      onSubmit={handleSubmit}
      className={cn(
        "@container",
        "p-2 @sm:p-3 @md:p-4 backdrop-blur",
        "border border-border rounded-t-lg",
        isCallMode
          ? "bg-green-100/70 dark:bg-green-950/70 border-green-300 dark:border-green-800"
          : "bg-blue-200/70 dark:bg-blue-950/70",
        className,
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

      {/* Input area */}
      {showTextarea && (
        <Div className="relative mb-2 @sm:mb-3" data-tour={TOUR_DATA_ATTRS.CHAT_INPUT}>
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={(e) => {
              // Handle image paste from clipboard
              const items = e.clipboardData?.items;
              if (!items) {
                return;
              }

              for (const item of items) {
                if (item.type.startsWith("image/")) {
                  e.preventDefault();
                  const file = item.getAsFile();
                  if (file) {
                    setAttachments((prev) => [...prev, file]);
                    logger.debug("Image pasted from clipboard", {
                      filename: file.name,
                      type: file.type,
                      size: file.size,
                    });
                  }
                  break;
                }
              }
            }}
            disabled={isInputDisabled}
            placeholder=""
            className="px-0 text-base pl-3"
            variant="ghost"
            rows={2}
            title={canPost ? undefined : noPermissionReason}
          />

          {/* Hint text */}
          {!input && canPost && (
            <Div className="absolute pl-3 top-2 left-0 pointer-events-none text-sm text-muted-foreground hidden @sm:block">
              {t("app.chat.input.keyboardShortcuts.press")}{" "}
              <Kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">
                {t("app.chat.input.keyboardShortcuts.enter")}
              </Kbd>{" "}
              {t("app.chat.input.keyboardShortcuts.toSend")},{" "}
              <Kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">
                {t("app.chat.input.keyboardShortcuts.shiftEnter")}
              </Kbd>{" "}
              {t("app.chat.input.keyboardShortcuts.forNewLine")}
            </Div>
          )}

          {/* No permission message */}
          {!canPost && (
            <Div className="absolute pl-3 top-2 left-0 pointer-events-none text-sm text-destructive">
              {noPermissionReason || t("app.chat.input.noPermission")}
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
            onCharacterChange={setSelectedCharacter}
            onModelChange={handleModelChange}
            locale={locale}
            user={user}
            logger={logger}
            buttonClassName="px-1.5 @sm:px-2 @md:px-3 min-h-8 h-8 @sm:min-h-9 @sm:h-9"
          />

          {modelSupportsTools && (
            <>
              <SearchToggle disabled={isLoading} locale={locale} />
              <ToolsButton disabled={isLoading} locale={locale} />
            </>
          )}

          <FileUploadButton
            disabled={isInputDisabled}
            locale={locale}
            attachments={attachments}
            onFilesSelected={setAttachments}
            onRemoveFile={(index) => {
              setAttachments((prev) => {
                const updated = [...prev];
                updated.splice(index, 1);
                return updated;
              });
            }}
          />
        </Div>

        {/* Right: Call Mode + Mic + Send/Stop */}
        <Div className="flex flex-row items-center gap-1 shrink-0">
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
                    "h-8 w-8 @sm:h-9 @sm:w-9",
                    isCallMode &&
                      "bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-500",
                  )}
                  data-tour={TOUR_DATA_ATTRS.CALL_MODE_BUTTON}
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

          {/* Mic button */}
          {showMicButton && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    disabled={!canPost}
                    onClick={() => void voice.startRecording()}
                    className="h-8 w-8 @sm:h-9 @sm:w-9"
                    data-tour={TOUR_DATA_ATTRS.SPEECH_INPUT}
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t("app.chat.voiceMode.tapToRecord")}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* Send / Stop button */}
          {showStopButton ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    onClick={stopGeneration}
                    className="h-8 w-8 @sm:h-9 @sm:w-9"
                  >
                    <Square className="h-3.5 w-3.5 fill-current" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t("app.chat.actions.stopGeneration")}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="submit"
                    size="icon"
                    variant="default"
                    disabled={!canPost || !input.trim()}
                    className="h-8 w-8 @sm:h-9 @sm:w-9"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t("app.chat.actions.sendMessage")}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </Div>
      </Div>

      {/* Error display */}
      {voice.error && (
        <Div className="mt-2 px-2 py-1 bg-destructive/10 border border-destructive/20 rounded text-sm text-destructive">
          {voice.error}
        </Div>
      )}
    </Form>
  );
}
