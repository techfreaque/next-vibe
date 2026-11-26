"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { Span } from "next-vibe/ui/components/span";
import { P } from "next-vibe/ui/components/typography";
import type { JSX, ReactNode } from "react";

export interface DocumentActionContext {
  /** Document number, e.g. "INV-2026-0004" */
  number: string;
  /** Customer or supplier name */
  party?: string | null;
  /** Formatted money, e.g. "€535.50" */
  amount?: string;
  /** Muted label for the amount, e.g. "Total" */
  amountLabel?: string;
  /** Extra muted line, e.g. a line description */
  detail?: string | null;
}

/**
 * Context for a line removal, set by the document detail right before it
 * opens the remove action (the remove endpoint only carries the line id).
 */
export const documentLineContext = new Map<string, DocumentActionContext>();

const noteTone = {
  info: "border-info/30 bg-info/10 text-info",
  warning: "border-warning/30 bg-warning/10 text-warning",
  danger: "border-destructive/30 bg-destructive/10 text-destructive",
} as const;

/**
 * Shared confirmation layout for one-click document actions (accept,
 * decline, duplicate, remove line, send reminder). Shows what the action
 * applies to before the operator confirms, and a token-colored result.
 */
export function DocumentActionConfirm({
  title,
  description,
  backLabel,
  onBack,
  context,
  loadingText,
  unavailableText,
  note,
  submit,
  alert,
  success,
  closeLabel,
}: {
  /** Label of the secondary button after success (defaults to backLabel) */
  closeLabel?: string;
  title: string;
  description?: string;
  backLabel: string;
  onBack?: () => void;
  context?: DocumentActionContext | null;
  /** Shown while the document context loads */
  loadingText?: string | null;
  /** Shown when the action no longer applies (wrong state, missing) */
  unavailableText?: string | null;
  note?: { tone: keyof typeof noteTone; text: string };
  submit: ReactNode;
  alert: ReactNode;
  success?: {
    title: string;
    message?: string;
    primary?: { label: string; onClick: () => void };
  } | null;
}): JSX.Element {
  if (success) {
    return (
      <Div className="flex min-w-0 flex-col gap-4">
        <ResultBanner
          variant="success"
          title={success.title}
          message={success.message}
        />
        <Div className="flex flex-wrap gap-2">
          {success.primary && (
            <Button
              type="button"
              className="min-h-10"
              onClick={success.primary.onClick}
            >
              {success.primary.label}
            </Button>
          )}
          {onBack && (
            <Button
              type="button"
              variant="outline"
              className="min-h-10"
              onClick={onBack}
            >
              {closeLabel ?? backLabel}
            </Button>
          )}
        </Div>
      </Div>
    );
  }

  return (
    <Div className="flex min-w-0 flex-col gap-4">
      <Div className="flex flex-col gap-1">
        <Span className="text-lg font-semibold leading-tight">{title}</Span>
        {description && (
          <P className="text-sm text-muted-foreground">{description}</P>
        )}
      </Div>

      {context && (
        <Div className="flex min-w-0 items-start justify-between gap-4 rounded-lg border bg-card px-4 py-3">
          <Div className="flex min-w-0 flex-col gap-0.5">
            <Span className="whitespace-nowrap text-sm font-semibold">
              {context.number}
            </Span>
            {context.party && (
              <Span className="truncate text-sm text-muted-foreground">
                {context.party}
              </Span>
            )}
            {context.detail && (
              <Span className="text-sm text-muted-foreground [overflow-wrap:anywhere]">
                {context.detail}
              </Span>
            )}
          </Div>
          {context.amount && (
            <Div className="flex shrink-0 flex-col items-end gap-0.5">
              {context.amountLabel && (
                <Span className="text-xs text-muted-foreground">
                  {context.amountLabel}
                </Span>
              )}
              <Span className="whitespace-nowrap text-base font-semibold tabular-nums">
                {context.amount}
              </Span>
            </Div>
          )}
        </Div>
      )}

      {loadingText && (
        <P aria-live="polite" className="text-sm text-muted-foreground">
          {loadingText}
        </P>
      )}
      {unavailableText && (
        <ResultBanner variant="warning" title={unavailableText} />
      )}

      {note && !unavailableText && (
        <Div className={`rounded-lg border px-4 py-3 ${noteTone[note.tone]}`}>
          <P className="text-sm">{note.text}</P>
        </Div>
      )}

      {alert}
      {!loadingText && !unavailableText && (
        <Div className="flex flex-wrap gap-2 [&_button]:min-h-10">
          {submit}
          {onBack && (
            <Button
              type="button"
              variant="outline"
              className="min-h-10"
              onClick={onBack}
            >
              {backLabel}
            </Button>
          )}
        </Div>
      )}
    </Div>
  );
}
