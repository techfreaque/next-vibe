"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Div } from "next-vibe-ui/ui/div";
import { Trash2 } from "next-vibe-ui/ui/icons/Trash2";
import { Span } from "next-vibe-ui/ui/span";
import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";
import { lazy, Suspense, useState } from "react";

import type { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import type { ChatMessage } from "@/app/api/[locale]/agent/chat/db";
import { scopedTranslation as sharedScopedTranslation } from "@/app/api/[locale]/shared/i18n";
import type { ErrorResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import type { ContactRequest } from "@/app/api/[locale]/contact/definition";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import { useUser } from "@/app/api/[locale]/user/private/me/hooks";
import {
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetUser,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { useTouchDevice } from "next-vibe-ui/hooks/use-touch-device";
import { useTranslation } from "@/i18n/core/client";

import { scopedTranslation } from "../i18n";
import { CopyButton } from "./copy-button";
import { useMessageGroupName } from "./embedded-context";
import { MessageActionButton } from "./message-action-button";

const EndpointsPage = lazy(() =>
  import("@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage").then(
    (m) => ({ default: m.EndpointsPage }),
  ),
);

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
  const { t: sharedT } = sharedScopedTranslation.scopedT(locale);
  const { push: navigate } = useWidgetNavigation();
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const { user: profileData } = useUser(user, logger);
  const isTouch = useTouchDevice();
  const { group, groupHover } = useMessageGroupName();
  const [contactEndpoint, setContactEndpoint] =
    useState<CreateApiEndpointAny | null>(null);
  const [contactPrefill, setContactPrefill] =
    useState<Partial<ContactRequest> | null>(null);

  let errorData: ErrorResponseType | null = null;
  let displayContent: string;
  let errorTypeDisplay: string | null = null;

  // Try to parse the message content as ErrorResponse JSON
  try {
    const parsed = JSON.parse(message.content || "{}") as ErrorResponseType;
    if (parsed && typeof parsed === "object" && "message" in parsed) {
      errorData = parsed;
      displayContent = interpolateParams(parsed.message, parsed.messageParams);

      if (parsed.errorType?.errorKey) {
        errorTypeDisplay = sharedT(parsed.errorType.errorKey);
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
    displayContent = message.content ?? "";
  }

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
              <Suspense fallback={null}>
                <EndpointsPage
                  endpoint={{ POST: contactEndpoint }}
                  locale={locale}
                  user={user}
                  endpointOptions={{
                    create: { autoPrefillData: contactPrefill as never },
                  }}
                  className="mt-2"
                />
              </Suspense>
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

function translateErrorRecursive(
  error: ErrorResponseType,
  causeLabel: string,
): string {
  const mainMessage = interpolateParams(error.message, error.messageParams);

  if (error.cause) {
    const causeMessage = translateErrorRecursive(error.cause, causeLabel);
    return `${mainMessage}\n\n${causeLabel}: ${causeMessage}`;
  }

  return mainMessage;
}
