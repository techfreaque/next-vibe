"use client";

import { ChatModelId } from "next-vibe/agent/ai-stream/models";
import type { ModelCountsByContentLevel } from "next-vibe/agent/models/all-models";
import { GroupedAssistantMessage } from "next-vibe/agent/chat/threads/[threadId]/messages/widget/grouped-assistant-message";
import { StaticUserMessageBubble } from "next-vibe/agent/chat/threads/[threadId]/messages/widget/user-message-bubble";
import { DefaultFolderId } from "next-vibe/core/execution-context";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { Platform } from "next-vibe/platforms/platforms";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ArrowRight } from "next-vibe/ui/components/icons/ArrowRight";
import { Globe } from "next-vibe/ui/components/icons/Globe";
import { MessageSquare } from "next-vibe/ui/components/icons/MessageSquare";
import { ShieldOff } from "next-vibe/ui/components/icons/ShieldOff";
import { ShieldPlus } from "next-vibe/ui/components/icons/ShieldPlus";
import { Link } from "next-vibe/ui/components/link";
import { Section } from "next-vibe/ui/components/section";
import { Span } from "next-vibe/ui/components/span";
import { H1, P } from "next-vibe/ui/components/typography";
import { useLogger } from "next-vibe/ui/hooks/use-logger";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import type { JSX } from "react";
import { useState } from "react";

import { mkAssistantMsg, mkUserMsg } from "./demo-messages";
import { scopedTranslation } from "./i18n";
import { MockChatProvider } from "./mock-chat-provider";

interface HomeHeroProps {
  locale: CountryLanguage;
  totalToolCount: number;
  totalModelCount: number;
  totalProviderCount: number;
  modelCountsByTier: ModelCountsByContentLevel;
  onSeeHow: () => void;
}

/**
 * Home hero v2: one message, one primary action, a real-looking product preview.
 */
export function HomeHero({
  locale,
  totalToolCount,
  totalModelCount,
  totalProviderCount,
  modelCountsByTier,
  onSeeHow,
}: HomeHeroProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);

  const stats = [
    t("home.splitHero.stats.models", { count: String(totalModelCount) }),
    t("home.splitHero.stats.providers", {
      count: String(totalProviderCount),
    }),
    t("home.splitHero.stats.tools", { count: String(totalToolCount) }),
    t("home.splitHero.stats.noCard"),
  ];

  return (
    <>
      <Section className="relative overflow-hidden border-b border-border/60">
        {/* Soft brand glow + faint grid - decorative only */}
        <Div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,hsl(var(--primary)/0.14),transparent_70%)]" />
        <Div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.5)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.5)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />

        <Div className="relative mx-auto grid w-full max-w-6xl items-center gap-5 px-4 pb-16 pt-14 sm:px-6 md:pb-24 md:pt-20 lg:grid-cols-[1.1fr_1fr]">
          {/* Copy */}
          <Div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <Span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
              <Span className="h-1.5 w-1.5 rounded-full bg-success" />
              {t("home.splitHero.badge")}
            </Span>

            <H1 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {t("home.splitHero.header")}
            </H1>

            <P className="mt-5 max-w-xl text-pretty text-lg text-muted-foreground md:text-xl">
              {t("home.splitHero.subheader")}
            </P>

            <Div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button size="lg" className="h-12 gap-2 px-6 text-base" asChild>
                <Link href={`/${locale}/threads`}>
                  <MessageSquare className="h-4 w-4" />
                  {t("home.splitHero.unbottled.cta")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-6 text-base"
                onClick={onSeeHow}
              >
                {t("home.splitHero.seeHow")}
              </Button>
            </Div>

            <Div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground lg:justify-start">
              {stats.map((stat) => (
                <Span key={stat} className="inline-flex items-center gap-1.5">
                  <Span className="h-1 w-1 rounded-full bg-primary" />
                  {stat}
                </Span>
              ))}
            </Div>
          </Div>

          {/* Product preview */}
          <HeroPreview locale={locale} modelCountsByTier={modelCountsByTier} />
        </Div>
      </Section>
    </>
  );
}

const PROMPTS = ["influence", "jeffrey", "white", "nineEleven"] as const;

const DEMO_USER: JwtPayloadType = {
  isPublic: false,
  id: "00000000-0000-0000-0000-000000000000",
  leadId: "00000000-0000-0000-0000-000000000000",
  roles: [UserPermissionRole.ADMIN],
};
type PromptKey = (typeof PROMPTS)[number];

const TIERS = [
  {
    key: "mainstream",
    model: ChatModelId.CLAUDE_OPUS_5_5,
    Icon: ShieldPlus,
    dot: "bg-sky-500",
  },
  {
    key: "open",
    model: ChatModelId.KIMI_K3_1_PRO,
    Icon: Globe,
    dot: "bg-violet-500",
  },
  {
    key: "uncensored",
    model: ChatModelId.UNCENSORED_LM_V1_2,
    Icon: ShieldOff,
    dot: "bg-orange-500",
  },
] as const;
type TierKey = (typeof TIERS)[number]["key"];
type View = TierKey | "compare";

