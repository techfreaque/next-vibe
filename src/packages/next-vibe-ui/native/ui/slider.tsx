/**
 * Slider Component for React Native
 * Uses @rn-primitives/slider
 */
import * as SliderPrimitive from "@rn-primitives/slider";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";

import type {
  SliderRangeProps,
  SliderRootProps,
  SliderThumbProps,
  SliderTrackProps,
} from "@/packages/next-vibe-ui/web/ui/slider";

import { applyStyleType } from "../../web/utils/style-type";
import { convertCSSToViewStyle } from "../utils/style-converter";

// Re-export all types from web
export type {
  SliderRangeProps,
  SliderRootProps,
  SliderThumbProps,
  SliderTrackProps,
};

export function Slider({
  value,
  defaultValue = [0],
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  style,
  className,
  children,
}: SliderRootProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  // Native primitive expects (value: number[]) => void for onChange
  // but we need to convert our single value to array for cross-platform compatibility
  const handleNativeValueChange = React.useCallback(
    (newValues: number[]) => {
      onValueChange?.(newValues);
    },
    [onValueChange],
  );

  return (
    <SliderPrimitive.Root
      value={value?.[0] ?? defaultValue[0]}
      onValueChange={handleNativeValueChange}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      {...applyStyleType({ nativeStyle, className })}
    >
      {children}
    </SliderPrimitive.Root>
  );
}
Slider.displayName = SliderPrimitive.Root.displayName;

export function SliderTrack({
  className,
  style,
  children,
  ...props
}: SliderTrackProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <SliderPrimitive.Track
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20",
          className,
        ),
      })}
      {...props}
    >
      {children}
    </SliderPrimitive.Track>
  );
}
SliderTrack.displayName = SliderPrimitive.Track.displayName;

export function SliderRange({
  className,
  style,
  ...props
}: SliderRangeProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <SliderPrimitive.Range
      {...applyStyleType({
        nativeStyle,
        className: cn("absolute h-full bg-primary", className),
      })}
      {...props}
    />
  );
}
SliderRange.displayName = SliderPrimitive.Range.displayName;

export function SliderThumb({
  className,
  style,
  ...props
}: SliderThumbProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <SliderPrimitive.Thumb
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          className,
        ),
      })}
      {...props}
    />
  );
}
SliderThumb.displayName = SliderPrimitive.Thumb.displayName;
