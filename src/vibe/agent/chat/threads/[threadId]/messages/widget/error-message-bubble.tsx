"use client";

import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import type { DefaultFolderId } from "next-vibe/core/execution-context";
import { useTranslation } from "next-vibe/core/i18n/core/client";
import { scopedTranslation as vibeScopedTranslation } from "next-vibe/core/i18n/shared";
import type { ErrorResponseType } from "next-vibe/core/route/response.schema";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { AlertCircle } from "next-vibe/ui/components/icons/AlertCircle";
import { CheckCircle2 } from "next-vibe/ui/components/icons/CheckCircle2";
import { RotateCcw } from "next-vibe/ui/components/icons/RotateCcw";
import { Sparkles } from "next-vibe/ui/components/icons/Sparkles";
import { StopCircle } from "next-vibe/ui/components/icons/StopCircle";
import { Trash2 } from "next-vibe/ui/components/icons/Trash2";
import { Span } from "next-vibe/ui/components/span";
import { useTouchDevice } from "next-vibe/ui/hooks/use-touch-device";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import {
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetPlatform,
  useWidgetUser,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/web/EndpointsPage";
import type { JSX } from "react";
import { useEffect, useState } from "react";

import type { ContactRequest } from "@/contact/definition";
import { useUser } from "@/user/private/me/hooks";

import { StreamErrorType } from "../../../../../ai-stream/repository/core/constants";
import {
  isOutOfCreditsErrorCode,
  OutOfCreditsCard,
} from "../../../../../ai-stream/stream/widget/out-of-credits-card";
import type { ChatMessage } from "../../../../db";
import { useTourState } from "../../../../tour-state";
import { scopedTranslation } from "../i18n";
import { CopyButton } from "./copy-button";
import { useMessageGroupName } from "./embedded-context";
import { useErrorRetry } from "./error-retry-context";
import { MessageActionButton } from "./message-action-button";

/**
 * Error bubbles already reported this page session - a bubble re-mounts on
 * every scroll/branch switch, report it once.
 */
const reportedErrorMessageIds = new Set<string>();

/** Only report errors that just happened - old error rows in history are already known. */
const ERROR_REPORT_MAX_AGE_MS = 10 * 60 * 1000;

interface ErrorMessageBubbleProps {
  message: ChatMessage;
  rootFolderId: DefaultFolderId;
  /** Surrounding messages for history context in bug reports */
  messages?: ChatMessage[];
}

export function ErrorMessageBubble({
  message,
  rootFolderId,
  messages,
}: ErrorMessageBubbleProps): JSX.Element {
  const { locale } = useTranslation();
  const { t: ts } = scopedTranslation.scopedT(locale);
  // `errorType.errorKey` is keyed to the framework's own shared scope, not the
  // app's, so it has to be rendered by that scope's translator.
  const { t: vibeT } = vibeScopedTranslation.scopedT(locale);
  const { push: navigate } = useWidgetNavigation();
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const platform = useWidgetPlatform();
  const { user: profileData } = useUser(user, logger);
  const isTouch = useTouchDevice();
  const { group, groupHover } = useMessageGroupName();
  const [contactEndpoint, setContactEndpoint] =
    useState<CreateApiEndpointAny | null>(null);
  const [contactPrefill, setContactPrefill] =
    useState<Partial<ContactRequest> | null>(null);
  const retryMessage = useErrorRetry();
  const setModelSelectorOpen = useTourState(
    (state) => state.setModelSelectorOpen,
  );

  // Report a freshly-rendered error bubble once - the user is looking at it.
  useEffect(() => {
    // STREAM_INTERRUPTED = user pressed stop - a user-initiated cancel, not a fault
    if (
      reportedErrorMessageIds.has(message.id) ||
      message.errorType === StreamErrorType.STREAM_INTERRUPTED
    ) {
      return;
    }
    const ageMs = Date.now() - new Date(message.createdAt).getTime();
    if (!(ageMs <= ERROR_REPORT_MAX_AGE_MS)) {
      return;
    }
    reportedErrorMessageIds.add(message.id);
    let structuredErrorCode: number | undefined;
    let structuredErrorKey: string | undefined;
    try {
      const parsed = JSON.parse(message.content || "{}") as ErrorResponseType;
      if (parsed && typeof parsed === "object") {
        structuredErrorCode = parsed.errorType?.errorCode;
        structuredErrorKey = parsed.errorType?.errorKey;
      }
    } catch {
      // Plain-text error content - no structured error type to extract
    }
    // Credit refusal (402) is an expected outcome rendered as a top-up card
    const isCreditRefusal = isOutOfCreditsErrorCode(structuredErrorCode);
    (isCreditRefusal ? logger.warn : logger.error).bind(logger)(
      "Chat: Error message bubble shown to user",
      {
        component: "ErrorMessageBubble",
        messageId: message.id,
        threadId: message.threadId,
        parentId: message.parentId,
        rootFolderId,
        model: message.model,
        skill: message.skill,
        errorType: message.errorType,
        errorCode: message.errorCode,
        structuredErrorCode,
        structuredErrorKey,
        ageMs,
      },
    );
  }, [
    logger,
    message.id,
    message.createdAt,
    message.threadId,
    message.parentId,
    message.model,
    message.skill,
    message.errorType,
    message.errorCode,
    message.content,
    rootFolderId,
  ]);

  // User-cancelled streams get a compact "stopped" indicator, not an error bubble
  if (message.errorType === StreamErrorType.STREAM_INTERRUPTED) {
    return (
      <Div className={cn("flex items-start gap-3", group)}>
        <Div className="max-w-full">
          <Div
            className={cn(
              "rounded-2xl px-4 py-2.5 border",
              "bg-muted/40 border-border/40",
            )}
          >
            <Div className="flex items-center gap-2">
              <StopCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Div className="flex-1">
                <Span className="text-sm font-medium text-muted-foreground">
                  {ts("streamInterrupted.label")}
                </Span>
                <Span className="text-xs text-muted-foreground/70 ml-2">
                  {ts("streamInterrupted.hint")}
                </Span>
              </Div>
            </Div>
          </Div>
          <Div
            className={cn(
              "flex items-center gap-1 mt-1",
              "transition-opacity duration-150",
              isTouch
                ? "opacity-70 active:opacity-100"
                : `opacity-0 ${groupHover} focus-within:opacity-100`,
            )}
          >
            <MessageActionButton
              icon={Trash2}
              onClick={(): void => {
                void (async (): Promise<void> => {
                  const messageIdDefs =
                    await import("../[messageId]/definition");
                  navigate(messageIdDefs.default.DELETE, {
                    urlPathParams: {
                      threadId: message.threadId,
                      messageId: message.id,
                    },
                    data: { rootFolderId },
                    renderInModal: true,
                    popNavigationOnSuccess: 1,
                  });
                })();
              }}
              title={ts("widget.common.userMessageActions.deleteMessage")}
              variant="destructive"
            />
          </Div>
        </Div>
      </Div>
    );
  }

  let errorData: ErrorResponseType | null = null;
  let displayContent: string;
  let errorTypeDisplay: string | null = null;

  // Try to parse the message content as ErrorResponse JSON
  try {
    const parsed = JSON.parse(message.content || "{}") as ErrorResponseType;
    if (parsed && typeof parsed === "object" && "message" in parsed) {
      errorData = parsed;
      displayContent = parsed.message;

      if (parsed.errorType?.errorKey) {
        errorTypeDisplay = vibeT(parsed.errorType.errorKey);
      }

      if (parsed.cause) {
        const causeLabel = ts("errorFeedback.causeLabel");
        const causeMessage = translateErrorRecursive(parsed.cause, causeLabel);
        displayContent = `${displayContent}\n\n${causeLabel}: ${causeMessage}`;
      }
    } else {
      displayContent = message.content ?? "";
    }
  } catch {
    // Plain-text error content (e.g. a network failure message) - shown as-is
    displayContent = message.content ?? "";
  }

  // Credit refusals (402) are not faults: offer the way forward instead of an error
  if (isOutOfCreditsErrorCode(errorData?.errorType?.errorCode)) {
    return (
      <Div className={cn("flex items-start gap-3", group)}>
        <OutOfCreditsCard locale={locale} isGuest={user.isPublic} />
      </Div>
    );
  }

  // The turn that failed: nearest user message up the parent chain. Retry
  // re-sends it through the same op as the user-message retry button.
  const failedUserMessageId = findParentUserMessageId(message, messages);
  const canRetry = retryMessage !== null && failedUserMessageId !== null;

  const handleRetry = (): void => {
    if (retryMessage && failedUserMessageId) {
      void retryMessage(failedUserMessageId, undefined);
    }
  };

  const handleTryAnotherModel = (): void => {
    setModelSelectorOpen(true);
  };

  const handleDelete = (): void => {
    void (async (): Promise<void> => {
      const messageIdDefs = await import("../[messageId]/definition");
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
      const contactDefs = await import("@/contact/definition");
      const { ContactSubject, ContactPriority } =
        await import("@/contact/enum");

      const errorSummary = displayContent.slice(0, 300);

      // Build context block
      const contextLines: string[] = [];
      if (message.model) {
        contextLines.push(`Model: ${message.model}`);
      }
      if (message.skill) {
        contextLines.push(`Skill: ${message.skill}`);
      }
      const favConfig = message.metadata?.queuedSettings?.favoriteConfig;
      if (favConfig) {
        contextLines.push(`Favorite: ${favConfig.skillId}`);
      }

      // Build message history block (last 10 messages, user+assistant only)
      let historyBlock = "";
      if (messages && messages.length > 0) {
        const relevant = messages
          .filter((m) => m.role === "user" || m.role === "assistant")
          .slice(-10);
        if (relevant.length > 0) {
          historyBlock = `\n\n--- Message History ---\n${relevant
            .map((m) => {
              const role = m.role === "user" ? "User" : "Assistant";
              const content = (m.content ?? "").slice(0, 500);
              return `[${role}]: ${content}`;
            })
            .join("\n")}`;
        }
      }

      const errorBlock = [
        ts("errorFeedback.autoContext"),
        errorTypeDisplay ? `${ts("errorCode")}: ${errorTypeDisplay}` : null,
        errorData?.errorType?.errorCode
          ? `Code: ${errorData.errorType.errorCode}`
          : null,
        `${ts("errorFeedback.errorLabel")}: ${errorSummary}`,
        contextLines.length > 0 ? contextLines.join("\n") : null,
      ]
        .filter(Boolean)
        .join("\n");

      const prefill: Partial<ContactRequest> = {
        subject: ContactSubject.BUG_REPORT,
        priority: ContactPriority.HIGH,
        name:
          profileData && !profileData.isPublic ? profileData.privateName : "",
        email: profileData && !profileData.isPublic ? profileData.email : "",
        message: `${ts("errorFeedback.userContextLabel")}:\n\n\n---\n${errorBlock}${historyBlock}`,
      };

      setContactPrefill(prefill);
      setContactEndpoint(contactDefs.default.POST as CreateApiEndpointAny);
    })();
  };

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

          {/* The way forward: retry the turn or switch models */}
          {canRetry && (
            <Div className="mt-3 flex flex-wrap items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-8 gap-1.5"
                onClick={handleRetry}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                {ts("errorActions.retry")}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-8 gap-1.5"
                onClick={handleTryAnotherModel}
              >
                <Sparkles className="h-3.5 w-3.5" />
                {ts("errorActions.tryAnotherModel")}
              </Button>
            </Div>
          )}

          {/* Error feedback section */}
          <Div className="mt-3 pt-2 border-t border-destructive/10">
            {!contactEndpoint ? (
              <Div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3 w-3 text-muted-foreground/60 flex-shrink-0" />
                <Span>{ts("errorFeedback.autoReported")}</Span>
                <Span className="text-muted-foreground/40">
                  {ts("errorFeedback.separator")}
                </Span>
                <Span
                  className="text-muted-foreground/70 hover:text-foreground cursor-pointer transition-colors underline underline-offset-2"
                  onClick={handleReport}
                >
                  {ts("errorFeedback.helpFix")}
                </Span>
              </Div>
            ) : (
              <EndpointsPage
                logger={logger}
                endpoint={{ POST: contactEndpoint }}
                locale={locale}
                user={user}
                platform={platform}
                endpointOptions={{
                  create: { autoPrefillData: contactPrefill ?? undefined },
                }}
                className="mt-2"
              />
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

function findParentUserMessageId(
  message: ChatMessage,
  messages: ChatMessage[] | undefined,
): string | null {
  if (!messages) {
    return null;
  }
  const byId = new Map(messages.map((m) => [m.id, m]));
  let parentId = message.parentId;
  // Bounded walk: a malformed parent cycle must not hang the render
  for (let hops = 0; parentId && hops < 50; hops++) {
    const parent = byId.get(parentId);
    if (!parent) {
      return null;
    }
    if (parent.role === "user") {
      return parent.id;
    }
    parentId = parent.parentId;
  }
  return null;
}

function translateErrorRecursive(
  error: ErrorResponseType,
  causeLabel: string,
): string {
  const mainMessage = error.message;

  if (error.cause) {
    const causeMessage = translateErrorRecursive(error.cause, causeLabel);
    return `${mainMessage}\n\n${causeLabel}: ${causeMessage}`;
  }

  return mainMessage;
}