/**
 * Interactive preview: pick a question, switch the filter or compare all three
 * answers side by side, then ask it for real - the composer opens a private chat
 * with the question already typed in. No chat infrastructure, SSR-safe.
 */
function HeroPreview({
  locale,
  modelCountsByTier,
}: {
  locale: CountryLanguage;
  modelCountsByTier: ModelCountsByContentLevel;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const logger = useLogger();
  const [prompt, setPrompt] = useState<PromptKey>("influence");
  const [view, setView] = useState<View>("uncensored");

  const question = t(`home.splitHero.preview.prompts.${prompt}.question`);
  const shownTiers =
    view === "compare" ? TIERS : TIERS.filter((tier) => tier.key === view);

  return (
    <Div
      className="relative mx-auto w-full max-w-lg lg:max-w-none"
      data-testid="hero-preview"
    >
      <Div className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-primary/10 blur-2xl" />
      <Div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-xl shadow-primary/5">
        {/* Question picker */}
        <Div className="flex flex-col gap-2 border-b border-border px-4 pb-3 pt-4">
          <Div className="flex items-center justify-between gap-2">
            <Span className="text-xs font-semibold text-foreground">
              {t("home.splitHero.preview.pickQuestion")}
            </Span>
          </Div>
          <Div className="flex flex-wrap gap-1">
            {PROMPTS.map((key) => (
              <Button
                key={key}
                type="button"
                size="xs"
                variant={prompt === key ? "default" : "outline"}
                aria-pressed={prompt === key}
                className="h-8 rounded-full px-3 text-xs"
                onClick={() => setPrompt(key)}
              >
                {t(`home.splitHero.preview.prompts.${key}.label`)}
              </Button>
            ))}
          </Div>
        </Div>

        {/* Filter switcher */}
        <Div className="px-4 pt-3">
          <Div className="grid grid-cols-4 gap-1 rounded-lg bg-muted p-1">
            {TIERS.map((tier) => (
              <Button
                key={tier.key}
                type="button"
                variant="ghost"
                aria-pressed={view === tier.key}
                className={cn(
                  "flex h-auto flex-col gap-0 rounded-md px-1 py-1.5 hover:bg-card/60",
                  view === tier.key && "bg-card shadow-sm hover:bg-card",
                )}
                onClick={() => setView(tier.key)}
              >
                <Span
                  className={cn(
                    "text-xs font-medium",
                    view === tier.key
                      ? "text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {t(`home.capabilities.models.demo.${tier.key}Tab`)}
                </Span>
                <Span className="text-[10px] font-normal tabular-nums text-muted-foreground">
                  {t("home.splitHero.stats.models", {
                    count: String(modelCountsByTier[tier.key]),
                  })}
                </Span>
              </Button>
            ))}
            <Button
              type="button"
              variant="ghost"
              aria-pressed={view === "compare"}
              className={cn(
                "flex h-auto flex-col gap-0 rounded-md px-1 py-1.5 hover:bg-card/60",
                view === "compare" && "bg-card shadow-sm hover:bg-card",
              )}
              onClick={() => setView("compare")}
            >
              <Span
                className={cn(
                  "text-xs font-medium",
                  view === "compare"
                    ? "text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {t("home.splitHero.preview.compare")}
              </Span>
              <Span className="text-[10px] font-normal text-muted-foreground">
                {t("home.splitHero.preview.compareSub")}
              </Span>
            </Button>
          </Div>
        </Div>

        {/* Exchange - rendered with the real chat message components */}
        <MockChatProvider>
          <Div
            className="flex max-h-[24rem] flex-col gap-1 overflow-y-auto overscroll-contain px-3 py-3 lg:max-h-[30rem]"
            aria-live="polite"
          >
            <StaticUserMessageBubble
              message={mkUserMsg({
                id: `hero-user-${prompt}`,
                threadId: `hero-${prompt}`,
                content: question,
              })}
              locale={locale}
              logger={logger}
              rootFolderId={DefaultFolderId.PUBLIC}
              user={DEMO_USER}
            />
            {shownTiers.map((tier) => {
              const seq = `hero-${prompt}-${tier.key}`;
              const answer = mkAssistantMsg(
                seq,
                `hero-${prompt}`,
                seq,
                t(`home.splitHero.preview.prompts.${prompt}.${tier.key}`),
                { model: tier.model },
              );
              return (
                <Div
                  key={seq}
                  className="duration-300 animate-in fade-in-0 slide-in-from-bottom-1"
                >
                  <GroupedAssistantMessage
                    group={{
                      primary: answer,
                      continuations: [],
                      sequenceId: seq,
                    }}
                    locale={locale}
                    logger={logger}
                    readOnly
                    showAuthor
                    platformOverride={Platform.CLI}
                    onAnswerAsModel={null}
                    collapseState={null}
                    rootFolderId={DefaultFolderId.PUBLIC}
                    user={DEMO_USER}
                    sendMessage={null}
                    ttsAutoplay={false}
                    voiceId={undefined}
                    onVote={null}
                    userVote={null}
                    voteScore={0}
                  />
                </Div>
              );
            })}
          </Div>
        </MockChatProvider>
      </Div>
    </Div>
  );
}
