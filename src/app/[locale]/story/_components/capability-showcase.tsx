"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Globe } from "next-vibe-ui/ui/icons/Globe";
import { Lock } from "next-vibe-ui/ui/icons/Lock";
import { ShieldPlus } from "next-vibe-ui/ui/icons/ShieldPlus";
import { Sparkles } from "next-vibe-ui/ui/icons/Sparkles";
import { Users } from "next-vibe-ui/ui/icons/Users";
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
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import {
  ChatModelId,
  FEATURED_MODELS,
} from "@/app/api/[locale]/agent/ai-stream/models";
import { configScopedTranslation } from "@/config/i18n";

import { scopedTranslation } from "./i18n";
import { MockChatProvider } from "./mock-chat-provider";

type ScopedT = ReturnType<(typeof scopedTranslation)["scopedT"]>["t"];

interface CapabilityShowcaseProps {
  locale: CountryLanguage;
  totalToolCount: number;
  totalModelCount: number;
  totalProviderCount: number;
}

interface CapabilityBlockProps {
  label: string;
  title: string;
  description: string;
  visual: ReactNode;
  reversed: boolean;
  delay: number;
}

function CapabilityBlock({
  label,
  title,
  description,
  visual,
  reversed,
  delay,
}: CapabilityBlockProps): JSX.Element {
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
          <Span className="text-sm font-medium text-primary uppercase tracking-wider mb-3 block">
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
// Mock message helpers
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
  extra?: Partial<ChatMessage["metadata"]> & { model?: ChatMessage["model"] },
): ChatMessage {
  const { model: modelOverride, ...metaExtra } = extra ?? {};
  return baseMockMsg({
    id,
    threadId: tid,
    role: ChatMessageRole.ASSISTANT,
    content,
    parentId: "user",
    depth: 1,
    sequenceId: seq,
    isAI: true,
    model: modelOverride ?? ChatModelId.CLAUDE_OPUS_4_6,
    metadata: { ...metaExtra },
  });
}

// ---------------------------------------------------------------------------
// Memory demo - context-aware follow-up (search-memory tool call)
// ---------------------------------------------------------------------------

function buildMemoryContextGroup(t: ScopedT): MessageGroup {
  const tid = "demo-memory-context";
  const seq = "memory-context-seq";

  const reasoning = mkAssistantMsg(
    tid,
    tid,
    seq,
    t("home.capabilities.memory.demos.context.reasoning"),
  );

  const memoryTool = mkToolMsg(
    "context-memory-search",
    tid,
    seq,
    "toolu_mem1",
    "memories-search",
    { query: t("home.capabilities.memory.demos.context.searchQuery") },
    {
      results: [
        {
          memoryNumber: 1,
          content: t("home.capabilities.memory.demos.context.memoryResult"),
          tags: ["investor-call", "objections", "follow-up"],
          priority: 85,
          isArchived: false,
          createdAt: "2026-03-18T14:30:00Z",
        },
      ],
      total: 1,
    },
    320,
  );

  const response = mkAssistantMsg(
    "context-response",
    tid,
    seq,
    t("home.capabilities.memory.demos.context.summaryResponse"),
    { promptTokens: 2100, completionTokens: 160 },
  );

  return {
    primary: reasoning,
    continuations: [memoryTool, response],
    sequenceId: seq,
  };
}

// ---------------------------------------------------------------------------
// Memory demo - project continuation (search-memory tool call)
// ---------------------------------------------------------------------------

function buildMemoryProjectGroup(t: ScopedT): MessageGroup {
  const tid = "demo-memory-project";
  const seq = "memory-project-seq";

  const reasoning = mkAssistantMsg(
    tid,
    tid,
    seq,
    t("home.capabilities.memory.demos.project.reasoning"),
  );

  const memoryTool = mkToolMsg(
    "project-memory-search",
    tid,
    seq,
    "toolu_mem2",
    "memories-search",
    { query: t("home.capabilities.memory.demos.project.searchQuery") },
    {
      results: [
        {
          memoryNumber: 2,
          content: t("home.capabilities.memory.demos.project.memoryResult"),
          tags: ["launch-plan", "progress", "pricing"],
          priority: 90,
          isArchived: false,
          createdAt: "2026-03-22T09:15:00Z",
        },
      ],
      total: 1,
    },
    290,
  );

  const response = mkAssistantMsg(
    "project-response",
    tid,
    seq,
    t("home.capabilities.memory.demos.project.summaryResponse"),
    { promptTokens: 1900, completionTokens: 200 },
  );

  return {
    primary: reasoning,
    continuations: [memoryTool, response],
    sequenceId: seq,
  };
}

