/**
 * Calendar Component for React Native
 * TODO: Implement full calendar functionality with date selection
 * Currently a placeholder that accepts date props
 */
import React from "react";
import { Text as RNText, View } from "react-native";
import type { ViewProps } from "react-native";
import { styled } from "nativewind";

import type { CalendarBaseProps } from "@/packages/next-vibe-ui/web/ui/calendar";
import { cn } from "next-vibe/shared/utils/utils";

// Native calendar props extend base props with native View props
export type CalendarProps = CalendarBaseProps &
  Omit<ViewProps, "children"> & {
    children?: React.ReactNode;
  };

// Type-safe View with className support (NativeWind)
const StyledView = styled(View, { className: "style" });

// Type-safe Text with className support (NativeWind)
// eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax
const StyledText = RNText as unknown as React.ForwardRefExoticComponent<
  React.ComponentProps<typeof RNText> & {
    className?: string;
  } & React.RefAttributes<RNText>
>;

export function Calendar({
  className,
  children,
  selected,
  onSelect: _onSelect,
  mode: _mode,
  disabled: _disabled,
  ...props
}: CalendarProps): React.JSX.Element {
  // TODO: Implement onSelect, mode, disabled functionality
  return (
    <StyledView
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
}

Calendar.displayName = "Calendar";
