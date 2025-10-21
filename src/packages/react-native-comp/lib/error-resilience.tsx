import type { ReactNode } from "react";
import { Component } from "react";
import { ScrollView, Text, View } from "react-native";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary for React Native
 * Catches errors and prevents app crashes during migration
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.warn("🔴 React Native Error Boundary caught:", error.message);
    console.warn("Stack:", error.stack);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ScrollView
          style={{ flex: 1, padding: 16, backgroundColor: "#FEF2F2" }}
        >
          <Text
            style={{
              color: "#DC2626",
              fontWeight: "bold",
              fontSize: 18,
              marginBottom: 8,
            }}
          >
            Component Error
          </Text>
          <Text style={{ color: "#991B1B", fontSize: 14, marginBottom: 16 }}>
            {this.state.error?.message || "Unknown error"}
          </Text>
          <Text style={{ color: "#6B7280", fontSize: 12 }}>
            This component has compatibility issues with React Native. Check
            Metro bundler console for details.
          </Text>
        </ScrollView>
      );
    }

    return this.props.children;
  }
}

/**
 * Wraps a component to gracefully handle render errors
 */
export function withErrorResilience<P extends object>(
  Component: React.ComponentType<P>,
  componentName = "Component",
): React.ComponentType<P> {
  return function ResilientComponent(props: P) {
    return (
      <ErrorBoundary
        fallback={
          <View style={{ padding: 8, backgroundColor: "#FEF3C7" }}>
            <Text style={{ color: "#92400E", fontSize: 12 }}>
              {componentName} unavailable in React Native
            </Text>
          </View>
        }
        onError={(error) => {
          console.warn(`🔴 Error rendering ${componentName}:`, error.message);
        }}
      >
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
