"use client";

import { Div } from "next-vibe-ui/ui/div";
import { Button } from "next-vibe-ui/ui/button";
import { AnimatePresence, MotionDiv } from "next-vibe-ui/ui/motion";
import { Span } from "next-vibe-ui/ui/span";
import { H3, P } from "next-vibe-ui/ui/typography";
import { cn } from "next-vibe/shared/utils";
import type { JSX, ReactNode } from "react";
import { useCallback, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import type {
  ChatMessage,
  ToolCallResult,
} from "@/app/api/[locale]/agent/chat/db";
import { ChatMessageRole } from "@/app/api/[locale]/agent/chat/enum";
import { GroupedAssistantMessage } from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/widget/grouped-assistant-message";
import type { MessageGroup } from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/widget/message-grouping";
import { UserMessageBubble } from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/widget/user-message-bubble";
import { ModelId } from "@/app/api/[locale]/agent/models/models";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation } from "./i18n";
import { MockChatProvider } from "./mock-chat-provider";

type ScopedT = ReturnType<(typeof scopedTranslation)["scopedT"]>["t"];

interface PersonalShowcaseProps {
  locale: CountryLanguage;
}

interface PersonalBlockProps {
  label: string;
  title: string;
  description: string;
  visual: ReactNode;
  reversed: boolean;
  delay: number;
}

function PersonalBlock({
  label,
  title,
  description,
  visual,
  reversed,
  delay,
}: PersonalBlockProps): JSX.Element {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <Div ref={ref as never} className="py-16 md:py-24">
      <MotionDiv
        className={`grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center ${reversed ? "md:[direction:rtl]" : ""}`}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6, delay }}
      >
        <Div className={reversed ? "md:[direction:ltr]" : ""}>
          <Span className="text-sm font-medium text-emerald-500 uppercase tracking-wider mb-3 block">
            {label}
          </Span>
          <H3 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl mb-4">
            {title}
          </H3>
          <P className="text-lg text-muted-foreground leading-relaxed">
            {description}
          </P>
        </Div>
        <Div className={reversed ? "md:[direction:ltr]" : ""}>{visual}</Div>
      </MotionDiv>
    </Div>
  );
}

// ---------------------------------------------------------------------------
// Mock helpers (local copies — same shape as capability-showcase)
// ---------------------------------------------------------------------------

function baseMockMsg(overrides: {
  id: string;
  threadId: string;
  role: ChatMessage["role"];
  content: string | null;
  parentId: string | null;
  depth: number;
  sequenceId: string | null;
  isAI: boolean;
  model: ChatMessage["model"];
  metadata: ChatMessage["metadata"];
}): ChatMessage {
  const now = new Date();
  return {
    authorId: null,
    authorName: null,
    skill: null,
    errorType: null,
    errorMessage: null,
    errorCode: null,
    upvotes: 0,
    downvotes: 0,
    createdAt: now,
    updatedAt: now,
    searchVector: null,
    ...overrides,
  };
}

function mkToolMsg(
  id: string,
  tid: string,
  seq: string,
  toolCallId: string,
  toolName: string,
  args: ToolCallResult,
  result: ToolCallResult,
  executionTime: number,
): ChatMessage {
  return baseMockMsg({
    id,
    threadId: tid,
    role: ChatMessageRole.TOOL,
    content: null,
    parentId: "user",
    depth: 1,
    sequenceId: seq,
    isAI: true,
    model: ModelId.CLAUDE_OPUS_4_6,
    metadata: {
      toolCall: { toolCallId, toolName, args, result, executionTime },
    },
  });
}

function mkAssistantMsg(
  id: string,
  tid: string,
  seq: string,
  content: string,
  meta?: Partial<ChatMessage["metadata"]>,
): ChatMessage {
  return baseMockMsg({
    id,
    threadId: tid,
    role: ChatMessageRole.ASSISTANT,
    content,
    parentId: "user",
    depth: 1,
    sequenceId: seq,
    isAI: true,
    model: ModelId.CLAUDE_OPUS_4_6,
    metadata: { ...meta },
  });
}

// ---------------------------------------------------------------------------
// Demo builders
// ---------------------------------------------------------------------------

