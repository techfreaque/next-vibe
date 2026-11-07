"use client";
import type { ChatMessage } from "next-vibe/agent/chat/db";
import { GroupedAssistantMessage } from "next-vibe/agent/chat/threads/[threadId]/messages/widget/grouped-assistant-message";
import type { MessageGroup } from "next-vibe/agent/chat/threads/[threadId]/messages/widget/message-grouping";
import { StaticUserMessageBubble } from "next-vibe/agent/chat/threads/[threadId]/messages/widget/user-message-bubble";
import { DefaultFolderId } from "next-vibe/core/execution-context";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { Platform } from "next-vibe/platforms/platforms";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { AnimatePresence, MotionDiv } from "next-vibe/ui/components/motion";
import { Span } from "next-vibe/ui/components/span";
import { H3, P } from "next-vibe/ui/components/typography";
import { useLogger } from "next-vibe/ui/hooks/use-logger";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import type codingAgentDefinitions from "next-vibe/agent/coding-agent/definition";
import type cortexExecDefinitions from "next-vibe/agent/cortex/exec/definition";
import type cortexSearchDefinitions from "next-vibe/agent/cortex/search/definition";
import type cronTasksDefinitions from "next-vibe/tasks/cron/tasks/definition";
import {
  CronTaskEnabledFilter,
  CronTaskHiddenFilter,
  CronTaskPriority,
  CronTaskStatus,
  TaskCategory,
  TaskOutputMode,
} from "next-vibe/tasks/enum";
import type { JSX, ReactNode } from "react";
import { useCallback, useMemo, useState } from "react";

import { ExecBackend } from "@/ssh/enum";

import { mkAssistantMsg, mkDemoToolMsg, mkUserMsg } from "./demo-messages";
import { scopedTranslation } from "./i18n";
import { MockChatProvider } from "./mock-chat-provider";