// ---------------------------------------------------------------------------
// Search demo - live news (web-search with real results)
// ---------------------------------------------------------------------------

function buildSearchNewsGroup(t: ScopedT): MessageGroup {
  const tid = "demo-search-news";
  const seq = "search-news-seq";

  const reasoning1 = mkAssistantMsg(
    tid,
    tid,
    seq,
    t("home.capabilities.search.demos.news.reasoning1"),
  );

  const searchTool = mkToolMsg(
    "news-search",
    tid,
    seq,
    "toolu_search1",
    "brave-search",
    {
      query: t("home.capabilities.search.demos.news.searchQuery"),
      maxResults: 5,
    },
    {
      results: [
        {
          title: t("home.capabilities.search.demos.news.result1Title"),
          url: "https://www.skyscanner.com/transport/flights/",
          snippet: t("home.capabilities.search.demos.news.result1Snippet"),
          age: "live",
          source: "Skyscanner",
        },
        {
          title: t("home.capabilities.search.demos.news.result2Title"),
          url: "https://www.kayak.com/flights/",
          snippet: t("home.capabilities.search.demos.news.result2Snippet"),
          age: "live",
          source: "Kayak",
        },
        {
          title: t("home.capabilities.search.demos.news.result3Title"),
          url: "https://www.google.com/travel/flights",
          snippet: t("home.capabilities.search.demos.news.result3Snippet"),
          age: "live",
          source: "Google Flights",
        },
      ],
    },
    920,
  );

  const reasoning2 = mkAssistantMsg(
    "news-reasoning2",
    tid,
    seq,
    t("home.capabilities.search.demos.news.reasoning2"),
  );

  const fetchTool = mkToolMsg(
    "news-fetch",
    tid,
    seq,
    "toolu_fetch_news1",
    "fetch-url-content",
    { url: "https://www.kayak.com/flights/" },
    {
      message:
        "Successfully fetched content from: https://www.kayak.com/flights/",
      content: t("home.capabilities.search.demos.news.fetchContent"),
      fetchedUrl: "https://www.kayak.com/flights/",
      statusCode: 200,
      timeElapsed: 1340,
    },
    1340,
  );

  const response = mkAssistantMsg(
    "news-response",
    tid,
    seq,
    t("home.capabilities.search.demos.news.summaryResponse"),
    { promptTokens: 2100, completionTokens: 180 },
  );

  return {
    primary: reasoning1,
    continuations: [searchTool, reasoning2, fetchTool, response],
    sequenceId: seq,
  };
}

// ---------------------------------------------------------------------------
// Search demo - deep read (web-search → fetch-url-content chain)
// ---------------------------------------------------------------------------

