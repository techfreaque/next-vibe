/**
 * Calendar Component for React Native
 * TODO: Implement full calendar functionality with date selection
 * Currently a placeholder that accepts date props
 */
import type { ReactNode } from "react";
import React from "react";
import { Text as RNText, View } from "react-native";

import { cn } from "../lib/utils";

interface CalendarProps {
  children?: ReactNode;
  className?: string;
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  mode?: "single" | "multiple" | "range";
  disabled?: boolean;
}

export const Calendar = React.forwardRef<View, CalendarProps>(
  ({ className, children, selected, ...props }, ref) => {
    // TODO: Implement onSelect, mode, disabled functionality
    return (
      <View
        ref={ref}
        className={cn(
          "p-3 rounded-md border border-border bg-background",
          className,
        )}
        {...props}
      >
        <RNText className="text-sm text-muted-foreground text-center">
          {/* TODO: Implement calendar UI */}
          {/* eslint-disable-next-line i18next/no-literal-string -- Placeholder text */}
          {selected ? selected.toLocaleDateString() : "No date selected"}
        </RNText>
        {children}
      </View>
    );
  },
);

Calendar.displayName = "Calendar";
