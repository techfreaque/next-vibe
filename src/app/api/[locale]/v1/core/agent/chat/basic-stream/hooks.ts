/**
 * Basic Stream Hooks
 * Client-side hooks for basic streaming operations with proper useEndpoint patterns
 */

import { useCallback, useMemo, useRef, useState } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint";
import { envClient } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";
import { Environment } from "next-vibe/shared/utils/env-util";

import type { BasicStreamPostRequestTypeOutput } from "./definition";
import definitions from "./definition";

// Constants for streaming protocol
const STREAMING_CONSTANTS = {
  DATA_PREFIX: "data: ",
  DATA_PREFIX_LENGTH: 6,
} as const;

/**
 * Hook for basic stream operations with enhanced TypeScript typing
 */
export function useBasicStreamEndpoint(
  logger: EndpointLogger,
  params?: {
    enabled?: boolean;
  },
): EndpointReturn<typeof definitions> {
  const queryOptions = useMemo(
    () => ({
      enabled: params?.enabled !== false,
      refetchOnWindowFocus: false,
      staleTime: 0, // Always fresh for streaming
      retry: 1,
    }),
    [params?.enabled],
  );

  const formOptions = useMemo(
    () => ({
      persistForm: false,
      persistenceKey: "basic-stream-form",
    }),
    [],
  );

  return useEndpoint(
    definitions,
    {
      queryOptions,
      formOptions,
    },
    logger,
  );
}

/**
 * Streaming message interface
 */
export interface StreamingMessage {
  type: "text" | "completion" | "error";
  content?: string;
  index?: number;
  isComplete?: boolean;
  timestamp?: number;
  success?: boolean;
  totalMessages?: number;
  duration?: number;
  completed?: boolean;
  error?: string;
  message?: string;
}

/**
 * Hook for basic stream functionality with real-time message handling
 */
export function useBasicStream(
  locale: CountryLanguage,
  params?: {
    onMessage?: (message: StreamingMessage) => void;
    onComplete?: (summary: StreamingMessage) => void;
    onError?: (error: StreamingMessage) => void;
  },
): {
  messages: StreamingMessage[];
  isStreaming: boolean;
  streamingSummary: StreamingMessage | null;
  startStream: (config: BasicStreamPostRequestTypeOutput) => Promise<void>;
  stopStream: () => void;
  clearMessages: () => void;
  endpoint: EndpointReturn<typeof definitions>;
} {
  const { onMessage, onComplete, onError } = params || {};

  // Create logger for client-side streaming
  const logger = createEndpointLogger(
    envClient.NODE_ENV === Environment.DEVELOPMENT,
    Date.now(),
    locale,
  );

  const [messages, setMessages] = useState<StreamingMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingSummary, setStreamingSummary] =
    useState<StreamingMessage | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Get the endpoint for API path construction
  const endpoint = useBasicStreamEndpoint(logger, { enabled: false });

  // Start streaming function
  const startStream = useCallback(
    async (config: BasicStreamPostRequestTypeOutput) => {
      if (isStreaming) {
        return;
      }

      setIsStreaming(true);
      setMessages([]);
      setStreamingSummary(null);

      // Create abort controller for cancellation
      abortControllerRef.current = new AbortController();

      try {
        // Use fixed API path for streaming
        const apiPath = "/api/en/v1/template-api/basic-stream";

        // Make the streaming request
        const response = await fetch(apiPath, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(config),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const errorMessage: StreamingMessage = {
            type: "error",
            error: "streamingErrors.basicStream.error.network",
            message: `streamingErrors.basicStream.error.httpStatus.${response.status}`,
          };

          if (onError) {
            onError(errorMessage);
          }
          return;
        }

        const reader = response.body?.getReader();
        if (!reader) {
          const errorMessage: StreamingMessage = {
            type: "error",
            error: "streamingErrors.basicStream.error.network",
            message: "streamingErrors.basicStream.error.noReader",
          };

          if (onError) {
            onError(errorMessage);
          }
          return;
        }

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          buffer += decoder.decode(value, { stream: true });

          // Process complete lines
          const lines = buffer.split("\n");
          buffer = lines.pop() || ""; // Keep incomplete line in buffer

          for (const line of lines) {
            if (line.startsWith(STREAMING_CONSTANTS.DATA_PREFIX)) {
              try {
                const message = JSON.parse(
                  line.slice(STREAMING_CONSTANTS.DATA_PREFIX_LENGTH),
                ) as StreamingMessage;

                if (message.type === "text") {
                  setMessages((prev) => [...prev, message]);
                  if (onMessage) {
                    onMessage(message);
                  }
                } else if (message.type === "completion") {
                  setStreamingSummary(message);
                  if (onComplete) {
                    onComplete(message);
                  }
                } else if (message.type === "error") {
                  if (onError) {
                    onError(message);
                  }
                }
              } catch (parseError) {
                logger.error("agent.stream.parsing.failed", parseError);
              }
            }
          }
        }
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          const errorMessage: StreamingMessage = {
            type: "error",
            error: "streamingErrors.basicStream.error.network",
            message: error.message,
          };

          if (onError) {
            onError(errorMessage);
          }
        }
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [isStreaming, endpoint, onMessage, onComplete, onError, logger],
  );

  // Stop streaming function
  const stopStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsStreaming(false);
  }, []);

  // Clear messages function
  const clearMessages = useCallback(() => {
    setMessages([]);
    setStreamingSummary(null);
  }, []);

  return {
    messages,
    isStreaming,
    streamingSummary,
    startStream,
    stopStream,
    clearMessages,
    // Expose endpoint for form operations
    endpoint,
  };
}

/**
 * Hook for basic stream form operations
 * Provides form functionality for configuring basic stream parameters
 */
export function useBasicStreamForm(
  logger: EndpointLogger,
  params?: {
    defaultValues?: Partial<BasicStreamPostRequestTypeOutput>;
  },
): EndpointReturn<typeof definitions> {
  const { defaultValues } = params || {};

  const formOptions = useMemo(
    () => ({
      persistForm: true,
      persistenceKey: "basic-stream-config-form",
      defaultValues: {
        count: 10,
        delay: 1000,
        prefix: "streamingApi.basicStream.defaultPrefix",
        includeTimestamp: true,
        includeCounter: true,
        ...defaultValues,
      },
    }),
    [defaultValues],
  );

  return useEndpoint(
    definitions,
    {
      formOptions,
    },
    logger,
  );
}
