"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";

// Cross-platform types
export interface TabsRootProps {
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  orientation?: "horizontal" | "vertical";
  activationMode?: "automatic" | "manual";
  className?: string;
  children?: React.ReactNode;
  dir?: "ltr" | "rtl";
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
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export interface TabsContentProps {
  value: string;
  className?: string;
  children?: React.ReactNode;
}

export function Tabs({ children, ...props }: TabsRootProps): React.JSX.Element {
  return <TabsPrimitive.Root {...props}>{children}</TabsPrimitive.Root>;
}
Tabs.displayName = TabsPrimitive.Root.displayName;

export function TabsList({ className, children, ...props }: TabsListProps): React.JSX.Element {
  return (
    <TabsPrimitive.List
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-lg bg-muted/50 p-1 text-muted-foreground border border-border",
        className,
      )}
      {...props}
    >
      {children}
    </TabsPrimitive.List>
  );
}
TabsList.displayName = TabsPrimitive.List.displayName;

export function TabsTrigger({ className, children, ...props }: TabsTriggerProps): React.JSX.Element {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-muted/80 hover:text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm",
        className,
      )}
      {...props}
    >
      {children}
    </TabsPrimitive.Trigger>
  );
}
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

export function TabsContent({ className, children, ...props }: TabsContentProps): React.JSX.Element {
  return (
    <TabsPrimitive.Content
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
      {...props}
    >
      {children}
    </TabsPrimitive.Content>
  );
}
TabsContent.displayName = TabsPrimitive.Content.displayName;
