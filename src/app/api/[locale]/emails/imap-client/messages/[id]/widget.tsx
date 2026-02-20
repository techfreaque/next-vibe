/**
 * Gmail-style Widget for IMAP Message Detail with Thread View
 */

"use client";

import { useRouter } from "next-vibe-ui/hooks";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import {
  ArrowLeft,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Loader2,
  Mail,
  MailOpen,
  Paperclip,
  RotateCcw,
  Share2,
  Star,
  Trash2,
} from "next-vibe-ui/ui/icons";
import { Iframe } from "next-vibe-ui/ui/iframe";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import {
  useWidgetContext,
  useWidgetLocale,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type definition from "./definition";
import type { ImapMessageByIdResponseOutput } from "./definition";

interface CustomWidgetProps {
  field: {
    value: ImapMessageByIdResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
  fieldName: string;
}

type ImapMessage = NonNullable<ImapMessageByIdResponseOutput["message"]>;

interface ThreadMessage {
  id: string;
  subject: string;
  senderEmail: string;
  senderName: string | null;
  sentAt: string | null;
  isRead: boolean;
  isFlagged: boolean;
  hasAttachments: boolean;
}

/**
 * Format date ISO string to a human-readable label
 */
function formatFullDate(dateStr: string | null | undefined): string {
  if (!dateStr) {
    return "\u2014";
  }
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return dateStr;
  }
  return date.toLocaleString([], {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatShortDate(dateStr: string | null | undefined): string {
  if (!dateStr) {
    return "";
  }
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return dateStr;
  }
  const now = new Date();
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();
  if (sameDay) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

/**
 * Strip raw MIME headers/boundaries from plain text body so only readable content shows
 */
function sanitizePlainText(raw: string): string {
  const lines = raw.split("\n");
  const result: string[] = [];
  let inHeader = true;
  let blankCount = 0;

  for (const line of lines) {
    // Skip MIME boundary lines
    if (/^--[A-Za-z0-9_+/=-]{4,}/.test(line.trim())) {
      continue;
    }
    // Skip Content-* header lines
    if (/^Content-[A-Za-z-]+:/i.test(line.trim())) {
      inHeader = true;
      continue;
    }
    if (inHeader && line.trim() === "") {
      inHeader = false;
      continue;
    }
    if (inHeader) {
      continue;
    }
    if (line.trim() === "") {
      blankCount++;
      if (blankCount <= 2) {
        result.push("");
      }
    } else {
      blankCount = 0;
      result.push(line);
    }
  }
  return result.join("\n").trim();
}

/**
 * Renders HTML email body in a sandboxed iframe using srcDoc, auto-resizing height
 */
function HtmlEmailBody({ html }: { html: string }): React.JSX.Element {
  const [height, setHeight] = useState(400);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const srcDoc = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    body { font-family: system-ui, sans-serif; font-size: 14px; line-height: 1.6; color: #111; margin: 0; padding: 16px; word-break: break-word; }
    img { max-width: 100%; height: auto; }
    a { color: #1a73e8; }
    pre, code { white-space: pre-wrap; word-break: break-all; }
    table { max-width: 100%; }
  </style></head><body>${html}</body></html>`;

  return (
    <Iframe
      ref={iframeRef}
      title="email-body"
      sandbox="allow-same-origin"
      srcDoc={srcDoc}
      width="100%"
      height={height}
      style={{ border: "none", display: "block" }}
      onLoad={() => {
        const doc = iframeRef.current?.contentDocument;
        if (doc?.body) {
          setHeight(Math.max(200, doc.body.scrollHeight + 32));
        }
      }}
    />
  );
}

/**
 * A single collapsed thread message row (not the current message)
 */
function ThreadMessageRow({
  msg,
  isCurrent,
  onClick,
}: {
  msg: ThreadMessage;
  isCurrent: boolean;
  onClick: (id: string) => void;
}): React.JSX.Element {
  const isUnread = !msg.isRead;
  return (
    <Div
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-accent/50 transition-colors border-b last:border-b-0",
        isCurrent
          ? "bg-primary/5 border-l-2 border-l-primary"
          : isUnread
            ? "bg-background"
            : "bg-muted/10",
      )}
      onClick={() => onClick(msg.id)}
    >
      {/* Unread dot */}
      <Div className="flex-shrink-0 w-2 flex justify-center">
        {isUnread && !isCurrent && (
          <Div className="h-2 w-2 rounded-full bg-blue-500" />
        )}
      </Div>

      {/* Sender */}
      <Span
        className={cn(
          "w-36 flex-shrink-0 text-sm truncate",
          isUnread && !isCurrent
            ? "font-semibold text-foreground"
            : "text-muted-foreground",
        )}
      >
        {msg.senderName ?? msg.senderEmail}
      </Span>

      {/* Subject */}
      <Span
        className={cn(
          "flex-1 min-w-0 text-sm truncate",
          isCurrent
            ? "font-medium text-foreground"
            : isUnread
              ? "font-semibold text-foreground"
              : "text-foreground",
        )}
      >
        {msg.subject || "(no subject)"}
        {isCurrent && (
          <Span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-primary align-middle" />
        )}
      </Span>

      {/* Attachment icon */}
      {msg.hasAttachments && (
        <Paperclip className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
      )}

      {/* Flag */}
      {msg.isFlagged && (
        <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500 flex-shrink-0" />
      )}

      {/* Date */}
      <Span
        className={cn(
          "flex-shrink-0 text-xs min-w-[44px] text-right",
          isUnread && !isCurrent
            ? "font-semibold text-foreground"
            : "text-muted-foreground",
        )}
      >
        {formatShortDate(msg.sentAt)}
      </Span>
    </Div>
  );
}

/**
 * Thread conversation panel: fetches siblings by threadId and shows them
 */
function ThreadPanel({
  email,
  locale,
  logger,
  user,
  widgetLocale,
  t,
}: {
  email: ImapMessage;
  locale: CountryLanguage;
  logger: EndpointLogger;
  user: JwtPayloadType;
  widgetLocale: string;
  t: (key: string) => string;
}): React.JSX.Element | null {
  const router = useRouter();
  const [threadMessages, setThreadMessages] = useState<ThreadMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);

  const threadId = email.threadId;

  useEffect((): void => {
    if (!threadId) {
      setIsLoading(false);
      return;
    }
    void (async (): Promise<void> => {
      setIsLoading(true);
      try {
        const { apiClient } =
          await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
        const listDef =
          await import("@/app/api/[locale]/emails/imap-client/messages/list/definition");
        const result = await apiClient.fetch(
          listDef.default.GET,
          logger,
          user,
          {
            threadId,
            limit: 50,
            page: 1,
            sortBy: "app.api.emails.enums.imapMessageSortField.sentAt" as const,
            sortOrder: "app.api.emails.enums.imapSortOrder.desc" as const,
          },
          undefined,
          locale,
        );
        if (result.success && result.data?.messages) {
          setThreadMessages(
            result.data.messages.map(
              (m: (typeof result.data.messages)[number]) => ({
                id: m.id,
                subject: m.subject,
                senderEmail: m.senderEmail,
                senderName: m.senderName,
                sentAt: m.sentAt,
                isRead: m.isRead,
                isFlagged: m.isFlagged,
                hasAttachments: m.hasAttachments,
              }),
            ),
          );
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, [threadId, locale, logger, user]);

  const handleNavigate = useCallback(
    (id: string): void => {
      if (id !== email.id) {
        router.push(`/${widgetLocale}/admin/emails/imap/messages/${id}`);
      }
    },
    [router, widgetLocale, email.id],
  );

  // Only show if there's a thread with multiple messages
  if (!threadId) {
    return null;
  }

  if (isLoading) {
    return (
      <Div className="mt-4 rounded-lg border bg-muted/20 p-3 flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <Span>{t("app.api.emails.imapClient.messages.id.widget.thread")}</Span>
      </Div>
    );
  }

  if (threadMessages.length <= 1) {
    return null;
  }

  return (
    <Div className="mt-4 rounded-lg border overflow-hidden">
      {/* Thread header */}
      <Div
        className="flex items-center gap-2 px-4 py-2.5 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsExpanded((v) => !v)}
      >
        <Mail className="h-4 w-4 text-muted-foreground" />
        <Span className="text-sm font-medium text-foreground">
          {t("app.api.emails.imapClient.messages.id.widget.thread")}
        </Span>
        <Span className="text-xs text-muted-foreground ml-0.5">
          ({threadMessages.length}{" "}
          {t("app.api.emails.imapClient.messages.id.widget.threadMessages")})
        </Span>
        <Div className="flex-1" />
        <Span className="text-xs text-muted-foreground">
          {isExpanded
            ? t("app.api.emails.imapClient.messages.id.widget.threadCollapse")
            : t("app.api.emails.imapClient.messages.id.widget.threadExpand")}
        </Span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </Div>

      {/* Thread messages */}
      {isExpanded && (
        <Div className="flex flex-col">
          {threadMessages.map((msg) => (
            <ThreadMessageRow
              key={msg.id}
              msg={msg}
              isCurrent={msg.id === email.id}
              onClick={handleNavigate}
            />
          ))}
        </Div>
      )}
    </Div>
  );
}

export function ImapMessageDetailContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const email = field.value?.message;
  const t = useWidgetTranslation();
  const { locale, logger, user } = useWidgetContext();
  const widgetLocale = useWidgetLocale();
  const isLoading = field.value === null || field.value === undefined;

  const [isRead, setIsRead] = useState<boolean>(false);
  const [isFlagged, setIsFlagged] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState(false);
  // Track which message IDs we've already auto-marked read (stable across re-renders)
  const markedReadIds = useRef(new Set<string>());

  // Sync state when email loads
  useEffect(() => {
    if (email) {
      setIsRead(email.isRead);
      setIsFlagged(email.isFlagged);
    }
  }, [email]);

  // Auto mark as read when email opens (only once per message ID)
  useEffect(() => {
    const emailId = email?.id;
    const alreadyRead = email?.isRead ?? true;
    if (!emailId || alreadyRead || markedReadIds.current.has(emailId)) {
      return;
    }
    markedReadIds.current.add(emailId);
    void (async (): Promise<void> => {
      try {
        const { apiClient } =
          await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
        const def = await import("./definition");
        await apiClient.mutate(
          def.default.PATCH,
          logger,
          user,
          { isRead: true },
          { id: emailId },
          locale,
        );
        setIsRead(true);
      } catch {
        // Non-critical — ignore mark-as-read errors
      }
    })();
  }, [email, locale, logger, user]);

  const handleToggleRead = useCallback((): void => {
    if (!email || isUpdating) {
      return;
    }
    const newValue = !isRead;
    setIsUpdating(true);
    void (async (): Promise<void> => {
      try {
        const { apiClient } =
          await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
        const def = await import("./definition");
        await apiClient.mutate(
          def.default.PATCH,
          logger,
          user,
          { isRead: newValue },
          { id: email.id },
          locale,
        );
        setIsRead(newValue);
      } finally {
        setIsUpdating(false);
      }
    })();
  }, [email, isRead, isUpdating, locale, logger, user]);

  const handleToggleFlag = useCallback((): void => {
    if (!email || isUpdating) {
      return;
    }
    const newValue = !isFlagged;
    setIsUpdating(true);
    void (async (): Promise<void> => {
      try {
        const { apiClient } =
          await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
        const def = await import("./definition");
        await apiClient.mutate(
          def.default.PATCH,
          logger,
          user,
          { isFlagged: newValue },
          { id: email.id },
          locale,
        );
        setIsFlagged(newValue);
      } finally {
        setIsUpdating(false);
      }
    })();
  }, [email, isFlagged, isUpdating, locale, logger, user]);

  const router = useRouter();
  const handleBack = useCallback((): void => {
    router.push(`/${widgetLocale}/admin/emails/imap/messages`);
  }, [router, widgetLocale]);

  return (
    <Div className="flex flex-col gap-0 min-h-0">
      {/* Toolbar */}
      <Div className="flex items-center gap-1 px-2 py-2 border-b bg-muted/10">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Div className="flex-1" />
        {email && (
          <>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="gap-1 text-xs text-muted-foreground"
              title="Reply"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="gap-1 text-xs text-muted-foreground"
              title="Forward"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleToggleFlag}
              disabled={isUpdating}
              className="text-muted-foreground"
              title={
                isFlagged
                  ? t("app.api.emails.imapClient.messages.id.widget.unflag")
                  : t("app.api.emails.imapClient.messages.id.widget.flag")
              }
            >
              {isFlagged ? (
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleToggleRead}
              disabled={isUpdating}
              className="text-muted-foreground"
              title={
                isRead
                  ? t("app.api.emails.imapClient.messages.id.widget.markUnread")
                  : t("app.api.emails.imapClient.messages.id.widget.markRead")
              }
            >
              {isRead ? (
                <MailOpen className="h-4 w-4" />
              ) : (
                <Mail className="h-4 w-4 text-blue-500" />
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-destructive"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </Div>

      {isLoading ? (
        <Div className="h-[300px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </Div>
      ) : email === null || email === undefined ? (
        <Div className="p-8 text-center text-muted-foreground">
          {t("app.api.emails.imapClient.messages.id.widget.notFound")}
        </Div>
      ) : (
        <Div className="p-4 flex flex-col gap-4 overflow-auto">
          {/* Subject + status badges */}
          <Div>
            <Span className="font-bold text-xl block leading-tight mb-2">
              {email.subject || "(no subject)"}
            </Span>
            <Div className="flex items-center gap-2 flex-wrap">
              {!isRead && (
                <Span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  {t("app.api.emails.imapClient.messages.id.widget.unread")}
                </Span>
              )}
              {isFlagged && (
                <Span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                  {t("app.api.emails.imapClient.messages.id.widget.flagged")}
                </Span>
              )}
              {email.hasAttachments && (
                <Span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                  <Paperclip className="h-3 w-3" />
                  {email.attachmentCount !== null &&
                  email.attachmentCount !== undefined &&
                  email.attachmentCount > 0
                    ? `${email.attachmentCount} ${t("app.api.emails.imapClient.messages.id.widget.attachments")}`
                    : t(
                        "app.api.emails.imapClient.messages.id.widget.hasAttachments",
                      )}
                </Span>
              )}
              {email.folderName && (
                <Span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border">
                  {email.folderName}
                </Span>
              )}
            </Div>
          </Div>

          {/* From / To */}
          <Div className="rounded-lg border bg-muted/20 p-3">
            <Div className="flex items-start gap-2 py-1.5 border-b">
              <Span className="text-xs text-muted-foreground w-16 flex-shrink-0 pt-0.5 font-medium">
                {t("app.api.emails.imapClient.messages.id.widget.from")}
              </Span>
              <Span className="text-sm break-all">
                {email.senderName ? (
                  <>
                    <Span className="font-medium">{email.senderName}</Span>
                    <Span className="text-muted-foreground ml-1.5 text-xs">
                      {"<"}
                      {email.senderEmail}
                      {">"}
                    </Span>
                  </>
                ) : (
                  email.senderEmail
                )}
              </Span>
            </Div>
            <Div className="flex items-start gap-2 py-1.5">
              <Span className="text-xs text-muted-foreground w-16 flex-shrink-0 pt-0.5 font-medium">
                {t("app.api.emails.imapClient.messages.id.widget.to")}
              </Span>
              <Span className="text-sm break-all">
                {email.recipientName ? (
                  <>
                    <Span className="font-medium">{email.recipientName}</Span>
                    <Span className="text-muted-foreground ml-1.5 text-xs">
                      {"<"}
                      {email.recipientEmail}
                      {">"}
                    </Span>
                  </>
                ) : (
                  email.recipientEmail
                )}
              </Span>
            </Div>
          </Div>

          {/* Timestamps */}
          <Div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
            {email.sentAt && (
              <Span>
                <Span className="font-medium">
                  {t("app.api.emails.imapClient.messages.id.widget.sent")}:
                </Span>{" "}
                {formatFullDate(email.sentAt)}
              </Span>
            )}
            {email.receivedAt && (
              <Span>
                <Span className="font-medium">
                  {t("app.api.emails.imapClient.messages.id.widget.received")}:
                </Span>{" "}
                {formatFullDate(email.receivedAt)}
              </Span>
            )}
          </Div>

          {/* Email Body */}
          <Div className="rounded-lg border overflow-hidden">
            {email.bodyHtml && email.bodyHtml.trimStart().startsWith("<") ? (
              <HtmlEmailBody html={email.bodyHtml} />
            ) : email.bodyText ? (
              <Div className="p-4 text-sm whitespace-pre-wrap font-mono leading-relaxed text-foreground/90">
                {sanitizePlainText(email.bodyText)}
              </Div>
            ) : (
              <Div className="p-8 text-center text-muted-foreground text-sm">
                {t("app.api.emails.imapClient.messages.id.widget.noBody")}
              </Div>
            )}
          </Div>

          {/* Thread / Conversation view */}
          <ThreadPanel
            email={email}
            locale={widgetLocale}
            logger={logger}
            user={user}
            widgetLocale={widgetLocale}
            t={t}
          />
        </Div>
      )}
    </Div>
  );
}
