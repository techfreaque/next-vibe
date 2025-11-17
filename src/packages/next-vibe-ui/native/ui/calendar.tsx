import * as React from "react";
import { Text as RNText, View } from "react-native";
import { styled } from "nativewind";

import { cn } from "next-vibe/shared/utils/utils";
import { convertCSSToViewStyle } from "../utils/style-converter";
import { applyStyleType } from "../../web/utils/style-type";

// Import ALL types from web version (web is source of truth)
import type {
  CalendarProps,
  DateRange,
} from "@/packages/next-vibe-ui/web/ui/calendar";

// Re-export types for consistency
export type { CalendarProps, DateRange };

const StyledView = styled(View, { className: "style" });
const StyledText = styled(RNText, { className: "style" });

/**
 * Calendar component for React Native
 * Currently a placeholder - full implementation requires a date picker library
 *
 * @param props - CalendarProps from web version
 * @returns Placeholder calendar component
 */
export function Calendar({
  className,
  style,
  children,
  selected,
  onSelect: _onSelect,
  mode: _mode,
  disabled: _disabled,
  showOutsideDays: _showOutsideDays,
  classNames: _classNames,
  components: _components,
}: CalendarProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  // TODO: Implement full calendar functionality with a React Native date picker library
  // Consider: @react-native-community/datetimepicker or react-native-calendars

  const getDisplayText = (): string => {
    if (!selected) {
      return "No date selected";
    }

    // Single mode
    if (selected instanceof Date) {
      return selected.toLocaleDateString();
    }

    // Multiple mode
    if (Array.isArray(selected)) {
      return `${selected.length} dates selected`;
    }

    // Range mode - check for DateRange object
    const dateRange = selected as DateRange;
    if (dateRange.from instanceof Date) {
      if (dateRange.to instanceof Date) {
        return `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`;
      }
      return dateRange.from.toLocaleDateString();
    }

    return "No date selected";
  };

  return (
    <StyledView
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "p-3 rounded-md border border-border bg-background",
          className,
        ),
      })}
    >
      <StyledText className="text-sm text-muted-foreground text-center">
        {/* eslint-disable-next-line i18next/no-literal-string -- Placeholder text */}
        {getDisplayText()}
      </StyledText>
      {children}
    </StyledView>
  );
}

Calendar.displayName = "Calendar";
