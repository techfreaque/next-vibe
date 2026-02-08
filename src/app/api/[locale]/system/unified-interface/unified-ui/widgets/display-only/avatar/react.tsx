"use client";

import { cn } from "next-vibe/shared/utils";
import { Avatar, AvatarFallback, AvatarImage } from "next-vibe-ui/ui/avatar";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import type { StringWidgetSchema } from "../../../../shared/widgets/utils/schema-constraints";
import { getTextSizeClassName } from "../../../../shared/widgets/utils/widget-helpers";
import type {
  ReactRequestResponseWidgetProps,
  ReactStaticWidgetProps,
} from "../../_shared/react-types";
import type { FieldUsageConfig } from "../../_shared/types";
import {
  useWidgetForm,
  useWidgetTranslation,
} from "../../_shared/use-widget-context";
import type { AvatarWidgetConfig } from "./types";

/**
 * Avatar Widget - Displays user avatars with image and fallback support
 *
 * Renders circular avatar with image URL and fallback initials.
 * Automatically translates alt text values.
 *
 * Features:
 * - Image display with automatic loading and error handling
 * - Fallback text (initials) when image unavailable
 * - Accessible with alt text support
 * - Circular styling with proper aspect ratio
 * - Graceful degradation to initials
 *
 * UI Config Options:
 * - src: Image URL or field name containing URL
 * - alt: Translation key for alt text (TKey)
 * - fallback: Fallback text/initials (e.g., "JD", "?")
 *
 * Data Format:
 * - string: Direct image URL
 * - object: { src: string, fallback?: string, alt?: string }
 *   - src: Image URL (not translated)
 *   - fallback: Initials or fallback text (not translated)
 *   - alt: Alt text (translated via context.t)
 * - null/undefined: Shows fallback initials
 *
 * @param value - Avatar data (URL or avatar object)
 * @param field - Field definition with UI config
 * @param context - Rendering context with translator
 * @param className - Optional CSS classes
 */

export default function AvatarWidget<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchema extends StringWidgetSchema,
>(
  props:
    | ReactStaticWidgetProps<
        TEndpoint,
        TUsage,
        AvatarWidgetConfig<TKey, TUsage, "widget", never>
      >
    | ReactRequestResponseWidgetProps<
        TEndpoint,
        TUsage,
        AvatarWidgetConfig<TKey, TUsage, "primitive", TSchema>
      >,
): JSX.Element {
  const t = useWidgetTranslation();
  const form = useWidgetForm();
  const { field } = props;
  const fieldName = "fieldName" in props ? props.fieldName : undefined;
  const {
    src: configSrc,
    alt: altKey,
    fallback: configFallback,
    size,
    fallbackSize,
    className,
  } = field;
  const usage = "usage" in field ? field.usage : undefined;

  // Get value from form for request fields, otherwise from field.value
  let value: typeof field.value | undefined;
  if (usage?.request && fieldName && form) {
    value = form.watch(fieldName);
    if (!value && "value" in field) {
      value = field.value;
    }
  } else if ("value" in field) {
    value = field.value;
  }

  // Get classes from config (no hardcoding!)
  const fallbackSizeClass = getTextSizeClassName(fallbackSize);

  // Avatar size mapping
  const avatarSizeClass =
    size === "xs"
      ? "h-6 w-6"
      : size === "sm"
        ? "h-8 w-8"
        : size === "lg"
          ? "h-12 w-12"
          : size === "xl"
            ? "h-16 w-16"
            : "h-10 w-10";

  // Use config values as fallback, then data values
  const src = value?.src || configSrc;
  const fallback = value?.fallback || configFallback || "?";
  const alt = altKey ? t(altKey) : value?.alt || "Avatar";

  return (
    <Avatar className={cn(avatarSizeClass, className)}>
      {src && <AvatarImage src={src} alt={alt} />}
      <AvatarFallback
        className={cn("font-medium", fallbackSizeClass || "text-sm")}
      >
        {fallback}
      </AvatarFallback>
    </Avatar>
  );
}

AvatarWidget.displayName = "AvatarWidget";