function buildSearchDeepReadGroup(t: ScopedT): MessageGroup {
  const tid = "demo-search-deep";
  const seq = "search-deep-seq";

  const reasoning1 = mkAssistantMsg(
    tid,
    tid,
    seq,
    t("home.capabilities.search.demos.deepRead.reasoning1"),
  );

  const searchTool = mkToolMsg(
    "deep-search",
    tid,
    seq,
    "toolu_search2",
    "brave-search",
    {
      query: t("home.capabilities.search.demos.deepRead.searchQuery"),
      maxResults: 4,
    },
    {
      results: [
        {
          title: t("home.capabilities.search.demos.deepRead.result1Title"),
          url: "https://www.tripadvisor.com/Restaurant_Review-123456",
          snippet: t("home.capabilities.search.demos.deepRead.result1Snippet"),
          age: "3 days ago",
          source: "TripAdvisor",
        },
        {
          title: t("home.capabilities.search.demos.deepRead.result2Title"),
          url: "https://www.yelp.com/biz/trattoria-roma-123",
          snippet: t("home.capabilities.search.demos.deepRead.result2Snippet"),
          age: "1 week ago",
          source: "Yelp",
        },
      ],
    },
    870,
  );

  const reasoning2 = mkAssistantMsg(
    "deep-reasoning2",
    tid,
    seq,
    t("home.capabilities.search.demos.deepRead.reasoning2"),
  );

  const fetchTool = mkToolMsg(
    "deep-fetch",
    tid,
    seq,
    "toolu_fetch1",
    "fetch-url-content",
    { url: "https://www.tripadvisor.com/Restaurant_Review-123456" },
    {
      message:
        "Successfully fetched content from: https://www.tripadvisor.com/Restaurant_Review-123456",
      content: t("home.capabilities.search.demos.deepRead.fetchContent"),
      fetchedUrl: "https://www.tripadvisor.com/Restaurant_Review-123456",
      statusCode: 200,
      timeElapsed: 1480,
    },
    1480,
  );

  const response = mkAssistantMsg(
    "deep-response",
    tid,
    seq,
    t("home.capabilities.search.demos.deepRead.summaryResponse"),
    { promptTokens: 2800, completionTokens: 220 },
  );

  return {
    primary: reasoning1,
    continuations: [searchTool, reasoning2, fetchTool, response],
    sequenceId: seq,
  };
}

// ---------------------------------------------------------------------------
// Search demo - compare two angles (two web-searches)
// ---------------------------------------------------------------------------

function buildSearchCompareGroup(t: ScopedT): MessageGroup {
  const tid = "demo-search-compare";
  const seq = "search-compare-seq";

  const reasoning1 = mkAssistantMsg(
    tid,
    tid,
    seq,
    t("home.capabilities.search.demos.compare.reasoning1"),
  );

  const search1Tool = mkToolMsg(
    "compare-search1",
    tid,
    seq,
    "toolu_search3a",
    "brave-search",
    {
      query: t("home.capabilities.search.demos.compare.searchQuery1"),
      maxResults: 4,
    },
    {
      results: [
        {
          title: t("home.capabilities.search.demos.compare.result1aTitle"),
          url: "https://www.gsmarena.com/iphone_16_review-123",
          snippet: t("home.capabilities.search.demos.compare.result1aSnippet"),
          age: "2 months ago",
          source: "GSMArena",
        },
        {
          title: t("home.capabilities.search.demos.compare.result1bTitle"),
          url: "https://www.theverge.com/iphone-16-review",
          snippet: t("home.capabilities.search.demos.compare.result1bSnippet"),
          age: "2 months ago",
          source: "The Verge",
        },
      ],
    },
    910,
  );

  const reasoning2 = mkAssistantMsg(
    "compare-reasoning2",
    tid,
    seq,
    t("home.capabilities.search.demos.compare.reasoning2"),
  );

  const search2Tool = mkToolMsg(
    "compare-search2",
    tid,
    seq,
    "toolu_search3b",
    "brave-search",
    {
      query: t("home.capabilities.search.demos.compare.searchQuery2"),
      maxResults: 4,
    },
    {
      results: [
        {
          title: t("home.capabilities.search.demos.compare.result2aTitle"),
          url: "https://www.macrumors.com/iphone-17-rumors",
          snippet: t("home.capabilities.search.demos.compare.result2aSnippet"),
          age: "1 week ago",
          source: "MacRumors",
        },
        {
          title: t("home.capabilities.search.demos.compare.result2bTitle"),
          url: "https://9to5mac.com/iphone-17-release-date",
          snippet: t("home.capabilities.search.demos.compare.result2bSnippet"),
          age: "3 days ago",
          source: "9to5Mac",
        },
      ],
    },
    940,
  );

  const response = mkAssistantMsg(
    "compare-response",
    tid,
    seq,
    t("home.capabilities.search.demos.compare.summaryResponse"),
    { promptTokens: 2800, completionTokens: 240 },
  );

  return {
    primary: reasoning1,
    continuations: [search1Tool, reasoning2, search2Tool, response],
    sequenceId: seq,
  };
}

