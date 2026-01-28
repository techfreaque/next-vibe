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
import type { Path } from "react-hook-form";
import { useWatch } from "react-hook-form";

import type { IconKey } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import { Icon } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import { simpleT } from "@/i18n/core/shared";
import type { TranslationKey } from "@/i18n/core/static-types";

import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import { LayoutType } from "../../../../shared/types/enums";
import {
  getIconSizeClassName,
  getLayoutClassName,
  getSpacingClassName,
  getTextSizeClassName,
  type LayoutConfig,
} from "../../../../shared/widgets/utils/widget-helpers";
import { MultiWidgetRenderer } from "../../../renderers/react/MultiWidgetRenderer";
import type { ReactWidgetProps } from "../../_shared/react-types";
import type {
  ArrayChildConstraint,
  ConstrainedChildUsage,
  FieldUsageConfig,
  ObjectChildrenConstraint,
  UnionObjectWidgetConfigConstrain,
} from "../../_shared/types";
import type {
  ContainerArrayWidgetConfig,
  ContainerObjectWidgetConfig,
  ContainerUnionWidgetConfig,
  ContainerWidgetConfig,
} from "./types";

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
export function ContainerWidget<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends
    | "object"
    | "object-optional"
    | "object-union"
    | "array"
    | "array-optional",
  TChildren extends
    | ObjectChildrenConstraint<TKey, ConstrainedChildUsage<TUsage>>
    | UnionObjectWidgetConfigConstrain<TKey, ConstrainedChildUsage<TUsage>>
    | ArrayChildConstraint<TKey, ConstrainedChildUsage<TUsage>>,
