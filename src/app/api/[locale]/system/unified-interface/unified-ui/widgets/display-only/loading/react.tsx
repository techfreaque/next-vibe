"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { Loader2 } from "next-vibe-ui/ui/icons";
import { Progress } from "next-vibe-ui/ui/progress";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import {
  getIconSizeClassName,
  getSpacingClassName,
  getTextSizeClassName,
} from "../../../../shared/widgets/utils/widget-helpers";
import type { ReactWidgetProps } from "../../_shared/react-types";
import type { FieldUsageConfig } from "../../_shared/types";
import { useWidgetTranslation } from "../../_shared/use-widget-context";
import type { LoadingWidgetConfig } from "./types";

/**
 * Loading Widget - Displays loading states with spinners and progress bars
 *
 * Renders loading UI with support for:
 * - Indeterminate loading: spinner icon + message
 * - Progress bar: message + progress indicator with percentage
 * - Simple loading: message only
 *
 * Features:
 * - Animated spinner icon for indeterminate loading
 * - Progress bar with percentage display
 * - Centered layout with proper spacing
 * - Muted text styling for non-intrusive display
 * - Automatic message translation
 *
 * UI Config Options:
 * - message: Loading message (TKey - translated)
 *
 * Data Format:
 * - string: Simple loading message (translated via context.t)
 * - object: { message?: string, indeterminate?: boolean, progress?: number }
 *   - message: Loading text (translated via context.t)
 *   - indeterminate: Show spinner (default: true)
 *   - progress: Progress percentage 0-100 (shows progress bar)
 * - null/undefined: Shows "Loading..." message
 *
 * Rendering Modes:
 * 1. Indeterminate (indeterminate = true): Animated spinner + message
 * 2. Progress (progress defined): Message + progress bar with percentage
 * 3. Default (neither): Message only
 *
 * @param value - Loading state data
 * @param context - Rendering context with translator
 * @param className - Optional CSS classes
 */
export function LoadingWidget<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TUsage extends FieldUsageConfig,
>({
  field,
}: ReactWidgetProps<
  TEndpoint,
  TUsage,
  LoadingWidgetConfig<TKey, TUsage, "widget">
>): JSX.Element {
  const t = useWidgetTranslation();
  const {
    padding,
    gap,
    messageSize,
    spinnerSize,
    progressHeight,
    progressSpacing,
    percentageSize,
    className,
    message: messageKey,
  } = field;

  // Get classes from config (no hardcoding!)
  const paddingClass = getSpacingClassName("padding", padding);
  const gapClass = getSpacingClassName("gap", gap);
  const messageSizeClass = getTextSizeClassName(messageSize);
  const spinnerSizeClass = getIconSizeClassName(spinnerSize);
  const progressSpacingClass = getSpacingClassName("gap", progressSpacing);
  const percentageSizeClass = getTextSizeClassName(percentageSize);

  // Progress height mapping
  const progressHeightClass =
    progressHeight === "xs"
      ? "h-1"
      : progressHeight === "sm"
        ? "h-2"
        : progressHeight === "base"
          ? "h-3"
          : "h-2";

  // Get message from config or use default
  const message = messageKey ? t(messageKey) : "Loading...";
  const indeterminate = true;
  const progress = undefined;

  return (
    <Div
      className={cn(
        "flex flex-col items-center justify-center",
        paddingClass || "py-8 px-4",
        className,
      )}
    >
      {/* Indeterminate loading */}
      {indeterminate && progress === undefined && (
        <Div className={cn("flex items-center", gapClass || "gap-3")}>
          <Loader2
            className={cn(
              "animate-spin text-primary",
              spinnerSizeClass || "h-5 w-5",
            )}
          />
          <Span
            className={cn(
              "text-muted-foreground",
              messageSizeClass || "text-sm",
            )}
          >
            {message}
          </Span>
        </Div>
      )}

      {/* Progress bar */}
      {progress !== undefined && (
        <Div
          className={cn("w-full max-w-xs", progressSpacingClass || "space-y-2")}
        >
          <Span
            className={cn(
              "text-muted-foreground text-center block",
              messageSizeClass || "text-sm",
            )}
          >
            {message}
          </Span>
          <Div className="space-y-1">
            <Progress value={progress} className={progressHeightClass} />
            <Span
              className={cn(
                "text-muted-foreground text-center block",
                percentageSizeClass || "text-xs",
              )}
            >
              {Math.round(progress)}%
            </Span>
          </Div>
        </Div>
      )}

      {/* Default (neither indeterminate nor progress) */}
      {!indeterminate && progress === undefined && (
        <Span
          className={cn("text-muted-foreground", messageSizeClass || "text-sm")}
        >
          {message}
        </Span>
      )}
    </Div>
  );
}

LoadingWidget.displayName = "LoadingWidget";

export default LoadingWidget;
