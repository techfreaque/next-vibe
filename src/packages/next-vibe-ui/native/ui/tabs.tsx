import * as TabsPrimitive from "@rn-primitives/tabs";
import { styled } from "nativewind";
import * as React from "react";

// Import cross-platform types from web (source of truth)
import type {
  TabsListProps,
  TabsTriggerProps,
  TabsContentProps,
} from "@/packages/next-vibe-ui/web/ui/tabs";

import { cn } from "next-vibe/shared/utils/utils";
import { TextClassContext } from "./text";

// Type-safe wrappers for primitives
const StyledTabsList = styled(TabsPrimitive.List);
const StyledTabsTrigger = styled(TabsPrimitive.Trigger);
const StyledTabsContent = styled(TabsPrimitive.Content);

const Tabs = TabsPrimitive.Root;

const TabsList = ({
  className,
  children,
  ...props
}: TabsListProps): JSX.Element => (
  <StyledTabsList
    className={cn(
      "web:inline-flex h-11 native:h-12 items-center justify-center rounded-lg bg-muted/50 p-1 native:px-1.5 border border-border",
      className,
    )}
    {...props}
  >
    {children}
  </StyledTabsList>
);
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = ({
  className,
  value,
  disabled,
  children,
  ...props
}: TabsTriggerProps): JSX.Element => {
  const { value: selectedValue } = TabsPrimitive.useRootContext();
  return (
    <TextClassContext.Provider
      value={cn(
        "text-sm native:text-base font-medium text-muted-foreground web:transition-all",
        selectedValue === value && "text-primary-foreground",
      )}
    >
      <StyledTabsTrigger
        value={value}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center shadow-none web:whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium web:ring-offset-background web:transition-all web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
          disabled && "web:pointer-events-none opacity-50",
          value === selectedValue &&
            "bg-primary shadow-sm",
          className,
        )}
        {...props}
      >
        {children}
      </StyledTabsTrigger>
    </TextClassContext.Provider>
  );
};
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = ({
  className,
  value,
  children,
  ...props
}: TabsContentProps): JSX.Element => (
  <StyledTabsContent
    value={value}
    className={cn(
      "web:ring-offset-background web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  >
    {children}
  </StyledTabsContent>
);
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsContent, TabsList, TabsTrigger };
