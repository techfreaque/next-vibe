"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
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
import {
  useWidgetForm,
  useWidgetLocale,
} from "../../_shared/use-widget-context";
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
}: ReactWidgetProps<
  TEndpoint,
  TUsage,
  PasswordStrengthWidgetConfig<TUsage, "widget", TEndpoint>
>): JSX.Element | null {
  const locale = useWidgetLocale();
  const form = useWidgetForm();
  const { t: globalT } = simpleT(locale);
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
  const watchedValue = form?.watch(watchField);
  const password =
    typeof watchedValue === "string"
      ? watchedValue
      : String(watchedValue || "");

  if (!password) {
    return <></>;
  }

  // Use shared logic for strength calculation
  const { level, widthPercentage, missing } =
    calculatePasswordStrength(password);

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

  const labelText = globalT(
    `app.user.components.auth.common.passwordStrength.${level}`,
  );

  return (
    <Div
      className={cn("flex flex-col", containerGapClass || "gap-2", className)}
    >
      <Div
        className={cn(
          "flex justify-between items-center",
          labelTextSizeClass || "text-sm",
        )}
      >
        <Span className="font-medium">
          {globalT("app.user.components.auth.common.passwordStrength.label")}
        </Span>
        <Span className={cn("font-semibold", textColorClass)}>{labelText}</Span>
      </Div>
      <Div
        className={cn(
          barHeightClass || "h-2",
          "w-full bg-muted rounded-full overflow-hidden",
        )}
      >
        <Div
          style={{
            width: `${widthPercentage}%`,
            height: "100%",
            transitionProperty: "all",
            transitionDuration: "300ms",
            backgroundColor: colorClass,
          }}
        />
      </Div>
      {level !== "strong" && (
        <Div
          className={cn(
            "flex flex-col gap-1",
            suggestionTextSizeClass || "text-sm",
            suggestionMarginTopClass || "mt-1",
            "text-muted-foreground",
          )}
        >
          {missing.minLength && (
            <Div className="flex items-center gap-2">
              <Span className="text-red-500">
                {globalT(
                  "app.user.components.auth.passwordStrength.requirement.minLength.icon",
                )}
              </Span>
              <Span>
                {globalT(
                  "app.user.components.auth.passwordStrength.requirement.minLength.text",
                )}
              </Span>
            </Div>
          )}
          {missing.uppercase && (
            <Div className="flex items-center gap-2">
              <Span className="text-red-500">
                {globalT(
                  "app.user.components.auth.passwordStrength.requirement.uppercase.icon",
                )}
              </Span>
              <Span>
                {globalT(
                  "app.user.components.auth.passwordStrength.requirement.uppercase.text",
                )}
              </Span>
            </Div>
          )}
          {missing.lowercase && (
            <Div className="flex items-center gap-2">
              <Span className="text-red-500">
                {globalT(
                  "app.user.components.auth.passwordStrength.requirement.lowercase.icon",
                )}
              </Span>
              <Span>
                {globalT(
                  "app.user.components.auth.passwordStrength.requirement.lowercase.text",
                )}
              </Span>
            </Div>
          )}
          {missing.number && (
            <Div className="flex items-center gap-2">
              <Span className="text-red-500">
                {globalT(
                  "app.user.components.auth.passwordStrength.requirement.number.icon",
                )}
              </Span>
              <Span>
                {globalT(
                  "app.user.components.auth.passwordStrength.requirement.number.text",
                )}
              </Span>
            </Div>
          )}
          {missing.special && (
            <Div className="flex items-center gap-2">
              <Span className="text-yellow-500">
                {globalT(
                  "app.user.components.auth.passwordStrength.requirement.special.icon",
                )}
              </Span>
              <Span>
                {globalT(
                  "app.user.components.auth.passwordStrength.requirement.special.text",
                )}
              </Span>
            </Div>
          )}
        </Div>
      )}
    </Div>
  );
}

PasswordStrengthWidget.displayName = "PasswordStrengthWidget";

export default PasswordStrengthWidget;
