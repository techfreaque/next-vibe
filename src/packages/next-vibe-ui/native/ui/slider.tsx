/**
 * Slider Component for React Native
 * Uses @rn-primitives/slider
 */
import * as SliderPrimitive from "@rn-primitives/slider";
import React from "react";

import type { SliderProps } from "next-vibe-ui/ui/slider";
import { cn } from "../lib/utils";
import { styled } from "nativewind";

// Styled components using nativewind
const StyledSliderRoot = styled(SliderPrimitive.Root);
const StyledSliderTrack = styled(SliderPrimitive.Track);
const StyledSliderRange = styled(SliderPrimitive.Range);
const StyledSliderThumb = styled(SliderPrimitive.Thumb);

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, value, defaultValue, onValueChange, ...props }, ref) => {
  return (
    <StyledSliderRoot
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className,
      )}
      value={value?.[0] ?? defaultValue?.[0] ?? 0}
      onValueChange={onValueChange}
      {...props}
    >
      <StyledSliderTrack
        className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20"
      >
        <StyledSliderRange
          className={"absolute h-full bg-primary"}
        />
      </StyledSliderTrack>
      <StyledSliderThumb
        className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
      />
    </StyledSliderRoot>
  );
});

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
