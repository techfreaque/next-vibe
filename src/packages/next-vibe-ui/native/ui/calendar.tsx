/**
 * Calendar Component for React Native
 * TODO: Implement full calendar functionality with date selection
 * Currently a placeholder that accepts date props
 */
import React from "react";
import type { ViewProps } from "react-native";
import { Text as RNText, View } from "react-native";

import type { CalendarBaseProps } from "next-vibe-ui/ui/calendar";
import { cn } from "../lib/utils";

// Native calendar props extend base props with native View props
export type CalendarProps = CalendarBaseProps & Omit<ViewProps, 'children'> & {
  children?: React.ReactNode;
};

// Type-safe View with className support (NativeWind)
const StyledView = View as unknown as React.ForwardRefExoticComponent<
  ViewProps & { className?: string } & React.RefAttributes<View>
>;

// Type-safe Text with className support (NativeWind)
const StyledText = RNText as unknown as React.ForwardRefExoticComponent<
  React.ComponentProps<typeof RNText> & { className?: string } & React.RefAttributes<RNText>
>;

export const Calendar = React.forwardRef<View, CalendarProps>(
  ({ className, children, selected, onSelect, mode, disabled, ...props }, ref) => {
    // TODO: Implement onSelect, mode, disabled functionality
    return (
      <StyledView
        ref={ref}
        className={cn(
          "p-3 rounded-md border border-border bg-background",
          className,
        )}
        {...props}
      >
        <StyledText className="text-sm text-muted-foreground text-center">
          {/* TODO: Implement calendar UI */}
          {/* eslint-disable-next-line i18next/no-literal-string -- Placeholder text */}
          {selected ? selected.toLocaleDateString() : "No date selected"}
        </StyledText>
        {children}
      </StyledView>
    );
  },
);

Calendar.displayName = "Calendar";
