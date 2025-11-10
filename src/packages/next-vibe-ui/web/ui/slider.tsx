"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";

// Cross-platform types
export interface SliderRootProps {
  className?: string;
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  children?: React.ReactNode;
}

export interface SliderTrackProps {
  className?: string;
  children?: React.ReactNode;
}

export interface SliderRangeProps {
  className?: string;
}

export interface SliderThumbProps {
  className?: string;
}

export function Slider({ className, value, defaultValue, onValueChange, min, max, step, disabled, children, ...props }: SliderRootProps): React.JSX.Element {
  return (
    <SliderPrimitive.Root
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className,
      )}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      {...props}
    >
      {children}
    </SliderPrimitive.Root>
  );
}
Slider.displayName = SliderPrimitive.Root.displayName;

export function SliderTrack({ className, children, ...props }: SliderTrackProps): React.JSX.Element {
  return (
    <SliderPrimitive.Track
      className={cn(
        "relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20",
        className,
      )}
      {...props}
    >
      {children}
    </SliderPrimitive.Track>
  );
}
SliderTrack.displayName = SliderPrimitive.Track.displayName;

export function SliderRange({ className, ...props }: SliderRangeProps): React.JSX.Element {
  return (
    <SliderPrimitive.Range
      className={cn("absolute h-full bg-primary", className)}
      {...props}
    />
  );
}
SliderRange.displayName = SliderPrimitive.Range.displayName;

export function SliderThumb({ className, ...props }: SliderThumbProps): React.JSX.Element {
  return (
    <SliderPrimitive.Thumb
      className={cn(
        "block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
SliderThumb.displayName = SliderPrimitive.Thumb.displayName;
