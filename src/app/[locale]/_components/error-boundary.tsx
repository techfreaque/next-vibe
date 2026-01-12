"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "next-vibe-ui/ui/accordion";
import { Button } from "next-vibe-ui/ui/button";
import { Card } from "next-vibe-ui/ui/card";
import { CardContent } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { Info, RotateCcw } from "next-vibe-ui/ui/icons";
import { Pre } from "next-vibe-ui/ui/pre";
import { Span } from "next-vibe-ui/ui/span";
import { H3, P } from "next-vibe-ui/ui/typography";
import type { ErrorInfo, JSX, ReactNode } from "react";
import { Component } from "react";

import { Environment } from "@/app/api/[locale]/shared/utils";
import { envClient } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

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

  return (
    <Card className="border-destructive max-w-4xl mx-auto my-4">
      <CardContent className="pt-6">
        <Div className="flex flex-col items-center text-center mb-6">
          <Info className="h-12 w-12 text-destructive mb-4" />
          <H3 className="text-xl font-semibold mb-2">
            {t("app.common.error.title")}
          </H3>
          <P className="text-muted-foreground mb-4">
            {t("app.common.error.message")}
          </P>
          <P className="text-sm text-destructive font-medium mb-4">
            {error.message || t("app.common.errors.unknown")}
          </P>
          <Button
            onClick={reset}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            {t("app.common.error.tryAgain")}
          </Button>
        </Div>

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
              {t("app.common.error.boundary.componentStack")}
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
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error details for debugging
    // eslint-disable-next-line no-console -- Intentional error logging in error boundary
    console.error("ErrorBoundary caught an error:", error);
    // eslint-disable-next-line no-console -- Intentional error logging in error boundary
    console.error("Component stack:", errorInfo.componentStack);

    // Update state with error info
    this.setState({
      errorInfo,
    });

    // Call optional error callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    if (envClient.NODE_ENV !== Environment.PRODUCTION) {
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax
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
