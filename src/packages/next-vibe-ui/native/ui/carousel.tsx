/**
 * Carousel Component for React Native
 * TODO: Implement full carousel with swipe gestures
 * Currently uses ScrollView for horizontal scrolling
 */
import type { ReactNode } from "react";
import React from "react";
import type { ScrollViewProps, ViewProps } from "react-native";
import { ScrollView, View } from "react-native";

import type { CarouselProps as WebCarouselProps } from "next-vibe-ui/ui/carousel";
import { cn } from "../lib/utils";

// Native carousel uses subset of web props, with ScrollView native props
export type CarouselProps = Pick<WebCarouselProps, "orientation"> & {
  children: ReactNode;
  className?: string;
} & Omit<ScrollViewProps, "horizontal" | "children">;

// Type-safe ScrollView with className support (NativeWind)
const StyledScrollView = ScrollView as unknown as React.ForwardRefExoticComponent<
  ScrollViewProps & { className?: string } & React.RefAttributes<ScrollView>
>;

// Type-safe View with className support (NativeWind)
const StyledView = View as unknown as React.ForwardRefExoticComponent<
  ViewProps & { className?: string } & React.RefAttributes<View>
>;

export const Carousel = React.forwardRef<ScrollView, CarouselProps>(
  ({ className, children, orientation = "horizontal", ...props }, ref) => {
    return (
      <StyledScrollView
        ref={ref}
        horizontal={orientation === "horizontal"}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        className={cn(
          orientation === "horizontal" ? "flex flex-row" : "flex flex-col",
          className,
        )}
        {...props}
      >
        {children}
      </StyledScrollView>
    );
  },
);

Carousel.displayName = "Carousel";

// Cross-platform interface
export interface CarouselItemProps {
  children: ReactNode;
  className?: string;
}

export const CarouselItem = React.forwardRef<View, CarouselItemProps>(
  ({ className, children }, ref) => {
    return (
      <StyledView ref={ref} className={cn("shrink-0", className)}>
        {children}
      </StyledView>
    );
  },
);

CarouselItem.displayName = "CarouselItem";

// Cross-platform interface
export type CarouselContentProps = CarouselProps;

export const CarouselContent = Carousel;

// Note: CarouselPrevious, CarouselNext are simplified for React Native
// Web version uses Button components with full interactivity
export const CarouselPrevious = View;
export const CarouselNext = View;
