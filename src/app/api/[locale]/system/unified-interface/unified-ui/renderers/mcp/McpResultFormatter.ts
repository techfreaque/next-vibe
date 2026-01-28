/**
 * MCP Result Formatter
 *
 * Formats MCP tool execution results for display using fast-ink rendering.
 * Renders response data using endpoint definitions for pretty output.
 */

import { parseError } from "next-vibe/shared/utils";
import { createElement } from "react";

import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import type { InferJwtPayloadTypeFromRoles } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/handler";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/widgets/widget-data";
import type { UserRoleValue } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import { renderToString as fastRenderToString } from "../cli/response/fast-ink-renderer/renderer";
import { McpEndpointRenderer } from "./McpEndpointRenderer";

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
    user: InferJwtPayloadTypeFromRoles<readonly UserRoleValue[]>,
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
    user: InferJwtPayloadTypeFromRoles<readonly UserRoleValue[]>,
  ): string {
    try {
      const perfStart = performance.now();

      // Create component
      const createStart = performance.now();
      const component = createElement(McpEndpointRenderer, {
        endpoint,
        locale,
        data,
        logger,
        user,
        response: { success: true, data },
      });
      const componentTime = performance.now() - createStart;

      // Use fast renderer for performance
      const renderStart = performance.now();
      const output = fastRenderToString(component);
      const renderTime = performance.now() - renderStart;

      const totalTime = performance.now() - perfStart;

      logger.debug(
        `[MCP Fast Renderer] createElement: ${componentTime.toFixed(2)}ms, ` +
          `render: ${renderTime.toFixed(2)}ms, ` +
          `total: ${totalTime.toFixed(2)}ms, ` +
          `output: ${output.length} chars`,
      );

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
