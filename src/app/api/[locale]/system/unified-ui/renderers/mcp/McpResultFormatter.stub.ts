/**
 * MCP Result Formatter Stub
 *
 * This stub prevents Next.js from bundling the real McpResultFormatter
 * which has dependencies on ink and other Node-only packages.
 *
 * The real implementation is only used in MCP server contexts, not in Next.js routes.
 */

import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { InferJwtPayloadTypeFromRoles } from "next-vibe/core/route/handler";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import type { WidgetData } from "next-vibe/core/utils/json";
import type { UserRoleValue } from "next-vibe/identity/roles/enum";
import type { EndpointLogger } from "next-vibe/logger/types";

export class McpResultFormatter {
  static async formatSuccess(
    data: WidgetData,
    endpoint: CreateApiEndpointAny | null,
    locale: CountryLanguage,
    logger: EndpointLogger,
    user: InferJwtPayloadTypeFromRoles<readonly UserRoleValue[]>,
    requestInput?: Record<string, WidgetData>,
  ): Promise<string> {
    void data;
    void endpoint;
    void locale;
    void logger;
    void user;
    void requestInput;
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax
    throw new Error("McpResultFormatter.formatSuccess not implemented");
  }

  private static formatError(error: ResponseType<WidgetData>): string {
    void error;
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax
    throw new Error("McpResultFormatter.formatError not implemented");
  }
}
