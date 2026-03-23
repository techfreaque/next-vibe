"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "next-vibe-ui/ui/accordion";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { Info } from "next-vibe-ui/ui/icons/Info";
import { RotateCcw } from "next-vibe-ui/ui/icons/RotateCcw";
import { Pre } from "next-vibe-ui/ui/pre";
import { Span } from "next-vibe-ui/ui/span";
import { H3, P } from "next-vibe-ui/ui/typography";
import type { ErrorInfo, JSX, ReactNode } from "react";
import { Component } from "react";

import { envClient } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

// Track errors already caught by a boundary so parent boundaries don't re-throw them
const handledErrors = new WeakSet<Error>();

interface ErrorBoundaryProps {
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

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

interface FallbackProps {
  error: Error;
  errorInfo: ErrorInfo | null;
  reset: () => void;
  locale: CountryLanguage;
}

/**
 * Default error fallback component with detailed error information
 */
export function DefaultErrorFallback({
  error,
  errorInfo,
  reset,
  locale,
}: FallbackProps): JSX.Element {
  const { t } = simpleT(locale);

  // Get full stack trace if available
  const stackTrace = error.stack || "No stack trace available";
  const componentStack =
    errorInfo?.componentStack || "No component stack available";

  // Extract component names from stack - strip bundle URLs, keep "at ComponentName"
  const componentStackLines = componentStack
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => l.replace(/\s*\(https?:\/\/[^)]+\)/g, "").trim())
    .filter(Boolean);
  // First line is the failing component, next few are its ancestors
  const topComponents = componentStackLines.slice(0, 8).join("\n");

  return (
    <Card className="border-destructive max-w-4xl mx-auto my-4">
      <CardContent className="pt-6">
        <Div className="flex flex-col items-center text-center mb-4">
          <Info className="h-12 w-12 text-destructive mb-4" />
          <H3 className="text-xl font-semibold mb-2">
            {t("app.common.error.title")}
          </H3>
          <P className="text-sm text-destructive font-medium mb-2">
            {error.message || t("app.common.errors.unknown")}
          </P>
          <Button
            onClick={reset}
            variant="outline"
            className="flex items-center gap-2 mb-4"
          >
            <RotateCcw className="h-4 w-4" />
            {t("app.common.error.tryAgain")}
          </Button>
        </Div>

        {/* Component stack shown first - most useful for infinite loop / update depth errors */}
        {topComponents && (
          <Div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-md">
            <Span className="text-xs font-semibold text-destructive uppercase tracking-wide block mb-1">
              {t("app.common.error.boundary.componentStack")}
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
              {t("app.common.error.boundary.stackTrace")}
            </AccordionTrigger>
            <AccordionContent>
              <Pre className="mt-2 p-4 bg-muted rounded-md text-xs overflow-auto max-h-64 border border-border">
                {stackTrace}
              </Pre>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="componentStack">
            <AccordionTrigger className="text-sm font-semibold">
              {t("app.common.error.boundary.componentStackFull")}
            </AccordionTrigger>
            <AccordionContent>
              <Pre className="mt-2 p-4 bg-muted rounded-md text-xs overflow-auto max-h-64 border border-border">
                {componentStack}
              </Pre>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="errorDetails">
            <AccordionTrigger className="text-sm font-semibold">
              {t("app.common.error.boundary.errorDetails")}
            </AccordionTrigger>
            <AccordionContent>
              <Div className="mt-2 p-4 bg-muted rounded-md text-xs space-y-2 border border-border">
                <Div>
                  <Span className="font-semibold">
                    {t("app.common.error.boundary.name")}
                  </Span>{" "}
                  {error.name}
                </Div>
                <Div>
                  <Span className="font-semibold">
                    {t("app.common.error.boundary.errorMessage")}
                  </Span>{" "}
                  {error.message}
                </Div>
                {error.cause !== undefined && (
                  <Div>
                    <Span className="font-semibold">
                      {t("app.common.error.boundary.cause")}
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

/**
 * Proper React Error Boundary component
 * Catches errors in React component tree and displays a fallback UI
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
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

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In dev: re-throw so Next.js dev overlay shows the real error origin.
    // Mark it first so getDerivedStateFromError in parent boundaries re-throws
    // instead of catching - letting it propagate all the way to Next.js.
    if (envClient.NODE_ENV !== "production") {
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
