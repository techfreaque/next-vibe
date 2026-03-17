/**
 * MCP Result Formatter
 *
 * Formats MCP tool execution results for display using fast-ink rendering.
 * Renders response data using endpoint definitions for pretty output.
 */

import { parseError } from "next-vibe/shared/utils";
import { createElement } from "react";

import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/widgets/widget-data";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { InkEndpointRenderer } from "../cli/CliEndpointRenderer";
import { renderToString as fastRenderToString } from "../cli/response/fast-ink-renderer/renderer";

/**
 * Static class for formatting MCP results with fast rendering
 */
export class McpResultFormatter {
  /**
   * Format a successful response for MCP display
   */
  static formatSuccess(
    data: WidgetData,
    endpoint: CreateApiEndpointAny | null,
    locale: CountryLanguage,
    logger: EndpointLogger,
    user: JwtPayloadType,
  ): string {
    if (!endpoint || !data) {
      // Fallback to JSON if no endpoint definition
      logger.info("[MCP Result Formatter] Fallback to JSON");
      return JSON.stringify(data, null, 2);
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
  private static renderWithEndpoint(
    data: WidgetData,
    endpoint: CreateApiEndpointAny,
    locale: CountryLanguage,
    logger: EndpointLogger,
    user: JwtPayloadType,
  ): string {
    try {
      const perfStart = performance.now();

      // Create component
      const createStart = performance.now();
      const component = createElement(InkEndpointRenderer, {
        endpoint,
        locale,
        data,
        logger,
        user,
        response: { success: true, data },
        responseOnly: true,
        platform: Platform.MCP,
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
