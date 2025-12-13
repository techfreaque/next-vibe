"use client";

import { cn } from "next-vibe/shared/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "next-vibe-ui/ui/card";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { P, H1 } from "next-vibe-ui/ui/typography";
import {
  FormAlert,
  type FormAlertState,
} from "next-vibe-ui/ui/form/form-alert";
import type { JSX } from "react";

import { simpleT } from "@/i18n/core/shared";
import { getIconComponent } from "@/app/api/[locale]/agent/chat/model-access/icons";
import type { IconValue } from "@/app/api/[locale]/agent/chat/model-access/icons";
import type { TranslationKey } from "@/i18n/core/static-types";

import { WidgetType, type WidgetType as WidgetTypeEnum } from "../../../shared/types/enums";
import type {
  ReactWidgetProps,
  WidgetData,
} from "../../../shared/widgets/types";
import { WidgetRenderer } from "../renderers/WidgetRenderer";
import {
  type LayoutConfig,
  getLayoutClassName,
} from "../../../shared/widgets/utils/widget-helpers";
import type { UnifiedField } from "../../../shared/types/endpoint";
import { isResponseField, isFormInputField } from "../../../shared/widgets/utils/field-helpers";

/**
 * Displays container layouts with nested fields.
 * Renders field.children definitions - each widget decides if it should render based on data.
 *
 * Auto-features (enabled by default, can be disabled):
 * - showFormAlert: Shows FormAlert at top for error/success messages (default: true)
 * - showSubmitButton: Shows submit button at bottom when there are request fields (default: true)
 */
export function ContainerWidget({
  value,
  field,
  context,
  className,
  form,
  fieldName,
  onSubmit,
  isSubmitting,
}: ReactWidgetProps<typeof WidgetTypeEnum.CONTAINER>): JSX.Element {
  const { t } = simpleT(context.locale);

  const {
    layoutType: layoutTypeRaw = "stacked",
    columns = 1,
    gap = "4",
    title: titleKey,
    description: descriptionKey,
    noCard = false,
    getCount,
    submitButton: submitButtonConfig,
    // Auto-features: default to true, can be disabled
    showFormAlert = true,
    showSubmitButton = true,
  } = field.ui;

  const layoutTypeStr = String(layoutTypeRaw);

  let layoutType: "grid" | "flex" | "stack" = "stack";
  let finalColumns: number | undefined = columns;

  if (layoutTypeStr === "grid" || layoutTypeStr.startsWith("grid_")) {
    layoutType = "grid";
    finalColumns = 12;
    if (layoutTypeStr === "grid_2_columns") {
      finalColumns = 2;
    } else if (layoutTypeStr === "grid_3_columns") {
      finalColumns = 3;
    } else if (layoutTypeStr === "grid_4_columns") {
      finalColumns = 4;
    }
  } else if (layoutTypeStr === "flex" || layoutTypeStr === "horizontal") {
    layoutType = "flex";
  }

  const layoutConfig: LayoutConfig = {
    type: layoutType,
    columns: finalColumns,
    gap: String(gap),
  };
  const layoutClass = getLayoutClassName(layoutConfig);

  let title = titleKey ? t(titleKey) : undefined;
  const description = descriptionKey ? t(descriptionKey) : undefined;

  if (getCount && value && typeof value === "object" && !Array.isArray(value)) {
    // getCount's type is generic and depends on field children, cast to runtime type
    const getCountFn = getCount as (data: {
      request?: Record<string, unknown>;
      response?: Record<string, unknown>;
    }) => number | undefined;
    const count = getCountFn({
      request: value as Record<string, unknown>,
      response: value as Record<string, unknown>,
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
    : t(
        "app.api.system.unifiedInterface.react.widgets.endpointRenderer.submit",
      );

  const loadingText = submitButtonConfig?.loadingText
    ? t(submitButtonConfig.loadingText)
    : t(
        "app.api.system.unifiedInterface.react.widgets.endpointRenderer.submitting",
      );

  // Get children from field definition
  const fieldWithChildren = field as UnifiedField & {
    children?: Record<string, UnifiedField>;
  };

  if (!fieldWithChildren.children) {
    if (noCard) {
      return (
        <Div className={cn("text-muted-foreground italic", className)}>
          {t(
            "app.api.system.unifiedInterface.react.widgets.container.noContent",
          )}
        </Div>
      );
    }

    return (
      <Card className={className}>
        <CardContent>
          <P className="italic text-muted-foreground">
            {t(
              "app.api.system.unifiedInterface.react.widgets.container.noContent",
            )}
          </P>
        </CardContent>
      </Card>
    );
  }

  const children = Object.entries(fieldWithChildren.children);

  // Check if there are any actual form input fields (FORM_FIELD widgets with request usage)
  // This determines if auto FormAlert and auto submit button should be shown
  // Only FORM_FIELD widgets count - not TEXT or other widgets with request usage
  const hasFormInputFields = children.some(([, childField]) =>
    isFormInputField(childField),
  );

  // Recursive function to check if any widget in the subtree is of a specific type
  const hasWidgetTypeInTree = (
    fieldToCheck: UnifiedField,
    widgetType: string,
  ): boolean => {
    // Check direct field
    if (fieldToCheck.ui?.type === widgetType) {
      return true;
    }
    // Check nested children
    const fieldWithNestedChildren = fieldToCheck as UnifiedField & {
      children?: Record<string, UnifiedField>;
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
  const shouldShowAutoFormAlert = showFormAlert && hasFormInputFields && !hasExplicitFormAlert;
  // Auto SubmitButton: only show if enabled AND has form input fields AND no explicit config AND no explicit widget in subtree AND form context exists
  const shouldShowAutoSubmitButton =
    showSubmitButton && hasFormInputFields && !submitButtonConfig && !hasExplicitSubmitButton && onSubmit && form;

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
              ? (data.messageParams as Record<string, string | number> | undefined)
              : undefined,
        },
      };
    }
  }

  // Auto submit button text
  const autoSubmitText = t(
    "app.api.system.unifiedInterface.react.widgets.endpointRenderer.submit",
  );
  const autoSubmitLoadingText = t(
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

  // If noCard is true, render without Card wrapper
  if (noCard) {
    return (
      <Div className={cn("space-y-6", className)}>
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
        {shouldShowAutoFormAlert && (
          <FormAlert alert={formAlertState} />
        )}
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
            const childUi = childField.ui as { columns?: number } | undefined;
            const childColumns = childUi?.columns;

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
              layoutType === "grid" && childColumns
                ? colSpanMap[childColumns]
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
    <Card className={className}>
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
        className={!title && !description && !showHeaderButton && !shouldShowAutoFormAlert ? "pt-6" : ""}
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
            const childUi = childField.ui as { columns?: number } | undefined;
            const childColumns = childUi?.columns;

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
              layoutType === "grid" && childColumns
                ? colSpanMap[childColumns]
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
