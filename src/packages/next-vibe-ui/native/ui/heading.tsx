import * as React from "react";
import { Text as RNText } from "react-native";

import { cn } from "../lib/utils";

// Native: Use Text component with different sizes for headings
export const H1 = React.forwardRef<
  React.ElementRef<typeof RNText>,
  React.ComponentPropsWithoutRef<typeof RNText>
>(({ className, ...props }, ref) => (
  <RNText
    ref={ref}
    className={cn("text-4xl font-bold text-foreground", className)}
    {...props}
  />
));

H1.displayName = "H1";

export const H2 = React.forwardRef<
  React.ElementRef<typeof RNText>,
  React.ComponentPropsWithoutRef<typeof RNText>
>(({ className, ...props }, ref) => (
  <RNText
    ref={ref}
    className={cn("text-3xl font-bold text-foreground", className)}
    {...props}
  />
));

H2.displayName = "H2";

export const H3 = React.forwardRef<
  React.ElementRef<typeof RNText>,
  React.ComponentPropsWithoutRef<typeof RNText>
>(({ className, ...props }, ref) => (
  <RNText
    ref={ref}
    className={cn("text-2xl font-bold text-foreground", className)}
    {...props}
  />
));

H3.displayName = "H3";

export const H4 = React.forwardRef<
  React.ElementRef<typeof RNText>,
  React.ComponentPropsWithoutRef<typeof RNText>
>(({ className, ...props }, ref) => (
  <RNText
    ref={ref}
    className={cn("text-xl font-bold text-foreground", className)}
    {...props}
  />
));

H4.displayName = "H4";

export const H5 = React.forwardRef<
  React.ElementRef<typeof RNText>,
  React.ComponentPropsWithoutRef<typeof RNText>
>(({ className, ...props }, ref) => (
  <RNText
    ref={ref}
    className={cn("text-lg font-bold text-foreground", className)}
    {...props}
  />
));

H5.displayName = "H5";

export const H6 = React.forwardRef<
  React.ElementRef<typeof RNText>,
  React.ComponentPropsWithoutRef<typeof RNText>
>(({ className, ...props }, ref) => (
  <RNText
    ref={ref}
    className={cn("text-base font-bold text-foreground", className)}
    {...props}
  />
));

H6.displayName = "H6";

