"use client";
import type codingAgentDefinitions from "next-vibe/agent/coding-agent/definition";
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
import type cronTasksDefinitions from "next-vibe/tasks/cron/tasks/definition";
import {
  CronTaskPriority,
  TaskCategory,
  TaskOutputMode,
} from "next-vibe/tasks/enum";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import type { JSX, ReactNode } from "react";
import { useCallback, useMemo, useState } from "react";

import { SubscriptionStatusAdminFilter } from "@/subscription/admin/enum";

import {
  mkAssistantMsg,
  mkDemoExecuteToolMsg,
  mkDemoToolMsg,
  mkUserMsg,
} from "./demo-messages";
import { scopedTranslation } from "./i18n";
import { MockChatProvider } from "./mock-chat-provider";

type CodingAgentEndpoint = typeof codingAgentDefinitions.POST;
type CronCreateEndpoint = typeof cronTasksDefinitions.POST;

type ScopedT = ReturnType<(typeof scopedTranslation)["scopedT"]>["t"];

interface NextVibeShowcaseProps {
  locale: CountryLanguage;
}

interface NextVibeBlockProps {
  label: string;
  title: string;
  description: string;
  visual: ReactNode;
  reversed: boolean;
  delay: number;
}

function NextVibeBlock({
  label,
  title,
  description,
  visual,
  reversed,
  delay,
}: NextVibeBlockProps): JSX.Element {
  return (
    <Div className="py-16 md:py-24">
      <MotionDiv
        className={`grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center ${reversed ? "md:[direction:rtl]" : ""}`}
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay }}
      >
        <Div className={reversed ? "md:[direction:ltr]" : ""}>
          <Span className="text-sm font-medium text-cyan-500 uppercase tracking-wider mb-3 block">
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

// Scaffold: user asks Thea to build a new feature, she delegates to Claude Code
function buildEndpointGroup(t: ScopedT): MessageGroup {
  const tid = "demo-nextvibe-endpoint";
  const seq = "endpoint-seq";

  const reasoning = mkAssistantMsg(
    tid,
    tid,
    seq,
    t("home.nextvibe.demos.endpoint.reasoning"),
  );

  const codingTool = mkDemoToolMsg<CodingAgentEndpoint>({
    id: "nv-scaffold",
    threadId: tid,
    sequenceId: seq,
    toolCallId: "toolu_scaffold1",
    toolName: "coding-agent",
    args: {
      prompt:
        "Build the subscriptions endpoint: list active subscriptions with billing status. Three files: definition.ts (Zod schema, allowedRoles ADMIN), repository.ts (Drizzle query, returns ResponseType), route.ts (endpointsHandler). Run vibe check when done.",
      provider: "claude-code",
      interactiveMode: false,
      taskTitle: "Build subscriptions endpoint",
    },
    result: {
      output:
        "Created 3 files:\n  src/app/subscriptions/definition.ts\n  src/app/subscriptions/repository.ts\n  src/app/subscriptions/route.ts\nvibe check: 0 errors.",
      durationMs: 22400,
    },
    executionTime: 22400,
  });

  const response = mkAssistantMsg(
    "endpoint-response",
    tid,
    seq,
    t("home.nextvibe.demos.endpoint.summaryResponse"),
    { promptTokens: 740, completionTokens: 95 },
  );

  return {
    primary: reasoning,
    continuations: [codingTool, response],
    sequenceId: seq,
  };
}

// Surfaces: no tool needed - Thea explains what the endpoint became (pure reasoning)
function buildSurfacesGroup(t: ScopedT): MessageGroup {
  const tid = "demo-nextvibe-surfaces";
  const seq = "surfaces-seq";

  const reasoning = mkAssistantMsg(
    tid,
    tid,
    seq,
    t("home.nextvibe.demos.surfaces.reasoning"),
  );

  const response = mkAssistantMsg(
    "surfaces-response",
    tid,
    seq,
    t("home.nextvibe.demos.surfaces.summaryResponse"),
    { promptTokens: 520, completionTokens: 180 },
  );

  return {
    primary: reasoning,
    continuations: [response],
    sequenceId: seq,
  };
}

