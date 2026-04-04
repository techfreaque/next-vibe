"use client";

import { cn } from "next-vibe/shared/utils";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Film } from "next-vibe-ui/ui/icons/Film";
import { Image as ImageIcon } from "next-vibe-ui/ui/icons/Image";
import { Music } from "next-vibe-ui/ui/icons/Music";
import { Span } from "next-vibe-ui/ui/span";
import { useState } from "react";
import type { JSX } from "react";

import {
  chatColors,
  chatShadows,
  chatTransitions,
} from "@/app/[locale]/chat/lib/design-tokens";
import type { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import type { ChatMessage } from "@/app/api/[locale]/agent/chat/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation } from "../i18n";
import { useMessageGroupName } from "./embedded-context";
import { FileAttachments } from "./file-attachments";
import { MessageAuthorInfo } from "./message-author";
import { TranscribingIndicator } from "./transcribing-indicator";
import { UserMessageActions } from "./user-message-actions";

interface UserMessageBubbleProps {
  message: ChatMessage;
  locale: CountryLanguage;
  logger: EndpointLogger;
  user: JwtPayloadType;
  deductCredits: ((creditCost: number, feature: string) => void) | null;
  onBranch?: (messageId: string) => void;
  onRetry?: (message: ChatMessage) => Promise<void>;
  showAuthor?: boolean;
  rootFolderId: DefaultFolderId;
  currentUserId?: string;
}

export function UserMessageBubble({
  message,
  locale,
  logger,
  user,
  deductCredits,
  onBranch,
  onRetry,
  showAuthor,
  rootFolderId,
  currentUserId,
}: UserMessageBubbleProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { group } = useMessageGroupName();
  const [showVariant, setShowVariant] = useState(false);
  const character =
    message.role === "user" || message.role === "assistant"
      ? message.skill
      : undefined;

  return (
    <Div className="flex justify-end">
      <Div className={cn("md:max-w-[75%]", group)}>
        {/* Author info (for multi-user mode) */}
        {showAuthor && (
          <Div className="mb-2 flex justify-end">
            <MessageAuthorInfo
              authorName={message.authorName ?? null}
              authorId={message.authorId}
              currentUserId={currentUserId}
              isAI={message.isAI}
              model={message.model}
              timestamp={message.createdAt}
              edited={false}
              character={character}
              locale={locale}
              compact
              rootFolderId={rootFolderId}
            />
          </Div>
        )}

        <Div
          className={cn(
            "text-foreground rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3",
            chatColors.message.user,
            chatShadows.sm,
            chatTransitions.default,
          )}
        >
          {/* Voice transcribing state */}
          {message.metadata?.isTranscribing ? (
            <TranscribingIndicator locale={locale} />
          ) : (
            <Div className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap wrap-break-word">
              {message.content}
            </Div>
          )}

          {/* File Attachments */}
          {message.metadata?.attachments &&
            message.metadata.attachments.length > 0 && (
              <Div
                className={cn(
                  message.metadata?.isUploadingAttachments && "opacity-70",
                )}
              >
                <FileAttachments attachments={message.metadata.attachments} />
                {message.metadata?.isUploadingAttachments && (
                  <Div className="text-xs text-muted-foreground mt-1 animate-pulse">
                    {t("uploadingAttachments")}
                  </Div>
                )}
              </Div>
            )}

          {/* Gap-fill live status chip */}
          {message.metadata?.gapFillStatus && (
            <GapFillStatus
              bridgeType={message.metadata.gapFillStatus.bridgeType}
              modality={message.metadata.gapFillStatus.modality}
              t={t}
            />
          )}

          {/* Gap-fill variant display */}
          {!message.metadata?.gapFillStatus &&
            message.metadata?.variants &&
            message.metadata.variants.length > 0 && (
              <GapFillVariants
                variants={message.metadata.variants}
                showVariant={showVariant}
                onToggle={() => setShowVariant((v) => !v)}
                t={t}
              />
            )}
        </Div>

        {/* Actions - Fixed height container to maintain consistent spacing */}
        <Div className="h-10 sm:h-8 flex items-center justify-end">
          <UserMessageActions
            message={message}
            locale={locale}
            logger={logger}
            user={user}
            deductCredits={deductCredits}
            onBranch={onBranch}
            onRetry={onRetry}
            rootFolderId={rootFolderId}
          />
        </Div>
      </Div>
    </Div>
  );
}

// ── Gap-fill helpers ─────────────────────────────────────────────────────────

type GapFillT = ReturnType<typeof scopedTranslation.scopedT>["t"];

function GapFillIcon({
  modality,
  bridgeType,
  className,
}: {
  modality: string;
  bridgeType: string;
  className?: string;
}): JSX.Element {
  if (bridgeType === "stt" || modality === "audio") {
    return <Music className={cn("h-3 w-3", className)} />;
  }
  if (modality === "video") {
    return <Film className={cn("h-3 w-3", className)} />;
  }
  return <ImageIcon className={cn("h-3 w-3", className)} />;
}

function GapFillStatus({
  bridgeType,
  modality,
  t,
}: {
  bridgeType: string;
  modality: string;
  t: GapFillT;
}): JSX.Element {
  const label =
    bridgeType === "stt"
      ? t("gapFill.transcribingAudio")
      : modality === "video"
        ? t("gapFill.describingVideo")
        : t("gapFill.analyzingImage");

  return (
    <Div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
      <Div className="flex items-center gap-1 animate-pulse">
        <GapFillIcon
          modality={modality}
          bridgeType={bridgeType}
          className="text-primary/60"
        />
        <Span>{label}</Span>
      </Div>
    </Div>
  );
}

interface VariantEntry {
  modality: string;
  content: string;
  modelId?: string | null;
  creditCost?: number | null;
}

function GapFillVariants({
  variants,
  showVariant,
  onToggle,
  t,
}: {
  variants: VariantEntry[];
  showVariant: boolean;
  onToggle: () => void;
  t: GapFillT;
}): JSX.Element {
  const first = variants[0];
  const label =
    first?.modality === "audio"
      ? t("gapFill.transcription")
      : first?.modality === "video"
        ? t("gapFill.videoDescription")
        : t("gapFill.imageDescription");

  return (
    <Div className="mt-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className="h-6 gap-1 px-1.5 py-0 text-xs text-muted-foreground hover:text-foreground rounded-md"
      >
        <GapFillIcon
          modality={first?.modality ?? "image"}
          bridgeType=""
          className="opacity-60"
        />
        <Span>{showVariant ? t("gapFill.hideAnalysis") : label}</Span>
      </Button>

      {showVariant && (
        <Div className="mt-1.5 flex flex-col gap-2">
          {variants.map((v, i) => (
            <Div
              key={i}
              className="rounded-lg bg-muted/40 border border-border/30 px-3 py-2"
            >
              <Span className="text-xs text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {v.content}
              </Span>
              <Div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                {v.modelId && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] h-4 px-1.5 font-normal"
                  >
                    {v.modelId}
                  </Badge>
                )}
                {v.creditCost !== null &&
                  v.creditCost !== undefined &&
                  v.creditCost > 0 && (
                    <Badge
                      variant="outline"
                      className="text-[10px] h-4 px-1.5 font-normal"
                    >
                      {t("gapFill.variantCost", { cost: String(v.creditCost) })}
                    </Badge>
                  )}
              </Div>
            </Div>
          ))}
        </Div>
      )}
    </Div>
  );
}
