/**
 * Carousel Component for React Native
 * TODO: Implement full carousel with swipe gestures
 * Currently uses ScrollView for horizontal scrolling
 */
import type { ReactNode } from "react";
import React from "react";
import type { ScrollViewProps } from "react-native";
import { ScrollView, View } from "react-native";
import { styled } from "nativewind";

import type {
  CarouselProps as WebCarouselProps,
  CarouselItemProps,
} from "@/packages/next-vibe-ui/web/ui/carousel";
import { cn } from "next-vibe/shared/utils/utils";

// Native carousel uses subset of web props, with ScrollView native props
export type CarouselProps = Pick<WebCarouselProps, "orientation"> & {
  children: ReactNode;
  className?: string;
} & Omit<ScrollViewProps, "horizontal" | "children">;

// Type-safe ScrollView with className support (NativeWind)
const StyledScrollView = styled(ScrollView);

// Type-safe View with className support (NativeWind)
const StyledView = styled(View);

export function Carousel({
  className,
  children,
  orientation = "horizontal",
  ...props
}: CarouselProps): React.JSX.Element {
  return (
    <StyledScrollView
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
}

Carousel.displayName = "Carousel";

export function CarouselItem({
  className,
  children,
}: CarouselItemProps): React.JSX.Element {
  return (
    <StyledView className={cn("shrink-0", className)}>{children}</StyledView>
  );
}

CarouselItem.displayName = "CarouselItem";

// Cross-platform interface
export type CarouselContentProps = CarouselProps;

export const CarouselContent = Carousel;

// Note: CarouselPrevious, CarouselNext are simplified for React Native
// Web version uses Button components with full interactivity
export const CarouselPrevious = View;
export const CarouselNext = View;
