/**
 * MCP Result Formatter Stub
 *
 * This stub prevents Next.js from bundling the real McpResultFormatter
 * which has dependencies on ink and other Node-only packages.
 *
 * The real implementation is only used in MCP server contexts, not in Next.js routes.
 */

import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import type { InferJwtPayloadTypeFromRoles } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/handler";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/widgets/widget-data";
import type { UserRoleValue } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

export class McpResultFormatter {
  static formatSuccess(
    data: WidgetData,
    endpoint: CreateApiEndpointAny | null,
    locale: CountryLanguage,
    logger: EndpointLogger,
    user: InferJwtPayloadTypeFromRoles<readonly UserRoleValue[]>,
  ): string {
    void data;
    void endpoint;
    void locale;
    void logger;
    void user;
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax
    throw new Error("McpResultFormatter.formatSuccess not implemented");
  }

  static formatError(error: ResponseType<WidgetData>): string {
    void error;
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax
    throw new Error("McpResultFormatter.formatError not implemented");
  }
}
