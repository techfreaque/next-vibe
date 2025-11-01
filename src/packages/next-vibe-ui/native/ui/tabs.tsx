import * as TabsPrimitive from "@rn-primitives/tabs";
import * as React from "react";

// Import cross-platform types from web (source of truth)
import type {
  TabsProps,
  TabsListProps,
  TabsTriggerProps,
  TabsContentProps,
} from "next-vibe-ui/ui/tabs";

import type { WithClassName } from "../lib/types";
import { cn } from "../lib/utils";
import { TextClassContext } from "./text";

// Type-safe wrappers for primitives
const StyledTabsList = TabsPrimitive.List as React.ForwardRefExoticComponent<
  WithClassName<React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>> &
    React.RefAttributes<React.ElementRef<typeof TabsPrimitive.List>>
>;
const StyledTabsTrigger = TabsPrimitive.Trigger as React.ForwardRefExoticComponent<
  WithClassName<React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>> &
    React.RefAttributes<React.ElementRef<typeof TabsPrimitive.Trigger>>
>;
const StyledTabsContent = TabsPrimitive.Content as React.ForwardRefExoticComponent<
  WithClassName<React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>> &
    React.RefAttributes<React.ElementRef<typeof TabsPrimitive.Content>>
>;

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  TabsPrimitive.ListRef,
  TabsListProps
>(({ className, children, ...props }, ref) => (
  <StyledTabsList
    ref={ref}
    className={cn(
      "web:inline-flex h-10 native:h-12 items-center justify-center rounded-md bg-muted p-1 native:px-1.5",
      className,
    )}
    {...props}
  >
    {children}
  </StyledTabsList>
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
      <StyledTabsTrigger
        ref={ref}
        value={value}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center shadow-none web:whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium web:ring-offset-background web:transition-all web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
          disabled && "web:pointer-events-none opacity-50",
          value === selectedValue &&
            "bg-background shadow-lg shadow-foreground/10",
          className,
        )}
        {...props}
      >
        {children}
      </StyledTabsTrigger>
    </TextClassContext.Provider>
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  TabsPrimitive.ContentRef,
  TabsContentProps
>(({ className, value, children, ...props }, ref) => (
  <StyledTabsContent
    ref={ref}
    value={value}
    className={cn(
      "web:ring-offset-background web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  >
    {children}
  </StyledTabsContent>
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsContent, TabsList, TabsTrigger };
