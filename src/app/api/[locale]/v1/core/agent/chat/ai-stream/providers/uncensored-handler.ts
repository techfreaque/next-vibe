/**
 * Uncensored.ai API Handler
 * 
 * Clean implementation following the official API docs.
 * The API is OpenAI-compatible but does NOT support streaming.
 * We convert the complete response to a streaming format for our frontend.
 */

import "server-only";

interface UncensoredMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface UncensoredRequest {
  model: string;
  messages: UncensoredMessage[];
  temperature?: number;
  max_tokens?: number;
}

interface UncensoredResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Call Uncensored.ai API and return streaming response
 * 
 * @param apiKey - Uncensored.ai API key
 * @param messages - Array of chat messages
 * @param temperature - Temperature parameter (0-2)
 * @param maxTokens - Maximum tokens to generate
 * @returns Response with streaming text in Vercel AI SDK format
 */
export async function handleUncensoredAI(
  apiKey: string,
  messages: UncensoredMessage[],
  temperature: number = 0.7,
  maxTokens: number = 2000,
): Promise<Response> {
  // Make API call per official docs
  const response = await fetch(
    "https://mkstqjtsujvcaobdksxs.functions.supabase.co/functions/v1/uncensoredlm-api",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "uncensored-lm",
        messages: messages,
        temperature: temperature,
        max_tokens: maxTokens,
      } as UncensoredRequest),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Uncensored.ai API error (${response.status}): ${errorText}`);
  }

  const data = await response.json() as UncensoredResponse;
  const content = data.choices?.[0]?.message?.content || '';

  // Convert complete response to streaming format
  // This simulates streaming for consistent frontend handling
  return createStreamingResponse(content);
}

/**
 * Convert complete text to streaming response
 * Uses Vercel AI SDK text stream format: "0:\"text\"\n"
 * 
 * @param content - Complete text content
 * @returns Response with streaming text
 */
function createStreamingResponse(content: string): Response {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    start(controller) {
      // Send in small chunks to simulate streaming
      const chunkSize = 20;
      
      for (let i = 0; i < content.length; i += chunkSize) {
        const chunk = content.slice(i, i + chunkSize);
        // Use JSON.stringify to properly escape the chunk
        const escaped = JSON.stringify(chunk).slice(1, -1);
        // Vercel AI SDK format
        controller.enqueue(encoder.encode(`0:"${escaped}"\n`));
      }
      
      controller.close();
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}

