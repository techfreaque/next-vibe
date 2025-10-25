"use client";

import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "next-vibe-ui/ui/alert";
import React, { Component, type ErrorInfo, type ReactNode } from "react";

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

    // Log error to console in development
    // eslint-disable-next-line no-console, i18next/no-literal-string
    console.error("Widget Error:", error);
    // eslint-disable-next-line no-console, i18next/no-literal-string
    console.error("Error Info:", errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          {/* eslint-disable-next-line i18next/no-literal-string */}
          <AlertTitle>Widget Error</AlertTitle>
          <AlertDescription>
            {/* eslint-disable-next-line i18next/no-literal-string */}
            {this.state.error?.message ||
              "An error occurred while rendering this widget"}
            {this.state.errorInfo && (
              <details className="mt-2 text-xs">
                {/* eslint-disable-next-line i18next/no-literal-string */}
                <summary className="cursor-pointer">Error Details</summary>
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
