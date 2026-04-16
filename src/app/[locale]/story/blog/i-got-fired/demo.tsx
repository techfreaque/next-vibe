"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { AnimatePresence, MotionDiv } from "next-vibe-ui/ui/motion";
import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";
import { useCallback, useMemo, useState } from "react";

import { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";
import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import type { ChatMessage } from "@/app/api/[locale]/agent/chat/db";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";
import { ChatMessageRole } from "@/app/api/[locale]/agent/chat/enum";
import { GroupedAssistantMessage } from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/widget/grouped-assistant-message";
import type { MessageGroup } from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/widget/message-grouping";
import { UserMessageBubble } from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/widget/user-message-bubble";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import { useLogger } from "@/hooks/use-logger";
import type { CountryLanguage } from "@/i18n/core/config";

import { MockChatProvider } from "../../_components/mock-chat-provider";

// ---------------------------------------------------------------------------
// Helpers
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

// Demo 1: embed a contact form from Thea's instance
function buildEmbedGroup(): MessageGroup {
  const tid = "demo-blog-embed";
  const seq = "embed-seq";

  const reasoning = mkAssistantMsg(
    "embed-reasoning",
    tid,
    seq,
    "I'll call the contact form endpoint on unbottled.ai. The response includes full widget data - the same UI renders here via the platform's widget system.",
  );

  const tool = mkToolMsg(
    "embed-tool",
    tid,
    seq,
    "toolu_embed1",
    "execute-tool",
    {
      toolName: "contact_POST",
      serverUrl: "https://unbottled.ai",
    },
    {
      status: "ready",
      endpoint: "contact_POST",
      widgetData: {
        fields: ["name", "email", "subject", "message"],
        submitLabel: "Send message",
        successMessage: "Thanks - we'll get back to you within 24h.",
      },
      renderedBy: "EndpointsPage",
    },
    180,
  );

  const response = mkAssistantMsg(
    "embed-response",
    tid,
    seq,
    "Contact form is live. The widget renders directly - same definition, same UI, zero extra work. Expand the tool call to see the widget data.",
    { promptTokens: 320, completionTokens: 42 },
  );

  return {
    primary: reasoning,
    continuations: [tool, response],
    sequenceId: seq,
  };
}

// Demo 2: federated - Hermes calls a Vibe Sense graph from a remote analytics instance
function buildFederatedGroup(): MessageGroup {
  const tid = "demo-blog-federated";
  const seq = "federated-seq";

  const reasoning = mkAssistantMsg(
    "federated-reasoning",
    tid,
    seq,
    "Pulling the lead funnel graph from the analytics instance. Different server, different database - same tool interface.",
  );

  const tool = mkToolMsg(
    "federated-tool",
    tid,
    seq,
    "toolu_fed1",
    "execute-tool",
    {
      toolName: "vibe-sense_graph_GET",
      serverUrl: "https://analytics.unbottled.ai",
      input: { id: "lead-funnel-q1" },
    },
    {
      graphId: "lead-funnel-q1",
      title: "Lead funnel - Q1 2026",
      nodes: 8,
      edges: 11,
      liveData: true,
      lastUpdated: "2026-03-29T09:47:33Z",
      renderedBy: "EndpointsPage",
      serverUrl: "https://analytics.unbottled.ai",
    },
    390,
  );

  const response = mkAssistantMsg(
    "federated-response",
    tid,
    seq,
    "Graph loaded from the analytics instance. The widget renders the live data - the tool runs on its server, the UI appears here. No shared state between instances.",
    { promptTokens: 440, completionTokens: 55 },
  );

  return {
    primary: reasoning,
    continuations: [tool, response],
    sequenceId: seq,
  };
}

// Demo 3: full remote execution chain - Hermes calls Thea, Thea processes, result + widget back
function buildRemoteGroup(): MessageGroup {
  const tid = "demo-blog-remote";
  const seq = "remote-seq";

  const reasoning = mkAssistantMsg(
    "remote-reasoning",
    tid,
    seq,
    "Calling pulse-execute on Thea's instance to check the task health state. She owns the task runner - I route the call to her.",
  );

  const remoteTool = mkToolMsg(
    "remote-tool",
    tid,
    seq,
    "toolu_remote1",
    "execute-tool",
    {
      toolName: "pulse-execute",
      serverUrl: "https://unbottled.ai",
      input: { dryRun: false },
    },
    {
      status: "warning",
      activeTasks: 5,
      totalTasks: 14,
      failedTasks: [
        {
          id: "task-price-sync-008",
          name: "model-price-sync",
          lastError: "OpenRouter API returned 429 - rate limited",
          failedAt: "2026-03-29T09:01:44Z",
        },
      ],
      executedBy: "https://unbottled.ai",
      widgetRenderedBy: "EndpointsPage",
    },
    520,
  );

  const response = mkAssistantMsg(
    "remote-response",
    tid,
    seq,
    "Thea's pulse ran on her instance. One task is rate-limited on model price sync. I can see her full widget output - expand the tool call. The server that owns the tool owns the UI.",
    { promptTokens: 680, completionTokens: 72 },
  );

  return {
    primary: reasoning,
    continuations: [remoteTool, response],
    sequenceId: seq,
  };
}

// ---------------------------------------------------------------------------
// Exported component
// ---------------------------------------------------------------------------

type DemoId = "embed" | "federated" | "remote";
const DEMOS: DemoId[] = ["embed", "federated", "remote"];
const DEMO_LABELS: Record<DemoId, string> = {
  embed: "Embed a widget",
  federated: "Federated instances",
  remote: "Remote tool call",
};
const DEMO_USER_MSGS: Record<DemoId, string> = {
  embed: "Show the contact form from unbottled.ai on this page.",
  federated: "Pull the Q1 lead funnel graph from the analytics instance.",
  remote: "Check Thea's task health and report back.",
};

export function VibeFrameDemo({
  locale,
}: {
  locale: CountryLanguage;
}): JSX.Element {
  const logger = useLogger();
  const [activeId, setActiveId] = useState<DemoId>("embed");
  const handleSelect = useCallback((id: DemoId) => setActiveId(id), []);

  const groups = useMemo<Record<DemoId, MessageGroup>>(
    () => ({
      embed: buildEmbedGroup(),
      federated: buildFederatedGroup(),
      remote: buildRemoteGroup(),
    }),
    [],
  );

  const userMsg = useMemo(
    () =>
      baseMockMsg({
        id: `blog-user-${activeId}`,
        threadId: `demo-blog-${activeId}`,
        role: ChatMessageRole.USER,
        content: DEMO_USER_MSGS[activeId],
        parentId: null,
        depth: 0,
        sequenceId: null,
        isAI: false,
        model: null,
        metadata: {},
      }),
    [activeId],
  );

  return (
    <Div>
      <Div className="flex flex-wrap gap-2 mb-4">
        {DEMOS.map((id) => (
          <Button
            key={id}
            variant="ghost"
            size="sm"
            onClick={() => handleSelect(id)}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-medium transition-all",
              activeId === id
                ? "bg-purple-700 text-white hover:bg-purple-700"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200",
            )}
          >
            {DEMO_LABELS[id]}
          </Button>
        ))}
      </Div>
      <MockChatProvider>
        <Div className="rounded-lg border border-gray-700 bg-gray-900/50 overflow-hidden p-4 space-y-1">
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
