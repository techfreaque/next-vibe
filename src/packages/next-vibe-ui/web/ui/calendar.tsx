/* eslint-disable i18next/no-literal-string */
"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "next-vibe/shared/utils/utils";
import type { ComponentProps, JSX, ReactNode } from "react";
import { DayPicker, type DayPickerProps } from "react-day-picker";

import type { StyleType } from "../utils/style-type";
import { buttonVariants } from "./button";

// Type for date range matching react-day-picker's DateRange
export interface DateRange {
  from: Date | undefined;
  to?: Date | undefined;
}

// Base props shared across all modes
interface CalendarPropsBase {
  children?: ReactNode;
  disabled?: boolean | ((date: Date) => boolean);
  showOutsideDays?: boolean;
  classNames?: ComponentProps<typeof DayPicker>["classNames"];
  components?: ComponentProps<typeof DayPicker>["components"];
}

// Single mode props
type CalendarPropsSingle = CalendarPropsBase & {
  mode?: "single";
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
} & StyleType;

// Range mode props
type CalendarPropsRange = CalendarPropsBase & {
  mode: "range";
  selected?: DateRange;
  onSelect?: (range: DateRange | undefined) => void;
} & StyleType;

// Multiple mode props
type CalendarPropsMultiple = CalendarPropsBase & {
  mode: "multiple";
  selected?: Date[];
  onSelect?: (dates: Date[] | undefined) => void;
} & StyleType;

// Union of all possible prop combinations
export type CalendarProps =
  | CalendarPropsSingle
  | CalendarPropsRange
  | CalendarPropsMultiple;

// Shared className configuration
const getClassNames = (
  classNames?: ComponentProps<typeof DayPicker>["classNames"],
): ComponentProps<typeof DayPicker>["classNames"] => ({
  months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
  month: "space-y-4",
  caption: "flex justify-center pt-1 relative items-center",
  caption_label: "text-sm font-medium",
  nav: "space-x-1 flex items-center",
  nav_button: cn(
    buttonVariants({ variant: "outline" }),
    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
  ),
  nav_button_previous: "absolute left-1",
  nav_button_next: "absolute right-1",
  table: "w-full border-collapse space-y-1",
  head_row: "flex",
  head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
  row: "flex w-full mt-2",
  cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
  day: cn(
    buttonVariants({ variant: "ghost" }),
    "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
  ),
  day_range_end: "day-range-end",
  day_selected:
    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
  day_today: "bg-accent text-accent-foreground",
  day_outside:
    "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
  day_disabled: "text-muted-foreground opacity-50",
  day_range_middle:
    "aria-selected:bg-accent aria-selected:text-accent-foreground",
  day_hidden: "invisible",
  ...classNames,
});

// Shared components configuration
const getComponents = (
  components?: ComponentProps<typeof DayPicker>["components"],
): ComponentProps<typeof DayPicker>["components"] => ({
  Chevron: (props: {
    className?: string;
    size?: number;
    disabled?: boolean;
    orientation?: "left" | "right" | "up" | "down";
  }): JSX.Element => {
    const Icon =
      props.orientation === "left" ? ChevronLeftIcon : ChevronRightIcon;
    return <Icon className="h-4 w-4" />;
  },
  ...components,
});

// Function overloads to properly type each mode
function Calendar(props: CalendarPropsSingle): JSX.Element;
function Calendar(props: CalendarPropsRange): JSX.Element;
function Calendar(props: CalendarPropsMultiple): JSX.Element;
function Calendar(props: CalendarProps): JSX.Element {
  const {
    className,
    style,
    classNames,
    showOutsideDays = true,
    disabled,
    components,
  } = props;

  const sharedProps = {
    disabled,
    showOutsideDays,
    className: cn("p-3", className),
    style,
    classNames: getClassNames(classNames),
    components: getComponents(components),
  };

  // Handle each mode explicitly with proper typing
  if (props.mode === "range") {
    // TypeScript now knows props is CalendarPropsRange
    const dayPickerProps: DayPickerProps = {
      ...sharedProps,
      mode: "range",
      selected: props.selected,
      onSelect: props.onSelect,
    };
    return <DayPicker {...dayPickerProps} />;
  }

  if (props.mode === "multiple") {
    // TypeScript now knows props is CalendarPropsMultiple
    const dayPickerProps: DayPickerProps = {
      ...sharedProps,
      mode: "multiple",
      selected: props.selected,
      onSelect: props.onSelect,
    };
    return <DayPicker {...dayPickerProps} />;
  }

  // Default to single mode - TypeScript knows props is CalendarPropsSingle
  const dayPickerProps: DayPickerProps = {
    ...sharedProps,
    mode: "single",
    selected: props.selected,
    onSelect: props.onSelect,
  };
  return <DayPicker {...dayPickerProps} />;
}

Calendar.displayName = "Calendar";

export { Calendar };
