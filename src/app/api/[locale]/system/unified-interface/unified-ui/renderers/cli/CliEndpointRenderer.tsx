/**
 * Ink Endpoint Renderer
 *
 * Mirrors React EndpointRenderer architecture for terminal UI.
 * Renders ALL fields from endpoint definition using Ink widgets.
 *
 * KEY CONCEPT (same as React):
 * - Renders ALL fields from the endpoint definition
 * - Widgets decide what to show based on their data state
 * - Form fields show input (for request mode)
 * - Other widgets show response data when available
 * - NO separate request/response modes - just render everything
 */

import { Box, Text } from "ink";
import type { JSX } from "react";
import { useState } from "react";
import type { Path } from "react-hook-form";

import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/widgets/widget-data";
import type { InkWidgetContext } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { InkFormState } from "../../widgets/_shared/cli-types";
import {
  extractAllFields,
  withValue,
} from "../../widgets/_shared/field-helpers";
import { InkWidgetContextProvider } from "../../widgets/_shared/InkWidgetContextProvider";
import { isObject, isResponseField } from "../../widgets/_shared/type-guards";
import type {
  BaseWidgetConfig,
  FieldUsageConfig,
  SchemaTypes,
} from "../../widgets/_shared/types";
import { InkWidgetRenderer } from "./CliWidgetRenderer";
import { useCliNavigation } from "./use-cli-navigation";

/**
 * Ink Endpoint Renderer Props
 */
export interface InkEndpointRendererProps<
  TEndpoint extends CreateApiEndpointAny,
> {
  /** The endpoint definition */
  endpoint: TEndpoint;
  /** Current locale */
  locale: CountryLanguage;
  /** Data to populate fields with */
  data?: WidgetData;
  /** Whether the form is submitting */
  isSubmitting?: boolean;
  /** Logger instance for widgets */
  logger: EndpointLogger;
  /** User object for permission checks */
  user: JwtPayloadType;
  /** Submit handler */
  onSubmit?: (
    data: TEndpoint["types"]["RequestOutput"],
  ) => void | Promise<void>;
  /** Response from endpoint */
  response?: ResponseType<WidgetData>;
  /** Called when all Suspense boundaries have resolved */
  onRenderComplete?: () => void;
  /** Whether this is result-formatter mode (only show response fields) vs interactive mode (show all fields) */
  responseOnly?: boolean;
  /** Platform identifier for widget rendering context */
  platform:
    | typeof Platform.CLI
    | typeof Platform.CLI_PACKAGE
    | typeof Platform.MCP;
}

/**
 * Ink Endpoint Renderer Component
 * Renders ALL fields using Ink widgets - mirrors React architecture
 */