// Cron: AI uses execute-tool (the universal executor) to schedule an
// ai-run that pre-fetches trialing subscriptions and drafts the digest.
function buildCronGroup(t: ScopedT): MessageGroup {
  const tid = "demo-nextvibe-cron";
  const seq = "cron-seq";

  const reasoning = mkAssistantMsg(
    tid,
    tid,
    seq,
    t("home.nextvibe.demos.cron.reasoning"),
  );

  const displayName = "Daily trial expiry digest";
  const schedule = "0 8 * * *";
  const taskInput = {
    skill: "thea",
    prompt:
      "Trials expiring in the next 3 days are in the pre-call result. Draft and send a digest email to the admin: who is expiring and when.",
    preCalls: [
      {
        routeId: "subscription-admin-list",
        args: {
          searchFilters: { status: [SubscriptionStatusAdminFilter.TRIALING] },
        },
      },
    ],
    maxTurns: 5,
  };
  const createdAt = new Date("2026-03-29T09:12:00Z");

  const cronTool = mkDemoExecuteToolMsg<CronCreateEndpoint>({
    id: "nv-cron-create",
    threadId: tid,
    sequenceId: seq,
    toolCallId: "toolu_cron1",
    innerToolName: "cron-create",
    input: {
      routeId: "ai-run",
      displayName,
      schedule,
      priority: CronTaskPriority.MEDIUM,
      category: TaskCategory.SYSTEM,
      enabled: true,
      hidden: false,
      outputMode: TaskOutputMode.NOTIFY_ON_FAILURE,
      timeout: 300000,
      retries: 3,
      retryDelay: 5000,
      taskInput,
      runOnce: false,
    },
    result: {
      task: {
        id: "cron_trial_digest",
        shortId: "td1",
        routeId: "ai-run",
        displayName,
        description: null,
        version: "1",
        category: TaskCategory.SYSTEM,
        schedule,
        timezone: "UTC",
        enabled: true,
        hidden: false,
        priority: CronTaskPriority.MEDIUM,
        timeout: 300000,
        retries: 3,
        retryDelay: 5000,
        taskInput,
        runOnce: false,
        outputMode: TaskOutputMode.NOTIFY_ON_FAILURE,
        owner: { type: "user", userId: "00000000-0000-0000-0000-000000000000" },
        notificationTargets: [],
        lastExecutedAt: null,
        lastExecutionStatus: null,
        lastExecutionError: null,
        lastExecutionDuration: null,
        nextExecutionAt: "2026-03-30T08:00:00Z",
        executionCount: 0,
        consecutiveFailures: 0,
        successCount: 0,
        errorCount: 0,
        averageExecutionTime: null,
        targetInstance: null,
        tags: [],
        createdAt,
        updatedAt: createdAt,
      },
    },
    executionTime: 580,
  });

  const response = mkAssistantMsg(
    "cron-response",
    tid,
    seq,
    t("home.nextvibe.demos.cron.summaryResponse"),
    { promptTokens: 880, completionTokens: 75 },
  );

  return {
    primary: reasoning,
    continuations: [cronTool, response],
    sequenceId: seq,
  };
}

// ---------------------------------------------------------------------------
// DemoVisual
// ---------------------------------------------------------------------------

type NextVibeDemoId = "endpoint" | "surfaces" | "cron";
const NEXTVIBE_DEMOS: NextVibeDemoId[] = ["endpoint", "surfaces", "cron"];

function NextVibeDemoVisual({
  locale,
}: {
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const logger = useLogger();
  const [activeId, setActiveId] = useState<NextVibeDemoId>("endpoint");

  const handleSelect = useCallback((id: NextVibeDemoId) => {
    setActiveId(id);
  }, []);

  const userMessages: Record<NextVibeDemoId, string> = useMemo(
    () => ({
      endpoint: t("home.nextvibe.demos.endpoint.userMessage"),
      surfaces: t("home.nextvibe.demos.surfaces.userMessage"),
      cron: t("home.nextvibe.demos.cron.userMessage"),
    }),
    [t],
  );

  const groups: Record<NextVibeDemoId, MessageGroup> = useMemo(
    () => ({
      endpoint: buildEndpointGroup(t),
      surfaces: buildSurfacesGroup(t),
      cron: buildCronGroup(t),
    }),
    [t],
  );

  const userMsg = useMemo(
    () =>
      mkUserMsg({
        id: `nextvibe-user-${activeId}`,
        threadId: `demo-nextvibe-${activeId}`,
        content: userMessages[activeId],
      }),
    [activeId, userMessages],
  );

  return (
    <Div>
      <Div className="flex flex-wrap gap-2 mb-4">
        {NEXTVIBE_DEMOS.map((id) => (
          <Button
            key={id}
            variant="ghost"
            size="sm"
            onClick={() => handleSelect(id)}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-medium transition-all",
              activeId === id
                ? "bg-cyan-600 text-white hover:bg-cyan-600"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {t(`home.nextvibe.demos.${id}.tab`)}
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

export function NextVibeShowcase({
  locale,
}: NextVibeShowcaseProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);

  return (
    <Div className="relative overflow-hidden">
      <Div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
        <NextVibeBlock
          label={t("home.nextvibe.frameworkAdmin.label")}
          title={t("home.nextvibe.frameworkAdmin.title")}
          description={t("home.nextvibe.frameworkAdmin.description")}
          visual={<NextVibeDemoVisual locale={locale} />}
          reversed={false}
          delay={0}
        />
      </Div>
    </Div>
  );
}
