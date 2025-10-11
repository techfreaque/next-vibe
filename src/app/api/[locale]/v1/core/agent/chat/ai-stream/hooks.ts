/**
 * AI Stream Hooks
 * Client-side hooks for AI streaming operations with useChat integration
 */

import { useChat } from "@ai-sdk/react";
import type React from "react";
import { useMemo } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint";
import { useTranslation } from "@/i18n/core/client";

import type { AiStreamPostRequestTypeOutput } from "./definition";
import definitions from "./definition";

/**
 * Hook for AI stream operations with enhanced TypeScript typing
 */
export function useAiStreamEndpoint(params?: {
  enabled?: boolean;
}): EndpointReturn<typeof definitions> {
  const { locale } = useTranslation();
  const logger = createEndpointLogger(false, Date.now(), locale);

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
      persistenceKey: "ai-stream-form",
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
 * Hook for AI chat functionality with streaming support
 * Integrates useChat from @ai-sdk/react with our endpoint patterns
 */
export function useAiStreamChat(params?: {
  initialMessages?: Array<{
    role: "user" | "assistant" | "system";
    content: string;
  }>;
  systemPrompt?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  onFinish?: (message: { id: string; role: string; content: string }) => void;
  onError?: (error: Error) => void;
}): ReturnType<typeof useChat> & {
  isStreaming: boolean;
  streamingMessages: Array<{ id: string; role: string; content: string }>;
  sendStreamingMessage: (e: React.FormEvent<HTMLFormElement>) => void;
  clearStreamingChat: () => void;
  endpoint: EndpointReturn<typeof definitions>;
} {
  const {
    initialMessages = [],
    systemPrompt,
    model = "gpt-4o",
    temperature = 0.7,
    maxTokens = 1000,
    onFinish,
    onError,
  } = params || {};

  // Get the endpoint for API path construction
  const endpoint = useAiStreamEndpoint({ enabled: false });

  // Construct the API path for useChat
  const apiPath = useMemo(() => {
    // For streaming endpoints, we use a fixed path since useChat handles the API calls directly
    return "/api/en/v1/template-api/ai-stream";
  }, []);

  // Use the useChat hook with our API endpoint
  const chatResult = useChat({
    api: apiPath,
    initialMessages: initialMessages.map((msg, index) => ({
      id: `msg-${index}`,
      role: msg.role,
      content: msg.content,
    })),
    body: {
      model,
      temperature,
      maxTokens,
      systemPrompt,
    },
    onFinish: (message) => {
      if (onFinish) {
        onFinish(message);
      }
    },
    onError: (error) => {
      if (onError) {
        onError(error);
      }
    },
  });

  return {
    ...chatResult,
    // Additional properties for better integration
    isStreaming: chatResult.isLoading || false,
    streamingMessages: chatResult.messages.filter((msg) => msg.role !== "data"),
    sendStreamingMessage: chatResult.handleSubmit,
    clearStreamingChat: (): void => chatResult.setMessages([]),
    // Expose endpoint for form operations if needed
    endpoint,
  };
}

/**
 * Hook for AI stream form operations
 * Provides form functionality for configuring AI stream parameters
 */
export function useAiStreamForm(params?: {
  defaultValues?: Partial<AiStreamPostRequestTypeOutput>;
}): EndpointReturn<typeof definitions> {
  const { locale } = useTranslation();
  const logger = createEndpointLogger(false, Date.now(), locale);
  const { defaultValues } = params || {};

  const formOptions = useMemo(
    () => ({
      persistForm: true,
      persistenceKey: "ai-stream-config-form",
      defaultValues: {
        model: "gpt-4o",
        temperature: 0.7,
        maxTokens: 1000,
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
