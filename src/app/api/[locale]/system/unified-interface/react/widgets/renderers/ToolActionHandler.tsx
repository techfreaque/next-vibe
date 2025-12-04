"use client";

import type { JSX } from "react";
import { useState } from "react";

import {
  type WidgetActionType,
  type WidgetAction,
} from "../../../shared/widgets/types";
import { parseError } from "@/app/api/[locale]/shared/utils";
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
      const error = parseError(err);
      setError(error.message);

      if (onError) {
        onError(error, action);
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
  handleAction: (
    type: WidgetActionType,
    payload: WidgetAction["payload"],
    metadata?: WidgetAction["metadata"],
  ) => Promise<void>;
  clearError: () => void;
} {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAction = async (
    type: WidgetActionType,
    payload: WidgetAction["payload"],
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
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      // Note: In client components, we can't use ResponseType pattern
      // Re-throw is acceptable here for error boundary handling
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
