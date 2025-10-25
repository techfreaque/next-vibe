"use client";

import type { JSX } from "react";
import { useState } from "react";

import type { WidgetAction, WidgetActionType } from "../types";

/**
 * Tool Action Handler Props
 */
export interface ToolActionHandlerProps {
  /** Child component that triggers actions */
  children: (props: {
    onAction: (action: WidgetAction) => void | Promise<void>;
    isProcessing: boolean;
    error: string | null;
  }) => JSX.Element;

  /** Action handler callback */
  onAction?: (action: WidgetAction) => void | Promise<void>;

  /** Success callback */
  onSuccess?: (action: WidgetAction) => void;

  /** Error callback */
  onError?: (error: Error, action: WidgetAction) => void;
}

/**
 * Tool Action Handler Component
 * Handles CRUD operations on tool results with loading and error states
 */
export function ToolActionHandler({
  children,
  onAction,
  onSuccess,
  onError,
}: ToolActionHandlerProps): JSX.Element {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAction = async (action: WidgetAction): Promise<void> => {
    setIsProcessing(true);
    setError(null);

    try {
      if (onAction) {
        await onAction(action);
      }

      if (onSuccess) {
        onSuccess(action);
      }
    } catch (err) {
      // eslint-disable-next-line i18next/no-literal-string
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);

      if (onError) {
        onError(err instanceof Error ? err : new Error(errorMessage), action);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return children({ onAction: handleAction, isProcessing, error });
}

ToolActionHandler.displayName = "ToolActionHandler";

/**
 * Hook for handling widget actions
 */
export function useWidgetActions(
  onAction?: (action: WidgetAction) => void | Promise<void>,
): {
  isProcessing: boolean;
  error: string | null;
  // eslint-disable-next-line no-restricted-syntax
  handleAction: (
    type: WidgetActionType,
    // eslint-disable-next-line no-restricted-syntax
    payload: unknown,
    metadata?: WidgetAction["metadata"],
  ) => Promise<void>;
  clearError: () => void;
} {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAction = async (
    type: WidgetActionType,
    // eslint-disable-next-line no-restricted-syntax
    payload: unknown,
    metadata?: WidgetAction["metadata"],
  ): Promise<void> => {
    setIsProcessing(true);
    setError(null);

    const action: WidgetAction = {
      type,
      payload,
      metadata: {
        ...metadata,
        timestamp: Date.now(),
      },
    };

    try {
      if (onAction) {
        await onAction(action);
      }
    } catch (err) {
      // eslint-disable-next-line i18next/no-literal-string
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      // Re-throw for caller to handle if needed
      // eslint-disable-next-line no-restricted-syntax
      if (err instanceof Error) {
        // eslint-disable-next-line no-restricted-syntax
        throw err;
      }
      // eslint-disable-next-line i18next/no-literal-string, no-restricted-syntax
      throw new Error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearError = (): void => setError(null);

  return {
    handleAction,
    isProcessing,
    error,
    clearError,
  };
}
