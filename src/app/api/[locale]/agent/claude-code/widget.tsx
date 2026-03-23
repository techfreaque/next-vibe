/**
 * Claude Code Widget
 *
 * Chat-style layout using the exact real message bubble components:
 * - UserMessageBubble from chat/threads/.../messages/widget/
 * - GroupedAssistantMessage from chat/threads/.../messages/widget/
 *
 * Wrapped with ChatNavigationProvider + ChatBootContext.Provider so the real
 * components can access their required stores/contexts.
 *
 * Input bar:
 * - When empty/not yet sent: full input with textarea, STT mic, send button
 * - When submitted (isSubmitting || result): hides textarea + mic + send,
 *   keeping model selector + interactive toggle visible
 */

/* eslint-disable oxlint-plugin-i18n/no-literal-string */
"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { CheckCircle } from "next-vibe-ui/ui/icons/CheckCircle";
import { ChevronDown } from "next-vibe-ui/ui/icons/ChevronDown";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Mic } from "next-vibe-ui/ui/icons/Mic";
import { Terminal } from "next-vibe-ui/ui/icons/Terminal";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "next-vibe-ui/ui/popover";
import { Span } from "next-vibe-ui/ui/span";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "next-vibe-ui/ui/tooltip";
import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { RecordingInputArea } from "@/app/api/[locale]/agent/ai-stream/stream/hooks/recording-input-area";
import { useVoiceRecording } from "@/app/api/[locale]/agent/ai-stream/stream/hooks/use-voice-recording";
import { WidgetChatInput } from "@/app/api/[locale]/agent/ai-stream/stream/widget/chat-input";
import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import type { ChatMessage } from "@/app/api/[locale]/agent/chat/db";
import { ChatMessageRole } from "@/app/api/[locale]/agent/chat/enum";
import type { ChatBootValue } from "@/app/api/[locale]/agent/chat/hooks/context";
import { ChatBootContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import { ChatNavigationProvider } from "@/app/api/[locale]/agent/chat/hooks/use-chat-navigation-store";
import { GroupedAssistantMessage } from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/widget/grouped-assistant-message";
import type { MessageGroup } from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/widget/message-grouping";
import { UserMessageBubble } from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/widget/user-message-bubble";
import { getModelById, ModelId } from "@/app/api/[locale]/agent/models/models";
import {
  useWidgetContext,
  useWidgetDisabled,
  useWidgetForm,
  useWidgetIsSubmitting,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetOnSubmit,
  useWidgetUser,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { Icon } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";

import type definition from "./definition";
import type { RunResponseOutput } from "./definition";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface WidgetProps {
  field: {
    value: RunResponseOutput | null | undefined;
  } & (typeof definition.POST)["fields"];
}

// ---------------------------------------------------------------------------
// Fake boot context - minimal values so GroupedAssistantMessage doesn't throw
// ---------------------------------------------------------------------------

const FAKE_BOOT_VALUE: ChatBootValue = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialCredits: null as any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  envAvailability: null as any,
  rootFolderPermissions: { canCreateThread: false, canCreateFolder: false },
  initialFoldersData: null,
  initialThreadsData: null,
  initialRootFolderId: DefaultFolderId.PRIVATE,
  initialMessagesData: null,
  initialPathData: null,
  initialSettingsData: null,
  initialSkillData: null,
  initialThreadId: null,
  initialPublicFeedData: null,
  initialFolderContentsData: null,
  initialSubFolderContentsData: null,
  initialSubFolderId: null,
};

// ---------------------------------------------------------------------------
// Helpers - construct minimal ChatMessage objects
// ---------------------------------------------------------------------------

let _msgCounter = 0;
function makeMsgId(): string {
  return `cc-widget-${++_msgCounter}-${Date.now()}`;
}

function makeUserMessage(content: string, id: string): ChatMessage {
  const now = new Date();
  return {
    id,
    threadId: "cc-widget-thread",
    role: ChatMessageRole.USER,
    content,
    parentId: null,
    sequenceId: null,
    authorId: null,
    authorName: null,
    isAI: false,
    model: null,
    skill: null,
    errorType: null,
    errorMessage: null,
    errorCode: null,
    metadata: {},
    upvotes: 0,
    downvotes: 0,
    createdAt: now,
    updatedAt: now,
    searchVector: null,
  };
}

function makeAssistantMessage(
  content: string,
  id: string,
  model: ModelId | null,
  isStreaming: boolean,
): ChatMessage {
  const now = new Date();
  return {
    id,
    threadId: "cc-widget-thread",
    role: ChatMessageRole.ASSISTANT,
    content,
    parentId: null,
    sequenceId: null,
    authorId: null,
    authorName: null,
    isAI: true,
    model,
    skill: null,
    errorType: null,
    errorMessage: null,
    errorCode: null,
    metadata: { isStreaming },
    upvotes: 0,
    downvotes: 0,
    createdAt: now,
    updatedAt: now,
    searchVector: null,
  };
}

// ---------------------------------------------------------------------------
// Model selector - 3 Claude Code models with friendly display names
// ---------------------------------------------------------------------------

const CLAUDE_CODE_MODELS = [
  ModelId.CLAUDE_CODE_SONNET,
  ModelId.CLAUDE_CODE_OPUS,
  ModelId.CLAUDE_CODE_HAIKU,
] as const;

type ClaudeCodeModelId = (typeof CLAUDE_CODE_MODELS)[number];

const MODEL_LABELS: Record<ClaudeCodeModelId, string> = {
  [ModelId.CLAUDE_CODE_SONNET]: "Sonnet 4.6",
  [ModelId.CLAUDE_CODE_OPUS]: "Opus 4.6",
  [ModelId.CLAUDE_CODE_HAIKU]: "Haiku 4.5",
};

function ClaudeModelSelector({
  modelId,
  onModelChange,
  disabled,
}: {
  modelId: ModelId;
  onModelChange: (id: ModelId) => void;
  disabled?: boolean;
}): JSX.Element {
  const [open, setOpen] = useState(false);
  const currentModel = useMemo(() => getModelById(modelId), [modelId]);
  const currentLabel =
    MODEL_LABELS[modelId as ClaudeCodeModelId] ?? currentModel?.name ?? modelId;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={disabled}
          className={cn(
            "h-auto min-h-9 gap-2 px-2 py-1.5 hover:bg-accent text-sm font-normal touch-manipulation",
            disabled && "opacity-70 pointer-events-none",
          )}
        >
          <Span className="flex items-center justify-center w-5 h-5 shrink-0 opacity-70">
            {currentModel?.icon ? (
              <Icon icon={currentModel.icon} className="h-4 w-4" />
            ) : null}
          </Span>
          <Span className="hidden @md:inline max-w-[90px] truncate text-muted-foreground">
            {currentLabel}
          </Span>
          <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-1 w-48"
        align="start"
        side="top"
        sideOffset={8}
      >
        {CLAUDE_CODE_MODELS.map((id) => {
          const m = getModelById(id);
          const isActive = id === modelId;
          return (
            <Button
              key={id}
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "w-full justify-start gap-2 h-9 px-2",
                isActive && "bg-accent",
              )}
              onClick={() => {
                onModelChange(id as ClaudeCodeModelId);
                setOpen(false);
              }}
            >
              <Span className="flex items-center justify-center w-5 h-5 shrink-0 opacity-70">
                {m?.icon ? <Icon icon={m.icon} className="h-4 w-4" /> : null}
              </Span>
              <Span className="truncate text-sm">{MODEL_LABELS[id]}</Span>
              {isActive && (
                <CheckCircle className="h-3.5 w-3.5 ml-auto text-primary" />
              )}
            </Button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}

// ---------------------------------------------------------------------------
// Main widget
// ---------------------------------------------------------------------------

export function ClaudeCodeWidget({ field }: WidgetProps): JSX.Element {
  const form = useWidgetForm<typeof definition.POST>();
  const locale = useWidgetLocale();
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const onSubmit = useWidgetOnSubmit();
  const isSubmitting = useWidgetIsSubmitting() ?? false;
  const isDisabled = useWidgetDisabled();
  useWidgetContext();

  const result = field.value;
  const promptValue = form.watch("prompt") ?? "";
  const modelValue = (form.watch("model") ?? "claude-sonnet-4-6") as ModelId;
  const interactiveMode = form.watch("interactiveMode") ?? false;

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result ?? isSubmitting) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [result, isSubmitting]);

  // ── Stable message IDs (so re-renders don't recreate objects) ────────────

  const userMsgIdRef = useRef<string>(makeMsgId());
  const assistantMsgIdRef = useRef<string>(makeMsgId());

  // Reset IDs when a new submission starts (prompt changes after result cleared)
  const prevPromptRef = useRef(promptValue);
  if (promptValue !== prevPromptRef.current && !result && !isSubmitting) {
    prevPromptRef.current = promptValue;
    userMsgIdRef.current = makeMsgId();
    assistantMsgIdRef.current = makeMsgId();
  }

  // ── Model mapping ────────────────────────────────────────────────────────

  const toClaudeCodeModelId = useCallback((id: ModelId): ModelId => {
    const raw = String(id);
    if (raw === "claude-opus-4-6" || id === ModelId.CLAUDE_CODE_OPUS) {
      return ModelId.CLAUDE_CODE_OPUS;
    }
    if (
      raw === "claude-haiku-4-5-20251001" ||
      id === ModelId.CLAUDE_CODE_HAIKU
    ) {
      return ModelId.CLAUDE_CODE_HAIKU;
    }
    return ModelId.CLAUDE_CODE_SONNET;
  }, []);

  const fromClaudeCodeModelId = useCallback(
    (
      id: ModelId,
    ):
      | "claude-sonnet-4-6"
      | "claude-opus-4-6"
      | "claude-haiku-4-5-20251001" => {
      if (id === ModelId.CLAUDE_CODE_OPUS) {
        return "claude-opus-4-6";
      }
      if (id === ModelId.CLAUDE_CODE_HAIKU) {
        return "claude-haiku-4-5-20251001";
      }
      return "claude-sonnet-4-6";
    },
    [],
  );

  const displayModelId = useMemo(
    () => toClaudeCodeModelId(modelValue),
    [modelValue, toClaudeCodeModelId],
  );

  const handleModelChange = useCallback(
    (id: ModelId) => {
      form.setValue("model", fromClaudeCodeModelId(id), { shouldDirty: true });
    },
    [form, fromClaudeCodeModelId],
  );

  const handleContentChange = useCallback(
    (val: string) => form.setValue("prompt", val, { shouldDirty: true }),
    [form],
  );

  const handleSubmit = useCallback(() => {
    if (onSubmit) {
      onSubmit();
    }
  }, [onSubmit]);

  const handleInteractiveToggle = useCallback(() => {
    form.setValue("interactiveMode", !interactiveMode, { shouldDirty: true });
  }, [form, interactiveMode]);

  // ── Voice (transcribe-to-input only) ─────────────────────────────────────

  const noopDeduct = useCallback(() => undefined as void, []);

  const {
    isRecording,
    isPaused,
    isProcessing,
    stream,
    hasExistingInput,
    startRecording,
    transcribeToInput,
    cancelRecording,
    togglePause,
  } = useVoiceRecording({
    currentValue: promptValue,
    onValueChange: handleContentChange,
    deductCredits: noopDeduct,
    user,
    logger,
    locale,
  });

  // ── Construct real message objects ────────────────────────────────────────

  const userMessage = useMemo(
    () => makeUserMessage(promptValue, userMsgIdRef.current),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [promptValue, userMsgIdRef.current],
  );

  const isEscalated = !!result?.taskId && !result.output;
  const isInteractiveLaunched =
    !!result?.taskId && result.durationMs === 0 && !!result.output;

  const assistantContent = useMemo(() => {
    if (!result) {
      return "";
    }
    if (isEscalated) {
      return `⟳ Running in background…\n\nTask ID: \`${result.taskId}\`${result.hint ? `\n\n${result.hint}` : ""}`;
    }
    if (isInteractiveLaunched) {
      return `◆ Interactive session launched in terminal\n\nTask ID: \`${result.taskId}\`${result.output ? `\n\n${result.output}` : ""}`;
    }
    return result.output ?? "";
  }, [result, isEscalated, isInteractiveLaunched]);

  const assistantMessage = useMemo(
    () =>
      makeAssistantMessage(
        assistantContent,
        assistantMsgIdRef.current,
        displayModelId,
        isSubmitting && !result,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [assistantContent, displayModelId, isSubmitting, result],
  );

  const assistantGroup = useMemo(
    (): MessageGroup => ({
      primary: assistantMessage,
      continuations: [],
      sequenceId: null,
    }),
    [assistantMessage],
  );

  // ── Selector slot: model picker + interactive toggle with Switch ──────────

  const selectorSlot = useMemo(
    () => (
      <>
        <ClaudeModelSelector
          modelId={displayModelId}
          onModelChange={handleModelChange}
          disabled={isDisabled}
        />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Div
                className={cn(
                  "inline-flex items-center gap-1.5 px-2 @md:px-3 h-8 @sm:h-9 rounded-md text-xs font-normal",
                  "hover:bg-accent transition-colors cursor-pointer",
                  isDisabled && "opacity-50 pointer-events-none",
                )}
                onClick={isDisabled ? undefined : handleInteractiveToggle}
              >
                <Terminal className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <Span className="hidden @md:inline text-muted-foreground">
                  Interactive
                </Span>
                {/* Visual-only switch track - no Radix button, no event conflicts */}
                <Span
                  className={cn(
                    "inline-flex items-center shrink-0 rounded-full border-2 border-transparent transition-colors",
                    "h-[18px] w-[32px]",
                    interactiveMode ? "bg-primary" : "bg-input",
                  )}
                >
                  <Span
                    className={cn(
                      "block rounded-full bg-background shadow transition-transform",
                      "h-[14px] w-[14px]",
                      interactiveMode ? "translate-x-[14px]" : "translate-x-0",
                    )}
                  />
                </Span>
              </Div>
            </TooltipTrigger>
            <TooltipContent>
              {interactiveMode
                ? "Interactive terminal mode - click to switch to batch"
                : "Batch mode - click to switch to interactive terminal"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </>
    ),
    [
      displayModelId,
      handleModelChange,
      interactiveMode,
      handleInteractiveToggle,
      isDisabled,
    ],
  );

  // ── Mic slot ──────────────────────────────────────────────────────────────

  const micSlot = useMemo(
    () => (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 @sm:h-9 @sm:w-9"
        onClick={() => {
          void startRecording();
        }}
        disabled={isDisabled}
        title="Voice input"
      >
        <Mic className="h-4 w-4" />
      </Button>
    ),
    [startRecording, isDisabled],
  );

  // Whether a message has been sent (so we hide textarea/mic/send)
  const hasSentMessage = isSubmitting || !!result;

  return (
    <ChatNavigationProvider
      activeThreadId={null}
      currentRootFolderId={DefaultFolderId.PRIVATE}
      currentSubFolderId={null}
      leafMessageId={null}
      isEmbedded={false}
    >
      <ChatBootContext.Provider value={FAKE_BOOT_VALUE}>
        <Div className="flex flex-col h-[520px] min-h-[320px]">
          {/* Messages area */}
          <Div className="flex-1 overflow-y-auto min-h-0 py-2">
            {/* User message bubble */}
            {hasSentMessage && promptValue && (
              <UserMessageBubble
                message={userMessage}
                locale={locale}
                logger={logger}
                user={user}
                deductCredits={null}
                rootFolderId={DefaultFolderId.PRIVATE}
              />
            )}

            {/* Streaming indicator when no result yet */}
            {isSubmitting && !result && (
              <Div className="flex items-start gap-3 px-2 mt-3">
                <Div className="flex-1 max-w-full pl-2 py-1 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground shrink-0" />
                  <Span className="text-sm text-muted-foreground">
                    {interactiveMode
                      ? "Launching terminal session…"
                      : "Claude is running…"}
                  </Span>
                </Div>
              </Div>
            )}

            {/* Assistant message bubble */}
            {result && (
              <GroupedAssistantMessage
                group={assistantGroup}
                locale={locale}
                onAnswerAsModel={null}
                showAuthor={true}
                logger={logger}
                readOnly={false}
                platformOverride={null}
                collapseState={null}
                rootFolderId={DefaultFolderId.PRIVATE}
                user={user}
                sendMessage={null}
                deductCredits={noopDeduct}
                ttsAutoplay={false}
                ttsVoice={undefined}
                onVote={null}
                userVote={null}
                voteScore={0}
              />
            )}

            {/* Empty state */}
            {!hasSentMessage && (
              <Div className="flex items-center justify-center h-full">
                <Span className="text-sm text-muted-foreground/50 select-none">
                  Enter a prompt below to run Claude Code
                </Span>
              </Div>
            )}

            <Div ref={messagesEndRef} />
          </Div>

          {/* Recording overlay */}
          {isRecording && (
            <RecordingInputArea
              isRecording={isRecording}
              isPaused={isPaused}
              isProcessing={isProcessing}
              stream={stream}
              hasExistingInput={hasExistingInput}
              onCancel={cancelRecording}
              onTogglePause={togglePause}
              onTranscribeToInput={transcribeToInput}
              onSendVoice={() => undefined}
              locale={locale}
            />
          )}

          {/* Input bar */}
          <WidgetChatInput
            content={promptValue}
            onContentChange={handleContentChange}
            modelId={displayModelId}
            skillId=""
            onModelChange={handleModelChange}
            onSkillChange={() => undefined}
            locale={locale}
            user={user}
            logger={logger}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            disabled={isDisabled}
            enabledTools={[]}
            hideTools={true}
            hideInputWhenSubmitting={hasSentMessage}
            selectorSlot={selectorSlot}
            micSlot={micSlot}
            className="rounded-b-lg"
          />
        </Div>
      </ChatBootContext.Provider>
    </ChatNavigationProvider>
  );
}
