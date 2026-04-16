"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { AnimatePresence, MotionDiv } from "next-vibe-ui/ui/motion";
import { Span } from "next-vibe-ui/ui/span";
import { H3, P } from "next-vibe-ui/ui/typography";
import { cn } from "next-vibe/shared/utils";
import type { JSX, ReactNode } from "react";
import { useCallback, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";

import { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";
import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import type { ChatMessage } from "@/app/api/[locale]/agent/chat/db";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";
import { ChatMessageRole } from "@/app/api/[locale]/agent/chat/enum";
import { GroupedAssistantMessage } from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/widget/grouped-assistant-message";
import type { MessageGroup } from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/widget/message-grouping";
import { StaticUserMessageBubble } from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/widget/user-message-bubble";
import { useLogger } from "@/hooks/use-logger";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation } from "./i18n";
import { MockChatProvider } from "./mock-chat-provider";

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
// Mock helpers
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
  args: WidgetData,
  result: WidgetData,
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
    model: ChatModelId.CLAUDE_OPUS_4_6,
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
    model: ChatModelId.CLAUDE_OPUS_4_6,
    metadata: { ...meta },
  });
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

  const codingTool = mkToolMsg(
    "nv-scaffold",
    tid,
    seq,
    "toolu_scaffold1",
    "coding-agent",
    {
      prompt:
        "Build the subscriptions endpoint: list active subscriptions with billing status. Three files: definition.ts (Zod schema, allowedRoles ADMIN), repository.ts (Drizzle query, returns ResponseType), route.ts (endpointsHandler). Run vibe check when done.",
      provider: "claude-code",
      interactiveMode: false,
      taskTitle: "Build subscriptions endpoint",
    },
    {
      output:
        "Created 3 files:\n  src/app/api/[locale]/agent/subscriptions/definition.ts\n  src/app/api/[locale]/agent/subscriptions/repository.ts\n  src/app/api/[locale]/agent/subscriptions/route.ts\nvibe check: 0 errors.",
      durationMs: 22400,
    },
    22400,
  );

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

// Cron: AI uses execute-tool (the universal executor) to create a cron job
function buildCronGroup(t: ScopedT): MessageGroup {
  const tid = "demo-nextvibe-cron";
  const seq = "cron-seq";

  const reasoning = mkAssistantMsg(
    tid,
    tid,
    seq,
    t("home.nextvibe.demos.cron.reasoning"),
  );

  const cronTool = mkToolMsg(
    "nv-cron-create",
    tid,
    seq,
    "toolu_cron1",
    "execute-tool",
    {
      toolName: "cron-create",
      input: {
        routeId: "cron-steps",
        displayName: "Daily trial expiry digest",
        schedule: "0 8 * * *",
        enabled: true,
        taskInput: {
          steps: [
            {
              type: "call",
              routeId: "subscriptions-list_GET",
              args: { status: "trialing", expiresWithinDays: 3 },
            },
            {
              type: "ai_agent",
              model: "claude-sonnet-4-6",
              character: "thea",
              prompt:
                "Trials expiring in 3 days: $step_0_result. Draft and send a digest email to the admin summarising who is expiring and when.",
              threadMode: "none",
            },
          ],
        },
      },
    },
    {
      result: {
        task: {
          id: "cron_trial_digest",
          shortId: "td1",
          routeId: "cron-steps",
          displayName: "Daily trial expiry digest",
          schedule: "0 8 * * *",
          enabled: true,
          hidden: false,
          priority: 5,
          version: 1,
          timezone: "UTC",
        },
      },
    },
    580,
  );

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
      baseMockMsg({
        id: `nextvibe-user-${activeId}`,
        threadId: `demo-nextvibe-${activeId}`,
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
      <Div className="container relative px-4 md:px-6">
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
