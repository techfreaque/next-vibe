/**
 * Icon Widget - React implementation
 * Displays an icon from the icon library
 */

"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { type JSX, useMemo } from "react";

import type {
  IconSchemaNullishType,
  IconSchemaOptionalType,
  IconSchemaType,
} from "@/app/api/[locale]/shared/types/common.schema";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import {
  getBorderRadiusClassName,
  getContainerSizeClassName,
  getIconSizeClassName,
} from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/widget-helpers";
import type {
  ReactRequestResponseWidgetProps,
  ReactStaticWidgetProps,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/react-types";
import type { FieldUsageConfig } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";
import { useWidgetForm } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import {
  Icon,
  type IconKey,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";

import type { IconWidgetConfig } from "./types";

/**
 * Icon Widget - React component
 *
 * Displays an icon with customizable container, size, and style
 */
export function IconWidget<
  TEndpoint extends CreateApiEndpointAny,
  TUsage extends FieldUsageConfig,
>(
  props:
    | ReactStaticWidgetProps<
        TEndpoint,
        TUsage,
        IconWidgetConfig<never, TUsage, "widget">
      >
    | ReactRequestResponseWidgetProps<
        TEndpoint,
        TUsage,
        IconWidgetConfig<
          IconSchemaType | IconSchemaOptionalType | IconSchemaNullishType,
          TUsage,
          "primitive"
        >
      >,
): JSX.Element {
  const { field } = props;
  const fieldName = "fieldName" in props ? props.fieldName : undefined;
  const form = useWidgetForm();
  const {
    containerSize,
    iconSize,
    borderRadius,
    noHover,
    justifyContent = "center",
    className: fieldClassName,
    icon: staticIcon,
    getClassName,
    parentValue,
  } = field;
  const usage = "usage" in field ? field.usage : undefined;

  // Get value from form for request fields, otherwise from field.value
  const value =
    "value" in field
      ? usage?.request && fieldName && form
        ? form.watch(fieldName) || field.value
        : field.value
      : undefined;

  return useMemo(() => {
    const icon: IconKey | undefined = value || staticIcon;

    // Apply dynamic className callback if present
    const dynamicClassName = getClassName
      ? getClassName(value, parentValue)
      : "";
    const mergedClassName = cn(fieldClassName, dynamicClassName);

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

    if (!icon) {
      return <></>;
    }
    if (typeof icon !== "string") {
      // oxlint-disable-next-line oxlint-plugin-i18n/no-literal-string -- Error indicator character
      return <Div className={mergedClassName}>!</Div>;
    }

    // If no containerSize, render icon without wrapper
    if (!containerSize) {
      return (
        <Icon
          icon={icon}
          className={cn("flex", iconSizeClass || "h-5 w-5", mergedClassName)}
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
          !noHover &&
            "bg-primary/10 group-hover:bg-primary/20 transition-colors",
          mergedClassName,
        )}
      >
        <Icon icon={icon} className={iconSizeClass || "h-5 w-5"} />
      </Div>
    );
  }, [
    value,
    parentValue,
    borderRadius,
    containerSize,
    fieldClassName,
    iconSize,
    justifyContent,
    noHover,
    staticIcon,
    getClassName,
  ]);
}

export default IconWidget;
