/**
 * AI Stream API Route Handler
 * Handles POST requests for AI-powered streaming chat functionality
 * Direct handler bypassing vibe framework for streaming support
 */

import "server-only";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import { chatMessageSchema } from "./definition";
import { z } from "zod";
import { isUncensoredAIModel } from "./providers/uncensored-ai";
import { handleUncensoredAI } from "./providers/uncensored-handler";

/**
 * Allow streaming responses up to 30 seconds
 */
export const maxDuration = 30;

const requestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(50),
  model: z.string(),
  temperature: z.coerce.number().min(0).max(2).default(0.7),
  maxTokens: z.coerce.number().min(1).max(4000).default(1000),
  systemPrompt: z.string().max(2000).optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // Validate request schema
    let data;
    try {
      data = requestSchema.parse(body);
    } catch (validationError) {
      return NextResponse.json(
        {
          error: "Invalid request data",
          details:
            validationError instanceof z.ZodError
              ? validationError.issues
              : undefined,
        },
        { status: 400 }
      );
    }

    // Build messages for AI SDK
    const messages = (
      data.systemPrompt
        ? [
            {
              role: "system" as const,
              content: data.systemPrompt,
            },
            ...data.messages.map((msg) => ({
              role: msg.role as "user" | "assistant",
              content: msg.content,
            })),
          ]
        : data.messages.map((msg) => ({
            role: msg.role as "user" | "assistant",
            content: msg.content,
          }))
    );

    // Check API keys
    if (isUncensoredAIModel(data.model)) {
      if (!process.env.UNCENSORED_AI_API_KEY) {
        return NextResponse.json(
          { error: "Uncensored.ai API key not configured" },
          { status: 500 }
        );
      }
    } else {
      if (!process.env.OPENROUTER_API_KEY) {
        return NextResponse.json(
          { error: "OpenRouter API key not configured" },
          { status: 500 }
        );
      }
    }

    // Create streaming response with error handling
    try {
      // Special handling for Uncensored.ai - doesn't support streaming
      if (isUncensoredAIModel(data.model)) {
        return await handleUncensoredAI(
          process.env.UNCENSORED_AI_API_KEY!,
          messages,
          data.temperature,
          data.maxTokens
        );
      }

      // Standard streaming for OpenRouter
      const provider = createOpenRouter({
        apiKey: process.env.OPENROUTER_API_KEY!,
      });

      const result = streamText({
        model: provider(data.model),
        messages,
        temperature: data.temperature,
        abortSignal: AbortSignal.timeout(maxDuration * 1000),
      });

      return result.toTextStreamResponse();
    } catch (streamError) {
      console.error("[AI Stream API] Stream creation error:", streamError);
      return NextResponse.json(
        {
          error:
            streamError instanceof Error
              ? streamError.message
              : "Failed to create stream",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    // Catch-all for unexpected errors
    console.error("Unexpected AI stream error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "An error occurred",
      },
      { status: 500 }
    );
  }
}

// Export tools for vibe CLI (empty since we're bypassing framework)
export const tools = {};
