import * as TabsPrimitive from "@rn-primitives/tabs";
import * as React from "react";

import { cn } from "../lib/utils";
import { TextClassContext } from "./text";

// Cross-platform types
export interface TabsProps {
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  className?: string;
  children?: React.ReactNode;
}

export interface TabsListProps {
  className?: string;
  children?: React.ReactNode;
}

export interface TabsTriggerProps {
  value: string;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export interface TabsContentProps {
  value: string;
  className?: string;
  children?: React.ReactNode;
}

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  TabsPrimitive.ListRef,
  TabsListProps
>(({ className, children, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "web:inline-flex h-10 native:h-12 items-center justify-center rounded-md bg-muted p-1 native:px-1.5",
      className,
    ) as never}
    {...props}
  >
    {children}
  </TabsPrimitive.List>
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  TabsPrimitive.TriggerRef,
  TabsTriggerProps
>(({ className, value, disabled, children, ...props }, ref) => {
  const { value: selectedValue } = TabsPrimitive.useRootContext();
  return (
    <TextClassContext.Provider
      value={cn(
        "text-sm native:text-base font-medium text-muted-foreground web:transition-all",
        selectedValue === value && "text-foreground",
      )}
    >
      <TabsPrimitive.Trigger
        ref={ref}
        value={value}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center shadow-none web:whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium web:ring-offset-background web:transition-all web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
          disabled && "web:pointer-events-none opacity-50",
          value === selectedValue &&
            "bg-background shadow-lg shadow-foreground/10",
          className,
        ) as never}
        {...props}
      >
        {children}
      </TabsPrimitive.Trigger>
    </TextClassContext.Provider>
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  TabsPrimitive.ContentRef,
  TabsContentProps
>(({ className, value, children, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    value={value}
    className={cn(
      "web:ring-offset-background web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
      className,
    ) as never}
    {...props}
  >
    {children}
  </TabsPrimitive.Content>
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsContent, TabsList, TabsTrigger };