export function InkEndpointRenderer<TEndpoint extends CreateApiEndpointAny>({
  endpoint,
  locale,
  data,
  isSubmitting = false,
  logger,
  user,
  onSubmit,
  response,
  onRenderComplete,
  responseOnly = false,
  platform,
}: InkEndpointRendererProps<TEndpoint>): JSX.Element {
  // Form state management
  const [formValues, setFormValues] = useState<
    Partial<TEndpoint["types"]["RequestOutput"]>
  >({});
  const [formErrors] = useState<Record<string, string>>({});

  // Create form state object
  const form: InkFormState<TEndpoint["types"]["RequestOutput"]> = {
    values: formValues,
    setValue: <TValue,>(name: string, value: TValue) => {
      setFormValues((prev) => ({ ...prev, [name]: value }));
    },
    getValue: <TValue,>(name: string): TValue | undefined => {
      const key = name as keyof typeof formValues;
      const val = formValues[key];
      return val as TValue | undefined;
    },
    errors: formErrors,
  };

  // Create navigation for CLI
  const navigation = useCliNavigation();

  // Handle submit
  const handleSubmit = (): void => {
    if (onSubmit) {
      void onSubmit(formValues as TEndpoint["types"]["RequestOutput"]);
    }
  };

  // Create render context with CLI-specific form state
  const context: InkWidgetContext<TEndpoint> = {
    locale,
    isInteractive: platform !== Platform.MCP,
    logger,
    user,
    platform,
    endpointFields: endpoint.fields,
    disabled: false,
    response,
    endpointMutations: undefined,
    t: endpoint.scopedTranslation.scopedT(locale).t,
    navigation,
    endpoint,
    responseOnly,
    form,
    onSubmit: handleSubmit,
    isSubmitting,
  };

  // Check if root is a container/array widget that should render directly
  const isRootContainer =
    "schemaType" in endpoint.fields &&
    (endpoint.fields.schemaType === "object" ||
      endpoint.fields.schemaType === "object-optional" ||
      endpoint.fields.schemaType === "widget-object" ||
      endpoint.fields.schemaType === "array" ||
      endpoint.fields.schemaType === "array-optional");

  logger.debug(`[InkEndpointRenderer] Rendering endpoint`, {
    isRootContainer,
    responseOnly,
    hasData: !!data,
    dataKeys:
      data && typeof data === "object" && !Array.isArray(data)
        ? Object.keys(data)
        : [],
  });

  // If root is a container, render it directly (same as React)
  if (isRootContainer) {
    // Call onRenderComplete if provided
    if (onRenderComplete) {
      onRenderComplete();
    }

    return (
      <InkWidgetContextProvider context={context}>
        <Box flexDirection="column">
          <InkWidgetRenderer
            fieldName={"root" as Path<TEndpoint["types"]["RequestOutput"]>}
            field={withValue(endpoint.fields, data, null)}
          />
        </Box>
      </InkWidgetContextProvider>
    );
  }

  // FALLBACK: Extract and render fields separately
  const allFields = extractAllFields(endpoint.fields);

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

  // Filter visible fields
  const visibleFields = fields.filter(([fieldName, field]) => {
    // Skip hidden fields
    const hidden = "hidden" in field && field.hidden === true;
    if (hidden) {
      return false;
    }

    // In responseOnly mode (result-formatter), only show response fields with data
    if (responseOnly) {
      if (!isResponseField(field)) {
        logger.debug(
          `[InkEndpointRenderer] Filtering out non-response field in responseOnly mode`,
          {
            fieldName,
            hasResponseUsage: (
              field as BaseWidgetConfig<FieldUsageConfig, SchemaTypes>
            ).usage.response,
          },
        );
        return false;
      }
      const fieldData =
        data && typeof data === "object" && !Array.isArray(data)
          ? data[fieldName]
          : undefined;
      const hasData = fieldData !== null && fieldData !== undefined;
      logger.debug(`[InkEndpointRenderer] Response field check`, {
        fieldName,
        hasData,
        fieldData: hasData ? JSON.stringify(fieldData).slice(0, 100) : "none",
      });
      return hasData;
    }

    // In interactive mode, show all fields
    // For response fields, only show if they have data
    if (isResponseField(field)) {
      const fieldData =
        data && typeof data === "object" && !Array.isArray(data)
          ? data[fieldName]
          : undefined;
      return fieldData !== null && fieldData !== undefined;
    }
    return true;
  });

  // Render all visible fields
  return !visibleFields.length ? (
    <Text dimColor>
      {context.t("app.api.system.unifiedInterface.cli.vibe.noFields")}
    </Text>
  ) : (
    <InkWidgetContextProvider context={context}>
      <Box flexDirection="column">
        {visibleFields
          .filter(([, field]) => "type" in field && field.type !== undefined)
          .map(([fieldName, field]) => {
            const fieldValue: WidgetData = isObject(data)
              ? data[fieldName]
              : undefined;

            return (
              <InkWidgetRenderer
                key={fieldName}
                fieldName={
                  fieldName as Path<TEndpoint["types"]["RequestOutput"]>
                }
                field={withValue(field, fieldValue, data)}
              />
            );
          })}
      </Box>
    </InkWidgetContextProvider>
  );
}
