import * as TabsPrimitive from "@rn-primitives/tabs";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";

import type {
  TabsContentProps,
  TabsListProps,
  TabsProps,
  TabsTriggerProps,
} from "@/packages/next-vibe-ui/web/ui/tabs";

import { applyStyleType } from "../../web/utils/style-type";
import { convertCSSToViewStyle } from "../utils/style-converter";
import { TextClassContext } from "./text";

const StyledTabsList = TabsPrimitive.List;
const StyledTabsTrigger = TabsPrimitive.Trigger;
const StyledTabsContent = TabsPrimitive.Content;

function Tabs({
  children,
  value,
  onValueChange,
  defaultValue,
  orientation,
  activationMode,
  className,
  style,
}: TabsProps): React.JSX.Element {
  // Handle controlled/uncontrolled state with defaultValue
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const handleValueChange = React.useCallback(
    (newValue: string) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    },
    [isControlled, onValueChange],
  );

  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <TabsPrimitive.Root
      value={currentValue}
      onValueChange={handleValueChange}
      orientation={orientation}
      activationMode={activationMode}
      {...applyStyleType({
        nativeStyle,
        className,
      })}
    >
      {children}
    </TabsPrimitive.Root>
  );
}
Tabs.displayName = TabsPrimitive.Root.displayName;

function TabsList({ className, style, children }: TabsListProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <StyledTabsList
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "inline-flex flex-row h-12 items-center justify-center rounded-lg bg-muted/50 p-1 px-1.5 border border-border",
          className,
        ),
      })}
    >
      {children}
    </StyledTabsList>
  );
}
TabsList.displayName = TabsPrimitive.List.displayName;

function TabsTrigger({
  className,
  style,
  value,
  disabled,
  children,
}: TabsTriggerProps): React.JSX.Element {
  const { value: selectedValue } = TabsPrimitive.useRootContext();
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <TextClassContext.Provider
      value={cn(
        "text-sm text-base font-medium text-muted-foreground transition-all",
        selectedValue === value && "text-primary-foreground",
      )}
    >
      <StyledTabsTrigger
        value={value}
        disabled={disabled}
        {...applyStyleType({
          nativeStyle,
          className: cn(
            "inline-flex flex-row items-center justify-center shadow-none whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            disabled && "pointer-events-none opacity-50",
            value === selectedValue && "bg-primary shadow-sm",
            className,
          ),
        })}
      >
        {children}
      </StyledTabsTrigger>
    </TextClassContext.Provider>
  );
}
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

function TabsContent({ className, style, value, children }: TabsContentProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <StyledTabsContent
      value={value}
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className,
        ),
      })}
    >
      {children}
    </StyledTabsContent>
  );
}
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsContent, TabsList, TabsTrigger };
