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
import React, { type JSX } from "react";
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
import type { WidgetData } from "../../../../shared/widgets/widget-data";
import { MultiWidgetRenderer } from "../../../renderers/react/MultiWidgetRenderer";
import type { ReactWidgetProps } from "../../_shared/react-types";
import { hasChild, hasChildren } from "../../_shared/type-guards";
import type {
  ArrayChildConstraint,
  ConstrainedChildUsage,
  FieldUsageConfig,
  ObjectChildrenConstraint,
  UnionObjectWidgetConfigConstrain,
} from "../../_shared/types";
import {
  useWidgetCancelButton,
  useWidgetForm,
  useWidgetIsSubmitting,
  useWidgetLocale,
  useWidgetOnCancel,
  useWidgetOnSubmit,
  useWidgetResponse,
  useWidgetSubmitButton,
  useWidgetTranslation,
} from "../../_shared/use-widget-context";
import { ContainerActionsWidget } from "./actions";
import type { ContainerWidgetConfig } from "./types";

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
    | "array-optional"
    | "widget-object",
  TChildren extends
    | ObjectChildrenConstraint<TKey, ConstrainedChildUsage<TUsage>>
    | UnionObjectWidgetConfigConstrain<TKey, ConstrainedChildUsage<TUsage>>
    | ArrayChildConstraint<TKey, ConstrainedChildUsage<TUsage>>,
