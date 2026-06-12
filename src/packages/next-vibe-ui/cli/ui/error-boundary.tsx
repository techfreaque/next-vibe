import { Box, Text } from "ink";
import type { ErrorInfo, ReactNode } from "react";
import React, { Component } from "react";

export type {
  ErrorBoundaryProps,
  ErrorBoundaryState,
  ErrorFallbackProps,
} from "../../web/ui/error-boundary";

import type {
  ErrorBoundaryProps,
  ErrorBoundaryState,
  ErrorFallbackProps,
} from "../../web/ui/error-boundary";

// ─── Default Error Fallback (CLI) ─────────────────────────────────────────────

/**
 * CLI error fallback - renders error details using Ink Box/Text
 */
export function DefaultErrorFallback({
  error,
  errorInfo,
}: ErrorFallbackProps): React.JSX.Element {
  const componentStackLabel = "Component stack:";
  const stackTraceLabel = "Stack trace:";
  const noStackTrace = "No stack trace available";
  const noComponentStack = "No component stack available";
  const stackTrace = error.stack || noStackTrace;
  const componentStack = errorInfo?.componentStack || noComponentStack;

  // Extract component names from stack - strip file paths, keep component names
  const componentStackLines = componentStack
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 8);

  return (
    <Box flexDirection="column" paddingX={1}>
      <Text color="red" bold>
        {error.name}: {error.message}
      </Text>

      {componentStackLines.length > 0 && (
        <Box flexDirection="column" marginTop={1}>
          <Text color="red" dimColor>
            {componentStackLabel}
          </Text>
          {componentStackLines.map((line, i) => (
            <Text key={i} color="red" dimColor>
              {line}
            </Text>
          ))}
        </Box>
      )}

      <Box flexDirection="column" marginTop={1}>
        <Text dimColor>{stackTraceLabel}</Text>
        <Text dimColor>{stackTrace.split("\n").slice(0, 6).join("\n")}</Text>
      </Box>
    </Box>
  );
}

// ─── Track errors for re-throw prevention ─────────────────────────────────────

const handledErrors = new WeakSet<Error>();

// ─── Error Boundary Class ─────────────────────────────────────────────────────

/**
 * CLI-safe React Error Boundary
 * Same behavior as web version but renders Ink-compatible fallback
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
    if (handledErrors.has(error)) {
      // eslint-disable-next-line no-restricted-syntax -- Required by React error boundary contract
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
      if (this.props.fallback) {
        if (typeof this.props.fallback === "function") {
          return this.props.fallback(
            this.state.error,
            this.state.errorInfo,
            this.reset,
          );
        }
        return this.props.fallback;
      }

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
