"use client";

import { AlertCircle, CheckCircle2, MessageSquareText } from "lucide-react";
import { Div } from "next-vibe-ui/ui/div";
import { Trash2 } from "next-vibe-ui/ui/icons/Trash2";
import { Span } from "next-vibe-ui/ui/span";
import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";
import { useState } from "react";

import {
  type DefaultFolderId,
  isIncognitoFolder,
} from "@/app/api/[locale]/agent/chat/config";
import type { ChatMessage } from "@/app/api/[locale]/agent/chat/db";
import { scopedTranslation as sharedScopedTranslation } from "@/app/api/[locale]/shared/i18n";
import type { ErrorResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import {
  useWidgetLogger,
  useWidgetNavigation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { useTouchDevice } from "next-vibe-ui/hooks/use-touch-device";
import { useTranslation } from "@/i18n/core/client";

import { scopedTranslation } from "../i18n";
import { CopyButton } from "./copy-button";
import { useMessageGroupName } from "./embedded-context";
import { MessageActionButton } from "./message-action-button";

interface ErrorMessageBubbleProps {
  message: ChatMessage;
  rootFolderId: DefaultFolderId;
}

export function ErrorMessageBubble({
  message,
  rootFolderId,
}: ErrorMessageBubbleProps): JSX.Element {
  const { locale } = useTranslation();
  const { t: ts } = scopedTranslation.scopedT(locale);
  const { t: sharedT } = sharedScopedTranslation.scopedT(locale);
  const { push: navigate } = useWidgetNavigation();
  const logger = useWidgetLogger();
  const isTouch = useTouchDevice();
  const { group, groupHover } = useMessageGroupName();
  const [showFeedback, setShowFeedback] = useState(false);

  const isIncognito = isIncognitoFolder(rootFolderId);

  const handleDelete = (): void => {
    void (async (): Promise<void> => {
      const messageIdDefs =
        await import("@/app/api/[locale]/agent/chat/threads/[threadId]/messages/[messageId]/definition");
      navigate(messageIdDefs.default.DELETE, {
        urlPathParams: { threadId: message.threadId, messageId: message.id },
        data: { rootFolderId },
        renderInModal: true,
        popNavigationOnSuccess: 1,
      });
    })();
  };

  const handleReport = (): void => {
    void (async (): Promise<void> => {
      const contactDefs = await import("@/app/api/[locale]/contact/definition");
      const { ContactSubject, ContactPriority } =
        await import("@/app/api/[locale]/contact/enum");

      const errorSummary = displayContent.slice(0, 200);
      const threadInfo = isIncognito
        ? ts("errorFeedback.incognitoThread")
        : `Thread: ${message.threadId}`;

      navigate(contactDefs.default.POST, {
        data: {
          subject: ContactSubject.BUG_REPORT,
          priority: ContactPriority.HIGH,
          message: `${ts("errorFeedback.autoContext")}\n\n${errorTypeDisplay ? `${ts("errorCode")}: ${errorTypeDisplay}` : ""}${errorData?.errorType?.errorCode ? ` (${errorData.errorType.errorCode})` : ""}\n${ts("errorFeedback.errorLabel")}: ${errorSummary}\n${threadInfo}\n\n---\n${ts("errorFeedback.userContextLabel")}:\n`,
        },
        renderInModal: true,
        popNavigationOnSuccess: 1,
      });
    })();
  };

  let errorData: ErrorResponseType | null = null;
  let displayContent: string;
  let errorTypeDisplay: string | null = null;

  // Try to parse the message content as ErrorResponse JSON
  try {
    const parsed = JSON.parse(message.content || "{}") as ErrorResponseType;
    if (parsed && typeof parsed === "object" && "message" in parsed) {
      errorData = parsed;
      displayContent = interpolateParams(parsed.message, parsed.messageParams);

      // Also translate the error type if available
      if (parsed.errorType?.errorKey) {
        errorTypeDisplay = sharedT(parsed.errorType.errorKey);
      }

      // Handle nested causes
      if (parsed.cause) {
        const causeMessage = translateErrorRecursive(parsed.cause);
        displayContent = `${displayContent}\n\nCause: ${causeMessage}`;
      }
    } else {
      // Fallback if not a valid ErrorResponse
      displayContent = message.content ?? "";
    }
  } catch {
    // If JSON parsing fails, show content as-is
    displayContent = message.content ?? "";
  }

  return (
    <Div className={cn("flex items-start gap-3", group)}>
      <Div className="max-w-full">
        <Div
          className={cn(
            "rounded-2xl px-4 py-3 border",
            "bg-destructive/5 border-destructive/30",
          )}
        >
          <Div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <Div className="flex-1 space-y-2">
              {errorTypeDisplay && (
                <Div className="text-xs font-semibold text-destructive uppercase tracking-wide">
                  {errorTypeDisplay}
                </Div>
              )}
              <Div className="text-sm text-destructive-foreground whitespace-pre-wrap">
                {displayContent}
              </Div>
              {errorData?.errorType?.errorCode && (
                <Span className="text-xs text-destructive/80">
                  {ts("errorCode")}: {errorData.errorType.errorCode}
                </Span>
              )}
            </Div>
          </Div>

          {/* Error feedback section */}
          <Div className="mt-3 pt-2 border-t border-destructive/10">
            <Div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="h-3 w-3 text-muted-foreground/60 flex-shrink-0" />
              <Span>{ts("errorFeedback.autoReported")}</Span>
              <Span className="text-muted-foreground/40">
                {ts("errorFeedback.separator")}
              </Span>
              <Span
                className="text-muted-foreground/70 hover:text-foreground cursor-pointer transition-colors underline underline-offset-2"
                onClick={() => setShowFeedback(!showFeedback)}
              >
                {showFeedback
                  ? ts("errorFeedback.hideDetails")
                  : ts("errorFeedback.helpFix")}
              </Span>
            </Div>

            {showFeedback && (
              <Div className="mt-2 flex flex-col gap-2">
                <Span className="text-xs text-muted-foreground/60">
                  {ts("errorFeedback.feedbackHelps")}
                </Span>
                <Div className="flex items-center gap-2 flex-wrap">
                  <Span
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-primary/80 hover:text-primary cursor-pointer transition-colors"
                    onClick={handleReport}
                  >
                    <MessageSquareText className="h-3.5 w-3.5" />
                    {ts("errorFeedback.reportCta")}
                  </Span>
                  {!isIncognito && (
                    <>
                      <Span className="text-muted-foreground/30">
                        {ts("errorFeedback.separator")}
                      </Span>
                      <Span className="text-xs text-muted-foreground/50">
                        {ts("errorFeedback.threadShared")}
                      </Span>
                    </>
                  )}
                  {isIncognito && (
                    <>
                      <Span className="text-muted-foreground/30">
                        {ts("errorFeedback.separator")}
                      </Span>
                      <Span className="text-xs text-muted-foreground/40 italic">
                        {ts("errorFeedback.incognitoNote")}
                      </Span>
                    </>
                  )}
                </Div>
              </Div>
            )}
          </Div>
        </Div>

        {/* Actions - same hover pattern as other messages */}
        <Div
          className={cn(
            "flex items-center gap-1 mt-1",
            "transition-opacity duration-150",
            isTouch
              ? "opacity-70 active:opacity-100"
              : `opacity-0 ${groupHover} focus-within:opacity-100`,
          )}
        >
          <CopyButton
            content={message.content ?? undefined}
            locale={locale}
            logger={logger}
          />
          <MessageActionButton
            icon={Trash2}
            onClick={handleDelete}
            title={ts("widget.common.userMessageActions.deleteMessage")}
            variant="destructive"
          />
        </Div>
      </Div>
    </Div>
  );
}

/**
 * Replace {{key}} placeholders in a message string with values from params
 */
function interpolateParams(
  message: string,
  params?: Record<string, string | number>,
): string {
  if (!params) {
    return message;
  }
  return message.replace(/\{\{(\w+)\}\}/g, (match, key: string) =>
    key in params ? String(params[key]) : match,
  );
}

/**
 * Recursively translate error causes
 */
function translateErrorRecursive(error: ErrorResponseType): string {
  const mainMessage = interpolateParams(error.message, error.messageParams);

  if (error.cause) {
    const causeMessage = translateErrorRecursive(error.cause);
    return `${mainMessage}\n\nCause: ${causeMessage}`;
  }

  return mainMessage;
}
