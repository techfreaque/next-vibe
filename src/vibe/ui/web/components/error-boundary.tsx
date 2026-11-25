"use client";

import type { ErrorInfo, JSX, ReactNode } from "react";
import { Component } from "react";

import { coreClientEnv } from "../../../core/env-client";
import type { CountryLanguage } from "../../../core/i18n/core/config";
import { Environment } from "../../../env/env-util";
import { createClientLogger } from "../../../logger/client";
import { reportRenderError } from "../../../logger/report-render-error";
import type { EndpointLogger } from "../../../logger/types";
import { LoggerContext } from "../hooks/logger-provider";
import { scopedTranslation } from "../i18n";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";
import { Button } from "./button";
import { Card, CardContent } from "./card";
import { Div } from "./div";
import { Info } from "./icons/Info";
import { RotateCcw } from "./icons/RotateCcw";
import { Pre } from "./pre";
import { Span } from "./span";
import { H3, P } from "./typography";

// ─── Types ────────────────────────────────────────────────────────────────────

// Track errors already caught by a boundary so parent boundaries don't re-throw them
const handledErrors = new WeakSet<Error>();

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?:
    | ReactNode
    | ((
        error: Error,
        errorInfo: ErrorInfo | null,
        reset: () => void,
      ) => ReactNode);
  locale: CountryLanguage;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export interface ErrorFallbackProps {
  error: Error;
  errorInfo: ErrorInfo | null;
  reset: () => void;
  locale: CountryLanguage;
}

// ─── Default Error Fallback ───────────────────────────────────────────────────

/**
 * Default error fallback component with detailed error information
 */
export function DefaultErrorFallback({
  error,
  errorInfo,
  reset,
  locale,
}: ErrorFallbackProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const stackTrace = error.stack || t("ui.errorBoundary.noStackTrace");
  const componentStack =
    errorInfo?.componentStack || t("ui.errorBoundary.noComponentStack");

  // Extract component names from stack - strip bundle URLs, keep "at ComponentName"
  const componentStackLines = componentStack
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => l.replaceAll(/\s*\(https?:\/\/[^)]+\)/g, "").trim())
    .filter(Boolean);
  // First line is the failing component, next few are its ancestors
  const topComponents = componentStackLines.slice(0, 8).join("\n");

  const errorTitle = t("ui.errorBoundary.title");

  return (
    <Card className="border-destructive max-w-4xl mx-auto my-4">
      <CardContent className="pt-6">
        <Div className="flex flex-col items-center text-center mb-4">
          <Info className="h-12 w-12 text-destructive mb-4" />
          <H3 className="text-xl font-semibold mb-2">{errorTitle}</H3>
          <P className="text-sm text-destructive font-medium mb-2">
            {error.message || errorTitle}
          </P>
          <Button
            onClick={reset}
            variant="outline"
            className="flex items-center gap-2 mb-4"
          >
            <RotateCcw className="h-4 w-4" />
            {t("ui.errorBoundary.tryAgain")}
          </Button>
        </Div>

        {/* Component stack shown first - most useful for infinite loop / update depth errors */}
        {topComponents && (
          <Div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-md">
            <Span className="text-xs font-semibold text-destructive uppercase tracking-wide block mb-1">
              {t("ui.errorBoundary.componentStack")}
            </Span>
            <Pre className="text-xs text-destructive/80 whitespace-pre-wrap break-all">
              {topComponents}
            </Pre>
          </Div>
        )}

        {/* Detailed Error Information */}
        <Accordion type="multiple" collapsible className="space-y-4">
          <AccordionItem value="stackTrace">
            <AccordionTrigger className="text-sm font-semibold">
              {t("ui.errorBoundary.stackTrace")}
            </AccordionTrigger>
            <AccordionContent>
              <Pre className="mt-2 p-4 bg-muted rounded-md text-xs overflow-auto max-h-64 border border-border">
                {stackTrace}
              </Pre>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="componentStack">
            <AccordionTrigger className="text-sm font-semibold">
              {t("ui.errorBoundary.componentStackFull")}
            </AccordionTrigger>
            <AccordionContent>
              <Pre className="mt-2 p-4 bg-muted rounded-md text-xs overflow-auto max-h-64 border border-border">
                {componentStack}
              </Pre>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="errorDetails">
            <AccordionTrigger className="text-sm font-semibold">
              {t("ui.errorBoundary.details")}
            </AccordionTrigger>
            <AccordionContent>
              <Div className="mt-2 p-4 bg-muted rounded-md text-xs space-y-2 border border-border">
                <Div>
                  <Span className="font-semibold">
                    {t("ui.errorBoundary.name")}
                  </Span>{" "}
                  {error.name}
                </Div>
                <Div>
                  <Span className="font-semibold">
                    {t("ui.errorBoundary.message")}
                  </Span>{" "}
                  {error.message}
                </Div>
                {error.cause !== undefined && (
                  <Div>
                    <Span className="font-semibold">
                      {t("ui.errorBoundary.cause")}
                    </Span>{" "}
                    {String(error.cause)}
                  </Div>
                )}
              </Div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

// ─── Error Boundary Class ─────────────────────────────────────────────────────

/**
 * Proper React Error Boundary component
 * Catches errors in React component tree and displays a fallback UI
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  static contextType = LoggerContext;
  declare context: EndpointLogger | null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // If this error was already caught and re-thrown by an inner boundary,
    // let it propagate up to Next.js - don't swallow it here.
    if (handledErrors.has(error)) {
      // eslint-disable-next-line no-restricted-syntax -- Required by React error boundary contract: re-throw to propagate to parent boundary
      throw error;
    }
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // eslint-disable-next-line no-console -- Intentional error logging in error boundary
    console.error("ErrorBoundary caught an error:", error);
    // eslint-disable-next-line no-console -- Intentional error logging in error boundary
    console.error("Component stack:", errorInfo.componentStack);

    this.setState({ errorInfo });

    // Persist to the error log (before the dev re-throw below). Deduped per
    // Error object, so the re-throw reaching window "error" isn't a 2nd row.
    reportRenderError({
      // Outside a LoggerProvider (rare) a fresh client logger still reports
      logger: this.context ?? createClientLogger(false, this.props.locale),
      boundary: "ErrorBoundary",
      error,
      componentStack: errorInfo.componentStack,
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In dev: re-throw so Next.js dev overlay shows the real error origin.
    // Mark it first so getDerivedStateFromError in parent boundaries re-throws
    // instead of catching - letting it propagate all the way to Next.js.
    if (coreClientEnv.NODE_ENV !== Environment.PRODUCTION) {
      handledErrors.add(error);
      // eslint-disable-next-line no-restricted-syntax -- Required by React error boundary contract: re-throw in dev to surface original error in Next.js overlay
      throw error;
    }
  }

  reset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        // Check if fallback is a function or ReactNode
        if (typeof this.props.fallback === "function") {
          return this.props.fallback(
            this.state.error,
            this.state.errorInfo,
            this.reset,
          );
        }
        // If it's a ReactNode, just return it
        return this.props.fallback;
      }

      // Default error UI with detailed information
      return (
        <DefaultErrorFallback
          locale={this.props.locale}
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          reset={this.reset}
        />
      );
    }

    return this.props.children;
  }
}
