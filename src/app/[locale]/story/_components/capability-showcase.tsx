"use client";

import { Div } from "next-vibe-ui/ui/div";
import { Bot } from "next-vibe-ui/ui/icons/Bot";
import { Brain } from "next-vibe-ui/ui/icons/Brain";
import { Globe } from "next-vibe-ui/ui/icons/Globe";
import { Lock } from "next-vibe-ui/ui/icons/Lock";
import { Shield } from "next-vibe-ui/ui/icons/Shield";
import { Sparkles } from "next-vibe-ui/ui/icons/Sparkles";
import { Terminal } from "next-vibe-ui/ui/icons/Terminal";
import { Zap } from "next-vibe-ui/ui/icons/Zap";
import { MotionDiv } from "next-vibe-ui/ui/motion";
import { Span } from "next-vibe-ui/ui/span";
import { H2, H3, P } from "next-vibe-ui/ui/typography";
import type { JSX, ReactNode } from "react";
import { useMemo } from "react";
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
import {
  ModelId,
  TOTAL_CHARACTER_COUNT,
  TOTAL_MODEL_COUNT,
} from "@/app/api/[locale]/agent/models/models";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation } from "./i18n";
import { MockChatProvider } from "./mock-chat-provider";

type ScopedT = ReturnType<(typeof scopedTranslation)["scopedT"]>["t"];

interface CapabilityShowcaseProps {
  locale: CountryLanguage;
  totalToolCount: number;
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
        {/* Text side */}
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

        {/* Visual side */}
        <Div className={reversed ? "md:[direction:ltr]" : ""}>{visual}</Div>
      </MotionDiv>
    </Div>
  );
}

// ---------------------------------------------------------------------------
// Mock message helpers (same pattern as hero.tsx)
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
  extra?: Partial<ChatMessage["metadata"]>,
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
    metadata: { ...extra },
  });
}

