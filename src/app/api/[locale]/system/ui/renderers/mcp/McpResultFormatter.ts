/**
 * MCP Result Formatter
 *
 * Formats MCP tool execution results for display using fast-ink rendering.
 * Renders response data using endpoint definitions for pretty output.
 */

import { getFullPath } from "next-vibe/core/core-utils/path";
import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import type { WidgetData } from "next-vibe/core/utils/json";
import { parseError } from "next-vibe/core/utils/parse-error";
import { EXECUTE_TOOL_ALIAS } from "next-vibe/execute-tool/constants";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { renderToString as fastRenderToString } from "next-vibe/ui/renderers/cli/response/fast-ink-renderer/renderer";
import { prewarmLazyWidgets } from "next-vibe/ui/renderers/cli/response/result-formatter";
import React from "react";

import { getEndpoint } from "@/generated/endpoints/endpoint";

import { McpRenderTree } from "./render-tree";

/**
 * Static class for formatting MCP results with fast rendering
 */
export class McpResultFormatter {
  /**
   * Format a successful response for MCP display
   */
  static async formatSuccess(
    data: WidgetData,
    endpoint: CreateApiEndpointAny | null,
    locale: CountryLanguage,
    logger: EndpointLogger,
    user: JwtPayloadType,
    requestInput?: Record<string, WidgetData>,
  ): Promise<string> {
    if (!endpoint || !data) {
      // Fallback to JSON if no endpoint definition
      logger.info("[MCP Result Formatter] Fallback to JSON");
      return JSON.stringify(data, null, 2);
    }

    // execute-tool response: render the inner endpoint's widget directly.
    // Detect by endpoint alias + { result } wrapper in response data.
    // Use requestInput.toolName (passed by the MCP registry) to resolve the inner endpoint.
    const isExecuteTool =
      endpoint.aliases?.includes(EXECUTE_TOOL_ALIAS) ?? false;
    const rawInnerToolName =
      isExecuteTool && requestInput ? requestInput["toolName"] : undefined;
    const innerToolName =
      typeof rawInnerToolName === "string" ? rawInnerToolName : undefined;
    if (
      isExecuteTool &&
      innerToolName &&
      typeof data === "object" &&
      data !== null &&
      !Array.isArray(data) &&
      !(data instanceof Date) &&
      "result" in data
    ) {
      const canonicalId = getFullPath(innerToolName) ?? innerToolName;
      const innerEndpoint = await getEndpoint(canonicalId);
      if (innerEndpoint) {
        return McpResultFormatter.renderWithEndpoint(
          data["result"],
          innerEndpoint,
          locale,
          logger,
          user,
        );
      }
    }

    return McpResultFormatter.renderWithEndpoint(
      data,
      endpoint,
      locale,
      logger,
      user,
    );
  }

  /**
   * Format an error response for MCP display
   */
  static formatError(error: ResponseType<WidgetData>): string {
    // Return structured error as JSON for MCP
    return JSON.stringify(error, null, 2);
  }

  /**
   * Render data using endpoint definition with fast renderer
   */
  private static async renderWithEndpoint(
    data: WidgetData,
    endpoint: CreateApiEndpointAny,
    locale: CountryLanguage,
    logger: EndpointLogger,
    user: JwtPayloadType,
  ): Promise<string> {
    try {
      const perfStart = performance.now();

      // Pre-warm lazy widgets
      await prewarmLazyWidgets(endpoint);

      // Create component
      const createStart = performance.now();
      const component = React.createElement(McpRenderTree, {
        endpoint,
        locale,
        data,
        logger,
        user,
      });
      const componentTime = performance.now() - createStart;

      // Use fast renderer for performance
      const renderStart = performance.now();
      const output = fastRenderToString(component, logger);
      const renderTime = performance.now() - renderStart;

      const totalTime = performance.now() - perfStart;

      logger.debug(
        `[MCP Fast Renderer] createElement: ${componentTime.toFixed(2)}ms, ` +
          `render: ${renderTime.toFixed(2)}ms, ` +
          `total: ${totalTime.toFixed(2)}ms, ` +
          `output: ${output.length} chars`,
      );

      // Fall back to JSON if renderer produced empty output (reconciler failure)
      if (!output) {
        logger.debug("[MCP Fast Renderer] Empty output, falling back to JSON");
        return JSON.stringify(data, null, 2);
      }

      return output;
    } catch (error) {
      // Fallback to JSON if rendering fails
      logger.warn("MCP rendering failed, falling back to JSON:", {
        error: parseError(error),
      });
      return JSON.stringify(data, null, 2);
    }
  }
}
