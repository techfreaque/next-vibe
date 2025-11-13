import React from "react";
import { Text as RNText, View } from "react-native";
import { styled } from "nativewind";
import type { CalendarProps } from "@/packages/next-vibe-ui/web/ui/calendar";
import { cn } from "next-vibe/shared/utils/utils";

const StyledView = styled(View, { className: "style" });
const StyledText = styled(RNText, { className: "style" });

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