// Heartbeat: Thea wakes up on schedule, checks task queue, spots email failure, recalls fix policy, spawns Claude Code
function buildHeartbeatGroup(t: ScopedT): MessageGroup {
  const tid = "demo-personal-heartbeat";
  const seq = "heartbeat-seq";

  const reasoning1 = mkAssistantMsg(
    tid,
    tid,
    seq,
    t("home.personal.demos.heartbeat.reasoning1"),
  );

  const taskListTool = mkToolMsg(
    "heartbeat-tasks",
    tid,
    seq,
    "toolu_tasks1",
    "task-list",
    { includeCompleted: false, limit: 20 },
    {
      tasks: [
        {
          id: "email-send-daily",
          displayName: "Daily digest email",
          status: "FAILED",
          lastRun: "2026-03-29T06:00:00Z",
          failCount: 3,
          lastError: t("home.personal.demos.heartbeat.taskError"),
        },
        {
          id: "db-backup",
          displayName: "Nightly database backup",
          status: "SUCCESS",
          lastRun: "2026-03-29T03:00:00Z",
          failCount: 0,
        },
        {
          id: "memory-cleanup",
          displayName: "Memory archival",
          status: "SUCCESS",
          lastRun: "2026-03-28T22:00:00Z",
          failCount: 0,
        },
      ],
      total: 3,
      failed: 1,
    },
    280,
  );

  const reasoning2 = mkAssistantMsg(
    "heartbeat-reasoning2",
    tid,
    seq,
    t("home.personal.demos.heartbeat.reasoning2"),
  );

  const memoryTool = mkToolMsg(
    "heartbeat-memory",
    tid,
    seq,
    "toolu_mem1",
    "memories-search",
    { query: t("home.personal.demos.heartbeat.memoryQuery") },
    {
      results: [
        {
          memoryNumber: 4,
          content: t("home.personal.demos.heartbeat.memoryResult"),
          tags: ["email", "smtp", "auto-fix"],
          priority: 85,
          isArchived: false,
          createdAt: "2026-02-10T09:00:00Z",
        },
      ],
      total: 1,
    },
    290,
  );

  const reasoning3 = mkAssistantMsg(
    "heartbeat-reasoning3",
    tid,
    seq,
    t("home.personal.demos.heartbeat.reasoning3"),
  );

  const codingTool = mkToolMsg(
    "heartbeat-code",
    tid,
    seq,
    "toolu_cc1",
    "coding-agent",
    {
      prompt: t("home.personal.demos.heartbeat.taskInput"),
      provider: "claude-code",
      interactiveMode: false,
      taskTitle: t("home.personal.demos.heartbeat.taskTitle"),
    },
    {
      output: t("home.personal.demos.heartbeat.taskOutput"),
      durationMs: 11800,
    },
    11800,
  );

  const rebuildTool = mkToolMsg(
    "heartbeat-rebuild",
    tid,
    seq,
    "toolu_rebuild1",
    "rebuild",
    {},
    {
      status: "success",
      message: t("home.personal.demos.heartbeat.rebuildOutput"),
      durationMs: 18600,
    },
    18600,
  );

  const response = mkAssistantMsg(
    "heartbeat-response",
    tid,
    seq,
    t("home.personal.demos.heartbeat.summaryResponse"),
    { promptTokens: 1100, completionTokens: 110 },
  );

  return {
    primary: reasoning1,
    continuations: [
      taskListTool,
      reasoning2,
      memoryTool,
      reasoning3,
      codingTool,
      rebuildTool,
      response,
    ],
    sequenceId: seq,
  };
}

// SSH Deploy: pull latest + zero-downtime restart
function buildSshGroup(t: ScopedT): MessageGroup {
  const tid = "demo-personal-ssh";
  const seq = "ssh-seq";

  const reasoning = mkAssistantMsg(
    tid,
    tid,
    seq,
    t("home.personal.demos.ssh.reasoning"),
  );

  const pullTool = mkToolMsg(
    "ssh-pull",
    tid,
    seq,
    "toolu_ssh1",
    "ssh-exec",
    {
      command:
        "cd /srv/app && git pull origin main && bun install --frozen-lockfile",
    },
    {
      stdout:
        "Already up to date.\nFast-forward\n src/app/api/[locale]/agent/models/models.ts | 3 +--\n 1 file changed\nbun install v1.2.4 — 0 new packages",
      stderr: "",
      exitCode: 0,
      status: "SUCCESS",
      durationMs: 1240,
      backend: "SSH",
    },
    1240,
  );

  const restartTool = mkToolMsg(
    "ssh-restart",
    tid,
    seq,
    "toolu_ssh2",
    "ssh-exec",
    { command: "pm2 reload ecosystem.config.js --update-env" },
    {
      stdout:
        "Reloading app unbottled-ai [0] ✓\nReloading app unbottled-ai [1] ✓\n[PM2] Done. Zero-downtime reload complete.",
      stderr: "",
      exitCode: 0,
      status: "SUCCESS",
      durationMs: 3100,
      backend: "SSH",
    },
    3100,
  );

  const response = mkAssistantMsg(
    "ssh-response",
    tid,
    seq,
    t("home.personal.demos.ssh.summaryResponse"),
    { promptTokens: 1100, completionTokens: 110 },
  );

  return {
    primary: reasoning,
    continuations: [pullTool, restartTool, response],
    sequenceId: seq,
  };
}

