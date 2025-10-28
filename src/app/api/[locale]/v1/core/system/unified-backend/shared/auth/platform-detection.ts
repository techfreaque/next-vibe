/**
 * Platform Detection Utilities
 * Provides utilities to detect the platform from request context
 * This is platform-agnostic logic that determines which platform handler to use
 */

import type { NextRequest } from "next/server";

import type { AuthPlatform } from "./base-auth-handler";

/**
 * Detect platform from request context
 * Uses request headers and URL to determine the platform
 *
 * Detection strategy:
 * 1. Check user-agent for CLI/MCP indicators
 * 2. Check URL path for tRPC indicator
 * 3. Default to Next.js/web platform
 *
 * @param request - Next.js request object
 * @returns The detected platform
 */
export function detectPlatformFromRequest(request: NextRequest): AuthPlatform {
  // Check for CLI/MCP indicators in user-agent
  const userAgent = request.headers.get("user-agent") || "";

  // CLI and MCP typically have custom user agents
  if (userAgent.includes("vibe-cli") || userAgent.includes("mcp")) {
    return "cli";
  }

  // Check for tRPC indicator in URL path
  const pathname = request.nextUrl?.pathname || "";
  if (pathname.includes("/trpc/")) {
    return "trpc";
  }

  // Default to Next.js/web platform
  return "next";
}

/**
 * Check if request is from CLI platform
 */
export function isCliRequest(request: NextRequest): boolean {
  const userAgent = request.headers.get("user-agent") || "";
  return userAgent.includes("vibe-cli");
}

/**
 * Check if request is from MCP platform
 */
export function isMcpRequest(request: NextRequest): boolean {
  const userAgent = request.headers.get("user-agent") || "";
  return userAgent.includes("mcp");
}

/**
 * Check if request is from tRPC
 */
export function isTrpcRequest(request: NextRequest): boolean {
  const pathname = request.nextUrl?.pathname || "";
  return pathname.includes("/trpc/");
}

/**
 * Check if request is from web/Next.js platform
 */
export function isWebRequest(request: NextRequest): boolean {
  return (
    !isCliRequest(request) && !isMcpRequest(request) && !isTrpcRequest(request)
  );
}