// ---------------------------------------------------------------------------
// Memory Visual with tabs
// ---------------------------------------------------------------------------

type MemoryDemoId = "context" | "project";
const MEMORY_DEMOS: MemoryDemoId[] = ["context", "project"];

function MemoryVisual({ locale }: { locale: CountryLanguage }): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const logger = useMemo(
    () => createEndpointLogger(false, Date.now(), locale),
    [locale],
  );
  const [activeId, setActiveId] = useState<MemoryDemoId>("context");

  const handleSelect = useCallback((id: MemoryDemoId) => {
    setActiveId(id);
  }, []);

  const userMessages: Record<MemoryDemoId, string> = useMemo(
    () => ({
      context: t("home.capabilities.memory.demos.context.userMessage"),
      project: t("home.capabilities.memory.demos.project.userMessage"),
    }),
    [t],
  );

  const groups: Record<MemoryDemoId, MessageGroup> = useMemo(
    () => ({
      context: buildMemoryContextGroup(t),
      project: buildMemoryProjectGroup(t),
    }),
    [t],
  );

  const userMsg = useMemo(
    () =>
      baseMockMsg({
        id: `memory-user-${activeId}`,
        threadId: `demo-memory-${activeId}`,
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
        {MEMORY_DEMOS.map((id) => (
          <Button
            key={id}
            variant="ghost"
            size="sm"
            onClick={() => handleSelect(id)}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-medium transition-all",
              activeId === id
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {t(`home.capabilities.memory.demos.${id}.tab`)}
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
// Models Visual - tier badges + censorship demo using real message components
// ---------------------------------------------------------------------------

type CensorDemoId = "mainstream" | "open" | "uncensored";

function buildModelsDemoGroup(
  t: ScopedT,
  activeId: CensorDemoId,
  appName: string,
): MessageGroup {
  const tid = `demo-models-${activeId}`;
  const seq = `models-${activeId}-seq`;
  const model =
    activeId === "mainstream"
      ? ChatModelId.GPT_5_4
      : activeId === "open"
        ? ChatModelId.KIMI_K2_5
        : ChatModelId.UNCENSORED_LM_V1_2;
  const content =
    activeId === "mainstream"
      ? t("home.capabilities.models.demo.mainstreamResponse")
      : activeId === "open"
        ? t("home.capabilities.models.demo.openResponse")
        : t("home.capabilities.models.demo.uncensoredResponse");

  if (activeId === "open") {
    const reasoning = mkAssistantMsg(
      `models-open-reasoning`,
      tid,
      seq,
      t("home.capabilities.models.demo.openReasoning", { appName }),
      { model },
    );
    const response = mkAssistantMsg(`models-open-response`, tid, seq, content, {
      model,
      promptTokens: 390,
      completionTokens: 85,
    });
    return { primary: reasoning, continuations: [response], sequenceId: seq };
  }

  const response = mkAssistantMsg(
    `models-${activeId}-response`,
    tid,
    seq,
    content,
    {
      model,
      promptTokens: activeId === "mainstream" ? 420 : 380,
      completionTokens: activeId === "mainstream" ? 60 : 95,
    },
  );
  return { primary: response, continuations: [], sequenceId: seq };
}

function ModelsVisual({ locale }: { locale: CountryLanguage }): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  const logger = useMemo(
    () => createEndpointLogger(false, Date.now(), locale),
    [locale],
  );
  const [activeId, setActiveId] = useState<CensorDemoId>("mainstream");

  const handleSelect = useCallback((id: CensorDemoId) => {
    setActiveId(id);
  }, []);

  const tiers: {
    id: CensorDemoId;
    name: string;
    className: string;
    activeRingClass: string;
    models: string;
  }[] = [
    {
      id: "mainstream",
      name: "Mainstream",
      className:
        "bg-indigo-50 dark:bg-indigo-500/15 text-indigo-800 dark:text-indigo-200 border-indigo-200 dark:border-indigo-500/30",
      activeRingClass: "ring-2 ring-indigo-500",
      models: FEATURED_MODELS.mainstream.join(", "),
    },
    {
      id: "open",
      name: "Open",
      className:
        "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-500/30",
      activeRingClass: "ring-2 ring-emerald-500",
      models: FEATURED_MODELS.open.join(", "),
    },
    {
      id: "uncensored",
      name: "Uncensored",
      className:
        "bg-rose-50 dark:bg-rose-500/15 text-rose-800 dark:text-rose-200 border-rose-200 dark:border-rose-500/30",
      activeRingClass: "ring-2 ring-rose-500",
      models: FEATURED_MODELS.uncensored.join(", "),
    },
  ];

  const userMsg = useMemo(
    () =>
      baseMockMsg({
        id: `models-user-${activeId}`,
        threadId: `demo-models-${activeId}`,
        role: ChatMessageRole.USER,
        content: t("home.capabilities.models.demo.userQuestion"),
        parentId: null,
        depth: 0,
        sequenceId: null,
        isAI: false,
        model: null,
        metadata: {},
      }),
    [activeId, t],
  );

  const group = useMemo(
    () => buildModelsDemoGroup(t, activeId, appName),
    [t, activeId, appName],
  );

  return (
    <Div className="space-y-5">
      {/* Tier badges - click to switch demo */}
      <Div className="space-y-3">
        {tiers.map((tier) => (
          <Button
            key={tier.id}
            variant="ghost"
            onClick={() => handleSelect(tier.id)}
            className={cn(
              "w-full justify-start text-left rounded-lg border p-4 h-auto transition-all",
              tier.className,
              activeId === tier.id ? tier.activeRingClass : "hover:opacity-80",
            )}
          >
            <Div className="w-full">
              <Div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4" />
                <Span className="font-semibold text-sm">{tier.name}</Span>
              </Div>
              <P className="text-sm opacity-90 whitespace-normal text-left">
                {tier.models}
              </P>
            </Div>
          </Button>
        ))}
      </Div>

      {/* Censorship demo - same question, real message components */}
      <Div>
        <Div className="flex items-center justify-between mb-3">
          <Span className="text-xs font-mono text-muted-foreground">
            {t("home.capabilities.models.demo.question")}
          </Span>
          <Div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSelect("mainstream")}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-all h-auto",
                activeId === "mainstream"
                  ? "bg-indigo-600 text-white hover:bg-indigo-600"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {t("home.capabilities.models.demo.mainstreamTab")}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSelect("open")}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-all h-auto",
                activeId === "open"
                  ? "bg-emerald-600 text-white hover:bg-emerald-600"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {t("home.capabilities.models.demo.openTab")}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSelect("uncensored")}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-all h-auto",
                activeId === "uncensored"
                  ? "bg-rose-600 text-white hover:bg-rose-600"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {t("home.capabilities.models.demo.uncensoredTab")}
            </Button>
          </Div>
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
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <GroupedAssistantMessage
                  group={group}
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
    </Div>
  );
}

// ---------------------------------------------------------------------------
// Search Visual with tabs
// ---------------------------------------------------------------------------

type SearchDemoId = "news" | "deepRead" | "compare";
const SEARCH_DEMOS: SearchDemoId[] = ["news", "deepRead", "compare"];

function SearchVisual({ locale }: { locale: CountryLanguage }): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const logger = useMemo(
    () => createEndpointLogger(false, Date.now(), locale),
    [locale],
  );
  const [activeId, setActiveId] = useState<SearchDemoId>("news");

  const handleSelect = useCallback((id: SearchDemoId) => {
    setActiveId(id);
  }, []);

  const userMessages: Record<SearchDemoId, string> = useMemo(
    () => ({
      news: t("home.capabilities.search.demos.news.userMessage"),
      deepRead: t("home.capabilities.search.demos.deepRead.userMessage"),
      compare: t("home.capabilities.search.demos.compare.userMessage"),
    }),
    [t],
  );

  const groups: Record<SearchDemoId, MessageGroup> = useMemo(
    () => ({
      news: buildSearchNewsGroup(t),
      deepRead: buildSearchDeepReadGroup(t),
      compare: buildSearchCompareGroup(t),
    }),
    [t],
  );

  const userMsg = useMemo(
    () =>
      baseMockMsg({
        id: `search-user-${activeId}`,
        threadId: `demo-search-${activeId}`,
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
        {SEARCH_DEMOS.map((id) => (
          <Button
            key={id}
            variant="ghost"
            size="sm"
            onClick={() => handleSelect(id)}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-medium transition-all",
              activeId === id
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {t(`home.capabilities.search.demos.${id}.tab`)}
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
// Privacy Visual - matches real folder bar colors/icons
// ---------------------------------------------------------------------------

function PrivacyVisual({ locale }: { locale: CountryLanguage }): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);

  const levels = [
    {
      key: "private" as const,
      icon: Lock,
      iconClass: "text-sky-600 dark:text-sky-300",
      bgClass:
        "bg-sky-50 dark:bg-sky-500/15 border-sky-200 dark:border-sky-500/30",
    },
    {
      key: "shared" as const,
      icon: Users,
      iconClass: "text-teal-600 dark:text-teal-300",
      bgClass:
        "bg-teal-50 dark:bg-teal-500/15 border-teal-200 dark:border-teal-500/30",
    },
    {
      key: "public" as const,
      icon: Globe,
      iconClass: "text-amber-600 dark:text-amber-300",
      bgClass:
        "bg-amber-50 dark:bg-amber-500/15 border-amber-200 dark:border-amber-500/30",
    },
    {
      key: "incognito" as const,
      icon: ShieldPlus,
      iconClass: "text-purple-600 dark:text-purple-300",
      bgClass:
        "bg-purple-50 dark:bg-purple-500/15 border-purple-200 dark:border-purple-500/30",
    },
  ];

  return (
    <Div className="space-y-3">
      {levels.map((level) => (
        <Div
          key={level.key}
          className={`flex items-center gap-4 rounded-lg border p-4 ${level.bgClass}`}
        >
          <level.icon className={`h-5 w-5 shrink-0 ${level.iconClass}`} />
          <Div>
            <P className="font-medium text-sm">
              {t(`home.capabilities.privacy.levels.${level.key}.name`)}
            </P>
            <P className="text-xs text-muted-foreground">
              {t(`home.capabilities.privacy.levels.${level.key}.desc`)}
            </P>
          </Div>
        </Div>
      ))}
    </Div>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function CapabilityShowcase({
  locale,
  totalModelCount,
  totalProviderCount,
}: CapabilityShowcaseProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const [ref] = useInView({ triggerOnce: true, threshold: 0.05 });

  const interpolation = {
    modelCount: totalModelCount,
    providerCount: totalProviderCount,
  };

  return (
    <Div className="relative overflow-hidden" ref={ref as never}>
      <Div className="container relative px-4 md:px-6">
        <CapabilityBlock
          label={t("home.capabilities.models.label")}
          title={t("home.capabilities.models.title", interpolation)}
          description={t("home.capabilities.models.description", interpolation)}
          visual={<ModelsVisual locale={locale} />}
          reversed={false}
          delay={0}
        />

        <CapabilityBlock
          label={t("home.capabilities.memory.label")}
          title={t("home.capabilities.memory.title")}
          description={t("home.capabilities.memory.description")}
          visual={<MemoryVisual locale={locale} />}
          reversed={true}
          delay={0}
        />

        <CapabilityBlock
          label={t("home.capabilities.search.label")}
          title={t("home.capabilities.search.title")}
          description={t("home.capabilities.search.description")}
          visual={<SearchVisual locale={locale} />}
          reversed={false}
          delay={0}
        />

        <CapabilityBlock
          label={t("home.capabilities.privacy.label")}
          title={t("home.capabilities.privacy.title")}
          description={t("home.capabilities.privacy.description")}
          visual={<PrivacyVisual locale={locale} />}
          reversed={true}
          delay={0}
        />
      </Div>
    </Div>
  );
}
