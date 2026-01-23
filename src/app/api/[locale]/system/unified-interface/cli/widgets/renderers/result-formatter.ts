/**
 * CLI Result Formatter
 * Static class for formatting CLI execution results and rendering responses
 */

import { parseError } from "next-vibe/shared/utils";
import type { z } from "zod";

import type { UserRoleValue } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import type { InferJwtPayloadTypeFromRoles } from "../../../shared/endpoints/route/handler";
import type { EndpointLogger } from "../../../shared/logger/endpoint";
import type {
  CreateApiEndpointAny,
  UnifiedField,
} from "../../../shared/types/endpoint";
import type { WidgetData } from "../../../shared/widgets/types";
import type { RouteExecutionResult } from "../../runtime/route-executor";
import { CliErrorFormatter } from "./error-formatter";
import { modularCLIResponseRenderer } from "./response-renderer";

/**
 * Static class for formatting CLI execution results and rendering responses
 */
export class CliResultFormatter {
  /**
   * Format execution result for display
   */
  static formatResult(
    result: RouteExecutionResult,
    outputFormat: "json" | "pretty",
    locale: CountryLanguage,
    verbose: boolean,
    logger: EndpointLogger,
    endpoint: CreateApiEndpointAny | null,
    user: InferJwtPayloadTypeFromRoles<readonly UserRoleValue[]>,
  ): string {
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
          // Render with enhanced formatter if endpoint available, else JSON fallback
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
   * Render data using endpoint definition with enhanced CLI response renderer
   */
  private static renderWithEndpoint(
    data: WidgetData,
    endpoint: CreateApiEndpointAny,
    locale: CountryLanguage,
    logger: EndpointLogger,
    user: InferJwtPayloadTypeFromRoles<readonly UserRoleValue[]>,
  ): string {
    try {
      const fields = CliResultFormatter.extractResponseFields(endpoint);
      const { t } = endpoint.scopedTranslation.scopedT(locale);

      return modularCLIResponseRenderer.render(
        endpoint,
        data,
        fields,
        locale,
        t,
        logger,
        user,
      );
    } catch (error) {
      // Fallback to JSON if enhanced rendering fails
      logger.warn("Enhanced rendering failed, falling back to JSON:", {
        error: parseError(error),
      });
      return JSON.stringify(data, null, 2);
    }
  }

  /**
   * Extract response fields from endpoint definition
   */
  private static extractResponseFields<const TKey extends string>(
    endpointDefinition: CreateApiEndpointAny,
  ): Array<[string, UnifiedField<TKey, z.ZodTypeAny>]> {
    const fields = endpointDefinition.fields;
    if (!fields || fields.type !== "object" || !("children" in fields)) {
      return [];
    }

    const responseFields: Array<[string, UnifiedField<TKey, z.ZodTypeAny>]> =
      [];

    for (const [fieldName, fieldDef] of Object.entries(fields.children)) {
      if (CliResultFormatter.fieldHasResponse(fieldDef)) {
        responseFields.push([
          fieldName,
          fieldDef as UnifiedField<TKey, z.ZodTypeAny>,
        ]);
      }
    }

    return responseFields;
  }

  /**
   * Check if a field definition has response usage enabled
   */
  private static fieldHasResponse(
    fieldDef: UnifiedField<string, z.ZodTypeAny>,
  ): boolean {
    if (!fieldDef.usage) {
      return false;
    }

    const usage = fieldDef.usage;
    if (!usage) {
      return false;
    }

    // Check for direct response property
    if (usage.response && usage.response === true) {
      return true;
    }

    // Check method-specific usage for response
    return Object.values(usage).some(
      (methodUsage) =>
        typeof methodUsage === "object" &&
        methodUsage !== null &&
        "response" in methodUsage &&
        methodUsage.response === true,
    );
  }
}
