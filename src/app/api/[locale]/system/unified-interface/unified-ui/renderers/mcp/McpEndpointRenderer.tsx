/**
 * MCP Endpoint Renderer
 *
 * Response-only endpoint renderer for MCP.
 * Simplified version of CLI renderer - only renders response fields.
 */

import { Box, Text } from "ink";
import type { JSX } from "react";
import type { ZodTypeAny } from "zod";

import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { UnifiedField } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/widgets/widget-data";
import type {
  BaseWidgetContext,
  FieldUsageConfig,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { isResponseField } from "../../widgets/_shared/type-guards";
import { useCliNavigation } from "../cli/use-cli-navigation";
import { McpWidgetRenderer } from "./McpWidgetRenderer";

/**
 * MCP Endpoint Renderer Props
 */
export interface McpEndpointRendererProps<
  TEndpoint extends CreateApiEndpointAny,
> {
  /** The endpoint definition */
  endpoint: TEndpoint;
  /** Current locale */
  locale: CountryLanguage;
  /** Response data to render */
  data: WidgetData;
  /** Logger instance */
  logger: EndpointLogger;
  /** User for permission checks */
  user: JwtPayloadType;
  /** Response object */
  response: ResponseType<WidgetData>;
}

/**
 * Extract ALL fields from endpoint definition recursively
 */
function extractAllFields<const TKey extends string>(
  fields: UnifiedField<TKey, ZodTypeAny, FieldUsageConfig, any>, // oxlint-disable-line typescript/no-explicit-any
  parentPath = "",
  // oxlint-disable-next-line typescript/no-explicit-any
): Array<[string, UnifiedField<TKey, ZodTypeAny, FieldUsageConfig, any>]> {
  if (!fields || typeof fields !== "object") {
    return [];
  }

  // Check if this is an object field with children
  if (
    !("schemaType" in fields) ||
    (fields.schemaType !== "object" &&
      fields.schemaType !== "object-optional") ||
    !("children" in fields) ||
    !fields.children
  ) {
    return [];
  }

  const result: Array<
    // oxlint-disable-next-line typescript/no-explicit-any
    [string, UnifiedField<TKey, ZodTypeAny, FieldUsageConfig, any>]
  > = [];

  for (const [fieldName, fieldDef] of Object.entries(fields.children)) {
    if (typeof fieldDef === "object" && fieldDef !== null) {
      const fullPath = parentPath ? `${parentPath}.${fieldName}` : fieldName;
      result.push([fullPath, fieldDef]);
    }
  }

  return result;
}

/**
 * MCP Endpoint Renderer - Response-only rendering
 */
export function McpEndpointRenderer<TEndpoint extends CreateApiEndpointAny>({
  endpoint,
  locale,
  data,
  logger,
  user,
  response,
}: McpEndpointRendererProps<TEndpoint>): JSX.Element {
  // Create navigation for context (required even for response-only mode)
  const navigation = useCliNavigation();

  // Create render context (response-only)
  const context: BaseWidgetContext<TEndpoint> = {
    locale,
    isInteractive: false,
    logger,
    user,
    platform: Platform.MCP,
    endpointFields: endpoint.fields,
    disabled: true,
    response,
    endpointMutations: undefined,
    t: endpoint.scopedTranslation.scopedT(locale).t,
    navigation,
    endpoint,
    responseOnly: true,
  };

  // For MCP response-only rendering, always extract fields - no interactive containers
  // This simplifies rendering and avoids type complexity

  // Extract and render fields separately
  const allFields = extractAllFields(endpoint.fields);
  logger.debug(`[MCP Endpoint] Extracted ${allFields.length} fields`, {
    fieldNames: allFields.map(([name]) => name),
  });

  // Sort fields by order
  const fields = allFields.toSorted(([, fieldA], [, fieldB]) => {
    let orderA = Number.MAX_SAFE_INTEGER;
    if ("ui" in fieldA && fieldA.ui && typeof fieldA.ui === "object") {
      const ui = fieldA.ui;
      if ("order" in ui && typeof ui.order === "number") {
        orderA = ui.order;
      }
    }

    let orderB = Number.MAX_SAFE_INTEGER;
    if ("ui" in fieldB && fieldB.ui && typeof fieldB.ui === "object") {
      const ui = fieldB.ui;
      if ("order" in ui && typeof ui.order === "number") {
        orderB = ui.order;
      }
    }
    return orderA - orderB;
  });

  // Filter to only response fields with data
  const visibleFields = fields.filter(([fieldName, field]) => {
    // Only show response fields
    if (!isResponseField(field)) {
      logger.debug(`[MCP] Field ${fieldName} is not a response field`);
      return false;
    }

    // Only show fields with data
    const fieldData =
      data && typeof data === "object" && !Array.isArray(data)
        ? data[fieldName]
        : undefined;

    const hasData = fieldData !== null && fieldData !== undefined;
    if (!hasData) {
      logger.debug(`[MCP] Field ${fieldName} has no data`);
    }
    return hasData;
  });
  logger.debug(`[MCP Endpoint] ${visibleFields.length} fields have data`, {
    visibleFieldNames: visibleFields.map(([name]) => name),
  });

  // Render all visible fields
  return !visibleFields.length ? (
    <Text dimColor>
      {context.t("app.api.system.unifiedInterface.mcp.noResponse")}
    </Text>
  ) : (
    <Box flexDirection="column">
      {visibleFields.map(([fieldName, field]) => {
        const fieldData =
          data && typeof data === "object" && !Array.isArray(data)
            ? data[fieldName]
            : undefined;
        return (
          <McpWidgetRenderer
            key={fieldName}
            fieldName={fieldName}
            field={field}
            fieldValue={fieldData}
            context={context}
          />
        );
      })}
    </Box>
  );
}
