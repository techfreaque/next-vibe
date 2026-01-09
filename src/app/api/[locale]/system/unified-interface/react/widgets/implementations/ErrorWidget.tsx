"use client";

import { cn } from "next-vibe/shared/utils";
import { Alert, AlertDescription, AlertTitle } from "next-vibe-ui/ui/alert";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { AlertCircle } from "next-vibe-ui/ui/icons";
import { Pre } from "next-vibe-ui/ui/pre";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import type { WidgetType } from "../../../shared/types/enums";
import { extractErrorData } from "../../../shared/widgets/logic/errors";
import type { ReactWidgetProps } from "../../../shared/widgets/types";
import {
  getIconSizeClassName,
  getSpacingClassName,
  getTextSizeClassName,
} from "../../../shared/widgets/utils/widget-helpers";

/**
 * Error Widget - Displays error messages with optional details and actions
 *
 * Renders error alert UI with:
 * - Error icon and title (translated via context.t)
 * - Error message text (translated via context.t)
 * - Optional error code for debugging
 * - Optional stack trace (collapsible for verbose debugging)
 * - Optional action button for recovery
 *
 * Features:
 * - Destructive alert styling (red background)
 * - Error icon for visual context
 * - Collapsible stack trace for debugging
 * - Action button for error recovery
 * - Responsive padding and layout
 *
 * UI Config Options:
 * - title: Error title (TKey - translated)
 * - message: Error description (TKey - translated)
 *
 * Data Format:
 * - object: { title: string, message?: string, code?: string, stack?: string, action?: { label: string } }
 *   - title: Error title (translated via context.t)
 *   - message: Error details (translated via context.t)
 *   - code: Error code for debugging (not translated)
 *   - stack: Stack trace for debugging (not translated)
 *   - action: Optional recovery action with label
 * - null/undefined: Shows generic "Error" message
 *
 * @param value - Error data
 * @param field - Field definition with UI config
 * @param context - Rendering context with translator
 * @param className - Optional CSS classes
 */
export function ErrorWidget<const TKey extends string>({
  value,
  field,
  context,
  className,
}: ReactWidgetProps<typeof WidgetType.ERROR, TKey>): JSX.Element {
  const { iconSize, descriptionSpacing, codeSize, sectionSpacing, stackSize, stackPadding } =
    field.ui;

  // Get classes from config (no hardcoding!)
  const iconSizeClass = getIconSizeClassName(iconSize);
  const descriptionSpacingClass = getSpacingClassName("margin", descriptionSpacing);
  const codeSizeClass = getTextSizeClassName(codeSize);
  const sectionSpacingClass = getSpacingClassName("margin", sectionSpacing);
  const stackSizeClass = getTextSizeClassName(stackSize);
  const stackPaddingClass = getSpacingClassName("padding", stackPadding);

  // Extract data using shared logic
  const data = extractErrorData(value);

  if (!data) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertCircle className={iconSizeClass || "h-4 w-4"} />
        <AlertTitle>{context.t("app.common.error.title" as never)}</AlertTitle>
      </Alert>
    );
  }

  const { title, message, code, stack, action } = data;

  return (
    <Alert variant="destructive" className={className}>
      <AlertCircle className={iconSizeClass || "h-4 w-4"} />
      <AlertTitle>{title}</AlertTitle>

      {message && (
        <AlertDescription className={descriptionSpacingClass || "mt-2"}>{message}</AlertDescription>
      )}

      {code && (
        <Div className={sectionSpacingClass || "mt-3"}>
          <P className={cn("font-mono text-muted-foreground", codeSizeClass || "text-xs")}>
            {context.t("system.ui.widgets.error.errorCode")}: {code}
          </P>
        </Div>
      )}

      {stack && (
        <Div className={sectionSpacingClass || "mt-3"}>
          <details className={stackSizeClass || "text-xs"}>
            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
              {context.t("system.ui.widgets.error.stackTrace")}
            </summary>
            <Pre
              className={cn(
                "bg-muted/50 rounded overflow-x-auto",
                stackPaddingClass || "mt-2 p-2",
                stackSizeClass || "text-xs",
              )}
            >
              {stack}
            </Pre>
          </details>
        </Div>
      )}

      {action && (
        <Div className={sectionSpacingClass || "mt-4"}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              context.logger.debug("Error action:", action.label);
            }}
          >
            {action.label}
          </Button>
        </Div>
      )}
    </Alert>
  );
}

ErrorWidget.displayName = "ErrorWidget";