function buildPulseFixGroup(t: ScopedT): MessageGroup {
  const tid = "demo-pulse";
  const seq = "pulse-seq";

  // Thea's AI heartbeat: sees house hunt in memories → searches listings → emails best matches
  const reasoning = mkAssistantMsg(
    tid,
    tid,
    seq,
    t("home.capabilities.autonomous.reasoning"),
  );

  const searchTool = mkToolMsg(
    "pulse-search",
    tid,
    seq,
    "toolu_search",
    "web-search",
    {
      query: "Haus kaufen München 4 Zimmer Garten bis 800000 Euro neu",
      maxResults: 5,
    },
    {
      results: [
        {
          title: "Neuhausen: Einfamilienhaus 5 Zimmer, Garten, 749.000 €",
          url: "https://www.immobilienscout24.de/expose/123456",
          snippet:
            "Großzügiges Einfamilienhaus in Neuhausen, 5 Zimmer, 160m², Garten 200m². Ruhige Lage, U-Bahn 5 min.",
          age: "3 hours ago",
          source: "ImmobilienScout24",
        },
        {
          title: "Schwabing: Stadthaus 4 Zimmer, Dachterrasse, 795.000 €",
          url: "https://www.immowelt.de/expose/789012",
          snippet:
            "Modernes Stadthaus in Schwabing, 4 Zimmer, 140m², große Dachterrasse. Toplage.",
          age: "6 hours ago",
          source: "Immowelt",
        },
        {
          title: "Pasing: Reihenmittelhaus 4 Zimmer, Garten, 690.000 €",
          url: "https://www.immobilienscout24.de/expose/345678",
          snippet:
            "Gepflegtes Reihenmittelhaus in Pasing, 4 Zimmer, 130m², Garten 120m². S-Bahn direkt.",
          age: "9 hours ago",
          source: "ImmobilienScout24",
        },
      ],
    },
    1400,
  );

  const fetchTool = mkToolMsg(
    "pulse-fetch",
    tid,
    seq,
    "toolu_fetch",
    "fetch-url-content",
    { url: "https://www.immobilienscout24.de/expose/123456" },
    {
      message:
        "Successfully fetched content from: https://www.immobilienscout24.de/expose/123456",
      content:
        "# Neuhausen: Einfamilienhaus\n\n5 Zimmer · 160m² · Garten 200m² · Baujahr 1998 · renoviert 2021\nHeizung: Wärmepumpe · KfW 85\nKontakt: Makler Schmidt, 089-123456",
      fetchedUrl: "https://www.immobilienscout24.de/expose/123456",
      statusCode: 200,
      timeElapsed: 1800,
    },
    1800,
  );

  const emailTool = mkToolMsg(
    "pulse-email",
    tid,
    seq,
    "toolu_email",
    "emails_send_POST",
    {
      recipient: {
        to: "max@unbottled.ai",
        toName: "Max",
      },
      emailContent: {
        subject: t("home.capabilities.autonomous.emailSubject"),
        html: "<p>3 new Munich listings matching your criteria. Neuhausen looks strongest - 5 rooms, garden, 749k, listed 3h ago. Details inside.</p>",
        text: "3 new Munich listings matching your criteria. Neuhausen looks strongest - 5 rooms, garden, 749k, listed 3h ago. Details inside.",
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
          messageId: "msg_house_hunt_001",
          sentAt: "2026-02-27T06:14:00.000Z",
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
    900,
  );

  const response = mkAssistantMsg(
    "pulse-response",
    tid,
    seq,
    t("home.capabilities.autonomous.summaryResponse"),
    { promptTokens: 2800, completionTokens: 220 },
  );

  return {
    primary: reasoning,
    continuations: [searchTool, fetchTool, emailTool, response],
    sequenceId: seq,
  };
}

function AutonomousVisual({
  locale,
}: {
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const logger = useMemo(
    () => createEndpointLogger(false, Date.now(), locale),
    [locale],
  );
  const group = useMemo(() => buildPulseFixGroup(t), [t]);
  const pulseUserMsg = useMemo(
    () =>
      baseMockMsg({
        id: "pulse-user",
        threadId: "demo-pulse",
        role: ChatMessageRole.USER,
        content: t("home.capabilities.autonomous.pulseAlert"),
        parentId: null,
        depth: 0,
        sequenceId: null,
        isAI: false,
        model: null,
        metadata: {},
      }),
    [t],
  );

  return (
    <MockChatProvider>
      <Div className="rounded-lg border bg-card/50 overflow-hidden p-4 space-y-1">
        <UserMessageBubble
          message={pulseUserMsg}
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
          ttsVoice={undefined}
          onVote={null}
          userVote={null}
          voteScore={0}
        />
      </Div>
    </MockChatProvider>
  );
}

function ModelsVisual(): JSX.Element {
  const tiers = [
    {
      name: "Mainstream",
      color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      models: "GPT-5, Claude, Gemini",
    },
    {
      name: "Open",
      color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      models: "DeepSeek, Grok, Qwen, GLM",
    },
    {
      name: "Uncensored",
      color: "bg-red-500/20 text-red-400 border-red-500/30",
      models: "Venice, FreedomGPT, Gab",
    },
  ];

  return (
    <Div className="space-y-4">
      {tiers.map((tier) => (
        <Div key={tier.name} className={`rounded-lg border p-4 ${tier.color}`}>
          <Div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4" />
            <Span className="font-semibold text-sm">{tier.name}</Span>
          </Div>
          <P className="text-sm opacity-80">{tier.models}</P>
        </Div>
      ))}
    </Div>
  );
}

function ToolsVisual(): JSX.Element {
  const tools = [
    { icon: Terminal, label: "SSH & Shell" },
    { icon: Globe, label: "Browser" },
    { icon: Zap, label: "Email" },
    { icon: Brain, label: "Memory" },
    { icon: Bot, label: "Sub-agents" },
    { icon: Shield, label: "Search" },
  ];

  return (
    <Div className="grid grid-cols-3 gap-3">
      {tools.map((item) => (
        <Div
          key={item.label}
          className="rounded-lg border bg-card/50 p-4 flex flex-col items-center gap-2 text-center"
        >
          <item.icon className="h-6 w-6 text-primary" />
          <Span className="text-xs font-medium text-muted-foreground">
            {item.label}
          </Span>
        </Div>
      ))}
    </Div>
  );
}

function PrivacyVisual(): JSX.Element {
  const levels = [
    {
      name: "Private",
      desc: "Server-stored, your eyes only",
      icon: Lock,
      opacity: "opacity-100",
    },
    {
      name: "Shared",
      desc: "Collaborative access",
      icon: Bot,
      opacity: "opacity-85",
    },
    {
      name: "Public",
      desc: "Community forum",
      icon: Globe,
      opacity: "opacity-70",
    },
    {
      name: "Incognito",
      desc: "Never leaves browser",
      icon: Shield,
      opacity: "opacity-100 text-green-500",
    },
  ];

  return (
    <Div className="space-y-3">
      {levels.map((level) => (
        <Div
          key={level.name}
          className="flex items-center gap-4 rounded-lg border bg-card/50 p-4"
        >
          <level.icon className={`h-5 w-5 shrink-0 ${level.opacity}`} />
          <Div>
            <P className="font-medium text-sm">{level.name}</P>
            <P className="text-xs text-muted-foreground">{level.desc}</P>
          </Div>
        </Div>
      ))}
    </Div>
  );
}

export function CapabilityShowcase({
  locale,
  totalToolCount,
}: CapabilityShowcaseProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });

  const interpolation = {
    modelCount: TOTAL_MODEL_COUNT,
    skillCount: TOTAL_CHARACTER_COUNT,
    toolCount: totalToolCount,
  };

  return (
    <Div className="relative overflow-hidden" ref={ref as never}>
      <Div className="container relative px-4 md:px-6">
        <MotionDiv
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <H2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            {t("home.agent.title")}
          </H2>
        </MotionDiv>

        <CapabilityBlock
          label={t("home.capabilities.autonomous.label")}
          title={t("home.capabilities.autonomous.title")}
          description={t(
            "home.capabilities.autonomous.description",
            interpolation,
          )}
          visual={<AutonomousVisual locale={locale} />}
          reversed={false}
          delay={0}
        />

        <CapabilityBlock
          label={t("home.capabilities.models.label")}
          title={t("home.capabilities.models.title", interpolation)}
          description={t("home.capabilities.models.description")}
          visual={<ModelsVisual />}
          reversed={true}
          delay={0}
        />

        <CapabilityBlock
          label={t("home.capabilities.tools.label")}
          title={t("home.capabilities.tools.title")}
          description={t("home.capabilities.tools.description")}
          visual={<ToolsVisual />}
          reversed={false}
          delay={0}
        />

        <CapabilityBlock
          label={t("home.capabilities.privacy.label")}
          title={t("home.capabilities.privacy.title")}
          description={t("home.capabilities.privacy.description")}
          visual={<PrivacyVisual />}
          reversed={true}
          delay={0}
        />
      </Div>
    </Div>
  );
}
