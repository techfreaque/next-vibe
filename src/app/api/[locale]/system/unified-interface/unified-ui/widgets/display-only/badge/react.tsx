/**
 * Badge Widget - Platform-agnostic React implementation
 * Displays badges with variant-based styling
 */

"use client";

import { cn } from "next-vibe/shared/utils";
import { Badge } from "next-vibe-ui/ui/badge";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type {
  ReactRequestResponseWidgetProps,
  ReactStaticWidgetProps,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/react-types";
import type { FieldUsageConfig } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";
import {
  useWidgetForm,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import { findEnumLabel } from "./shared";
import type { BadgeWidgetConfig, BadgeWidgetSchema } from "./types";

/**
 * Badge Widget - Displays badges with variant-based styling
 *
 * Renders a badge with color-coded styling based on semantic meaning or custom variants.
 * Supports multiple data sources with consistent rendering across platforms.
 *
 * UI Config Options:
 * - text: Static translation key for fixed badge text
 * - enumOptions: Array of { value, label } for enum value mapping (labels are translation keys)
 * - variant: "default" | "success" | "warning" | "error" | "info" (semantic styling)
 *
 * Data Sources (priority order):
 * 1. Static text from field.text
 * 2. Enum label from field.enumOptions matched by value
 * 3. Badge data from value (string, number, or { text, variant, icon })
 *
 * Variant Mapping:
 * - error → destructive (red)
 * - info → secondary (blue/gray)
 * - success → success (green)
 * - warning → outline (bordered yellow)
 * - default → default (standard badge)
 *
 * Data Formats Supported:
 * - string: Direct text (translated if translation key exists)
 * - number: Numeric display (converted to string)
 * - { text: string, variant?: string, icon?: string }: Full badge object
 * - null/undefined: Shows "—" placeholder
 */
/**
 * Get size className for badge
 */
function getBadgeSizeClass(size?: string): string {
  switch (size) {
    case "xs":
      return "text-[10px] px-1.5 py-0";
    case "sm":
      return "text-[11px] px-2 py-0.5";
    case "lg":
      return "text-sm px-3 py-1";
    case "base":
    default:
      return ""; // Use default badge styling
  }
}

export function BadgeWidget<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "primitive" | "widget",
  TSchema extends TSchemaType extends "primitive" ? BadgeWidgetSchema : never,
>(
  props:
    | ReactRequestResponseWidgetProps<
        TEndpoint,
        TUsage,
        BadgeWidgetConfig<TKey, TSchema, TUsage, "primitive">
      >
    | ReactStaticWidgetProps<
        TEndpoint,
        TUsage,
        BadgeWidgetConfig<TKey, TSchema, TUsage, "widget">
      >,
): JSX.Element {
  const { field } = props;
  const fieldName = "fieldName" in props ? props.fieldName : undefined;
  const t = useWidgetTranslation();
  const form = useWidgetForm();
  const {
    text: staticText,
    enumOptions,
    variant: badgeVariant = "outline",
    size,
    className,
  } = field;
  const usage = "usage" in field ? field.usage : undefined;

  const sizeClass = getBadgeSizeClass(size);

  // Get value from form for request fields, otherwise from value
  let value: typeof field.value | undefined;
  if (usage?.request && fieldName && form) {
    value = form.watch(fieldName);
    if (!value && "value" in field) {
      value = field.value;
    }
  } else if ("value" in field) {
    value = field.value;
  }

  // value is properly typed from schema - no assertions needed
  // Handle enum options - find matching label for value
  if (enumOptions) {
    const enumLabel = findEnumLabel(value, enumOptions, t);
    if (enumLabel) {
      return (
        <Badge variant={badgeVariant} className={cn(sizeClass, className)}>
          {enumLabel}
        </Badge>
      );
    }
  }

  // Handle null/empty case
  if (!value) {
    // Handle static text from UI config
    if (staticText) {
      const translatedText = t(staticText);

      return (
        <Badge variant={badgeVariant} className={cn(sizeClass, className)}>
          {translatedText}
        </Badge>
      );
    }
    return <></>;
  }

  // Handle string value as translation key
  if (typeof value === "string") {
    const translatedText = t(value);

    return (
      <Badge variant={badgeVariant} className={cn(sizeClass, className)}>
        {translatedText}
      </Badge>
    );
  }

  return (
    <Badge variant={badgeVariant} className={cn(sizeClass, className)}>
      {value}
    </Badge>
  );
}

BadgeWidget.displayName = "BadgeWidget";

export default BadgeWidget;
