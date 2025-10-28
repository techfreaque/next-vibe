/**
 * Middleware Types
 *
 * This file defines the core types for the middleware system.
 */

import type { NextRequest, NextResponse } from "next/server";

/**
 * Middleware function type
 * Takes a request and optional response, returns a response
 */
export type MiddlewareFunction = (
  request: NextRequest,
  response?: NextResponse,
) => Promise<NextResponse> | NextResponse;

/**
 * Middleware handler options
 */
export interface MiddlewareOptions {
  /**
   * Whether to skip this middleware
   * Can be a boolean or a function that returns a boolean
   */
  skip?: boolean | ((request: NextRequest) => boolean);

  /**
   * Custom matcher for this middleware
   * Can be a string, regex, or function that returns a boolean
   */
  matcher?: string | RegExp | ((path: string) => boolean);
}

/**
 * Middleware handler
 * Combines a middleware function with options
 */
export interface MiddlewareHandler {
  /**
   * The middleware function
   */
  handler: MiddlewareFunction;

  /**
   * Options for this middleware
   */
  options?: MiddlewareOptions;
}

/**
 * Middleware configuration
 */
export interface MiddlewareConfig {
  /**
   * Global matcher configuration
   * This will be used in the Next.js middleware config
   */
  matcher: string[];

  /**
   * Debug mode
   * If true, middleware will log debug information
   */
  debug: boolean;
}

const definitions = {};

export default definitions;
