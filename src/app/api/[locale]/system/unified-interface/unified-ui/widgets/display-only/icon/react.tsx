/**
 * Icon Widget - React implementation
 * Displays an icon from the icon library
 */

"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import {
  getBorderRadiusClassName,
  getContainerSizeClassName,
  getIconSizeClassName,
} from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/widget-helpers";
import type { ReactWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/react-types";
import type { FieldUsageConfig } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";
import { Icon } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";

import type { IconWidgetConfig, IconWidgetSchema } from "./types";

/**
 * Icon Widget - React component
 *
 * Displays an icon with customizable container, size, and style
 */
export function IconWidget<
  TEndpoint extends CreateApiEndpointAny,
  TSchema extends IconWidgetSchema,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "primitive",
>({
  field,
}: ReactWidgetProps<
  TEndpoint,
  IconWidgetConfig<TSchema, TUsage, TSchemaType>
>): JSX.Element {
  const {
    containerSize,
    iconSize,
    borderRadius,
    noHover,
    justifyContent = "center",
    className,
  } = field;

  // Get classes from config
  const iconSizeClass = getIconSizeClassName(iconSize);
  const containerSizeClass = containerSize
    ? getContainerSizeClassName(containerSize)
    : "";
  const borderRadiusClass = getBorderRadiusClassName(borderRadius);

  // JIT-safe justify-content classes mapping
  const justifyClassMap: Record<string, string> = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
  };
  const justifyClass = justifyClassMap[justifyContent] ?? "justify-center";

  if (!field.value) {
    return <></>;
  }
  if (typeof field.value !== "string") {
    // oxlint-disable-next-line oxlint-plugin-i18n/no-literal-string -- Error indicator character
    return <Div className={className}>!</Div>;
  }

  // If no containerSize, render icon without wrapper
  if (!containerSize) {
    return (
      <Icon
        icon={field.value}
        className={cn(iconSizeClass || "h-5 w-5", className)}
      />
    );
  }

  return (
    <Div
      className={cn(
        containerSizeClass,
        borderRadiusClass,
        "bg-muted flex items-center shrink-0",
        justifyClass,
        !noHover && "bg-primary/10 group-hover:bg-primary/20 transition-colors",
        className,
      )}
    >
      <Icon icon={field.value} className={iconSizeClass || "h-5 w-5"} />
    </Div>
  );
}

export default IconWidget;
