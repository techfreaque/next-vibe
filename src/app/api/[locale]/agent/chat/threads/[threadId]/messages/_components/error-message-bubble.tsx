"use client";

import { AlertCircle } from "lucide-react";
import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import type { ChatMessage } from "@/app/api/[locale]/agent/chat/db";
import type { ErrorResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import { useTranslation } from "@/i18n/core/client";
import type { TranslationKey } from "@/i18n/core/static-types";

interface ErrorMessageBubbleProps {
  message: ChatMessage;
}

export function ErrorMessageBubble({
  message,
}: ErrorMessageBubbleProps): JSX.Element {
  const { t } = useTranslation();

  let errorData: ErrorResponseType | null = null;
  let displayContent: string;
  let errorTypeDisplay: string | null = null;

  // Try to parse the message content as ErrorResponse JSON
  try {
    const parsed = JSON.parse(message.content || "{}") as ErrorResponseType;
    if (parsed && typeof parsed === "object" && "message" in parsed) {
      errorData = parsed;
      displayContent = t(
        parsed.message as TranslationKey,
        parsed.messageParams,
      );

      // Also translate the error type if available
      if (parsed.errorType?.errorKey) {
        errorTypeDisplay = t(parsed.errorType.errorKey as TranslationKey);
      }

      // Handle nested causes
      if (parsed.cause) {
        const causeMessage = translateErrorRecursive(parsed.cause, t);
        displayContent = `${displayContent}\n\nCause: ${causeMessage}`;
      }
    } else {
      // Fallback if not a valid ErrorResponse
      displayContent = t(message.content as TranslationKey);
    }
  } catch {
    // If JSON parsing fails, treat it as a regular translation key
    displayContent = t(message.content as TranslationKey);
  }

  return (
    <Div className="flex items-start gap-3">
      <Div className="max-w-full">
        <Div
          className={cn(
            "rounded-2xl px-4 py-3 border",
            "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800",
          )}
        >
          <Div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <Div className="flex-1 space-y-2">
              {errorTypeDisplay && (
                <Div className="text-xs font-semibold text-red-700 dark:text-red-300 uppercase tracking-wide">
                  {errorTypeDisplay}
                </Div>
              )}
              <Div className="text-sm text-red-900 dark:text-red-100 whitespace-pre-wrap">
                {displayContent}
              </Div>
              {errorData?.errorType?.errorCode && (
                <Span className="text-xs text-red-600 dark:text-red-400">
                  {t("app.api.agent.chat.threads.messages.errorCode")}:{" "}
                  {errorData.errorType.errorCode}
                </Span>
              )}
            </Div>
          </Div>
        </Div>

        {/* Fixed height container to maintain consistent spacing */}
        <Div className="h-8" />
      </Div>
    </Div>
  );
}

/**
 * Recursively translate error causes
 */
function translateErrorRecursive(
  error: ErrorResponseType,
  t: (key: TranslationKey, params?: Record<string, string | number>) => string,
): string {
  const mainMessage = t(error.message as TranslationKey, error.messageParams);

  if (error.cause) {
    const causeMessage = translateErrorRecursive(error.cause, t);
    return `${mainMessage}\n\nCause: ${causeMessage}`;
  }

  return mainMessage;
}