>({
  field,
  fieldName,
  inlineButtonInfo,
}: ReactWidgetProps<
  TEndpoint,
  TUsage,
  ContainerWidgetConfig<TKey, TUsage, TSchemaType, TChildren>
>): JSX.Element {
  // Get context from hooks
  const locale = useWidgetLocale();
  const t = useWidgetTranslation();
  const form = useWidgetForm();
  const onSubmit = useWidgetOnSubmit();
  const onCancel = useWidgetOnCancel();
  const isSubmitting = useWidgetIsSubmitting() ?? false;
  const submitButton = useWidgetSubmitButton();
  const cancelButton = useWidgetCancelButton();
  const response = useWidgetResponse();

  const { t: globalT } = simpleT(locale);

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
    headerGap,
    spacing = "normal",
    className,
  } = field;

  // Helper to extract field data based on narrowed type
  interface FieldData {
    childrenForRenderer:
      | ObjectChildrenConstraint<TKey, ConstrainedChildUsage<TUsage>>
      | UnionObjectWidgetConfigConstrain<TKey, ConstrainedChildUsage<TUsage>>
      | ArrayChildConstraint<TKey, ConstrainedChildUsage<TUsage>>
      | undefined;
    discriminator: string | undefined;
    fieldValue: WidgetData;
  }
  const extractFieldData = (): FieldData => {
    if (hasChildren(field)) {
      const { children, value } = field;
      return {
        childrenForRenderer: children,
        fieldValue: value,
        discriminator: undefined,
      } satisfies FieldData;
    }
    if (hasChild(field)) {
      const { child, value } = field;
      return {
        childrenForRenderer: child,
        fieldValue: value,
        discriminator: undefined,
      } satisfies FieldData;
    }
    return {
      childrenForRenderer: undefined,
      fieldValue: undefined,
      discriminator: undefined,
    } satisfies FieldData;
  };

  const { childrenForRenderer, discriminator, fieldValue } = extractFieldData();

  // Calculate count from field data if getCount function is provided
  // This is accessed on the container config itself, not passed to children
  const countFromField = field.getCount
    ? field.getCount(fieldValue)
    : undefined;

  // Call useWatch unconditionally (React hooks rule) - disabled when not needed
  const watchPath =
    discriminator && fieldName
      ? `${fieldName}.${discriminator}`
      : (discriminator ?? "");
  const watchedDiscriminator = useWatch({
    control: form?.control,
    name: watchPath as Path<TEndpoint["types"]["RequestOutput"]>,
    disabled: !discriminator || !form || !fieldName,
  }) as string | undefined;

  // Check if this is the ROOT container (first in the chain)
  // Only root container can have inlineButtonInfo prop
  const isRootContainer = inlineButtonInfo !== undefined;

  // Check if we're in loading/response state (no form inputs)
  const hasFormInputs = onSubmit && form;

  // Explicit submitButton config (only in root container, only if not loading)
  const showHeaderButton =
    isRootContainer &&
    hasFormInputs &&
    submitButtonConfig?.position === "header";
  const showBottomButton =
    isRootContainer &&
    hasFormInputs &&
    submitButtonConfig?.position === "bottom";

  // Auto SubmitButton logic:
  // 1. Only ROOT container (has inlineButtonInfo prop)
  // 2. Only if showSubmitButton is enabled (default true)
  // 3. Only if there's NO explicit submitButton config
  // 4. Only if there are NO inline buttons already defined in the field tree
  // 5. Only if form context exists (not in loading/response-only state)
  const shouldShowAutoSubmitButton =
    isRootContainer &&
    showSubmitButton &&
    !submitButtonConfig &&
    !(inlineButtonInfo?.hasSubmitButton ?? false) &&
    hasFormInputs;

  // Auto FormAlert logic: only in root container
  const shouldShowAutoFormAlert =
    isRootContainer &&
    showFormAlert &&
    !(inlineButtonInfo?.hasFormAlert ?? false);

  // Find backButton field in children if it exists (for explicit submitButton config)
  let hasBackButton = false;
  let backButtonFieldName: string | undefined;

  if (!Array.isArray(childrenForRenderer) && childrenForRenderer) {
    if (
      typeof childrenForRenderer === "object" &&
      childrenForRenderer !== null &&
      "backButton" in childrenForRenderer
    ) {
      backButtonFieldName = "backButton";
      hasBackButton = true;
    }
  }

  // Button state is tracked by context provider
  // This prevents nested containers from rendering duplicate buttons

  // Handle ACTIONS layout type with separate component (after all hooks are called)
  if (layoutTypeRaw === LayoutType.ACTIONS && hasChildren(field)) {
    return <ContainerActionsWidget field={field} fieldName={fieldName} />;
  }

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
  const title = titleKey ? t(titleKey) : undefined;
  const description = descriptionKey ? t(descriptionKey) : undefined;

  let displayTitle: string | undefined = title;
  if (countFromField !== undefined && displayTitle) {
    displayTitle = `${displayTitle} (${countFromField})`;
  }

  const buttonIcon: IconKey | undefined = submitButtonConfig?.icon
    ? submitButtonConfig.icon
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
  const headerGapClass = getSpacingClassName("gap", headerGap);

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
        <CardContent className="pt-6">
          <P className="italic text-muted-foreground">
            {globalT(
              "app.api.system.unifiedInterface.react.widgets.container.noContent",
            )}
          </P>
        </CardContent>
      </Card>
    );
  }

  // Build FormAlert state from response
  let formAlertState: FormAlertState | null = null;
  if (response && response.success === false) {
    formAlertState = {
      variant: "destructive",
      message: {
        message: response.message as TranslationKey,
        messageParams: response.messageParams,
      },
    };
  }

  const autoSubmitText = globalT(
    "app.api.system.unifiedInterface.react.widgets.endpointRenderer.submit",
  );
  const autoSubmitLoadingText = globalT(
    "app.api.system.unifiedInterface.react.widgets.endpointRenderer.submitting",
  );

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
            childrenSchema={childrenForRenderer}
            value={fieldValue}
            fieldName={fieldName}
            discriminator={discriminator}
            watchedDiscriminatorValue={watchedDiscriminator}
          />
        </Div>
        {/* Explicit submitButton config at bottom position */}
        {showBottomButton && (
          <Div className="flex gap-2">
            {/* Back button (left side) */}
            {hasBackButton && backButtonFieldName && (
              <MultiWidgetRenderer
                key={backButtonFieldName}
                childrenSchema={undefined}
                value={null}
                fieldName={backButtonFieldName}
              />
            )}
            {/* Submit button (right side) */}
            <Button
              type="button"
              onClick={(): void => {
                if (onSubmit) {
                  onSubmit();
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
                if (onSubmit) {
                  onSubmit();
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
        <CardContent
          className={
            (displayTitle ?? description ?? showHeaderButton)
              ? "pb-0"
              : "pb-0 pt-6"
          }
        >
          <FormAlert alert={formAlertState} />
        </CardContent>
      )}
      <CardContent
        className={
          (displayTitle ??
          description ??
          showHeaderButton ??
          shouldShowAutoFormAlert)
            ? ""
            : "pt-6"
        }
      >
        <Div className={layoutClass}>
          <MultiWidgetRenderer
            childrenSchema={childrenForRenderer}
            value={fieldValue}
            fieldName={fieldName}
            discriminator={discriminator}
            watchedDiscriminatorValue={watchedDiscriminator}
          />
        </Div>
      </CardContent>
      {/* Explicit submitButton config at bottom position */}
      {showBottomButton && (
        <CardContent
          className={
            (displayTitle ?? description ?? showHeaderButton) ? "" : "pt-6"
          }
        >
          <Div className="flex gap-2">
            {/* Back button (left side) */}
            {hasBackButton && backButtonFieldName && (
              <MultiWidgetRenderer
                key={backButtonFieldName}
                childrenSchema={undefined}
                value={null}
                fieldName={backButtonFieldName}
              />
            )}
            {/* Submit button (right side) */}
            <Button
              type="button"
              onClick={(): void => {
                if (onSubmit) {
                  onSubmit();
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
        <CardContent
          className={
            (displayTitle ?? description ?? showHeaderButton) ? "" : "pt-6"
          }
        >
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
                if (onSubmit) {
                  onSubmit();
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
