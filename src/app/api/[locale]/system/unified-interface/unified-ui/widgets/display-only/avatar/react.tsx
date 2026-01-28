"use client";

import { cn } from "next-vibe/shared/utils";
import { Avatar, AvatarFallback, AvatarImage } from "next-vibe-ui/ui/avatar";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import { getTextSizeClassName } from "../../../../shared/widgets/utils/widget-helpers";
import type { ReactWidgetProps } from "../../_shared/react-types";
import type { FieldUsageConfig } from "../../_shared/types";
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
interface AvatarData {
  src?: string;
  fallback?: string;
  alt?: string;
}

export default function AvatarWidget<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TUsage extends FieldUsageConfig,
>({
  field,
  context,
}: ReactWidgetProps<TEndpoint, AvatarWidgetConfig<TKey, TUsage>>): JSX.Element {
  const {
    src: configSrc,
    alt: altKey,
    fallback: configFallback,
    size,
    fallbackSize,
    className,
  } = field;

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

  // Get avatar data from field value
  const avatarData = field.value as AvatarData | undefined;

  // Use config values as fallback, then data values
  const src = avatarData?.src || configSrc;
  const fallback = avatarData?.fallback || configFallback || "?";
  const alt = altKey ? context.t(altKey) : avatarData?.alt || "Avatar";

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