>({
  field,
  context,
  fieldName,
}: ReactWidgetProps<
  TEndpoint,
  ContainerWidgetConfig<TKey, TUsage, TSchemaType, TChildren>
>): JSX.Element {
  const { t: globalT } = simpleT(context.locale);

  const {
    layoutType: layoutTypeRaw = LayoutType.STACKED,
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
    className,
  } = field;

  // Extract properties based on field type using schemaType discriminator
  type ChildrenType =
    | ObjectChildrenConstraint<TKey, ConstrainedChildUsage<TUsage>>
    | UnionObjectWidgetConfigConstrain<TKey, ConstrainedChildUsage<TUsage>>
    | ArrayChildConstraint<TKey, ConstrainedChildUsage<TUsage>>
    | undefined;

  let childrenForRenderer: ChildrenType;
  let discriminator: string | undefined;

  // Type-safe extraction using schemaType discriminator
  if (field.schemaType === "object-union") {
    const unionField = field as ContainerUnionWidgetConfig<
      TKey,
      TUsage,
      UnionObjectWidgetConfigConstrain<TKey, ConstrainedChildUsage<TUsage>>
    >;
    childrenForRenderer = unionField.variants;
    discriminator = unionField.discriminator as string | undefined;
  } else if (
    field.schemaType === "object" ||
    field.schemaType === "object-optional" ||
    field.schemaType === "widget-object"
  ) {
    const objectField = field as ContainerObjectWidgetConfig<
      TKey,
      TUsage,
      "object" | "object-optional" | "widget-object",
      ObjectChildrenConstraint<TKey, ConstrainedChildUsage<TUsage>>
    >;
    childrenForRenderer = objectField.children;
  } else if (
    field.schemaType === "array" ||
    field.schemaType === "array-optional"
  ) {
    const arrayField = field as ContainerArrayWidgetConfig<
      TKey,
      TUsage,
      "array" | "array-optional",
      ArrayChildConstraint<TKey, ConstrainedChildUsage<TUsage>>
    >;
    childrenForRenderer = arrayField.child;
  }

  // Call useWatch unconditionally (React hooks rule) - disabled when not needed
  const watchPath =
    discriminator && fieldName
      ? `${fieldName}.${discriminator}`
      : (discriminator ?? "");
  const watchedDiscriminator = useWatch({
    control: context.form?.control,
    name: watchPath as Path<TEndpoint["types"]["RequestOutput"]>,
    disabled: !discriminator || !context.form || !fieldName,
  }) as string | undefined;

  const layoutTypeStr = layoutTypeRaw;

  let layoutType: "grid" | "flex" | "stack" = "stack";
  let gridColumns = 12; // Default to 12-column grid for maximum flexibility

  if (layoutTypeStr === "grid" || layoutTypeStr.startsWith("grid_")) {
    layoutType = "grid";
    // Use explicit columns if provided, otherwise infer from layout type preset
    if (columns && columns > 0) {
      gridColumns = columns;
    } else if (layoutTypeStr === "grid_2_columns") {
      gridColumns = 2;
    } else if (layoutTypeStr === "grid_3_columns") {
      gridColumns = 3;
    } else if (layoutTypeStr === "grid_4_columns") {
      gridColumns = 4;
    }
  } else if (
    layoutTypeStr === "flex" ||
    layoutTypeStr === "horizontal" ||
    layoutTypeStr === "inline"
  ) {
    layoutType = "flex";
  }

  // Use 12-column grid for maximum flexibility with child column spans
  const layoutConfig: LayoutConfig = {
    type: layoutType,
    columns: layoutType === "grid" ? gridColumns : undefined,
    gap: String(gap),
    alignItems,
  };
  const layoutClass = getLayoutClassName(layoutConfig);

  // Translate title and description early (before any early returns)
  const title = titleKey ? context.t(titleKey) : undefined;
  const description = descriptionKey ? context.t(descriptionKey) : undefined;

  let displayTitle: string | undefined = title;
  if (getCount && field.value && displayTitle) {
    const count = getCount(field.value);
    if (count !== undefined) {
      displayTitle = `${displayTitle} (${count})`;
    }
  }

  const isSubmitting = context.isSubmitting ?? false;
  const onCancel = undefined; // Not provided in context
  const submitButton = context.submitButton;
  const cancelButton = context.cancelButton;

  const showHeaderButton =
    submitButtonConfig?.position === "header" &&
    context.onSubmit &&
    context.form;
  const showBottomButton =
    submitButtonConfig?.position === "bottom" &&
    context.onSubmit &&
    context.form;

  const buttonIcon = submitButtonConfig?.icon
    ? (submitButtonConfig.icon as IconKey)
    : undefined;

  // Get classes from config (no hardcoding!)
  const contentGap = getSpacingClassName("gap", spacing) || "space-y-6";
  const topPadding = paddingTop
    ? getSpacingClassName("padding", paddingTop)
    : "";
  const bottomPadding = paddingBottom
    ? getSpacingClassName("padding", paddingBottom)
    : "";
  const bottomBorder = borderBottom ? "border-b" : "";
  const titleAlignClass =
    titleAlign === "center"
      ? "text-center"
      : titleAlign === "right"
        ? "text-right"
        : "text-left";
  const titleSizeClass = getTextSizeClassName(titleSize);
  const descriptionSizeClass = getTextSizeClassName(descriptionSize);
  const buttonGapClass = getSpacingClassName("gap", buttonGap);
  const iconSizeClass = getIconSizeClassName(iconSize);
  const iconSpacingClass = getSpacingClassName("margin", iconSpacing);
  const contentPaddingClass = getSpacingClassName("padding", contentPadding);
  const headerGapClass = getSpacingClassName("gap", headerGap);

  const buttonText = submitButtonConfig?.text
    ? context.t(submitButtonConfig.text)
    : globalT(
        "app.api.system.unifiedInterface.react.widgets.endpointRenderer.submit",
      );

  const loadingText = submitButtonConfig?.loadingText
    ? context.t(submitButtonConfig.loadingText)
    : globalT(
        "app.api.system.unifiedInterface.react.widgets.endpointRenderer.submitting",
      );

  // Check if children are present for validation
  const hasChildren_ = childrenForRenderer !== undefined;

  if (!hasChildren_) {
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

  // Check if there are any actual form input fields
  // For now, use a simple heuristic - check if any are form fields
  const hasFormInputFields = true; // Assume true for now, MultiWidgetRenderer handles the filtering

  // Check if container or any nested child has explicit FORM_ALERT or SUBMIT_BUTTON widgets
  const hasExplicitFormAlert = false; // TODO: implement if needed
  const hasExplicitSubmitButton = false; // TODO: implement if needed

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
    context.onSubmit &&
    context.form;

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
  }

  const autoSubmitText = globalT(
    "app.api.system.unifiedInterface.react.widgets.endpointRenderer.submit",
  );
  const autoSubmitLoadingText = globalT(
    "app.api.system.unifiedInterface.react.widgets.endpointRenderer.submitting",
  );

  // Find backButton field in children if it exists
  let hasBackButton = false;
  let backButtonEntry:
    | [
        string,
        typeof childrenForRenderer extends Record<string, infer V> ? V : never,
      ]
    | undefined;

  if (
    Array.isArray(childrenForRenderer) &&
    !("children" in childrenForRenderer[0] || false)
  ) {
    // Not a union, safe to check
  } else if (!Array.isArray(childrenForRenderer) && childrenForRenderer) {
    if (
      typeof childrenForRenderer === "object" &&
      childrenForRenderer !== null &&
      "backButton" in childrenForRenderer
    ) {
      backButtonEntry = ["backButton", childrenForRenderer.backButton];
      hasBackButton = true;
    }
  }

  // If noCard is true, render without Card wrapper
  if (noCard) {
    return (
      <Div
        className={cn(
          contentGap,
          topPadding,
          bottomPadding,
          bottomBorder,
          className,
        )}
      >
        {(displayTitle || description) && (
          <Div className={titleAlignClass}>
            {displayTitle && (
              <H1
                className={cn(
                  "font-bold",
                  titleSizeClass || "text-3xl md:text-4xl",
                )}
              >
                {displayTitle}
              </H1>
            )}
            {description && (
              <P className={cn(descriptionSizeClass || "text-lg")}>
                {description}
              </P>
            )}
          </Div>
        )}
        {/* Auto FormAlert at top */}
        {shouldShowAutoFormAlert && <FormAlert alert={formAlertState} />}
        <Div className={layoutClass}>
          <MultiWidgetRenderer
            children={childrenForRenderer}
            value={field.value}
            fieldName={fieldName}
            layoutConfig={layoutConfig}
            context={context}
            discriminator={discriminator}
            watchedDiscriminatorValue={watchedDiscriminator}
          />
        </Div>
        {/* Explicit submitButton config at bottom position */}
        {showBottomButton && (
          <Div className="flex gap-2">
            {/* Back button (left side) */}
            {hasBackButton && backButtonEntry && (
              <>
                <MultiWidgetRenderer
                  key={backButtonEntry[0]}
                  children={undefined}
                  value={null}
                  fieldName={backButtonEntry[0]}
                  layoutConfig={undefined}
                  context={context}
                />
              </>
            )}
            {/* Submit button (right side) */}
            <Button
              type="button"
              onClick={(): void => {
                if (context.onSubmit) {
                  context.onSubmit();
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
                  className={cn(
                    iconSizeClass || "h-4 w-4",
                    iconSpacingClass || "mr-2",
                  )}
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
                if (context.onSubmit) {
                  context.onSubmit();
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
      {(displayTitle ?? description ?? showHeaderButton) && (
        <CardHeader>
          <Div
            className={cn("flex items-center justify-between", headerGapClass)}
          >
            <Div>
              {displayTitle && <CardTitle>{displayTitle}</CardTitle>}
              {description && <CardDescription>{description}</CardDescription>}
            </Div>
            {showHeaderButton && (
              <Button
                type="button"
                onClick={(): void => {
                  if (context.form && context.onSubmit) {
                    const onSubmit = context.onSubmit;
                    void context.form.handleSubmit(() => {
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
                    className={cn(
                      iconSizeClass || "h-4 w-4",
                      iconSpacingClass || "mr-2",
                    )}
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
          !displayTitle &&
          !description &&
          !showHeaderButton &&
          !shouldShowAutoFormAlert
            ? contentPaddingClass || "pt-6"
            : ""
        }
      >
        <Div className={layoutClass}>
          <MultiWidgetRenderer
            children={childrenForRenderer}
            value={field.value}
            fieldName={fieldName}
            layoutConfig={layoutConfig}
            context={context}
            discriminator={discriminator}
            watchedDiscriminatorValue={watchedDiscriminator}
          />
        </Div>
      </CardContent>
      {/* Explicit submitButton config at bottom position */}
      {showBottomButton && (
        <CardContent className="pt-0">
          <Div className="flex gap-2">
            {/* Back button (left side) */}
            {hasBackButton && backButtonEntry && (
              <>
                <MultiWidgetRenderer
                  key={backButtonEntry[0]}
                  children={undefined}
                  value={null}
                  fieldName={backButtonEntry[0]}
                  layoutConfig={undefined}
                  context={context}
                />
              </>
            )}
            {/* Submit button (right side) */}
            <Button
              type="button"
              onClick={(): void => {
                if (context.onSubmit) {
                  context.onSubmit();
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
                  className={cn(
                    iconSizeClass || "h-4 w-4",
                    iconSpacingClass || "mr-2",
                  )}
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
                {globalT(
                  "app.api.system.unifiedInterface.react.widgets.endpointRenderer.cancel",
                )}
              </Button>
            )}
            <Button
              type="button"
              onClick={(): void => {
                if (context.onSubmit) {
                  context.onSubmit();
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

export default ContainerWidget;
