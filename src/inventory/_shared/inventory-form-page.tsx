"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { CheckCircle } from "next-vibe/ui/components/icons/CheckCircle";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Span } from "next-vibe/ui/components/span";
import {
  useWidgetIsInteractive,
  useWidgetNavigation,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { AdminForm } from "next-vibe/unified-ui/widgets/containers/admin-form/widget";
import type { JSX, ReactNode } from "react";

/**
 * Shared page frame for inventory write forms (warehouse, stock, transfer):
 * the shared AdminForm template with the fields in one bordered card.
 * `onBackFallback` runs when there is no history to pop.
 */
export function InventoryFormPage({
  title,
  subtitle,
  backLabel,
  onBackFallback,
  result,
  children,
  footer,
  submit,
}: {
  title: string;
  subtitle?: string;
  backLabel: string;
  onBackFallback?: () => void;
  /** Rendered instead of the form once the write succeeded. */
  result?: ReactNode;
  children: ReactNode;
  /** Optional block between the fields card and the submit row (preview). */
  footer?: ReactNode;
  submit: ReactNode;
}): JSX.Element {
  const navigation = useWidgetNavigation();
  const interactive = useWidgetIsInteractive();
  const canBack = navigation.canGoBack || Boolean(onBackFallback);
  const back = (): void => {
    if (navigation.canGoBack) {
      navigation.pop();
      return;
    }
    onBackFallback?.();
  };
  return (
    <AdminForm
      title={title}
      description={subtitle}
      backButton={
        interactive &&
        canBack && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="-ml-2 min-h-10 gap-1.5 self-start"
            onClick={back}
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
            {backLabel}
          </Button>
        )
      }
      primaryAction={result ? null : submit}
    >
      {result ?? (
        <>
          <Div className="flex min-w-0 flex-col gap-4 rounded-xl border bg-card p-4 @md:p-6">
            {children}
          </Div>
          {footer}
        </>
      )}
    </AdminForm>
  );
}

/**
 * Success state for an inventory write: what happened, the resulting figure,
 * and the next steps an operator takes.
 */
export function InventoryWriteResult({
  title,
  message,
  primary,
  secondary,
}: {
  title: string;
  message?: ReactNode;
  primary: { label: string; onClick: () => void };
  secondary?: { label: string; onClick: () => void };
}): JSX.Element {
  const interactive = useWidgetIsInteractive();
  return (
    <Div className="flex flex-col gap-4 rounded-xl border border-success/30 bg-success/5 p-4 @md:p-6">
      <Div className="flex items-start gap-3">
        <Div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
          <CheckCircle className="size-5" aria-hidden="true" />
        </Div>
        <Div className="flex min-w-0 flex-col gap-1">
          <Span className="text-base font-semibold text-success">{title}</Span>
          {message && (
            <Span className="text-sm text-muted-foreground">{message}</Span>
          )}
        </Div>
      </Div>
      {interactive && (
        <Div className="flex flex-col gap-2 @md:flex-row">
          <Button type="button" className="min-h-10" onClick={primary.onClick}>
            {primary.label}
          </Button>
          {secondary && (
            <Button
              type="button"
              variant="outline"
              className="min-h-10"
              onClick={secondary.onClick}
            >
              {secondary.label}
            </Button>
          )}
        </Div>
      )}
    </Div>
  );
}
