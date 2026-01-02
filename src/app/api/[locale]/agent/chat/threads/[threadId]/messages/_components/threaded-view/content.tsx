"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Markdown } from "next-vibe-ui/ui/markdown";
import { Span, type SpanMouseEvent } from "next-vibe-ui/ui/span";
import type { JSX } from "react";
import React from "react";

import { Logo } from "@/app/[locale]/_components/logo";
import { getCharacterName } from "@/app/api/[locale]/agent/chat/characters/config";
import type { ChatMessage } from "@/app/api/[locale]/agent/chat/db";
import { getIconComponent } from "@/app/api/[locale]/agent/chat/model-access/icons";
import { getModelById } from "@/app/api/[locale]/agent/chat/model-access/models";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { ErrorMessageBubble } from "../error-message-bubble";
import type { useCollapseState } from "../hooks/use-collapse-state";
import type { groupMessagesBySequence } from "../message-grouping";
import { ToolDisplay } from "../tool-display";

interface ThreadedMessageContentProps {
  message: ChatMessage;
  messageGroup?: ReturnType<typeof groupMessagesBySequence>[0];
  depth: number;
  locale: CountryLanguage;
  user: JwtPayloadType;
  collapseState?: ReturnType<typeof useCollapseState>;
  currentUserId?: string;
  onUserIdHover?: (userId: string | null, position: { x: number; y: number } | null) => void;
}

export function ThreadedMessageContent({
  message,
  messageGroup,
  depth,
  locale,
  user,
  collapseState,
  currentUserId,
  onUserIdHover,
}: ThreadedMessageContentProps): JSX.Element {
  const { t } = simpleT(locale);

  // Get all messages in the sequence (primary + continuations)
  const allMessagesInSequence = messageGroup
    ? [messageGroup.primary, ...messageGroup.continuations]
    : [message];

  return (
    <>
      {/* Custom Reddit-style message rendering */}
      <Div
        className={cn(
          "group/message p-4 rounded-lg",
          "bg-muted backdrop-blur-sm",
          "border border-border/30",
          "hover:border-border/50 transition-all",
          "relative",
        )}
      >
        {/* Logo watermark for first message */}
        {depth === 0 && !message.parentId && (
          <Div className="absolute top-3 right-3 pointer-events-none bg-card backdrop-blur-xl rounded-md p-1.5 shadow-sm border border-border/10 opacity-70">
            <Logo locale={locale} pathName="/" size="h-6" />
          </Div>
        )}

        {/* Message header */}
        <Div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground flex-wrap">
          <Span
            onMouseEnter={(e: SpanMouseEvent) => {
              if (message.authorId && onUserIdHover) {
                const rect = e.currentTarget?.getBoundingClientRect?.();
                if (rect) {
                  onUserIdHover(message.authorId, {
                    x: rect.left + rect.width / 2,
                    y: rect.bottom,
                  });
                }
              }
            }}
            onMouseLeave={() => {
              if (onUserIdHover) {
                onUserIdHover(null, null);
              }
            }}
          >
            <Button
              variant="ghost"
              size="unset"
              className={cn(
                "font-semibold hover:underline cursor-pointer flex items-center gap-1.5",
                message.role === "user" ? "text-green-400" : "text-blue-400",
              )}
            >
              {/* Show model icon for AI messages */}
              {message.role === "assistant" &&
                message.model &&
                ((): JSX.Element | null => {
                  const modelData = getModelById(message.model);
                  const ModelIcon = getIconComponent(modelData.icon);
                  return <ModelIcon className="h-3 w-3" />;
                })()}
              {message.role === "user"
                ? currentUserId && message.authorId === currentUserId
                  ? t("app.chat.threadedView.youLabel")
                  : message.authorName
                    ? message.authorName
                    : t("app.chat.threadedView.anonymous")
                : message.role === "assistant" && message.model
                  ? getModelById(message.model).name
                  : t("app.chat.threadedView.assistantFallback")}
            </Button>
          </Span>

          {/* Character - only for AI messages */}
          {message.role === "assistant" && message.character && (
            <>
              <Span>•</Span>
              <Span className="text-muted-foreground/80">
                {getCharacterName(message.character)}
              </Span>
            </>
          )}

          <Span>•</Span>
          <Span>{message.createdAt.toLocaleString()}</Span>
        </Div>

        {/* Message content - render all messages in sequence */}
        <Div className="text-sm">
          {allMessagesInSequence.map((msg, msgIndex) => {
            // Check if there's content after this message
            const hasContentAfter = allMessagesInSequence
              .slice(msgIndex + 1)
              .some((m) => m.content.trim().length > 0);

            // TOOL message
            if (msg.role === "tool" && msg.metadata?.toolCall) {
              return (
                <ToolDisplay
                  key={msg.id}
                  toolCall={msg.metadata.toolCall}
                  locale={locale}
                  user={user}
                  threadId={msg.threadId}
                  messageId={msg.id}
                  collapseState={collapseState}
                />
              );
            }

            // Skip empty messages
            if (!msg.content.trim()) {
              return null;
            }

            return (
              <React.Fragment key={msg.id}>
                {msg.role === "assistant" ? (
                  <Div
                    className={cn(
                      "prose prose-sm dark:prose-invert max-w-none",
                      "prose-p:my-2 prose-p:leading-relaxed",
                      "prose-code:text-blue-400 prose-code:bg-blue-950/40 prose-code:px-1 prose-code:rounded",
                      "prose-pre:bg-black/60 prose-pre:border prose-pre:border-border/40 prose-pre:rounded-md",
                      "prose-headings:text-foreground prose-headings:font-bold",
                      "prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline",
                      msgIndex > 0 && "mt-3",
                    )}
                  >
                    {/* NEW ARCHITECTURE: Tool calls are separate TOOL messages now */}
                    <Markdown
                      content={msg.content}
                      messageId={msg.id}
                      hasContentAfter={hasContentAfter}
                      collapseState={collapseState}
                    />
                  </Div>
                ) : (
                  <Div
                    className={cn(
                      "whitespace-pre-wrap wrap-break-word text-foreground/95",
                      msgIndex > 0 && "mt-3",
                    )}
                  >
                    {msg.content}
                  </Div>
                )}
              </React.Fragment>
            );
          })}
        </Div>
      </Div>

      {message.role === "error" && <ErrorMessageBubble message={message} />}
    </>
  );
}
