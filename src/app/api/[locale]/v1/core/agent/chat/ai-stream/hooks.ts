/**
 * AI Stream Hooks
 * Client-side hooks for AI streaming operations with useChat integration
 */

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useCallback, useMemo } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint";
import { useTranslation } from "@/i18n/core/client";

import type { AiStreamPostRequestOutput } from "./definition";
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
 * Simplified version that returns only what's needed
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
}): {
  messages: Array<{ id: string; role: string; content: string }>;
  isStreaming: boolean;
  sendMessage: () => Promise<void>;
  clearChat: () => void;
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
    return "/api/en/v1/core/agent/chat/ai-stream";
  }, []);

  // Convert initialMessages to UIMessage format with parts
  const convertedMessages = useMemo(() => {
    return initialMessages.map((msg, index) => ({
      id: `msg-${index}`,
      role: msg.role,
      parts: [
        {
          type: "text" as const,
          text: msg.content,
        },
      ],
    }));
  }, [initialMessages]);

  // Create a transport with the necessary configuration
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: apiPath,
        body: {
          model,
          temperature,
          maxTokens,
          systemPrompt,
        },
      }),
    [apiPath, model, temperature, maxTokens, systemPrompt],
  );

  // Use the useChat hook with our API endpoint
  const chatResult = useChat({
    messages: convertedMessages,
    transport,
    onFinish: ({ message }) => {
      if (onFinish) {
        // Extract text content from message parts
        const textParts = message.parts.filter((part) => part.type === "text");
        const content = textParts
          .map((part) => (part.type === "text" ? part.text : ""))
          .join("");

        onFinish({
          id: message.id,
          role: message.role,
          content,
        });
      }
    },
    onError: (error) => {
      if (onError) {
        onError(error);
      }
    },
  });

  // Convert messages to simple format
  const simpleMessages = useMemo(() => {
    const getMessageText = (
      message: (typeof chatResult.messages)[0],
    ): string => {
      const textParts = message.parts.filter((part) => part.type === "text");
      return textParts
        .map((part) => (part.type === "text" ? part.text : ""))
        .join("");
    };

    return chatResult.messages
      .filter(
        (msg) =>
          msg.role === "user" ||
          msg.role === "assistant" ||
          msg.role === "system",
      )
      .map((msg) => ({
        id: msg.id,
        role: msg.role,
        content: getMessageText(msg),
      }));
  }, [chatResult]);

  const clearChat = useCallback(() => {
    chatResult.setMessages([]);
  }, [chatResult]);

  return {
    messages: simpleMessages,
    isStreaming:
      chatResult.status === "streaming" || chatResult.status === "submitted",
    sendMessage: chatResult.sendMessage,
    clearChat,
    endpoint,
  };
}

/**
 * Hook for AI stream form operations
 * Provides form functionality for configuring AI stream parameters
 */
export function useAiStreamForm(params?: {
  defaultValues?: Partial<AiStreamPostRequestOutput>;
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
