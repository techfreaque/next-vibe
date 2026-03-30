"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Code } from "next-vibe-ui/ui/icons/Code";
import { MessageSquare } from "next-vibe-ui/ui/icons/MessageSquare";
import { Link } from "next-vibe-ui/ui/link";
import { MotionDiv } from "next-vibe-ui/ui/motion";
import { Span } from "next-vibe-ui/ui/span";
import { H1, P } from "next-vibe-ui/ui/typography";
import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";
import { useCallback, useMemo, useState } from "react";

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

interface HeroProps {
  locale: CountryLanguage;
  totalToolCount: number;
  totalModelCount: number;
  totalSkillCount: number;
}

type DemoId =
  | "modelComparison"
  | "research"
  | "featureShipped"
  | "weeklyReport";

interface DemoData {
  skillBadge: string;
  modelBadge: string;
  userMessage: ChatMessage;
  assistantGroup: MessageGroup;
}

/**
 * Shared base fields for mock ChatMessage objects.
 */
function baseMockMessage(overrides: {
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

function toolMsg(
  id: string,
  threadId: string,
  sequenceId: string,
  model: ChatMessage["model"],
  toolCallId: string,
  toolName: string,
  args: ToolCallResult,
  result: ToolCallResult,
  executionTime: number,
): ChatMessage {
  return baseMockMessage({
    id,
    threadId,
    role: ChatMessageRole.TOOL,
    content: null,
    parentId: "user",
    depth: 1,
    sequenceId,
    isAI: true,
    model,
    metadata: {
      toolCall: { toolCallId, toolName, args, result, executionTime },
    },
  });
}

function assistantMsg(
  id: string,
  threadId: string,
  sequenceId: string,
  model: ChatMessage["model"],
  content: string,
  extra?: Partial<ChatMessage["metadata"]>,
): ChatMessage {
  return baseMockMessage({
    id,
    threadId,
    role: ChatMessageRole.ASSISTANT,
    content,
    parentId: "user",
    depth: 1,
    sequenceId,
    isAI: true,
    model,
    metadata: { ...extra },
  });
}

// ============================================================================
// Demo builders
// ============================================================================

function buildModelComparisonDemo(t: ScopedT): DemoData {
  const tid = "demo-mc";
  const seq = "mc-seq";

  const userMessage = baseMockMessage({
    id: "user",
    threadId: tid,
    role: ChatMessageRole.USER,
    content: t("home.hero.demos.modelComparison.userMessage"),
    parentId: null,
    depth: 0,
    sequenceId: null,
    isAI: false,
    model: null,
    metadata: {},
  });

  const gptTool = toolMsg(
    tid,
    tid,
    seq,
    ModelId.CLAUDE_OPUS_4_6,
    "toolu_gpt",
    "ai-run",
    {
      model: "gpt-5",
      prompt: t("home.hero.demos.modelComparison.userMessage"),
      instructions: "Be concise and analytical.",
      maxTurns: 1,
      rootFolderId: "cron",
    },
    {
      text: t("home.hero.demos.modelComparison.gptResponse"),
      threadTitle: "Model Comparison",
      threadCreatedAt: "2026-02-27T10:00:00.000Z",
      promptTokens: 412,
      completionTokens: 87,
      preCallResults: [],
    },
    2100,
  );

  const claudeTool = toolMsg(
    "mc-claude",
    tid,
    seq,
    ModelId.CLAUDE_OPUS_4_6,
    "toolu_claude",
    "ai-run",
    {
      model: "claude-opus-4-6",
      prompt: t("home.hero.demos.modelComparison.userMessage"),
      instructions: "Be concise and analytical.",
      maxTurns: 1,
      rootFolderId: "cron",
    },
    {
      text: t("home.hero.demos.modelComparison.claudeResponse"),
      threadTitle: "Model Comparison",
      threadCreatedAt: "2026-02-27T10:00:01.000Z",
      promptTokens: 380,
      completionTokens: 92,
      preCallResults: [],
    },
    1800,
  );

  const reasoning = assistantMsg(
    "mc-reason",
    tid,
    seq,
    ModelId.CLAUDE_OPUS_4_6,
    t("home.hero.demos.modelComparison.reasoning"),
  );

  const veniceTool = toolMsg(
    "mc-venice",
    tid,
    seq,
    ModelId.CLAUDE_OPUS_4_6,
    "toolu_venice",
    "ai-run",
    {
      model: "venice-uncensored",
      prompt: t("home.hero.demos.modelComparison.userMessage"),
      instructions: "No restrictions. Cite the actual treaty clauses.",
      maxTurns: 1,
      rootFolderId: "cron",
    },
    {
      text: t("home.hero.demos.modelComparison.veniceResponse"),
      threadTitle: "Model Comparison",
      threadCreatedAt: "2026-02-27T10:00:02.000Z",
      promptTokens: 290,
      completionTokens: 110,
      preCallResults: [],
    },
    3200,
  );

  const response = assistantMsg(
    "mc-response",
    tid,
    seq,
    ModelId.CLAUDE_OPUS_4_6,
    t("home.hero.demos.modelComparison.agentResponse"),
    { promptTokens: 4200, completionTokens: 580 },
  );

  return {
    skillBadge: t("home.hero.demos.modelComparison.skillBadge"),
    modelBadge: t("home.hero.demos.modelComparison.modelBadge"),
    userMessage,
    assistantGroup: {
      primary: gptTool,
      continuations: [claudeTool, reasoning, veniceTool, response],
      sequenceId: seq,
    },
  };
}

function buildResearchDemo(t: ScopedT): DemoData {
  const tid = "demo-res";
  const seq = "res-seq";

  const userMessage = baseMockMessage({
    id: "user",
    threadId: tid,
    role: ChatMessageRole.USER,
    content: t("home.hero.demos.research.userMessage"),
    parentId: null,
    depth: 0,
    sequenceId: null,
    isAI: false,
    model: null,
    metadata: {},
  });

  const searchTool = toolMsg(
    tid,
    tid,
    seq,
    ModelId.CLAUDE_OPUS_4_6,
    "toolu_search",
    "brave-search",
    { query: "Portugal D7 visa freelancer 2026 tax NHR", maxResults: 5 },
    {
      results: [
        {
          title: "Portugal Digital Nomad Guide 2026",
          url: "https://example.com/portugal-nomad-2026",
          snippet:
            "Complete guide to D7 visa, NHR tax regime, and freelancer residency in Portugal...",
          age: "3 hours ago",
          source: "NomadGuide",
        },
      ],
    },
    1400,
  );

  const memoryTool = toolMsg(
    "res-mem",
    tid,
    seq,
    ModelId.CLAUDE_OPUS_4_6,
    "toolu_mem",
    "memories-list",
    {},
    {
      memories: [
        {
          memoryNumber: 0,
          content: "Budget ~300k, prefer coastal, freelancer",
          tags: ["relocation", "preferences"],
          priority: 0,
          isPublic: false,
          isShared: false,
          isArchived: false,
          createdAt: "2026-01-15T00:00:00Z",
        },
      ],
    },
    200,
  );

  const reasoning = assistantMsg(
    "res-reason",
    tid,
    seq,
    ModelId.CLAUDE_OPUS_4_6,
    t("home.hero.demos.research.searchReasoning"),
  );

  const fetchTool = toolMsg(
    "res-fetch",
    tid,
    seq,
    ModelId.CLAUDE_OPUS_4_6,
    "toolu_fetch",
    "fetch-url-content",
    { url: "https://nomadlist.com/portugal" },
    {
      message:
        "Successfully fetched content from: https://nomadlist.com/portugal",
      content:
        "# Portugal for Digital Nomads\n\nCost of living, visa info, coworking spaces...",
      fetchedUrl: "https://nomadlist.com/portugal",
      statusCode: 200,
      timeElapsed: 2100,
    },
    2100,
  );

  const response = assistantMsg(
    "res-response",
    tid,
    seq,
    ModelId.CLAUDE_OPUS_4_6,
    t("home.hero.demos.research.agentResponse"),
    { promptTokens: 3100, completionTokens: 420 },
  );

  const memorySave = toolMsg(
    "res-save",
    tid,
    seq,
    ModelId.CLAUDE_OPUS_4_6,
    "toolu_save",
    "memories-add",
    {
      content: "Portugal research: D7 visa, NHR tax, Algarve pricing",
      tags: ["portugal", "relocation"],
      priority: 10,
    },
    { id: 0 },
    150,
  );

  return {
    skillBadge: t("home.hero.demos.research.skillBadge"),
    modelBadge: t("home.hero.demos.research.modelBadge"),
    userMessage,
    assistantGroup: {
      primary: searchTool,
      continuations: [memoryTool, reasoning, fetchTool, response, memorySave],
      sequenceId: seq,
    },
  };
}

function buildFeatureShippedDemo(t: ScopedT): DemoData {
  const tid = "demo-feat";
  const seq = "feat-seq";

  const userMessage = baseMockMessage({
    id: "user",
    threadId: tid,
    role: ChatMessageRole.USER,
    content: t("home.hero.demos.featureShipped.userMessage"),
    parentId: null,
    depth: 0,
    sequenceId: null,
    isAI: false,
    model: null,
    metadata: {},
  });

  const reasoning = assistantMsg(
    tid,
    tid,
    seq,
    ModelId.CLAUDE_OPUS_4_6,
    t("home.hero.demos.featureShipped.reasoning"),
  );

  const codeTool = toolMsg(
    "feat-code",
    tid,
    seq,
    ModelId.CLAUDE_OPUS_4_6,
    "toolu_code",
    "claude-code",
    {
      prompt:
        "Create hackernews/top endpoint: fetches top stories from HN Algolia API, takes limit and minScore args, returns [{title, url, score, comments, age}]. Follow the endpoint pattern with definition.ts, repository.ts, route.ts, i18n files.",
      interactiveMode: false,
    },
    {
      output: t("home.hero.demos.featureShipped.codeResult"),
      exitCode: 0,
      durationMs: 38000,
    },
    38000,
  );

  const rebuildTool = toolMsg(
    "feat-rebuild",
    tid,
    seq,
    ModelId.CLAUDE_OPUS_4_6,
    "toolu_rebuild",
    "rebuild",
    {},
    { success: t("home.hero.demos.featureShipped.deployResult") },
    42000,
  );

  const helpTool = toolMsg(
    "feat-help",
    tid,
    seq,
    ModelId.CLAUDE_OPUS_4_6,
    "toolu_help",
    "system_help_GET",
    { toolName: "hackernews-top" },
    {
      name: "hackernews-top",
      description: t("home.hero.demos.featureShipped.helpResult"),
      category: "Custom",
      method: "GET",
    },
    180,
  );

  const reasoning2 = assistantMsg(
    "feat-reason2",
    tid,
    seq,
    ModelId.CLAUDE_OPUS_4_6,
    t("home.hero.demos.featureShipped.reasoning2"),
  );

  const characterTool = toolMsg(
    "feat-char",
    tid,
    seq,
    ModelId.CLAUDE_OPUS_4_6,
    "toolu_char",
    "character-create",
    {
      name: "HN Digest",
      description:
        "Fetches top HackerNews stories, filters by your interests, emails you the best 3 with a short take on each.",
      systemPrompt:
        "You are a HackerNews curator for Max. Fetch stories via hackernews-top, filter for TypeScript, self-hosting, and AI topics, then email max@unbottled.ai the top 3 with a single compelling sentence about each. Be opinionated.",
      availableTools: [
        { toolId: "hackernews-top", requiresConfirmation: false },
        { toolId: "fetch-url-content", requiresConfirmation: false },
        { toolId: "emails_send_POST", requiresConfirmation: false },
      ],
      isPublic: false,
      category: "CUSTOM",
    },
    { id: "hn-digest" },
    290,
  );

  const reasoning3 = assistantMsg(
    "feat-reason3",
    tid,
    seq,
    ModelId.CLAUDE_OPUS_4_6,
    t("home.hero.demos.featureShipped.reasoning3"),
  );

  const cronTool = toolMsg(
    "feat-cron",
    tid,
    seq,
    ModelId.CLAUDE_OPUS_4_6,
    "toolu_cron",
    "cron-create",
    {
      routeId: "ai-run",
      displayName: "HackerNews Morning Digest",
      schedule: "0 8 * * *",
      category: "SYSTEM",
      enabled: true,
      taskInput: {
        character: "hn-digest",
        prompt:
          "Filter these stories for my interests - email me the best 3 with a one-line take on each.",
        preCalls: [{ routeId: "hackernews-top", args: { limit: 20 } }],
        maxTurns: 3,
        rootFolderId: "cron",
      },
    },
    {
      task: {
        id: "hn-digest-cron",
        routeId: "ai-run",
        displayName: "HackerNews Morning Digest",
        schedule: "0 8 * * *",
        enabled: true,
        nextExecutionAt: "2026-03-05T08:00:00.000Z",
        executionCount: 0,
      },
    },
    320,
  );

  const reasoning4 = assistantMsg(
    "feat-reason4",
    tid,
    seq,
    ModelId.CLAUDE_OPUS_4_6,
    t("home.hero.demos.featureShipped.reasoning4"),
  );

  const runTool = toolMsg(
    "feat-run",
    tid,
    seq,
    ModelId.CLAUDE_OPUS_4_6,
    "toolu_run",
    "ai-run",
    {
      character: "hn-digest",
      prompt:
        "Filter these stories for my interests - email me the best 3 with a one-line take on each.",
      preCalls: [{ routeId: "hackernews-top", args: { limit: 20 } }],
      maxTurns: 3,
      rootFolderId: "cron",
    },
    {
      text: t("home.hero.demos.featureShipped.messageResult"),
      threadTitle: "HackerNews Digest",
      threadCreatedAt: "2026-03-04T09:00:00.000Z",
      promptTokens: 1840,
      completionTokens: 210,
      preCallResults: [
        { routeId: "hackernews-top", success: true, error: null },
      ],
    },
    4200,
  );

  const response = assistantMsg(
    "feat-response",
    tid,
    seq,
    ModelId.CLAUDE_OPUS_4_6,
    t("home.hero.demos.featureShipped.agentResponse"),
    { promptTokens: 6400, completionTokens: 180 },
  );

  return {
    skillBadge: t("home.hero.demos.featureShipped.skillBadge"),
    modelBadge: t("home.hero.demos.featureShipped.modelBadge"),
    userMessage,
    assistantGroup: {
      primary: reasoning,
      continuations: [
        codeTool,
        rebuildTool,
        helpTool,
        reasoning2,
        characterTool,
        reasoning3,
        cronTool,
        reasoning4,
        runTool,
        response,
      ],
      sequenceId: seq,
    },
  };
}

function buildWeeklyReportDemo(t: ScopedT): DemoData {
  const tid = "demo-report";
  const seq = "report-seq";

  const userMessage = baseMockMessage({
    id: "user",
    threadId: tid,
    role: ChatMessageRole.USER,
    content: t("home.hero.demos.weeklyReport.userMessage"),
    parentId: null,
    depth: 0,
    sequenceId: null,
    isAI: false,
    model: null,
    metadata: {},
  });

  const reasoning = assistantMsg(
    tid,
    tid,
    seq,
    ModelId.CLAUDE_OPUS_4_6,
    t("home.hero.demos.weeklyReport.reasoning"),
  );

  const fixTool = toolMsg(
    "rpt-fix",
    tid,
    seq,
    ModelId.CLAUDE_OPUS_4_6,
    "toolu_fix",
    "claude-code",
    {
      prompt:
        "email-sync has failed 3 times with IMAP connection timeouts (from my task queue). Investigate src/app/api/[locale]/emails/imap-client/ and fix the root cause.",
      interactiveMode: false,
    },
    {
      output: t("home.hero.demos.weeklyReport.codeResult"),
      exitCode: 0,
      durationMs: 24000,
    },
    24000,
  );

  const reasoning2 = assistantMsg(
    "rpt-reason2",
    tid,
    seq,
    ModelId.CLAUDE_OPUS_4_6,
    t("home.hero.demos.weeklyReport.reasoning2"),
  );

  const rebuildTool = toolMsg(
    "rpt-rebuild",
    tid,
    seq,
    ModelId.CLAUDE_OPUS_4_6,
    "toolu_rebuild",
    "rebuild",
    {},
    {
      success: "Rebuild completed successfully. Server restarted.",
    },
    42000,
  );

  const response = assistantMsg(
    "rpt-response",
    tid,
    seq,
    ModelId.CLAUDE_OPUS_4_6,
    t("home.hero.demos.weeklyReport.agentResponse"),
    { promptTokens: 4800, completionTokens: 210 },
  );

  const emailTool = toolMsg(
    "rpt-email",
    tid,
    seq,
    ModelId.CLAUDE_OPUS_4_6,
    "toolu_email",
    "emails_send_POST",
    {
      recipient: {
        to: "max@unbottled.ai",
        toName: "Max",
      },
      emailContent: {
        subject: "email-sync fixed",
        html: "<p>email-sync fixed. Root cause: hardcoded 5s IMAP timeout overriding config. Patched, rebuilt, 47 pending emails now syncing.</p>",
        text: "email-sync fixed. Root cause: hardcoded 5s IMAP timeout overriding config. Patched, rebuilt, 47 pending emails now syncing.",
      },
      senderSettings: {
        senderName: "Thea",
      },
      campaignTracking: {},
      smsNotifications: {
        sendSmsNotification: false,
      },
    },
    {
      response: {
        deliveryStatus: {
          success: true,
          messageId: "msg_email_sync_fix_001",
          sentAt: "2026-03-01T08:14:00.000Z",
          response: "250 OK: Message accepted",
        },
        accountInfo: {
          accountId: "acc_primary",
          accountName: "Primary SMTP",
        },
        deliveryResults: {
          accepted: ["max@unbottled.ai"],
          rejected: [],
        },
        smsResult: {
          success: false,
          error: "SMS notifications disabled",
        },
      },
    },
    800,
  );

  return {
    skillBadge: t("home.hero.demos.weeklyReport.skillBadge"),
    modelBadge: t("home.hero.demos.weeklyReport.modelBadge"),
    userMessage,
    assistantGroup: {
      primary: reasoning,
      continuations: [fixTool, reasoning2, rebuildTool, response, emailTool],
      sequenceId: seq,
    },
  };
}

// ============================================================================
// Demo config
// ============================================================================

const ALL_DEMOS: DemoId[] = [
  "modelComparison",
  "research",
  "featureShipped",
  "weeklyReport",
];

function buildDemo(id: DemoId, t: ScopedT): DemoData {
  switch (id) {
    case "modelComparison":
      return buildModelComparisonDemo(t);
    case "research":
      return buildResearchDemo(t);
    case "featureShipped":
      return buildFeatureShippedDemo(t);
    case "weeklyReport":
      return buildWeeklyReportDemo(t);
  }
}

// ============================================================================
// Hero component
// ============================================================================

const Hero = ({
  locale,
  totalToolCount,
  totalModelCount,
  totalSkillCount,
}: HeroProps): JSX.Element => {
  const { t } = scopedTranslation.scopedT(locale);

  const logger = useMemo(
    () => createEndpointLogger(false, Date.now(), locale),
    [locale],
  );

  const [activeDemoId, setActiveDemoId] = useState<DemoId>("modelComparison");

  const allDemos = useMemo(() => {
    const result: Record<string, DemoData> = {};
    for (const id of ALL_DEMOS) {
      result[id] = buildDemo(id, t);
    }
    return result;
  }, [t]);

  const activeDemo = allDemos[activeDemoId]!;

  const handleSelectDemo = useCallback((id: DemoId) => {
    setActiveDemoId(id);
  }, []);

  return (
    <Div className="relative w-full overflow-hidden">
      {/* Radial glow background */}
      <Div className="absolute inset-0 bg-linear-to-br from-background via-muted/20 to-background" />
      <Div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

      {/* Subtle grid pattern */}
      <Div className="absolute inset-0 bg-[linear-gradient(to_right,#8881_1px,transparent_1px),linear-gradient(to_bottom,#8881_1px,transparent_1px)] bg-size-[64px_64px] blur-[0.5px] opacity-60" />

      <Div className="container relative px-4 py-28 md:py-36 lg:py-44">
        <MotionDiv
          className="mx-auto max-w-4xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Badge */}
          <Div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-8">
            {t("home.hero.badge")}
          </Div>

          {/* Main heading */}
          <H1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl mb-6">
            {t("home.hero.title")}
          </H1>

          {/* Subtitle */}
          <P className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            {t("home.hero.subtitle", {
              modelCount: totalModelCount,
              skillCount: totalSkillCount,
              toolCount: totalToolCount,
            })}
          </P>

          {/* CTA buttons */}
          <Div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              size="lg"
              className="text-base h-12 px-8 w-full sm:w-auto"
              asChild
            >
              <Link href={`/${locale}/threads`}>
                <MessageSquare className="mr-2 h-5 w-5" />
                {t("home.hero.cta")}
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base h-12 px-8 w-full sm:w-auto"
              asChild
            >
              <Link href="https://github.com/techfreaque/next-vibe">
                <Code className="mr-2 h-5 w-5" />
                {t("home.hero.secondaryCta")}
              </Link>
            </Button>
          </Div>

          {/* Demo scenario selector - all 4 visible */}
          <Div className="flex flex-wrap justify-center gap-2 mb-6">
            {ALL_DEMOS.map((id) => (
              <Button
                key={id}
                variant="ghost"
                size="sm"
                onClick={() => handleSelectDemo(id)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-medium transition-all",
                  activeDemoId === id
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {t(`home.hero.demoLabels.${id}`)}
              </Button>
            ))}
          </Div>

          {/* Chat demo - uses the REAL chat components with mock data */}
          <MotionDiv
            className="mx-auto max-w-2xl rounded-lg border bg-card/80 backdrop-blur-sm overflow-hidden text-left shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          >
            {/* Chat header */}
            <Div className="flex items-center justify-between px-4 py-2 border-b bg-muted/20">
              <Div className="flex items-center gap-2">
                <Div className="w-2 h-2 rounded-full bg-green-500" />
                <Span className="text-xs font-medium">
                  {activeDemo.skillBadge}
                </Span>
              </Div>
              <Span className="text-xs text-muted-foreground">
                {activeDemo.modelBadge}
              </Span>
            </Div>

            {/* Message area - real components, mock data */}
            <MockChatProvider>
              <Div className="p-4 space-y-1">
                <UserMessageBubble
                  message={activeDemo.userMessage}
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
                <GroupedAssistantMessage
                  group={activeDemo.assistantGroup}
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
              </Div>
            </MockChatProvider>
          </MotionDiv>
        </MotionDiv>
      </Div>
    </Div>
  );
};

export default Hero;
