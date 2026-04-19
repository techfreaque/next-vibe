/**
 * Coding Agent Widget
 *
 * Chat-style layout. Selector slot shows provider toggle (claude-code / open-code)
 * and interactive mode toggle. Model is a text field in the form below.
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ChevronDown } from "next-vibe-ui/ui/icons/ChevronDown";
import { Mic } from "next-vibe-ui/ui/icons/Mic";
import { Terminal } from "next-vibe-ui/ui/icons/Terminal";
import { Markdown } from "next-vibe-ui/ui/markdown";
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

import { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";
import { RecordingInputArea } from "@/app/api/[locale]/agent/ai-stream/stream/hooks/recording-input-area";
import { useVoiceRecording } from "@/app/api/[locale]/agent/ai-stream/stream/hooks/use-voice-recording";
import { WidgetChatInput } from "@/app/api/[locale]/agent/ai-stream/stream/widget/chat-input";
import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import type { ChatMessage } from "@/app/api/[locale]/agent/chat/db";
import { ChatMessageRole } from "@/app/api/[locale]/agent/chat/enum";
import type { ChatBootValue } from "@/app/api/[locale]/agent/chat/hooks/context";
import { ChatBootContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import { ChatNavigationProvider } from "@/app/api/[locale]/agent/chat/hooks/use-chat-navigation-store";
import { NO_SKILL_ID } from "@/app/api/[locale]/agent/chat/skills/constants";
import { GroupedAssistantMessage } from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/widget/grouped-assistant-message";
import type { MessageGroup } from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/widget/message-grouping";
import { StaticUserMessageBubble } from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/widget/user-message-bubble";
import {
  useWidgetContext,
  useWidgetDisabled,
  useWidgetForm,
  useWidgetIsSubmitting,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetOnSubmit,
  useWidgetResponse,
  useWidgetUser,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/widget";

import type definition from "./definition";
import { scopedTranslation } from "./i18n";

interface WidgetProps {
  field: (typeof definition.POST)["fields"];
}

const FAKE_BOOT_VALUE: ChatBootValue = {
  initialCredits: {
    total: 0,
    expiring: 0,
    permanent: 0,
    earned: 0,
    free: 0,
    expiresAt: null,
  },
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

let _msgCounter = 0;
function makeMsgId(): string {
  return `ca-widget-${++_msgCounter}-${Date.now()}`;
}

function makeUserMessage(content: string, id: string): ChatMessage {
  const now = new Date();
  return {
    id,
    threadId: "ca-widget-thread",
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

const PROVIDER_TO_MODEL: Record<string, ChatModelId> = {
  "claude-code": ChatModelId.CLAUDE_CODE_SONNET,
  "open-code": ChatModelId.CLAUDE_CODE_SONNET, // fallback until OpenCode model added
};

function makeAssistantMessage(
  content: string,
  id: string,
  isStreaming: boolean,
  model: ChatModelId | null,
): ChatMessage {
  const now = new Date();
  return {
    id,
    threadId: "ca-widget-thread",
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

const PROVIDERS = [
  { value: "claude-code" as const, label: "Claude Code" },
  { value: "open-code" as const, label: "OpenCode" },
];

function ProviderSelector({
  provider,
  onProviderChange,
  disabled,
}: {
  provider: "claude-code" | "open-code";
  onProviderChange: (p: "claude-code" | "open-code") => void;
  disabled?: boolean;
}): JSX.Element {
  const [open, setOpen] = useState(false);
  const current = PROVIDERS.find((p) => p.value === provider) ?? PROVIDERS[0];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={disabled}
          className={cn(
            "h-auto min-h-9 gap-1.5 px-2 py-1.5 hover:bg-accent text-sm font-normal touch-manipulation",
            disabled && "opacity-70 pointer-events-none",
          )}
        >
          <Span className="hidden @md:inline max-w-[90px] truncate text-muted-foreground">
            {current.label}
          </Span>
          <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-1 w-40"
        align="start"
        side="top"
        sideOffset={8}
      >
        {PROVIDERS.map((p) => (
          <Button
            key={p.value}
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
              "w-full justify-start h-9 px-2 text-sm",
              p.value === provider && "bg-accent",
            )}
            onClick={() => {
              onProviderChange(p.value);
              setOpen(false);
            }}
          >
            {p.label}
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  );
}

export function CodingAgentWidget({ field }: WidgetProps): JSX.Element {
  const form = useWidgetForm<typeof definition.POST>();
  const locale = useWidgetLocale();
  const { t } = scopedTranslation.scopedT(locale);
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const onSubmit = useWidgetOnSubmit();
  const isSubmitting = useWidgetIsSubmitting() ?? false;
  const isDisabled = useWidgetDisabled();
  useWidgetContext();

  const children = field.children;
  const result = useWidgetValue<typeof definition.POST>();
  const rawResponse = useWidgetResponse();
  const promptValue = form.watch("prompt") ?? "";
  const providerValue = form.watch("provider") ?? "claude-code";
  const interactiveMode = form.watch("interactiveMode") ?? false;

  // Derive response data from multiple sources (context store, raw response, form defaults).
  // useWidgetValue uses useShallow which can miss on initial render in some cases,
  // so we also check the raw response and form defaults as fallbacks.
  const effectiveResult = useMemo(() => {
    if (result) {
      return result;
    }
    // Fallback: read response data directly from context (bypasses useShallow)
    if (rawResponse?.success && rawResponse.data) {
      const d: Record<string, string | number | boolean | null | undefined> =
        rawResponse.data;
      if (typeof d["output"] === "string") {
        return {
          output: d["output"],
          durationMs: typeof d["durationMs"] === "number" ? d["durationMs"] : 0,
          taskId: typeof d["taskId"] === "string" ? d["taskId"] : undefined,
          hint: typeof d["hint"] === "string" ? d["hint"] : undefined,
          terminalPending:
            typeof d["terminalPending"] === "boolean"
              ? d["terminalPending"]
              : undefined,
        };
      }
    }
    if (!isDisabled) {
      return undefined;
    }
    // Last resort: response fields are merged into form defaults by EndpointRenderer
    const vals: Record<string, string | number | boolean | null | undefined> =
      form.getValues();
    const output = vals["output"];
    if (typeof output !== "string") {
      return undefined;
    }
    const durationMs = vals["durationMs"];
    const taskId = vals["taskId"];
    return {
      output,
      durationMs: typeof durationMs === "number" ? durationMs : 0,
      taskId: typeof taskId === "string" ? taskId : undefined,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, rawResponse, isDisabled]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (effectiveResult !== undefined || isSubmitting) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [effectiveResult, isSubmitting]);

  const userMsgIdRef = useRef<string>(makeMsgId());
  const assistantMsgIdRef = useRef<string>(makeMsgId());

  const prevPromptRef = useRef(promptValue);
  if (promptValue !== prevPromptRef.current && !result && !isSubmitting) {
    prevPromptRef.current = promptValue;
    userMsgIdRef.current = makeMsgId();
    assistantMsgIdRef.current = makeMsgId();
  }

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

  const handleProviderChange = useCallback(
    (p: "claude-code" | "open-code") => {
      form.setValue("provider", p, { shouldDirty: true });
    },
    [form],
  );

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
    user,
    logger,
    locale,
  });

  const userMessage = useMemo(
    () => makeUserMessage(promptValue, userMsgIdRef.current),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [promptValue, userMsgIdRef.current],
  );

  const isEscalated = !!effectiveResult?.taskId && !effectiveResult.output;
  const isInteractiveLaunched =
    !!effectiveResult?.taskId &&
    effectiveResult.durationMs === 0 &&
    !!effectiveResult.output;

  const assistantContent = useMemo(() => {
    if (!effectiveResult) {
      return "";
    }
    if (isEscalated) {
      return `⟳ Running in background…\n\nTask ID: \`${effectiveResult.taskId}\`${effectiveResult.hint ? `\n\n${effectiveResult.hint}` : ""}`;
    }
    if (isInteractiveLaunched) {
      return `◆ Interactive session launched in terminal\n\nTask ID: \`${effectiveResult.taskId}\`${effectiveResult.output ? `\n\n${effectiveResult.output}` : ""}`;
    }
    return effectiveResult.output ?? "";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveResult, isEscalated, isInteractiveLaunched]);

  const isAssistantLoading = (isSubmitting || isDisabled) && !effectiveResult;

  const assistantMessage = useMemo(
    () =>
      makeAssistantMessage(
        assistantContent,
        assistantMsgIdRef.current,
        isAssistantLoading,
        PROVIDER_TO_MODEL[providerValue] ?? ChatModelId.CLAUDE_CODE_SONNET,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [assistantContent, isAssistantLoading],
  );

  const assistantGroup = useMemo(
    (): MessageGroup => ({
      primary: assistantMessage,
      continuations: [],
      sequenceId: null,
    }),
    [assistantMessage],
  );

  const selectorSlot = useMemo(
    () => (
      <>
        <ProviderSelector
          provider={providerValue}
          onProviderChange={handleProviderChange}
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
                  {t("codingAgent.run.post.widget.interactive")}
                </Span>
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
      providerValue,
      handleProviderChange,
      interactiveMode,
      handleInteractiveToggle,
      isDisabled,
      t,
    ],
  );

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

  const hasSentMessage = isSubmitting || !!effectiveResult || isDisabled;

  return (
    <ChatNavigationProvider
      activeThreadId={null}
      currentRootFolderId={DefaultFolderId.PRIVATE}
      currentSubFolderId={null}
      leafMessageId={null}
      isEmbedded={true}
    >
      <ChatBootContext.Provider value={FAKE_BOOT_VALUE}>
        <Div
          className={
            isDisabled
              ? "flex flex-col"
              : "flex flex-col h-[520px] min-h-[320px]"
          }
        >
          {!isDisabled && (
            <Div className="flex items-center gap-2 px-2 pt-2">
              <NavigateButtonWidget field={children.backButton} />
              <SubmitButtonWidget<typeof definition.POST>
                field={children.submitButton}
              />
            </Div>
          )}
          <Div
            className={
              isDisabled
                ? "flex flex-col gap-1"
                : "flex-1 overflow-y-auto min-h-0 py-2"
            }
          >
            {hasSentMessage && promptValue && (
              <StaticUserMessageBubble
                message={userMessage}
                locale={locale}
                logger={logger}
                user={user}
                rootFolderId={DefaultFolderId.PRIVATE}
              />
            )}

            {hasSentMessage && isDisabled && assistantContent ? (
              <Div
                className={cn(
                  "prose prose-sm dark:prose-invert max-w-none prose-headings:text-slate-900 dark:prose-headings:text-slate-100 prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-code:text-blue-600 dark:prose-code:text-blue-400",
                  "pl-2 py-2.5 sm:py-3",
                )}
              >
                <Markdown content={assistantContent} />
              </Div>
            ) : hasSentMessage && !isDisabled ? (
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
                ttsAutoplay={false}
                voiceId={undefined}
                onVote={null}
                userVote={null}
                voteScore={0}
              />
            ) : null}

            {!hasSentMessage && !isDisabled && (
              <Div className="flex items-center justify-center h-full">
                <Span className="text-sm text-muted-foreground/50 select-none">
                  {t("codingAgent.run.post.widget.emptyPromptHint")}
                </Span>
              </Div>
            )}

            <Div ref={messagesEndRef} />
          </Div>

          {!isDisabled && isRecording && (
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

          {!isDisabled && (
            <WidgetChatInput
              content={promptValue}
              onContentChange={handleContentChange}
              modelId={ChatModelId.CLAUDE_CODE_SONNET}
              skillId={NO_SKILL_ID}
              onModelChange={() => undefined}
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
          )}
        </Div>
      </ChatBootContext.Provider>
    </ChatNavigationProvider>
  );
}
