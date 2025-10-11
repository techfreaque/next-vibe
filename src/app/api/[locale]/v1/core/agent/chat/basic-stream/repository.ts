/**
 * Basic Stream Repository
 * Data access layer for basic streaming functionality with random string generation
 */

import "server-only";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type { EndpointLogger } from "../../../system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { BasicStreamPostRequestTypeOutput } from "./definition";

// Constants for message formatting
const MESSAGE_CONSTANTS = {
  TIMESTAMP_WRAPPER: {
    OPEN: " (",
    CLOSE: ")",
  },
  SEPARATOR: ": ",
  COUNTER_PREFIX: " ",
} as const;

// Constants for streaming protocol
const STREAMING_CONSTANTS = {
  LINE_ENDING: "\n\n",
  CONTENT_TYPE: "text/plain; charset=utf-8",
  CACHE_CONTROL: "no-cache",
  CONNECTION: "keep-alive",
} as const;

// Constants for error handling
const ERROR_CONSTANTS = {
  UNKNOWN_ERROR: "Unknown error",
} as const;

/**
 * Basic Stream Repository Interface
 */
export interface BasicStreamRepository {
  streamMessages(
    data: BasicStreamPostRequestTypeOutput,
    logger: EndpointLogger,
    userId?: string,
    locale?: CountryLanguage,
  ): Response;

  generateRandomString(length?: number): string;
}

/**
 * Basic Stream Repository Implementation
 */
class BasicStreamRepositoryImpl implements BasicStreamRepository {
  /**
   * Generate a random string
   */
  generateRandomString(length = 10): string {
    const chars = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
    ].join("");
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Stream messages progressively using a for-loop
   */
  streamMessages(
    data: BasicStreamPostRequestTypeOutput,
    logger: EndpointLogger,
    userId?: string,
    locale: CountryLanguage = "en-GLOBAL",
  ): Response {
    const { t } = simpleT(locale);

    try {
      logger.debug("", {
        count: data.count,
        delay: data.delay,
        prefix: data.prefix,
        userId,
      });

      const startTime = Date.now();
      const generateRandomString = this.generateRandomString.bind(this);
      const count = data.count ?? 10;
      const delay = data.delay ?? 1000;
      const prefix = data.prefix ?? t("charts.api.messages.message_prefix");

      // Create a readable stream
      const stream = new ReadableStream({
        async start(
          controller: ReadableStreamDefaultController<Uint8Array>,
        ): Promise<void> {
          try {
            for (let i = 1; i <= count; i++) {
              // Generate message content
              let message = prefix;

              if (data.includeCounter) {
                message += MESSAGE_CONSTANTS.COUNTER_PREFIX + i.toString();
              }

              if (data.includeTimestamp) {
                const timestamp = new Date().toISOString();
                message =
                  message +
                  MESSAGE_CONSTANTS.TIMESTAMP_WRAPPER.OPEN +
                  timestamp +
                  MESSAGE_CONSTANTS.TIMESTAMP_WRAPPER.CLOSE;
              }

              // Add random string
              message =
                message + MESSAGE_CONSTANTS.SEPARATOR + generateRandomString(8);

              // Create the streaming data chunk
              const chunk = {
                type: "text",
                content: message,
                index: i,
                isComplete: i === count,
                timestamp: Date.now(),
              };

              // Encode and send the chunk
              const encoder = new TextEncoder();
              const chunkData =
                t("charts.api.streaming.data_prefix") +
                JSON.stringify(chunk) +
                STREAMING_CONSTANTS.LINE_ENDING;
              controller.enqueue(encoder.encode(chunkData));

              logger.debug("", { message, progress: `${i}/${count}` });

              // Wait for the specified delay (except for the last message)
              if (i < count) {
                await new Promise<void>((resolve) => {
                  setTimeout(() => resolve(), delay);
                });
              }
            }

            // Send completion message
            const completionChunk = {
              type: "completion",
              success: true,
              totalMessages: count,
              duration: Date.now() - startTime,
              completed: true,
            };

            const encoder = new TextEncoder();
            const completionData =
              t("charts.api.streaming.data_prefix") +
              JSON.stringify(completionChunk) +
              STREAMING_CONSTANTS.LINE_ENDING;
            controller.enqueue(encoder.encode(completionData));

            // Close the stream
            controller.close();

            logger.debug("", {
              totalMessages: count,
              duration: Date.now() - startTime,
            });
          } catch (error) {
            logger.error("", error);

            // Send error message
            const errorChunk = {
              type: "error",
              error: "streamingErrors.basicStream.error.processing",
              message:
                error instanceof Error
                  ? error.message
                  : t("charts.errors.unknown_error"),
            };

            const encoder = new TextEncoder();
            const errorData =
              t("charts.api.streaming.data_prefix") +
              JSON.stringify(errorChunk) +
              STREAMING_CONSTANTS.LINE_ENDING;
            controller.enqueue(encoder.encode(errorData));

            controller.close();
          }
        },
      });

      // Return the streaming response
      return new Response(stream, {
        headers: {
          "Content-Type": STREAMING_CONSTANTS.CONTENT_TYPE,
          "Cache-Control": STREAMING_CONSTANTS.CACHE_CONTROL,
          "Connection": STREAMING_CONSTANTS.CONNECTION,
        },
      });
    } catch (error) {
      logger.error("", error);

      // Return error as regular response
      return new Response(
        JSON.stringify({
          error: "streamingErrors.basicStream.error.initialization",
          success: false,
          message:
            error instanceof Error
              ? error.message
              : ERROR_CONSTANTS.UNKNOWN_ERROR,
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }
  }
}

/**
 * Repository instance
 */
export const basicStreamRepository = new BasicStreamRepositoryImpl();
