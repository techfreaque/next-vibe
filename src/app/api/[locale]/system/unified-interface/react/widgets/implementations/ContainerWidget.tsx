"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import {
  FormAlert,
  type FormAlertState,
} from "next-vibe-ui/ui/form/form-alert";
import { H1, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import { useWatch } from "react-hook-form";

import type { IconValue } from "@/app/api/[locale]/agent/chat/model-access/icons";
import { getIconComponent } from "@/app/api/[locale]/agent/chat/model-access/icons";
import { simpleT } from "@/i18n/core/shared";
import type { TranslationKey } from "@/i18n/core/static-types";

import type { UnifiedField } from "../../../shared/types/endpoint";
import {
  WidgetType,
  type WidgetType as WidgetTypeEnum,
} from "../../../shared/types/enums";
import type {
  ReactWidgetProps,
  WidgetData,
} from "../../../shared/widgets/types";
import {
  getTranslator,
  isFormInputField,
  isResponseField,
} from "../../../shared/widgets/utils/field-helpers";
import {
  getLayoutClassName,
  type LayoutConfig,
} from "../../../shared/widgets/utils/widget-helpers";
import { WidgetRenderer } from "../renderers/WidgetRenderer";

/**
 * Displays container layouts with nested fields.
 * Renders field.children definitions - each widget decides if it should render based on data.
 *
 * Auto-features (enabled by default, can be disabled):
 * - showFormAlert: Shows FormAlert at top for error/success messages (default: true)
 * - showSubmitButton: Shows submit button at bottom when there are request fields (default: true)
 */
export function ContainerWidget<const TKey extends string>({
  value,
  field,
  context,
  className,
  form,
  fieldName,
  onSubmit,
  isSubmitting,
  endpoint,
}: ReactWidgetProps<typeof WidgetTypeEnum.CONTAINER, TKey>): JSX.Element {
  const { t } = getTranslator(context);
  const { t: globalT } = simpleT(context.locale);

  const {
    layoutType: layoutTypeRaw = "stacked",
    columns = 1,
    gap = "4",
    paddingTop,
    title: titleKey,
    description: descriptionKey,
    noCard = false,
    getCount,
    submitButton: submitButtonConfig,
    // Auto-features: default to true, can be disabled
    showFormAlert = true,
    showSubmitButton = true,
  } = field.ui;

  // Get field type info for hook setup (must be before any hooks)
  const fieldWithChildren = field as UnifiedField<string> & {
    type?: string;
    children?: Record<string, UnifiedField<string>>;
    discriminator?: string;
    variants?: readonly UnifiedField<string>[];
  };
  const isUnionField = fieldWithChildren.type === "object-union";
  const discriminator = fieldWithChildren.discriminator;

  // Call useWatch unconditionally to satisfy React hooks rules
  // Disabled when not needed (non-union fields or missing form/fieldName)
  const watchPath =
    isUnionField && discriminator && fieldName
      ? `${fieldName}.${discriminator}`
      : discriminator || "";
  const watchedDiscriminator = useWatch({
    control: form?.control,
    name: watchPath as never,
    disabled: !isUnionField || !form || !fieldName || !discriminator,
  });

  const layoutTypeStr = String(layoutTypeRaw);

  let layoutType: "grid" | "flex" | "stack" = "stack";
  // conceptualColumns is how many logical columns the definition wants (e.g., 4 = 4 items per row)
  let conceptualColumns = 1;

  if (layoutTypeStr === "grid" || layoutTypeStr.startsWith("grid_")) {
    layoutType = "grid";
    // Use the columns prop if specified, otherwise use layout type presets or default to 12
    if (columns && columns > 0) {
      conceptualColumns = columns;
    } else if (layoutTypeStr === "grid_2_columns") {
      conceptualColumns = 2;
    } else if (layoutTypeStr === "grid_3_columns") {
      conceptualColumns = 3;
    } else if (layoutTypeStr === "grid_4_columns") {
      conceptualColumns = 4;
    } else {
      conceptualColumns = 12;
    }
  } else if (layoutTypeStr === "flex" || layoutTypeStr === "horizontal") {
    layoutType = "flex";
  }

  // Always use 12-column grid for maximum flexibility with child column spans
  const layoutConfig: LayoutConfig = {
    type: layoutType,
    columns: layoutType === "grid" ? 12 : undefined,
    gap: String(gap),
  };
  const layoutClass = getLayoutClassName(layoutConfig);

  // Calculate default column span for children based on conceptual columns
  // E.g., if parent wants 4 columns, each child by default takes 12/4 = 3 grid columns
  const defaultChildSpan =
    layoutType === "grid" ? Math.floor(12 / conceptualColumns) : undefined;

  let title = titleKey ? t(titleKey) : undefined;
  const description = descriptionKey ? t(descriptionKey) : undefined;

  if (getCount && value && typeof value === "object" && !Array.isArray(value)) {
    // getCount's type is generic and depends on field children, cast to runtime type
    const getCountFn = getCount as (data: {
      request?: { [key: string]: WidgetData };
      response?: { [key: string]: WidgetData };
    }) => number | undefined;
    const count = getCountFn({
      request: value as { [key: string]: WidgetData },
      response: value as { [key: string]: WidgetData },
    });
    if (count !== undefined && title) {
      title = `${title} (${count})`;
    }
  }

  const showHeaderButton =
    submitButtonConfig?.position === "header" && onSubmit && form;
  const showBottomButton =
    submitButtonConfig?.position === "bottom" && onSubmit && form;

  const ButtonIcon = submitButtonConfig?.icon
    ? getIconComponent(submitButtonConfig.icon as IconValue)
    : undefined;

  const buttonText = submitButtonConfig?.text
    ? t(submitButtonConfig.text)
    : globalT(
        "app.api.system.unifiedInterface.react.widgets.endpointRenderer.submit",
      );

  const loadingText = submitButtonConfig?.loadingText
    ? t(submitButtonConfig.loadingText)
    : globalT(
        "app.api.system.unifiedInterface.react.widgets.endpointRenderer.submitting",
      );

  // Handle union fields - select variant based on discriminator value
  let children: Array<[string, UnifiedField<string>]> = [];

  if (isUnionField) {
    // Union field - need to select the correct variant
    const variants = fieldWithChildren.variants;

    if (!discriminator || !variants || variants.length === 0) {
      // Invalid union configuration
      if (noCard) {
        return (
          <Div className={cn("text-muted-foreground italic", className)}>
            {globalT(
              "app.api.system.unifiedInterface.react.widgets.container.noContent",
            )}
          </Div>
        );
      }
      return (
        <Card className={className}>
          <CardContent>
            <P className="italic text-muted-foreground">
              {globalT(
                "app.api.system.unifiedInterface.react.widgets.container.noContent",
              )}
            </P>
          </CardContent>
        </Card>
      );
    }

    // Get discriminator value from form watch or value prop
    let discriminatorValue: string | undefined;
    if (
      watchedDiscriminator !== undefined &&
      typeof watchedDiscriminator === "string"
    ) {
      discriminatorValue = watchedDiscriminator;
    } else if (value && typeof value === "object" && discriminator in value) {
      const valueObj = value as Record<string, string | undefined>;
      discriminatorValue = valueObj[discriminator];
    }

    // Find matching variant based on discriminator value
    const selectedVariant = variants.find((variant) => {
      const variantField = variant as UnifiedField<string> & {
        children?: Record<string, UnifiedField<string>>;
      };
      if (!variantField.children) {
        return false;
      }

      // Check if this variant has the discriminator field with matching value
      const variantDiscriminator = variantField.children[discriminator];
      const variantDiscriminatorWithSchema =
        variantDiscriminator as UnifiedField<string> & {
          schema?: { _def?: { value?: string; values?: string[] } };
        };

      if (!variantDiscriminator || !variantDiscriminatorWithSchema.schema) {
        return false;
      }

      // For z.literal discriminators, check if the literal value matches
      const schema = variantDiscriminatorWithSchema.schema;
      // Zod's z.literal() stores the value in _def.value (string) or _def.values (array with single element)
      const literalValue = schema._def?.value ?? schema._def?.values?.[0];

      const matches = literalValue === discriminatorValue;
      return matches;
    });

    // Get discriminator field from first variant (they all have the same discriminator field)
    const firstVariant = variants[0] as UnifiedField<string> & {
      children?: Record<string, UnifiedField<string>>;
    };
    const discriminatorField = firstVariant.children?.[discriminator];

    // Build children array: discriminator field + selected variant's other fields
    if (selectedVariant) {
      const selectedVariantField = selectedVariant as UnifiedField<string> & {
        children?: Record<string, UnifiedField<string>>;
      };
      if (selectedVariantField.children) {
        // Add discriminator first, then other fields (excluding the discriminator to avoid duplication)
        const variantFields = Object.entries(
          selectedVariantField.children,
        ).filter(([key]) => key !== discriminator);
        children = discriminatorField
          ? [[discriminator, discriminatorField], ...variantFields]
          : variantFields;
      }
    } else {
      // No variant selected yet - just show discriminator field
      if (discriminatorField) {
        children = [[discriminator, discriminatorField]];
      }
    }
  } else {
    // Regular container field with children
    if (!fieldWithChildren.children) {
      if (noCard) {
        return (
          <Div className={cn("text-muted-foreground italic", className)}>
            {globalT(
              "app.api.system.unifiedInterface.react.widgets.container.noContent",
            )}
          </Div>
        );
      }

      return (
        <Card className={className}>
          <CardContent>
            <P className="italic text-muted-foreground">
              {globalT(
                "app.api.system.unifiedInterface.react.widgets.container.noContent",
              )}
            </P>
          </CardContent>
        </Card>
      );
    }

    children = Object.entries(fieldWithChildren.children);
  }

  // Check if there are any actual form input fields (FORM_FIELD widgets with request usage)
  // This determines if auto FormAlert and auto submit button should be shown
  // Only FORM_FIELD widgets count - not TEXT or other widgets with request usage
  const hasFormInputFields = children.some(([, childField]) =>
    isFormInputField(childField),
  );

  // Recursive function to check if any widget in the subtree is of a specific type
  const hasWidgetTypeInTree = (
    fieldToCheck: UnifiedField<string>,
    widgetType: string,
  ): boolean => {
    // Check direct field
    if (fieldToCheck.ui?.type === widgetType) {
      return true;
    }
    // Check nested children
    const fieldWithNestedChildren = fieldToCheck as UnifiedField<string> & {
      children?: Record<string, UnifiedField<string>>;
    };
    if (fieldWithNestedChildren.children) {
      return Object.values(fieldWithNestedChildren.children).some((child) =>
        hasWidgetTypeInTree(child, widgetType),
      );
    }
    return false;
  };

  // Check if container or any nested child has explicit FORM_ALERT or SUBMIT_BUTTON widgets
  const hasExplicitFormAlert = children.some(([, childField]) =>
    hasWidgetTypeInTree(childField, WidgetType.FORM_ALERT),
  );
  const hasExplicitSubmitButton = children.some(([, childField]) =>
    hasWidgetTypeInTree(childField, WidgetType.SUBMIT_BUTTON),
  );

  // Determine if we should show auto-features
  // Auto FormAlert: only show if enabled AND has form input fields AND no explicit FormAlert anywhere in subtree
  const shouldShowAutoFormAlert =
    showFormAlert && hasFormInputFields && !hasExplicitFormAlert;
  // Auto SubmitButton: only show if enabled AND has form input fields AND no explicit config AND no explicit widget in subtree AND form context exists
  const shouldShowAutoSubmitButton =
    showSubmitButton &&
    hasFormInputFields &&
    !submitButtonConfig &&
    !hasExplicitSubmitButton &&
    onSubmit &&
    form;

  // Build FormAlert state from context.response
  let formAlertState: FormAlertState | null = null;
  if (context.response && context.response.success === false) {
    formAlertState = {
      variant: "destructive",
      message: {
        message: context.response.message as TranslationKey,
        messageParams: context.response.messageParams,
      },
    };
  } else if (context.response && context.response.success === true) {
    const data = context.response.data;
    if (
      data &&
      typeof data === "object" &&
      "message" in data &&
      typeof data.message === "string"
    ) {
      formAlertState = {
        variant: "success",
        message: {
          message: data.message as TranslationKey,
          messageParams:
            "messageParams" in data
              ? (data.messageParams as
                  | Record<string, string | number>
                  | undefined)
              : undefined,
        },
      };
    }
  }

  // Auto submit button text
  const autoSubmitText = globalT(
    "app.api.system.unifiedInterface.react.widgets.endpointRenderer.submit",
  );
  const autoSubmitLoadingText = globalT(
    "app.api.system.unifiedInterface.react.widgets.endpointRenderer.submitting",
  );

  const gapClassMap: Record<string, string> = {
    "0": "space-y-0",
    "1": "space-y-1",
    "2": "space-y-2",
    "3": "space-y-3",
    "4": "space-y-4",
    "6": "space-y-6",
    "8": "space-y-8",
  };
  const contentGap = gapClassMap[String(gap)] ?? "space-y-6";

  const paddingTopClassMap: Record<string, string> = {
    "0": "pt-0",
    "2": "pt-2",
    "3": "pt-3",
    "4": "pt-4",
    "6": "pt-6",
    "8": "pt-8",
  };
  const topPadding = paddingTop ? paddingTopClassMap[paddingTop] : "";

  // If noCard is true, render without Card wrapper
  if (noCard) {
    return (
      <Div className={cn("space-y-6", topPadding, className)}>
        {(title || description) && (
          <Div className="text-center">
            {title && (
              <H1 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-linear-to-r from-cyan-500 to-blue-600">
                {title}
              </H1>
            )}
            {description && (
              <P className="text-gray-600 dark:text-gray-300 text-lg mb-8">
                {description}
              </P>
            )}
          </Div>
        )}
        {/* Auto FormAlert at top */}
        {shouldShowAutoFormAlert && <FormAlert alert={formAlertState} />}
        <Div className={cn(layoutClass, contentGap)}>
          {children.map(([childName, childField]) => {
            // Get child data from value object
            const childData =
              typeof value === "object" && value !== null && childName in value
                ? (value as Record<string, WidgetData>)[childName]
                : null;

            // Skip response fields that don't have data
            if (
              isResponseField(childField) &&
              (childData === null || childData === undefined)
            ) {
              return null;
            }

            // Build full field path
            const childFieldName = fieldName
              ? `${fieldName}.${childName}`
              : childName;

            // Extract column span from child field if in grid layout
            // IMPORTANT: For CONTAINER widgets, `columns` means internal grid columns, NOT span
            // For other widgets (STAT, CHART, FORM_FIELD, etc.), `columns` means span in parent grid
            const childUi = childField.ui as
              | { columns?: number; type?: string }
              | undefined;
            const isChildContainer = childUi?.type === WidgetType.CONTAINER;
            const childColumns = isChildContainer
              ? undefined
              : childUi?.columns;

            // Calculate effective column span:
            // - For containers: always use default span (their `columns` is for internal grid)
            // - For other widgets: use explicit columns if set, otherwise default span
            const effectiveSpan =
              layoutType === "grid"
                ? Math.min(childColumns ?? defaultChildSpan ?? 12, 12)
                : undefined;

            // Map column numbers to Tailwind classes (JIT-safe)
            const colSpanMap: Record<number, string> = {
              1: "col-span-1",
              2: "col-span-2",
              3: "col-span-3",
              4: "col-span-4",
              5: "col-span-5",
              6: "col-span-6",
              7: "col-span-7",
              8: "col-span-8",
              9: "col-span-9",
              10: "col-span-10",
              11: "col-span-11",
              12: "col-span-12",
            };

            const colSpanClass =
              layoutType === "grid" && effectiveSpan
                ? colSpanMap[effectiveSpan]
                : undefined;

            return (
              <WidgetRenderer
                key={childName}
                widgetType={childField.ui.type}
                fieldName={childFieldName}
                data={childData}
                field={childField}
                context={context}
                form={form}
                onSubmit={onSubmit}
                isSubmitting={isSubmitting}
                className={colSpanClass}
                endpoint={endpoint}
              />
            );
          })}
        </Div>
        {/* Explicit submitButton config at bottom position */}
        {showBottomButton && (
          <Button
            type="button"
            onClick={(): void => {
              if (form && onSubmit) {
                void form.handleSubmit(() => {
                  onSubmit();
                })();
              }
            }}
            disabled={isSubmitting}
            variant={
              (submitButtonConfig.variant === "primary"
                ? "default"
                : submitButtonConfig.variant) ?? "default"
            }
            size={submitButtonConfig.size ?? "default"}
            className="w-full"
          >
            {ButtonIcon && <ButtonIcon className="h-4 w-4 mr-2" />}
            {isSubmitting ? loadingText : buttonText}
          </Button>
        )}
        {/* Auto SubmitButton when no explicit config */}
        {shouldShowAutoSubmitButton && (
          <Button
            type="button"
            onClick={(): void => {
              if (form && onSubmit) {
                void form.handleSubmit(() => {
                  onSubmit();
                })();
              }
            }}
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? autoSubmitLoadingText : autoSubmitText}
          </Button>
        )}
      </Div>
    );
  }

  return (
    <Card className={cn(topPadding, className)}>
      {(title ?? description ?? showHeaderButton) && (
        <CardHeader>
          <Div className="flex items-center justify-between">
            <Div>
              {title && <CardTitle>{title}</CardTitle>}
              {description && <CardDescription>{description}</CardDescription>}
            </Div>
            {showHeaderButton && (
              <Button
                type="button"
                onClick={(): void => {
                  if (form && onSubmit) {
                    void form.handleSubmit(() => {
                      onSubmit();
                    })();
                  }
                }}
                disabled={isSubmitting}
                variant={
                  (submitButtonConfig.variant === "primary"
                    ? "default"
                    : submitButtonConfig.variant) ?? "default"
                }
                size={submitButtonConfig.size ?? "default"}
              >
                {ButtonIcon && <ButtonIcon className="h-4 w-4 mr-2" />}
                {isSubmitting ? loadingText : buttonText}
              </Button>
            )}
          </Div>
        </CardHeader>
      )}
      {/* Auto FormAlert at top */}
      {shouldShowAutoFormAlert && (
        <CardContent className="pb-0">
          <FormAlert alert={formAlertState} />
        </CardContent>
      )}
      <CardContent
        className={
          !title &&
          !description &&
          !showHeaderButton &&
          !shouldShowAutoFormAlert
            ? "pt-6"
            : ""
        }
      >
        <Div className={cn(layoutClass, contentGap)}>
          {children.map(([childName, childField]) => {
            // Get child data from value object
            const childData =
              typeof value === "object" && value !== null && childName in value
                ? (value as Record<string, WidgetData>)[childName]
                : null;

            // Skip response fields that don't have data
            if (
              isResponseField(childField) &&
              (childData === null || childData === undefined)
            ) {
              return null;
            }

            // Build full field path
            const childFieldName = fieldName
              ? `${fieldName}.${childName}`
              : childName;

            // Extract column span from child field if in grid layout
            // IMPORTANT: For CONTAINER widgets, `columns` means internal grid columns, NOT span
            // For other widgets (STAT, CHART, FORM_FIELD, etc.), `columns` means span in parent grid
            const childUi = childField.ui as
              | { columns?: number; type?: string }
              | undefined;
            const isChildContainer = childUi?.type === WidgetType.CONTAINER;
            const childColumns = isChildContainer
              ? undefined
              : childUi?.columns;

            // Calculate effective column span:
            // - For containers: always use default span (their `columns` is for internal grid)
            // - For other widgets: use explicit columns if set, otherwise default span
            const effectiveSpan =
              layoutType === "grid"
                ? Math.min(childColumns ?? defaultChildSpan ?? 12, 12)
                : undefined;

            // Map column numbers to Tailwind classes (JIT-safe)
            const colSpanMap: Record<number, string> = {
              1: "col-span-1",
              2: "col-span-2",
              3: "col-span-3",
              4: "col-span-4",
              5: "col-span-5",
              6: "col-span-6",
              7: "col-span-7",
              8: "col-span-8",
              9: "col-span-9",
              10: "col-span-10",
              11: "col-span-11",
              12: "col-span-12",
            };

            const colSpanClass =
              layoutType === "grid" && effectiveSpan
                ? colSpanMap[effectiveSpan]
                : undefined;

            return (
              <WidgetRenderer
                key={childName}
                widgetType={childField.ui.type}
                fieldName={childFieldName}
                data={childData}
                field={childField}
                context={context}
                form={form}
                onSubmit={onSubmit}
                isSubmitting={isSubmitting}
                className={colSpanClass}
                endpoint={endpoint}
              />
            );
          })}
        </Div>
      </CardContent>
      {/* Explicit submitButton config at bottom position */}
      {showBottomButton && (
        <CardContent className="pt-0">
          <Button
            type="button"
            onClick={(): void => {
              if (form && onSubmit) {
                void form.handleSubmit(() => {
                  onSubmit();
                })();
              }
            }}
            disabled={isSubmitting}
            variant={
              (submitButtonConfig.variant === "primary"
                ? "default"
                : submitButtonConfig.variant) ?? "default"
            }
            size={submitButtonConfig.size ?? "default"}
            className="w-full"
          >
            {ButtonIcon && <ButtonIcon className="h-4 w-4 mr-2" />}
            {isSubmitting ? loadingText : buttonText}
          </Button>
        </CardContent>
      )}
      {/* Auto SubmitButton when no explicit config */}
      {shouldShowAutoSubmitButton && (
        <CardContent className="pt-0">
          <Button
            type="button"
            onClick={(): void => {
              if (form && onSubmit) {
                void form.handleSubmit(() => {
                  onSubmit();
                })();
              }
            }}
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? autoSubmitLoadingText : autoSubmitText}
          </Button>
        </CardContent>
      )}
    </Card>
  );
}

ContainerWidget.displayName = "ContainerWidget";
