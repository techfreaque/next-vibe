/**
 * CLI Result Formatter
 * Static class for formatting CLI execution results and rendering responses
 */

import { parseError } from "next-vibe/shared/utils";
import { createElement } from "react";

import type { UserRoleValue } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import type { RouteExecutionResult } from "../../../../cli/runtime/route-executor";
import type { InferJwtPayloadTypeFromRoles } from "../../../../shared/endpoints/route/handler";
import type { EndpointLogger } from "../../../../shared/logger/endpoint";
import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import type { WidgetData } from "../../../../shared/widgets/widget-data";
import { InkEndpointRenderer } from "../CliEndpointRenderer";
import { CliErrorFormatter } from "./error-formatter";
import { renderToString as fastRenderToString } from "./fast-ink-renderer/renderer";

/**
 * Static class for formatting CLI execution results and rendering responses
 */
export class CliResultFormatter {
  /**
   * Format execution result for display
   */
  static async formatResult(
    result: RouteExecutionResult,
    outputFormat: "json" | "pretty",
    locale: CountryLanguage,
    verbose: boolean,
    logger: EndpointLogger,
    endpoint: CreateApiEndpointAny | null,
    user: InferJwtPayloadTypeFromRoles<readonly UserRoleValue[]>,
  ): Promise<string> {
    if (!result.success) {
      return CliErrorFormatter.formatErrorResult(result, locale, verbose);
    }

    let output = "";

    // Only show metadata in verbose mode
    if (verbose) {
      // eslint-disable-next-line i18next/no-literal-string
      output += "✅ Success\n";

      // Add execution metadata if available
      if (result.metadata?.route) {
        // eslint-disable-next-line i18next/no-literal-string
        output += `🛣️  Route: ${result.metadata.method} ${result.metadata.route}\n`;
      }
      output += "\n";
    }

    // Format data based on output format
    if (result.data) {
      output += "\n";

      switch (outputFormat) {
        case "json":
          // eslint-disable-next-line i18next/no-literal-string
          output += "📊 Result (JSON):\n";
          output += JSON.stringify(result.data, null, 2);
          break;
        case "pretty":
        default:
          // Render with Ink if endpoint available, else JSON fallback
          if (endpoint) {
            output += CliResultFormatter.renderWithEndpoint(
              result.data,
              endpoint,
              locale,
              logger,
              user,
            );
          } else {
            // Fallback to JSON without endpoint definition
            if (typeof result.data === "object") {
              output += JSON.stringify(result.data, null, 2);
            } else {
              output += String(result.data);
            }
          }
          break;
      }
    }

    return output;
  }

  /**
   * Render data using endpoint definition
   * Uses fast renderer with hook support
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
      const component = createElement(InkEndpointRenderer, {
        endpoint,
        locale,
        data,
        logger,
        user,
        response: { success: true, data },
        responseOnly: true,
      });
      const componentTime = performance.now() - createStart;

      // Use fast renderer (supports hooks via renderToStaticMarkup internally for function components)
      const renderStart = performance.now();
      const output = fastRenderToString(component);
      const renderTime = performance.now() - renderStart;

      const totalTime = performance.now() - perfStart;

      logger.debug(
        `[Fast Renderer] createElement: ${componentTime.toFixed(2)}ms, ` +
          `render: ${renderTime.toFixed(2)}ms, ` +
          `total: ${totalTime.toFixed(2)}ms, ` +
          `output: ${output.length} chars`,
      );

      return output;
    } catch (error) {
      // Fallback to JSON if rendering fails
      logger.warn("Fast rendering failed, falling back to JSON:", {
        error: parseError(error),
      });
      return JSON.stringify(data, null, 2);
    }
  }
}
