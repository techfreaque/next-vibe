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

import { Box, Text, useInput } from "ink";
import type { JSX } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Path } from "react-hook-form";

import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import { extractSchemaDefaults } from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/widgets/widget-data";
import type { InkWidgetContext } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation as cliScopedTranslation } from "../../../cli/i18n";
import type { InkFormState } from "../../widgets/_shared/cli-types";
import {
  extractAllFields,
  withValueNonStrict,
} from "../../widgets/_shared/field-helpers";
import { InkWidgetContextProvider } from "../../widgets/_shared/InkWidgetContextProvider";
import { isObject, isResponseField } from "../../widgets/_shared/type-guards";
import type {
  AnyChildrenConstrain,
  BaseWidgetConfig,
  ConstrainedChildUsage,
  DispatchField,
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
  /** Called when form values change (for parent to track current input) */
  onFormChange?: (values: Record<string, WidgetData>) => void;
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
  onFormChange,
  responseOnly = false,
  platform,
}: InkEndpointRendererProps<TEndpoint>): JSX.Element {
  // Stable ref for onFormChange to avoid re-render cycles
  const onFormChangeRef = useRef(onFormChange);
  onFormChangeRef.current = onFormChange;

  // Extract schema defaults (same as React's useApiForm) — stable, only depends on schema
  const schemaDefaults = useMemo(() => {
    const extracted = extractSchemaDefaults<
      TEndpoint["types"]["RequestOutput"]
    >(endpoint.requestSchema, logger, "", true);
    if (!extracted) {
      return {} as Partial<TEndpoint["types"]["RequestOutput"]>;
    }
    // Validate through Zod parse to apply transforms
    const parsed = endpoint.requestSchema.safeParse(extracted);
    return (parsed.success ? parsed.data : extracted) as Partial<
      TEndpoint["types"]["RequestOutput"]
    >;
  }, [endpoint.requestSchema, logger]);

  // Merge defaults: schema defaults < endpoint formOptions defaults < data prop
  const mergedDefaults = useMemo(() => {
    const endpointDefaults =
      endpoint.options?.formOptions &&
      typeof endpoint.options.formOptions === "object" &&
      "defaultValues" in endpoint.options.formOptions
        ? endpoint.options.formOptions.defaultValues
        : {};
    return {
      ...schemaDefaults,
      ...endpointDefaults,
      ...(data && typeof data === "object" && !Array.isArray(data) ? data : {}),
    } as Partial<TEndpoint["types"]["RequestOutput"]>;
  }, [schemaDefaults, endpoint.options, data]);

  // Form state management — initialized with merged defaults
  const [formValues, setFormValues] =
    useState<Partial<TEndpoint["types"]["RequestOutput"]>>(mergedDefaults);
  const [formErrors] = useState<Record<string, string>>({});

  // Notify parent of initial defaults (once on mount)
  const hasNotifiedInitial = useRef(false);
  useEffect(() => {
    if (!hasNotifiedInitial.current) {
      hasNotifiedInitial.current = true;
      onFormChangeRef.current?.(mergedDefaults);
    }
  }, [mergedDefaults]);

  // Create form state object
  const form: InkFormState<TEndpoint["types"]["RequestOutput"]> = {
    values: formValues,
    setValue: <TValue,>(name: string, value: TValue) => {
      setFormValues((prev) => {
        const next = { ...prev, [name]: value };
        onFormChangeRef.current?.(next);
        return next;
      });
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

  // Focus management — extract request field names for tab navigation
  // Keep request fields focusable even after response (for re-filtering/re-submitting)
  const requestFieldNames = useMemo(() => {
    if (responseOnly) {
      return [];
    }
    const fields = extractAllFields(endpoint.fields);
    return fields
      .filter(([, field]) => !isResponseField(field))
      .map(([fieldName]) => fieldName);
  }, [endpoint.fields, responseOnly]);

  const [focusIndex, setFocusIndex] = useState(0);
  const focusedField =
    requestFieldNames.length > 0
      ? requestFieldNames[focusIndex % requestFieldNames.length]
      : undefined;

  const moveFocus = useCallback(
    (direction: "next" | "prev") => {
      if (requestFieldNames.length === 0) {
        return;
      }
      setFocusIndex((prev) => {
        if (direction === "next") {
          return (prev + 1) % requestFieldNames.length;
        }
        return (prev - 1 + requestFieldNames.length) % requestFieldNames.length;
      });
    },
    [requestFieldNames],
  );

  // Tab / shift-tab navigation between fields, Enter to submit
  useInput(
    // eslint-disable-next-line no-unused-vars -- useInput requires (input, key) signature
    (_, key) => {
      if (key.tab) {
        moveFocus(key.shift ? "prev" : "next");
      }
      if (key.return && onSubmit && !isSubmitting) {
        handleSubmit();
      }
    },
    { isActive: requestFieldNames.length > 0 && !responseOnly },
  );

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
    focusedField,
    moveFocus,
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
            fieldName={"" as Path<TEndpoint["types"]["RequestOutput"]>}
            field={
              withValueNonStrict(endpoint.fields, data, null) as DispatchField<
                string,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any -- heterogeneous field dispatch boundary
                any,
                FieldUsageConfig,
                AnyChildrenConstrain<
                  string,
                  ConstrainedChildUsage<FieldUsageConfig>
                >
              >
            }
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
        data &&
        typeof data === "object" &&
        !Array.isArray(data) &&
        !(data instanceof Date)
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
        data &&
        typeof data === "object" &&
        !Array.isArray(data) &&
        !(data instanceof Date)
          ? data[fieldName]
          : undefined;
      return fieldData !== null && fieldData !== undefined;
    }
    return true;
  });

  const { t: cliT } = cliScopedTranslation.scopedT(locale);

  // Render all visible fields
  return !visibleFields.length ? (
    <Text dimColor>{cliT("vibe.noFields")}</Text>
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
                field={
                  withValueNonStrict(field, fieldValue, data) as DispatchField<
                    string,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- heterogeneous field dispatch boundary
                    any,
                    FieldUsageConfig,
                    AnyChildrenConstrain<
                      string,
                      ConstrainedChildUsage<FieldUsageConfig>
                    >
                  >
                }
              />
            );
          })}
      </Box>
    </InkWidgetContextProvider>
  );
}
