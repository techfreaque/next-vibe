"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";

import type { StyleType } from "../utils/style-type";

// Tabs
export type TabsProps = {
  children?: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  orientation?: "horizontal" | "vertical";
  activationMode?: "automatic" | "manual";
  dir?: "ltr" | "rtl";
} & StyleType;

export function Tabs({ children, ...props }: TabsProps): React.JSX.Element {
  return <TabsPrimitive.Root {...props}>{children}</TabsPrimitive.Root>;
}
Tabs.displayName = TabsPrimitive.Root.displayName;

// TabsList
export type TabsListProps = {
  children?: React.ReactNode;
} & StyleType;

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

// TabsTrigger
export type TabsTriggerProps = {
  children?: React.ReactNode;
  value: string;
  disabled?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
} & StyleType;

export function TabsTrigger({
  className,
  children,
  ...props
}: TabsTriggerProps): React.JSX.Element {
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

// TabsContent
export type TabsContentProps = {
  children?: React.ReactNode;
  value: string;
} & StyleType;

export function TabsContent({
  className,
  children,
  ...props
}: TabsContentProps): React.JSX.Element {
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
