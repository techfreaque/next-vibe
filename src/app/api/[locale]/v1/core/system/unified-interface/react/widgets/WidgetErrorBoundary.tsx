"use client";

import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "next-vibe-ui/ui/alert";
import React, { Component, type ErrorInfo, type ReactNode } from "react";

import { simpleT } from "@/i18n/core/shared";

import type { WidgetErrorBoundaryProps } from "../types";

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
    const errorMsg = error instanceof Error ? error.message : String(error);
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
            {t("app.api.v1.core.system.unifiedInterface.react.widgets.errorBoundary.title")}
          </AlertTitle>
          <AlertDescription>
            {this.state.error?.message ||
              t("app.api.v1.core.system.unifiedInterface.react.widgets.errorBoundary.defaultMessage")}
            {this.state.errorInfo && (
              <details className="mt-2 text-xs">
                <summary className="cursor-pointer">
                  {t("app.api.v1.core.system.unifiedInterface.react.widgets.errorBoundary.errorDetails")}
                </summary>
                <pre className="mt-2 overflow-auto p-2 bg-muted rounded">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}
