"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import type { WidgetType } from "../../../shared/types/enums";
import type { ReactWidgetProps } from "../../../shared/widgets/types";
import {
  getBorderRadiusClassName,
  getContainerSizeClassName,
  getIconSizeClassName,
} from "../../../shared/widgets/utils/widget-helpers";
import { Icon, ICON_REGISTRY, type IconKey } from "../../icons";

/**
 * Type guard to check if string is valid IconKey
 */
function isIconKey(value: string): value is IconKey {
  return value in ICON_REGISTRY;
}

/**
 * Renders an icon with character browser card styling.
 */
export function IconWidget<const TKey extends string>({
  value,
  field,
  className,
}: ReactWidgetProps<typeof WidgetType.ICON, TKey>): JSX.Element {
  const { containerSize, iconSize, borderRadius, noHover, justifyContent = "center" } = field.ui;

  // Get classes from config (no hardcoding!)
  const iconSizeClass = getIconSizeClassName(iconSize);
  const containerSizeClass = containerSize ? getContainerSizeClassName(containerSize) : "";
  const borderRadiusClass = getBorderRadiusClassName(borderRadius);

  // JIT-safe justify-content classes mapping
  const justifyClassMap: Record<string, string> = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
  };
  const justifyClass = justifyClassMap[justifyContent] ?? "justify-center";

  if (!value) {
    return <></>;
  }
  if (typeof value !== "string") {
    // eslint-disable-next-line i18next/no-literal-string, oxlint-plugin-i18n/no-literal-string
    return <Div className={className}>!</Div>;
  }

  if (!isIconKey(value)) {
    // eslint-disable-next-line i18next/no-literal-string, oxlint-plugin-i18n/no-literal-string
    return <Div className={className}>?</Div>;
  }

  // If no containerSize, render icon without wrapper
  if (!containerSize) {
    return <Icon icon={value} className={cn(iconSizeClass || "h-5 w-5", className)} />;
  }

  return (
    <Div
      className={cn(
        containerSizeClass,
        borderRadiusClass,
        "bg-muted flex items-center shrink-0",
        justifyClass,
        !noHover && "group-hover:bg-primary/10 transition-colors",
        className,
      )}
    >
      <Icon icon={value} className={iconSizeClass || "h-5 w-5"} />
    </Div>
  );
}

IconWidget.displayName = "IconWidget";
