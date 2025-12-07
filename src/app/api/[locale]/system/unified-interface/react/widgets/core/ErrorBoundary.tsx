"use client";
import { parseError } from "next-vibe/shared/utils/parse-error";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "next-vibe-ui/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "next-vibe-ui/ui/alert";
import { AlertTriangle } from "next-vibe-ui/ui/icons";
import { Pre } from "next-vibe-ui/ui/pre";
import React, { Component, type ErrorInfo, type ReactNode } from "react";

import { simpleT } from "@/i18n/core/shared";

import { type WidgetErrorBoundaryProps } from "../../../shared/widgets/types";
/**
 * Widget Error Boundary State
 */
interface WidgetErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Widget Error Boundary Component
 * Catches errors in widget rendering and displays a fallback UI
 */
export class WidgetErrorBoundary extends Component<
  WidgetErrorBoundaryProps,
  WidgetErrorBoundaryState
> {
  constructor(props: WidgetErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(
    error: Error,
  ): Partial<WidgetErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      errorInfo,
    });

    // Call error callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error for debugging
    // eslint-disable-next-line i18next/no-literal-string
    const errorMsg = parseError(error).message;
    // eslint-disable-next-line i18next/no-literal-string
    const errorInfoStr = JSON.stringify(errorInfo);
    // eslint-disable-next-line no-console, i18next/no-literal-string
    console.error(`Widget Error: ${errorMsg}`, errorInfoStr);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { t } = simpleT(this.props.locale);

      // Default error UI
      return (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>
            {t(
              "app.api.system.unifiedInterface.react.widgets.errorBoundary.title",
            )}
          </AlertTitle>
          <AlertDescription>
            {this.state.error?.message ||
              t(
                "app.api.system.unifiedInterface.react.widgets.errorBoundary.defaultMessage",
              )}
            {this.state.errorInfo && (
              <Accordion type="single" collapsible className="mt-2 text-xs">
                <AccordionItem value="details">
                  <AccordionTrigger>
                    {t(
                      "app.api.system.unifiedInterface.react.widgets.errorBoundary.errorDetails",
                    )}
                  </AccordionTrigger>
                  <AccordionContent>
                    <Pre className="mt-2 overflow-auto p-2 bg-muted rounded">
                      {this.state.errorInfo.componentStack}
                    </Pre>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}
