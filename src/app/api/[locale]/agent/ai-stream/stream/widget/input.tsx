"use client";

/**
 * Chat Input Component
 * Main input area for sending messages with voice support
 */

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Form } from "next-vibe-ui/ui/form/form";
import { Mic } from "next-vibe-ui/ui/icons/Mic";
import { Phone } from "next-vibe-ui/ui/icons/Phone";
import { Send } from "next-vibe-ui/ui/icons/Send";
import { Square } from "next-vibe-ui/ui/icons/Square";
import { Kbd } from "next-vibe-ui/ui/kbd";
import { Span } from "next-vibe-ui/ui/span";
import { Textarea } from "next-vibe-ui/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "next-vibe-ui/ui/tooltip";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import { useCallback, useEffect, useMemo, useRef } from "react";

import { TOUR_DATA_ATTRS } from "@/app/[locale]/threads/[...path]/_components/welcome-tour/tour-config";
import { useChatInputStore } from "@/app/api/[locale]/agent/ai-stream/stream/hooks/input-store";
import { useAIStream } from "@/app/api/[locale]/agent/ai-stream/stream/hooks/use-ai-stream";
import { AGENT_MESSAGE_LENGTH } from "@/app/api/[locale]/agent/chat/constants";
import { useChatBootContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import { useChatStore } from "@/app/api/[locale]/agent/chat/hooks/store";
import { useChatNavigationStore } from "@/app/api/[locale]/agent/chat/hooks/use-chat-navigation-store";
import { useChatSettings } from "@/app/api/[locale]/agent/chat/settings/hooks";
import { ChatSettingsRepositoryClient } from "@/app/api/[locale]/agent/chat/settings/repository-client";
import { useMessageOperations } from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/hooks/use-operations";
import { getModelById } from "@/app/api/[locale]/agent/models/models";
import { useCredits } from "@/app/api/[locale]/credits/hooks";
import {
  useWidgetLocale,
  useWidgetLogger,
  useWidgetUser,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { simpleT } from "@/i18n/core/shared";

import { CallModeIndicator } from "../hooks/call-mode-indicator";
import { FileUploadButton } from "../hooks/file-upload-button";
import { RecordingInputArea } from "../hooks/recording-input-area";
import {
  getDraftKey,
  loadDraft,
  loadDraftAttachments,
  saveDraft,
  saveDraftAttachments,
} from "../hooks/use-input-autosave";
import { useVoiceRecording } from "../hooks/use-voice-recording";
import { useVoiceRuntimeState } from "../hooks/voice-mode/store";
import { Selector } from "./selector";
import { ToolsButton } from "./tools-button";
import { useInputHandlers } from "./use-input-handlers";

interface ChatInputProps {
  className?: string;
}

export function ChatInput({ className }: ChatInputProps): JSX.Element {
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const locale = useWidgetLocale();

  // Boot context
  const bootContext = useChatBootContext();
  const { envAvailability, initialSettingsData, initialCharacterData } =
    bootContext;

  // Input store
  const input = useChatInputStore((s) => s.input);
  const rawSetInput = useChatInputStore((s) => s.setInput);
  const attachments = useChatInputStore((s) => s.attachments);
  const rawSetAttachments = useChatInputStore((s) => s.setAttachments);
  const inputRef = useChatInputStore((s) => s.inputRef);

  // Navigation state
  const activeThreadId = useChatNavigationStore((s) => s.activeThreadId);
  const currentRootFolderId = useChatNavigationStore(
    (s) => s.currentRootFolderId,
  );
  const currentSubFolderId = useChatNavigationStore(
    (s) => s.currentSubFolderId,
  );

  // Chat store
  const isLoading = useChatStore((s) => s.isLoading);
  const threads = useChatStore((s) => s.threads);
  const allMessages = useChatStore((s) => s.messages);
  const folders = useChatStore((s) => s.folders);
  const chatSetLoading = useChatStore((s) => s.setLoading);
  const chatGetThreadMessages = useChatStore((s) => s.getThreadMessages);
  const chatDeleteMessage = useChatStore((s) => s.deleteMessage);
  const chatUpdateMessage = useChatStore((s) => s.updateMessage);
  const activeThread = activeThreadId
    ? (threads[activeThreadId] ?? null)
    : null;

  // Settings — pass SSR initialData so no client fetch on hydration
  const { settings, setTTSAutoplay } = useChatSettings(
    user,
    logger,
    initialSettingsData,
  );
  const defaults = ChatSettingsRepositoryClient.getDefaults();
  const effectiveSettings = settings ?? defaults;
  const ttsAutoplay = effectiveSettings.ttsAutoplay;
  const selectedCharacter = effectiveSettings.selectedCharacter;
  const selectedModel = effectiveSettings.selectedModel;

  // Credits
  const creditsHook = useCredits(user, logger, bootContext.initialCredits);
  const noopDeduct = useCallback(
    // No-op when credits hook unavailable
    () => undefined as void,
    [],
  );
  const deductCredits = creditsHook?.deductCredits ?? noopDeduct;

  // Draft key — unique per thread/folder context
  const draftKey = getDraftKey(
    activeThreadId,
    currentRootFolderId,
    currentSubFolderId,
  );

  // Load draft when navigation changes (thread/folder switch)
  const draftKeyRef = useRef(draftKey);
  draftKeyRef.current = draftKey;
  const loggerRef = useRef(logger);
  loggerRef.current = logger;

  // Autosave draft text when input changes (skip saves triggered by draft loads)
  const prevInputRef = useRef(input);
  const skipNextInputSaveRef = useRef(false);
  useEffect(() => {
    if (skipNextInputSaveRef.current) {
      skipNextInputSaveRef.current = false;
      prevInputRef.current = input;
      return;
    }
    if (prevInputRef.current !== input) {
      prevInputRef.current = input;
      void saveDraft(draftKeyRef.current, input, loggerRef.current);
    }
  }, [input]);

  // Autosave draft attachments when they change (skip saves triggered by draft loads)
  const prevAttachmentsRef = useRef(attachments);
  const skipNextAttachmentsSaveRef = useRef(false);
  useEffect(() => {
    if (skipNextAttachmentsSaveRef.current) {
      skipNextAttachmentsSaveRef.current = false;
      prevAttachmentsRef.current = attachments;
      return;
    }
    if (prevAttachmentsRef.current !== attachments) {
      prevAttachmentsRef.current = attachments;
      void saveDraftAttachments(
        draftKeyRef.current,
        attachments,
        loggerRef.current,
      );
    }
  }, [attachments]);

  useEffect(() => {
    const loadDraftForContext = async (): Promise<void> => {
      const draft = await loadDraft(draftKey, logger);
      const draftAttachments = await loadDraftAttachments(draftKey, logger);
      // Skip the next autosave triggered by these resets — they are loads, not user edits
      skipNextInputSaveRef.current = true;
      skipNextAttachmentsSaveRef.current = true;
      // Always reset on context switch — clear stale input from previous thread
      rawSetInput(draft);
      rawSetAttachments(draftAttachments);
    };
    void loadDraftForContext();
  }, [draftKey, logger, rawSetInput, rawSetAttachments]);

  // Draft-saving wrappers (inline save for immediate feedback on user action)
  const setInput = useCallback(
    (newInput: string) => {
      rawSetInput(newInput);
      void saveDraft(draftKey, newInput, logger);
    },
    [rawSetInput, draftKey, logger],
  );
  const setAttachments = useCallback(
    (newAttachments: File[] | ((prev: File[]) => File[])) => {
      rawSetAttachments((prev) => {
        const updated =
          typeof newAttachments === "function"
            ? newAttachments(prev)
            : newAttachments;
        void saveDraftAttachments(draftKey, updated, logger);
        return updated;
      });
    },
    [rawSetAttachments, draftKey, logger],
  );

  // AI stream
  const aiStream = useAIStream();

  // Streaming state from navigation store
  const isStreaming = useChatNavigationStore((s) => s.isStreaming);
  const startStream = useChatNavigationStore((s) => s.startStream);

  // Message operations
  const messageOps = useMessageOperations({
    aiStream,
    activeThreadId,
    currentRootFolderId,
    currentSubFolderId,
    chatStore: {
      messages: allMessages,
      threads,
      setLoading: chatSetLoading,
      getThreadMessages: chatGetThreadMessages,
      deleteMessage: chatDeleteMessage,
      updateMessage: chatUpdateMessage,
    },
    settings: {
      selectedModel: effectiveSettings.selectedModel,
      selectedCharacter: effectiveSettings.selectedCharacter,
      allowedTools: effectiveSettings.allowedTools,
      pinnedTools: effectiveSettings.pinnedTools,
      ttsAutoplay: effectiveSettings.ttsAutoplay,
      ttsVoice: effectiveSettings.ttsVoice,
    },
    setInput,
    setAttachments,
  });

  // Wrap sendMessage to notify navigation store when a local stream starts
  const sendMessageWithStreamNotify = useCallback(
    async (
      params: Parameters<typeof messageOps.sendMessage>[0],
      onNewThread?: Parameters<typeof messageOps.sendMessage>[1],
    ) => {
      if (activeThreadId) {
        startStream(activeThreadId, logger);
      }
      return messageOps.sendMessage(params, onNewThread);
    },
    [activeThreadId, startStream, logger, messageOps],
  );

  // Input handlers
  const inputHandlers = useInputHandlers({
    input,
    attachments,
    isLoading,
    sendMessage: sendMessageWithStreamNotify,
    setInput,
    locale,
    logger,
    draftKey,
  });
  const { handleSubmit, submitWithContent, submitWithAudio, handleKeyDown } =
    inputHandlers;
  const stopGeneration = messageOps.stopGeneration;

  // Permissions
  const rootFolderPermissions = bootContext.rootFolderPermissions;
  const canPost = useMemo(() => {
    if (activeThread) {
      return activeThread.canPost ?? true;
    }
    if (currentSubFolderId) {
      const currentFolder = folders[currentSubFolderId];
      return currentFolder?.canCreateThread ?? true;
    }
    return rootFolderPermissions.canCreateThread;
  }, [activeThread, currentSubFolderId, folders, rootFolderPermissions]);
  const noPermissionReason = undefined; // Simplified — full logic can be restored later

  const { t } = simpleT(locale);
  const voiceRuntime = useVoiceRuntimeState();
  const voiceUnconfigured = !envAvailability.voice;

  const currentModel = getModelById(selectedModel);
  const modelSupportsTools = currentModel?.supportsTools ?? false;
  const isInputDisabled = isLoading || !canPost;

  // Show stop button when streaming OR when TTS is playing.
  // isStreaming from navigation store is the authoritative signal.
  const isActivelyStreaming = isLoading || isStreaming;
  const showStopButton = isActivelyStreaming || voiceRuntime.isSpeaking;

  // Voice recording state
  const voice = useVoiceRecording({
    user,
    currentValue: input,
    onValueChange: setInput,
    onSubmitText: submitWithContent,
    onSubmitAudio: submitWithAudio,
    deductCredits,
    logger,
    locale,
  });

  // Stable callbacks for child components
  const handleRemoveFile = useCallback(
    (index: number) => {
      setAttachments((prev) => {
        const updated = [...prev];
        updated.splice(index, 1);
        return updated;
      });
    },
    [setAttachments],
  );

  const handleSendVoice = useCallback(
    () => void voice.submitAudioDirectly(),
    [voice],
  );

  const handleToggleCallMode = useCallback(
    () => !voiceUnconfigured && setTTSAutoplay(!ttsAutoplay),
    [voiceUnconfigured, setTTSAutoplay, ttsAutoplay],
  );

  const handleStartRecording = useCallback(
    () => !voiceUnconfigured && void voice.startRecording(),
    [voiceUnconfigured, voice],
  );

  // UI state
  const showMicButton =
    !voice.isRecording && !voice.isProcessing && !showStopButton;
  const showTextarea = !voice.isRecording && !voice.isProcessing;

  return (
    <Form
      onSubmit={handleSubmit}
      className={cn(
        "@container",
        "p-2 @sm:p-3 @md:p-4 backdrop-blur",
        "border border-border rounded-t-lg",
        ttsAutoplay
          ? "bg-green-100/70 dark:bg-green-950/70 border-green-300 dark:border-green-800"
          : "bg-blue-200/70 dark:bg-blue-950/70",
        className,
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
        onSendVoice={handleSendVoice}
        locale={locale}
      />

      {/* Input area */}
      {showTextarea && (
        <Div
          className="relative mb-2 @sm:mb-3"
          data-tour={TOUR_DATA_ATTRS.CHAT_INPUT}
        >
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
            maxLength={AGENT_MESSAGE_LENGTH}
            title={canPost ? undefined : noPermissionReason}
          />

          {/* Hint overlay */}
          {!input && canPost && (
            <Div className="absolute inset-0 pl-3 pr-3 pointer-events-none hidden @sm:flex flex-col justify-between pb-1">
              <Div className="text-sm text-muted-foreground/70 pt-2">
                {t("app.chat.input.placeholder")}
              </Div>
              <Div className="flex items-center gap-2 text-[11px] text-muted-foreground/40">
                <Span>
                  <Kbd className="px-1 py-px bg-muted/50 rounded text-[10px] font-sans">
                    {t("app.chat.input.keyboardShortcuts.enter")}
                  </Kbd>{" "}
                  {t("app.chat.input.keyboardShortcuts.toSend")}
                </Span>
                <Span className="opacity-30">{"/"}</Span>
                <Span>
                  <Kbd className="px-1 py-px bg-muted/50 rounded text-[10px] font-sans">
                    {t("app.chat.input.keyboardShortcuts.shiftEnter")}
                  </Kbd>{" "}
                  {t("app.chat.input.keyboardShortcuts.forNewLine")}
                </Span>
                <Span className="opacity-30">{"/"}</Span>
                <Span>
                  <Kbd className="px-1 py-px bg-muted/50 rounded text-[10px] font-sans">
                    {t("app.chat.input.keyboardShortcuts.ctrlV")}
                  </Kbd>{" "}
                  {t("app.chat.input.keyboardShortcuts.orPasteFiles")}
                </Span>
              </Div>
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
            locale={locale}
            buttonClassName="px-1.5 @sm:px-2 @md:px-3 min-h-8 h-8 @sm:min-h-9 @sm:h-9"
            initialCharacterData={initialCharacterData}
          />

          {modelSupportsTools && (
            <ToolsButton disabled={isLoading} locale={locale} />
          )}

          <FileUploadButton
            disabled={isInputDisabled}
            locale={locale}
            attachments={attachments}
            onFilesSelected={setAttachments}
            onRemoveFile={handleRemoveFile}
          />
        </Div>

        {/* Right: Call Mode + Mic + Send/Stop */}
        <Div className="flex flex-row items-center gap-0.5 shrink-0">
          {/* Call mode toggle */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size="icon"
                  variant={
                    ttsAutoplay && !voiceUnconfigured ? "default" : "ghost"
                  }
                  onClick={handleToggleCallMode}
                  className={cn(
                    "h-8 w-8 @sm:h-9 @sm:w-9",
                    !voiceUnconfigured &&
                      ttsAutoplay &&
                      "bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-500",
                    voiceUnconfigured && "opacity-50 cursor-not-allowed",
                  )}
                  data-tour={TOUR_DATA_ATTRS.CALL_MODE_BUTTON}
                >
                  <Phone className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                className={voiceUnconfigured ? "max-w-xs text-xs" : undefined}
              >
                {voiceUnconfigured ? (
                  <>
                    <P className="font-semibold mb-1">
                      {t("app.chat.voiceMode.unconfiguredTitle")}
                    </P>
                    <P>{t("app.chat.voiceMode.unconfiguredDescription")}</P>
                    <P className="mt-1 font-mono text-[10px] opacity-80">
                      EDEN_AI_API_KEY
                    </P>
                  </>
                ) : ttsAutoplay ? (
                  t("app.chat.voiceMode.callModeDescription")
                ) : (
                  t("app.chat.voiceMode.callMode")
                )}
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
                    disabled={!canPost || voiceUnconfigured}
                    onClick={handleStartRecording}
                    className={cn(
                      "h-8 w-8 @sm:h-9 @sm:w-9",
                      voiceUnconfigured && "opacity-50 cursor-not-allowed",
                    )}
                    data-tour={TOUR_DATA_ATTRS.SPEECH_INPUT}
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  className={voiceUnconfigured ? "max-w-xs text-xs" : undefined}
                >
                  {voiceUnconfigured ? (
                    <>
                      <P className="font-semibold mb-1">
                        {t("app.chat.voiceMode.unconfiguredTitle")}
                      </P>
                      <P>{t("app.chat.voiceMode.unconfiguredDescription")}</P>
                      <P className="mt-1 font-mono text-[10px] opacity-80">
                        EDEN_AI_API_KEY
                      </P>
                    </>
                  ) : (
                    t("app.chat.voiceMode.tapToRecord")
                  )}
                </TooltipContent>
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
                <TooltipContent>
                  {t("app.chat.actions.stopGeneration")}
                </TooltipContent>
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
                <TooltipContent>
                  {t("app.chat.actions.sendMessage")}
                </TooltipContent>
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