// Build a Tool: user asks Thea to build something, Thea delegates to Claude Code
function buildClaudeCodeGroup(t: ScopedT): MessageGroup {
  const tid = "demo-personal-claudecode";
  const seq = "claudecode-seq";

  const reasoning = mkAssistantMsg(
    tid,
    tid,
    seq,
    t("home.personal.demos.claudeCode.reasoning"),
  );

  const codingTool = mkToolMsg(
    "cc-spawn",
    tid,
    seq,
    "toolu_cc2",
    "coding-agent",
    {
      prompt: t("home.personal.demos.claudeCode.taskInput"),
      provider: "claude-code",
      interactiveMode: false,
      taskTitle: "Build HackerNews digest tool",
    },
    {
      output:
        "Created: hackernews/top endpoint + daily cron wired at 08:00. Character filter set for TypeScript, self-hosting, AI. First digest queued for tomorrow.",
      durationMs: 31200,
    },
    31200,
  );

  const response = mkAssistantMsg(
    "cc-response",
    tid,
    seq,
    t("home.personal.demos.claudeCode.summaryResponse"),
    { promptTokens: 620, completionTokens: 85 },
  );

  return {
    primary: reasoning,
    continuations: [codingTool, response],
    sequenceId: seq,
  };
}

// ---------------------------------------------------------------------------
// DemoVisual — shared tab + chat renderer
// ---------------------------------------------------------------------------

type PersonalDemoId = "heartbeat" | "ssh" | "claudeCode";
const PERSONAL_DEMOS: PersonalDemoId[] = ["heartbeat", "ssh", "claudeCode"];

function PersonalDemoVisual({
  locale,
}: {
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const logger = useMemo(
    () => createEndpointLogger(false, Date.now(), locale),
    [locale],
  );
  const [activeId, setActiveId] = useState<PersonalDemoId>("heartbeat");

  const handleSelect = useCallback((id: PersonalDemoId) => {
    setActiveId(id);
  }, []);

  const userMessages: Record<PersonalDemoId, string> = useMemo(
    () => ({
      heartbeat: t("home.personal.demos.heartbeat.userMessage"),
      ssh: t("home.personal.demos.ssh.userMessage"),
      claudeCode: t("home.personal.demos.claudeCode.userMessage"),
    }),
    [t],
  );

  const groups: Record<PersonalDemoId, MessageGroup> = useMemo(
    () => ({
      heartbeat: buildHeartbeatGroup(t),
      ssh: buildSshGroup(t),
      claudeCode: buildClaudeCodeGroup(t),
    }),
    [t],
  );

  const userMsg = useMemo(
    () =>
      baseMockMsg({
        id: `personal-user-${activeId}`,
        threadId: `demo-personal-${activeId}`,
        role: ChatMessageRole.USER,
        content: userMessages[activeId],
        parentId: null,
        depth: 0,
        sequenceId: null,
        isAI: false,
        model: null,
        metadata: {},
      }),
    [activeId, userMessages],
  );

  return (
    <Div>
      <Div className="flex flex-wrap gap-2 mb-4">
        {PERSONAL_DEMOS.map((id) => (
          <Button
            key={id}
            variant="ghost"
            size="sm"
            onClick={() => handleSelect(id)}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-medium transition-all",
              activeId === id
                ? "bg-emerald-600 text-white hover:bg-emerald-600"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {t(`home.personal.demos.${id}.tab`)}
          </Button>
        ))}
      </Div>
      <MockChatProvider>
        <Div className="rounded-lg border bg-card/50 overflow-hidden p-4 space-y-1 max-h-[32rem] overflow-y-auto">
          <UserMessageBubble
            message={userMsg}
            locale={locale}
            logger={logger}
            rootFolderId={DefaultFolderId.PUBLIC}
            user={{
              isPublic: false,
              leadId: "00000000-0000-0000-0000-000000000000",
              id: "00000000-0000-0000-0000-000000000000",
              roles: [UserPermissionRole.ADMIN],
            }}
            deductCredits={null}
          />
          <AnimatePresence mode="wait">
            <MotionDiv
              key={activeId}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <GroupedAssistantMessage
                group={groups[activeId]}
                locale={locale}
                logger={logger}
                readOnly
                showAuthor
                platformOverride={Platform.CLI}
                onAnswerAsModel={null}
                collapseState={null}
                rootFolderId={DefaultFolderId.PUBLIC}
                user={{
                  id: "00000000-0000-0000-0000-000000000000",
                  isPublic: false,
                  leadId: "00000000-0000-0000-0000-000000000000",
                  roles: [UserPermissionRole.ADMIN],
                }}
                sendMessage={null}
                deductCredits={null}
                ttsAutoplay={false}
                ttsVoice={undefined}
                onVote={null}
                userVote={null}
                voteScore={0}
              />
            </MotionDiv>
          </AnimatePresence>
        </Div>
      </MockChatProvider>
    </Div>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function PersonalShowcase({
  locale,
}: PersonalShowcaseProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);

  return (
    <Div className="relative overflow-hidden">
      <Div className="container relative px-4 md:px-6">
        <PersonalBlock
          label={t("home.personal.theaAdmin.label")}
          title={t("home.personal.theaAdmin.title")}
          description={t("home.personal.theaAdmin.description")}
          visual={<PersonalDemoVisual locale={locale} />}
          reversed={false}
          delay={0}
        />
      </Div>
    </Div>
  );
}
