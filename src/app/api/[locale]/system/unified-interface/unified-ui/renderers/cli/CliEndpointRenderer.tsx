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
import type { ZodTypeAny } from "zod";

import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { UnifiedField } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { isResponseField } from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/field-helpers";
import {
  hasChildren,
  isWidgetDataObject,
} from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/field-type-guards";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/widgets/widget-data";
import type {
  FieldUsageConfig,
  InkWidgetContext,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { InkFormState } from "../../widgets/_shared/cli-types";
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
}

/**
 * Extract ALL fields from endpoint definition
 * Recursively extracts fields from nested containers
 * (Same logic as React EndpointRenderer)
 *
 * NOTE: Returns heterogeneous array of fields - children type info is lost
 * This is necessary because we can't preserve specific field types from a union
 */
// Heterogeneous field array - must accept/return `any` for fourth type param
// oxlint-disable-next-line typescript/no-explicit-any
function extractAllFields<const TKey extends string>(
  // oxlint-disable-next-line typescript/no-explicit-any
  fields: UnifiedField<TKey, ZodTypeAny, FieldUsageConfig, any>,
  parentPath = "",
  // oxlint-disable-next-line typescript/no-explicit-any
): Array<[string, UnifiedField<TKey, ZodTypeAny, FieldUsageConfig, any>]> {
  if (!fields || typeof fields !== "object") {
    return [];
  }

  // Handle object-union fields using proper typing
  if ("schemaType" in fields && fields.schemaType === "object-union") {
    const fullPath = parentPath ? `${parentPath}` : "";
    return fullPath ? [[fullPath, fields]] : [];
  }

  // Check if this is an object field with children using guards
  if (!hasChildren(fields)) {
    return [];
  }

  const result: Array<
    // oxlint-disable-next-line typescript/no-explicit-any
    [string, UnifiedField<TKey, ZodTypeAny, FieldUsageConfig, any>]
  > = [];

  for (const [fieldName, fieldDef] of Object.entries(fields.children)) {
    if (typeof fieldDef === "object" && fieldDef !== null) {
      // Handle object-union fields
      if ("schemaType" in fieldDef && fieldDef.schemaType === "object-union") {
        const fullPath = parentPath ? `${parentPath}.${fieldName}` : fieldName;
        result.push([fullPath, fieldDef]);
      }
      // Handle object fields with CONTAINER widget type
      else if (
        hasChildren(fieldDef) &&
        "type" in fieldDef &&
        fieldDef.type === WidgetType.CONTAINER
      ) {
        const fullPath = parentPath ? `${parentPath}.${fieldName}` : fieldName;
        result.push([fullPath, fieldDef]);
      }
      // Include all other fields
      else {
        const fullPath = parentPath ? `${parentPath}.${fieldName}` : fieldName;
        result.push([fullPath, fieldDef]);
      }
    }
  }

  return result;
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
    isInteractive: true,
    logger,
    user,
    platform: Platform.CLI,
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

  // Check if root is a container widget using proper type checking
  const isRootContainer =
    hasChildren(endpoint.fields) &&
    "type" in endpoint.fields &&
    (endpoint.fields.type === WidgetType.CONTAINER ||
      endpoint.fields.type === WidgetType.DATA_LIST ||
      endpoint.fields.type === WidgetType.DATA_CARDS ||
      endpoint.fields.type === WidgetType.DATA_TABLE);

  // If root is a container, render it directly (same as React)
  if (
    isRootContainer &&
    "type" in endpoint.fields &&
    endpoint.fields.type !== undefined
  ) {
    // Call onRenderComplete if provided
    if (onRenderComplete) {
      onRenderComplete();
    }

    // Augment root field with data value
    const rootFieldWithValue = Object.assign({}, endpoint.fields, {
      value: data,
    });

    return (
      <Box flexDirection="column">
        <InkWidgetRenderer
          fieldName="root"
          field={rootFieldWithValue}
          context={context}
        />
      </Box>
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
    // In responseOnly mode (result-formatter), only show response fields with data
    if (responseOnly) {
      if (!isResponseField(field)) {
        return false;
      }
      const fieldData =
        data && typeof data === "object" && !Array.isArray(data)
          ? data[fieldName]
          : undefined;
      return fieldData !== null && fieldData !== undefined;
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
    <Box flexDirection="column">
      {visibleFields
        .filter(([, field]) => "type" in field && field.type !== undefined)
        .map(([fieldName, field]) => {
          let fieldValue: WidgetData = undefined;
          if (isWidgetDataObject(data)) {
            fieldValue = data[fieldName];
          }

          // Augment field with value from data
          const fieldWithValue = Object.assign({}, field, {
            value: fieldValue,
          });

          return (
            <InkWidgetRenderer
              key={fieldName}
              fieldName={fieldName}
              field={fieldWithValue}
              context={context}
            />
          );
        })}
    </Box>
  );
}
