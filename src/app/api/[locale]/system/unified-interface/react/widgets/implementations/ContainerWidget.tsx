"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { FormAlert, type FormAlertState } from "next-vibe-ui/ui/form/form-alert";
import { H1, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import { useWatch } from "react-hook-form";

import type { IconKey } from "@/app/api/[locale]/system/unified-interface/react/icons";
import { Icon } from "@/app/api/[locale]/system/unified-interface/react/icons";
import { simpleT } from "@/i18n/core/shared";
import type { TranslationKey } from "@/i18n/core/static-types";

import type { UnifiedField } from "../../../shared/types/endpoint";
import { WidgetType, type WidgetType as WidgetTypeEnum } from "../../../shared/types/enums";
import type { ReactWidgetProps, WidgetData } from "../../../shared/widgets/types";
import { isFormInputField, isResponseField } from "../../../shared/widgets/utils/field-helpers";
import {
  hasChildren,
  hasWidgetTypeInTree,
  isObjectUnionField,
  isPrimitiveField,
} from "../../../shared/widgets/utils/field-type-guards";
import {
  getIconSizeClassName,
  getLayoutClassName,
  getSpacingClassName,
  getTextSizeClassName,
  type LayoutConfig,
} from "../../../shared/widgets/utils/widget-helpers";
import { WidgetRenderer } from "../renderers/WidgetRenderer";

/**
 * Container Widget - Displays container layouts with nested fields
 *
 * Renders field.children definitions - each widget decides if it should render based on data.
 * Handles both regular object fields and discriminated union fields.
 *
 * Auto-features (enabled by default, can be disabled):
 * - showFormAlert: Shows FormAlert at top for error/success messages (default: true)
 * - showSubmitButton: Shows submit button at bottom when there are request fields (default: true)
 *
 * UI Config options:
 * - layoutType: "stacked" | "grid" | "grid_2_columns" | "grid_3_columns" | "grid_4_columns" | "flex" | "horizontal"
 * - columns: Number of columns for grid layout (1-12, default: 1)
 * - gap: Spacing between elements ("0"-"8", default: "4")
 * - paddingTop: Top padding ("0", "2", "3", "4", "6", "8")
 * - title: Translation key for container title
 * - description: Translation key for container description
 * - noCard: Render without Card wrapper (default: false)
 * - showFormAlert: Show automatic form alert (default: true)
 * - showSubmitButton: Show automatic submit button (default: true)
 * - submitButton: Custom submit button configuration
 * - getCount: Function to calculate count for title badge
 */
export function ContainerWidget<const TKey extends string>({
  value,
  field,
  context,
  className,
  form,
  fieldName,
  onSubmit,
  onCancel,
  isSubmitting,
  endpoint,
  submitButton,
  cancelButton,
}: ReactWidgetProps<typeof WidgetTypeEnum.CONTAINER, TKey>): JSX.Element {
  const { t: globalT } = simpleT(context.locale);

  const {
    layoutType: layoutTypeRaw = "stacked",
    columns = 1,
    gap = "4",
    alignItems,
    paddingTop,
    paddingBottom,
    borderBottom,
    title: titleKey,
    description: descriptionKey,
    noCard = false,
    getCount,
    submitButton: submitButtonConfig,
    // Auto-features: default to true, can be disabled
    showFormAlert = true,
    showSubmitButton = true,
    // Styling config
    titleAlign,
    titleSize,
    descriptionSize,
    buttonGap,
    iconSize,
    iconSpacing,
    contentPadding,
    headerGap,
    spacing = "normal",
  } = field.ui;

  // Check if this is an array field
  const isArrayField =
    "type" in field && (field.type === "array" || field.type === "array-optional");

  // Determine field type using type guards
  const isUnionField = isObjectUnionField(field);
  const discriminator = isUnionField ? field.discriminator : undefined;

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
  } else if (
    layoutTypeStr === "flex" ||
    layoutTypeStr === "horizontal" ||
    layoutTypeStr === "inline"
  ) {
    layoutType = "flex";
  }

  // Always use 12-column grid for maximum flexibility with child column spans
  const layoutConfig: LayoutConfig = {
    type: layoutType,
    columns: layoutType === "grid" ? 12 : undefined,
    gap: String(gap),
    alignItems,
  };
  const layoutClass = getLayoutClassName(layoutConfig);

  // Calculate default column span for children based on conceptual columns
  // E.g., if parent wants 4 columns, each child by default takes 12/4 = 3 grid columns
  const defaultChildSpan = layoutType === "grid" ? Math.floor(12 / conceptualColumns) : undefined;

  // Translate title and description early (before any early returns)
  let title = titleKey ? context.t(titleKey) : undefined;
  const description = descriptionKey ? context.t(descriptionKey) : undefined;

  if (getCount && value && typeof value === "object" && !Array.isArray(value)) {
    // Runtime type check for value object
    const valueObj = value as Record<string, WidgetData>;
    const count = getCount({
      request: valueObj,
      response: valueObj,
    });
    if (count !== undefined && title) {
      title = `${title} (${count})`;
    }
  }

  const showHeaderButton = submitButtonConfig?.position === "header" && onSubmit && form;
  const showBottomButton = submitButtonConfig?.position === "bottom" && onSubmit && form;

  const buttonIcon = submitButtonConfig?.icon ? (submitButtonConfig.icon as IconKey) : undefined;

  // Get classes from config (no hardcoding!)
  const contentGap = getSpacingClassName("gap", spacing) || "space-y-6";
  const topPadding = paddingTop ? getSpacingClassName("padding", paddingTop) : "";
  const bottomPadding = paddingBottom ? getSpacingClassName("padding", paddingBottom) : "";
  const bottomBorder = borderBottom ? "border-b" : "";
  const titleAlignClass =
    titleAlign === "center" ? "text-center" : titleAlign === "right" ? "text-right" : "text-left";
  const titleSizeClass = getTextSizeClassName(titleSize);
  const descriptionSizeClass = getTextSizeClassName(descriptionSize);
  const buttonGapClass = getSpacingClassName("gap", buttonGap);
  const iconSizeClass = getIconSizeClassName(iconSize);
  const iconSpacingClass = getSpacingClassName("margin", iconSpacing);
  const contentPaddingClass = getSpacingClassName("padding", contentPadding);
  const headerGapClass = getSpacingClassName("gap", headerGap);

  const buttonText = submitButtonConfig?.text
    ? context.t(submitButtonConfig.text)
    : globalT("app.api.system.unifiedInterface.react.widgets.endpointRenderer.submit");

  const loadingText = submitButtonConfig?.loadingText
    ? context.t(submitButtonConfig.loadingText)
    : globalT("app.api.system.unifiedInterface.react.widgets.endpointRenderer.submitting");

  // Handle array fields - render each item based on child field definition
  if (isArrayField && Array.isArray(value)) {
    // Get child field definition
    const childField = "child" in field ? (field.child as UnifiedField<string>) : null;

    if (!childField) {
      if (noCard) {
        return (
          <Div className={cn("text-muted-foreground italic", className)}>
            {globalT("app.api.system.unifiedInterface.react.widgets.container.noContent")}
          </Div>
        );
      }
      return (
        <Card className={className}>
          <CardContent>
            <P className="italic text-muted-foreground">
              {globalT("app.api.system.unifiedInterface.react.widgets.container.noContent")}
            </P>
          </CardContent>
        </Card>
      );
    }

    // Render each array item
    const arrayContent = (
      <Div className={layoutClass}>
        {value.map((item, index) => (
          <WidgetRenderer
            key={index}
            widgetType={childField.ui.type}
            data={item}
            field={childField}
            context={context}
            form={form}
            onSubmit={onSubmit}
            onCancel={onCancel}
            isSubmitting={isSubmitting}
            endpoint={endpoint}
            submitButton={submitButton}
            cancelButton={cancelButton}
          />
        ))}
      </Div>
    );

    // If noCard, render without Card wrapper
    if (noCard) {
      return (
        <Div className={cn(contentGap, topPadding, bottomPadding, bottomBorder, className)}>
          {(title || description) && (
            <Div className={titleAlignClass}>
              {title && (
                <H1 className={cn("font-bold", titleSizeClass || "text-3xl md:text-4xl")}>
                  {title}
                </H1>
              )}
              {description && (
                <P className={cn(descriptionSizeClass || "text-lg")}>{description}</P>
              )}
            </Div>
          )}
          {arrayContent}
        </Div>
      );
    }

    // Render with Card wrapper
    return (
      <Card className={cn(topPadding, bottomPadding, bottomBorder, className)}>
        {(title || description) && (
          <CardHeader>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}
        <CardContent className={!title && !description ? contentPaddingClass || "pt-6" : ""}>
          {arrayContent}
        </CardContent>
      </Card>
    );
  }

  // Handle union fields - select variant based on discriminator value
  let children: Array<[string, UnifiedField<string>]> = [];

  if (isUnionField) {
    // Union field - need to select the correct variant
    const variants = field.variants;

    if (!discriminator || !variants || variants.length === 0) {
      // Invalid union configuration
      if (noCard) {
        return (
          <Div className={cn("text-muted-foreground italic", className)}>
            {globalT("app.api.system.unifiedInterface.react.widgets.container.noContent")}
          </Div>
        );
      }
      return (
        <Card className={className}>
          <CardContent>
            <P className="italic text-muted-foreground">
              {globalT("app.api.system.unifiedInterface.react.widgets.container.noContent")}
            </P>
          </CardContent>
        </Card>
      );
    }

    // Get discriminator value from form watch or value prop
    let discriminatorValue: string | undefined;
    if (watchedDiscriminator !== undefined && typeof watchedDiscriminator === "string") {
      discriminatorValue = watchedDiscriminator;
    } else if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      discriminator in value
    ) {
      const valueObj = value as Record<string, WidgetData>;
      const val = valueObj[discriminator];
      discriminatorValue = typeof val === "string" ? val : undefined;
    }

    // Find matching variant based on discriminator value
    const selectedVariant = variants.find((variant) => {
      // Variants are ObjectField types, which have children
      if (!hasChildren(variant)) {
        return false;
      }

      // Check if this variant has the discriminator field with matching value
      const variantDiscriminator = variant.children[discriminator];
      if (!variantDiscriminator) {
        return false;
      }

      // For primitive fields with literals, check the schema value
      if (isPrimitiveField(variantDiscriminator)) {
        const schema = variantDiscriminator.schema;
        // Zod's z.literal() stores the value in _def.value (string) or _def.values (array with single element)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const literalValue = (schema as any)._def?.value ?? (schema as any)._def?.values?.[0];
        return literalValue === discriminatorValue;
      }

      return false;
    });

    // Get discriminator field from first variant (they all have the same discriminator field)
    const firstVariant = variants[0];
    const discriminatorField = hasChildren(firstVariant)
      ? firstVariant.children[discriminator]
      : undefined;

    // Build children array: discriminator field + selected variant's other fields
    if (selectedVariant && hasChildren(selectedVariant)) {
      // Add discriminator first, then other fields (excluding the discriminator to avoid duplication)
      const variantFields = Object.entries(selectedVariant.children).filter(
        ([key]) => key !== discriminator,
      );
      children = discriminatorField
        ? [[discriminator, discriminatorField], ...variantFields]
        : variantFields;
    } else {
      // No variant selected yet - just show discriminator field
      if (discriminatorField) {
        children = [[discriminator, discriminatorField]];
      }
    }
  } else {
    // Regular container field with children
    if (!hasChildren(field)) {
      if (noCard) {
        return (
          <Div className={cn("text-muted-foreground italic", className)}>
            {globalT("app.api.system.unifiedInterface.react.widgets.container.noContent")}
          </Div>
        );
      }

      return (
        <Card className={className}>
          <CardContent>
            <P className="italic text-muted-foreground">
              {globalT("app.api.system.unifiedInterface.react.widgets.container.noContent")}
            </P>
          </CardContent>
        </Card>
      );
    }

    children = Object.entries(field.children);
  }

  // Check if there are any actual form input fields (FORM_FIELD widgets with request usage)
  // This determines if auto FormAlert and auto submit button should be shown
  // Only FORM_FIELD widgets count - not TEXT or other widgets with request usage
  const hasFormInputFields = children.some(([, childField]) => isFormInputField(childField));

  // Check if container or any nested child has explicit FORM_ALERT or SUBMIT_BUTTON widgets
  const hasExplicitFormAlert = children.some(([, childField]) =>
    hasWidgetTypeInTree(childField, WidgetType.FORM_ALERT),
  );
  const hasExplicitSubmitButton = children.some(([, childField]) =>
    hasWidgetTypeInTree(childField, WidgetType.SUBMIT_BUTTON),
  );

  // Determine if we should show auto-features
  // Auto FormAlert: only show if enabled AND has form input fields AND no explicit FormAlert anywhere in subtree
  const shouldShowAutoFormAlert = showFormAlert && hasFormInputFields && !hasExplicitFormAlert;
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
    if (data && typeof data === "object" && "message" in data && typeof data.message === "string") {
      formAlertState = {
        variant: "success",
        message: {
          message: data.message as TranslationKey,
          messageParams:
            "messageParams" in data && typeof data.messageParams === "object"
              ? (data.messageParams as Record<string, string | number> | undefined)
              : undefined,
        },
      };
    }
  }

  const autoSubmitText = globalT(
    "app.api.system.unifiedInterface.react.widgets.endpointRenderer.submit",
  );
  const autoSubmitLoadingText = globalT(
    "app.api.system.unifiedInterface.react.widgets.endpointRenderer.submitting",
  );

  // Find backButton field to render it with submit button
  const backButtonEntry = children.find(([childName]) => childName === "backButton");
  const hasBackButton = backButtonEntry !== undefined;

  // Helper to render children based on layoutType
  const renderChildren = (): (JSX.Element | null)[] => {
    const getChildData = (childName: string): WidgetData => {
      if (value && typeof value === "object" && !Array.isArray(value) && childName in value) {
        const valueObj = value as Record<string, WidgetData>;
        return valueObj[childName];
      }
      return null;
    };

    const result: (JSX.Element | null)[] = [];
    let inlineGroup: Array<{
      name: string;
      field: UnifiedField<string>;
      data: WidgetData;
    }> = [];

    const flushInlineGroup = (): void => {
      if (inlineGroup.length === 0) {
        return;
      }

      if (inlineGroup.length === 1) {
        // Single inline field - render normally
        const { name, field, data } = inlineGroup[0];
        const childFieldName = fieldName ? `${fieldName}.${name}` : name;
        const childUi = field.ui;
        const isChildContainer = childUi.type === WidgetType.CONTAINER;
        const childColumns =
          isChildContainer || !("columns" in childUi) ? undefined : (childUi.columns as number);
        const effectiveSpan =
          layoutType === "grid" ? Math.min(childColumns ?? defaultChildSpan ?? 12, 12) : undefined;

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
          layoutType === "grid" && effectiveSpan ? colSpanMap[effectiveSpan] : undefined;

        // For NAVIGATE_BUTTON widgets, pass parent value so extractParams can access all fields
        const dataToPass = childUi.type === WidgetType.NAVIGATE_BUTTON ? value : data;

        result.push(
          <WidgetRenderer
            key={name}
            widgetType={field.ui.type}
            fieldName={childFieldName}
            data={dataToPass}
            field={field}
            context={context}
            form={form}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            className={colSpanClass}
            endpoint={endpoint}
          />,
        );
      } else {
        // Multiple inline fields - wrap in flex container
        result.push(
          <Div key={`inline-group-${inlineGroup[0].name}`} className="flex items-center gap-2">
            {inlineGroup.map(({ name, field, data }) => {
              const childFieldName = fieldName ? `${fieldName}.${name}` : name;
              const childUi = field.ui;
              // For NAVIGATE_BUTTON widgets, pass parent value so extractParams can access all fields
              const dataToPass = childUi.type === WidgetType.NAVIGATE_BUTTON ? value : data;

              return (
                <WidgetRenderer
                  key={name}
                  widgetType={field.ui.type}
                  fieldName={childFieldName}
                  data={dataToPass}
                  field={field}
                  context={context}
                  form={form}
                  onSubmit={onSubmit}
                  isSubmitting={isSubmitting}
                  endpoint={endpoint}
                />
              );
            })}
          </Div>,
        );
      }

      inlineGroup = [];
    };

    for (const [childName, childField] of children) {
      // Skip hidden fields
      if (childField.ui?.hidden) {
        context.logger.debug(`ContainerWidget: Skipping hidden field "${childName}"`);
        continue;
      }

      // Skip backButton only at root level - it's rendered with submit button
      // In nested containers (like topActions), backButton should render normally
      // fieldName is empty/undefined at root level, has a value in nested containers
      if (childName === "backButton" && !fieldName) {
        context.logger.debug(`ContainerWidget: Skipping backButton at root level`);
        continue;
      }

      const childData = getChildData(childName);

      // Check if this is a widget field or widget-only object container
      const isWidgetField = "type" in childField && childField.type === "widget";
      const isWidgetOnlyObject =
        "type" in childField &&
        childField.type === "object" &&
        "children" in childField &&
        childField.children &&
        Object.values(childField.children).every(
          (child) => "type" in child && child.type === "widget",
        );

      // Skip response fields that don't have data (but not widget fields or widget-only objects - they render from UI config)
      if (
        !isWidgetField &&
        !isWidgetOnlyObject &&
        isResponseField(childField) &&
        (childData === null || childData === undefined)
      ) {
        context.logger.debug(
          `ContainerWidget: Skipping response field without data "${childName}"`,
          {
            isWidgetField,
            isWidgetOnlyObject,
            isResponseField: isResponseField(childField),
            childData,
          },
        );
        continue;
      }

      context.logger.debug(`ContainerWidget: Rendering child "${childName}"`, {
        widgetType: childField.ui?.type,
        childData,
        isWidgetField,
        isWidgetOnlyObject,
      });

      // Check if this field should be inline
      const isInline = childField.ui?.inline === true;

      if (isInline) {
        // Add to inline group
        inlineGroup.push({
          name: childName,
          field: childField,
          data: childData,
        });
      } else {
        // Flush any pending inline group
        flushInlineGroup();

        // Render this field normally
        const childFieldName = fieldName ? `${fieldName}.${childName}` : childName;
        const childUi = childField.ui;
        const isChildContainer = childUi.type === WidgetType.CONTAINER;
        const childColumns =
          isChildContainer || !("columns" in childUi) ? undefined : (childUi.columns as number);
        const effectiveSpan =
          layoutType === "grid" ? Math.min(childColumns ?? defaultChildSpan ?? 12, 12) : undefined;

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
          layoutType === "grid" && effectiveSpan ? colSpanMap[effectiveSpan] : undefined;

        // For NAVIGATE_BUTTON widgets, pass parent value so extractParams can access all fields
        // For widget-only containers (like topActions), also pass parent value so nested navigate buttons work
        const isWidgetOnlyContainer =
          isChildContainer &&
          "type" in childField &&
          childField.type === "object" &&
          "children" in childField &&
          childField.children &&
          Object.values(childField.children).every(
            (child) => "type" in child && child.type === "widget",
          );

        const dataToPass =
          childUi.type === WidgetType.NAVIGATE_BUTTON || isWidgetOnlyContainer ? value : childData;

        result.push(
          <WidgetRenderer
            key={childName}
            widgetType={childField.ui.type}
            fieldName={childFieldName}
            data={dataToPass}
            field={childField}
            context={context}
            form={form}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            className={colSpanClass}
            endpoint={endpoint}
          />,
        );
      }
    }

    // Flush any remaining inline group
    flushInlineGroup();

    return result;
  };

  // If noCard is true, render without Card wrapper
  if (noCard) {
    return (
      <Div className={cn(contentGap, topPadding, bottomPadding, bottomBorder, className)}>
        {(title || description) && (
          <Div className={titleAlignClass}>
            {title && (
              <H1 className={cn("font-bold", titleSizeClass || "text-3xl md:text-4xl")}>{title}</H1>
            )}
            {description && <P className={cn(descriptionSizeClass || "text-lg")}>{description}</P>}
          </Div>
        )}
        {/* Auto FormAlert at top */}
        {shouldShowAutoFormAlert && <FormAlert alert={formAlertState} />}
        <Div className={layoutClass}>{renderChildren()}</Div>
        {/* Explicit submitButton config at bottom position */}
        {showBottomButton && (
          <Div className="flex gap-2">
            {/* Back button (left side) */}
            {hasBackButton && backButtonEntry && (
              <WidgetRenderer
                widgetType={backButtonEntry[1].ui.type}
                fieldName={backButtonEntry[0]}
                data={null}
                field={backButtonEntry[1]}
                context={context}
                form={form}
                endpoint={endpoint}
              />
            )}
            {/* Submit button (right side) */}
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
              className={hasBackButton ? "flex-1" : "w-full"}
            >
              {buttonIcon && (
                <Icon
                  icon={buttonIcon}
                  className={cn(iconSizeClass || "h-4 w-4", iconSpacingClass || "mr-2")}
                />
              )}
              {isSubmitting ? loadingText : buttonText}
            </Button>
          </Div>
        )}
        {/* Auto SubmitButton when no explicit config */}
        {shouldShowAutoSubmitButton && (
          <Div className={cn("flex", buttonGapClass || "gap-2")}>
            {onCancel && (
              <Button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                variant={cancelButton?.variant ?? "outline"}
                size={cancelButton?.size}
                className="flex-1"
              >
                {cancelButton?.text
                  ? globalT(cancelButton.text)
                  : globalT(
                      "app.api.system.unifiedInterface.react.widgets.endpointRenderer.cancel",
                    )}
              </Button>
            )}
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
              variant={submitButton?.variant}
              size={submitButton?.size}
              className={onCancel ? "flex-1" : "w-full"}
            >
              {isSubmitting ? autoSubmitLoadingText : autoSubmitText}
            </Button>
          </Div>
        )}
      </Div>
    );
  }

  return (
    <Card className={cn(topPadding, bottomPadding, bottomBorder, className)}>
      {(title ?? description ?? showHeaderButton) && (
        <CardHeader>
          <Div className={cn("flex items-center justify-between", headerGapClass)}>
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
                {buttonIcon && (
                  <Icon
                    icon={buttonIcon}
                    className={cn(iconSizeClass || "h-4 w-4", iconSpacingClass || "mr-2")}
                  />
                )}
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
          !title && !description && !showHeaderButton && !shouldShowAutoFormAlert
            ? contentPaddingClass || "pt-6"
            : ""
        }
      >
        <Div className={layoutClass}>{renderChildren()}</Div>
      </CardContent>
      {/* Explicit submitButton config at bottom position */}
      {showBottomButton && (
        <CardContent className="pt-0">
          <Div className="flex gap-2">
            {/* Back button (left side) */}
            {hasBackButton && backButtonEntry && (
              <WidgetRenderer
                widgetType={backButtonEntry[1].ui.type}
                fieldName={backButtonEntry[0]}
                data={null}
                field={backButtonEntry[1]}
                context={context}
                form={form}
                endpoint={endpoint}
              />
            )}
            {/* Submit button (right side) */}
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
              className={hasBackButton ? "flex-1" : "w-full"}
            >
              {buttonIcon && (
                <Icon
                  icon={buttonIcon}
                  className={cn(iconSizeClass || "h-4 w-4", iconSpacingClass || "mr-2")}
                />
              )}
              {isSubmitting ? loadingText : buttonText}
            </Button>
          </Div>
        </CardContent>
      )}
      {/* Auto SubmitButton when no explicit config */}
      {shouldShowAutoSubmitButton && (
        <CardContent className="pt-0">
          <Div className={cn("flex", buttonGapClass || "gap-2")}>
            {onCancel && (
              <Button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                variant="outline"
                className="flex-1"
              >
                {globalT("app.api.system.unifiedInterface.react.widgets.endpointRenderer.cancel")}
              </Button>
            )}
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
              className={onCancel ? "flex-1" : "w-full"}
            >
              {isSubmitting ? autoSubmitLoadingText : autoSubmitText}
            </Button>
          </Div>
        </CardContent>
      )}
    </Card>
  );
}

ContainerWidget.displayName = "ContainerWidget";
