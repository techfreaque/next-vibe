/**
 * Slider Component for React Native
 * Uses @rn-primitives/slider
 */
import * as SliderPrimitive from "@rn-primitives/slider";
import React from "react";

import type { SliderProps } from "next-vibe-ui/ui/slider";
import type { WithClassName } from "../lib/types";
import { cn } from "../lib/utils";

// Type-safe wrappers for primitives that accept className at runtime
const StyledSliderRoot = SliderPrimitive.Root as React.ForwardRefExoticComponent<
  WithClassName<React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>> &
    React.RefAttributes<React.ElementRef<typeof SliderPrimitive.Root>>
>;
const StyledSliderTrack = SliderPrimitive.Track as React.ForwardRefExoticComponent<
  WithClassName<React.ComponentPropsWithoutRef<typeof SliderPrimitive.Track>> &
    React.RefAttributes<React.ElementRef<typeof SliderPrimitive.Track>>
>;
const StyledSliderRange = SliderPrimitive.Range as React.ForwardRefExoticComponent<
  WithClassName<React.ComponentPropsWithoutRef<typeof SliderPrimitive.Range>> &
    React.RefAttributes<React.ElementRef<typeof SliderPrimitive.Range>>
>;
const StyledSliderThumb = SliderPrimitive.Thumb as React.ForwardRefExoticComponent<
  WithClassName<React.ComponentPropsWithoutRef<typeof SliderPrimitive.Thumb>> &
    React.RefAttributes<React.ElementRef<typeof SliderPrimitive.Thumb>>
>;

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, ...props }, ref) => {
  return (
    <StyledSliderRoot
      ref={ref}
      {...({
        className: cn(
          "relative flex w-full touch-none select-none items-center",
          className,
        ),
        ...props,
      } as any)}
    >
      <StyledSliderTrack
        {...({
          className:
            "relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20",
        } as any)}
      >
        <StyledSliderRange {...({ className: "absolute h-full bg-primary" } as any)} />
      </StyledSliderTrack>
      <StyledSliderThumb
        {...({
          className:
            "block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        } as any)}
      />
    </StyledSliderRoot>
  );
});

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
