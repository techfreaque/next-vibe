/**
 * Carousel Component for React Native
 * TODO: Implement full carousel with swipe gestures
 * Currently uses ScrollView for horizontal scrolling
 */
import type { ReactNode } from "react";
import React from "react";
import type { ScrollViewProps } from "react-native";
import { ScrollView, View } from "react-native";

import { cn } from "../lib/utils";

interface CarouselProps extends ScrollViewProps {
  children: ReactNode;
  className?: string;
}

export const Carousel = React.forwardRef<ScrollView, CarouselProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <ScrollView
        ref={ref}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        className={cn("flex flex-row", className)}
        {...props}
      >
        {children}
      </ScrollView>
    );
  },
);

Carousel.displayName = "Carousel";

interface CarouselItemProps {
  children: ReactNode;
  className?: string;
}

export const CarouselItem = React.forwardRef<View, CarouselItemProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <View ref={ref} className={cn("shrink-0", className)} {...props}>
        {children}
      </View>
    );
  },
);

CarouselItem.displayName = "CarouselItem";

export const CarouselContent = Carousel;
export const CarouselPrevious = View;
export const CarouselNext = View;
