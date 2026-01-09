"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import { simpleT } from "@/i18n/core/shared";

import type { WidgetType } from "../../../shared/types/enums";
import { calculatePasswordStrength } from "../../../shared/widgets/logic/password-strength";
import type { ReactWidgetProps } from "../../../shared/widgets/types";
import {
  getHeightClassName,
  getSpacingClassName,
  getTextSizeClassName,
} from "../../../shared/widgets/utils/widget-helpers";

/**
 * Displays a visual indicator of password strength.
 * Watches the password form field and updates in real-time.
 */
export function PasswordStrengthWidget<const TKey extends string>({
  field,
  context,
  className,
  form,
}: ReactWidgetProps<typeof WidgetType.PASSWORD_STRENGTH, TKey>): JSX.Element | null {
  const { t } = simpleT(context.locale);
  const {
    watchField = "password",
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
  } = field.ui;

  // Get classes from config (no hardcoding!)
  const containerGapClass = getSpacingClassName("gap", containerGap);
  const labelTextSizeClass = getTextSizeClassName(labelTextSize);
  const suggestionTextSizeClass = getTextSizeClassName(suggestionTextSize);
  const suggestionMarginTopClass = getSpacingClassName("margin", suggestionMarginTop);
  const barHeightClass = getHeightClassName(barHeight);

  const password = form?.watch(watchField) as string | undefined;

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

  const labelText = t(`app.user.components.auth.common.passwordStrength.${level}`);

  return (
    <Div className={cn("flex flex-col", containerGapClass || "gap-1", className)}>
      <Div className={cn("flex justify-between", labelTextSizeClass || "text-xs")}>
        <Span>{t("app.user.components.auth.common.passwordStrength.label")}</Span>
        <Span className={textColorClass}>{labelText}</Span>
      </Div>
      <Div
        className={cn(
          barHeightClass,
          "w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden",
        )}
      >
        <Div style={{ width: `${widthPercentage}%` }}>
          <Div className={cn("h-full transition-all duration-300", colorClass)} />
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
