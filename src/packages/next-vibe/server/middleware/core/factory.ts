/**
 * Middleware Factory
 *
 * This file provides a factory function to compose multiple middleware functions.
 */

import type { NextRequest, NextResponse } from "next/server";
import { NextResponse as NextResponseClass } from "next/server";

import { parseError } from "../../../shared/utils/parse-error";
import {
  middlewareDebugLogger,
  middlewareErrorLogger,
  middlewareInfoLogger,
} from "./logger";
import type { MiddlewareFunction, MiddlewareHandler } from "./types";

/**
 * Creates a middleware pipeline from multiple middleware handlers
 *
 * @param middlewares Array of middleware handlers
 * @param config Global middleware configuration
 * @returns A composed middleware function
 */
export function createMiddleware(
  middlewares: MiddlewareHandler[],
): MiddlewareFunction {
  // eslint-disable-next-line node/no-process-env
  const debug = process.env.NODE_ENV === "development";
  return async function composedMiddleware(
    request: NextRequest,
  ): Promise<NextResponse> {
    const path = request.nextUrl.pathname;

    // Debug logging
    if (debug) {
      middlewareDebugLogger(`Processing request for path: ${path}`);
    }

    // Start with a default response
    let response = NextResponseClass.next();

    // Process each middleware in sequence
    for (const { handler, options } of middlewares) {
      // Check if we should skip this middleware
      const shouldSkip =
        typeof options?.skip === "function"
          ? options.skip(request)
          : options?.skip === true;

      if (shouldSkip) {
        if (debug) {
          middlewareInfoLogger(`Skipping middleware for path: ${path}`);
        }
        continue;
      }

      // Check if this middleware matches the current path
      const matcher = options?.matcher;
      const shouldProcess = matcher
        ? typeof matcher === "string"
          ? path.startsWith(matcher)
          : matcher instanceof RegExp
            ? matcher.test(path)
            : typeof matcher === "function"
              ? matcher(path)
              : true
        : true;

      if (!shouldProcess) {
        if (debug) {
          middlewareDebugLogger(
            `Path ${path} does not match middleware matcher`,
          );
        }
        continue;
      }

      // Process this middleware
      if (debug) {
        middlewareDebugLogger(`Processing middleware for path: ${path}`);
      }

      try {
        // Pass the current response to the next middleware
        response = await handler(request, response);

        // If the response is a redirect or rewrite, stop the middleware chain
        if (
          response.headers.get("x-middleware-rewrite") ||
          response.headers.get("x-middleware-next") === "0" ||
          response.headers.get("location")
        ) {
          if (debug) {
            middlewareDebugLogger(
              `Middleware chain stopped with redirect/rewrite`,
            );
          }
          break;
        }
      } catch (error) {
        middlewareErrorLogger(`Error in middleware:`, parseError(error));
        // Continue with the current response
      }
    }

    return response;
  };
}
