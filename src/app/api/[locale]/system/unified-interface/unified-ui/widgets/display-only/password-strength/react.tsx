"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import { simpleT } from "@/i18n/core/shared";

import {
  getHeightClassName,
  getSpacingClassName,
  getTextSizeClassName,
} from "../../../../shared/widgets/utils/widget-helpers";
import type { ReactWidgetProps } from "../../_shared/react-types";
import type { FieldUsageConfig } from "../../_shared/types";
import { calculatePasswordStrength } from "./shared";
import type { PasswordStrengthWidgetConfig } from "./types";

/**
 * Displays a visual indicator of password strength.
 * Watches the password form field and updates in real-time.
 */
export function PasswordStrengthWidget<
  TEndpoint extends CreateApiEndpointAny,
  TUsage extends FieldUsageConfig,
>({
  field,
  context,
}: ReactWidgetProps<
  TEndpoint,
  PasswordStrengthWidgetConfig<TUsage, "widget", TEndpoint>
>): JSX.Element | null {
  const { t } = simpleT(context.locale);
  const {
    watchField,
    containerGap,
    labelTextSize,
    barHeight,
    suggestionTextSize,
    suggestionMarginTop,
    weakBgColor = "bg-red-500",
    fairBgColor = "bg-orange-500",
    goodBgColor = "bg-yellow-500",
    strongBgColor = "bg-green-500",
    weakTextColor = "text-red-500",
    fairTextColor = "text-orange-500",
    goodTextColor = "text-yellow-500",
    strongTextColor = "text-green-500",
    className,
  } = field;

  // Get classes from config (no hardcoding!)
  const containerGapClass = getSpacingClassName("gap", containerGap);
  const labelTextSizeClass = getTextSizeClassName(labelTextSize);
  const suggestionTextSizeClass = getTextSizeClassName(suggestionTextSize);
  const suggestionMarginTopClass = getSpacingClassName(
    "margin",
    suggestionMarginTop,
  );
  const barHeightClass = getHeightClassName(barHeight);

  // Watch password field from form for real-time updates
  const watchedValue = context.form?.watch(watchField);
  const password =
    typeof watchedValue === "string"
      ? watchedValue
      : String(watchedValue || "");

  if (!password) {
    return null;
  }

  // Use shared logic for strength calculation
  const { level, widthPercentage } = calculatePasswordStrength(password);

  // Get colors from config based on level
  const colorClass =
    level === "weak"
      ? weakBgColor
      : level === "fair"
        ? fairBgColor
        : level === "good"
          ? goodBgColor
          : strongBgColor;

  const textColorClass =
    level === "weak"
      ? weakTextColor
      : level === "fair"
        ? fairTextColor
        : level === "good"
          ? goodTextColor
          : strongTextColor;

  const labelText = t(
    `app.user.components.auth.common.passwordStrength.${level}`,
  );

  return (
    <Div
      className={cn("flex flex-col", containerGapClass || "gap-1", className)}
    >
      <Div
        className={cn("flex justify-between", labelTextSizeClass || "text-xs")}
      >
        <Span>
          {t("app.user.components.auth.common.passwordStrength.label")}
        </Span>
        <Span className={textColorClass}>{labelText}</Span>
      </Div>
      <Div
        className={cn(
          barHeightClass,
          "w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden",
        )}
      >
        <Div style={{ width: `${widthPercentage}%` }}>
          <Div
            className={cn("h-full transition-all duration-300", colorClass)}
          />
        </Div>
      </Div>
      {level === "weak" && (
        <P
          className={cn(
            textColorClass,
            suggestionTextSizeClass || "text-xs",
            suggestionMarginTopClass || "mt-1",
          )}
        >
          {t("app.user.components.auth.common.passwordStrength.suggestion")}
        </P>
      )}
    </Div>
  );
}

PasswordStrengthWidget.displayName = "PasswordStrengthWidget";

export default PasswordStrengthWidget;