type CodingAgentEndpoint = typeof codingAgentDefinitions.POST;
type CortexExecEndpoint = typeof cortexExecDefinitions.POST;
type CortexSearchEndpoint = typeof cortexSearchDefinitions.GET;
type TaskListEndpoint = typeof cronTasksDefinitions.GET;

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
  return (
    <Div className="py-16 md:py-24">
      <MotionDiv
        className={`grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center ${reversed ? "md:[direction:rtl]" : ""}`}
        initial={false}
        animate={{ opacity: 1, y: 0 }}
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
// Demo builders
// ---------------------------------------------------------------------------

type CronTaskRow = TaskListEndpoint["types"]["ResponseOutput"]["tasks"][number];

function mkCronTaskRow(params: {
  id: string;
  routeId: string;
  displayName: string;
  schedule: string;
  category: CronTaskRow["category"];
  lastExecutedAt: string;
  nextExecutionAt: string;
  lastExecutionStatus: CronTaskRow["lastExecutionStatus"];
  lastExecutionError: string | null;
  executionCount: number;
  consecutiveFailures: number;
  errorCount: number;
}): CronTaskRow {
  const createdAt = new Date("2026-01-12T10:00:00Z");
  return {
    id: params.id,
    shortId: params.id,
    routeId: params.routeId,
    displayName: params.displayName,
    description: null,
    version: "1",
    category: params.category,
    schedule: params.schedule,
    timezone: "UTC",
    enabled: true,
    hidden: false,
    priority: CronTaskPriority.MEDIUM,
    timeout: 300000,
    retries: 3,
    retryDelay: 5000,
    outputMode: TaskOutputMode.NOTIFY_ON_FAILURE,
    owner: { type: "system" },
    lastExecutedAt: params.lastExecutedAt,
    lastExecutionStatus: params.lastExecutionStatus,
    lastExecutionError: params.lastExecutionError,
    lastExecutionDuration: 1200,
    nextExecutionAt: params.nextExecutionAt,
    executionCount: params.executionCount,
    consecutiveFailures: params.consecutiveFailures,
    successCount: params.executionCount - params.errorCount,
    errorCount: params.errorCount,
    averageExecutionTime: 1100,
    taskInput: {},
    runOnce: false,
    notificationTargets: [],
    targetInstance: null,
    tags: [],
    createdAt,
    updatedAt: createdAt,
  };
}

function mkSshExecMsg(params: {
  id: string;
  threadId: string;
  sequenceId: string;
  toolCallId: string;
  command: string;
  output: string;
  executionTime: number;
}): ChatMessage {
  return mkDemoToolMsg<CortexExecEndpoint>({
    id: params.id,
    threadId: params.threadId,
    sequenceId: params.sequenceId,
    toolCallId: params.toolCallId,
    toolName: "cortex-exec",
    args: { path: "/ssh/prod-1", command: params.command },
    result: {
      output: params.output,
      exitCode: 0,
      cwd: "/srv/app",
      terminalId: "3f0c9a52-7d1e-4b8a-9c2f-5e6a1b0d4c71",
      backend: ExecBackend.SSH,
      truncated: false,
    },
    executionTime: params.executionTime,
  });
}

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

  const taskListTool = mkDemoToolMsg<TaskListEndpoint>({
    id: "heartbeat-tasks",
    threadId: tid,
    sequenceId: seq,
    toolCallId: "toolu_tasks1",
    toolName: "task-list",
    args: {
      enabled: CronTaskEnabledFilter.ALL,
      hidden: CronTaskHiddenFilter.VISIBLE,
      sort: "name_asc",
      limit: "20",
    },
    result: {
      tasks: [
        mkCronTaskRow({
          id: "email-send-daily",
          routeId: "email-campaigns",
          displayName: "Daily digest email",
          schedule: "0 6 * * *",
          category: TaskCategory.SYSTEM,
          lastExecutedAt: "2026-03-29T06:00:00Z",
          nextExecutionAt: "2026-03-30T06:00:00Z",
          lastExecutionStatus: CronTaskStatus.FAILED,
          lastExecutionError: t("home.personal.demos.heartbeat.taskError"),
          executionCount: 88,
          consecutiveFailures: 3,
          errorCount: 3,
        }),
        mkCronTaskRow({
          id: "db-backup",
          routeId: "cortex-exec",
          displayName: "Nightly database backup",
          schedule: "0 3 * * *",
          category: TaskCategory.DATABASE,
          lastExecutedAt: "2026-03-29T03:00:00Z",
          nextExecutionAt: "2026-03-30T03:00:00Z",
          lastExecutionStatus: CronTaskStatus.COMPLETED,
          lastExecutionError: null,
          executionCount: 88,
          consecutiveFailures: 0,
          errorCount: 0,
        }),
        mkCronTaskRow({
          id: "memory-cleanup",
          routeId: "ai-run",
          displayName: "Memory archival",
          schedule: "0 22 * * *",
          category: TaskCategory.MAINTENANCE,
          lastExecutedAt: "2026-03-28T22:00:00Z",
          nextExecutionAt: "2026-03-29T22:00:00Z",
          lastExecutionStatus: CronTaskStatus.COMPLETED,
          lastExecutionError: null,
          executionCount: 87,
          consecutiveFailures: 0,
          errorCount: 0,
        }),
      ],
      totalTasks: 3,
      countsByStatus: {
        all: 3,
        running: 0,
        completed: 2,
        failed: 1,
        pending: 0,
        disabled: 0,
      },
      countsByHidden: { visible: 3, hidden: 0, all: 3 },
    },
    executionTime: 280,
  });

  const reasoning2 = mkAssistantMsg(
    "heartbeat-reasoning2",
    tid,
    seq,
    t("home.personal.demos.heartbeat.reasoning2"),
  );

  const memoryQuery = t("home.personal.demos.heartbeat.memoryQuery");
  const memoryTool = mkDemoToolMsg<CortexSearchEndpoint>({
    id: "heartbeat-memory",
    threadId: tid,
    sequenceId: seq,
    toolCallId: "toolu_mem1",
    toolName: "cortex-search",
    args: { query: memoryQuery, path: "/memories", maxResults: 5 },
    result: {
      responseQuery: memoryQuery,
      results: [
        {
          resultPath: "/memories/ops/email-smtp-playbook.md",
          excerpt: t("home.personal.demos.heartbeat.memoryResult"),
          score: 0.94,
          updatedAt: new Date("2026-02-10T09:00:00Z"),
        },
      ],
      total: 1,
      searchMode: "hybrid",
    },
    executionTime: 290,
  });

  const reasoning3 = mkAssistantMsg(
    "heartbeat-reasoning3",
    tid,
    seq,
    t("home.personal.demos.heartbeat.reasoning3"),
  );

  const codingTool = mkDemoToolMsg<CodingAgentEndpoint>({
    id: "heartbeat-code",
    threadId: tid,
    sequenceId: seq,
    toolCallId: "toolu_cc1",
    toolName: "coding-agent",
    args: {
      prompt: t("home.personal.demos.heartbeat.taskInput"),
      provider: "claude-code",
      interactiveMode: false,
      taskTitle: t("home.personal.demos.heartbeat.taskTitle"),
    },
    result: {
      output: t("home.personal.demos.heartbeat.taskOutput"),
      durationMs: 11800,
    },
    executionTime: 11800,
  });

  // `rebuild` is not AI-callable - the AI rebuilds through its SSH terminal.
  const rebuildTool = mkSshExecMsg({
    id: "heartbeat-rebuild",
    threadId: tid,
    sequenceId: seq,
    toolCallId: "toolu_rebuild1",
    command: "vibe rebuild",
    output: t("home.personal.demos.heartbeat.rebuildOutput"),
    executionTime: 18600,
  });

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

  const pullTool = mkSshExecMsg({
    id: "ssh-pull",
    threadId: tid,
    sequenceId: seq,
    toolCallId: "toolu_ssh1",
    command:
      "cd /srv/app && git pull origin main && bun install --frozen-lockfile",
    output:
      "Updating 4f2a91c..9be07d3\nFast-forward\n src/agent/models/models.ts | 3 +--\n 1 file changed, 1 insertion(+), 2 deletions(-)\nbun install v1.2.4\nChecked 812 installs across 903 packages (no changes)",
    executionTime: 1240,
  });

  const restartTool = mkSshExecMsg({
    id: "ssh-restart",
    threadId: tid,
    sequenceId: seq,
    toolCallId: "toolu_ssh2",
    command: "pm2 reload ecosystem.config.js --update-env",
    output:
      "[PM2] Applying action reloadProcessId on app [unbottled-ai](ids: [ 0, 1 ])\n[PM2] [unbottled-ai](0) ✓\n[PM2] [unbottled-ai](1) ✓\n[PM2] Done. Zero-downtime reload complete.",
    executionTime: 3100,
  });

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

  const codingTool = mkDemoToolMsg<CodingAgentEndpoint>({
    id: "cc-spawn",
    threadId: tid,
    sequenceId: seq,
    toolCallId: "toolu_cc2",
    toolName: "coding-agent",
    args: {
      prompt: t("home.personal.demos.claudeCode.taskInput"),
      provider: "claude-code",
      interactiveMode: false,
      taskTitle: "Build HackerNews digest tool",
    },
    result: {
      output:
        "Created: hackernews/top endpoint + daily cron wired at 08:00. Character filter set for TypeScript, self-hosting, AI. First digest queued for tomorrow.",
      durationMs: 31200,
    },
    executionTime: 31200,
  });

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
// DemoVisual - shared tab + chat renderer
// ---------------------------------------------------------------------------

type PersonalDemoId = "heartbeat" | "ssh" | "claudeCode";
const PERSONAL_DEMOS: PersonalDemoId[] = ["heartbeat", "ssh", "claudeCode"];

function PersonalDemoVisual({
  locale,
}: {
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const logger = useLogger();
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
      mkUserMsg({
        id: `personal-user-${activeId}`,
        threadId: `demo-personal-${activeId}`,
        content: userMessages[activeId],
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
          <StaticUserMessageBubble
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
          />
          <AnimatePresence mode="wait" initial={false}>
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
                ttsAutoplay={false}
                voiceId={undefined}
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
